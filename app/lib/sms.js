// SMS via Termii (PRD notices). Activates when SMS_API_KEY is set.
// Until then notices stay in the in-app feed (notifications table).
export function smsReady() {
  return !!process.env.SMS_API_KEY;
}

export async function sendSms(to, message) {
  const r = await fetch("https://api.ng.termii.com/api/sms/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, from: "Hagnos", sms: message, type: "plain", api_key: process.env.SMS_API_KEY, channel: "generic" }),
  });
  if (!r.ok) throw new Error(`termii ${r.status}`);
  return r.json();
}
