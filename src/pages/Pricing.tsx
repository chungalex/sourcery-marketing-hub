import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Check, ArrowRight, Compass, Zap, Shield, Star, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Tier concepts ────────────────────────────────────────────────────────────

const TIERS = [
  {
    id: "starter",
    icon: Compass,
    name: "Starter",
    price: { monthly: 0, annual: 0 },
    priceLabel: "Free",
    priceSub: "No credit card. No time limit.",
    badge: null,
    concept: "Stop figuring it out. Start producing it.",
    story: "We know how hard it is to start. Finding the right factory, understanding what goes in a purchase order, knowing what happens if something goes wrong — none of it is obvious and most people learn by making expensive mistakes. We built Starter so you don't have to. Every step is guided. Your payments are protected from day one. Your specs are documented so there's no dispute with your factory. You'll know exactly what decisions to make and why — because we've curated this tier to walk you through the entire process, from finding your first factory to closing your first order.",
    signoff: "We've done this. Now we'll show you how.",
    cta: "Get started free",
    ctaHref: "/auth?mode=signup",
    ctaVariant: "outline" as const,
    features: [
      { group: "Find your factory", items: [
        "Factory directory — browse verified manufacturers",
        "AI factory matcher — describe what you need in plain language",
        "Direct factory messaging",
        "Factory profiles with certifications and MOQ",
      ]},
      { group: "Your first orders", items: [
        "Structured PO creation — guided, step by step",
        "Milestone-gated payments — deposit, sample gate, QC gate",
        "Tech pack + spec documentation",
        "Sample review and approval flow",
        "QC documentation",
        "Permanent order record",
        "Export PO as PDF",
      ]},
      { group: "Guidance built in", items: [
        "Holiday alerts (Tet, Golden Week) — 45 days before",
        "Incoterms guidance at every decision point",
        "Platform messaging with Vietnamese↔English translation",
        "Trade tools — tariff calculator, HTS codes, FTA guide (free)",
      ]},
    ],
  },
  {
    id: "growth",
    icon: Zap,
    name: "Growth",
    price: { monthly: 49, annual: 33 },
    priceLabel: "$49",
    priceSub: "per month, or $399/year",
    badge: "Most popular",
    concept: "Stop managing production. Start running it like Nike does.",
    story: "Nike has a team of sourcing directors running critical path schedules. Amazon has engineers calculating safety stock formulas. Apple grades every factory on verified performance data. Walmart tracks on-time delivery on every single order. You don't have any of that — until now. Growth gives you the exact same methods, automated, built into every order. The backward scheduling that prevents missed seasons. The reorder formula that prevents stockouts. The factory scorecards built from real completed orders. This is the tier where you stop reacting to production and start operating it at the level corporations spend millions to achieve.",
    signoff: "The infrastructure the biggest brands in the world rely on. Yours for $49 a month.",
    cta: "Start Growth",
    ctaHref: "/auth?mode=signup&plan=growth",
    ctaVariant: "default" as const,
    features: [
      { group: "Everything in Starter, plus", items: [
        "10 simultaneous active orders",
        "RFQ system — send one brief to multiple factories",
      ]},
      { group: "Production intelligence", items: [
        "Production countdown — backward scheduling from delivery date",
        "Order health dashboard — green / amber / red across all orders",
        "Safety stock calculator — exact PO-by date before stockout",
        "Reorder intelligence — factory load + your real lead time history",
        "Factory OTIF scores — on-time/in-full from verified order data",
        "Payment milestone calendar — cash flow across all active orders",
        "FX rate guidance — USD/VND, CNY, EUR with practical advice",
      ]},
      { group: "Order management tools", items: [
        "AI tech pack reviewer — catch spec gaps before factory errors",
        "Bill of materials tracker — every material, cost, and supplier",
        "Shipment tracker — real carrier links, factory updates status",
        "Freight document checklist — adapts to incoterms and destination",
        "Timezone approvals — both clocks live, factory queues requests",
      ]},
      { group: "AI toolkit", items: [
        "Production assistant — full order context, knows your factory",
        "Quote analyser — benchmark any factory quote against real data",
        "RFQ generator — professional brief from plain language",
        "Negotiation coach — leverage points specific to your situation",
      ]},
    ],
  },
  {
    id: "scale",
    icon: Shield,
    name: "Scale",
    price: { monthly: 149, annual: 120 },
    priceLabel: "$149",
    priceSub: "per month, or $1,440/year",
    badge: null,
    concept: "Your production operation should run like a business.",
    story: "You have a team. Multiple factories. Multiple seasons running simultaneously. Investors, retailers, or regulators asking about your supply chain. At this stage the chaos isn't from inexperience — it's from volume. Scale gives you the infrastructure to match. Full team visibility across every active order. Compliance documentation that generates itself as a side effect of every order you run. Factory scorecards that compound in accuracy with every production cycle. The professional layer that turns a production operation into a competitive advantage.",
    signoff: "Serious volume. Serious infrastructure. Built in.",
    cta: "Start Scale",
    ctaHref: "/auth?mode=signup&plan=scale",
    ctaVariant: "outline" as const,
    features: [
      { group: "Everything in Growth, plus", items: [
        "Unlimited active orders",
        "3 team seats — production manager, sourcing lead, co-founder",
      ]},
      { group: "Compliance & documentation", items: [
        "Supply chain compliance export — CSDDD, UFLPA, Modern Slavery Act",
        "White-label PO PDF exports — your brand, not Sourcery's",
        "Shareable production records for investors and retailers",
      ]},
      { group: "Advanced operations", items: [
        "Spec library — reusable product templates",
        "Supplier contact book",
        "Advanced analytics — spend, lead time variance, QC trends",
        "Custom milestone structures (up to 6 stages)",
        "Priority support",
      ]},
    ],
  },
];

