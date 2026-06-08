import { Wallet, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminPayouts() {
  return (
    <div className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Payouts</h1>
        <p className="text-muted-foreground mt-1.5">Manage and approve trader payout requests.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Pending approval", value: "$0", color: "text-yellow-400" },
          { label: "Paid this month", value: "$0", color: "text-success" },
          { label: "Total paid out", value: "$0", color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="glass-hover rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{s.label}</div>
            <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search payouts..." className="pl-9" />
        </div>
        <Badge variant="outline">0 requests</Badge>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 px-6 py-3 border-b border-white/5 text-xs uppercase tracking-widest text-muted-foreground">
          <span>Trader</span><span>Amount</span><span>Requested</span><span>Status</span>
        </div>
        <div className="p-12 text-center">
          <Wallet className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No payout requests yet. They will appear here once traders request withdrawals.</p>
        </div>
      </div>
    </div>
  );
}
