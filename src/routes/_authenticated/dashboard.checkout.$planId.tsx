import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Route as AuthRoute } from "./route";
import { createPaytabsPayment } from "@/lib/paytabs.functions";

type Plan = { id: string; slug: string; name: string; price: number; profit_target: number; profit_split: number };

export const Route = createFileRoute("/_authenticated/dashboard/checkout/$planId")({
  head: () => ({ meta: [{ title: "Checkout — FundedPlus" }] }),
  component: Checkout,
});

function Checkout() {
  const { planId } = Route.useParams();
  const { user } = AuthRoute.useRouteContext();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("plans").select("*").eq("slug", planId).maybeSingle().then(({ data }) => {
      setPlan(data as Plan | null);
      setLoadingPlan(false);
    });
  }, [planId]);

  async function handlePay() {
    if (!plan) return;
    setLoading(true); setError(null);
    try {
      const origin = window.location.origin;
      const res = await createPaytabsPayment({
        data: {
          planId: plan.slug,
          customerEmail: user.email || "",
          customerName: user.user_metadata?.full_name || "Trader",
          customerId: user.id,
          returnUrl: `${origin}/dashboard?paid=1`,
        },
      });
      if (res.redirect_url) window.location.href = res.redirect_url;
      else { setError(res.error || "Failed"); setLoading(false); }
    } catch (e: any) { setError(e?.message); setLoading(false); }
  }

  if (loadingPlan) return <div className="p-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  if (!plan) return <div className="p-10"><h1 className="text-2xl font-bold">Plan not found</h1><Button onClick={() => navigate({ to: "/dashboard/challenges" })} className="mt-4">Back</Button></div>;

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="glass rounded-2xl p-6 mt-6 space-y-4">
        <div className="flex justify-between"><span className="text-muted-foreground">Account</span><span className="font-semibold">{plan.name}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Profit target</span><span>{plan.profit_target}%</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Profit split</span><span>{plan.profit_split}%</span></div>
        <div className="border-t border-border/40 pt-4 flex justify-between text-lg"><span className="font-semibold">Total</span><span className="font-bold text-gradient">${plan.price} USD</span></div>
      </div>
      {error && <div className="mt-4 text-sm text-destructive">{error}</div>}
      <Button onClick={handlePay} disabled={loading} className="mt-6 w-full h-12 bg-gradient-primary text-primary-foreground shadow-ice">
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Redirecting...</> : "Pay with PayTabs"}
      </Button>
    </div>
  );
}
