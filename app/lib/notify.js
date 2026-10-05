import { query } from "./db";
import { randomUUID } from "crypto";

// Phase 7: log-only notices (SMS/WhatsApp plug in later via Termii/Africa's Talking).
export async function notify(userId, kind, message, phone) {
  await query("INSERT INTO notifications (id, user_id, kind, message) VALUES ($1,$2,$3,$4)",
    [randomUUID(), userId, kind, message]);
  // Best-effort SMS when keys exist; feed is the fallback.
  if (process.env.SMS_API_KEY && phone) {
    try {
      const { sendSms } = await import("./sms");
      await sendSms(phone, message);
    } catch {}
  }
}
