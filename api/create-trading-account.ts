import type { VercelRequest, VercelResponse } from "@vercel/node";

async function verifyClerkToken(authHeader: string | undefined): Promise<{ userId: string; email: string } | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    return { userId: payload.sub || payload.user_id || "", email: payload.email || "" };
  } catch { return null; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const auth = await verifyClerkToken(req.headers.authorization as string);
  if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });

  const metaToken = process.env.METAAPI_TOKEN;
  const profileId = process.env.METAAPI_PROVISIONING_PROFILE_ID;
  const brokerServer = process.env.METAAPI_BROKER_SERVER;

  if (!metaToken) return res.status(500).json({ error: "MetaAPI not configured." });
  if (!profileId || !brokerServer) {
    return res.status(500).json({
      error: "no_profile",
      message: "Provisioning profile not configured. Please set it up in the admin panel."
    });
  }

  const { platform = "mt5", planId = "" } = req.body as { platform: string; planId: string };
  if (!["mt4", "mt5"].includes(platform)) return res.status(400).json({ error: "Invalid platform. Use mt4 or mt5." });

  const accountName = `FundedPlus_${auth.userId.slice(-8)}_${planId}_${platform.toUpperCase()}`;

  try {
    const createRes = await fetch(
      "https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": metaToken,
        },
        body: JSON.stringify({
          name: accountName,
          type: "cloud-g2",
          platform,
          server: brokerServer,
          provisioningProfileId: profileId,
          application: "MetaApi",
          magic: 0,
          quoteStreamingIntervalInSeconds: 2.5,
        }),
      }
    );

    const data = await createRes.json() as {
      id?: string;
      login?: string | number;
      password?: string;
      server?: string;
      message?: string;
      error?: string;
    };

    if (!createRes.ok) {
      return res.status(createRes.status).json({
        error: data.message || data.error || "MetaAPI account creation failed",
      });
    }

    return res.json({
      accountId: data.id,
      login: data.login,
      password: data.password,
      server: brokerServer,
      platform,
      name: accountName,
      planId,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return res.status(500).json({ error: msg });
  }
}
