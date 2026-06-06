import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Plan = {
  id: string;
  slug: string;
  name: string;
  price: number;
  profit_target: number;
  max_total_loss: number;
  profit_split: number;
};

export const Route = createFileRoute("/_authenticated/dashboard/challenges")({
  head: () => ({ meta: [{ title: "Buy a challenge — FundedPlus" }] }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("plans").select("*").eq("is_active", true).order("sort_order").then(({ data }) => {
      setPlans((data as Plan[]) || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold">Buy a challenge</h1>
      <p className="text-muted-foreground mt-1">Pick an account size to start.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-6">
            <div className="text-3xl font-bold">{p.name}</div>
            <div className="text-2xl text-gradient font-bold mt-1">${p.price}</div>
            <ul className="mt-4 text-sm text-muted-foreground space-y-1">
              <li>{p.profit_target}% profit target</li>
              <li>{p.max_total_loss}% max drawdown</li>
              <li>{p.profit_split}% profit split</li>
            </ul>
            <Button asChild className="mt-6 w-full bg-gradient-primary text-primary-foreground shadow-ice">
              <Link to="/dashboard/checkout/$planId" params={{ planId: p.slug }}>Checkout</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
