import { query } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const { email } = req.query;
  const scope = email ? "WHERE LOWER(u.email)=LOWER($1)" : "";
  const args = email ? [email] : [];
  const r = await query(
    `SELECT o.id, o.order_no, o.size_ordered, o.crates, o.total_held, o.status, o.zone, o.address, o.created_at, h.status AS pay_status, h.gateway_ref FROM orders o JOIN users u ON u.id=o.user_id LEFT JOIN LATERAL (SELECT status, gateway_ref FROM payment_holds WHERE order_id=o.id ORDER BY id DESC LIMIT 1) h ON true ${scope} ORDER BY o.created_at DESC LIMIT 50`,
    args
  );
  const t = await query("SELECT COALESCE(SUM(total_held),0) AS held FROM orders WHERE status IN ('FundsHeld','Validated')");
  res.status(200).json({ orders: r.rows, totalHeld: Number(t.rows[0].held) });
}
