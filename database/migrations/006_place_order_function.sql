-- Atomic order placement.
--
-- Everything an order touches happens in one transaction: stock is checked
-- and decremented, the order and its items are written, and a readable order
-- number is issued. Prices are read from the products table, never from the
-- client, so a tampered request cannot change what an order costs.

create sequence if not exists public.order_number_seq start 1001;

create or replace function public.place_order(
  p_customer jsonb,
  p_items    jsonb,
  p_payment  text default 'cash'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id     uuid := gen_random_uuid();
  v_order_number text;
  v_subtotal     numeric(10, 2) := 0;
  v_delivery     numeric(10, 2) := 0;
  v_item         jsonb;
  v_product      public.products%rowtype;
  v_quantity     integer;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Your bag is empty.' using errcode = 'P0001';
  end if;

  if coalesce(p_customer ->> 'name', '') = '' then
    raise exception 'A name is required.' using errcode = 'P0001';
  end if;

  if coalesce(p_customer ->> 'phone', '') = '' then
    raise exception 'A phone number is required.' using errcode = 'P0001';
  end if;

  v_order_number := 'HS-' || nextval('public.order_number_seq')::text;

  -- Lock each product row so two students cannot buy the same last packet.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := coalesce((v_item ->> 'quantity')::integer, 0);

    if v_quantity <= 0 then
      raise exception 'Quantity must be at least 1.' using errcode = 'P0001';
    end if;

    select * into v_product
    from public.products
    where id = (v_item ->> 'product_id')
    for update;

    if not found then
      raise exception 'Product % is no longer available.',
        (v_item ->> 'product_id') using errcode = 'P0001';
    end if;

    if not v_product.active then
      raise exception '% is no longer available.', v_product.name
        using errcode = 'P0001';
    end if;

    if v_product.stock < v_quantity then
      raise exception 'Only % left of %.', v_product.stock, v_product.name
        using errcode = 'P0001';
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  end loop;

  insert into public.orders (
    id, order_number, user_id, customer_name, student_id, batch,
    phone, dorm, room, note, payment, status, subtotal, delivery, total
  )
  values (
    v_order_id,
    v_order_number,
    auth.uid(),
    p_customer ->> 'name',
    coalesce(p_customer ->> 'student_id', ''),
    coalesce(p_customer ->> 'batch', ''),
    p_customer ->> 'phone',
    coalesce(p_customer ->> 'dorm', ''),
    coalesce(p_customer ->> 'room', ''),
    coalesce(p_customer ->> 'note', ''),
    coalesce(p_payment, 'cash'),
    'pending',
    v_subtotal,
    v_delivery,
    v_subtotal + v_delivery
  );

  -- Second pass: write the lines and take the stock.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;

    select * into v_product
    from public.products
    where id = (v_item ->> 'product_id');

    insert into public.order_items
      (order_id, product_id, name, image, price, quantity)
    values
      (v_order_id, v_product.id, v_product.name, v_product.image,
       v_product.price, v_quantity);

    update public.products
    set stock = stock - v_quantity
    where id = v_product.id;
  end loop;

  return jsonb_build_object(
    'id',           v_order_id,
    'order_number', v_order_number,
    'status',       'pending',
    'subtotal',     v_subtotal,
    'delivery',     v_delivery,
    'total',        v_subtotal + v_delivery
  );
end;
$$;

-- Guests check out straight from the QR code, so anon needs to call this.
grant execute on function public.place_order(jsonb, jsonb, text) to anon, authenticated;
