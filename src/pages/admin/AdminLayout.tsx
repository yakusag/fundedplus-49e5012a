import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { LayoutDashboard, Users, ShoppingBag, Wallet, Trophy, LogOut, ArrowLeft, TrendingUp, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/plans", label: "Challenges", icon: Trophy },
  { href: "/admin/payouts", label: "Payouts", icon: Wallet },
];

export default function AdminLayout() {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const email = user?.primaryEmailAddress?.emailAddress || "";

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-sm">
          <TrendingUp className="h-4 w-4 text-[hsl(222,47%,8%)]" />
        </div>
        <span className="font-display font-bold text-gradient">FundedPlus</span>
        <span className="text-[10px] uppercase tracking-wider rounded-full bg-destructive/20 text-destructive border border-destructive/30 px-2 py-0.5 ml-1">Admin</span>
      </div>

      <nav className="flex-1 space-y-1">
        {nav.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 pt-4 border-t border-white/5">
        <div className="glass rounded-xl p-3">
          <div className="text-xs font-semibold truncate">Admin</div>
          <div className="text-xs text-muted-foreground truncate mt-0.5">{email}</div>
        </div>
        <Link to="/dashboard" onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </Link>
        <button onClick={() => navigate("/sign-in")}
          className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-card/30 p-5 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-background/90 backdrop-blur px-4 h-14 flex items-center justify-between">
        <span className="font-display font-bold text-gradient">Admin Console</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-muted-foreground">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside className="absolute top-0 left-0 h-full w-64 bg-card border-r border-white/5 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mt-14"><Sidebar /></div>
          </aside>
        </div>
      )}

      <main className="flex-1 md:ml-64 pt-14 md:pt-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
