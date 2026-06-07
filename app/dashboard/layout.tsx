import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Wallet, User as UserIcon, LogOut, Shield } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { SignOutButton } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/challenges", label: "Challenges", icon: ShoppingBag },
  { href: "/dashboard/payouts", label: "Payouts", icon: Wallet },
  { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const displayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "Trader";
  const email = user?.emailAddresses?.[0]?.emailAddress || "";

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/30 p-4">
        <Logo className="mb-8" />
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors mt-4 border-t border-border/40 pt-4"
            >
              <Shield className="h-4 w-4" />
              Admin Console
            </Link>
          )}
        </nav>
        <div className="space-y-2">
          <div className="rounded-lg p-2 border border-border/40">
            <div className="text-xs font-medium truncate">{displayName}</div>
            <div className="text-xs text-muted-foreground truncate">{email}</div>
          </div>
          <SignOutButton redirectUrl="/">
            <button className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 py-1">
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
