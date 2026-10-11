import { query } from "../../lib/db";
import { paystackReady, initializePayment } from "../../lib/paystack";
import { verifyPayment } from "../../lib/paystack";
import { notify } from "../../lib/notify";
import { randomUUID } from "crypto";

// POST /api/pay { order_id, email } starts checkout for that buyer's order.
// GET /api/pay?ref=X verifies the provider result before recording payment.
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { order_id, email } = req.body || {};
    if (!order_id || !email) return res.status(400).json({ error: "order_id and email required" });
    const o = await query(
      `SELECT o.id, o.order_no, o.total_held, o.status, u.email,
              h.amount, h.status AS hold_status, h.gateway_ref
       FROM orders o
       JOIN users u ON u.id=o.user_id
       JOIN payment_holds h ON h.order_id=o.id
       WHERE o.id=$1
       ORDER BY h.id DESC LIMIT 1`,
      [order_id]
    );
    if (!o.rows.length) return res.status(404).json({ error: "no-order" });
    const order = o.rows[0];
    if (String(order.email || "").toLowerCase() !== String(email).trim().toLowerCase()) {
      return res.status(403).json({ error: "buyer-mismatch" });
    }
    if (!["FundsHeld", "Validated"].includes(order.status)) return res.status(409).json({ error: "order-not-payable" });
    if (order.hold_status === "captured") return res.status(200).json({ mode: "paystack", status: "paid" });
    if (order.hold_status === "released") return res.status(409).json({ error: "hold-not-payable" });
    if (Number(order.amount) !== Number(order.total_held)) return res.status(409).json({ error: "amount-mismatch" });
    if (Number(order.total_held) <= 0) {
      await query("UPDATE payment_holds SET status='captured' WHERE order_id=$1 AND status IN ('held','pending')", [order.id]);
      return res.status(200).json({ mode: "wallet", status: "paid" });
    }
    if (!paystackReady()) {
      return res.status(200).json({ mode: "local-hold", message: "Live payments are not configured; this order is recorded locally.", total_held: order.total_held });
    }
    if (order.hold_status === "pending") return res.status(409).json({ error: "payment-pending" });
    const ref = `HG-${randomUUID()}`;
    const siteUrl = process.env.BETTER_AUTH_URL || `http://${req.headers.host || "localhost:3000"}`;
    const reserved = await query("UPDATE payment_holds SET gateway_ref=$1, status='pending' WHERE order_id=$2 AND status IN ('held','failed') RETURNING id", [ref, order_id]);
    if (!reserved.rows.length) return res.status(409).json({ error: "payment-pending" });
    try {
      const init = await initializePayment({
        email: order.email,
        amountKobo: Math.round(Number(order.total_held) * 100),
        reference: ref,
        callbackUrl: `${siteUrl}/order?ref=${encodeURIComponent(ref)}`,
        orderId: order.id,
      });
      return res.status(200).json({ mode: "paystack", authorization_url: init.data.authorization_url, reference: ref });
    } catch (error) {
      await query("UPDATE payment_holds SET gateway_ref=NULL, status='held' WHERE order_id=$1 AND gateway_ref=$2", [order_id, ref]);
      throw error;
    }
  }
  if (req.method !== "GET") return res.status(405).json({ error: "method-not-allowed" });
  const { ref } = req.query;
  if (!ref) return res.status(400).json({ error: "ref required" });
  if (typeof ref !== "string" || !/^[A-Za-z0-9._=-]{1,100}$/.test(ref)) return res.status(400).json({ error: "bad-reference" });
  const h = await query(
    `SELECT ph.order_id, ph.amount, ph.status, o.order_no, u.id AS user_id
     FROM payment_holds ph
     JOIN orders o ON o.id=ph.order_id
     JOIN users u ON u.id=o.user_id
     WHERE ph.gateway_ref=$1 LIMIT 1`,
    [ref]
  );
  if (!h.rows.length) return res.status(404).json({ error: "unknown-reference" });
  const hold = h.rows[0];
  if (hold.status === "captured") return res.status(200).json({ ok: true, already_paid: true, order_no: hold.order_no });
  if (!paystackReady()) return res.status(503).json({ error: "payments-not-configured" });
  let v;
  try {
    v = await verifyPayment(ref);
  } catch (error) {
    console.error("paystack-verification-failed", error.message);
    return res.status(502).json({ error: "verification-unavailable" });
  }
  const payment = v.data;
  if (!v.status || payment?.reference !== ref) return res.status(502).json({ error: "invalid-verification-response" });
  if (payment.status !== "success") {
    if (["failed", "abandoned"].includes(payment.status)) {
      await query("UPDATE payment_holds SET status='failed' WHERE gateway_ref=$1 AND status='pending'", [ref]);
    }
    return res.status(402).json({ ok: false, status: payment.status });
  }
  if (payment.currency !== "NGN" || Number(payment.amount) !== Math.round(Number(hold.amount) * 100)) {
    return res.status(409).json({ error: "payment-details-mismatch" });
  }
  const saved = await query(
    "UPDATE payment_holds SET status='captured' WHERE gateway_ref=$1 AND status IN ('pending','held') RETURNING order_id",
    [ref]
  );
  if (saved.rows.length) {
    await notify(hold.user_id, "payment_received", `Payment confirmed for ${hold.order_no}: ₦${(Number(payment.amount) / 100).toLocaleString("en-NG")}.`);
  }
  return res.status(200).json({ ok: true, amount: payment.amount / 100, order_no: hold.order_no });
}
