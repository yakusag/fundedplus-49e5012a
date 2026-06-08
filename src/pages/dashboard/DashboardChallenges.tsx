import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";
import { CheckCircle2 } from "lucide-react";

export default function DashboardChallenges() {
  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Buy a Challenge</h1>
        <p className="text-muted-foreground mt-1.5">Pick an account size to start your trading evaluation.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLANS.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="glass-hover rounded-2xl p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Account</div>
                <div className="text-2xl font-display font-bold mt-1">{p.label}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-display font-bold text-gradient">${p.price}</div>
                <div className="text-xs text-muted-foreground">one-time</div>
              </div>
            </div>
            <ul className="space-y-0 flex-1 text-sm">
              {[
                ["Profit target", `${p.profitTarget}%`],
                ["Max drawdown", `${p.maxDrawdown}%`],
                ["Profit split", `${p.profitShare}%`],
              ].map(([l, v]) => (
                <li key={l} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />{l}
                  </span>
                  <span className="font-medium">{v}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-5 w-full shadow-glow-sm">
              <Link to={`/dashboard/checkout/${p.id}`}>Checkout</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
