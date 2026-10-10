import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/requireAdmin";
import { paystackReady } from "../../lib/paystack";

// Tuesday night: settle only delivered orders with a captured payment.
// In local-hold mode, held rows retain the pilot's existing manual-settlement behavior.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!(await requireAdmin(req, res))) return;
  const livePayments = paystackReady();
  const r = await query(
    `UPDATE orders o SET status='Settled'
     WHERE o.status IN ('Delivered','Adjusted')
       AND EXISTS (
         SELECT 1 FROM payment_holds h
         WHERE h.order_id=o.id
           AND (h.status='captured' OR ($1::boolean = false AND h.status='held'))
       )
     RETURNING o.id, o.total_held`,
    [livePayments]
  );
  if (!livePayments) {
    await query("UPDATE payment_holds SET status='captured' WHERE order_id = ANY($1) AND status='held'", [r.rows.map((x) => x.id)]);
  }
  const sum = r.rows.reduce((a, x) => a + Number(x.total_held), 0);
  res.status(200).json({ settled: r.rows.length, farm_payout: sum, payment_mode: livePayments ? "paystack" : "local-hold" });
}
