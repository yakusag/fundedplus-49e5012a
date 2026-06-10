import express from "express";
import cors from "cors";
import { createHmac, timingSafeEqual } from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import pool from "./db.js";

function createMailer() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === "465",
    auth: { user, pass },
  });
}

async function sendCredentialsEmail(to: string, login: string, password: string, server: string, platform: string) {
  const mailer = createMailer();
  if (!mailer) { console.log("[email] SMTP not configured — skipping email to", to); return; }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const subject = "Your FundedPlus Trading Account is Ready 🚀";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0f1117;color:#e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:32px 24px;text-align:center">
        <h1 style="margin:0;font-size:24px;color:#fff">FundedPlus</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">Your trading account is ready</p>
      </div>
      <div style="padding:32px 24px">
        <p style="font-size:16px;margin:0 0 24px">Hi Trader 👋,</p>
        <p style="color:#94a3b8;margin:0 0 24px">Your <strong style="color:#a78bfa">${platform.toUpperCase()}</strong> trading account has been activated. Here are your credentials:</p>
        <div style="background:#1e1e2e;border-radius:8px;padding:20px;margin-bottom:24px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#94a3b8;width:100px">Platform</td><td style="padding:8px 0;font-weight:bold;color:#e2e8f0">${platform.toUpperCase()}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8">Login</td><td style="padding:8px 0;font-weight:bold;color:#e2e8f0;font-family:monospace">${login}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8">Password</td><td style="padding:8px 0;font-weight:bold;color:#e2e8f0;font-family:monospace">${password}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8">Server</td><td style="padding:8px 0;font-weight:bold;color:#e2e8f0;font-family:monospace">${server}</td></tr>
          </table>
        </div>
        <p style="color:#94a3b8;font-size:14px;margin:0 0 8px"><strong style="color:#e2e8f0">How to connect:</strong></p>
        <p style="color:#94a3b8;font-size:14px;margin:0 0 24px">Open ${platform.toUpperCase()} → File → Open an Account → search for <strong style="color:#a78bfa">${server}</strong> → enter your login and password.</p>
        <p style="color:#64748b;font-size:12px;margin:0">Please keep your credentials safe and do not share them. Contact support if you have any issues.</p>
      </div>
      <div style="padding:16px 24px;border-top:1px solid #1e293b;text-align:center">
        <p style="color:#475569;font-size:12px;margin:0">© ${new Date().getFullYear()} FundedPlus. All rights reserved.</p>
      </div>
    </div>
  `;
  try {
    await mailer.sendMail({ from, to, subject, html });
    console.log("[email] Credentials sent to", to);
  } catch (e) { console.error("[email] Failed to send:", e); }
}

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ─── Helpers ────────────────────────────────────────────────

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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "gunsroll0@gmail.com";

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

async function requireAdmin(req: express.Request, res: express.Response): Promise<{ userId: string; email: string } | null> {
  const auth = await verifyClerkToken(req.headers.authorization);
  if (!auth?.userId) { res.status(401).json({ error: "Unauthorized" }); return null; }
  if (auth.email !== ADMIN_EMAIL) { res.status(403).json({ error: "Forbidden" }); return null; }
  return auth;
}

// ─── PayTabs ────────────────────────────────────────────────

app.post("/api/paytabs-payment", async (req, res) => {
  const auth = await verifyClerkToken(req.headers.authorization);
  if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });

  const profileId = process.env.PAYTABS_PROFILE_ID;
  const serverKey = process.env.PAYTABS_SERVER_KEY;
  const region = process.env.PAYTABS_REGION || "ARE";
  if (!profileId || !serverKey) return res.status(500).json({ error: "PayTabs not configured." });

  const { planId, platform = "mt5" } = req.body;
  const plans: Record<string, { label: string; price: number }> = {
    "5k": { label: "$5K", price: 39 }, "10k": { label: "$10K", price: 69 },
    "25k": { label: "$25K", price: 139 }, "50k": { label: "$50K", price: 229 },
    "100k": { label: "$100K", price: 389 }, "200k": { label: "$200K", price: 749 },
  };
  const plan = plans[planId];
  if (!plan) return res.status(400).json({ error: "Unknown plan." });

  const origin = process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : `http://localhost:${PORT}`;

  const cartId = `fp_${auth.userId}_${planId}_${Date.now()}`;

  try {
    await pool.query(
      `INSERT INTO user_orders (user_id, user_email, plan_id, cart_id, status, platform)
       VALUES ($1,$2,$3,$4,'pending',$5) ON CONFLICT (cart_id) DO NOTHING`,
      [auth.userId, auth.email, planId, cartId, platform]
    );
  } catch (e) { console.error("DB order insert error", e); }

  const body = {
    profile_id: Number(profileId), tran_type: "sale", tran_class: "ecom",
    cart_id: cartId, cart_description: `FundedPlus ${plan.label} challenge`,
    cart_currency: "USD", cart_amount: plan.price,
    customer_details: {
      name: auth.email.split("@")[0] || "Trader", email: auth.email || "noreply@fundedplus.com",
      street1: "N/A", city: "N/A", country: "AE", zip: "00000",
    },
    return: `${origin}/dashboard?paid=1&planId=${planId}&platform=${platform}`,
    callback: `${origin}/api/paytabs-webhook`,
  };

  try {
    const response = await fetch(`${regionEndpoint(region)}/payment/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: serverKey },
      body: JSON.stringify(body),
    });
    const json = await response.json() as { redirect_url?: string; tran_ref?: string; message?: string };
    if (!response.ok || !json.redirect_url) return res.status(500).json({ error: json.message || "PayTabs error" });
    return res.json({ redirect_url: json.redirect_url, tran_ref: json.tran_ref, cart_id: cartId });
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : "PayTabs request failed" });
  }
});

app.post("/api/paytabs-webhook", express.text({ type: "*/*" }), async (req, res) => {
  const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  const signature = (req.headers["signature"] || "") as string;
  const serverKey = process.env.PAYTABS_SERVER_KEY;
  if (!serverKey) return res.status(500).send("Not configured");

  try {
    const expected = createHmac("sha256", serverKey).update(body).digest("hex");
    const sig = Buffer.from(signature); const exp = Buffer.from(expected);
    if (signature && sig.length === exp.length && timingSafeEqual(sig, exp)) {
      const payload = JSON.parse(body);
      const status = payload.payment_result?.response_status;
      console.log("[webhook]", payload.cart_id, status);
      if (status === "A") {
        await pool.query(
          `UPDATE user_orders SET status='paid', tran_ref=$1 WHERE cart_id=$2`,
          [payload.tran_ref, payload.cart_id]
        );
      }
    } else {
      return res.status(401).send("Invalid signature");
    }
  } catch (e) { return res.status(500).send("Error"); }
  res.send("ok");
});

// ─── Challenge Rules ─────────────────────────────────────────

const CHALLENGE_RULES: Record<string, { balance: number; profitTargetPct: number; maxDrawdownPct: number; dailyLossPct: number; minDays: number }> = {
  "5k":   { balance: 5000,   profitTargetPct: 10, maxDrawdownPct: 10, dailyLossPct: 5, minDays: 5 },
  "10k":  { balance: 10000,  profitTargetPct: 10, maxDrawdownPct: 10, dailyLossPct: 5, minDays: 5 },
  "25k":  { balance: 25000,  profitTargetPct: 10, maxDrawdownPct: 10, dailyLossPct: 5, minDays: 5 },
  "50k":  { balance: 50000,  profitTargetPct: 10, maxDrawdownPct: 10, dailyLossPct: 5, minDays: 5 },
  "100k": { balance: 100000, profitTargetPct: 10, maxDrawdownPct: 10, dailyLossPct: 5, minDays: 5 },
  "200k": { balance: 200000, profitTargetPct: 10, maxDrawdownPct: 10, dailyLossPct: 5, minDays: 5 },
};

// ─── Account Pool ────────────────────────────────────────────

app.get("/api/account-pool", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth) return;
  try {
    const { rows } = await pool.query(
      `SELECT id, login, server, platform, plan_id, assigned_to, assigned_at, created_at, is_active FROM account_pool ORDER BY created_at DESC`
    );
    return res.json(rows);
  } catch (e) { return res.status(500).json({ error: "DB error" }); }
});

app.post("/api/account-pool", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth) return;
  const { login, password, server, platform = "mt5", plan_id } = req.body;
  if (!login || !password || !server) return res.status(400).json({ error: "login, password, server required" });
  try {
    const { rows } = await pool.query(
      `INSERT INTO account_pool (login, password, server, platform, plan_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [login, password, server, platform, plan_id || null]
    );
    return res.json(rows[0]);
  } catch (e) { return res.status(500).json({ error: "DB error" }); }
});

