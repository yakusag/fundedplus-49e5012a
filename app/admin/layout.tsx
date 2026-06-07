import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, ShoppingBag, Wallet, Trophy, LogOut, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { SignOutButton } from "@clerk/nextjs";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/plans", label: "Challenges", icon: Trophy },
  { href: "/admin/payouts", label: "Payouts", icon: Wallet },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  if (user?.publicMetadata?.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/30 p-4">
        <div className="flex items-center gap-2 mb-8">
          <Logo />
          <span className="text-[10px] uppercase tracking-wider rounded-full bg-destructive/20 text-destructive px-2 py-0.5">Admin</span>
        </div>
        <nav className="space-y-1 flex-1">
          {items.map((i) => (
            <Link key={i.href} href={i.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <i.icon className="h-4 w-4" />{i.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 py-1">
            <ArrowLeft className="h-3 w-3" /> Back to dashboard
          </Link>
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
