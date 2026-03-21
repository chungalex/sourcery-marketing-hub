import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Package, Shield, FileText, MessageSquare,
  BarChart3, Sparkles, Building2, Calendar, Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  { id: "free", label: "Free", color: "bg-secondary text-foreground border-border" },
  { id: "builder", label: "Builder", color: "bg-primary/10 text-primary border-primary/30" },
  { id: "pro", label: "Pro", color: "bg-amber-500/10 text-amber-700 border-amber-400/30" },
];

const sections = [
  {
    id: "os",
    category: "Production OS",
    desc: "The infrastructure every order runs through — regardless of plan.",
    icon: Package,
    features: [
      {
        name: "Structured PO creation",
        sub: "Every decision explained before you commit.",
        desc: "Guided 4-step form — factory, pricing, incoterms, QC option, AQL standard, delivery window. Plain-English explanations at every step.",
        tier: "free",
      },
      {
        name: "Sampling gate",
        sub: "Bulk can't begin until sample is approved.",
        desc: "Factory submits sample with photos and measurements. You approve or request a documented revision round. Gate is enforced by the platform — not optional.",
        tier: "free",
      },
      {
        name: "Revision rounds",
        sub: "No more 'I never got that message.'",
        desc: "Every spec change is a formal revision the factory must acknowledge before work continues. Timestamped, logged, permanently attached to the order.",
        tier: "free",
      },
      {
        name: "Tech pack versioning",
        sub: "No more 'which file did you use?'",
        desc: "Every upload creates a new version. Old versions preserved. Factory confirms which version they're building from.",
        tier: "free",
      },
      {
        name: "Milestone-gated payments",
        sub: "Your money moves when you approve it.",
        desc: "Payment stages tracked on the platform. You release each milestone manually. Final payment requires QC pass. Nothing moves without your confirmation.",
        tier: "free",
      },
      {
        name: "QC documentation",
        sub: "No more defect found after the wire.",
        desc: "Defects filed as structured reports — type, severity, quantity, photos, factory response. Final payment blocked until QC passes.",
        tier: "free",
      },
      {
        name: "On-platform messaging",
        sub: "No more scattered WhatsApp threads.",
        desc: "Every message logged, timestamped, attached to the order. Full history. Nothing important communicated outside the platform.",
        tier: "free",
      },
      {
        name: "Permanent order records",
        sub: "Every order searchable forever.",
        desc: "Every spec, revision, message, defect report, and milestone — permanently accessible. Reorder in one click. Reference in a dispute.",
        tier: "free",
      },
    ],
  },
  {
    id: "marketplace",
    category: "Marketplace",
    desc: "Vetted factories, AI matching, and real performance data.",
    icon: Building2,
    features: [
      {
        name: "Vetted factory network",
        sub: "No more wondering if the factory is reliable.",
        desc: "Every factory has gone through credential review and certification verification. Performance scores built from real order data — not self-reported claims.",
        tier: "builder",
      },
      {
        name: "AI factory matcher",
        sub: "Find the right factory in plain language.",
        desc: "Describe what you need. Get ranked recommendations based on product type, order size, quality requirements, and lead time. Runs on real network data.",
        tier: "builder",
      },
      {
        name: "Factory comparison",
        sub: "Side-by-side up to 3 factories.",
        desc: "MOQ, lead time, certifications, categories, and performance score compared in one view.",
        tier: "builder",
      },
      {
        name: "Dispute filing",
        sub: "Real leverage when things go wrong.",
        desc: "Marketplace factories have public performance records. Filing a dispute logs against their score — real incentive to resolve. Your full order record is attached automatically.",
        tier: "builder",
      },
    ],
  },
  {
    id: "ai",
    category: "AI toolkit",
    desc: "Intelligence built into the workflow — not bolted on.",
    icon: Sparkles,
    features: [
      {
        name: "Order chat summaries",
        sub: "No more re-reading 200 messages.",
        desc: "AI reads your full message thread and surfaces key decisions, open action items, and unresolved issues.",
        tier: "builder",
      },
      {
        name: "AI dispute summary",
        sub: "Your evidence, pre-built.",
        desc: "AI reads the full order record and generates a neutral summary — what was agreed, what was delivered, where the discrepancy is.",
        tier: "builder",
      },
      {
        name: "Reorder intelligence",
        sub: "Don't repeat the same mistakes.",
        desc: "When reordering, AI reviews your previous order with that factory and flags what went wrong, what changed, and what to confirm before committing.",
        tier: "pro",
      },
      {
        name: "Tech pack reviewer",
        sub: "Catch issues before they cost money.",
        desc: "AI reviews your tech pack before it goes to the factory. Flags missing information, ambiguous specs, and common failure points.",
        tier: "builder",
        coming: true,
      },
      {
        name: "RFQ generator",
        sub: "Professional RFQs in minutes.",
        desc: "Describe your product in plain language. Get a structured RFQ ready to send to any manufacturer.",
        tier: "builder",
        coming: true,
      },
      {
        name: "Quote analyzer",
        sub: "Know if the price is fair.",
        desc: "Paste a factory quote. Get an independent analysis benchmarked against real order data from the network.",
        tier: "builder",
        coming: true,
      },
    ],
  },
  {
    id: "communication",
    category: "Communication",
    desc: "Across languages, time zones, and inboxes.",
    icon: MessageSquare,
    features: [
      {
        name: "Message translation EN/VN/CN",
        sub: "Factory writes in theirs, you read in yours.",
        desc: "In-thread translation between English, Vietnamese, and Chinese. Both directions. No separate tool.",
        tier: "builder",
      },
      {
        name: "Email notifications",
        sub: "You don't need to be in the app.",
        desc: "25 order event triggers — sample submitted, revision acknowledged, QC uploaded, dispute filed. Every time something needs attention.",
        tier: "free",
      },
    ],
  },
  {
    id: "organisation",
    category: "Organisation",
    desc: "Everything that makes production feel like a business.",
    icon: Calendar,
    features: [
      {
        name: "Production calendar",
        sub: "See your whole operation at a glance.",
        desc: "Monthly view of all active orders by delivery window. What's due, what's behind, what needs attention.",
        tier: "builder",
      },
      {
        name: "Spec library",
        sub: "Stop rebuilding the same spec every time.",
        desc: "Save product specs, measurements, and materials as reusable templates. Pull into any new order in one click.",
        tier: "builder",
      },
      {
        name: "Order templates",
        sub: "Repeat orders shouldn't take 30 minutes.",
        desc: "Save complete order setups — factory, milestone structure, QC standard, incoterms — and reuse instantly.",
        tier: "builder",
      },
      {
        name: "Supplier contact book",
        sub: "Every factory contact in one place.",
        desc: "Production manager, QC lead, shipping contact — stored permanently, grouped by factory.",
        tier: "pro",
      },
      {
        name: "Document export",
        sub: "Your full paper trail, formatted.",
        desc: "Export any order as a PDF audit trail — every message, spec, revision, milestone, QC result. For legal, insurance, or due diligence.",
        tier: "builder",
      },
      {
        name: "Custom milestone structures",
        sub: "Your payment structure, not ours.",
        desc: "Define your own stages, percentages, and release conditions. 4-6 stage structures for high-value orders — booking, sample, fabric, QC, shipment.",
        tier: "pro",
      },
      {
        name: "White-label PDF exports",
        sub: "Your brand on every document.",
        desc: "Exports show your brand name — not Sourcery's. Professional documentation for factories, lawyers, and investors.",
        tier: "pro",
      },
    ],
  },
  {
    id: "intelligence",
    category: "Intelligence",
    desc: "Proactive signals across your production operation.",
    icon: BarChart3,
    features: [
      {
        name: "Analytics dashboard",
        sub: "Full picture of your production operation.",
        desc: "Total spend, order frequency, average lead time, QC pass rates, defect history across all orders and factories.",
        tier: "pro",
      },
      {
        name: "3 team seats",
        sub: "Everyone on the same system.",
        desc: "Add your production manager, sourcing lead, or co-founder. Same orders, same history, same platform.",
        tier: "pro",
      },
    ],
  },
];

