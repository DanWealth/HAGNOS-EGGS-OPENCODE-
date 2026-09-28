# Phase 2 — Base Setup (Simple Guide)

## What we picked
- App: Next.js (one app for buyers, hubs, and admin).
- Code: TypeScript.
- Login: Better Auth (email + phone code).
- Database: Postgres on your own computer.
- Files/photos: Cloudflare R2.
- Hosting: your own computer with Docker. No Vercel. No Supabase.

## Parts of the app
1. `pricing` — Sunday prices.
2. `orders` — Monday orders.
3. `payments` — hold money Monday, take it Tuesday.
4. `wallet` — extra money goes here.
5. `logistics` — truck routes.
6. `crates` — crate count.
7. `admin` — your control screen.

## How it runs on your computer
- `db` — Postgres database.
- `web` — the app you open in the browser.
- All start with one command: `docker compose up`.

## Next steps
- Phase 3 will build the tables and login.
- You only need Docker installed for now.
