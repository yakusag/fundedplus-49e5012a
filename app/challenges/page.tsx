import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";

export const metadata = {
  title: "Challenges — FundedPlus",
  description: "2-step trading evaluation. Account sizes from $5K to $200K. Keep up to 90% of profits.",
};

export default function ChallengesPage() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold">Trading <span className="text-gradient">Challenges</span></h1>
          <p className="mt-4 text-muted-foreground">Two phases. Clear targets. Real capital when you pass.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {PLANS.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-6 flex flex-col">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Account</div>
                  <div className="text-3xl font-bold">{p.label}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gradient">${p.price}</div>
                  <div className="text-xs text-muted-foreground">one-time</div>
                </div>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                <Row label="Profit target (P1)" value={`${p.profitTarget}%`} />
                <Row label="Profit target (P2)" value="5%" />
                <Row label="Max drawdown" value={`${p.maxDrawdown}%`} />
                <Row label="Daily drawdown" value={`${p.dailyDrawdown}%`} />
                <Row label="Profit split" value={`${p.profitShare}%`} />
                <Row label="Min trading days" value="None" />
              </ul>
              <Button asChild className="mt-6 bg-gradient-primary text-[hsl(222,47%,11%)] shadow-ice">
                <Link href={`/dashboard/checkout/${p.id}`}>Buy {p.label} challenge</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex justify-between items-center py-1.5 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />{label}</span>
      <span className="font-medium">{value}</span>
    </li>
  );
}
