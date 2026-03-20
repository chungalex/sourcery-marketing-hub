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
              Built by operators who have been on both sides.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              As brands managing production and as manufacturers supplying them. Sourcery exists because the tools we needed didn't.
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
              Production management for physical product brands is genuinely broken. Not because factories are bad or brands are careless — but because the infrastructure doesn't exist. Brands manage production across WhatsApp, email, file-sharing links for tech packs, bank wires for payments, and separate email chains for QC photos. Nothing is connected. No audit trail. No version control. No visibility into what spec the factory is actually building from.
            </p>
            <p>
              We experienced this from both sides. Managing a brand's production orders and not being able to prove what was agreed when something went wrong. Running a production studio and receiving specs that changed mid-order with no paper trail either side could reference. The same order, two completely different accounts of what happened, and nothing to resolve it with.
            </p>
            <p>
              Every tool we reached for solved one part of the problem. None of them solved the whole thing — the shared system of record that both sides operate from, with every decision documented, every payment gated, every spec version tracked.
            </p>
            <p className="text-foreground font-medium">
              The tools didn't exist. So we built them.
            </p>
            <p>
              Sourcery is the system of record. Every order, revision, sample, defect, and payment — documented, timestamped, and attached to the right place. Not a directory. Not an agency. Infrastructure.
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
