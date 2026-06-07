import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("signature") || "";
  const serverKey = process.env.PAYTABS_SERVER_KEY;

  if (!serverKey) return new NextResponse("Not configured", { status: 500 });

  try {
    const expected = createHmac("sha256", serverKey).update(body).digest("hex");
    const sig = Buffer.from(signature);
    const exp = Buffer.from(expected);

    if (signature && sig.length === exp.length && timingSafeEqual(sig, exp)) {
      const payload = JSON.parse(body);
      console.log("[paytabs:webhook] verified", payload.cart_id, payload.payment_result?.response_status);
    } else {
      console.warn("[paytabs:webhook] invalid signature");
      return new NextResponse("Invalid signature", { status: 401 });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[paytabs:webhook] error", msg);
    return new NextResponse("Error", { status: 500 });
  }

  return new NextResponse("ok");
}
