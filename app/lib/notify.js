import { query } from "./db";
import { randomUUID } from "crypto";

// Phase 7: log-only notices (SMS/WhatsApp plug in later via Termii/Africa's Talking).
export async function notify(userId, kind, message) {
  await query("INSERT INTO notifications (id, user_id, kind, message) VALUES ($1,$2,$3,$4)",
    [randomUUID(), userId, kind, message]);
}
