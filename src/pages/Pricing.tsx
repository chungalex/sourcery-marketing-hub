import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Check, ArrowRight, Building2, Zap, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const FREE_FEATURES = [
  "Full production OS — PO, sampling, milestones, QC",
  "Permanent order archive",
  "Milestone-gated payments (30% deposit gate, QC gate)",
  "Factory directory browse",
  "Platform messaging with translation",
  "Export PO as PDF",
  "Holiday alerts (Tet, Golden Week)",
  "Trade tools — tariff calculator, HTS codes, FTA guide",
];

const BUILDER_FEATURES = [
  "Everything in Free",
  "10 simultaneous active orders",
  "Production countdown (backward scheduling)",
  "Order health dashboard — green / amber / red",
  "Safety stock calculator",
  "Reorder intelligence",
  "Factory OTIF scoring",
  "Payment milestone calendar",
  "FX rate guidance",
  "AI tech pack reviewer",
  "Bill of materials tracker",
  "Shipment tracker",
  "Freight document checklist",
  "AI production assistant (full order context)",
  "AI quote analyser",
  "AI RFQ generator",
  "AI negotiation coach",
  "AI factory matcher",
  "RFQ system (multi-factory quotes)",
  "Timezone approvals",
];

const STUDIO_FEATURES = [
  "Everything in Builder",
  "Unlimited active orders",
  "3 team seats",
  "Supply chain compliance export (CSDDD, UFLPA, Modern Slavery Act)",
  "White-label PO PDF exports",
  "Spec library",
  "Supplier contact book",
  "Advanced analytics dashboard",
  "Custom milestone structures (up to 6 stages)",
  "Priority support",
];

