import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getPlan } from "./plans";

const inputSchema = z.object({
  planId: z.string().min(1).max(50),
  customerEmail: z.string().email().or(z.literal("")),
  customerName: z.string().min(1).max(200),
  customerId: z.string().min(1).max(200),
  returnUrl: z.string().url(),
});

// PayTabs regional endpoints
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

export const createPaytabsPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const profileId = process.env.PAYTABS_PROFILE_ID;
    const serverKey = process.env.PAYTABS_SERVER_KEY;
    const region = process.env.PAYTABS_REGION || "ARE";

    if (!profileId || !serverKey) {
      return { error: "PayTabs is not configured on the server.", redirect_url: null };
    }

    const plan = getPlan(data.planId);
    if (!plan) return { error: "Unknown plan.", redirect_url: null };

    const cartId = `fp_${data.customerId}_${data.planId}_${Date.now()}`;
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
        name: data.customerName,
        email: data.customerEmail || "noreply@fundedplus.com",
        street1: "N/A",
        city: "N/A",
        country: "AE",
        zip: "00000",
      },
      return: data.returnUrl,
      callback: `${new URL(data.returnUrl).origin}/api/public/paytabs-webhook`,
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: serverKey,
        },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { redirect_url?: string; tran_ref?: string; message?: string };
      if (!res.ok || !json.redirect_url) {
        return { error: json.message || `PayTabs error ${res.status}`, redirect_url: null };
      }
      return { redirect_url: json.redirect_url, tran_ref: json.tran_ref, cart_id: cartId };
    } catch (e: any) {
      return { error: e?.message || "PayTabs request failed", redirect_url: null };
    }
  });
