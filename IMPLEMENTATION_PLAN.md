# Hagnos Eggs — Implementation Plan

Source: `HAGNOS Eggs PRD.docx` (Monday lock-in loop, 10-crate MOV, Large/Medium/Pullet, hold-then-release payments, Auto-Offset downgrade to wallet, crate swap, Tuesday dispatch).

Repo state: `main` at `56f363e`, clean, synced with `origin/main`.

---

## Phase 0 — Lock Requirements (3–5 days)

- Payment gateway: recommend Paystack (authorization/hold + transfers). Confirm bank-transfer fallback.
- Price model: base per crate by size + Hub vs Commercial discount + delivery fee + first-time crate fee.
- Define missing flows: failed hold, farm shortfall beyond downgrade, upgrade (Medium→Large) top-up, rejected delivery, truck breakdown.
- Order state machine: `Draft > FundsHeld > Validated > Dispatched > Delivered > Settled` plus `Adjusted`, `Failed/Cancelled`.
- Wallet rules: system-credited only (downgrade, breakage), auto-applied first on checkout, no MVP withdrawals, full immutable ledger.
- Timezone: Africa/Lagos everywhere. Cutoff Monday 23:59 enforced server-side.

## Phase 1 — Design System (1–2 weeks)

- Principles: mobile-first, low-data, large touch targets for shop operators.
- Tokens: bright high-contrast palette — volt `#00E676`, sun `#FFD600`, tang `#FF6D00`, sky `#00B0FF`, grape `#7C4DFF`, rose `#FF2E93`, ink `#0A0A0A` on white/mist; 1 display + 1 body font, 4pt spacing, radii, hard 2px borders + offset shadows for contrast.
- Components: Button, Input/Select, Crate stepper, Size selector, Price-lock banner, Cutoff countdown, Order card, Wallet chip, Crate-swap reminder, Admin price table, Route list, Toasts.
- Screens:
  - Buyer/Hub: onboarding (first-time crate flag), Monday checkout (MOV validator, crate fee, wallet preview), Tuesday tracking, delivery confirm + breakage report, wallet history.
  - Admin: price set, holds dashboard (Monday cash held), auto-offset trigger with preview, dispatch board, settlement view.
  - Driver-lite: stop list, drop confirm + empties collected + photo.
- Prototype Monday loop end-to-end before code.

## Phase 2 — Architecture Decisions

