import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, Check, Info, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const featureTooltips: Record<string, string> = {
  "Full production OS": "Structured PO creation, sampling gates, revision rounds, tech pack versioning, QC documentation, defect reports, milestone tracking, and on-platform messaging — all on one order.",
  "Permanent order record": "Every spec, revision, message, defect report, and milestone is stored permanently. Accessible for reorders, disputes, or due diligence — even after your subscription ends.",
  "Marketplace browse": "See factory capabilities, categories, certifications, MOQ, lead times, and performance scores. Factory names visible on Builder and above.",
  "AI dispute summary + PDF export": "AI reads your full order record and generates a neutral summary of what was agreed and where the discrepancy is. Export as a formatted PDF for disputes, legal, or insurance.",
  "Message translation": "In-thread translation between English, Vietnamese, and Chinese. Factory writes in their language, you read in yours — on every message.",
  "Full marketplace access": "Browse, contact, and request quotes from verified, audited factories. Full names, profiles, and performance data visible. AI-matched recommendations included.",
  "AI factory matcher": "Describe what you need in plain language. Get ranked factory recommendations from verified network data — not keyword search.",
  "Order chat summaries": "AI reads your full order message thread and surfaces key decisions made, open action items, and unresolved issues. No more re-reading 200 messages.",
  "Order templates": "Save a complete order setup — factory, milestone structure, QC standard, incoterms — and reuse it in one click. For brands repeating similar production runs.",
  "Dispute filing": "Submit a formal dispute through the platform. Marketplace factories have public reputation scores — they have real incentive to respond and resolve properly.",
  "Tech pack reviewer": "AI reviews your tech pack before it goes to the factory. Flags missing information, ambiguous specs, and common failure points that cause revision rounds.",
  "RFQ generator": "Describe your product in plain language and get a professional, structured RFQ ready to send to any manufacturer.",
  "Quote analyzer": "Paste a factory quote and get an independent analysis benchmarked against real order data. Know if the price is fair before you commit.",
  "Production calendar": "Visual timeline of all active orders by delivery window. See what's due when, what's behind, and what needs attention across your full production schedule.",
  "Spec library": "Save product specs, measurements, and materials as reusable templates. Pull into any new order instead of rebuilding from scratch.",
  "Factory health alerts": "Proactive alerts when a factory's QC pass rate, response time, or defect rate declines — before you place your next order with them.",
  "Reorder intelligence": "When reordering, AI flags what changed or went wrong last time. Catches issues before they repeat.",
  "Analytics dashboard": "Total spend, order frequency, average lead time, QC pass rates, and defect history across all your orders and factories.",
  "3 team seats": "Add your production manager, sourcing lead, or co-founder. Everyone works from the same orders, same history, same platform.",
  "Unlimited AI factory matcher": "No monthly search limit. Full AI matching across the entire verified factory network.",
  "Supplier contact book": "Store individual contacts at each factory — production manager, QC lead, shipping contact — attached permanently to the factory record.",
};

function FeatureGroup({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pt-3 pb-1 first:pt-0">
      {label}
    </p>
  );
}

function Feature({ text, coming }: { text: string; coming?: boolean }) {
  const tooltip = featureTooltips[text];
  return (
    <div className="flex items-start gap-2.5 py-1">
      <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Check className="h-2.5 w-2.5 text-primary" />
      </div>
      <span className="text-sm text-foreground leading-snug flex items-center gap-1.5 flex-wrap">
        {text}
        {coming && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20 font-medium">
            soon
          </span>
        )}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground/40 hover:text-muted-foreground cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-xs leading-relaxed">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </span>
    </div>
  );
}

