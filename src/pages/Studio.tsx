import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

const WHO_ITS_FOR = [
  "First or second production run — you want to get it right without spending three months learning the hard way.",
  "You're sourcing from Vietnam and don't have factory contacts or local presence.",
  "You've placed an order before with no documentation and got burned.",
  "You'd rather build the brand than manage the production — and you're willing to pay for that.",
];

const WHAT_WE_HANDLE = [
  "Factory selection — matched to your category, MOQ, timeline, and price point",
  "Purchase order creation and formal documentation",
  "Sample coordination and revision management",
  "QC inspection — AQL standard, structured defect reporting",
  "Milestone-gated payments to protect your capital",
  "Shipping and delivery oversight",
  "Every step documented on Clewa — your record, permanently",
];

const PROCESS = [
  {
    n: "01",
    title: "Tell us what you're making",
    body: "Product type, quantity, target price, delivery timeline. A 20-minute call. We'll tell you honestly if it's a good fit — and if it isn't, we'll tell you why and what to do instead.",
  },
  {
    n: "02",
    title: "We match you with a factory",
    body: "From our Vietnam network — factories we've worked with personally. We know their strengths, their capacity limits, and where they fall short. We'll tell you which option we'd choose and why.",
  },
  {
    n: "03",
    title: "We run the order",
    body: "PO, sampling, revisions, QC, delivery. Every step documented on Clewa. You get notified at each milestone and give final approval. Nothing moves without your sign-off.",
  },
  {
    n: "04",
    title: "You receive the goods with a complete record",
    body: "Every spec, revision, QC result, and payment milestone permanently documented. Use it for reorders, disputes, investor due diligence, or the next factory conversation.",
  },
];

export default function Studio() {
  return (
    <Layout>
      <SEO
        title="Clewa Studio — Managed Production | Clewa"
        description="We run your production end to end — factory selection, PO, sampling, QC, delivery. We run a factory in Vietnam. We run a brand that sources from Vietnam. 3 slots available per season."
        ogImage="https://clewa.io/og-image.png"
      />

      {/* Hero */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Clewa Studio</p>
            <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-6 leading-tight">
              3 slots. We run your production —<br className="hidden md:block" /> factory to delivery.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
              We run HU LA Studios — a garment factory in Ho Chi Minh City. We run OKIO Denim — a brand that sources from Vietnam. We've been on both sides of the same order. That's not a line. It's why this service exists.
            </p>
            <p className="text-base text-foreground leading-relaxed mb-8 max-w-2xl">
              When something goes wrong in a production run — and something always does — the person managing it matters. We know what a factory's body language means at week 6. We know when "it's fine" isn't fine. We know how to hold leverage without burning the relationship.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/contact?subject=managed-production">Apply for a slot <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/orders/create">Manage it yourself →</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">3 slots available this season. Not first-come-first-served — we're selective about fit.</p>
          </motion.div>
        </div>
      </section>

      {/* Why only 3 */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-normal text-foreground mb-6">Why only 3 slots.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We don't take volume. Every run we manage gets the same attention we give our own production. That means factory visits, direct communication with QC teams, and a person who actually cares if your goods arrive on spec. That takes time. Three slots is how many we can do without cutting corners on any of them.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We also turn briefs down. If your timeline is unrealistic, if the product isn't suited to our factory network, or if the fit isn't right — we'll tell you in the first call and point you somewhere better. We'd rather lose the work than run a production that fails.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-normal text-foreground mb-6">Who this is for.</h2>
            <div className="space-y-3">
              {WHO_ITS_FOR.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-normal text-foreground mb-8">How it works.</h2>
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
          </motion.div>
        </div>
      </section>

      {/* What we handle */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-normal text-foreground mb-6">What we handle.</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {WHAT_WE_HANDLE.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-card border border-border">
                  <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-normal text-foreground mb-2">Pricing.</h2>
            <p className="text-muted-foreground mb-8">Flat fee per run. No percentage of order value — we work for you, not against your margin.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  name: "First run",
                  price: "$2,000",
                  desc: "For brands placing their first overseas production order. Full cycle — factory selection, PO, sampling, QC, delivery.",
                  features: [
                    "Up to 500 units",
                    "Single factory",
                    "One revision round included",
                    "Full Clewa documentation",
                  ],
                },
                {
                  name: "Production run",
                  price: "$3,500",
                  desc: "For brands with a product ready to scale. Higher volume, more complex coordination, faster iteration.",
                  features: [
                    "500–5,000 units",
                    "Multiple factories supported",
                    "Two revision rounds included",
                    "Priority access and support",
                  ],
                },
              ].map((tier) => (
                <div key={tier.name} className="p-6 rounded-xl border border-border bg-card">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{tier.name}</p>
                  <p className="text-3xl font-bold text-foreground mb-1">{tier.price}</p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{tier.desc}</p>
                  <div className="space-y-2">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-normal text-foreground mb-3">Apply for a slot.</h2>
            <p className="text-muted-foreground mb-2 max-w-xl">Tell us what you're making, your quantity, and your timeline. We'll respond within 48 hours.</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-xl">If it's not the right fit — wrong product category, unrealistic timeline, not enough margin — we'll tell you that too. And point you somewhere useful.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/contact?subject=managed-production">Apply for a slot <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Prefer to manage your own production?{" "}
              <Link to="/auth" className="text-primary hover:underline">
                Create a free Clewa account
              </Link>{" "}
              — your first order is free, no time limit.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