const tierConfig = {
  free:    { label: "Free",    className: "bg-secondary text-foreground border border-border" },
  builder: { label: "Builder", className: "bg-primary/10 text-primary border border-primary/20" },
  pro:     { label: "Pro",     className: "bg-amber-500/10 text-amber-700 border border-amber-400/30" },
};

export default function Features() {
  const [activeSection, setActiveSection] = useState("os");

  return (
    <Layout>
      <SEO
        title="Features — Sourcery"
        description="Every feature on the Sourcery platform — from structured PO creation to white-label exports."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5">
                Everything on the platform.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Every feature exists to take something normally stressful, opaque, or manual — and make it structured, documented, and something you can build a company around.
              </p>
              {/* Tier legend */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Free", sub: "1 order, full OS", cls: "bg-secondary border-border text-foreground" },
                  { label: "Builder", sub: "$399/year", cls: "bg-primary/10 border-primary/20 text-primary" },
                  { label: "Pro", sub: "$699/year", cls: "bg-amber-500/10 border-amber-400/30 text-amber-700" },
                ].map(t => (
                  <div key={t.label} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium", t.cls)}>
                    <span>{t.label}</span>
                    <span className="opacity-60 text-xs font-normal">— {t.sub}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sticky nav + content */}
      <div className="flex gap-0 container-wide py-12">

        {/* Sticky sidebar */}
        <aside className="hidden lg:block w-48 flex-shrink-0 mr-12">
          <div className="sticky top-24 space-y-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  activeSection === s.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <s.icon className="h-3.5 w-3.5 flex-shrink-0" />
                {s.category}
              </button>
            ))}
            <div className="pt-4 border-t border-border mt-4">
              <Link to="/pricing">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  See pricing →
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Feature sections */}
        <div className="flex-1 min-w-0 space-y-16">
          {sections.map((section, si) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => setActiveSection(section.id)}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <section.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">{section.category}</h2>
                  <p className="text-sm text-muted-foreground">{section.desc}</p>
                </div>
              </div>

              {/* Feature cards grid */}
              <div className="grid sm:grid-cols-2 gap-3 mt-5">
                {section.features.map((feature, fi) => {
                  const tier = tierConfig[feature.tier as keyof typeof tierConfig];
                  return (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: fi * 0.04 }}
                      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-2"
                    >
                      {/* Feature header */}
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground leading-snug">{feature.name}</p>
                        <div className="flex gap-1.5 flex-shrink-0">
                          {feature.coming && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20 font-medium whitespace-nowrap">soon</span>
                          )}
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap", tier.className)}>
                            {tier.label}
                          </span>
                        </div>
                      </div>
                      {/* Emotional sub-line */}
                      <p className="text-xs text-primary font-medium">{feature.sub}</p>
                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="section-padding bg-card/50 border-t border-border">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Your first order is free.</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">No credit card, no time limit. Full infrastructure from day one.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/pricing">
                <Button variant="hero-outline" size="xl">See pricing</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
