import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Plus, Trash2, Monitor, Loader2, RefreshCw, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PoolAccount = {
  id: number;
  login: string;
  server: string;
  platform: string;
  plan_id: string | null;
  assigned_to: string | null;
  assigned_at: string | null;
  created_at: string;
  is_active: boolean;
};

export default function AdminAccountPool() {
  const { getToken } = useAuth();
  const [accounts, setAccounts] = useState<PoolAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    login: "", password: "", server: "Fundedelite-Server", platform: "mt5", plan_id: ""
  });

  async function load() {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/account-pool", { headers: { Authorization: `Bearer ${token}` } });
      setAccounts(await res.json());
    } catch { toast.error("Failed to load accounts"); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!form.login || !form.password || !form.server) {
      toast.error("Login, password and server are required");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/account-pool", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) { toast.error("Failed to add account"); setSaving(false); return; }
      toast.success("Account added to pool!");
      setForm({ login: "", password: "", server: "Fundedelite-Server", platform: "mt5", plan_id: "" });
      setShowForm(false);
      load();
    } catch { toast.error("Error"); }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    try {
      const token = await getToken();
      await fetch(`/api/account-pool/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      toast.success("Removed");
      load();
    } catch { toast.error("Error"); }
  }

  const free = accounts.filter(a => !a.assigned_to).length;
  const assigned = accounts.filter(a => a.assigned_to).length;

  return (
    <div className="p-6 md:p-10 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Account Pool</h1>
          <p className="text-sm text-muted-foreground mt-0.5">MT4/MT5 accounts to distribute to traders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Account
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: accounts.length, color: "text-foreground" },
          { label: "Available", value: free, color: "text-success" },
          { label: "Assigned", value: assigned, color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 border border-primary/20 space-y-4">
          <h2 className="font-semibold">New Account</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "login", label: "MT Login", placeholder: "123456" },
              { key: "password", label: "MT Password", placeholder: "••••••••" },
              { key: "server", label: "Server", placeholder: "Fundedelite-Server" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className={key === "server" ? "col-span-2" : ""}>
                <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Platform</label>
              <select
                value={form.platform}
                onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
              >
                <option value="mt5">MT5</option>
                <option value="mt4">MT4</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Plan (optional)</label>
              <input
                value={form.plan_id}
                onChange={e => setForm(p => ({ ...p, plan_id: e.target.value }))}
                placeholder="5k / 10k / ..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button onClick={handleAdd} disabled={saving} className="flex-1 gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Add to Pool"}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <Monitor className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">No accounts yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add MT4/MT5 accounts to start distributing them to traders.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {accounts.map(a => (
            <div key={a.id} className="glass rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${a.assigned_to ? "bg-primary/10" : "bg-success/10"}`}>
                  {a.assigned_to ? <Users className="h-4 w-4 text-primary" /> : <CheckCircle2 className="h-4 w-4 text-success" />}
                </div>
                <div>
                  <p className="text-sm font-mono font-medium">{a.login} <span className="text-muted-foreground font-sans">— {a.server}</span></p>
                  <p className="text-xs text-muted-foreground">
                    {a.platform.toUpperCase()} {a.plan_id ? `· ${a.plan_id}` : ""} {a.assigned_to ? `· Assigned` : "· Free"}
                  </p>
                </div>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
