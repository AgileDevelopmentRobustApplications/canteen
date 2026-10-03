# Canteen

A Node.js application using Prisma and PostgreSQL for canteen users, items, orders,
and order history.

## Setup

- Use Node.js 18 or newer.
- Install dependencies with `npm ci`.
- Copy `.env.example` to `.env` and set `DATABASE_URL` to the target PostgreSQL
  connection string. Never commit `.env`.
- Deploy the schema with `npm run prisma:deploy`.
- Generate the Prisma Client with `npm run prisma:generate`.

`npm start` serves the browser UI on the port provided by the hosting platform
(`3000` by default). The UI's sample orders are stored in browser local storage;
they are a frontend demo and are not persisted to Supabase.

`prisma:deploy` uses `prisma db push` to synchronize the schema directly, then
enables row-level security on `OrderHistory`. Review schema changes before running
against a database containing data; use Prisma migrations if migration history is
required.

The schema is in [`prisma/schema.prisma`](./prisma/schema.prisma). It defines
`User`, `CanteenItem`, `Order`, `OrderItem`, and `OrderHistory`. `OrderHistory` has
RLS enabled without client-facing policies, so it is accessible only through a
trusted server/database role until explicit policies are designed.

## Run

Start the application with `npm start`.
