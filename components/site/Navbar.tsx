"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

const nav = [
  { href: "/challenges", label: "Challenges" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <Button asChild size="sm" className="bg-gradient-primary text-[hsl(222,47%,11%)] hover:opacity-90 shadow-ice">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link href="/sign-in">Sign in</Link></Button>
              <Button asChild size="sm" className="bg-gradient-primary text-[hsl(222,47%,11%)] hover:opacity-90 shadow-ice">
                <Link href="/sign-up">Get funded</Link>
              </Button>
            </>
          )}
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/50 px-4 py-4 space-y-3 bg-background/95">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">
              {n.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            {isSignedIn ? (
              <Button asChild size="sm" className="flex-1 bg-gradient-primary text-[hsl(222,47%,11%)]"><Link href="/dashboard">Dashboard</Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="flex-1"><Link href="/sign-in">Sign in</Link></Button>
                <Button asChild size="sm" className="flex-1 bg-gradient-primary text-[hsl(222,47%,11%)]"><Link href="/sign-up">Get funded</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
