import { query } from "../../lib/db";

const UNIT = { Large: 4500, Medium: 4000, Pullet: 3200 };

// GET /api/quote?email=&size=&crates=&zone= -> true checkout total preview.
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const { email, size, crates, zone, own_crates } = req.query;
  if (!UNIT[size] || !+crates || +crates < 1) return res.status(400).json({ error: "size and crates required" });
  const z = zone === "island" ? "island" : "mainland";
  const pw = await query("SELECT * FROM price_weeks ORDER BY week_start DESC LIMIT 1");
  if (!pw.rows.length) return res.status(400).json({ error: "no-price-week" });
  const P = pw.rows[0];
  let role = "buyer_commercial", firstDone = true, balance = 0;
  if (email) {
    const u = await query("SELECT * FROM users WHERE LOWER(email)=LOWER($1)", [email]);
    if (u.rows.length) {
      role = u.rows[0].role;
      firstDone = !!u.rows[0].first_order_done;
      const w = await query("SELECT balance FROM wallet_accounts WHERE user_id=$1", [u.rows[0].id]);
      balance = Number(w.rows[0]?.balance || 0);
    } else {
      firstDone = false;
    }
  }
  const unit = UNIT[size];
  const gross = unit * +crates;
  const discount = role === "hub_operator" ? Math.round((gross * (P.hub_discount_pct || 5)) / 100) : 0;
  const fee = z === "island" ? P.island_fee : P.mainland_fee;
  const crateFee = !firstDone && own_crates !== "true" ? P.crate_fee * +crates : 0;
  const subtotal = gross - discount + fee + crateFee;
  const walletApplied = Math.min(balance, subtotal);
  res.status(200).json({ gross, discount, fee, crateFee, walletApplied, total: subtotal - walletApplied });
}
