import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            Trade with funded capital. Keep up to 90% of profits. Built for serious traders.
          </p>
        </div>
        <FooterCol title="Product" links={[
          { to: "/challenges", label: "Challenges" },
          { to: "/pricing", label: "Pricing" },
          { to: "/faq", label: "FAQ" },
        ]} />
        <FooterCol title="Company" links={[
          { to: "/about", label: "About" },
        ]} />
        <FooterCol title="Account" links={[
          { to: "/auth/sign-in", label: "Sign in" },
          { to: "/auth/sign-up", label: "Sign up" },
          { to: "/dashboard", label: "Dashboard" },
        ]} />
      </div>
      <div className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FundedPlus. Trading involves risk.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
