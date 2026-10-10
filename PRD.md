# PRD Notes — Hagnos Eggs

Source of truth for features: `HAGNOS Eggs PRD.docx`.
This file records tool choices and changes you asked for.

## Local execution (confirmed)
- App runs LOCALLY: Docker container `hagnoseggs-web-1` → http://localhost:3000 (home 200, `/api/health` ok).
- Database runs LOCALLY: Docker container `hagnoseggs-db-1` → Postgres 16 on localhost:5432, 10 tables live.
- No Vercel. No cloud DB. Both start with `docker compose up -d`.

## Accounts handling
- Login: Better Auth (email + phone OTP via Termii/Africa's Talking).
- Roles: buyer_commercial, hub_operator, admin, driver.
- Accounts stored in local Postgres `users` table. No Supabase Auth.

## Files handling
- Delivery photos stored in Cloudflare R2 (S3-compatible) via `photo_url` in `delivery_stops`.
- Design preview files in repo: `design.html`, `design-system-preview.html`, tokens in `design-system/tokens.json`.
- No local photo folders; R2 keys per stop.

## Tool choice I asked about: database host
- Question: Should we use Neon/Supabase (paid cloud) or Postgres on my own computer?
- Decision: **Postgres on my own computer (local, Docker).**
- Why:
  1. Free — no monthly fee.
  2. Works offline on your device.
  3. Same Postgres skills transfer to cloud later.
  4. Your data stays with you during pilot.

## Tool review rationale (all tools)
- Database: local Postgres (free, offline, Docker) over Neon/Supabase (paid, cloud).
- Auth: Better Auth (self-hosted, email+phone) over Supabase Auth (banned per your rule).
- Storage: Cloudflare R2 (cheap S3-style) for photos.
- Hosting: local Docker Compose over Vercel (banned per your rule; pilot stays on your device).
## Changes you told me to make (log)
1. Database → local Postgres. (Free; alternatives: SQLite for dev only, MariaDB, MySQL Community.)
2. Login → Better Auth (email + phone code).
3. File storage → Cloudflare R2.
4. Do NOT use Supabase (or Neon).
5. Do NOT use Vercel — host on local device with Docker.
6. Colors → very bright, sharp contrast (volt, sun, tang, sky, grape, rose).
7. Work one phase at a time; keep talk simple and clear.
8. Window changed to Wed–Mon (Tue delivery-only); prices set Wednesday, Sunday review, locked all week.
9. Landing first with "Place your order"; email-gated buyer studio.
10. Visual studio with Gemini iterative visuals.
