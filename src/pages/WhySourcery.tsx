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
    root: "No performance data before committing. The factory's QC history was invisible.",
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
    setup: "Mid-production, you change the fabric weight over WhatsApp. The factory maybe reads it. 500 units arrive in the wrong fabric and they dispute the change was ever communicated.",
    exposure: "Up to $15,000",
    root: "No version control. No factory acknowledgment. Nothing timestamped.",
    fix: "Formal revision rounds — the factory must acknowledge before production continues.",
    isMarketplace: false,
  },
  {
    number: "04",
    type: "The post-payment defect",
    setup: "The goods arrive. You open the boxes. 15% of units have a stitching defect — unsellable. The factory already has your final payment.",
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
        title="Why Sourcery — What production without a system actually costs"
        description="Finding the right factory is hard. Managing what happens next is harder. Here's what it costs when you have no system — and what Sourcery puts in the way."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Most brands building a product are managing production with the wrong tools.
            </h1>
            <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
              <p>
                Instagram DMs to find a factory. WhatsApp for spec changes. A folder somewhere that might have the current tech pack. A bank wire before quality is confirmed.
              </p>
              <p>
                When something goes wrong — and at some point, something does — there's no record of what was agreed, no paper trail to leverage, and no way to get your money back.
              </p>
            </div>
            <p className="text-foreground font-semibold text-lg mt-6">
              That's what Sourcery replaces.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Four scenarios — compact cards */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Four failure types. Real orders. Real costs.</p>
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
                {/* Top */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{s.number}</span>
                    <h2 className="font-heading font-bold text-foreground">{s.type}</h2>
                  </div>
                  <span className="text-sm font-bold text-destructive flex-shrink-0">{s.exposure}</span>
                </div>

                {/* Setup */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{s.setup}</p>

                {/* Root cause + fix */}
                <div className="space-y-2.5 pt-4 border-t border-border">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-rose-500 mt-0.5 flex-shrink-0">Why it happens</span>
                    <span className="text-xs text-muted-foreground leading-relaxed">{s.root}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-primary mt-0.5 flex-shrink-0">
                      {s.isMarketplace ? "The marketplace" : "The gate"}
                    </span>
                    <span className="text-xs text-foreground leading-relaxed">{s.fix}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cumulative callout */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20"
          >
            <p className="text-sm font-semibold text-foreground mb-2">These don't happen in isolation.</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A single bad order can involve all four. Wrong factory to begin with, spec approved informally, mid-production change lost in WhatsApp, defects found after the final wire. On a $15,000 production run, the combination can exceed the order value. Each one is preventable with a platform that enforces the gates by default.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Capital protection */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Every production run puts capital at risk. Sourcery gives you the structure to manage it.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              Sourcery doesn't hold your funds. What it gives you is something more durable — a documented, platform-enforced milestone structure that tells you exactly when each payment should move, and a permanent paper trail to back you up when something goes wrong.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Milestone-gated payments",
                  body: "Every order is structured around payment milestones — deposit, bulk production, final release. Sample approved before bulk begins. QC passed before final release. You release each milestone manually. Nothing moves without your confirmation.",
                },
                {
                  title: "Dispute documentation",
                  body: "If something goes wrong, the full order record is your leverage — every message timestamped, every revision acknowledged, every defect logged. You have documented grounds to withhold the final payment. You don't go into a dispute without evidence.",
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

      {/* Savings calculator */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              What does unstructured production cost you annually?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Enter your order volume. The calculator shows the estimated exposure from production failures — and what a Builder plan ($399/year) costs across the same volume.
            </p>
            <SavingsCalculator />
          </motion.div>
        </div>
      </section>

      {/* Organisation */}
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
                  before: '"Which version of the tech pack did they build from?"',
                  after: "Tech pack versions are numbered and factory-confirmed. You always know which version is current.",
                },
                {
                  before: '"Did they acknowledge that revision?"',
                  after: "Every revision round requires a formal factory acknowledgment before production continues. It's logged with a timestamp.",
                },
                {
                  before: '"Where did we land on that defect from last season?"',
                  after: "Every defect report — type, severity, factory response, resolution — is attached to the order permanently.",
                },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 rounded-xl bg-background border border-border">
                  <p className="text-sm text-muted-foreground italic mb-4 pb-4 border-b border-border">{item.before}</p>
                  <p className="text-sm text-foreground leading-relaxed">{item.after}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Traceability */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Once it's on the platform, it's there forever.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              Every closed order on Sourcery is a permanent record — not just for protection during production, but for everything that comes after.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  scenario: "Reordering 8 months later",
                  detail: "Every spec, measurement, material, and revision from the original order is preserved. No reconstructing from memory or hunting through old emails.",
                },
                {
                  scenario: "A factory dispute after delivery",
                  detail: "The full order record — every message timestamped, every revision acknowledged, every defect logged — is searchable and exportable. Built automatically, not assembled after the fact.",
                },
                {
                  scenario: "Bringing in a new team member",
                  detail: "Your entire production history lives in one place. New hires see every past order, every factory relationship, every QC result. Institutional knowledge doesn't live in someone's inbox.",
                },
                {
                  scenario: "Understanding your factory's track record",
                  detail: "Performance tracking builds from order data over time — QC results, response times, defect reports, on-time delivery. The longer you work together on the platform, the clearer the picture.",
                },
              ].map((item, i) => (
                <motion.div key={item.scenario} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border">
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

      {/* Honest close */}
      <section className="section-padding bg-card/50">
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
      <section className="section-padding">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Your first order is free.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Bring your existing factory or find one in the marketplace. Full infrastructure, no credit card, no time limit.
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
