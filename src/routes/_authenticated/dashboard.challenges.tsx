import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/dashboard/challenges")({
  head: () => ({ meta: [{ title: "Buy a challenge — FundedPlus" }] }),
  component: () => (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold">Buy a challenge</h1>
      <p className="text-muted-foreground mt-1">Pick an account size to start.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-6">
            <div className="text-3xl font-bold">{p.label}</div>
            <div className="text-2xl text-gradient font-bold mt-1">${p.price}</div>
            <ul className="mt-4 text-sm text-muted-foreground space-y-1">
              <li>{p.profitTarget}% profit target</li>
              <li>{p.maxDrawdown}% max drawdown</li>
              <li>{p.profitShare}% profit split</li>
            </ul>
            <Button asChild className="mt-6 w-full bg-gradient-primary text-primary-foreground shadow-ice">
              <Link to="/dashboard/checkout/$planId" params={{ planId: p.id }}>Checkout</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  ),
});
