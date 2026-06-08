import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { ShoppingBag, Search, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Order {
  id: number;
  cart_id: string;
  user_id: string;
  user_email: string;
  plan_id: string;
  plan_label: string;
  amount: string;
  status: string;
  tran_ref: string | null;
  created_at: string;
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    paid: "bg-green-500/15 text-green-400 border-green-500/20",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    failed: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  return map[status] ?? "bg-white/10 text-muted-foreground border-white/10";
}

export default function AdminOrders() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setOrders(await res.json());
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.cart_id?.toLowerCase().includes(q) ||
      o.user_email?.toLowerCase().includes(q) ||
      o.plan_label?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1.5">All challenge purchases and payment records.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Badge variant="outline">{loading ? "…" : `${filtered.length} orders`}</Badge>
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
          <span>Order ID</span>
          <span>User</span>
          <span>Plan</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              {orders.length === 0
                ? "No orders yet. PayTabs webhooks will populate orders here after successful payments."
                : "No orders match your search."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((order) => (
              <div key={order.id} className="grid grid-cols-5 px-6 py-4 text-sm items-center hover:bg-white/2 transition-colors">
                <span className="font-mono text-xs text-muted-foreground truncate pr-2" title={order.cart_id}>
                  {order.cart_id.slice(0, 20)}…
                </span>
                <span className="truncate pr-2 text-muted-foreground" title={order.user_email}>
                  {order.user_email || order.user_id.slice(0, 12)}
                </span>
                <span>{order.plan_label || order.plan_id}</span>
                <span className="font-semibold">${parseFloat(order.amount).toFixed(2)}</span>
                <span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${statusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
