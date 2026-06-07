import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getPlan } from "@/lib/plans";

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

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profileId = process.env.PAYTABS_PROFILE_ID;
  const serverKey = process.env.PAYTABS_SERVER_KEY;
  const region = process.env.PAYTABS_REGION || "ARE";

  if (!profileId || !serverKey) {
    return NextResponse.json({ error: "PayTabs is not configured." }, { status: 500 });
  }

  const { planId } = await req.json();
  const plan = getPlan(planId);
  if (!plan) return NextResponse.json({ error: "Unknown plan." }, { status: 400 });

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress || "noreply@fundedplus.com";
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Trader";

  const origin = req.nextUrl.origin;
  const cartId = `fp_${userId}_${planId}_${Date.now()}`;
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
      name,
      email,
      street1: "N/A",
      city: "N/A",
      country: "AE",
      zip: "00000",
    },
    return: `${origin}/dashboard?paid=1`,
    callback: `${origin}/api/paytabs-webhook`,
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: serverKey },
      body: JSON.stringify(body),
    });
    const json = await res.json() as { redirect_url?: string; tran_ref?: string; message?: string };
    if (!res.ok || !json.redirect_url) {
      return NextResponse.json({ error: json.message || `PayTabs error ${res.status}` }, { status: 500 });
    }
    return NextResponse.json({ redirect_url: json.redirect_url, tran_ref: json.tran_ref, cart_id: cartId });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "PayTabs request failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
