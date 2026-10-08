// Paystack charges the buyer at checkout; this is not a delayed authorization hold.
// The secret key is server-only and supplied through app/.env.
const BASE = "https://api.paystack.co";

function headers() {
  return { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" };
}

export function paystackReady() {
  return !!process.env.PAYSTACK_SECRET_KEY;
}

// Start a transaction; the buyer authorizes the charge on Paystack Checkout.
export async function initializePayment({ email, amountKobo, reference, callbackUrl, orderId }) {
  const r = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      email,
      amount: amountKobo,
      currency: "NGN",
      reference,
      callback_url: callbackUrl,
      metadata: { order_id: orderId },
    }),
  });
  if (!r.ok) throw new Error(`paystack-init ${r.status}`);
  const result = await r.json();
  if (!result.status || !result.data?.authorization_url || result.data.reference !== reference) {
    throw new Error("paystack-init-invalid-response");
  }
  return result;
}

// Confirm the charge server-side before recording the order as paid.
export async function verifyPayment(reference) {
  const r = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, { headers: headers() });
  if (!r.ok) throw new Error(`paystack-verify ${r.status}`);
  return r.json();
}
