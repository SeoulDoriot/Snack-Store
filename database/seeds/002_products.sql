-- Seed the snack catalog.
--
-- Generated from frontend/data/products.ts so the seed and the offline
-- fallback data stay identical. Safe to re-run: existing rows are updated.

insert into public.products
  (id, name, description, price, stock, category, image, promo, popular)
values
  ('coca-cola', 'Coca Cola', 'Chilled 330ml can', 0.75, 30, 'Drinks', '🥤', true, true),
  ('nescafe-latte', 'Nescafé Latte', 'Ready to drink 240ml', 1.25, 12, 'Drinks', '☕', false, true),
  ('mineral-water', 'Mineral Water', 'Chilled 500ml bottle', 0.4, 60, 'Drinks', '💧', false, true),
  ('orange-juice', 'Orange Juice', 'No sugar added, 250ml', 1.1, 18, 'Drinks', '🧃', false, false),
  ('iced-tea-lemon', 'Lemon Iced Tea', 'Refreshing 500ml bottle', 0.85, 26, 'Drinks', '🍋', false, false),
  ('milk-choco', 'Chocolate Milk', 'Cold 200ml carton', 0.95, 21, 'Drinks', '🥛', false, false),
  ('energy-drink', 'Energy Drink', 'For late-night study, 250ml', 1.5, 9, 'Drinks', '⚡', false, false),
  ('soy-milk', 'Soy Milk', 'Lightly sweetened, 300ml', 0.9, 15, 'Drinks', '🫘', false, false),
  ('mama-tom-yum', 'Mama Noodles', 'Tom yum shrimp flavour', 0.6, 40, 'Noodles', '🍜', false, true),
  ('indomie-goreng', 'Indomie Goreng', 'Fried noodles, classic', 0.7, 35, 'Noodles', '🍲', false, true),
  ('cup-noodle-chicken', 'Cup Noodle Chicken', 'Just add hot water', 1.0, 22, 'Noodles', '🥡', false, false),
  ('kimchi-ramen', 'Kimchi Ramen', 'Spicy Korean style', 1.3, 14, 'Noodles', '🌶️', false, false),
  ('beef-instant-noodle', 'Beef Noodles', 'Rich beef broth pack', 0.8, 27, 'Noodles', '🐄', false, false),
  ('glass-noodle-soup', 'Glass Noodle Soup', 'Light and quick', 0.95, 0, 'Noodles', '🍥', false, false),
  ('lays-classic', 'Lay''s Classic', 'Salted potato chips', 1.1, 18, 'Chips', '🍟', false, true),
  ('cheese-ring', 'Cheese Ring', 'Crispy corn snack rings', 0.9, 22, 'Chips', '🧀', false, false),
  ('seaweed-crisps', 'Seaweed Crisps', 'Roasted, lightly salted', 1.2, 16, 'Chips', '🍘', false, false),
  ('prawn-crackers', 'Prawn Crackers', 'Crunchy shrimp flavour', 0.85, 24, 'Chips', '🍤', false, false),
  ('tortilla-chips', 'Tortilla Chips', 'Corn chips with a kick', 1.35, 11, 'Chips', '🌽', false, false),
  ('popcorn-butter', 'Butter Popcorn', 'Ready-to-eat 60g bag', 1.0, 19, 'Chips', '🍿', false, false),
  ('oreo-biscuit', 'Oreo Biscuit', 'Chocolate sandwich cookies', 0.8, 24, 'Biscuits', '🍪', false, true),
  ('pocky-strawberry', 'Pocky Strawberry', 'Biscuit sticks, 45g pack', 1.2, 15, 'Biscuits', '🍓', false, false),
  ('cream-wafer', 'Cream Wafer', 'Layered vanilla wafer', 0.65, 30, 'Biscuits', '🧇', false, false),
  ('butter-cookies', 'Butter Cookies', 'Danish style tin, small', 1.6, 8, 'Biscuits', '🥮', false, false),
  ('cracker-salt', 'Salt Crackers', 'Light and crispy', 0.55, 33, 'Biscuits', '🧂', false, false),
  ('snickers', 'Snickers Bar', 'Peanut caramel chocolate', 1.0, 20, 'Sweets', '🍫', false, true),
  ('gummy-bears', 'Gummy Bears', 'Fruit chews, 80g bag', 1.05, 16, 'Sweets', '🐻', true, false),
  ('lollipop-mix', 'Lollipop Mix', 'Assorted fruit flavours', 0.35, 50, 'Sweets', '🍭', false, false),
  ('mochi-red-bean', 'Red Bean Mochi', 'Soft rice cake, 4 pieces', 1.45, 10, 'Sweets', '🍡', false, false),
  ('donut-sugar', 'Sugar Donut', 'Baked fresh this morning', 0.9, 12, 'Sweets', '🍩', false, false),
  ('ice-cream-cup', 'Ice Cream Cup', 'Vanilla, 100ml', 1.25, 0, 'Sweets', '🍨', false, false)
on conflict (id) do update set
  name        = excluded.name,
  description = excluded.description,
  price       = excluded.price,
  category    = excluded.category,
  image       = excluded.image,
  promo       = excluded.promo,
  popular     = excluded.popular;
