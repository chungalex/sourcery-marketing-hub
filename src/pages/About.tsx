import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, Check, X, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <SEO
        title="About — Sourcery"
        description="Sourcery is a manufacturing OS built by operators who experienced the problem on both sides. Every feature exists because we needed it and it didn't exist."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Built for the founders navigating one of the hardest parts of building a product company.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Production is complex, opaque, and unforgiving when things go wrong. Sourcery exists to change that — not just as a tool, but as the infrastructure that makes manufacturing navigable for any brand willing to take it seriously.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main story — 2 cols */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2 space-y-5 text-muted-foreground text-base leading-relaxed">
              <p>
                Running a brand is hard. Building a product from scratch, finding the right manufacturer, navigating a space that doesn't explain itself, wiring money overseas and hoping for the best — it's one of the most stressful and opaque things you can do as a founder.
              </p>
              <p>
                The manufacturing industry has very little transparency. Supply chains are complex. There's a language to it — incoterms, AQL standards, sampling gates, revision rounds — that nobody teaches you. As a brand, you often don't know what you don't know. Whether the spec you sent is the spec they're building from. Whether the revision you requested last week was acknowledged. Whether the sample you approved will translate to bulk. And if something goes wrong, you have no record, no leverage, and no clear next step.
              </p>
              <p>
                We experienced this from both sides — managing a brand's production orders and not being able to prove what was agreed when something went wrong, and running a production studio and receiving specs that changed mid-order with no paper trail either side could reference. The same order. Two completely different accounts of what happened. Nothing to resolve it with.
              </p>
              <p>
                Every tool we reached for solved one part of the problem. None of them solved the whole thing — the shared system of record that both sides operate from, with every decision documented, every payment gated, every spec version tracked.
              </p>
              <p className="text-foreground font-semibold text-lg">
                The tools didn't exist. So we built them.
              </p>
              <p>
                Sourcery is the system of record. Every order, revision, sample, defect, and payment — documented, timestamped, and attached to the right place. Not a directory. Not an agency. Infrastructure that walks you through the process, keeps everything organised, and gives you the confidence to build your company around production instead of in spite of it.
              </p>
              <p>
                The platform has two equally important halves. The OS manages every order from PO creation to closed delivery. The marketplace helps brands find the right factory before the first order is ever placed — vetted manufacturers with real performance scores, AI-matched to your specific requirements. Finding the right factory is the problem most brands get the least help with. We built the infrastructure for that too.
              </p>
            </motion.div>

            {/* Founder sidebar */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-sm">A</span>
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">Alex Chung</p>
                <p className="text-xs text-muted-foreground mb-4">Founder, Sourcery</p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>Founder of OKIO Denim — premium denim brand designed in LA, manufactured in Vietnam.</p>
                  <p>Founder of HU LA Studios — garment production studio, Ho Chi Minh City.</p>
                  <p>Real estate development student, USC.</p>
                  <p className="text-foreground font-medium pt-1">Both sides of the same problem. Built the platform both sides needed.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marketplace callout */}
      <section className="py-0 pb-0">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="p-8 rounded-2xl bg-primary/3 border border-primary/20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Factory marketplace</p>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                    The other half of the platform.
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Starting with the wrong factory is the single most common way production goes wrong — before a single order is placed. The Sourcery marketplace gives brands access to vetted manufacturers with verified credentials and real performance scores, AI-matched to their specific requirements. Because getting the production infrastructure right starts with getting the factory right.
                  </p>
                </div>
                <div className="space-y-2.5">
                  {[
                    "Verified credentials — not just a listing",
                    "Performance scores from real completed orders",
                    "AI-matched to your product, MOQ, and timeline",
                    "Free to browse — Builder to contact",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Link to="/marketplace">
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                        Explore the marketplace <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What it is and isn't */}
      <section className="section-padding bg-card/50 border-y border-border">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">What Sourcery is — and isn't</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">What it is</p>
                {[
                  "A manufacturing OS — infrastructure between your brand and your factory",
                  "BYOF-first — bring existing relationships, get value immediately",
                  "A curated marketplace with verified factories and real performance data",
                  "AI-matched factory recommendations based on your actual requirements",
                  "Guidance through every decision in the production process",
                  "Built by operators, validated on real production",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">What it isn't</p>
                {[
                  "A sourcing agency that manages production for you",
                  "An unverified factory directory",
                  "A subscription you pay before seeing value",
                  "Built for enterprise procurement teams",
                  "A replacement for your own judgment and due diligence",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border">
                    <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Questions? We're happy to walk you through it.</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Platform, pricing, factory network — anything.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/contact">
                <Button variant="hero-outline" size="xl">Get in touch</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
