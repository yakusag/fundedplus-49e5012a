import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac, timingSafeEqual } from "crypto";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const serverKey = process.env.PAYTABS_SERVER_KEY;
  if (!serverKey) return res.status(500).send("Not configured");

  const body =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  const signature = (req.headers["signature"] || "") as string;

  try {
    const expected = createHmac("sha256", serverKey)
      .update(body)
      .digest("hex");
    const sig = Buffer.from(signature);
    const exp = Buffer.from(expected);
    if (
      signature &&
      sig.length === exp.length &&
      timingSafeEqual(sig, exp)
    ) {
      const payload = JSON.parse(body);
      console.log(
        "[paytabs:webhook] verified",
        payload.cart_id,
        payload.payment_result?.response_status
      );
    } else {
      console.warn("[paytabs:webhook] invalid signature");
      return res.status(401).send("Invalid signature");
    }
  } catch (e) {
    console.error("[paytabs:webhook] error", e);
    return res.status(500).send("Error");
  }

  res.send("ok");
}
