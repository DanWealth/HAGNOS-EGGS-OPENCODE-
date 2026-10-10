import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/requireAdmin";

// Phase 8: pilot metrics vs PRD targets (95% fulfillment, <2% breakage).
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  if (!(await requireAdmin(req, res))) return;
  const o = await query("SELECT COUNT(*) AS n, COALESCE(SUM(crates),0) AS crates FROM orders");
  const d = await query("SELECT COUNT(*) AS n FROM orders WHERE status IN ('Delivered','Settled','Adjusted')");
  const eggs = await query("SELECT COALESCE(SUM(cracked_eggs),0) AS cracked, COALESCE(SUM(empty_crates_collected),0) AS empties FROM delivery_stops");
  const w = await query("SELECT COALESCE(SUM(balance),0) AS liability FROM wallet_accounts");
  const total = Number(o.rows[0].n), done = Number(d.rows[0].n);
  const cracked = Number(eggs.rows[0].cracked);
  const deliveredCrates = await query("SELECT COALESCE(SUM(crates),0) AS c FROM orders WHERE status IN ('Delivered','Settled','Adjusted')");
  const demand = await query(
    "SELECT size_ordered, COUNT(*) AS orders, COALESCE(SUM(crates),0) AS crates FROM orders WHERE status IN ('FundsHeld','Validated','Adjusted') GROUP BY size_ordered ORDER BY size_ordered"
  );
  const committed = await query("SELECT COUNT(*) AS hubs, COALESCE(SUM(weekly_volume),0) AS crates FROM users WHERE role='hub_operator' AND COALESCE(approved,TRUE)");
  const bySize = await query("SELECT size_ordered, COUNT(*) AS orders, COALESCE(SUM(crates),0) AS crates FROM orders GROUP BY size_ordered ORDER BY size_ordered");
  const byRole = await query("SELECT u.role, COUNT(*) AS orders, COALESCE(SUM(o.crates),0) AS crates FROM orders o JOIN users u ON u.id=o.user_id GROUP BY u.role");
  const breakagePct = deliveredCrates.rows[0].c > 0 ? (cracked / (Number(deliveredCrates.rows[0].c) * 30)) * 100 : 0;
  res.status(200).json({
    orders: total,
    fulfillmentPct: total ? Math.round((done / total) * 100) : 0,
    targetFulfillmentPct: 95,
    breakagePct: Math.round(breakagePct * 100) / 100,
    targetBreakagePct: 2,
    walletLiability: Number(w.rows[0].liability),
    crates: Number(o.rows[0].crates),
    farmDemand: demand.rows.map((d) => ({ size: d.size_ordered, orders: Number(d.orders), crates: Number(d.crates) })),
    committed: { hubs: Number(committed.rows[0].hubs), crates: Number(committed.rows[0].crates) },
    bySize: bySize.rows.map((d) => ({ size: d.size_ordered, orders: Number(d.orders), crates: Number(d.crates) })),
    byRole: byRole.rows.map((d) => ({ role: d.role, orders: Number(d.orders), crates: Number(d.crates) })),
  });
}
