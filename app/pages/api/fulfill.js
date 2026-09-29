import { query } from "../../lib/db";

// Tuesday morning: validate supply for an order (FundsHeld -> Validated).
// Tuesday dispatch: Validated/Adjusted -> Dispatched.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { order_id, action } = req.body || {};
  const o = await query("SELECT * FROM orders WHERE id=$1", [order_id]);
  if (!o.rows.length) return res.status(404).json({ error: "no-order" });
  const st = o.rows[0].status;
  if (action === "validate" && st === "FundsHeld") {
    await query("UPDATE orders SET status='Validated' WHERE id=$1", [order_id]);
    return res.status(200).json({ status: "Validated" });
  }
  if (action === "dispatch" && (st === "Validated" || st === "Adjusted")) {
    await query("UPDATE orders SET status='Dispatched' WHERE id=$1", [order_id]);
    return res.status(200).json({ status: "Dispatched" });
  }
  return res.status(400).json({ error: "bad-transition", from: st });
}
