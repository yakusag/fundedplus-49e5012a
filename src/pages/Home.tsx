import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Zap, DollarSign, Trophy, Users, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <Features />
      <PlansPreview />
      <Steps />
      <CTA />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(ellipse, #38bdf8 0%, #818cf8 50%, transparent 80%)" }} />
      <div className="container relative mx-auto px-4 py-28 md:py-40 text-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium mb-8 border border-primary/20">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            New pricing — $5K from $39 · MT4 &amp; MT5 · Free demo
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-5xl text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.02] tracking-tight"
        >
          Get funded.{" "}
          <span className="shimmer-text">Trade bigger.</span>
          <br />Keep the profits.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
        >
          Prove your edge in our 2-step evaluation and trade accounts up to $200,000.
          Fast payouts. Transparent rules. No tricks.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Button asChild size="lg" className="h-13 px-8 text-base shadow-glow">
            <Link to="/challenges">Start from $39 <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-13 px-8 text-base">
            <Link to="/challenges">Try free demo</Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-5 text-xs text-muted-foreground"
        >
          {["MetaTrader 4", "MetaTrader 5", "Free demo account", "KYC verified payouts"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: "$12M+", label: "Paid to traders" },
    { value: "24h", label: "Payout window" },
    { value: "90%", label: "Max profit split" },
    { value: "120+", label: "Countries" },
  ];
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            className="glass-hover rounded-2xl p-6 text-center"
          >
            <div className="text-3xl md:text-4xl font-display font-bold text-gradient">{s.value}</div>
            <div className="mt-1.5 text-xs text-muted-foreground uppercase tracking-widest">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: TrendingUp, title: "MT4 & MT5 ready", desc: "Forex, indices, crypto, commodities. Trade on MetaTrader 4 or 5 — your call." },
    { icon: Shield, title: "Fair rules", desc: "Clear drawdown limits. No hidden gotchas. Daily 5%, total 10%." },
    { icon: Zap, title: "Fast payouts", desc: "First payout in 14 days, then every 14 days. Processed in 24 hours." },
    { icon: DollarSign, title: "Up to 90% split", desc: "Keep more of what you earn. Profit splits scale with account size." },
    { icon: Trophy, title: "Scale your account", desc: "Hit targets and double your account up to $400K total funding." },
    { icon: Users, title: "Trader-first support", desc: "Real humans, 7 days a week. Avg response time under 2 hours." },
  ];
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-display font-bold">
          Why traders choose <span className="text-gradient">FundedPlus</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Everything you need to scale a trading career — without risking your own capital.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} viewport={{ once: true }}
            className="glass-hover rounded-2xl p-6"
          >
            <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow-sm">
              <f.icon className="h-5 w-5 text-[hsl(222,47%,8%)]" />
            </div>
            <h3 className="font-display font-semibold text-lg">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PlansPreview() {
  const featured = PLANS.slice(2, 5);
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-display font-bold">
          Pick your <span className="text-gradient">account size</span>
        </h2>
        <p className="mt-4 text-muted-foreground">From $5K to $200K. Pay once, trade as long as you follow the rules.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 items-center">
        {featured.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            className={`rounded-2xl p-8 ${i === 1
              ? "bg-gradient-primary text-[hsl(222,47%,8%)] shadow-glow scale-105"
              : "glass"
            }`}
          >
            <div className="text-sm font-medium opacity-80">{p.label} account</div>
            <div className="mt-2 text-5xl font-display font-bold">${p.price}</div>
            <div className="text-xs opacity-70 mt-1">one-time fee</div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                `${p.profitTarget}% profit target`,
                `${p.maxDrawdown}% max drawdown`,
                `Up to ${p.profitShare}% profit split`,
                "Unlimited trading days",
              ].map((item) => (
                <li key={item} className="flex gap-2 items-center">
                  <CheckCircle2 className="h-4 w-4 shrink-0 opacity-80" /> {item}
                </li>
              ))}
            </ul>
            <Button asChild className={`mt-8 w-full ${i === 1 ? "bg-[hsl(222,47%,8%)] text-foreground hover:bg-[hsl(222,47%,6%)]" : ""}`}>
              <Link to="/challenges">Start with {p.label}</Link>
            </Button>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Button asChild variant="ghost" className="text-muted-foreground">
          <Link to="/pricing">See all plans <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}

function Steps() {
  const steps = [
    { n: "01", title: "Pick a plan", desc: "Choose an account size that fits your style and capital ambition." },
    { n: "02", title: "Pass the evaluation", desc: "Hit 8% profit in phase 1, 5% in phase 2. No time pressure." },
    { n: "03", title: "Get funded", desc: "Receive your funded account credentials and start trading real capital." },
    { n: "04", title: "Withdraw profits", desc: "Request payouts every 14 days. Processed within 24 hours." },
  ];
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-display font-bold">How it <span className="text-gradient">works</span></h2>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            className="glass-hover rounded-2xl p-6"
          >
            <div className="text-4xl font-display font-bold text-gradient">{s.n}</div>
            <h3 className="mt-4 font-display font-semibold text-lg">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-20 text-center shadow-glow">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[hsl(222,47%,8%)]">Ready to trade bigger?</h2>
          <p className="mt-4 text-[hsl(222,47%,8%)]/70 max-w-xl mx-auto">Join thousands of funded traders. Your edge deserves real capital.</p>
          <Button asChild size="lg" className="mt-8 bg-[hsl(222,47%,8%)] text-foreground hover:bg-[hsl(222,47%,6%)] h-13 px-10 text-base shadow-none">
            <Link to="/challenges">Get funded now <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
