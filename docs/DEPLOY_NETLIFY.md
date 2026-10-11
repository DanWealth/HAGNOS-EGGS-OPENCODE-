# Deploy to Netlify (public link) — local Docker stays for daily work

## Why a hosted database is required
Netlify cannot reach the Postgres inside your Docker. Use a free hosted
Postgres (Neon free tier) for the live site; keep local Docker for development.

## A. Create the database (10 mins)
1. Go to **neon.tech** → Sign up → **Create project** (region closest to Lagos/EU).
2. Copy the **connection string** (`postgres://user:pass@host/db`).
3. Apply our schema once: open Neon's **SQL Editor**, paste the full contents of
   `db/schema.sql`, `db/auth-schema.sql`, `db/migrations/001_payment_notifications.sql`,
   `db/migrations/002_hub_onboarding.sql` — Run each.
4. In `db/schema.sql` spirit, also run: `CREATE SEQUENCE IF NOT EXISTS order_no_seq START WITH 200;`

## B. Connect Netlify (10 mins)
1. Go to **app.netlify.com** → Sign up (use **Continue with GitHub**).
2. **Add new site → Import an existing project** → pick
   `DanWealth/HAGNOS-EGGS-OPENCODE-`.
3. Build settings are read from `netlify.toml` automatically (base `app`).
4. Before deploying, open **Site settings → Environment variables** and add
   every line from `app/.env.example` with REAL values, except:
   - `DATABASE_URL` = your Neon connection string from step A2.
   - `BETTER_AUTH_URL` = your site URL (after first deploy, e.g.
     `https://hagnos-eggs.netlify.app`; update it, then redeploy).
   - `BETTER_AUTH_SECRET` = a fresh long random string (do NOT reuse local).
   - `ORDER_WINDOW_OVERRIDE` = `false`.
5. **Deploys** → **Trigger deploy**. First build takes ~3 minutes.

## C. Free domain
Netlify gives `https://YOUR-SITE.netlify.app` free forever.
Rename it: **Site settings → General → Site details → Change site name**
(e.g. `hagnos-eggs` → `https://hagnos-eggs.netlify.app`).

## D. Auto-deploy when YOU want
- Default: every `git push` to `main` rebuilds the site (~2 mins). Nothing to press.
- Manual only: **Deploys → Trigger deploy → Deploy site**.
- To pause auto-deploy: **Site settings → Build & deploy → Auto publishing → Off**.

## E. Paystack + callbacks
Set Paystack dashboard **callback/test webhook** to
`https://YOUR-SITE.netlify.app/order` so buyers return to the live site
after paying. Keep localhost for local tests.

## What stays local
Docker Compose remains your daily driver (free, offline, full data control).
Push to GitHub when a feature is proven locally — Netlify follows automatically.
