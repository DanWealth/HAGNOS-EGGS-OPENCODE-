# Hagnos Eggs

B2B egg marketplace: Ibadan–Ogun farms → Lagos buyers (bakeries, supermarkets, hotels, hub operators). Order Wed–Mon, delivery every Tuesday. Prices locked all week.

## Weekly cycle

Wednesday morning — admin sets prices → Wed–Mon — buyers order, funds held → Sunday — admin reviews prices → Monday 23:59 — cutoff → Tuesday AM — farm paid, truck rolls → Tuesday PM — delivery + crate swap → night — funds released, wallet credited.

## Run it (local)

Requirements: Docker Desktop, Node 20+ (for tooling only; the app runs in Docker).

```powershell
cd "C:\Users\DANIEL\Documents\Hagnos Eggs"
docker compose up -d
```

- App: http://localhost:3000 (landing, studio, tracking, wallet, admin, prices, login, driver, visuals)
- DB: local Postgres on `localhost:5432` (14 tables; see `db/schema.sql`, `db/auth-schema.sql`, `db/migrations/`)
- Keys: copy `app/.env.example` to `app/.env` and fill in Paystack (money), Termii (SMS), R2 (photos), Gemini (visuals). Never commit `.env`.
- After changing `.env`: `docker compose up -d --force-recreate web` (restart alone does not reload env files).

## Docs

- Product: `Hagnos Eggs — Product Requirements Document (PRD).md` (26 sections + acceptance criteria)
- Plan + status: `IMPLEMENTATION_PLAN.md`
- Pilot runbook: `docs/PILOT_RUNBOOK.md`
- Decisions: `PRD.md`, `docs/PHASE_0_LOCK.md`, `docs/PHASE_2_ARCHITECTURE.md`

## Rules

Local-first: no Vercel, no Supabase/Neon. Money moves only after server-side verification. Test orders any day with `ORDER_WINDOW_OVERRIDE=true` in `.env` (keep `false` otherwise).