app.delete("/api/account-pool/:id", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth) return;
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    await pool.query(`DELETE FROM account_pool WHERE id=$1`, [id]);
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: "DB error" }); }
});

app.post("/api/assign-account", async (req, res) => {
  const auth = await verifyClerkToken(req.headers.authorization);
  if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });
  const { platform = "mt5" } = req.body;
  try {
    const existing = await pool.query(
      `SELECT ap.* FROM account_pool ap WHERE ap.assigned_to=$1 AND ap.is_active=true LIMIT 1`,
      [auth.userId]
    );
    if (existing.rows.length > 0) {
      const a = existing.rows[0];
      return res.json({ login: a.login, password: a.password, server: a.server, platform: a.platform, already: true });
    }
    const available = await pool.query(
      `UPDATE account_pool SET assigned_to=$1, assigned_at=NOW()
       WHERE id = (SELECT id FROM account_pool WHERE assigned_to IS NULL AND platform=$2 AND is_active=true ORDER BY created_at ASC LIMIT 1)
       RETURNING *`,
      [auth.userId, platform]
    );
    if (available.rows.length === 0) return res.status(404).json({ error: "no_accounts", message: "No available accounts right now. Contact support." });
    const a = available.rows[0];
    if (auth.email) {
      sendCredentialsEmail(auth.email, a.login, a.password, a.server, a.platform).catch(() => {});
    }
    return res.json({ login: a.login, password: a.password, server: a.server, platform: a.platform });
  } catch (e) { return res.status(500).json({ error: "DB error" }); }
});

