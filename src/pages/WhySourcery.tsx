import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { ArrowRight, Shield, Search, Clock, Eye, FileCheck, Zap } from "lucide-react";
import { ProductionAssistant } from "@/components/va/ProductionAssistant";

const efficiencyPoints = [
  {
    icon: Clock,
    title: "Spec management that doesn't chase itself",
    time: "Saves 2–4 hrs per revision round",
    body: "Every change is a formal revision round the factory must acknowledge before production continues. No following up to confirm the message was read. No wondering if the right version made it to the floor.",
  },
  {
    icon: FileCheck,
    title: "Reorders that take minutes, not days",
    time: "Saves 2–4 hrs per reorder",
    body: "Every spec, measurement, material, and revision from every closed order is preserved permanently. Reorder from a complete record — not from memory and a folder of old email attachments.",
  },
  {
    icon: Eye,
    title: "Visibility without asking for it",
    time: "Eliminates daily check-in overhead",
    body: "Every order has a live status, a message thread attached to it, and a milestone tracker. You know exactly where things stand without sending a message to find out.",
  },
  {
    icon: Zap,
    title: "Production that scales without the chaos",
    time: "Saves 40–80 hrs/year at 10 orders",
    body: "One system your whole team works from. New hires see the full production history. No institutional knowledge living in someone's inbox. The operation is bigger than any one person.",
  },
];

const securityPoints = [
  {
    title: "Every decision has a record",
    body: "Sample approved with photos and measurements. Spec changes acknowledged. Defects filed with factory response. Every milestone gated and manually released by you. The record builds automatically — you don't have to think about it.",
  },
  {
    title: "Every payment has a condition",
    body: "Sample approved before bulk production begins. QC passed before final release. Nothing moves without your confirmation. You always know exactly what you agreed to pay for — and exactly when each amount should move.",
  },
  {
    title: "Every dispute has evidence",
    body: "If something goes wrong, the full order record is already there — timestamped, searchable, exportable. You don't go into a conversation with a factory relying on your memory. You have documentation.",
  },
  {
    title: "Every factory has a track record",
    body: "Credentials verified before listing. Performance builds with every order on the platform. You can see what a factory's track record looks like before you commit — not after the deposit is sent.",
  },
];

