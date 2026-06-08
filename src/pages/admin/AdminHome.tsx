import { Users, ShoppingBag, Wallet, DollarSign, TrendingUp } from "lucide-react";

export default function AdminHome() {
  const cards = [
    { title: "Total users", value: "—", icon: Users, color: "text-primary" },
    { title: "Total orders", value: "—", icon: ShoppingBag, color: "text-success" },
    { title: "Pending payouts", value: "—", icon: Wallet, color: "text-yellow-400" },
    { title: "Revenue (all-time)", value: "—", icon: DollarSign, color: "text-primary" },
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
          <h2 className="font-display font-semibold">Getting started</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Connect a database to see live stats. Admin access is restricted to{" "}
          <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">gunsroll0@gmail.com</code>.
          Use the navigation to manage users, orders, and payouts.
        </p>
      </div>
    </div>
  );
}
