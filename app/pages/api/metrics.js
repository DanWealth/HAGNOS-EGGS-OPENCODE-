import { query } from "../../lib/db";

// Phase 8: pilot metrics vs PRD targets (95% fulfillment, <2% breakage).
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
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
  });
}
