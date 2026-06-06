import { createFileRoute, Outlet, Link, redirect, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingBag, Wallet, User as UserIcon, LogOut, Shield } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthLayout,
});

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/challenges", label: "Challenges", icon: ShoppingBag, exact: false },
  { to: "/dashboard/payouts", label: "Payouts", icon: Wallet, exact: false },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon, exact: false },
] as const;

function AuthLayout() {
  const { user } = Route.useRouteContext();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/30 p-4">
        <Logo className="mb-8" />
        <nav className="space-y-1 flex-1">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              activeProps={{ className: "bg-gradient-primary text-primary-foreground hover:opacity-90" }}
              activeOptions={{ exact: i.exact }}
            >
              <i.icon className="h-4 w-4" />
              {i.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors mt-4 border-t border-border/40 pt-4"
            >
              <Shield className="h-4 w-4" />
              Admin Console
            </Link>
          )}
        </nav>
        <div className="space-y-2">
          <div className="rounded-lg p-2 border border-border/40">
            <div className="text-xs font-medium truncate">{user.user_metadata?.full_name || user.email}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
          <button onClick={signOut} className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 py-1">
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
