import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — FundedPlus" },
      { name: "description", content: "Frequently asked questions about FundedPlus trading challenges, payouts, and rules." },
      { property: "og:title", content: "FundedPlus FAQ" },
      { property: "og:description", content: "Everything you need to know about getting funded." },
    ],
  }),
  component: () => <SiteLayout><FAQPage /></SiteLayout>,
});

const faqs = [
  { q: "What is FundedPlus?", a: "FundedPlus is a proprietary trading firm. We evaluate your skill via a 2-step challenge and then fund you with up to $200K of our capital to trade." },
  { q: "How does the evaluation work?", a: "Phase 1: hit 8% profit while staying within 5% daily and 10% total drawdown. Phase 2: hit 5% profit with the same risk limits. No minimum trading days." },
  { q: "Which platform do you use?", a: "MetaTrader 5 with our institutional liquidity provider. Trade forex, indices, commodities and crypto." },
  { q: "When do I get paid?", a: "Your first payout is available 14 days after your first live trade. After that, every 14 days. Payouts are processed within 24 hours." },
  { q: "What's the profit split?", a: "80% for $5K–$10K, 85% for $25K–$50K, and 90% for $100K and $200K accounts. Your share, in writing, no surprises." },
  { q: "Are weekend holds allowed?", a: "Yes. You can hold positions overnight and over the weekend." },
  { q: "Is news trading allowed?", a: "Yes, on most instruments. Some restrictions apply during major macro events — see Trader Agreement." },
  { q: "Can I get a refund?", a: "Your challenge fee is refunded 100% with your first payout. If you fail the challenge, the fee is non-refundable." },
  { q: "What payment methods do you accept?", a: "Credit/debit cards, Apple Pay, and Google Pay via PayTabs. Crypto coming soon." },
];

function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold">Frequently <span className="text-gradient">asked</span></h1>
        <p className="mt-4 text-muted-foreground">Don't see your question? Reach us at support@fundedplus.com</p>
      </div>
      <div className="glass rounded-2xl p-2">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/40 px-4">
              <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
