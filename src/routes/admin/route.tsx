import { createFileRoute, Outlet, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, ShoppingBag, Wallet, Trophy, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth" });
    return { user };
  },
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users, exact: false },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
  { to: "/admin/plans", label: "Challenges", icon: Trophy, exact: false },
  { to: "/admin/payouts", label: "Payouts", icon: Wallet, exact: false },
] as const;

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user.id]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  if (isAdmin === null) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">Admin privileges required.</p>
        <Link to="/dashboard" className="mt-6 inline-block text-primary text-sm">← Back to dashboard</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/30 p-4">
        <div className="flex items-center gap-2 mb-8">
          <Logo />
          <span className="text-[10px] uppercase tracking-wider rounded-full bg-destructive/20 text-destructive px-2 py-0.5">Admin</span>
        </div>
        <nav className="space-y-1 flex-1">
          {items.map((i) => (
            <Link key={i.to} to={i.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              activeProps={{ className: "bg-gradient-primary text-primary-foreground hover:opacity-90" }}
              activeOptions={{ exact: i.exact }}>
              <i.icon className="h-4 w-4" />{i.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2">
          <Link to="/dashboard" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 py-1">
            <ArrowLeft className="h-3 w-3" /> Back to dashboard
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 py-1">
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden"><Outlet /></main>
    </div>
  );
}
