import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useUser, UserButton, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { LayoutDashboard, ShoppingBag, Wallet, User as UserIcon } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { isClerkConfigured } from "@/integrations/clerk";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthLayout,
});

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/challenges", label: "Challenges", icon: ShoppingBag },
  { to: "/dashboard/payouts", label: "Payouts", icon: Wallet },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
] as const;

function AuthLayout() {
  if (!isClerkConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold">Authentication not configured</h2>
          <p className="mt-2 text-sm text-muted-foreground">Paste your Clerk publishable key in chat to enable the dashboard.</p>
          <Link to="/" className="mt-6 inline-block text-primary text-sm">← Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut><RedirectToSignIn redirectUrl="/dashboard" /></SignedOut>
      <SignedIn>
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
                  activeOptions={{ exact: i.to === "/dashboard" }}
                >
                  <i.icon className="h-4 w-4" />
                  {i.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 rounded-lg p-2 border border-border/40">
              <UserButton afterSignOutUrl="/" />
              <UserName />
            </div>
          </aside>
          <main className="flex-1 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </SignedIn>
    </>
  );
}

function UserName() {
  const { user } = useUser();
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs font-medium truncate">{user?.firstName || user?.username || "Trader"}</div>
      <div className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</div>
    </div>
  );
}
