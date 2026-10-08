import { query } from "./db";
import { randomUUID } from "crypto";

// Save every notice in the app feed and send an SMS when Termii is configured.
export async function notify(userId, kind, message, phone) {
  await query("INSERT INTO notifications (id, user_id, kind, message) VALUES ($1,$2,$3,$4)",
    [randomUUID(), userId, kind, message]);
  // Best-effort SMS when keys exist; feed is the fallback.
  if (process.env.SMS_API_KEY) {
    try {
      if (!phone) {
        const recipient = await query("SELECT phone FROM users WHERE id=$1", [userId]);
        phone = recipient.rows[0]?.phone;
      }
      if (!phone) return;
      const { sendSms } = await import("./sms");
      await sendSms(phone, message);
    } catch (error) {
      console.error("sms-delivery-failed", error.message);
    }
  }
}
