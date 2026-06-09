import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { UserCircle, Mail, Calendar, Monitor, Copy, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Mt5Account {
  login: string;
  password?: string;
  investor_password: string;
  server: string;
  balance: number;
  platform: string;
  created_at?: string;
}

export default function DashboardProfile() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "—";
  const email = user?.primaryEmailAddress?.emailAddress || "—";
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  const [mt5, setMt5] = useState<Mt5Account | null>(null);
  const [mt5Loading, setMt5Loading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newAccount, setNewAccount] = useState<Mt5Account | null>(null);

  useEffect(() => {
    async function fetchMt5() {
      try {
        const token = await getToken();
        const res = await fetch("/api/my-mt5-account", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.account) setMt5(data.account);
      } catch {
        /* silent */
      } finally {
        setMt5Loading(false);
      }
    }
    fetchMt5();
  }, [getToken]);

  async function handleCreateAccount() {
    setCreating(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/create-mt5-account", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.account) {
        setNewAccount(data.account);
        setMt5(data.account);
        toast.success("MT5 account created successfully!");
      } else {
        toast.error(data.error || "Failed to create account. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setCreating(false);
    }
  }

  function copyToClipboard(value: string, label: string) {
    navigator.clipboard.writeText(value).then(() => toast.success(`${label} copied!`));
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1.5">Your account details and trading credentials.</p>
      </div>

      {/* User card */}
      <div className="glass-hover rounded-2xl p-6 flex items-center gap-5">
        {user?.imageUrl
          ? <img src={user.imageUrl} alt={name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary/30" />
          : <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-sm">
              <UserCircle className="h-8 w-8 text-[hsl(222,47%,8%)]" />
            </div>
        }
        <div>
          <div className="font-display font-bold text-xl">{name}</div>
          <div className="text-muted-foreground text-sm mt-0.5">{email}</div>
        </div>
      </div>

      {/* Account info */}
      <div className="glass rounded-2xl divide-y divide-white/5">
        {[
          { icon: UserCircle, label: "Full name", value: name },
          { icon: Mail, label: "Email address", value: email },
          { icon: Calendar, label: "Member since", value: joined },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-4 px-6 py-4">
            <row.icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">{row.label}</div>
              <div className="text-sm font-medium truncate">{row.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MT5 Trading Account */}
      <div>
        <h2 className="text-xl font-display font-bold mb-3 flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          MT5 Trading Account
        </h2>

        {mt5Loading ? (
          <div className="glass rounded-2xl p-8 flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading account info…</span>
          </div>
        ) : mt5 ? (
          <div className="glass rounded-2xl divide-y divide-white/5">
            {/* Status banner */}
            {newAccount && (
              <div className="px-6 py-3 flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 rounded-t-2xl">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Account created — save your credentials below!
              </div>
            )}

            {[
              { label: "Platform", value: mt5.platform || "MT5", copy: false },
              { label: "Server", value: mt5.server, copy: true },
              { label: "Login", value: mt5.login, copy: true },
              { label: "Balance", value: `$${Number(mt5.balance).toLocaleString()} USD`, copy: false },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-0.5">{row.label}</div>
                  <div className="text-sm font-medium font-mono truncate">{row.value}</div>
                </div>
                {row.copy && (
                  <button
                    onClick={() => copyToClipboard(row.value, row.label)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}

            {/* Password row — only shown for freshly created account */}
            {newAccount?.password && (
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-0.5">Password</div>
                  <div className="text-sm font-medium font-mono">
                    {showPassword ? newAccount.password : "••••••••••••"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(newAccount.password!, "Password")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {!newAccount && (
              <div className="px-6 py-4">
                <div className="flex items-start gap-2 text-xs text-amber-400/80 bg-amber-500/10 rounded-xl p-3">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Your password was shown only once when the account was created. Contact support if you need a reset.</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Monitor className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-lg">No MT5 account yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Create a free $10,000 demo MT5 account on XMGlobal-MT5 2 to start practicing.
              </p>
            </div>
            <Button
              onClick={handleCreateAccount}
              disabled={creating}
              className="shadow-glow"
              size="lg"
            >
              {creating
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account…</>
                : "Create MT5 Demo Account"
              }
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        To update your name or profile picture, visit your Clerk account settings.
      </p>
    </div>
  );
}
