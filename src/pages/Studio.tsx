import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Package, Factory, Shield, Clock } from "lucide-react";

const WHAT_WE_HANDLE = [
  "Factory selection — we know these factories personally and match you based on your category, MOQ, and timeline.",
  "Purchase order creation and formal documentation",
  "Sample coordination and revision management",
  "QC inspection — AQL standard, defect reporting",
  "Milestone payments structured to protect you",
  "Shipping and delivery oversight",
  "Every step documented on Sourcery — your record, permanently",
];

const WHO_ITS_FOR = [
  "First or second production run — you want to get it right without spending 3 months learning the hard way.",
  "You're sourcing from Vietnam and don't have factory contacts or local presence.",
  "You've placed an order before with no documentation and got burned.",
  "You'd rather build the brand than manage the production — and you're willing to pay for that.",
];

const PROCESS = [
  { n: "01", title: "Tell us what you're making", body: "Product type, quantity, target price, delivery timeline. 15-minute intake call. We tell you honestly if we can help." },
  { n: "02", title: "We match you with a factory", body: "From our Vietnam network. We've worked with these factories ourselves. We know their strengths, their lead times, and where they fall short — and we'll tell you honestly." },
  { n: "03", title: "We run the order", body: "PO, sampling, revisions, QC, delivery. Every step documented on Sourcery. You get notified at each milestone and give final approval. Nothing moves without your sign-off." },
  { n: "04", title: "You receive the goods with a complete record", body: "Every spec, revision, QC result, and payment milestone permanently documented. Use it for reorders, disputes, or due diligence." },
];

export default function Studio() {
  return (
    <Layout>
      <SEO
        title="Sourcery Managed — Full-Service Production | Sourcery"
        description="We manage your production run end to end — factory selection, PO, sampling, QC, delivery. Powered by Sourcery. Starting from $2,000 per run."
        ogImage="https://sourcery.so/og-image.png"
      />

      {/* Hero */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Sourcery Studio</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Your production, managed.<br className="hidden md:block" /> End to end.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              We handle factory selection, purchase orders, sampling, QC, and delivery — using Sourcery as the backbone. You stay informed at every step. Nothing moves without your approval.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/contact?subject=managed-production">Apply for a managed slot <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/orders/create">Manage it yourself →</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">3–5 slots available per season. We're selective — not every brief is the right fit.</p>
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-8">Who this is for</h2>
          <div className="space-y-3">
            {WHO_ITS_FOR.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-8">How it works</h2>
          <div className="space-y-6">
            {PROCESS.map((step) => (
              <div key={step.n} className="flex gap-5">
                <span className="font-mono text-sm font-bold text-primary/40 flex-shrink-0 mt-0.5 w-8">{step.n}</span>
                <div>
                  <p className="font-semibold text-foreground mb-1">{step.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we handle */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-8">What we handle</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {WHAT_WE_HANDLE.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-card border border-border">
                <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-2">Pricing</h2>
          <p className="text-muted-foreground mb-8">Simple and transparent. No percentage of order value — we charge a flat fee per production run.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                name: "First run",
                price: "$2,000",
                desc: "For brands placing their first overseas production order. Full cycle — factory, PO, sampling, QC, delivery.",
                features: ["Up to 500 units", "Single factory", "One revision round included", "Full Sourcery documentation"],
              },
              {
                name: "Production run",
                price: "$3,500",
                desc: "For brands with a product ready to scale. Multiple factories, higher volume, more complex coordination.",
                features: ["500–5,000 units", "Multiple factories supported", "Two revision rounds included", "Priority support"],
              },
            ].map(tier => (
              <div key={tier.name} className="p-6 rounded-xl border border-border bg-card">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{tier.name}</p>
                <p className="text-3xl font-bold text-foreground mb-1">{tier.price}</p>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{tier.desc}</p>
                <div className="space-y-2">
                  {tier.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Ready to start?</h2>
          <p className="text-muted-foreground mb-6">Tell us what you're making. We'll let you know within 48 hours if it's a good fit.</p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/contact?subject=managed-production">Apply for a managed slot <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Or manage your own production with Sourcery — <Link to="/auth" className="text-primary hover:underline">create a free account</Link>.</p>
        </div>
      </section>
    </Layout>
  );
}
