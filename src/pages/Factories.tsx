import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, CheckCircle, TrendingUp, Shield, BarChart3, MessageSquare, Package } from "lucide-react";

const benefits = [
  {
    icon: Package,
    title: "Structured orders from day one",
    description: "Every order arrives with versioned tech packs, documented specifications, and formal revision rounds. You know exactly what you're building — and have a permanent record of what was agreed before production begins.",
  },
  {
    icon: Shield,
    title: "Clear payment terms, tracked on-platform",
    description: "Milestone terms are set in the order and visible to both sides. Every payment stage is documented. Disputes are resolved with evidence — not verbal disagreements about what was said over email.",
  },
  {
    icon: MessageSquare,
    title: "Brands who come prepared",
    description: "Brands on Sourcery manage real production budgets with structured specs. Inquiries come with documentation — tech packs attached, quantities confirmed, incoterms selected. Less back-and-forth before work begins.",
  },
  {
    icon: TrendingUp,
    title: "Reorders from closed orders",
    description: "Brands who complete a good order reorder. The platform makes it one click — every spec from the original order is preserved and pre-filled. Strong performance on the first order drives the second.",
  },
  {
    icon: BarChart3,
    title: "Performance determines placement",
    description: "QC pass rate, response time, on-time delivery, and brand retention build your score. High-scoring factories receive featured placement in search and priority matching. Your track record is your placement — not paid promotion.",
  },
];

const requirements = [
  "Verified production capability in your stated category",
  "Relevant compliance certifications (BSCI, GOTS, OEKO-TEX, ISO 9001, or equivalent)",
  "Demonstrated quality control process",
  "Export experience with international brands",
  "Responsive communication — documented response time standards apply",
];

const steps = [
  { step: "1", title: "Apply online", desc: "Fill out the factory application with your capabilities, certifications, and production history." },
  { step: "2", title: "Review process", desc: "Our team reviews your application — credential verification, certification review, production capability assessment based on submitted documentation." },
  { step: "3", title: "Profile setup", desc: "Complete your factory profile — description, photos, MOQ, lead time, pricing bands. Higher completeness = better placement." },
  { step: "4", title: "Start receiving inquiries", desc: "Approved factories appear in search and are eligible for AI-matched brand recommendations. Performance tracking begins from your first completed order." },
];

export default function Factories() {
  return (
    <Layout>
      <SEO
        title="For Factories — Sourcery"
        description="Join a network that takes quality seriously. Structured orders, milestone-protected payments, and a platform that documents everything — so both sides are protected."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                For factories
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                A platform that works for factories as much as it does for brands.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Structured orders. Documented specs. Milestone-tracked payments. Sourcery gives both sides a shared system of record — so every production cycle is traceable, every agreement is documented, and every payment is verified before it moves.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/apply">
                  <Button variant="hero" size="xl">
                    Apply to join network
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="hidden lg:block">
              <div className="bg-card rounded-2xl border border-border p-8">
                <h3 className="font-semibold text-foreground mb-6 text-lg">Already working with a brand on Sourcery?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  If a brand you work with has invited you to the platform, you don't need to go through the network application. Accept the invite, complete your profile, and manage your orders immediately.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Network membership is for manufacturers who want to be discoverable to new brands through our marketplace. Both paths give you full platform functionality.
                </p>
                <Link to="/auth">
                  <Button variant="outline" className="w-full">
                    Accept a factory invite
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              What the platform does for your side of the order.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every feature built for brands is matched by a factory-facing counterpart. Both sides operate in the same system, with the same information, at every stage.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-6 rounded-xl bg-card border border-border"
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

      {/* Performance scoring */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Your track record becomes your ranking.</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Every completed order on Sourcery contributes to your factory performance score — calculated from QC pass rate, response time, on-time delivery, defect history, and brand retention rate. High-scoring factories receive featured placement in search results and priority matching with incoming brand inquiries.
              </p>
              <p>
                The score is built from real order data only. Not self-reported claims. Not paid placement. Actual production history verified through the platform. Factories see their full score breakdown at any time. Brands see your tier — Verified or Elite.
              </p>
              <p>
                New factories begin building their track record from the first completed order. Every order is an opportunity to improve placement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">What we look for</h2>
              <ul className="space-y-4 mb-6">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground italic border-l-2 border-border pl-4">
                Network entry involves credential review and certification verification based on submitted documentation and references. We do not conduct on-site facility audits for all applicants. We recommend brands request samples and start with smaller trial orders as part of their own verification.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">How it works</h2>
              <div className="space-y-6">
                {steps.map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Ready to join the network?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Free to join. No fees to factories on any order. Sourcery earns a 3% transaction fee paid by brands — manufacturers pay nothing to be on the platform, receive orders, or complete production cycles.
            </p>
            <Link to="/apply">
              <Button variant="hero" size="xl">
                Apply now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
