# Hak Shop

A QR-accessible snack store for university dorms. Students scan a code, browse,
add to a bag and send an order; staff manage orders, products and stock from an
admin area.

- `frontend/` — Next.js storefront and admin UI (this is the app)
- `database/` — SQL schema, migrations and seeds for Supabase
- `backend/` — Express scaffold, unused; Supabase is the backend
- `scripts/` — operational utilities such as QR generation

## Setup

### 1. Install

```bash
npm install
```

### 2. Create the database

The app reads and writes through Supabase. Open your project's **SQL Editor**,
paste the whole of `database/setup.sql` and run it once. It is idempotent, so
running it again is safe.

That creates:

| Object | Purpose |
| --- | --- |
| `profiles` | Store profile per auth user, with a `customer`/`admin` role |
| `products` | The catalog, seeded with 31 snacks and drinks |
| `orders`, `order_items` | Orders, including guest orders |
| `place_order()` | Places an order atomically: checks stock, prices it from the products table, decrements stock |
| RLS policies | Public may read the catalog and place orders; only owners and staff read orders; only staff change products |

### 3. Point the app at your project

```bash
cp .env.example frontend/.env.local
```

Then set the two values from **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Both are public by design — they ship in the browser bundle. Row level
security is what protects the data, which is why every table has policies.
Never put the `service_role` key in this file.

### 4. Make yourself an admin

Register through the app at `/auth/register`, then run
`database/seeds/001_admin_user.sql` with your email. `/admin` is closed to
everyone else.

## Running

```bash
npm run dev -w frontend
```

Then open http://localhost:3200.

For a production build:

```bash
npm run build -w frontend && npm run start -w frontend
```

## Before the database exists

The storefront still works. When the tables are missing or unreachable, the
catalog falls back to the seed list in `frontend/data/products.ts` and orders
are recorded on the device instead of being sent. The admin pages say plainly
when they are showing seed data.

## Editing the schema

`database/setup.sql` is generated. Edit the files in `database/migrations/`,
then rebuild it:

```bash
./database/build-setup.sh
```
