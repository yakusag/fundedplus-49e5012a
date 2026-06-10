import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Monitor, Copy, Check, Eye, EyeOff, Server, Hash, KeyRound, Loader2, AlertCircle, TrendingUp, ShieldAlert, Trophy, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type ChallengeRules = {
  balance: number;
  profitTargetPct: number;
  maxDrawdownPct: number;
  dailyLossPct: number;
  minDays: number;
};

type Account = {
  id: number;
  login: string;
  password: string;
  server: string;
  platform: string;
  plan_id: string | null;
  assigned_at: string;
  current_pnl_pct: number | null;
  progress_status: string | null;
  notes: string | null;
  progress_updated_at: string | null;
  rules: ChallengeRules | null;
};

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  return (
    <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded">
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function StatusBadge({ status, pnlPct, rules }: { status: string | null; pnlPct: number | null; rules: ChallengeRules | null }) {
  let label = "Active";
  let cls = "bg-primary/10 text-primary border-primary/20";

  const pnl = pnlPct ?? 0;
  if (status === "passed" || (rules && pnl >= rules.profitTargetPct)) {
    label = "Passed ✓"; cls = "bg-success/10 text-success border-success/20";
  } else if (status === "failed" || (rules && pnl <= -rules.maxDrawdownPct)) {
    label = "Failed"; cls = "bg-destructive/10 text-destructive border-destructive/20";
  } else if (status === "at_risk" || (rules && pnl <= -(rules.maxDrawdownPct * 0.7))) {
    label = "At Risk ⚠"; cls = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  } else if (pnl > 0) {
    label = "On Track"; cls = "bg-success/10 text-success border-success/20";
  }

  return <span className={`text-xs border rounded-full px-2.5 py-0.5 ${cls}`}>{label}</span>;
}

function ChallengeProgress({ account }: { account: Account }) {
  const { rules } = account;
  const pnl = account.current_pnl_pct ?? 0;
  if (!rules) return null;

  const profitProgress = Math.max(pnl, 0);
  const drawdownUsed = Math.abs(Math.min(pnl, 0));
  const profitDollar = (pnl / 100) * rules.balance;
  const targetDollar = (rules.profitTargetPct / 100) * rules.balance;
  const maxDDDollar = (rules.maxDrawdownPct / 100) * rules.balance;
  const dailyDollar = (rules.dailyLossPct / 100) * rules.balance;

  return (
    <div className="mt-5 pt-5 border-t border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Challenge Progress</p>
        {account.progress_updated_at && (
          <p className="text-xs text-muted-foreground">
            Updated {new Date(account.progress_updated_at).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Current P&L", value: pnl >= 0 ? `+${pnl.toFixed(2)}%` : `${pnl.toFixed(2)}%`, sub: `$${profitDollar >= 0 ? "+" : ""}${profitDollar.toFixed(0)}`, color: pnl >= 0 ? "text-success" : "text-destructive" },
          { label: "Target", value: `${rules.profitTargetPct}%`, sub: `$${targetDollar.toFixed(0)}`, color: "text-primary" },
          { label: "Min Days", value: `${rules.minDays}`, sub: "trading days", color: "text-muted-foreground" },
        ].map(s => (
          <div key={s.label} className="bg-white/3 rounded-xl p-3 text-center">
            <p className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-muted-foreground/60">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Profit progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-success" />
            <span className="text-xs text-muted-foreground">Profit Target</span>
          </div>
          <span className="text-xs font-mono">{profitProgress.toFixed(2)}% / {rules.profitTargetPct}%</span>
        </div>
        <ProgressBar value={profitProgress} max={rules.profitTargetPct} color="bg-gradient-to-r from-success/70 to-success" />
      </div>

      {/* Drawdown */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs text-muted-foreground">Drawdown Used</span>
          </div>
          <span className="text-xs font-mono">{drawdownUsed.toFixed(2)}% / {rules.maxDrawdownPct}%</span>
        </div>
        <ProgressBar value={drawdownUsed} max={rules.maxDrawdownPct}
          color={drawdownUsed > rules.maxDrawdownPct * 0.7 ? "bg-gradient-to-r from-orange-500/70 to-destructive" : "bg-gradient-to-r from-orange-500/40 to-orange-500"} />
      </div>

      {/* Rules quick ref */}
      <div className="bg-white/3 rounded-xl p-3">
        <p className="text-xs text-muted-foreground font-medium mb-2">Challenge Rules</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[
            { label: "Profit target", value: `${rules.profitTargetPct}% ($${targetDollar.toFixed(0)})` },
            { label: "Max drawdown", value: `${rules.maxDrawdownPct}% ($${maxDDDollar.toFixed(0)})` },
            { label: "Daily loss limit", value: `${rules.dailyLossPct}% ($${dailyDollar.toFixed(0)})` },
            { label: "Min trading days", value: `${rules.minDays} days` },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-0.5">
              <span className="text-xs text-muted-foreground">{r.label}</span>
              <span className="text-xs font-medium">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {account.notes && (
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3">
          <p className="text-xs text-muted-foreground">Admin note: <span className="text-foreground">{account.notes}</span></p>
        </div>
      )}
    </div>
  );
}

function AccountCard({ account }: { account: Account }) {
  const [showPass, setShowPass] = useState(false);
  const rows = [
    { icon: Hash, label: "Login", value: String(account.login), secret: false },
    { icon: KeyRound, label: "Password", value: account.password, secret: true },
    { icon: Server, label: "Server", value: account.server, secret: false },
    { icon: Monitor, label: "Platform", value: account.platform.toUpperCase(), secret: false },
  ];
  return (
    <div className="glass rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-sm">
          <Monitor className="h-5 w-5 text-[hsl(222,47%,8%)]" />
        </div>
        <div>
          <p className="font-semibold">
            {account.platform.toUpperCase()} — {account.plan_id ? account.plan_id.toUpperCase() : "Challenge"} Account
            {account.rules && <span className="ml-2 text-xs text-muted-foreground font-normal">(${account.rules.balance.toLocaleString()})</span>}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Activated {new Date(account.assigned_at).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={account.progress_status} pnlPct={account.current_pnl_pct} rules={account.rules} />
        </div>
      </div>

      <div className="space-y-2">
        {rows.map(({ icon: Icon, label, value, secret }) => (
          <div key={label} className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2.5 text-sm">
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground w-16">{label}</span>
              <span className="font-mono font-medium">{secret && !showPass ? "••••••••" : value}</span>
            </div>
            <div className="flex items-center gap-1">
              {secret && (
                <button onClick={() => setShowPass(p => !p)} className="text-muted-foreground hover:text-foreground p-1 rounded">
                  {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              )}
              <CopyBtn value={value} />
            </div>
          </div>
        ))}
      </div>

      <ChallengeProgress account={account} />

      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-muted-foreground">
          Open <span className="font-medium text-foreground">{account.platform.toUpperCase()}</span> → File → Open an Account → search <span className="font-mono text-primary">{account.server}</span>
        </p>
      </div>
    </div>
  );
}

export default function DashboardAccounts() {
  const { getToken } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [platform, setPlatform] = useState<"mt4" | "mt5">("mt5");
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  async function loadAccounts() {
    try {
      const token = await getToken();
      const res = await fetch("/api/my-accounts", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch { setAccounts([]); }
    setLoading(false);
  }

  useEffect(() => { loadAccounts(); }, []);

  async function handleAssign() {
    setAssigning(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/assign-account", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (data.error === "no_accounts") { toast.error("No available accounts right now. Please contact support."); setAssigning(false); return; }
      if (data.error) { toast.error(data.error); setAssigning(false); return; }
      toast.success(data.already ? "Account loaded!" : "Trading account assigned successfully!");
      setShowPlatformPicker(false);
      loadAccounts();
    } catch { toast.error("Failed. Try again."); }
    setAssigning(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">My Accounts</h1>
          <p className="text-muted-foreground mt-1.5">Your MetaTrader trading accounts & challenge progress</p>
        </div>
        {accounts.length === 0 && (
          <Button onClick={() => setShowPlatformPicker(true)} className="gap-2 shadow-glow-sm">
            <Monitor className="h-4 w-4" /> Activate Account
          </Button>
        )}
      </div>

      {showPlatformPicker && (
        <div className="glass rounded-2xl p-6 border border-primary/20">
          <h2 className="font-display font-semibold text-lg mb-1">Choose Platform</h2>
          <p className="text-sm text-muted-foreground mb-5">Which MetaTrader platform do you use?</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["mt4", "mt5"] as const).map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`rounded-xl border p-4 text-left transition-all ${platform === p ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-white/3 text-muted-foreground hover:border-white/20"}`}
              >
                <p className="font-bold text-lg">{p.toUpperCase()}</p>
                <p className="text-xs mt-0.5">{p === "mt4" ? "MetaTrader 4 — classic" : "MetaTrader 5 — advanced"}</p>
              </button>
            ))}
          </div>
          <div className="bg-white/3 rounded-xl p-3 flex items-start gap-2 mb-5">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">Your demo account credentials will appear here instantly.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAssign} disabled={assigning} className="flex-1 gap-2">
              {assigning ? <><Loader2 className="h-4 w-4 animate-spin" /> Activating...</> : "Activate Trading Account"}
            </Button>
            <Button variant="outline" onClick={() => setShowPlatformPicker(false)} disabled={assigning}>Cancel</Button>
          </div>
        </div>
      )}

      {accounts.length === 0 && !showPlatformPicker ? (
        <div className="glass rounded-2xl p-10 text-center border border-white/5">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Monitor className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-display font-bold">No accounts yet</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Purchase a challenge first, then activate your trading account here.</p>
          <Button asChild className="mt-5" variant="outline">
            <Link to="/dashboard/challenges">Browse Challenges</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map((a, i) => <AccountCard key={i} account={a} />)}
        </div>
      )}
    </div>
  );
}
