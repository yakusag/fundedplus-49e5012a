import { createFileRoute } from "@tanstack/react-router";

// PayTabs server-to-server callback. Verifies signature and logs the result.
// Persist to DB later when Lovable Cloud is enabled.
export const Route = createFileRoute("/api/public/paytabs-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const signature = request.headers.get("signature") || "";
        const serverKey = process.env.PAYTABS_SERVER_KEY;

        if (!serverKey) return new Response("Not configured", { status: 500 });

        try {
          const { createHmac, timingSafeEqual } = await import("crypto");
          const expected = createHmac("sha256", serverKey).update(body).digest("hex");
          const sig = Buffer.from(signature);
          const exp = Buffer.from(expected);
          if (signature && sig.length === exp.length && timingSafeEqual(sig, exp)) {
            const payload = JSON.parse(body);
            console.log("[paytabs:webhook] verified", payload.cart_id, payload.payment_result?.response_status);
          } else {
            console.warn("[paytabs:webhook] invalid signature");
            return new Response("Invalid signature", { status: 401 });
          }
        } catch (e: any) {
          console.error("[paytabs:webhook] error", e?.message);
          return new Response("Error", { status: 500 });
        }
        return new Response("ok");
      },
    },
  },
});
