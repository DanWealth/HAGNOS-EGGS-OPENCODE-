import { query } from "../../lib/db";
import { notify } from "../../lib/notify";

// Buyer cancels their own order while funds are still held (pre-cutoff).
// Cutoff releases holds of cancelled orders automatically.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { order_id, email, phone } = req.body || {};
  if (!order_id || (!email && !phone)) return res.status(400).json({ error: "order_id and email or phone required" });
  const digits = String(phone || "").replace(/\D/g, "");
  const tel = /^0\d{10}$/.test(digits) ? `234${digits.slice(1)}` : digits || null;
  const o = email
    ? await query(
      "SELECT o.id, o.status, o.user_id, o.order_no FROM orders o JOIN users u ON u.id=o.user_id WHERE o.id=$1 AND LOWER(u.email)=LOWER($2)",
      [order_id, email]
    )
    : await query(
      "SELECT o.id, o.status, o.user_id, o.order_no FROM orders o JOIN users u ON u.id=o.user_id WHERE o.id=$1 AND u.phone=$2",
      [order_id, tel]
    );
  if (!o.rows.length) return res.status(404).json({ error: "no-order" });
  if (o.rows[0].status !== "FundsHeld") return res.status(409).json({ error: "too-late", message: "Only unvalidated orders can be cancelled." });
  await query("UPDATE orders SET status='Cancelled' WHERE id=$1", [order_id]);
  await query("UPDATE payment_holds SET status='released' WHERE order_id=$1 AND status='held'", [order_id]);
  await notify(o.rows[0].user_id, "order_cancelled", `Order ${o.rows[0].order_no} cancelled. Hold released.`);
  res.status(200).json({ status: "Cancelled" });
}
