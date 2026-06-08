import { Wallet, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPayouts() {
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Payouts</h1>
        <p className="text-muted-foreground mt-1.5">Track your payout history and request withdrawals.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Available balance", value: "$0.00", icon: Wallet, color: "text-success" },
          { label: "Pending payouts", value: "$0.00", icon: Clock, color: "text-primary" },
          { label: "Total paid out", value: "$0.00", icon: CheckCircle2, color: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="glass-hover rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-display font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-display font-semibold">Payout history</h2>
          <Badge variant="outline">No payouts yet</Badge>
        </div>
        <div className="p-12 text-center">
          <Wallet className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Your payout history will appear here once you pass a challenge and request a withdrawal.</p>
        </div>
      </div>
    </div>
  );
}
