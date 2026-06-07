"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlan } from "@/lib/plans";
import { toast } from "sonner";

export default function CheckoutPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = use(params);
  const router = useRouter();
  const plan = getPlan(planId);
  const [loading, setLoading] = useState(false);

  if (!plan) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Plan not found</h1>
        <Button onClick={() => router.push("/dashboard/challenges")} className="mt-4">Back</Button>
      </div>
    );
  }

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch("/api/paytabs-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan!.id }),
      });
      const data = await res.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        toast.error(data.error || "Payment failed");
        setLoading(false);
      }
    } catch {
      toast.error("Payment request failed");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="glass rounded-2xl p-6 mt-6 space-y-4">
        <div className="flex justify-between"><span className="text-muted-foreground">Account</span><span className="font-semibold">{plan.label}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Profit target</span><span>{plan.profitTarget}%</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Profit split</span><span>{plan.profitShare}%</span></div>
        <div className="border-t border-border/40 pt-4 flex justify-between text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-gradient">${plan.price} USD</span>
        </div>
      </div>
      <Button onClick={handlePay} disabled={loading} className="mt-6 w-full h-12 bg-gradient-primary text-[hsl(222,47%,11%)] shadow-ice">
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Redirecting...</> : "Pay with PayTabs"}
      </Button>
    </div>
  );
}
