import { createFileRoute, Link } from "@tanstack/react-router";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Shield } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { isClerkConfigured } from "@/integrations/clerk";

// Admin area — intentionally NOT linked from public navigation.
// Role check: Clerk publicMetadata.role === "admin"
export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — FundedPlus" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminPage,
});

function AdminPage() {
  if (!isClerkConfigured) {
    return <div className="p-10">Configure Clerk first.</div>;
  }
  return (
    <>
      <SignedOut><RedirectToSignIn redirectUrl="/admin" /></SignedOut>
      <SignedIn><AdminGate /></SignedIn>
    </>
  );
}

function AdminGate() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;
  const role = (user?.publicMetadata as any)?.role;
  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <Shield className="h-10 w-10 mx-auto text-destructive" />
          <h1 className="mt-4 text-xl font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is restricted to administrators. To grant admin access, set
            <code className="mx-1 px-1 rounded bg-muted">publicMetadata.role = "admin"</code>
            on your Clerk user.
          </p>
          <Link to="/" className="mt-6 inline-block text-primary text-sm">← Back home</Link>
        </div>
      </div>
    );
  }
  return <AdminConsole />;
}

function AdminConsole() {
  const cards = [
    { title: "Users", value: "—", desc: "Manage trader accounts" },
    { title: "Orders", value: "—", desc: "Challenge purchases" },
    { title: "Payouts", value: "—", desc: "Pending withdrawal requests" },
    { title: "Revenue (30d)", value: "$—", desc: "Gross from PayTabs" },
  ];
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-xs uppercase tracking-wider rounded-full bg-destructive/20 text-destructive px-2 py-0.5">Admin</span>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-10 space-y-8">
        <h1 className="text-3xl font-bold">Admin console</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.title} className="glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.title}</div>
              <div className="mt-3 text-3xl font-bold">{c.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.desc}</div>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">
          Hook this up to Lovable Cloud (Supabase) to persist users, orders, and payouts. Enable Cloud and ask me to wire it.
        </div>
      </div>
    </div>
  );
}
