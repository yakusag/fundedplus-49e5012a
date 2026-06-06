import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlan } from "@/lib/plans";
import { createPaytabsPayment } from "@/lib/paytabs.functions";

export const Route = createFileRoute("/_authenticated/dashboard/checkout/$planId")({
  head: () => ({ meta: [{ title: "Checkout — FundedPlus" }] }),
  component: Checkout,
});

function Checkout() {
  const { planId } = Route.useParams();
  const plan = getPlan(planId);
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!plan) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Plan not found</h1>
        <Button onClick={() => navigate({ to: "/dashboard/challenges" })} className="mt-4">Back to challenges</Button>
      </div>
    );
  }

  async function handlePay() {
    if (!plan) return;
    setLoading(true);
    setError(null);
    try {
      const origin = window.location.origin;
      const res = await createPaytabsPayment({
        data: {
          planId: plan.id,
          customerEmail: user?.primaryEmailAddress?.emailAddress || "",
          customerName: user?.fullName || user?.firstName || "Trader",
          customerId: user?.id || "guest",
          returnUrl: `${origin}/dashboard?paid=1`,
        },
      });
      if (res.redirect_url) {
        window.location.href = res.redirect_url;
      } else {
        setError(res.error || "Failed to create payment");
        setLoading(false);
      }
    } catch (e: any) {
      setError(e?.message || "Payment failed");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="glass rounded-2xl p-6 mt-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Account size</span>
          <span className="font-semibold">{plan.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Profit target</span>
          <span>{plan.profitTarget}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Profit split</span>
          <span>{plan.profitShare}%</span>
        </div>
        <div className="border-t border-border/40 pt-4 flex justify-between text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-gradient">${plan.price}.00 USD</span>
        </div>
      </div>
      {error && <div className="mt-4 text-sm text-destructive">{error}</div>}
      <Button onClick={handlePay} disabled={loading} className="mt-6 w-full h-12 bg-gradient-primary text-primary-foreground shadow-ice">
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Redirecting to PayTabs...</> : "Pay with PayTabs"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground text-center">You'll be redirected to PayTabs secure checkout.</p>
    </div>
  );
}
