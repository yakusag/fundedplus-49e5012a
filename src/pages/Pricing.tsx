import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";

export default function Pricing() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold">
            Simple, <span className="text-gradient">honest pricing</span>
          </h1>
          <p className="mt-4 text-muted-foreground">Pay once. Trade as long as you respect the rules. No subscriptions.</p>
        </div>

        <div className="mt-12 glass rounded-2xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {["Account", "Price", "Profit target", "Max DD", "Daily DD", "Profit split", ""].map((h) => (
                    <th key={h} className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLANS.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-display font-bold text-base">{p.label}</td>
                    <td className="p-4 font-bold text-gradient text-base">${p.price}</td>
                    <td className="p-4 text-muted-foreground">{p.profitTarget}%</td>
                    <td className="p-4 text-muted-foreground">{p.maxDrawdown}%</td>
                    <td className="p-4 text-muted-foreground">{p.dailyDrawdown}%</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-success font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />{p.profitShare}%
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button asChild size="sm">
                        <Link to={`/dashboard/checkout/${p.id}`}>Buy</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {[
            { title: "Payout structure", body: "First payout after 14 days, then bi-weekly. Processed in 24h via bank, crypto, or PayPal." },
            { title: "Scaling plan", body: "Hit 10% in 4 months and double your account up to $400K total funding." },
            { title: "Refund policy", body: "100% refund of the challenge fee with your first payout. Zero risk to try." },
          ].map((c) => (
            <div key={c.title} className="glass-hover rounded-2xl p-6">
              <h3 className="font-display font-semibold text-base">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
