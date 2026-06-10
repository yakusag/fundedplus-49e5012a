import { Link, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { TrendingUp, Wallet, Trophy, Activity, ArrowRight, Monitor, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DashboardHome() {
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const paid = searchParams.get("paid") === "1";
  const [dismissed, setDismissed] = useState(false);
  const name = user?.firstName || "Trader";

  const stats = [
    { label: "Active accounts", value: "0", icon: Trophy, color: "text-primary" },
    { label: "Total profit", value: "$0", icon: TrendingUp, color: "text-success" },
    { label: "Available payout", value: "$0", icon: Wallet, color: "text-primary" },
    { label: "Trades this week", value: "0", icon: Activity, color: "text-muted-foreground" },
  ];

  function dismissBanner() {
    setDismissed(true);
    searchParams.delete("paid");
    setSearchParams(searchParams);
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">
          Welcome back, <span className="text-gradient">{name}</span>.
        </h1>
        <p className="text-muted-foreground mt-1.5">Here's a snapshot of your trading activity.</p>
      </div>

      {paid && !dismissed && (
        <div className="relative rounded-2xl border border-success/30 bg-success/10 p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-success">Payment confirmed!</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your challenge is activated. Now create your MetaTrader demo account to start trading.
            </p>
            <Button asChild className="mt-3 gap-2 shadow-glow-sm" size="sm">
              <Link to="/dashboard/accounts">
                <Monitor className="h-3.5 w-3.5" /> Create my trading account
              </Link>
            </Button>
          </div>
          <button onClick={dismissBanner} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-8 text-center border border-primary/10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Trophy className="h-6 w-6 text-[hsl(222,47%,8%)]" />
          </div>
          <h2 className="text-xl font-display font-bold">Start a Challenge</h2>
          <p className="mt-2 text-sm text-muted-foreground">Choose your account size and get funded.</p>
          <Button asChild className="mt-5 shadow-glow-sm w-full">
            <Link to="/dashboard/challenges">Browse challenges <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="glass rounded-2xl p-8 text-center border border-white/5">
          <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Monitor className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-display font-bold">My Accounts</h2>
          <p className="mt-2 text-sm text-muted-foreground">View your MT4/MT5 trading credentials.</p>
          <Button asChild variant="outline" className="mt-5 w-full">
            <Link to="/dashboard/accounts">View accounts <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
