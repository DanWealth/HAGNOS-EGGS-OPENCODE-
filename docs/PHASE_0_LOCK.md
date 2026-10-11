# Phase 0 — Requirements Lock (Hagnos Eggs)

## 0.1 Locked decisions
- Gateway: **Paystack** (authorization/hold Monday, capture/release Tuesday night). Bank-transfer fallback: manual admin confirm.
- Timezone: **Africa/Lagos** for cutoff, jobs, display.
- MOV: **10 crates** per delivery destination, enforced server-side.
- Cutoff: **Monday 23:59**. PriceWeek immutable after lock.
- Sizes: `Large | Medium | Pullet`.
- Wallet: system-credited only (downgrade diff, breakage), auto-applied first on next checkout, immutable ledger, no MVP withdrawals.
- Database: local PostgreSQL. Storage: Cloudflare R2. Auth: Better Auth (email + phone OTP via Termii/Africa's Talking). Hosting: local Docker Compose. No Supabase/Neon, no Vercel.

## 0.2 Price model (admin sets Wednesday morning; amended from Sunday — see PRD)
- `PriceWeek { week_start, large, medium, pullet, hub_discount_pct, delivery_fee, crate_fee, locked_at }`
- Checkout total = `crates × size_price × (1 - discount) + delivery_fee + (first_order ? crate_fee × crates : 0) − wallet_applied`
- Downgrade credit = `(ordered_unit − delivered_unit) × crates` → WalletTx credit.
- Breakage credit = `cracked_eggs × (delivered_unit_price / eggs_per_crate)` (eggs_per_crate = 30).

## 0.3 Order state machine
`Draft → FundsHeld → Validated → Dispatched → Delivered → Settled`
Branches: `Adjusted` (after admin downgrade), `Failed` (hold failure/validation failure), `Cancelled` (before cutoff only).
- Only `Draft` → cancel allowed. Post-cutoff changes only via admin `adjust`.
- Farm payout only in `Validated`. Customer capture only in `Settled`.

## 0.4 Open items needing your numbers
1. Crate fee ₦ amount? (propose 1,500/crate)
2. Delivery fee flat or per zone? (propose per-zone: Mainland 2,500 / Island 4,000)
3. Hub discount %? (propose 5%)
4. Breakage photo threshold? (propose >6 eggs)
5. Upgrade path allowed? (propose NO for MVP — downgrade only)

Reply with the 5 numbers (or accept proposals) to close Phase 0.

## 0.5 Closure — ACCEPTED (proposals)
1. Crate fee: **₦1,500/crate** ✅
2. Delivery fee: **per-zone — Mainland ₦2,500 / Island ₦4,000** ✅
3. Hub discount: **5%** ✅
4. Breakage photo threshold: **>6 eggs** ✅
5. Upgrade path: **NO for MVP (downgrade only)** ✅
Status: **Phase 0 CLOSED.**
