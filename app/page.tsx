import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Zap, DollarSign, Trophy, Users, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";

export const metadata = {
  title: "FundedPlus — Trade Funded Accounts up to $200K",
  description: "Pass our trading challenge and trade funded accounts up to $200,000. Keep up to 90% of profits with fast payouts.",
};

export default function HomePage() {
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
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, hsl(215 80% 30% / 0.5), transparent 60%), radial-gradient(ellipse at bottom right, hsl(210 85% 35% / 0.3), transparent 50%)" }} />
      <div className="container relative mx-auto px-4 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium mb-6">
          <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
          New pricing — $5K from $39 · MT4 &amp; MT5 · Free demo
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl md:text-7xl font-bold leading-[1.05]">
          Get funded. <span className="text-gradient">Trade bigger.</span> Keep the profits.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Prove your edge in our 2-step evaluation and trade accounts up to $200,000.
          Fast payouts. Transparent rules. No tricks.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-gradient-primary text-[hsl(222,47%,11%)] hover:opacity-90 shadow-ice text-base h-12 px-8">
            <Link href="/challenges">Start from $39 <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
            <Link href="/challenges">Try free demo</Link>
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          {["MetaTrader 4", "MetaTrader 5", "Free demo account", "KYC verified payouts"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {t}</span>
          ))}
        </div>
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
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
          </div>
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
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold">Why traders choose <span className="text-gradient">FundedPlus</span></h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Everything you need to scale a trading career — without risking your own capital.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6 hover:shadow-ice transition-shadow">
            <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
              <f.icon className="h-5 w-5 text-[hsl(222,47%,11%)]" />
            </div>
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlansPreview() {
  const featured = PLANS.slice(2, 5);
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold">Pick your <span className="text-gradient">account size</span></h2>
        <p className="mt-4 text-muted-foreground">From $5K to $200K. Pay once, trade for life if you stay within rules.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {featured.map((p, i) => (
          <div key={p.id} className={`rounded-2xl p-8 ${i === 1 ? "bg-gradient-primary text-[hsl(222,47%,11%)] shadow-glow scale-105" : "glass"}`}>
            <div className="text-sm font-medium opacity-80">{p.label} account</div>
            <div className="mt-2 text-5xl font-bold">${p.price}</div>
            <div className="text-xs opacity-70 mt-1">one-time fee</div>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> {p.profitTarget}% profit target</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> {p.maxDrawdown}% max drawdown</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Up to {p.profitShare}% profit split</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Unlimited trading days</li>
            </ul>
            <Button asChild className={`mt-8 w-full ${i === 1 ? "bg-background text-foreground hover:bg-background/90" : "bg-gradient-primary text-[hsl(222,47%,11%)]"}`}>
              <Link href="/challenges">Start with {p.label}</Link>
            </Button>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Button asChild variant="ghost">
          <Link href="/pricing">See all plans <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}

function Steps() {
  const steps = [
    { n: "01", title: "Pick a plan", desc: "Choose an account size that fits your style and capital ambition." },
    { n: "02", title: "Pass the evaluation", desc: "Hit 8% profit in phase 1, 5% in phase 2. No time pressure." },
    { n: "03", title: "Get funded", desc: "Receive your funded account credentials and start trading." },
    { n: "04", title: "Withdraw profits", desc: "Request payouts every 14 days. Processed within 24 hours." },
  ];
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold">How it <span className="text-gradient">works</span></h2>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {steps.map((s) => (
          <div key={s.n} className="glass rounded-2xl p-6">
            <div className="text-3xl font-bold text-gradient">{s.n}</div>
            <h3 className="mt-3 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-16 text-center shadow-glow">
        <h2 className="text-4xl md:text-5xl font-bold text-[hsl(222,47%,11%)]">Ready to trade bigger?</h2>
        <p className="mt-4 text-[hsl(222,47%,11%)]/80 max-w-xl mx-auto">Join thousands of funded traders. Your edge deserves real capital.</p>
        <Button asChild size="lg" className="mt-8 bg-background text-foreground hover:bg-background/90 h-12 px-8 text-base">
          <Link href="/challenges">Get funded now <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
