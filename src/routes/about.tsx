import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — FundedPlus" },
      { name: "description", content: "FundedPlus is a prop trading firm built by traders, for traders. Our mission: give skilled traders the capital they deserve." },
      { property: "og:title", content: "About FundedPlus" },
      { property: "og:description", content: "Built by traders, for traders." },
    ],
  }),
  component: () => <SiteLayout><AboutPage /></SiteLayout>,
});

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-5xl md:text-6xl font-bold">Built by traders, <span className="text-gradient">for traders</span></h1>
      <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>FundedPlus exists for one reason: talent is everywhere, capital isn't. We back traders who can prove their edge with real funding, fair rules, and fast payouts.</p>
        <p>We're a team of ex-prop traders, risk managers, and engineers. We built the firm we always wished existed — transparent, trader-first, and obsessed with payout speed.</p>
        <p>Questions? Reach the founders directly at <span className="text-primary">founders@fundedplus.com</span>.</p>
      </div>
    </div>
  );
}
