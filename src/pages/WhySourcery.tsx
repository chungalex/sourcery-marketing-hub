import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, Shield } from "lucide-react";

const failures = [
  {
    number: "01",
    type: "The measurement error",
    question: "What does it cost when a spec issue slips past the sample stage?",
    setup: "You approve a sample over email. The factory starts bulk production. 500 units in, someone notices the waistband is 2cm off spec. The bulk is already cut and sewn.",
    costBreakdown: [
      { label: "Rework cost (at $4–6/unit on 500 units)", value: "$2,000–$3,000" },
      { label: "Production delay while rework completes", value: "2–3 weeks" },
      { label: "If the season is missed", value: "Full order margin" },
      { label: "Your leverage to recover costs", value: "None — you already approved the sample" },
    ],
    total: "A $2,000–$3,000 direct loss. Potentially much more if it's a seasonal product.",
    root: "The sample approval was informal. Nothing was logged. The factory built from a verbal understanding, not a verified spec.",
    gate: "Sample gate",
    gateDesc: "Sourcery requires the factory to submit the sample formally — with photos and measurements logged against the order. You approve or request a revision round with documented feedback the factory must acknowledge. Bulk production milestones cannot be funded until sample is approved. The gate is enforced by the platform.",
  },
  {
    number: "02",
    type: "The lost spec change",
    question: "What does it cost when a change never makes it to the factory properly?",
    setup: "Mid-production, you decide to change the fabric weight. You send a WhatsApp message. The factory reads it, maybe. They keep building from the original tech pack. 500 units arrive in the wrong fabric.",
    costBreakdown: [
      { label: "Remake cost if fabric is wrong (partial or full)", value: "$7,500–$15,000" },
      { label: "Delay while remake is produced", value: "4–8 weeks" },
      { label: "Your legal leverage without documentation", value: "Near zero — no paper trail" },
      { label: "Factory's likely position", value: "Disputes the change was ever communicated" },
    ],
    total: "Up to the full cost of the order, with no recovery path if the factory disputes it.",
    root: "The change was communicated informally. No version control. No acknowledgment from the factory. Nothing timestamped.",
    gate: "Revision round + tech pack versioning",
    gateDesc: "Every spec change on Sourcery is submitted as a formal revision round. The factory must acknowledge it before production continues. Each tech pack upload creates a new version — the factory confirms which version they're building from. If a dispute arises, the platform shows exactly what was communicated and when.",
  },
  {
    number: "03",
    type: "The post-payment defect",
    question: "What does it cost when you find quality issues after the final wire?",
    setup: "Goods arrive. You open the boxes. 15% of units — 75 out of 500 — have a stitching defect. They're unsellable. The factory has already received final payment.",
    costBreakdown: [
      { label: "Lost product cost on 75 unsellable units", value: "$1,125–$2,250" },
      { label: "Lost revenue if those units were pre-sold", value: "2–3× cost" },
      { label: "Cost of returning or disposing of defective units", value: "$300–$800" },
      { label: "Factory's likely concession without leverage", value: "5–10% off next order" },
      { label: "Your actual recovery", value: "Minimal" },
    ],
    total: "Direct loss of $1,500–$3,000+. Ongoing loss if defective units reach your customers.",
    root: "Final payment released before quality was verified. No formal QC. No documentation. No leverage.",
    gate: "QC gate",
    gateDesc: "On Sourcery, the final payment milestone cannot release without a QC pass. Defects are filed as structured reports — defect type, severity, quantity affected, photos, factory response — all logged against the order with timestamps. In a dispute, funds freeze and both parties submit evidence. You never release the last payment without a verified result.",
  },
];

const gates = [
  { name: "Sample gate", desc: "Bulk production funded only after formal sample approval. Revision rounds logged and factory-acknowledged." },
  { name: "Revision log", desc: "Every spec change is a formal revision round. Factory must acknowledge before production continues. Tech pack versions tracked." },
  { name: "QC gate", desc: "Final payment blocked until QC passes. Defects documented as structured reports with photos and factory response." },
];

export default function WhySourcery() {
  return (
    <Layout>
      <SEO
        title="Why Sourcery — What production mistakes actually cost"
        description="A measurement error. A lost spec change. A defect after the final payment. Here's what each one costs — in dollars — and the gate Sourcery puts in the way."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              What does a production mistake actually cost you?
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Not in abstract terms. In dollars, delays, and leverage. Three failure types that happen on real orders — with the math shown.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Failure scenarios */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="space-y-12">
            {failures.map((f, i) => (
              <motion.div
                key={f.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-border">
                  <div className="flex items-start gap-4">
                    <div className="font-mono text-sm text-muted-foreground pt-1 flex-shrink-0 w-8">{f.number}</div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{f.type}</p>
                      <h2 className="font-heading text-xl font-bold text-foreground">{f.question}</h2>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  {/* Left — the scenario and cost */}
                  <div className="p-6 md:p-8 space-y-6">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">What happens</p>
                      <p className="text-foreground leading-relaxed">{f.setup}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">The cost breakdown</p>
                      <div className="space-y-2">
                        {f.costBreakdown.map((item, j) => (
                          <div key={j} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
                            <span className="text-sm text-muted-foreground leading-snug">{item.label}</span>
                            <span className="text-sm font-medium text-foreground flex-shrink-0">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                      <p className="text-sm font-medium text-destructive mb-1">Total exposure</p>
                      <p className="text-sm text-foreground">{f.total}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Root cause</p>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">{f.root}</p>
                    </div>
                  </div>

                  {/* Right — the gate */}
                  <div className="p-6 md:p-8 bg-primary/3 space-y-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                      <p className="text-xs font-medium text-primary uppercase tracking-wide">The Sourcery gate</p>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{f.gate}</h3>
                    <p className="text-foreground leading-relaxed">{f.gateDesc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The three gates summary */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
              Three gates. Every order. Non-negotiable.
            </h2>
            <div className="space-y-4">
              {gates.map((g, i) => (
                <motion.div
                  key={g.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-background border border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{g.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
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
              It guarantees that every sample is formally approved before bulk production is funded, every spec change is acknowledged before work continues, and every final payment is gated behind a QC result. That's not a small thing when $15,000 is on the line.
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
              Get started free.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Bring your existing factory on in under 10 minutes. 3% transaction fee only when production moves. No subscription, no retainer.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">
                  Create free account
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="hero-outline" size="xl">
                  See how it works
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
