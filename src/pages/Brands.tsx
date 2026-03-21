import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, CheckCircle, Search, Sparkles } from "lucide-react";

export default function Brands() {
  return (
    <Layout>
      <SEO
        title="For Brands — Sourcery"
        description="Find the right factory. Manage every order with full structure, security, and traceability. Your first order is free."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                For brands
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                Production is where most brands lose confidence. This is where you get it back.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Whether you're placing your first order or your fiftieth, Sourcery gives you two things every brand needs — the right factory to work with, and the infrastructure to manage every order with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="hero-outline" size="xl">Browse factories</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Two halves — equally prominent */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Two problems. One platform.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Finding the right factory and managing every order properly are both hard. Sourcery is built to solve both — and the two halves work seamlessly together.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Marketplace half */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-primary/5 border-2 border-primary/30 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">Factory marketplace</p>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Find the right factory.</h3>
              <p className="text-muted-foreground leading-relaxed mb-4 flex-1">
                Browse vetted manufacturers with real performance scores — QC pass rates, response times, defect history. Get AI-matched to factories that fit your product, MOQ, certifications, and timeline. Free to browse. The hardest problem in production, solved before you place a single order.
              </p>
              <div className="space-y-2 mb-5">
                {[
                  "Verified credentials before listing",
                  "Performance scores from real completed orders",
                  "AI-matched by product type, MOQ, certifications",
                  "Free to browse — Builder to contact",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/marketplace">
                <Button className="gap-1.5 w-full sm:w-auto">Explore the marketplace <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </motion.div>

            {/* OS half */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-card border border-border flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-foreground" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Production OS</p>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Manage every order properly.</h3>
              <p className="text-muted-foreground leading-relaxed mb-4 flex-1">
                Structured PO creation, milestone-gated payments, formal revision rounds, sampling gates, QC documentation, and a permanent order record — all in one place. Works with your existing factory or one from the marketplace.
              </p>
              <div className="space-y-2 mb-5">
                {[
                  "Every decision guided with plain-English explanations",
                  "Sample approved before bulk — enforced by the platform",
                  "Final payment blocked until QC passes",
                  "Every order a permanent, searchable record",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/how-it-works">
                <Button variant="outline" className="gap-1.5 w-full sm:w-auto">See how it works <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Two audiences */}
      <section className="section-padding bg-card/50">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-background border border-border">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">New to production</p>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                You shouldn't have to figure this out alone.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Manufacturing has its own language. Incoterms, AQL standards, sampling gates, MOQs — nobody teaches you this. Sourcery explains every decision before you make it, walks you through every step, and gives you a factory network to start from if you don't have one yet.
              </p>
              <p className="text-sm text-muted-foreground italic">"Never heard of incoterms? Not sure what AQL means? Every decision is explained before you commit. You learn by doing."</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }} className="p-8 rounded-2xl bg-background border border-border">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">Already managing production</p>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                Replace the chaos. Get your time back.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you're already running production, this isn't about learning the basics. It's about replacing scattered WhatsApp threads, email chains nobody can find, and the spreadsheet that's always out of date — with one system where everything is in the right place.
              </p>
              <p className="text-sm text-muted-foreground italic">"Production stops living across five different apps. You get time back and a platform your whole team can work from."</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Four pillars */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Four things every production run needs.</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Sourcing overseas opens up your quality and your margins. It also introduces uncertainty most brands manage badly. Sourcery closes that gap.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Structure", feeling: "So you never guess what you agreed to.", desc: "Guided order creation — incoterms, AQL, QC — explained before you commit." },
              { title: "Security", feeling: "Your money moves when you say it moves.", desc: "Milestone-gated payments. Sample approved before bulk. QC passed before final release." },
              { title: "Traceability", feeling: "Every decision is permanently yours to reference.", desc: "Every spec, revision, message, and payment — timestamped and searchable forever." },
              { title: "Organisation", feeling: "Production stops living across five apps.", desc: "One place for everything. Every message attached to the order it belongs to." },
            ].map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-bold text-foreground text-lg mb-1">{p.title}</h3>
                <p className="text-primary text-sm font-medium mb-3">{p.feeling}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What it replaces */}
      <section className="section-padding bg-card/50 border-y border-border">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Every stage of production. One system.</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">From structured PO creation to closed delivery — with guided decisions, documented milestones, and a permanent record built automatically at every step.</p>
              <div className="space-y-3">
                {[
                  { label: "Guided order creation", sub: "Incoterms, AQL, QC — explained before you choose" },
                  { label: "Sampling gate", sub: "Bulk can't begin until sample is formally approved" },
                  { label: "Revision rounds", sub: "Every spec change acknowledged before work continues" },
                  { label: "Tech pack versioning", sub: "Factory always confirms the version they're building from" },
                  { label: "QC gate", sub: "Final payment blocked until quality is confirmed" },
                  { label: "Permanent record", sub: "Every order searchable forever — reorder in one click" },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <span className="text-sm text-muted-foreground"> — {item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-semibold text-foreground mb-5 text-lg">What it replaces</h3>
              <div className="space-y-4">
                {[
                  { before: "Spec changes over WhatsApp", after: "Formal revision rounds, factory-acknowledged" },
                  { before: "Tech pack emailed as attachment", after: "Versioned, factory-confirmed, permanent" },
                  { before: "Sample approved in a message", after: "Formal approval with photos + measurements logged" },
                  { before: "Payment wired before QC", after: "Final milestone gated behind QC pass" },
                  { before: "Dispute with no paper trail", after: "Full record — every message, revision, defect" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-rose-500 flex-shrink-0 mt-0.5">✕</span>
                      <span className="text-muted-foreground leading-snug">{row.before}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-foreground leading-snug">{row.after}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Honest framing */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-card border border-border">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">What Sourcery is — and isn't</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Sourcery is a platform, not an agent. We don't manage your factory relationships, negotiate on your behalf, or intervene in production. What we do is give every order the structure, documentation, and gate enforcement that most brands only discover they needed after learning the hard way.
            </p>
            <p className="text-sm text-muted-foreground">The system works best when both parties use it properly — orders created formally, communication on-platform, revision rounds acknowledged. The more you put in, the stronger your paper trail.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50 border-t border-border">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Your first order is free.</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              No credit card, no commitment. Bring your factory or find one in the marketplace. If it changes how you manage production — great. If not, no hard feelings.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="hero-outline" size="xl">Browse factories</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