const FAQS = [
  {
    q: "How is Starter different from a free trial?",
    a: "It's not a trial. Your first order has no time limit and no credit card required. You get the full Starter platform — factory directory, structured PO, milestone payments, permanent order record — on one active order, for as long as you need it. When you're ready to run multiple orders simultaneously, upgrade to Growth.",
  },
  {
    q: "Can I bring my existing factory?",
    a: "Yes, and most brands do. BYOF (Bring Your Own Factory) means you invite your existing manufacturer with one link. They join free and get the full platform immediately. You're not locked into our network — your factory relationships are yours.",
  },
  {
    q: "How accurate are the intelligence features in Growth on my first few orders?",
    a: "Production countdown and order health work from day one — they use your delivery date and order status. Safety stock, reorder intelligence, and OTIF scores become more accurate after 3–5 completed orders when you have real lead time history with each factory. The platform earns its value as you use it.",
  },
  {
    q: "Does my factory pay anything?",
    a: "Nothing. Factories join and use the full platform completely free. You pay — they benefit from structured orders, milestone-protected payments, and a growing OTIF score that helps them attract more brands.",
  },
  {
    q: "What is Sourcery Managed?",
    a: "Sourcery Managed is a separate service — not a subscription tier — where we handle your entire production run: factory selection, PO, sampling, QC, and delivery, using Sourcery as the backbone. From $2,000 per production run. 3–5 slots available per season.",
  },
  {
    q: "What happens to my data if I downgrade or cancel?",
    a: "Your order history, production records, and factory relationships are permanently yours. Closed orders stay accessible on Starter forever. We don't hold your production history hostage.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const [expanded, setExpanded] = useState<string | null>("growth");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <SEO
        title="Pricing — Sourcery | Starter, Growth, Scale"
        description="Start free with Starter — factory discovery and guided first orders. Upgrade to Growth for the production intelligence the biggest brands use. Scale for teams and compliance."
        canonical="/pricing"
      />

      {/* Hero */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Pricing</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
              Wherever you are in production. There's a tier for that.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Starting out and finding your footing. Running production and needing to stay ahead of it. Operating at volume and needing infrastructure that matches. Each tier is built for a specific stage — not a feature count.
            </p>
            <div className="inline-flex items-center gap-1 bg-secondary rounded-full p-1">
              <button
                onClick={() => setAnnual(false)}
                className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all", !annual ? "bg-card shadow text-foreground" : "text-muted-foreground")}
              >Monthly</button>
              <button
                onClick={() => setAnnual(true)}
                className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2", annual ? "bg-card shadow text-foreground" : "text-muted-foreground")}
              >Annual <span className="text-xs text-primary font-semibold">save 32%</span></button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tier cards — accordion style */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl space-y-4">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const isOpen = expanded === tier.id;
            const price = annual ? tier.price.annual : tier.price.monthly;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn(
                  "rounded-2xl border overflow-hidden transition-all",
                  tier.id === "growth" ? "border-primary" : "border-border",
                  isOpen ? "bg-card" : "bg-card/60"
                )}
              >
                {/* Tier header — always visible */}
                <button
                  onClick={() => setExpanded(isOpen ? null : tier.id)}
                  className="w-full text-left px-7 py-6 flex items-start justify-between gap-4 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                      tier.id === "growth" ? "bg-primary/15" : "bg-secondary"
                    )}>
                      <Icon className={cn("h-5 w-5", tier.id === "growth" ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-base font-bold", tier.id === "growth" ? "text-primary" : "text-foreground")}>{tier.name}</span>
                        {tier.badge && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">{tier.badge}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tier.concept}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-foreground">
                      {price === 0 ? "Free" : `$${price}`}
                      {price > 0 && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                    </div>
                    {price > 0 && annual && (
                      <p className="text-xs text-muted-foreground mt-0.5">billed annually</p>
                    )}
                    <div className="mt-2 flex justify-end">
                      {isOpen
                        ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      }
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-7 pb-7 border-t border-border">

                    {/* Marketing story */}
                    <div className={cn(
                      "rounded-xl p-5 my-5",
                      tier.id === "starter" ? "bg-blue-500/5 border border-blue-400/20" :
                      tier.id === "growth" ? "bg-primary/5 border border-primary/20" :
                      "bg-secondary/60 border border-border"
                    )}>
                      <p className="text-sm text-foreground leading-relaxed mb-3">{tier.story}</p>
                      <p className={cn(
                        "text-xs font-semibold italic",
                        tier.id === "growth" ? "text-primary" : "text-muted-foreground"
                      )}>"{tier.signoff}"</p>
                    </div>

                    {/* Features by group */}
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mb-6">
                      {tier.features.map(group => (
                        <div key={group.group}>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">{group.group}</p>
                          <div className="space-y-1.5">
                            {group.items.map(item => (
                              <div key={item} className="flex items-start gap-2">
                                <Check className={cn(
                                  "h-3.5 w-3.5 flex-shrink-0 mt-0.5",
                                  item.includes("Everything in") ? "text-muted-foreground" : "text-primary"
                                )} />
                                <span className={cn(
                                  "text-xs leading-relaxed",
                                  item.includes("Everything in") ? "text-muted-foreground italic" : "text-foreground"
                                )}>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link to={tier.ctaHref}>
                      <Button variant={tier.ctaVariant} className={cn("gap-2", tier.id === "growth" ? "w-full sm:w-auto" : "")}>
                        {tier.cta} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    {tier.id === "starter" && (
                      <p className="text-xs text-muted-foreground mt-2">No credit card. No time limit. Your first order, fully guided.</p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Enterprise row */}
          <div className="border border-border rounded-2xl p-5 flex items-center justify-between bg-card/60 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Star className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground mb-0.5">Enterprise</p>
                <p className="text-xs text-muted-foreground">$500K+ annual production · custom integrations · dedicated support · SLA · white-glove onboarding</p>
              </div>
            </div>
            <Link to="/contact" className="flex-shrink-0">
              <Button variant="outline" size="sm">Contact us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sourcery Managed */}
      <section className="section-padding border-b border-border bg-card/40">
        <div className="container max-w-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Not a subscription tier</p>
              <h2 className="text-xl font-bold text-foreground mb-2">Sourcery Managed</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                We handle your entire production run — factory selection, PO, sampling, QC, and delivery — using Sourcery as the backbone. You stay informed and in control at every step. Nothing moves without your approval. From $2,000 per production run. 3–5 slots per season.
              </p>
            </div>
            <Link to="/studio" className="flex-shrink-0">
              <Button variant="outline" className="gap-2 whitespace-nowrap">
                See Sourcery Managed <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-2">Quick comparison</h2>
          <p className="text-muted-foreground mb-8">The key differences at a glance.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground w-2/5"></th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs">Starter<br /><span className="font-normal">Free</span></th>
                  <th className="text-center py-3 px-4 font-semibold text-primary text-xs">Growth<br /><span className="font-normal">$49/mo</span></th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs">Scale<br /><span className="font-normal">$149/mo</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {[
                  ["Active orders", "1", "10", "Unlimited"],
                  ["Team seats", "1", "1", "3"],
                  ["Factory directory", "✓", "✓", "✓"],
                  ["Structured PO + milestone payments", "✓", "✓", "✓"],
                  ["Messaging + translation", "✓", "✓", "✓"],
                  ["Production intelligence suite", "—", "✓", "✓"],
                  ["AI tools (full suite)", "—", "✓", "✓"],
                  ["BOM tracker + shipment tracker", "—", "✓", "✓"],
                  ["RFQ system", "—", "✓", "✓"],
                  ["Compliance export (CSDDD, UFLPA)", "—", "—", "✓"],
                  ["White-label PDF exports", "—", "—", "✓"],
                  ["Spec library + advanced analytics", "—", "—", "✓"],
                ].map(([feature, starter, growth, scale]) => (
                  <tr key={feature} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{feature}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{starter}</td>
                    <td className="py-3 px-4 text-center font-medium text-primary">{growth}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{scale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-8">Common questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                  <span className="text-muted-foreground flex-shrink-0 text-lg leading-none">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container max-w-xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Start where you are.</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Starter is free and fully guided. Growth unlocks the intelligence layer the moment you need it. Scale when your team and volume demand it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth?mode=signup">Start free with Starter <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/how-it-works">See how it works</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">No credit card. Switch tiers anytime.</p>
        </div>
      </section>
    </Layout>
  );
}
