// Paystack hold/capture (PRD §8). Activates when PAYSTACK_SECRET_KEY is set.
// Until then the app records holds locally in payment_holds (pilot-safe).
const BASE = "https://api.paystack.co";

function headers() {
  return { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" };
}

export function paystackReady() {
  return !!process.env.PAYSTACK_SECRET_KEY;
}

// Step 1 (Monday): start a transaction; buyer completes payment; webhook verifies.
export async function initializePayment({ email, amountKobo, reference }) {
  const r = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, amount: amountKobo, reference }),
  });
  if (!r.ok) throw new Error(`paystack-init ${r.status}`);
  return r.json();
}

// Step 2: confirm money actually arrived before farm payout.
export async function verifyPayment(reference) {
  const r = await fetch(`${BASE}/transaction/verify/${reference}`, { headers: headers() });
  if (!r.ok) throw new Error(`paystack-verify ${r.status}`);
  return r.json();
}
