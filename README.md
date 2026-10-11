# Hagnos Eggs 🥚

B2B egg marketplace: Ibadan–Ogun farms → Lagos buyers, every Tuesday.

**How a week runs:** Wednesday morning admin sets prices (locked all week) → buyers order Wed–Mon → Monday 23:59 cutoff → Tuesday farm procurement, truck dispatch, delivery + crate swap → night settlement, wallet credits roll over.

## Run it locally

1. Install Docker Desktop and start it.
2. Copy `app/.env.example` to `app/.env` and fill the secrets you have (all optional until pilot):
   - `GEMINI_API_KEY` — visual studio (needs billing for images)
   - `PAYSTACK_SECRET_KEY` — live checkout (test key starts with `sk_test_`)
   - `SMS_API_KEY` — Termii order alerts
   - `R2_*` — delivery photo storage
   - `ADMIN_EMAILS` — your login email(s), comma-separated
3. `docker compose up -d` — app at http://localhost:3000, Postgres on :5432.
4. Open the app: landing `/`, studio `/order`, tracking `/track`, visuals `/visuals`, admin `/admin`, `/prices`, `/driver`, `/login`.

## What buyers get

Sizes Large/Medium/Pullet, 10-crate minimum, wallet-first checkout, first-order crate fee, downgrade + breakage auto-credits, order numbers (HG-000100+), live tracking timeline, printable receipts, cancel-while-held.

## Docs

- Full PRD: `Hagnos Eggs — Product Requirements Document (PRD).md`
- Plan + status: `IMPLEMENTATION_PLAN.md`
- Pilot runbook: `docs/PILOT_RUNBOOK.md`
- Decisions: `PRD.md`

No Vercel, no Supabase — local-first by design.
