import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Users, ShoppingBag, Wallet, DollarSign, TrendingUp } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalOrders: number;
  pendingPayouts: number;
  revenue: number;
}

export default function AdminHome() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled && res.ok) setStats(await res.json());
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken]);

  const fmt = (n: number | undefined) =>
    loading ? "…" : n === undefined ? "—" : n.toLocaleString();

  const fmtMoney = (n: number | undefined) =>
    loading ? "…" : n === undefined ? "—" : `$${n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const cards = [
    { title: "Total users", value: fmt(stats?.totalUsers), icon: Users, color: "text-primary" },
    { title: "Total orders", value: fmt(stats?.totalOrders), icon: ShoppingBag, color: "text-success" },
    { title: "Pending payouts", value: fmt(stats?.pendingPayouts), icon: Wallet, color: "text-yellow-400" },
    { title: "Revenue (all-time)", value: fmtMoney(stats?.revenue), icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Console</h1>
        <p className="text-muted-foreground mt-1.5">Manage users, orders, challenges, and payouts.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="glass-hover rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{c.title}</span>
              <div className={`h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center ${c.color}`}>
                <c.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 border border-primary/10">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-display font-semibold">Live data</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Stats are pulled in real time from the database. Admin access is restricted to{" "}
          <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">gunsroll0@gmail.com</code>.
          Use the navigation to manage users, orders, and payouts.
        </p>
      </div>
    </div>
  );
}
