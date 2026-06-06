import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Users, ShoppingBag, Wallet, DollarSign, Loader2 } from "lucide-react";
import { adminStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — FundedPlus" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminOverview,
});

function AdminOverview() {
  const fetchStats = useServerFn(adminStats);
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fetchStats() });

  const cards = [
    { title: "Total users", value: data?.users ?? "—", icon: Users },
    { title: "Total orders", value: data?.orders ?? "—", icon: ShoppingBag },
    { title: "Pending payouts", value: data?.pendingPayouts ?? "—", icon: Wallet },
    { title: "Revenue (all-time)", value: data ? `$${data.revenue.toLocaleString()}` : "—", icon: DollarSign },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <p className="text-muted-foreground mt-1">Manage users, orders, challenges, and payouts.</p>
      </div>
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.title} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.title}</span>
                <c.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-3 text-3xl font-bold">{c.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
