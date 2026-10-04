import { query } from "../../lib/db";
import { paystackReady, initializePayment } from "../../lib/paystack";
import { randomUUID } from "crypto";

// POST /api/pay { order_id, email } -> starts Paystack payment (or reports keys-missing).
// GET  /api/pay?ref=X -> verifies and marks hold captured.
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { order_id, email } = req.body || {};
    const o = await query("SELECT * FROM orders WHERE id=$1", [order_id]);
    if (!o.rows.length) return res.status(404).json({ error: "no-order" });
    if (!paystackReady()) {
      return res.status(200).json({ mode: "local-hold", message: "Add PAYSTACK_SECRET_KEY for live payments. Hold recorded locally.", total_held: o.rows[0].total_held });
    }
    const ref = `HG-${randomUUID().slice(0, 8)}`;
    const init = await initializePayment({ email, amountKobo: Math.round(Number(o.rows[0].total_held) * 100), reference: ref });
    await query("UPDATE payment_holds SET gateway_ref=$1 WHERE order_id=$2", [ref, order_id]);
    return res.status(200).json({ mode: "paystack", authorization_url: init.data.authorization_url, reference: ref });
  }
  const { ref } = req.query;
  if (!ref) return res.status(400).json({ error: "ref required" });
  if (!paystackReady()) return res.status(200).json({ mode: "local-hold" });
  const { verifyPayment } = await import("../../lib/paystack");
  const v = await verifyPayment(ref);
  if (v.data?.status === "success") {
    await query("UPDATE payment_holds SET status='captured' WHERE gateway_ref=$1", [ref]);
    return res.status(200).json({ ok: true, amount: v.data.amount / 100 });
  }
  return res.status(402).json({ ok: false, status: v.data?.status });
}
