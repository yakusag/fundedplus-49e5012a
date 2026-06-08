import SiteLayout from "@/components/SiteLayout";

export default function About() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-display font-bold">
          Built by traders, <span className="text-gradient">for traders</span>
        </h1>
        <div className="mt-10 space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>FundedPlus exists for one reason: talent is everywhere, capital isn't. We back traders who can prove their edge with real funding, fair rules, and fast payouts.</p>
          <p>We're a team of ex-prop traders, risk managers, and engineers. We built the firm we always wished existed — transparent, trader-first, and obsessed with payout speed.</p>
          <p>Our evaluation is designed to identify consistent, disciplined traders — not to catch you out. Clear targets, reasonable drawdowns, and no minimum trading days.</p>
          <div className="glass rounded-2xl p-6 mt-8 border border-primary/20">
            <p className="text-foreground font-medium">Questions? Reach the founders directly.</p>
            <a href="mailto:founders@fundedplus.com" className="text-primary hover:underline mt-1 block">founders@fundedplus.com</a>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
