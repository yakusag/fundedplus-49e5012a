import { Link, useSearchParams } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { TrendingUp, Wallet, Trophy, Activity, ArrowRight, Monitor, CheckCircle2, X, Target, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type Account = {
  id: number;
  plan_id: string | null;
  current_pnl_pct: number | null;
  progress_status: string | null;
  rules: { balance: number; profitTargetPct: number; maxDrawdownPct: number } | null;
};

function MiniProgress({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const paid = searchParams.get("paid") === "1";
  const [dismissed, setDismissed] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const name = user?.firstName || "Trader";

  useEffect(() => {
    getToken().then(token => {
      fetch("/api/my-accounts", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setAccounts(Array.isArray(d) ? d : []))
        .catch(() => {});
    });
  }, []);

  const activeCount = accounts.length;
  const totalPnl = accounts.reduce((s, a) => s + (a.current_pnl_pct ?? 0), 0);
  const passedCount = accounts.filter(a => {
    const pnl = a.current_pnl_pct ?? 0;
    return a.progress_status === "passed" || (a.rules && pnl >= a.rules.profitTargetPct);
  }).length;

  const stats = [
    { label: "Active accounts", value: String(activeCount), icon: Trophy, color: "text-primary" },
    { label: "Challenges passed", value: String(passedCount), icon: CheckCircle2, color: "text-success" },
    { label: "Avg P&L", value: activeCount > 0 ? `${(totalPnl / activeCount).toFixed(1)}%` : "0%", icon: TrendingUp, color: totalPnl >= 0 ? "text-success" : "text-destructive" },
    { label: "In progress", value: String(activeCount - passedCount), icon: Activity, color: "text-muted-foreground" },
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

      {accounts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Active Challenges</h2>
            <Link to="/dashboard/accounts" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {accounts.slice(0, 4).map((a, i) => {
              const pnl = a.current_pnl_pct ?? 0;
              const isOn = a.rules ? pnl >= a.rules.profitTargetPct : false;
              const isRisk = a.rules ? pnl <= -(a.rules.maxDrawdownPct * 0.7) : false;
              return (
                <div key={i} className="glass rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold">{a.plan_id?.toUpperCase() || "Challenge"}
                        {a.rules && <span className="ml-1.5 text-xs text-muted-foreground font-normal">${a.rules.balance.toLocaleString()}</span>}
                      </p>
                    </div>
                    <span className={`text-xs border rounded-full px-2 py-0.5 ${isOn ? "bg-success/10 text-success border-success/20" : isRisk ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-primary/10 text-primary border-primary/20"}`}>
                      {isOn ? "Passed ✓" : isRisk ? "At Risk" : "On Track"}
                    </span>
                  </div>
                  {a.rules && (
                    <div className="space-y-2">
                      <MiniProgress label="Profit" value={Math.max(pnl, 0)} max={a.rules.profitTargetPct} color="bg-success" />
                      <MiniProgress label="Drawdown" value={Math.abs(Math.min(pnl, 0))} max={a.rules.maxDrawdownPct}
                        color={Math.abs(Math.min(pnl, 0)) > a.rules.maxDrawdownPct * 0.7 ? "bg-destructive" : "bg-orange-500"} />
                    </div>
                  )}
                  {!a.rules && (
                    <p className="text-xs text-muted-foreground">Progress tracking not available for this plan.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
