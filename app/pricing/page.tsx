import Link from "next/link";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";

export const metadata = {
  title: "Pricing — FundedPlus",
  description: "Transparent one-time pricing for funded trading challenges from $5K to $200K.",
};

export default function PricingPage() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold">Simple, <span className="text-gradient">honest pricing</span></h1>
          <p className="mt-4 text-muted-foreground">Pay once. Trade as long as you respect the rules. No subscriptions.</p>
        </div>
        <div className="mt-12 glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-card/50">
                  <th className="text-left p-4 font-semibold">Account size</th>
                  <th className="text-left p-4 font-semibold">Price</th>
                  <th className="text-left p-4 font-semibold">Profit target</th>
                  <th className="text-left p-4 font-semibold">Max DD</th>
                  <th className="text-left p-4 font-semibold">Profit split</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {PLANS.map((p) => (
                  <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-card/30">
                    <td className="p-4 font-semibold">{p.label}</td>
                    <td className="p-4 text-gradient font-bold">${p.price}</td>
                    <td className="p-4">{p.profitTarget}%</td>
                    <td className="p-4">{p.maxDrawdown}%</td>
                    <td className="p-4">{p.profitShare}%</td>
                    <td className="p-4 text-right">
                      <Button asChild size="sm" className="bg-gradient-primary text-[hsl(222,47%,11%)]">
                        <Link href={`/dashboard/checkout/${p.id}`}>Buy</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            { title: "Payout structure", body: "First payout after 14 days, then bi-weekly. Processed in 24h via bank, crypto or PayPal." },
            { title: "Scaling plan", body: "Hit 10% in 4 months and double your account up to $400K total funding." },
            { title: "Refund policy", body: "100% refund of the challenge fee with your first payout." },
          ].map((c) => (
            <div key={c.title} className="glass rounded-2xl p-6">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
