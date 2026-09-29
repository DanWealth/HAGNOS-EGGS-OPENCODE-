import { r2Ready, photoUploadUrl } from "../../lib/r2";

// GET /api/photos?order_id=X&filename=drop.jpg -> { uploadUrl, photoUrl }
// Driver PUTs the JPEG to uploadUrl, then sends photoUrl with /api/deliver.
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  if (!r2Ready()) return res.status(200).json({ configured: false, message: "Add R2 keys to use photo proof." });
  const { order_id, filename } = req.query;
  if (!order_id) return res.status(400).json({ error: "order_id required" });
  const out = await photoUploadUrl(order_id, filename || "drop.jpg");
  res.status(200).json({ configured: true, ...out });
}
