// Transactional SMS via Termii. Activates when SMS_API_KEY is set.
export function smsReady() {
  return !!process.env.SMS_API_KEY;
}

export function normalizeNigerianPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (/^0\d{10}$/.test(digits)) return `234${digits.slice(1)}`;
  if (/^234\d{10}$/.test(digits)) return digits;
  return null;
}

export async function sendSms(to, message) {
  const recipient = normalizeNigerianPhone(to);
  if (!recipient) throw new Error("termii-invalid-recipient");
  const baseUrl = (process.env.TERMII_BASE_URL || "https://api.ng.termii.com").replace(/\/+$/, "");
  const r = await fetch(`${baseUrl}/api/sms/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: recipient, from: process.env.SMS_SENDER_ID || "Hagnos", sms: message, type: "plain", api_key: process.env.SMS_API_KEY, channel: "dnd" }),
  });
  const result = await r.json();
  if (!r.ok || result.code !== "ok") throw new Error(`termii-send-failed ${r.status}`);
  return result;
}
