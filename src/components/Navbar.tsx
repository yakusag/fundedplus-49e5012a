import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/challenges", label: "Challenges" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <img src="/logo.png" alt="FundedPlus" className="h-9 w-9 object-contain" />
          <span className="text-gradient">FundedPlus</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} to={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <SignedOut>
            <Button variant="ghost" size="sm" onClick={() => navigate("/sign-in")}>Sign in</Button>
            <Button size="sm" onClick={() => navigate("/sign-up")}>Get funded</Button>
          </SignedOut>
          <SignedIn>
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <button className="md:hidden text-muted-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-background/95 px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.href} to={l.href} className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
            <SignedOut>
              <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate("/sign-in"); setOpen(false); }}>Sign in</Button>
              <Button size="sm" className="w-full" onClick={() => { navigate("/sign-up"); setOpen(false); }}>Get funded</Button>
            </SignedOut>
            <SignedIn>
              <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate("/dashboard"); setOpen(false); }}>Dashboard</Button>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}
