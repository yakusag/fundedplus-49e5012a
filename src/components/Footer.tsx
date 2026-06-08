import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
              <div className="h-7 w-7 rounded-lg bg-gradient-primary flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-[hsl(222,47%,8%)]" />
              </div>
              <span className="text-gradient">FundedPlus</span>
            </Link>
            <p className="mt-3 text-xs text-muted-foreground max-w-xs">
              Proprietary trading firm backing talented traders worldwide with up to $200K in capital.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div className="space-y-3">
              <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground">Platform</p>
              {[["Challenges", "/challenges"], ["Pricing", "/pricing"], ["FAQ", "/faq"]].map(([l, h]) => (
                <Link key={h} to={h} className="block text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
            <div className="space-y-3">
              <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground">Company</p>
              {[["About", "/about"], ["Dashboard", "/dashboard"]].map(([l, h]) => (
                <Link key={h} to={h} className="block text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
            <div className="space-y-3">
              <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground">Support</p>
              <a href="mailto:support@fundedplus.com" className="block text-muted-foreground hover:text-foreground transition-colors">support@fundedplus.com</a>
              <a href="mailto:founders@fundedplus.com" className="block text-muted-foreground hover:text-foreground transition-colors">founders@fundedplus.com</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FundedPlus. All rights reserved.</p>
          <p>Trading involves risk. Past performance is not indicative of future results.</p>
        </div>
      </div>
    </footer>
  );
}