const faqs = [
  {
    q: "What happens to my orders if I cancel?",
    a: "Every order record is permanent — specs, revisions, messages, defect reports, milestones. You can view and export any order regardless of your current plan. You just can't create new orders without an active plan.",
  },
  {
    q: "What can I see in the marketplace on the free plan?",
    a: "Factory capabilities, categories, certifications, MOQ, lead times, and performance scores are visible. Factory names and contact details are only visible on Builder and above — so you can confirm fit before upgrading.",
  },
  {
    q: "Does Sourcery take a cut of my production payments?",
    a: "No. Sourcery charges a flat subscription or per-order fee. Payments move directly between you and your factory. Sourcery enforces the milestone gate structure and documents every stage — you control every release.",
  },
  {
    q: "Can I upgrade mid-order?",
    a: "Yes. Upgrade at any time and your existing orders carry over completely. Nothing is lost.",
  },
  {
    q: "What is the founding member offer?",
    a: "The first 5 brands to subscribe to Builder are locked at $299/year forever. Once those 5 spots are filled, the standard rate applies.",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <Layout>
      <SEO
        title="Pricing — Sourcery"
        description="Your first order is free. Full infrastructure, no credit card, no time limit."
      />

      <TooltipProvider>

        {/* Hero */}
        <section className="section-padding bg-[var(--hero-gradient)]">
          <div className="container-tight text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5">
                Your first order is free.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
                Full infrastructure, no credit card, no time limit. If Sourcery works on a real order, the rest is straightforward.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Founding member */}
        <div className="bg-primary/5 border-y border-primary/20 py-4">
          <div className="container-tight flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Star className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Founding member — 5 spots only</p>
                <p className="text-xs text-muted-foreground mt-0.5">First 5 brands on Builder locked at $299/year forever. Standard rate is $399/year.</p>
              </div>
            </div>
            <Link to="/auth?mode=signup&plan=builder&founding=true">
              <Button size="sm" variant="outline" className="flex-shrink-0 text-xs">
                Claim your spot <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="pt-12 pb-2 flex justify-center">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary border border-border">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-colors",
                !annual ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                annual ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md">Save 30%</span>
            </button>
          </div>
        </div>

        {/* Three tiers */}
        <section className="pt-6 pb-16">
          <div className="container-wide">
            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">

              {/* Free */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-7 flex flex-col"
              >
                <div className="mb-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Free</p>
                  <div className="text-4xl font-bold text-foreground mb-2">$0</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Your first order. No commitment.</p>
                </div>
                <Link to="/auth?mode=signup" className="mb-8">
                  <Button variant="outline" className="w-full">Get started free</Button>
                </Link>
                <div className="space-y-0 flex-1">
                  <FeatureGroup label="Infrastructure" />
                  <Feature text="Full production OS" />
                  <Feature text="Permanent order record" />
                  <FeatureGroup label="Discovery" />
                  <Feature text="Marketplace browse" />
                </div>
              </motion.div>

              {/* Builder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="rounded-2xl border-2 border-primary bg-primary/3 p-7 flex flex-col"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">Builder</p>
                    <span className="text-[10px] bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-medium">Most popular</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-4xl font-bold text-foreground">${annual ? "399" : "49"}</span>
                    <span className="text-muted-foreground text-sm">{annual ? "/year" : "/month"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {annual ? "$33/month — billed annually" : "or $399/year, save $189"}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">Brands managing active production with marketplace access.</p>
                </div>
                <Link to="/auth?mode=signup&plan=builder" className="mb-8">
                  <Button className="w-full">Get started <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
                </Link>
                <div className="space-y-0 flex-1">
                  <FeatureGroup label="Orders" />
                  <Feature text="5 active orders simultaneously" />
                  <Feature text="Order templates" />
                  <Feature text="AI dispute summary + PDF export" />
                  <FeatureGroup label="Marketplace" />
                  <Feature text="Full marketplace access" />
                  <Feature text="AI factory matcher" />
                  <FeatureGroup label="Communication" />
                  <Feature text="Message translation" />
                  <Feature text="Order chat summaries" />
                  <Feature text="Dispute filing" />
                  <FeatureGroup label="AI tools" />
                  <Feature text="Tech pack reviewer" coming />
                  <Feature text="RFQ generator" coming />
                  <Feature text="Quote analyzer" coming />
                </div>
              </motion.div>

              {/* Pro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                className="rounded-2xl border border-border bg-card p-7 flex flex-col"
              >
                <div className="mb-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Pro</p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-4xl font-bold text-foreground">${annual ? "899" : "99"}</span>
                    <span className="text-muted-foreground text-sm">{annual ? "/year" : "/month"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {annual ? "$75/month — billed annually" : "or $899/year, save $289"}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">Teams running multiple orders across multiple factories.</p>
                </div>
                <Link to="/auth?mode=signup&plan=pro" className="mb-8">
                  <Button variant="outline" className="w-full">Get started <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
                </Link>
                <div className="space-y-0 flex-1">
                  <FeatureGroup label="Scale" />
                  <Feature text="Unlimited active orders" />
                  <Feature text="Unlimited AI factory matcher" />
                  <Feature text="3 team seats" />
                  <FeatureGroup label="Intelligence" />
                  <Feature text="Production calendar" />
                  <Feature text="Factory health alerts" />
                  <Feature text="Reorder intelligence" />
                  <Feature text="Analytics dashboard" />
                  <FeatureGroup label="Organisation" />
                  <Feature text="Spec library" />
                  <Feature text="Supplier contact book" />
                </div>
              </motion.div>

            </div>

            {/* One-off callout */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto mt-5 p-5 rounded-xl border border-border bg-card/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">One-off — $79 per order</p>
                <p className="text-sm text-muted-foreground">No subscription. Full OS, all AI tools, message translation, permanent record. For brands who produce once or twice a year.</p>
              </div>
              <Link to="/auth?mode=signup&plan=oneoff" className="flex-shrink-0">
                <Button variant="outline" size="sm">Pay per order</Button>
              </Link>
            </motion.div>

          </div>
        </section>

        {/* Cost math callout */}
        <div className="py-6 border-y border-border bg-card/40">
          <div className="container-tight text-center">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
              One unstructured production order costs $2,000–15,000 in rework, disputed specs, or post-payment defects. Builder is $399/year.{" "}
              <Link to="/why-sourcery" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
                See the full cost breakdown →
              </Link>
            </p>
          </div>
        </div>

        {/* FAQ */}
        <section className="section-padding">
          <div className="container-tight">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-8">Common questions</h2>
              <div className="divide-y divide-border">
                {faqs.map((faq, i) => (
                  <div key={i} className="py-5">
                    <p className="font-semibold text-foreground mb-2 text-sm">{faq.q}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-card/50 border-t border-border">
          <div className="container-tight text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Start with your first order — free.
              </h2>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                No credit card. No time limit. Full infrastructure from the first order.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="xl">
                    Get started free <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/why-sourcery">
                  <Button variant="hero-outline" size="xl">See the cost math</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Legal disclaimer */}
        <div className="py-6 border-t border-border">
          <div className="container-tight">
            <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              Sourcery is a production management platform. It does not hold, process, or custody funds. Payments are made directly between brands and factories. Sourcery enforces milestone gate conditions and documents every stage — the brand controls every payment release.
            </p>
          </div>
        </div>

      </TooltipProvider>
    </Layout>
  );
}
