import express from "express";
import cors from "cors";
import { createHmac, timingSafeEqual } from "crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import pool from "./db.js";

export const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "gunsroll0@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getJWKS(issuer: string) {
  if (!jwksCache.has(issuer)) {
    jwksCache.set(issuer, createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`)));
  }
  return jwksCache.get(issuer)!;
}

interface ClerkAuth {
  userId: string;
  email: string;
}

async function verifyClerkToken(authHeader: string | undefined): Promise<ClerkAuth | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const unverifiedPayload = JSON.parse(Buffer.from(parts[1], "base64url").toString()) as {
      iss?: string;
      sub?: string;
      email?: string;
    };
    const issuer = unverifiedPayload.iss;
    if (!issuer || !issuer.startsWith("https://")) return null;

    const JWKS = getJWKS(issuer);
    const { payload } = await jwtVerify(token, JWKS, { issuer });

    const userId = (payload.sub as string) || "";
    const email = (payload["email"] as string) || "";
    if (!userId) return null;
    return { userId, email };
  } catch {
    return null;
  }
}

async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = await verifyClerkToken(req.headers.authorization);
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  if (!ADMIN_EMAILS.has(auth.email.toLowerCase())) return res.status(403).json({ error: "Forbidden" });
  next();
}

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

async function ensureUserRegistered(userId: string, email: string) {
  try {
    await pool.query(
      `INSERT INTO users_registry (user_id, email, last_seen)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id) DO UPDATE SET last_seen = NOW(), email = EXCLUDED.email`,
      [userId, email]
    );
  } catch (e) {
    console.error("[db] ensureUserRegistered error", e);
  }
}

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        cart_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        user_email VARCHAR(255),
        plan_id VARCHAR(50),
        plan_label VARCHAR(50),
        amount DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','paid','failed')),
        tran_ref VARCHAR(255),
        raw_payload JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS payout_requests (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        user_email VARCHAR(255),
        amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','paid','rejected')),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS users_registry (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        first_seen TIMESTAMP DEFAULT NOW(),
        last_seen TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("[db] Schema ready");
  } catch (e) {
    console.error("[db] initDb error", e);
  }
}

app.post("/api/paytabs-payment", async (req, res) => {
  const auth = await verifyClerkToken(req.headers.authorization);
  if (!auth || !auth.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await ensureUserRegistered(auth.userId, auth.email);

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

    try {
      await pool.query(
        `INSERT INTO orders (cart_id, user_id, user_email, plan_id, plan_label, amount, status, tran_ref)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
         ON CONFLICT (cart_id) DO NOTHING`,
        [cartId, auth.userId, auth.email, planId, plan.label, plan.price, json.tran_ref || null]
      );
    } catch (dbErr) {
      console.error("[db] order insert error", dbErr);
    }

    return res.json({ redirect_url: json.redirect_url, tran_ref: json.tran_ref, cart_id: cartId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "PayTabs request failed";
    return res.status(500).json({ error: msg });
  }
});

app.post("/api/paytabs-webhook", express.text({ type: "*/*" }), async (req, res) => {
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
      const cartId = payload.cart_id as string;
      const status = payload.payment_result?.response_status === "A" ? "paid" : "failed";
      console.log("[paytabs:webhook] verified", cartId, status);

      try {
        await pool.query(
          `UPDATE orders
           SET status = $1, tran_ref = $2, raw_payload = $3, updated_at = NOW()
           WHERE cart_id = $4`,
          [status, payload.tran_ref || null, JSON.stringify(payload), cartId]
        );
      } catch (dbErr) {
        console.error("[db] webhook update error", dbErr);
      }
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

app.get("/api/admin/stats", requireAdmin, async (req, res) => {
  try {
    const [usersRes, ordersRes, pendingPayoutsRes, revenueRes] = await Promise.all([
      pool.query("SELECT COUNT(*) AS count FROM users_registry"),
      pool.query("SELECT COUNT(*) AS count FROM orders"),
      pool.query("SELECT COUNT(*) AS count FROM payout_requests WHERE status = 'pending'"),
      pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM orders WHERE status = 'paid'"),
    ]);
    res.json({
      totalUsers: parseInt(usersRes.rows[0].count, 10),
      totalOrders: parseInt(ordersRes.rows[0].count, 10),
      pendingPayouts: parseInt(pendingPayoutsRes.rows[0].count, 10),
      revenue: parseFloat(revenueRes.rows[0].total),
    });
  } catch (e) {
    console.error("[admin/stats]", e);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.get("/api/admin/orders", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, cart_id, user_id, user_email, plan_id, plan_label, amount, status, tran_ref, created_at FROM orders ORDER BY created_at DESC LIMIT 200"
    );
    res.json(result.rows);
  } catch (e) {
    console.error("[admin/orders]", e);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/admin/payouts", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, user_id, user_email, amount, status, notes, created_at FROM payout_requests ORDER BY created_at DESC LIMIT 200"
    );
    const pending = await pool.query("SELECT COALESCE(SUM(amount),0) AS total FROM payout_requests WHERE status = 'pending'");
    const paidMonth = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS total FROM payout_requests WHERE status = 'paid' AND date_trunc('month', updated_at) = date_trunc('month', NOW())"
    );
    const paidAll = await pool.query("SELECT COALESCE(SUM(amount),0) AS total FROM payout_requests WHERE status = 'paid'");
    res.json({
      requests: result.rows,
      pendingTotal: parseFloat(pending.rows[0].total),
      paidThisMonth: parseFloat(paidMonth.rows[0].total),
      paidAllTime: parseFloat(paidAll.rows[0].total),
    });
  } catch (e) {
    console.error("[admin/payouts]", e);
    res.status(500).json({ error: "Failed to fetch payouts" });
  }
});

app.patch("/api/admin/payouts/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const { status } = req.body;
  const allowed = ["pending", "paid", "rejected"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });
  try {
    const result = await pool.query(
      "UPDATE payout_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id",
      [status, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (e) {
    console.error("[admin/payouts patch]", e);
    res.status(500).json({ error: "Failed to update payout" });
  }
});

app.post("/api/payout-request", async (req, res) => {
  const auth = await verifyClerkToken(req.headers.authorization);
  if (!auth || !auth.userId) return res.status(401).json({ error: "Unauthorized" });
  const { amount, notes } = req.body;
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  try {
    await pool.query(
      "INSERT INTO payout_requests (user_id, user_email, amount, notes) VALUES ($1, $2, $3, $4)",
      [auth.userId, auth.email, Number(amount), notes || null]
    );
    res.json({ success: true });
  } catch (e) {
    console.error("[payout-request]", e);
    res.status(500).json({ error: "Failed to submit payout request" });
  }
});

initDb().then(() => {
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    const PORT = process.env.SERVER_PORT || 3001;
    app.listen(PORT, () => {
      console.log(`[server] API running on port ${PORT}`);
    });
  }
});
