import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, CheckCircle } from "lucide-react";

const included = [
  "Unlimited orders — BYOF and network",
  "Full order lifecycle management — sampling, revisions, QC, payments",
  "Milestone escrow on every order",
  "Tech pack versioning",
  "Revision round tracking",
  "Defect reporting and documentation",
  "On-platform messaging with full history",
  "Factory performance scoring",
  "AI Factory Matcher",
  "Factory invite (BYOF) — unlimited invites",
  "Factory network access",
  "Order history and analytics",
];

const comingSoon = [
  "AI Tech Pack Reviewer — risk analysis before it goes to factory",
  "AI RFQ Generator — structured brief in minutes",
  "AI Quote Analyzer — benchmarked against real order data",
  "Email notifications",
  "Order timeline view — exportable PDF",
  "Factory comparison side-by-side",
];

const faqs = [
  {
    q: "When do I pay the fee?",
    a: "The 3% is calculated on the total order value and charged when the order is created. It covers the full platform functionality for that order — escrow, sampling gates, revision tracking, QC documentation, dispute infrastructure.",
  },
  {
    q: "Does the fee apply to BYOF orders — my own factories?",
    a: "Yes. The 3% applies to all orders processed through the platform — BYOF and network orders alike. The fee covers the infrastructure that protects every order regardless of how the factory relationship started.",
  },
  {
    q: "Is there a free trial?",
    a: "The platform is free to join and set up. You only pay the transaction fee when you create a production order with payment milestones. You can invite factories, explore the platform, and use the AI matcher without any charge.",
  },
  {
    q: "Do factories pay anything?",
    a: "No. Factories join the network free. The transaction fee is paid by brands. Sourcery earns only when orders move — and that incentive should be aligned with both sides.",
  },
  {
    q: "Will pricing change?",
    a: "The 3% flat rate is our launch pricing. We'll communicate clearly if that changes, and existing orders will always be honored at the rate they were created at.",
  },
];

export default function Pricing() {
  return (
    <Layout>
      <SEO
        title="Pricing — Sourcery"
        description="3% transaction fee. No subscription, no retainer, no upfront cost. Sourcery earns only when your production is moving."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Simple, transparent pricing.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              No subscription. No retainer. No upfront fee. Sourcery charges a 3% transaction fee on every order — only when your production is moving.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main pricing card */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card border-2 border-primary/20 rounded-2xl p-8">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Transaction fee</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-6xl font-bold text-foreground">3%</span>
                  <span className="text-muted-foreground">of order value</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Per order. No subscription.</p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "Free to join and set up",
                  "Free factory invites (BYOF)",
                  "Free AI Factory Matcher",
                  "3% on every production order",
                  "All platform features included",
                  "No hidden fees",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/auth?mode=signup">
                <Button className="w-full" size="lg">
                  Get started free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                No credit card required to sign up
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Everything included</h3>
                <ul className="space-y-2">
                  {included.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">In development — included when live</h3>
                <ul className="space-y-2">
                  {comingSoon.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">What this looks like on a real order</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { order: "$5,000 order", fee: "$150", covers: "500 units at $10/unit" },
                { order: "$25,000 order", fee: "$750", covers: "1,000 units at $25/unit" },
                { order: "$100,000 order", fee: "$3,000", covers: "Large production run" },
              ].map((ex) => (
                <div key={ex.order} className="p-6 rounded-xl bg-background border border-border">
                  <p className="text-sm text-muted-foreground mb-1">{ex.covers}</p>
                  <p className="text-xl font-semibold text-foreground mb-1">{ex.order}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
                    <span className="text-sm text-muted-foreground">Sourcery fee (3%)</span>
                    <span className="font-semibold text-foreground">{ex.fee}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6 text-center">
              The fee covers: escrow protection, milestone enforcement, sampling gate, revision tracking, QC gating, and dispute infrastructure on every order.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">Pricing questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="pb-6 border-b border-border last:border-0">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Start for free.</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Set up your account, invite your factory, explore the platform. No charge until you create a production order.
            </p>
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl">
                Create free account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
