import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, CheckCircle, TrendingUp, Shield, BarChart3, MessageSquare, Package } from "lucide-react";

const benefits = [
  {
    icon: Package,
    title: "Structured orders",
    description: "Every order comes with clear specs, versioned tech packs, and formal revision rounds. You know exactly what you're building and have documentation of what was agreed.",
  },
  {
    icon: Shield,
    title: "Milestone payments",
    description: "Payment terms are structured and tracked on-platform. Both sides see the same milestones. Disputes are documented, not verbal.",
  },
  {
    icon: MessageSquare,
    title: "Professional brand relationships",
    description: "Brands on Sourcery are managing real production budgets with structured specs. Inquiries come with documentation, not vague messages.",
  },
  {
    icon: TrendingUp,
    title: "Repeat business",
    description: "Brands who have a good first order reorder. The platform makes it easy — one-click reorder from a closed order, pre-filled with all the original specs.",
  },
  {
    icon: BarChart3,
    title: "Performance builds placement",
    description: "Strong QC pass rates, fast response times, and on-time delivery improve your ranking. Your track record is your placement — not paid promotion.",
  },
];

const requirements = [
  "Verified production capability in your category",
  "Relevant compliance certifications (BSCI, GOTS, OEKO-TEX, ISO 9001, or equivalent)",
  "Demonstrated quality control process",
  "Export experience with international brands",
  "Responsive communication — brands expect timely responses",
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
                Join a network that takes quality seriously.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Sourcery connects verified manufacturers with brands who are serious about production. Structured orders, milestone-protected payments, and full documentation — so both sides are protected on every order.
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
              Why factories join Sourcery
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
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Your reputation is your ranking.</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Every completed order contributes to your performance score — calculated from QC pass rate, response time, on-time delivery, defect history, and brand retention. High-scoring factories receive featured placement in search and priority matching with new brands.
              </p>
              <p>
                The score is calculated from real order data only. Not self-reported claims. Not paid placement. Actual production history on the platform.
              </p>
              <p>
                Factories see their full score breakdown. Brands see your tier — Verified or Elite. New factories build their track record from the first completed order.
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
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Free to join. No fees to factories. Sourcery earns a transaction fee on orders — paid by brands, not manufacturers.
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
