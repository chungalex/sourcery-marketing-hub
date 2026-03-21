import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { ArrowRight, Shield, Search } from "lucide-react";

const scenarios = [
  {
    number: "01",
    type: "The wrong factory",
    setup: "You find a factory through a referral or an Instagram DM. The samples look fine. You wire 30% upfront. Six weeks later, 40% of units are defective — and the factory says it wasn't in the spec.",
    exposure: "$5,000–$15,000",
    root: "No performance data before committing. The factory's track record was invisible.",
    fix: "Verified credentials and AI-matched recommendations before you reach out.",
    isMarketplace: true,
  },
  {
    number: "02",
    type: "The measurement error",
    setup: "You approve a sample over email. 500 units into bulk production, the waistband is 2cm off spec. The fabric is already cut and sewn.",
    exposure: "$2,000–$3,000",
    root: "The approval was informal. Nothing was logged against the order.",
    fix: "Sample gate enforced by the platform. Bulk cannot begin until sample is formally approved.",
    isMarketplace: false,
  },
  {
    number: "03",
    type: "The lost spec change",
    setup: "Mid-production you change the fabric weight over WhatsApp. The factory maybe reads it. 500 units arrive in the wrong fabric and they dispute the change was ever communicated.",
    exposure: "Up to $15,000",
    root: "No version control. No factory acknowledgment. Nothing timestamped.",
    fix: "Formal revision rounds — the factory must acknowledge before production continues.",
    isMarketplace: false,
  },
  {
    number: "04",
    type: "The post-payment defect",
    setup: "The goods arrive. 15% of units have a stitching defect — unsellable. The factory already has your final payment.",
    exposure: "$1,500–$3,000+",
    root: "Final payment released before quality was verified. No documentation. No leverage.",
    fix: "Final milestone gated behind QC pass. You never release it without a verified result.",
    isMarketplace: false,
  },
];

