import { query } from "../../lib/db";

// GET /api/track?no=HG-000116 -> full lifecycle timeline for one order.
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const { no } = req.query;
  if (!no) return res.status(400).json({ error: "order number required" });
  const o = await query("SELECT * FROM orders WHERE order_no=$1", [String(no).toUpperCase()]);
  if (!o.rows.length) return res.status(404).json({ error: "no-order" });
  const order = o.rows[0];
  const holds = await query("SELECT amount, status, gateway_ref FROM payment_holds WHERE order_id=$1 ORDER BY id DESC", [order.id]);
  const adj = await query("SELECT old_total, new_total, wallet_credit, created_at FROM order_adjustments WHERE order_id=$1", [order.id]);
  const tx = await query("SELECT amount, reason, created_at FROM wallet_tx WHERE order_id=$1 ORDER BY created_at", [order.id]);
  const del = await query("SELECT empty_crates_collected, cracked_eggs, photo_url, delivered_at FROM delivery_stops WHERE order_id=$1", [order.id]);
  const flow = ["FundsHeld", "Validated", "Dispatched", "Delivered", "Settled"];
  const reached = order.status === "Adjusted" ? 1 : flow.indexOf(order.status);
  res.status(200).json({
    order: { no: order.order_no, size: order.size_ordered, delivered_size: order.size_delivered, crates: order.crates, total: Number(order.total_held), wallet: Number(order.wallet_applied || 0), status: order.status, zone: order.zone, address: order.address },
    timeline: flow.map((s, i) => ({ step: s, done: order.status === "Adjusted" ? i <= 1 : i <= reached })),
    adjusted: order.status === "Adjusted",
    holds: holds.rows, adjustments: adj.rows, wallet: tx.rows, delivery: del.rows[0] || null,
  });
}
