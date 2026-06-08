import { Trophy, CheckCircle2 } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";

export default function AdminPlans() {
  return (
    <div className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Challenges</h1>
        <p className="text-muted-foreground mt-1.5">All active trading challenge plans.</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <span className="font-display font-semibold">Active plans</span>
          <Badge>{PLANS.length} plans</Badge>
        </div>
        <div className="divide-y divide-white/5">
          {PLANS.map((p) => (
            <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-sm">
                  <Trophy className="h-5 w-5 text-[hsl(222,47%,8%)]" />
                </div>
                <div>
                  <div className="font-display font-bold">{p.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.profitTarget}% target · {p.maxDrawdown}% max DD</div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-right hidden sm:block">
                  <div className="font-bold text-gradient">${p.price}</div>
                  <div className="text-xs text-muted-foreground">one-time</div>
                </div>
                <div className="flex items-center gap-1 text-success text-xs font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />{p.profitShare}% split
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
