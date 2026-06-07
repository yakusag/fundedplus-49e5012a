import { Users, ShoppingBag, Wallet, DollarSign } from "lucide-react";

export const metadata = { title: "Admin — FundedPlus" };

export default function AdminPage() {
  const cards = [
    { title: "Total users", value: "—", icon: Users },
    { title: "Total orders", value: "—", icon: ShoppingBag },
    { title: "Pending payouts", value: "—", icon: Wallet },
    { title: "Revenue (all-time)", value: "—", icon: DollarSign },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <p className="text-muted-foreground mt-1">Manage users, orders, challenges, and payouts.</p>
      </div>
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
      <div className="glass rounded-2xl p-6">
        <p className="text-sm text-muted-foreground">Connect a database to see live stats. Use Clerk Dashboard to manage users and assign admin roles via <code className="text-primary">publicMetadata.role = &quot;admin&quot;</code>.</p>
      </div>
    </div>
  );
}
