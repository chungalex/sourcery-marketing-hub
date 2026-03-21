import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Shield, FileText, MessageSquare, BarChart3, Sparkles, Globe, Building2, Calendar, BookOpen, AlertCircle, RefreshCw, Users } from "lucide-react";

const sections = [
  {
    category: "Production OS",
    desc: "The core infrastructure every order runs through — regardless of your plan.",
    icon: Package,
    features: [
      { name: "Structured PO creation", desc: "Guided 4-step order form — factory, pricing, incoterms with plain-English explanations, QC option with trade-offs shown, AQL standard with context, delivery window. Every decision captured before production begins." },
      { name: "Sampling gate", desc: "Factory submits sample with photos and measurements. You approve or request a formal revision round with documented feedback. Bulk production cannot begin until the sample is approved — enforced by the platform, not optional." },
      { name: "Revision rounds", desc: "Every spec change is a formal revision round the factory must acknowledge before work continues. Timestamped, logged, permanently attached to the order." },
      { name: "Tech pack versioning", desc: "Every upload creates a new version. Old versions preserved. The factory confirms which version they're building from. No version confusion, no 'which file did you use' disputes." },
      { name: "QC documentation + defect reports", desc: "Defects filed as structured reports — type, severity, quantity affected, photos, factory response — all logged with timestamps. Factory must respond to every report. Feeds into their performance score." },
      { name: "Milestone-gated payment tracking", desc: "Payment stages tracked on the platform. You release each milestone manually when the gate condition is met. Final payment requires QC pass. Nothing moves without your confirmation." },
      { name: "On-platform messaging", desc: "Every message timestamped, logged, and attached to the order. Full history. Nothing important communicated outside the platform — so every decision has a record." },
      { name: "Permanent order records", desc: "Every closed order stays accessible forever — every spec, revision, message, defect report, and milestone. Use it for reorders, disputes, due diligence, or onboarding a new team member." },
      { name: "One-click reorder", desc: "Closed orders preserve every spec, AQL standard, and incoterms. Reorder with the same details in one click — nothing reconstructed from memory." },
    ],
  },
  {
    category: "Marketplace",
    desc: "Vetted factories discoverable through search and AI matching — Builder and above.",
    icon: Building2,
    features: [
      { name: "Vetted factory network", desc: "Every factory in the network has gone through credential review and certification verification. Performance scores are built from real completed order data — not self-reported claims." },
      { name: "AI factory matcher", desc: "Describe what you need in plain language. Get ranked factory recommendations based on your product type, order size, quality requirements, and lead time. Runs on real network data." },
      { name: "Factory comparison", desc: "Compare up to 3 factories side-by-side on MOQ, lead time, certifications, categories, and performance score. Available at /compare." },
      { name: "Performance scores", desc: "QC pass rate, response time, on-time delivery, defect history, and brand retention — all calculated from real order data. Factories see their full breakdown. Brands see their tier: Verified or Elite." },
      { name: "Dispute filing", desc: "Marketplace factories have public performance records — filing a dispute logs against their score and creates real incentive to resolve. Your full order record is automatically attached as evidence." },
    ],
  },
  {
    category: "AI toolkit",
    desc: "Intelligence built into the production workflow — not bolted on.",
    icon: Sparkles,
    features: [
      { name: "Tech pack reviewer", desc: "AI reviews your tech pack before it goes to the factory. Flags missing information, ambiguous specifications, and common failure points that cause revision rounds. Catches issues before they cost money. Coming soon.", coming: true },
      { name: "RFQ generator", desc: "Describe your product in plain language. Get a professional, structured RFQ ready to send to any manufacturer. Coming soon.", coming: true },
      { name: "Quote analyzer", desc: "Paste a factory quote. Get an independent analysis benchmarked against real order data from the Sourcery network. Know if the price is fair before you commit. Coming soon.", coming: true },
      { name: "Order chat summaries", desc: "AI reads your full message thread and surfaces key decisions made, open action items, and unresolved issues. No more re-reading 200 messages to find what was agreed." },
      { name: "Reorder intelligence", desc: "When reordering, AI reviews your previous order with that factory and flags what went wrong, what changed, and what to confirm before issuing the new PO." },
      { name: "AI dispute summary", desc: "AI reads the full order record and generates a neutral summary of what was agreed, what was delivered, and where the discrepancy is. Your evidence, pre-built, for any dispute or negotiation." },
    ],
  },
  {
    category: "Communication",
    desc: "Everything you need to communicate across languages and time zones.",
    icon: MessageSquare,
    features: [
      { name: "Message translation EN/VN/CN", desc: "In-thread translation between English, Vietnamese, and Chinese. Factory writes in their language, you read in yours — on every message, in both directions. No separate tool needed." },
      { name: "Email notifications", desc: "25 order event triggers — every time something needs your attention, you get an email. Sample submitted, revision acknowledged, QC uploaded, dispute filed. You don't need to be in the app." },
    ],
  },
  {
    category: "Organisation",
    desc: "The tools that make running production feel like running a business.",
    icon: Calendar,
    features: [
      { name: "Production calendar", desc: "Visual monthly calendar of all active orders by delivery window. See what's due when, what's behind, what needs attention. Click any day to see orders and navigate directly." },
      { name: "Spec library", desc: "Save product specs, measurements, and materials as reusable templates. Pull into any new order instead of rebuilding from scratch every time." },
      { name: "Order templates", desc: "Save complete order setups — factory, milestone structure, QC standard, incoterms — and reuse in one click. For brands repeating similar production runs." },
      { name: "Supplier contact book", desc: "Store individual contacts at each factory — production manager, QC lead, shipping contact — all attached permanently to the factory record." },
      { name: "Document export", desc: "Export any order as a full PDF audit trail — every message, spec, revision, milestone, QC result. Formatted for legal proceedings, insurance claims, or due diligence." },
      { name: "Custom milestone structures", desc: "Pro brands define their own payment stages, percentages, and release conditions. 4-6 stage structures for high-value orders — booking deposit, sample approval, fabric confirmation, bulk production, QC pass, shipment. Builder brands use the standard 3-stage structure.", pro: true },
      { name: "White-label PDF exports", desc: "Export order audit trails with your brand name and logo — not Sourcery's. Every spec, revision, message, and milestone, formatted to look like it came from your company. For disputes, legal proceedings, investor due diligence, or any professional documentation.", pro: true },
    ],
  },
  {
    category: "Intelligence",
    desc: "Proactive signals across your full production operation — Pro.",
    icon: BarChart3,
    features: [
      { name: "Analytics dashboard", desc: "Total spend, order frequency, average lead time, QC pass rates, and defect history across all your orders and factories. Full picture of your production operation." },
      { name: "Factory health alerts", desc: "Proactive alerts when a factory's QC pass rate, response time, or defect rate declines — before you place your next order with them. Know before you commit." },
      { name: "Team seats", desc: "Add your production manager, sourcing lead, or co-founder. Everyone works from the same orders, same history, same platform. 3 seats on Pro." },
    ],
  },
];

export default function Features() {
  return (
    <Layout>
      <SEO
        title="Features — Sourcery"
        description="Every feature on the Sourcery platform — from structured PO creation to AI dispute summaries. Built for brands managing production seriously."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5">
              Everything on the platform.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Every feature exists to take something that is normally stressful, opaque, or manual — and make it structured, documented, and navigable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features by category */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="space-y-16">
            {sections.map((section, si) => (
              <motion.div key={section.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: si * 0.05 }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-foreground">{section.category}</h2>
                </div>
                <p className="text-muted-foreground text-sm mb-6 ml-11">{section.desc}</p>
                <div className="space-y-px border border-border rounded-xl overflow-hidden">
                  {section.features.map((feature, fi) => (
                    <div key={feature.name} className="flex items-start gap-4 p-5 bg-card border-b border-border last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-foreground">{feature.name}</p>
                          {feature.coming && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20 font-medium">coming</span>
                          )}
                          {(feature as any).pro && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium">Pro</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50 border-t border-border">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Your first order is free.</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Full infrastructure, no credit card, no time limit.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup"><Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button></Link>
              <Link to="/pricing"><Button variant="hero-outline" size="xl">See pricing</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