const FAQS = [
  {
    q: "What happens after my free order?",
    a: "Your first order is completely free with no time limit. When you're ready to manage multiple orders simultaneously, upgrade to Builder. If you stay on Free, your closed order record stays accessible permanently — you never lose your production history.",
  },
  {
    q: "Can I bring my existing factory?",
    a: "Yes. BYOF (Bring Your Own Factory) is the primary way brands join. Invite your existing manufacturer with one link. They join free and get the full platform immediately. You're not locked into our network.",
  },
  {
    q: "How accurate are the intelligence features on my first few orders?",
    a: "Production countdown and order health work from day one — they use your delivery date and order status. Safety stock, reorder intelligence, and OTIF scores become more accurate after 3–5 completed orders when you have real lead time history. The platform gets smarter as you use it.",
  },
  {
    q: "Does the factory pay anything?",
    a: "No. Factories join and use the full platform completely free. You pay — they benefit from structured orders, protected payments, and a growing OTIF score that helps them attract more brands.",
  },
  {
    q: "What is Sourcery Managed?",
    a: "Sourcery Managed is a completely separate service where we handle your entire production run — factory selection, PO, sampling, QC, delivery — using Sourcery as the backbone. It's not a subscription tier. 3–5 slots available per season. See /studio for details.",
  },
  {
    q: "What are my data rights if I cancel?",
    a: "Your order history, production records, and factory relationships are permanently yours. If you cancel your subscription, your closed orders remain accessible on the Free tier. We don't hold your production history hostage.",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <SEO
        title="Pricing — Sourcery | Start free, scale when ready"
        description="Free for your first order. Builder from $49/month — backward scheduling, safety stock, OTIF scoring, AI tools. Enterprise supply chain tools at a founder price."
        canonical="/pricing"
      />

      {/* Hero */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Start free.<br />Scale when ready.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Your first order includes the full platform — no credit card, no time limit.
              When you're running multiple styles and seasons simultaneously, upgrade.
            </p>
            <div className="inline-flex items-center gap-2 bg-secondary rounded-full p-1">
              <button
                onClick={() => setAnnual(false)}
                className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all", !annual ? "bg-card shadow text-foreground" : "text-muted-foreground")}
              >Monthly</button>
              <button
                onClick={() => setAnnual(true)}
                className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5", annual ? "bg-card shadow text-foreground" : "text-muted-foreground")}
              >Annual <span className="text-xs text-primary font-semibold">save 32%</span></button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tier cards */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">

            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-7 flex flex-col"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">Free</p>
                </div>
                <div className="text-4xl font-bold text-foreground mb-1">$0</div>
                <p className="text-sm text-muted-foreground">Forever. Your first order, no limits.</p>
              </div>
              <Link to="/auth?mode=signup" className="mb-6">
                <Button variant="outline" className="w-full">Get started free</Button>
              </Link>
              <div className="space-y-2.5 flex-1">
                {FREE_FEATURES.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-foreground leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Builder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
              className="rounded-2xl border-2 border-primary bg-primary/5 p-7 flex flex-col relative"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>
              </div>
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-primary">Builder</p>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-bold text-foreground">${annual ? "33" : "49"}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {annual ? "Billed $399/year — save $189" : "or $399/year, save $189"}
                </p>
              </div>
              <Link to="/auth?mode=signup&plan=builder" className="mb-6">
                <Button className="w-full gap-2">Start Builder free <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <div className="space-y-2.5 flex-1">
                {BUILDER_FEATURES.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className={cn("h-3.5 w-3.5 flex-shrink-0 mt-0.5", f === "Everything in Free" ? "text-muted-foreground" : "text-primary")} />
                    <span className={cn("text-xs leading-relaxed", f === "Everything in Free" ? "text-muted-foreground italic" : "text-foreground")}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Studio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
              className="rounded-2xl border border-border bg-card p-7 flex flex-col"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">Studio</p>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-bold text-foreground">${annual ? "120" : "149"}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {annual ? "Billed $1,440/year" : "or $1,440/year"}
                </p>
              </div>
              <Link to="/auth?mode=signup&plan=studio" className="mb-6">
                <Button variant="outline" className="w-full">Start Studio free</Button>
              </Link>
              <div className="space-y-2.5 flex-1">
                {STUDIO_FEATURES.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className={cn("h-3.5 w-3.5 flex-shrink-0 mt-0.5", f === "Everything in Builder" ? "text-muted-foreground" : "text-foreground")} />
                    <span className={cn("text-xs leading-relaxed", f === "Everything in Builder" ? "text-muted-foreground italic" : "text-foreground")}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Enterprise row */}
          <div className="max-w-5xl mx-auto mt-4">
            <div className="border border-border rounded-2xl p-5 flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Enterprise</p>
                  <p className="text-xs text-muted-foreground mt-0.5">$500K+ annual production volume · custom integrations · dedicated support · SLA</p>
                </div>
              </div>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="whitespace-nowrap">Contact us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcery Managed callout */}
      <section className="section-padding border-b border-border bg-card/40">
        <div className="container max-w-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Not a subscription tier</p>
              <h2 className="text-xl font-bold text-foreground mb-1">Sourcery Managed</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                We handle your entire production run — factory selection, PO, sampling, QC, and delivery — using Sourcery as the backbone. You stay informed and in control. From $2,000 per production run. 3–5 slots available per season.
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
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What's included at each tier</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground w-2/5">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Free</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary">Builder</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Studio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Active orders", "1", "10", "Unlimited"],
                  ["Team seats", "1", "1", "3"],
                  ["Production OS (PO, QC, milestones)", "✓", "✓", "✓"],
                  ["Factory directory", "Browse", "Full access", "Full access"],
                  ["Platform messaging + translation", "✓", "✓", "✓"],
                  ["Production countdown (backward scheduling)", "—", "✓", "✓"],
                  ["Order health dashboard", "—", "✓", "✓"],
                  ["Safety stock calculator", "—", "✓", "✓"],
                  ["Reorder intelligence", "—", "✓", "✓"],
                  ["Factory OTIF scores", "—", "✓", "✓"],
                  ["AI tech pack reviewer", "—", "✓", "✓"],
                  ["AI production assistant", "—", "✓", "✓"],
                  ["AI quote analyser + RFQ generator", "—", "✓", "✓"],
                  ["Bill of materials tracker", "—", "✓", "✓"],
                  ["Shipment tracker", "—", "✓", "✓"],
                  ["Freight document checklist", "—", "✓", "✓"],
                  ["Supply chain compliance export", "—", "—", "✓"],
                  ["White-label PDF exports", "—", "—", "✓"],
                  ["Spec library", "—", "—", "✓"],
                  ["Advanced analytics", "—", "—", "✓"],
                ].map(([feature, free, builder, studio]) => (
                  <tr key={feature} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{feature}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground text-xs">{free}</td>
                    <td className="py-3 px-4 text-center text-xs font-medium text-primary">{builder}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground text-xs">{studio}</td>
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
          <h2 className="text-2xl font-bold text-foreground mb-3">Your first order is free. No time limit.</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Full platform. Real intelligence. One order on us. See why brands move from WhatsApp to Sourcery and don't go back.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/auth?mode=signup">Get started free <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">No credit card. No time limit. Cancel anytime.</p>
        </div>
      </section>
    </Layout>
  );
}
