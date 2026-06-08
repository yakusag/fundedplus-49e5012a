import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getPlan } from "@/lib/plans";

export default function DashboardCheckout() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const plan = getPlan(planId || "");
  const [loading, setLoading] = useState(false);

  if (!plan) return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-display font-bold">Plan not found</h1>
      <Button onClick={() => navigate("/dashboard/challenges")} className="mt-4" variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to challenges
      </Button>
    </div>
  );

  async function handlePay() {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/paytabs-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId: plan!.id }),
      });
      const data = await res.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        toast.error(data.error || "Payment failed. Please try again.");
        setLoading(false);
      }
    } catch {
      toast.error("Payment request failed. Check your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-3xl font-display font-bold">Checkout</h1>
      <p className="text-muted-foreground mt-1.5">Review your order before paying.</p>

      <div className="glass rounded-2xl p-6 mt-6 space-y-3">
        {[
          ["Account size", plan.label],
          ["Challenge fee", `$${plan.price} USD`],
          ["Profit target (P1)", `${plan.profitTarget}%`],
          ["Profit target (P2)", "5%"],
          ["Max drawdown", `${plan.maxDrawdown}%`],
          ["Profit split", `${plan.profitShare}%`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm items-center py-1 border-b border-white/5 last:border-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
        <div className="pt-4 flex justify-between items-center">
          <span className="font-display font-semibold text-base">Total</span>
          <span className="font-display font-bold text-xl text-gradient">${plan.price} USD</span>
        </div>
      </div>

      <Button onClick={handlePay} disabled={loading} className="mt-6 w-full h-12 shadow-glow" size="lg">
        {loading
          ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Redirecting to PayTabs...</>
          : <>Pay ${plan.price} with PayTabs</>
        }
      </Button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        Secured by PayTabs — 256-bit SSL encryption
      </div>
    </div>
  );
}