app.get("/api/my-accounts", async (req, res) => {
  const auth = await verifyClerkToken(req.headers.authorization);
  if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { rows } = await pool.query(
      `SELECT ap.id, ap.login, ap.password, ap.server, ap.platform, ap.plan_id, ap.assigned_at,
              cp.current_pnl_pct, cp.status as progress_status, cp.notes, cp.updated_at as progress_updated_at
       FROM account_pool ap
       LEFT JOIN challenge_progress cp ON cp.account_pool_id = ap.id
       WHERE ap.assigned_to=$1 AND ap.is_active=true`,
      [auth.userId]
    );
    const enriched = rows.map(r => ({
      ...r,
      rules: CHALLENGE_RULES[r.plan_id?.toLowerCase() || ""] || null,
    }));
    return res.json(enriched);
  } catch (e) { return res.status(500).json({ error: "DB error" }); }
});

// ─── Challenge Progress (admin update only) ──────────────────

app.patch("/api/challenge-progress/:accountId", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth) return;
  const accountId = parseInt(req.params.accountId);
  if (isNaN(accountId)) return res.status(400).json({ error: "Invalid account id" });
  const { current_pnl_pct, status, notes } = req.body;
  try {
    // Verify the account exists before upserting progress
    const exists = await pool.query(`SELECT id FROM account_pool WHERE id=$1`, [accountId]);
    if (exists.rows.length === 0) return res.status(404).json({ error: "Account not found" });

    const ALLOWED_STATUSES = ["active", "at_risk", "passed", "failed"];
    const safeStatus = ALLOWED_STATUSES.includes(status) ? status : "active";
    const safePnl = typeof current_pnl_pct === "number" ? current_pnl_pct : parseFloat(current_pnl_pct) || 0;

    const { rows } = await pool.query(
      `INSERT INTO challenge_progress (account_pool_id, current_pnl_pct, status, notes, updated_at, updated_by)
       VALUES ($1, $2, $3, $4, NOW(), $5)
       ON CONFLICT (account_pool_id) DO UPDATE
       SET current_pnl_pct=$2, status=$3, notes=$4, updated_at=NOW(), updated_by=$5
       RETURNING *`,
      [accountId, safePnl, safeStatus, notes || null, auth.email]
    );
    return res.json(rows[0]);
  } catch (e) { return res.status(500).json({ error: "DB error" }); }
});

// ─── Static (production) ─────────────────────────────────────

const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));

app.listen(PORT, () => console.log(`[server] running on port ${PORT}`));
