import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Wallet, Trophy, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Route as AuthRoute } from "./route";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — FundedPlus" }] }),
  component: DashboardHome,
});

function DashboardHome() {
  const { user } = AuthRoute.useRouteContext();
  const name = user.user_metadata?.full_name?.split(" ")[0] || "trader";
  const stats = [
    { label: "Active accounts", value: "0", icon: Trophy },
    { label: "Total profit", value: "$0", icon: TrendingUp },
    { label: "Available payout", value: "$0", icon: Wallet },
    { label: "Trades this week", value: "0", icon: Activity },
  ];
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {name}.</h1>
        <p className="text-muted-foreground mt-1">Here's a snapshot of your trading activity.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold">No active challenge yet</h2>
        <p className="mt-2 text-muted-foreground">Start your first challenge and get on the path to a funded account.</p>
        <Button asChild className="mt-6 bg-gradient-primary text-primary-foreground shadow-ice">
          <Link to="/dashboard/challenges">Browse challenges</Link>
        </Button>
      </div>
    </div>
  );
}