const scenarios = [
  {
    number: "01",
    type: "The wrong factory",
    setup: "You find a factory through a referral. Samples look fine. You wire 30% upfront. Six weeks later, 40% of units are defective. The factory says it wasn't in the spec.",
    exposure: "$5,000–$15,000 + 8–12 weeks",
    root: "No performance data before committing. The factory's track record was invisible.",
    fix: "Verified credentials and AI-matched recommendations before you reach out.",
    isMarketplace: true,
  },
  {
    number: "02",
    type: "The measurement error",
    setup: "You approve a sample over email. 500 units into bulk, the waistband is 2cm off spec. The fabric is already cut and sewn.",
    exposure: "$2,000–$3,000 + 2–3 weeks",
    root: "The approval was informal. Nothing was logged against the order.",
    fix: "Sample gate enforced by the platform. Bulk cannot begin until sample is formally approved.",
    isMarketplace: false,
  },
  {
    number: "03",
    type: "The lost spec change",
    setup: "You change the fabric weight mid-production over email or a message thread. The factory maybe reads it. 500 units arrive in the wrong fabric. They dispute the change was communicated.",
    exposure: "Up to $15,000 + 4–8 weeks",
    root: "No version control. No factory acknowledgment. Nothing timestamped.",
    fix: "Formal revision rounds — the factory must acknowledge before production continues.",
    isMarketplace: false,
  },
  {
    number: "04",
    type: "The post-payment defect",
    setup: "The goods arrive. 15% of units are unsellable. The factory already has your final payment.",
    exposure: "$1,500–$3,000+ + dispute overhead",
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
        description="Production that's faster, more visible, and more secure. Sourcery is the infrastructure that makes it possible."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              The gap between how production should work
and how it actually works for most brands — closed.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-3 max-w-xl">
              Most production runs on tools that weren't built for it. Spec changes over messaging apps. Sample approvals over email. A bank portal for payments. When things work, it's fine. When they don't, there's no record, no structure, and no clear path forward.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Sourcery is the infrastructure that makes production efficient, visible, and protected — so your time and your capital are both working for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Efficiency */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Efficiency</p>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              The gap between how big brands manage production and how you do it — closed.
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              The average production run is managed across 4–6 different tools. That fragmentation creates constant overhead — chasing confirmations, reconstructing specs, coordinating the same information in multiple places. Sourcery collapses all of it into one system.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {efficiencyPoints.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex-shrink-0">{item.time}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 p-5 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                For a brand running 10 orders a year, unstructured production overhead adds up to <span className="font-semibold text-foreground">40–80 hours annually</span> — coordination that produces nothing. Sourcery handles that coordination by default.
              </p>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-primary">40–80 hrs</p>
                <p className="text-xs text-muted-foreground">saved per year at 10 orders</p>
              </div>
            </div>

            {/* Bullwhip cost argument */}
            <div className="flex items-start justify-between gap-6 p-5 rounded-xl bg-card border border-border">
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">The cost of one missed season</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Late delivery = missed retail window = emergency air freight ($3–8K) or deep discounts to clear old stock (20–40% margin hit).
                  One missed season on a $50K production run costs more than 5 years of Sourcery.
                  The reorder intelligence feature exists specifically to prevent this.
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-primary">$5–20K</p>
                <p className="text-xs text-muted-foreground">cost of one missed season</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security */}
      <section className="section-padding bg-card/50">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Security</p>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              Production intelligence that prevents the expensive surprises.
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Security in production isn't just about protecting against the worst case. It's the confidence of knowing exactly what was agreed, where the money is, what stage the order is at, and what your leverage is if something shifts. Sourcery makes that visibility the default — not something you have to work to maintain.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityPoints.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-5 rounded-xl bg-background border border-border"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mb-4" />
                <h3 className="font-semibold text-foreground text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capital */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Capital</p>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              Your capital moves on your terms. Not theirs.
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Every production order involves real money moving to a manufacturer before you've seen the finished product. Sourcery doesn't hold your funds — but it gives you something more valuable: a documented, platform-enforced structure that tells you exactly when each payment should move, and the paper trail to back you up if it doesn't.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "Milestone-gated payments",
                body: "Deposit, bulk production, final release — each gated behind a verified condition. Sample approved before bulk begins. QC passed before final release. You release each milestone manually. Nothing moves without your explicit confirmation.",
              },
              {
                title: "Your paper trail, built automatically",
                body: "Every message timestamped. Every revision acknowledged. Every defect logged with factory response. If you need to withhold a payment or escalate a dispute, the record is already there — built throughout the order, not assembled after the fact.",
              },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace callout */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid md:grid-cols-2 gap-8 p-8 rounded-2xl bg-primary/5 border border-primary/20 items-center">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Search className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">The marketplace</p>
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                  Efficiency and security start before the first order.
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Starting with the right factory is the foundation everything else sits on. The Sourcery marketplace shows you verified manufacturers — credentials confirmed, performance tracked from every order on platform — before you commit to anything. Browse free. Contact on Builder.
                </p>
              </div>
              <div className="space-y-2.5">
                {[
                  "Credentials verified before listing",
                  "Performance record builds from the first order",
                  "AI-matched to your product, MOQ, certifications",
                  "Browse free — confirm fit before committing",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <Link to="/marketplace">
                    <Button size="sm" className="gap-1.5 text-xs">Browse factory network <ArrowRight className="h-3.5 w-3.5" /></Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              What does unstructured production cost you annually?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Enter your order volume. The calculator shows your estimated financial exposure from production failures — and what a Builder plan ($399/year) costs against it.
            </p>
            <SavingsCalculator />
          </motion.div>
        </div>
      </section>

      {/* What happens without it — scenarios as proof */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
              What production looks like without the infrastructure.
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Four scenarios from real orders. Each one a direct result of missing structure — and a specific gate that prevents it.
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
                  <span className="text-xs font-semibold text-destructive flex-shrink-0 text-right">{s.exposure}</span>
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

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-5 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-sm font-semibold text-foreground mb-1.5">These don't happen in isolation.</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A single bad order can involve all four — wrong factory, informal sample approval, lost spec change, defects after the final wire. On a $15,000 production run, the combination can exceed the order value. Each one is preventable with a platform that enforces the right structure by default.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Demo VA */}
      <section className="section-padding border-t border-border">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Production assistant</p>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                  Have a production question? Ask it now.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Every question you have about production — incoterms, lead times, factory evaluation, QC standards, freight — gets a real answer. On a live order, it knows your specific context. Ask it anything.
                </p>
              </div>
              <ProductionAssistant mode="demo" className="w-full" />
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
              It guarantees that every sample is formally approved before bulk production begins, every spec change is acknowledged before work continues, and every final payment gate requires a QC result before you release it. You own every decision. The platform enforces the structure and builds the record. That's not a small thing when $15,000 is on the line.
            </p>
            <p className="text-xs text-muted-foreground italic">
              Cost and time figures above are illustrative estimates based on typical production scenarios. Actual results vary by order size, product type, factory, and circumstances.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      
      {/* Production intelligence section */}
      <section className="section-padding border-t border-border">
        <div className="container-tight">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Why the record matters beyond disputes</p>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              The platform that tells you what's coming.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              There's a well-documented phenomenon in supply chains called the bullwhip effect: small hesitations by a brand — a 2-week delay on a PO — cascade into months of factory capacity disruption. The cause is always the same. The brand can't see the factory's capacity. The factory can't see the brand's demand signals. Both make decisions based on incomplete information.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Sourcery closes this gap. After your first completed order, the platform knows your lead time with each factory. It knows your reorder patterns. It knows when your production gates typically complete. It uses this to tell you: issue your next PO by this date to hit your target delivery. Reserve your factory slot this week — their capacity will be spoken for otherwise.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This is what enterprise brands pay $50,000/year for in supply chain software. Sourcery makes it available from your first completed order, at $49/month. The documentation is what makes the intelligence possible. The intelligence is what makes the documentation worth more than a record.
            </p>
          </div>
        </div>
      </section>

<section className="section-padding">
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
