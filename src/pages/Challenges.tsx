import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";

export default function Challenges() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold">
            Trading <span className="text-gradient">Challenges</span>
          </h1>
          <p className="mt-4 text-muted-foreground">Two phases. Clear targets. Real capital when you pass.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {PLANS.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-hover rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Account</div>
                  <div className="text-3xl font-display font-bold">{p.label}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-gradient">${p.price}</div>
                  <div className="text-xs text-muted-foreground">one-time</div>
                </div>
              </div>

              <ul className="mt-6 space-y-0 flex-1">
                {[
                  ["Profit target (P1)", `${p.profitTarget}%`],
                  ["Profit target (P2)", "5%"],
                  ["Max drawdown", `${p.maxDrawdown}%`],
                  ["Daily drawdown", `${p.dailyDrawdown}%`],
                  ["Profit split", `${p.profitShare}%`],
                  ["Min trading days", "None"],
                ].map(([label, value]) => (
                  <li key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />{label}
                    </span>
                    <span className="font-medium">{value}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="mt-6 w-full shadow-glow-sm">
                <Link to={`/dashboard/checkout/${p.id}`}>Buy {p.label} challenge</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
