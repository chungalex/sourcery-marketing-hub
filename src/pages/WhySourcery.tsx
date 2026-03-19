import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, Shield } from "lucide-react";

const scenarios = [
  {
    label: "Scenario 01",
    title: "The measurement error nobody caught until delivery",
    order: "$15,000 order — 500 units",
    without: [
      "Sample approved over email with no formal record",
      "Waistband 2cm off — caught after all 500 units are cut",
      "Rework cost: $2,000–3,000. Delay: 3 weeks. No leverage.",
    ],
    withSourcery: [
      "Sample submitted formally — measurements logged",
      "Issue flagged in review, revision round acknowledged by factory",
      "Bulk production only funded after corrected sample approved",
    ],
    saved: "$2,000–$3,000 + 2 weeks",
  },
  {
    label: "Scenario 02",
    title: "The spec change that got lost in a message thread",
    order: "$15,000 order — 500 units",
    without: [
      "Fabric weight change sent over WhatsApp, never confirmed",
      "Factory builds from old tech pack — 500 wrong units",
      "No paper trail. Factory disputes it was ever requested.",
    ],
    withSourcery: [
      "Spec change submitted as a formal revision round",
      "Factory must acknowledge before production continues",
      "Full timestamp trail if dispute arises — payment frozen",
    ],
    saved: "$5,000–$15,000",
  },
  {
    label: "Scenario 03",
    title: "The QC defect found after the final payment",
    order: "$15,000 order — 500 units",
    without: [
      "Final payment wired on factory's word alone",
      "15% of units arrive with stitching defects — factory already paid",
      "No leverage. Brand absorbs $2,000+ in unsellable goods.",
    ],
    withSourcery: [
      "QC inspection required — defects found before delivery",
      "Defect report filed with photos, severity, factory response",
      "Final payment frozen until QC pass confirmed",
    ],
    saved: "$2,000+ retained",
  },
];

export default function WhySourcery() {
  return (
    <Layout>
      <SEO
        title="Why Sourcery — The cost of unstructured production"
        description="A spec change in a WhatsApp thread. A sample approved over email. A final payment wired before QC. See what each scenario typically costs — and what Sourcery does about it."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              What unstructured production actually costs.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Most production losses aren't fraud. They're documentation failures — wrong spec built because the change was in a WhatsApp message, defect discovered after the final wire, sample approved over email with nothing in writing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Three scenarios. All avoidable.
            </h2>
            <p className="text-muted-foreground">
              Based on a typical $15,000 production order — 500 units at $30/unit — the kind of run a DTC brand does in year 2 or 3.
            </p>
          </motion.div>

          <div className="space-y-6">
            {scenarios.map((scenario, i) => (
              <motion.div
                key={scenario.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground mb-1 block">{scenario.label} — {scenario.order}</span>
                      <h3 className="font-semibold text-foreground text-lg">{scenario.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-xs text-muted-foreground">Typical saving:</span>
                      <span className="text-sm font-semibold text-primary">{scenario.saved}</span>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <span className="text-xs font-semibold text-destructive uppercase tracking-wide">Without Sourcery</span>
                    </div>
                    <ul className="space-y-2">
                      {scenario.without.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-destructive/50 mt-0.5 flex-shrink-0">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-primary/3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">With Sourcery</span>
                    </div>
                    <ul className="space-y-2">
                      {scenario.withSourcery.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="text-green-500 mt-0.5 flex-shrink-0">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto italic"
          >
            Savings figures are estimates based on typical production scenarios and are illustrative, not guaranteed. Actual outcomes vary by order, factory, product type, and manufacturing relationship.
          </motion.p>
        </div>
      </section>

      {/* What Sourcery does */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
              The three gates Sourcery enforces on every order.
            </h2>
            <div className="space-y-4">
              {[
                { gate: "Sample gate", desc: "Bulk production milestones cannot be funded until sample is formally approved. Not a guideline — enforced by the platform. Every revision round is logged and factory-acknowledged before production continues." },
                { gate: "Revision log", desc: "Every spec change is submitted as a formal revision round. The factory must acknowledge it before production moves forward. Tech pack versions are tracked — the factory confirms which version they're building from. No more 'I said, they said.'" },
                { gate: "QC gate", desc: "Final payment is blocked until QC inspection passes. Defects are filed as structured reports — type, severity, quantity, photos, factory response — all timestamped against the order. In a dispute, funds freeze and both parties submit evidence." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-background border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.gate}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
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
            <p className="text-muted-foreground leading-relaxed">
              It guarantees every problem is documented, every payment is gated, and every dispute has a paper trail. That's not a small thing when $15,000 is on the line.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Get started free.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Bring your existing factory on in under 10 minutes. No subscription, no retainer. 3% only when production moves.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">
                  Create free account
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/brands">
                <Button variant="hero-outline" size="xl">
                  Learn more
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
