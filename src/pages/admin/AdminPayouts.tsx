import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Wallet, Search, RefreshCw, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface PayoutRequest {
  id: number;
  user_id: string;
  user_email: string;
  amount: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface PayoutsData {
  requests: PayoutRequest[];
  pendingTotal: number;
  paidThisMonth: number;
  paidAllTime: number;
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    paid: "bg-green-500/15 text-green-400 border-green-500/20",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    rejected: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  return map[status] ?? "bg-white/10 text-muted-foreground border-white/10";
}

function fmtMoney(n: number) {
  return `$${n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AdminPayouts() {
  const { getToken } = useAuth();
  const [data, setData] = useState<PayoutsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/payouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setData(await res.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const token = await getToken();
      await fetch(`/api/admin/payouts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      await load();
    } finally {
      setUpdating(null);
    }
  };

  const requests = data?.requests ?? [];
  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.user_email?.toLowerCase().includes(q) ||
      r.status?.toLowerCase().includes(q) ||
      r.notes?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Payouts</h1>
        <p className="text-muted-foreground mt-1.5">Manage and approve trader payout requests.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Pending approval", value: loading ? "…" : fmtMoney(data?.pendingTotal ?? 0), color: "text-yellow-400" },
          { label: "Paid this month", value: loading ? "…" : fmtMoney(data?.paidThisMonth ?? 0), color: "text-success" },
          { label: "Total paid out", value: loading ? "…" : fmtMoney(data?.paidAllTime ?? 0), color: "text-primary" },
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
          <Input
            placeholder="Search payouts..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Badge variant="outline">{loading ? "…" : `${filtered.length} requests`}</Badge>
        <button
          onClick={load}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-white/5 text-xs uppercase tracking-widest text-muted-foreground">
          <span>Trader</span>
          <span>Amount</span>
          <span>Requested</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading payouts…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Wallet className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              {requests.length === 0
                ? "No payout requests yet. They will appear here once traders request withdrawals."
                : "No payouts match your search."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((pr) => (
              <div key={pr.id} className="grid grid-cols-5 px-6 py-4 text-sm items-center hover:bg-white/2 transition-colors">
                <span className="truncate pr-2 text-muted-foreground" title={pr.user_email}>
                  {pr.user_email || pr.user_id.slice(0, 12)}
                </span>
                <span className="font-semibold">{fmtMoney(parseFloat(pr.amount))}</span>
                <span className="text-muted-foreground text-xs">
                  {new Date(pr.created_at).toLocaleDateString()}
                </span>
                <span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${statusBadge(pr.status)}`}>
                    {pr.status}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {pr.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(pr.id, "paid")}
                        disabled={updating === pr.id}
                        className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors disabled:opacity-50"
                        title="Approve"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => updateStatus(pr.id, "rejected")}
                        disabled={updating === pr.id}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
                        title="Reject"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