export default function WhySourcery() {
  return (
    <Layout>
      <SEO
        title="Why Sourcery"
        description="Building a product is one thing. Getting it made is something else entirely. Sourcery is the infrastructure production has always needed."
      />

      {/* Hero — a feeling, not a problem */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Building a product is one thing.<br />Getting it made is something else entirely.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-3 max-w-xl">
              There's no training for this. You find a factory through a referral or a DM, wire thousands before you see a single sample, and manage the whole process through WhatsApp and a folder that might have the right spec version. When something goes wrong, there's no record of what was agreed and no leverage to fix it.
            </p>
            <p className="text-base text-foreground font-medium mt-6">
              That's not a skills problem. It's an infrastructure problem. Sourcery is what that infrastructure looks like.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The two halves — stated plainly, no cards */}
      <section className="section-padding border-b border-border">
        <div className="container-tight">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">The marketplace</p>
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                Find the right factory before you lock in a dollar.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                The hardest decision in production is committing capital before you have confidence. Sourcery shows you verified manufacturers — credentials confirmed, categories verified, performance tracked from every order on platform — before you reach out, before you wire anything. Start with information. Commit when you're sure.
              </p>
              <Link to="/marketplace">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">Browse factory network <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">The production OS</p>
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                Manage every order with a system built for it.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                From PO creation to closed delivery — every spec versioned, every revision acknowledged, every payment gated behind a verified condition, every defect documented with a timestamp. Whether you're on your first order or your fiftieth, the platform enforces the structure and builds the record automatically.
              </p>
              <Link to="/how-it-works">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">See how it works <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The scenarios — while emotional temperature is highest */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
              What it costs when the infrastructure isn't there.
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Four failure types from real production orders. Not edge cases.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {scenarios.map((s, i) => (
              <motion.div
                key={s.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{s.number}</span>
                    <h3 className="font-heading font-bold text-foreground">{s.type}</h3>
                  </div>
                  <span className="text-sm font-bold text-destructive flex-shrink-0">{s.exposure}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{s.setup}</p>
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-semibold text-rose-500 mt-0.5 flex-shrink-0">Why it happens</span>
                    <span className="text-xs text-muted-foreground leading-relaxed">{s.root}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-semibold text-primary mt-0.5 flex-shrink-0">
                      {s.isMarketplace ? "Marketplace" : "The gate"}
                    </span>
                    <span className="text-xs text-foreground leading-relaxed">{s.fix}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cumulative callout */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-5 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-sm font-semibold text-foreground mb-1.5">These don't happen in isolation.</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A single bad order can involve all four — wrong factory, informal sample approval, lost spec change, defects after the final wire. On a $15,000 production run, the combination can exceed the order value. Each one is preventable with a platform that enforces the right gates by default.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Capital protection */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              You're moving real money. The structure should reflect that.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              Sourcery doesn't hold your funds — money moves directly between you and your factory. What it gives you is more durable: milestone gates both parties agreed to before production started, and a complete paper trail if something goes wrong.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Milestone-gated payments",
                  body: "Every order is structured around payment milestones — deposit, bulk production, final release. Sample approved before bulk begins. QC passed before final release. You release each milestone manually. Nothing moves without your confirmation.",
                },
                {
                  title: "Your paper trail — built automatically",
                  body: "Every message timestamped. Every revision acknowledged. Every defect logged. If something goes wrong, the full order record is your leverage — not something you have to reconstruct after the fact. You never go into a dispute without documented evidence.",
                },
              ].map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 rounded-xl bg-background border border-border">
                  <h3 className="font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              What does unstructured production cost you annually?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Enter your order volume. The calculator shows your estimated exposure from production failures — and what a Builder plan ($399/year) costs against the same volume.
            </p>
            <SavingsCalculator />
          </motion.div>
        </div>
      </section>

      {/* The record — organisation + traceability compressed into one */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              The record that keeps paying off.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              Every closed order on Sourcery is a permanent, searchable record. The production run is managed in one place — not scattered across WhatsApp, email, WeTransfer, and a bank portal — which means nothing gets lost during the order. And after it closes, everything is still there.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "During production",
                  items: [
                    { q: '"Which version of the tech pack did they build from?"', a: "Tech pack versions are numbered and factory-confirmed. You always know which version is current." },
                    { q: '"Did they acknowledge that revision?"', a: "Every revision round requires factory acknowledgment before production continues. Timestamped." },
                  ],
                },
                {
                  title: "After the order closes",
                  items: [
                    { q: "Reordering 8 months later", a: "Every spec, measurement, material, and revision is preserved. No reconstructing from memory." },
                    { q: "A dispute after delivery", a: "The full record — messages, revisions, defects — is searchable and exportable. Built automatically." },
                  ],
                },
              ].map((col, ci) => (
                <motion.div key={ci} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.08 }}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{col.title}</p>
                  <div className="space-y-3">
                    {col.items.map((item, j) => (
                      <div key={j} className="p-5 rounded-xl bg-background border border-border">
                        <p className="text-sm text-muted-foreground italic mb-3 pb-3 border-b border-border">"{item.q}"</p>
                        <p className="text-sm text-foreground leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Honest close */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-xl bg-card border border-border">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">
              Sourcery doesn't guarantee you'll never have a production problem.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              It guarantees that every sample is formally approved before bulk production begins, every spec change is acknowledged before work continues, and every final payment gate requires a QC result before you release it. You own every decision. The platform enforces the structure and builds the paper trail. That's not a small thing when $15,000 is on the line.
            </p>
            <p className="text-xs text-muted-foreground italic">
              Cost figures above are illustrative estimates based on typical production scenarios. Actual costs vary by order size, product type, factory, and outcome. They are not guarantees of savings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Your first order is free.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Bring your existing factory or find one in the marketplace. Full infrastructure from day one. No credit card, no time limit.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="hero-outline" size="xl">Browse factory network</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
