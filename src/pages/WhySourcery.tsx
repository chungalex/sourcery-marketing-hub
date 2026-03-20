import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
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
    gateDesc: "Sourcery requires the factory to submit the sample formally — with photos and measurements logged against the order. You approve or request a revision round with documented feedback the factory must acknowledge. Bulk production cannot begin until sample is approved. The gate is enforced by the platform.",
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
    gateDesc: "On Sourcery, the final payment milestone cannot release without a QC pass. Defects are filed as structured reports — defect type, severity, quantity affected, photos, factory response — all logged against the order with timestamps. In a dispute, you have the full documented record as your basis to withhold the final payment. You never release the last milestone without a verified result.",
  },
];

const gates = [
  { name: "Sample gate", desc: "Bulk production cannot begin until sample is formally approved. Revision rounds logged and factory-acknowledged." },
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
              Not in abstract terms. In dollars, delays, and leverage. Production is stressful enough without the added weight of knowing a single mistake can cost thousands. Three failure types that happen on real orders — and the gates that prevent them.
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

      {/* Capital protection section */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Every production run puts capital at risk. Sourcery gives you the structure to manage it.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              Sourcery doesn't hold your funds. What it gives you is something more durable — a documented, platform-enforced milestone structure that tells you exactly when each payment should move, and a permanent paper trail to back you up when something goes wrong.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Milestone-gated payments",
                  body: "Every order is structured around payment milestones — deposit, bulk production, final release. The platform enforces the conditions that must be met before each stage. Sample approved before bulk production begins. QC passed before final release. You release each milestone manually. Nothing moves without your confirmation.",
                },
                {
                  title: "Dispute documentation",
                  body: "If something goes wrong, the full order record is your leverage — every message timestamped, every revision acknowledged, every defect logged. You have documented grounds to withhold the final payment. You don't go into a dispute without evidence.",
                },
                {
                  title: "You control every release",
                  body: "You set the milestone structure when you create the order. You approve each release manually. The platform tracks and enforces the gates — you hold the keys. No payment stage moves without your explicit confirmation.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-xl bg-background border border-border"
                >
                  <h3 className="font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Traceability forever */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Once it's on the platform, it's there forever.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              Every closed order on Sourcery is a permanent record. Not just for protection during production — but for everything that comes after.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  scenario: "Reordering 8 months later",
                  detail: "Every spec, measurement, material, and revision from the original order is preserved. You know exactly what you built from. No reconstructing specs from memory or hunting through old emails.",
                },
                {
                  scenario: "A factory dispute after delivery",
                  detail: "The full order record — every message timestamped, every revision acknowledged, every defect logged — is searchable and exportable. Your paper trail is built automatically throughout the order, not assembled after the fact.",
                },
                {
                  scenario: "Bringing in a new team member",
                  detail: "Your entire production history lives in one place. New hires see every past order, every factory relationship, every QC result. Institutional knowledge doesn't live in someone's inbox.",
                },
                {
                  scenario: "Understanding your factory's track record",
                  detail: "Performance scores build from real order data over time — QC pass rate, response time, defect history, on-time delivery. The longer you work together on the platform, the clearer the picture becomes.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.scenario}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5">{item.scenario}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Organisation saves time */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              One place. Everything attached to the right order.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              The average production run is managed across 4–6 different tools — WhatsApp, email, WeTransfer, bank portals, spreadsheets, Google Drive. Sourcery replaces all of it. Not because it's neater, but because fragmentation is where things get lost — and lost things cost money.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  before: "\"Which version of the tech pack did they build from?\"",
                  after: "Tech pack versions are numbered and factory-confirmed. You always know which version is current.",
                },
                {
                  before: "\"Did they acknowledge that revision?\"",
                  after: "Every revision round requires a formal factory acknowledgment before production continues. It's logged with a timestamp.",
                },
                {
                  before: "\"Where did we land on that defect from last season?\"",
                  after: "Every defect report — type, severity, factory response, resolution — is attached to the order permanently.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-xl bg-background border border-border"
                >
                  <p className="text-sm text-muted-foreground italic mb-4 pb-4 border-b border-border">
                    {item.before}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{item.after}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              It guarantees that every sample is formally approved before bulk production begins, every spec change is acknowledged before work continues, and every final payment gate requires a QC result before you release it. You own every decision. The platform enforces the structure and builds the paper trail. That's not a small thing when $15,000 is on the line.
            </p>
            <p className="text-xs text-muted-foreground italic">
              Cost figures above are illustrative estimates based on typical production scenarios. Actual costs vary by order size, product type, factory, and outcome. They are not guarantees of savings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Savings calculator */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              What does unstructured production cost you annually?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Enter your order volume. The calculator shows the estimated exposure from production failures — and what a Sourcery subscription costs across the same volume.
            </p>
            <SavingsCalculator />
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
              Bring your existing factory on in under 10 minutes. First order free, no credit card required.
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