- Stack: Next.js PWA + Node (Nest) or Django API + local PostgreSQL. Monolith MVP, modules: pricing, orders, payments, wallet, logistics, crates, admin.
- Auth: Better Auth (email + phone OTP via Termii / Africa's Talking). Roles: `buyer_commercial, hub_operator, admin, driver`.
- Core tables:
  - `User, Hub, PriceWeek (week, large, medium, pullet, crate_fee, delivery_fee, locked_at)`
  - `Order (user, size_ordered, size_delivered, crates, unit_price, total_held, wallet_applied, status)`
  - `OrderAdjustment, WalletAccount, WalletTx (credit/debit, reason), CrateLedger (issued, returned, owed)`
  - `DeliveryStop, Route, PaymentHold (gateway_ref, amount, captured/released)`
- Payments: authorize/hold Monday, capture/release Tuesday night. Farm payout only after validation. Idempotency keys on webhooks.
- Database: local PostgreSQL (free, open-source). Free local alternatives if needed: SQLite (dev only), MariaDB, MySQL Community. No Neon, no Supabase.
- Storage: Cloudflare R2 (S3-compatible) for delivery photos.
- Hosting: local device for now via Docker Compose (web + API + Postgres). No Vercel.

## Phase 3 — MVP Backend (2–3 weeks)

APIs:
- `POST /price-weeks` (admin lock), `GET /price-weeks/current`
- `POST /orders` (validate MOV>=10, apply wallet first, create hold)
- `POST /orders/:id/adjust` (admin downgrade → diff → wallet credit, atomic)
- `GET /wallet`, `POST /deliveries/:id/confirm` (breakage → wallet credit)
- `POST /dispatch/routes` (zone grouping)

Jobs: cutoff closer, hold-expiry sweeper, settlement releaser, wallet reconciler.
Enforce MOV, cutoff, size enum, price immutability after lock server-side.

## Phase 4 — MVP Frontend (2 weeks, parallel with Phase 3)

- Buyer/Hub PWA with offline-tolerant forms.
- Admin dashboard for holds, adjustments, dispatch, settlement.
- Driver-lite flow with photo + GPS + timestamp.

## Phase 5 — Payments + Auto-Offset + Wallet (1–2 weeks)

- Hold → validate → capture delta + wallet credit in one DB transaction.
- Breakage conversion via price table; photo required above threshold.
- Reconciliation view: held vs captured vs wallet liability.

## Phase 6 — Logistics + Crates (1–2 weeks)

- Zone grouping (e.g. Ikeja / Lekki / Mainland), manual reorder, truck crate-capacity check.
- `CrateLedger`: first order adds fee and issues crates; later orders require empty returns or flag debt.
- Proof of delivery: signature/photo + GPS.

## Phase 7 — Notifications + Ops (1 week)

- SMS/WhatsApp + in-app: Sunday price live, Monday 18:00 cutoff nudge, Tuesday dispatch, delivered + wallet credited.
- Admin alerts: shortfall, delay, breakage >2%.

## Phase 8 — QA + Metrics (1 week)

- Test: MOV reject, cutoff reject, downgrade math, wallet double-spend, webhook replay, timezone edge, offline sync.
- Track: fulfillment % (target 95% Tuesday evening), breakage % (<2%), on-time %, wallet liability, hub reorder rate.

## Phase 9 — Pilot Launch

- 1 Ibadan-Ogun farm + 5–10 Lagos buyers/hubs over 2 Tuesdays. Manual dispatch backup. Freeze prices during pilot.

## Phase 10 — Post-MVP Roadmap

- Subscriptions, multi-farm sourcing, upgrade with top-up, withdrawals, full driver app, demand forecasting, retail walk-in POS for hubs.

---

## Build status (live, local-first)
- Phase 0 CLOSED (`docs/PHASE_0_LOCK.md`): Paystack plan, MOV 10, Mon 23:59, wallet rules, fees (₦1,500 crate, Mainland ₦2,500 / Island ₦4,000, 5% hub discount).
- Phase 1 DONE: bright tokens (`design-system/tokens.json`, volt/sun/tang/sky/grape/rose), `design.html` preview, wired into app via `app/lib/theme.js`.
- Phase 2 DONE (`docs/PHASE_2_ARCHITECTURE.md`, `docker-compose.yml`, `db/schema.sql` + `db/auth-schema.sql`): Next.js + local Postgres (Docker) + Better Auth 1.2.12 + Cloudflare R2. No Vercel, no Supabase/Neon.
- Phase 3 DONE: login (/login, 7-day session), landing (/) + email-gated studio (/order), prices API, order save with MOV + Monday + lock guards, order numbers (HG-000100+).
- Phase 4 DONE: studio Lock button, /admin holds + stats + action buttons, /prices week management, buyer /orders history + updates, /wallet.
- Phase 5 DONE: downgrade auto-offset, breakage credit, wallet-first checkout with fee breakdown.
- Phase 6 DONE: zone routes (500 crates/truck), crate ledger, /driver run view, delivery addresses, R2 photo proof (/api/photos + photo_url).
- Phase 7 DONE (ready-mode): notices feed + Termii SMS hook (activates with SMS_API_KEY); Paystack hold/capture ready (/api/pay verified local-hold, activates with PAYSTACK_SECRET_KEY).
- Phase 8 LIVE: /api/metrics vs 95% / <2% targets + farm demand.
- Phase 9 READY: `docs/PILOT_RUNBOOK.md`. Needs only the 2 keys (template: app/.env.example).
- App: 8 pages (/, /order, /orders, /wallet, /admin, /prices, /login, /driver), all 200. DB: localhost:5432.

## PRD acceptance mapping (new .md PRD §25)
1. Admin sets prices → /prices + POST /api/price-weeks ✅
2. Monday-only orders → weekday guard in POST /api/orders (override: ORDER_WINDOW_OVERRIDE=true) ✅
3. MOV 10 enforced ✅ 4. Size select ✅ 5. Gateway authorize → /api/pay ready (local-hold verified; live capture the moment PAYSTACK_SECRET_KEY is set) ⏳keys-only
6. Hold until validation ✅ 7–9. Adjust + auto calc + wallet credit ✅ 10. Wallet-first checkout ✅
11. First-time crate fee ✅ 12. Swap reminder ✅ 13–14. Admin orders/dispatch ✅
15. Breakage→wallet ✅ 16. Lifecycle (FundsHeld→Validated→Dispatched→Delivered→Settled + Adjusted) ✅
17. Audit (orders/order_no HG-000123, adjustments, wallet_tx→order_id, holds) ✅

## Decisions log (see PRD.md)
Local Postgres (free) · Better Auth (self-hosted) · R2 photos · local Docker · bright palette · one phase at a time.

Build order: 0 → 1 → 2 → 3+4 → 5 → 6 → 7 → 8 → 9.
