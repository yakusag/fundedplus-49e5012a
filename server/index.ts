import express from "express";
import cors from "cors";
import { createHmac, timingSafeEqual } from "crypto";

export const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

function regionEndpoint(region: string): string {
  const map: Record<string, string> = {
    ARE: "https://secure.paytabs.com",
    SAU: "https://secure.paytabs.sa",
    EGY: "https://secure-egypt.paytabs.com",
    JOR: "https://secure-jordan.paytabs.com",
    OMN: "https://secure-oman.paytabs.com",
    GLOBAL: "https://secure-global.paytabs.com",
  };
  return map[region.toUpperCase()] || map.ARE;
}

async function verifyClerkToken(authHeader: string | undefined): Promise<{ userId: string; email: string } | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    return { userId: payload.sub || payload.user_id || "", email: payload.email || "" };
  } catch {
    return null;
  }
}

app.post("/api/paytabs-payment", async (req, res) => {
  const auth = await verifyClerkToken(req.headers.authorization);
  if (!auth || !auth.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const profileId = process.env.PAYTABS_PROFILE_ID;
  const serverKey = process.env.PAYTABS_SERVER_KEY;
  const region = process.env.PAYTABS_REGION || "ARE";

  if (!profileId || !serverKey) {
    return res.status(500).json({ error: "PayTabs is not configured." });
  }

  const { planId } = req.body;
  const plans: Record<string, { label: string; price: number }> = {
    "5k": { label: "$5K", price: 39 },
    "10k": { label: "$10K", price: 69 },
    "25k": { label: "$25K", price: 139 },
    "50k": { label: "$50K", price: 229 },
    "100k": { label: "$100K", price: 389 },
    "200k": { label: "$200K", price: 749 },
  };
  const plan = plans[planId];
  if (!plan) return res.status(400).json({ error: "Unknown plan." });

  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `https://${process.env.REPLIT_DEV_DOMAIN || "localhost:5000"}`;
  const cartId = `fp_${auth.userId}_${planId}_${Date.now()}`;
  const endpoint = `${regionEndpoint(region)}/payment/request`;

  const body = {
    profile_id: Number(profileId),
    tran_type: "sale",
    tran_class: "ecom",
    cart_id: cartId,
    cart_description: `FundedPlus ${plan.label} challenge`,
    cart_currency: "USD",
    cart_amount: plan.price,
    customer_details: {
      name: auth.email.split("@")[0] || "Trader",
      email: auth.email || "noreply@fundedplus.com",
      street1: "N/A",
      city: "N/A",
      country: "AE",
      zip: "00000",
    },
    return: `${origin}/dashboard?paid=1`,
    callback: `${origin}/api/paytabs-webhook`,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: serverKey },
      body: JSON.stringify(body),
    });
    const json = await response.json() as { redirect_url?: string; tran_ref?: string; message?: string };
    if (!response.ok || !json.redirect_url) {
      return res.status(500).json({ error: json.message || `PayTabs error ${response.status}` });
    }
    return res.json({ redirect_url: json.redirect_url, tran_ref: json.tran_ref, cart_id: cartId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "PayTabs request failed";
    return res.status(500).json({ error: msg });
  }
});

app.post("/api/paytabs-webhook", express.text({ type: "*/*" }), (req, res) => {
  const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  const signature = (req.headers["signature"] || "") as string;
  const serverKey = process.env.PAYTABS_SERVER_KEY;

  if (!serverKey) return res.status(500).send("Not configured");

  try {
    const expected = createHmac("sha256", serverKey).update(body).digest("hex");
    const sig = Buffer.from(signature);
    const exp = Buffer.from(expected);
    if (signature && sig.length === exp.length && timingSafeEqual(sig, exp)) {
      const payload = JSON.parse(body);
      console.log("[paytabs:webhook] verified", payload.cart_id, payload.payment_result?.response_status);
    } else {
      console.warn("[paytabs:webhook] invalid signature");
      return res.status(401).send("Invalid signature");
    }
  } catch (e) {
    console.error("[paytabs:webhook] error", e);
    return res.status(500).send("Error");
  }

  res.send("ok");
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.SERVER_PORT || 3001;
  app.listen(PORT, () => {
    console.log(`[server] API running on port ${PORT}`);
  });
}
