import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { TrendingUp, Wallet, Trophy, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHome() {
  const { user } = useUser();
  const name = user?.firstName || "Trader";

  const stats = [
    { label: "Active accounts", value: "0", icon: Trophy, color: "text-primary" },
    { label: "Total profit", value: "$0", icon: TrendingUp, color: "text-success" },
    { label: "Available payout", value: "$0", icon: Wallet, color: "text-primary" },
    { label: "Trades this week", value: "0", icon: Activity, color: "text-muted-foreground" },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Welcome back, <span className="text-gradient">{name}</span>.</h1>
        <p className="text-muted-foreground mt-1.5">Here's a snapshot of your trading activity.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-hover rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</span>
              <div className={`h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-10 text-center border border-primary/10">
        <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Trophy className="h-7 w-7 text-[hsl(222,47%,8%)]" />
        </div>
        <h2 className="text-2xl font-display font-bold">No active challenge yet</h2>
        <p className="mt-2 text-muted-foreground max-w-sm mx-auto">Start your first challenge and get on the path to a funded account.</p>
        <Button asChild className="mt-6 shadow-glow-sm">
          <Link to="/dashboard/challenges">Browse challenges <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  );
}
