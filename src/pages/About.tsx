import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <SEO
        title="About Sourcery"
        description="Sourcery is a manufacturing OS built by operators with experience on both sides of manufacturing. Every feature exists because we encountered the problem it solves."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built for the founders navigating one of the hardest parts of building a product company.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Production is complex, opaque, and unforgiving when things go wrong. We built Sourcery to change that — not just as a tool, but as the infrastructure that makes manufacturing navigable for any brand willing to take it seriously.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-muted-foreground text-lg leading-relaxed"
          >
            <p>
              Running a brand is hard. Building a product from scratch, finding the right manufacturer, navigating a space that doesn't explain itself, wiring money overseas and hoping for the best — it's one of the most stressful and opaque things you can do as a founder.
            </p>
            <p>
              The manufacturing industry has very little transparency. Supply chains are complex. There's a language to it — incoterms, AQL standards, sampling gates, revision rounds — that nobody teaches you. As a brand, you often don't know what you don't know. Whether the spec you sent is the spec they're building from. Whether the revision you requested last week was acknowledged. Whether the sample you approved will translate to bulk. And if something goes wrong, you have no record, no leverage, and no clear next step.
            </p>
            <p>
              We built Sourcery because that opacity is the actual problem. Not bad factories. Not bad brands. Just no shared infrastructure that gives both sides visibility, accountability, and something to point to when something is unclear.
            </p>
            <p>
              Every feature on the platform exists to take something that is normally stressful, opaque, or manual — and make it structured, documented, and navigable. So you can place an order with confidence. Track every decision. Know exactly where your production stands. And spend your energy building your company instead of managing uncertainty.
            </p>
            <p className="text-foreground font-medium">
              The tools didn't exist. So we built them.
            </p>
            <p>
              Sourcery is the system of record. Every order, revision, sample, defect, and payment — documented, timestamped, and attached to the right place. Not a directory. Not an agency. Not a sourcing manager. Infrastructure that walks you through the process, keeps everything organised, and gives you the confidence to build your company around production instead of in spite of it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What we are and aren't */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">What Sourcery is — and isn't</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-background border border-border space-y-4">
                <h3 className="font-semibold text-foreground">It is</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "A manufacturing OS — infrastructure between your brand and your factory",
                    "BYOF-first — bring existing relationships, get value immediately",
                    "A curated marketplace when you need to find a new manufacturing partner",
                    "A platform that earns only when production moves",
                    "Built by operators, validated on real production",
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 flex-shrink-0">—</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border space-y-4">
                <h3 className="font-semibold text-foreground">It isn't</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "A sourcing agency that manages production for you",
                    "An unverified factory directory",
                    "A subscription you pay before seeing value",
                    "Built for enterprise procurement teams",
                    "A replacement for your own judgment and due diligence",
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-muted-foreground/50 mt-0.5 flex-shrink-0">—</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              The best way to understand it is to use it.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Get started free. Bring your factory on. Create your first order. The platform speaks for itself.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="lg">
                  Get started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">Contact us</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
