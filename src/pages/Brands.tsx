import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, CheckCircle, Shield, Clock, Package, MessageSquare, FileText, RotateCcw } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const benefits = [
  {
    icon: Package,
    title: "Immediate value — no ramp up",
    description: "Invite your existing factory and create your first order in under 10 minutes. Full platform functionality from day one. The marketplace is available when you need it.",
  },
  {
    icon: Shield,
    title: "Payment you control",
    description: "Deposit on PO, production milestone after sample approval, final release after QC pass. Every stage requires verification. You never release funds without a confirmed milestone.",
  },
  {
    icon: MessageSquare,
    title: "On-platform communication",
    description: "Every message logged, timestamped, attached to the order. No more scattered threads or lost conversations. One place. Full history. Searchable forever.",
  },
  {
    icon: RotateCcw,
    title: "Formal revision tracking",
    description: "Every spec change submitted as a revision round the factory must formally acknowledge. No ambiguity about what was agreed and when.",
  },
  {
    icon: FileText,
    title: "Tech pack versioning",
    description: "Every upload creates a new version. Old versions preserved. The factory confirms which version they're building from. Version conflicts cause production errors — this prevents them.",
  },
  {
    icon: Clock,
    title: "Sampling gate enforced",
    description: "Bulk production milestones cannot be funded until sample is approved. This gate is enforced by the platform, not optional. No more wiring production funds before the sample is right.",
  },
];

const idealFor = [
  "Brands 1–5 years in with 1–5 active factory relationships",
  "Founders currently managing production over WhatsApp and email",
  "Brands who have been burned before and want accountability on the next order",
  "DTC labels scaling past their first production run into repeat orders",
  "Designer brands moving from domestic sampling to overseas production",
];

const faqs = [
  {
    question: "Do I have to use factories in your network?",
    answer: "No. Bring Your Own Factory is the primary way most brands start. Invite your existing manufacturer and manage every order on-platform immediately. The marketplace is available when you need to find a new manufacturing partner.",
  },
  {
    question: "What if there's a quality dispute?",
    answer: "Every defect is documented as a structured report — type, severity, quantity affected, photos, factory response — all timestamped against the order. The platform requires QC pass before releasing final payment. In a formal dispute, funds freeze and both parties submit evidence before resolution. The paper trail built throughout the order is your protection.",
  },
  {
    question: "How does vetting work for network factories?",
    answer: "Network factories go through credential review, certification verification, and production capability assessment before being listed. Performance is tracked across every completed order. We actively remove factories that fall below threshold. We recommend brands also conduct their own verification — requesting samples and starting with smaller trial orders regardless of network status.",
  },
  {
    question: "What does Sourcery cost?",
    answer: "3% transaction fee on every order processed through the platform — BYOF and network orders alike. No subscription, no retainer, no upfront fee. We earn only when your production is moving.",
  },
  {
    question: "Can I negotiate terms directly with my factory?",
    answer: "Absolutely. Sourcery is a platform, not an intermediary. Your commercial relationship with your factory is your own. The platform provides the structure, documentation, and payment protection — it doesn't manage the relationship for you.",
  },
];

export default function Brands() {
  return (
    <Layout>
      <SEO
        title="For Brands — Sourcery"
        description="Production management built for growing brands. Milestone-protected payments, formal sampling gates, revision tracking, and QC documentation — all on one platform."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                For brands
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Production management built for growing brands.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Sourcery gives you the structure most brands only discover after their first major production mistake. Milestone-protected payments, formal sampling gates, revision tracking, and QC documentation — all on one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="xl">
                    Get started free
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
        </div>
      </section>

      {/* Who it's for */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Built for brands at the hard stage.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Not the first prototype. Not the enterprise procurement team. The stage in between — where you have real production relationships and real money on the line.
            </p>
            <ul className="space-y-3">
              {idealFor.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-card/50">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Every step of production. Documented.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-6 rounded-xl bg-background border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured order creation */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Built for brands at every stage of production experience.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're placing your first production order or your fiftieth, the same problems come up: incomplete specs, missed incoterms, unclear QC standards, vague delivery windows. Sourcery's order creation process is structured to walk you through every decision that matters — so nothing critical gets skipped.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              {
                step: "01",
                title: "Factory, product & specifications",
                desc: "Select your factory, enter quantity, and document your product specifications in a structured form. Attach your tech pack URL and Bill of Materials. Both factory and brand see the same spec from the same place from the moment the order is created.",
              },
              {
                step: "02",
                title: "Pricing, delivery window & incoterms",
                desc: "Unit price, currency, delivery window start and end dates, and incoterms (EXW, FOB, CIF, DDP) are all captured in the order record. No ambiguity about what was agreed and when — it's in the PO.",
              },
              {
                step: "03",
                title: "Quality control preference",
                desc: "Choose how QC is handled for this order: Sourcery-coordinated inspection, bring your own QC partner, or factory self-inspection. The choice is documented in the order and shapes how the QC gate is applied before final payment.",
              },
              {
                step: "04",
                title: "Full review before submit",
                desc: "Every field — factory, quantity, price, delivery, incoterms, QC option — is displayed for review before the PO is issued. Nothing moves until you confirm it's right.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-4 p-5 rounded-xl bg-card border border-border"
              >
                <div className="font-mono text-2xl font-bold text-primary/30 flex-shrink-0 w-10 pt-0.5">{item.step}</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h3 className="font-semibold text-foreground mb-4">After the PO — every stage of production documented</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Tech pack versioning", desc: "Every upload is versioned. Factory confirms which version they're building from." },
                { label: "Revision rounds", desc: "Every spec change requires formal factory acknowledgment before work continues." },
                { label: "Sample submission", desc: "Factory submits with photos and measurements. You approve or request a documented revision." },
                { label: "Defect reporting", desc: "Type, severity, quantity, photos, factory response — all logged against the order." },
                { label: "QC gate", desc: "Final payment blocked until QC result is logged. You control the release." },
                { label: "Reorder in one click", desc: "Closed orders preserve every spec. Reorder with the same details — no reconstruction." },
              ].map((tool, i) => (
                <div key={tool.label} className="flex items-start gap-2 p-3 rounded-lg bg-background border border-border">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-0.5">{tool.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Sourcery callout */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link to="/why-sourcery" className="block group">
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all">
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="max-w-xl">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">The cost of not using it</p>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                      Unstructured production has a cost. A spec change in a WhatsApp thread. A sample approved over email. A final payment wired before QC. See what each one typically costs — and what Sourcery does about it.
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      See three real production scenarios — with and without Sourcery — and what each one typically costs.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                    See the scenarios
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Honest framing */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-xl bg-card border border-border">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              What Sourcery is — and isn't
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Sourcery is a platform, not an agent. We don't manage your factory relationships, negotiate on your behalf, or intervene in production. What we do is give every order the structure, documentation, and payment protection that most brands only discover after learning the hard way.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The system works best when both parties use it properly — orders created formally, communication on-platform, revision rounds acknowledged. The more you put in, the stronger your paper trail.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Common questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border rounded-xl px-6">
                  <AccordionTrigger className="text-left font-medium text-foreground py-5">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Get started in minutes.</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Free to start. Bring your first factory on in under 10 minutes. No retainer, no subscription.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="xl" variant="hero">
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
