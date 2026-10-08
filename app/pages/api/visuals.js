import { geminiReady, makeVisual } from "../../lib/gemini";

// POST /api/visuals { prompt, prior?: { base64, mimeType } }
// Iterative: pass the last visual back as `prior` to refine it.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { prompt, prior } = req.body || {};
  if (!prompt || String(prompt).length < 3) return res.status(400).json({ error: "describe what you want first" });
  if (!geminiReady()) {
    return res.status(200).json({ configured: false, message: "Add GEMINI_API_KEY to app/.env (never share it) to turn visuals on." });
  }
  try {
    const out = await makeVisual(String(prompt).slice(0, 500), prior);
    res.status(200).json({ configured: true, ...out });
  } catch (e) {
    res.status(502).json({ error: "visual-failed", message: String(e.message || e).slice(0, 200) });
  }
}
