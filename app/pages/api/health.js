export default function handler(req, res) {
  res.status(200).json({ ok: true, app: "hagnos-eggs", time: new Date().toISOString() });
}
