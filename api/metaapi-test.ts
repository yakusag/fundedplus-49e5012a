import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.METAAPI_TOKEN;
  if (!token) return res.status(500).json({ ok: false, error: "METAAPI_TOKEN not configured." });

  try {
    const r = await fetch(
      "https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts?limit=1",
      { headers: { "auth-token": token } }
    );
    const data = await r.json() as { items?: unknown[]; message?: string };
    if (!r.ok) return res.json({ ok: false, error: data.message || `HTTP ${r.status}` });
    return res.json({ ok: true, accounts: data.items?.length ?? 0 });
  } catch (e) {
    return res.json({ ok: false, error: e instanceof Error ? e.message : "Request failed" });
  }
}
