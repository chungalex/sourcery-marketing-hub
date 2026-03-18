import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, MapPin } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <SEO
        title="About Sourcery — Built in Vietnam"
        description="Sourcery is a manufacturing OS built by operators embedded in Vietnamese production. We run a brand and a factory. We built the tools we needed."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built by people who actually make things
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Starting with Vietnam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin story */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-muted-foreground text-lg leading-relaxed"
          >
            <p>
              Sourcery was built in Ho Chi Minh City by a team that operates on both sides of manufacturing. We run <strong className="text-foreground">OKIO Denim</strong> — a premium denim brand designed in LA and produced in Vietnam. And we run <strong className="text-foreground">HU LA Studios</strong> — a garment production studio in Ho Chi Minh City.
            </p>
            <p>
              We've been the brand wiring deposits and waiting. We've been the factory fielding revisions over WhatsApp at midnight. We've watched money disappear into disputes with no paper trail. We've seen tech packs go to factories without version control, and nobody knows which spec they're actually building from.
            </p>
            <p>
              The tools didn't exist. So we built them.
            </p>
            <p>
              Sourcery is the operating system we needed — order management, sampling gates, revision tracking, QC, escrow payments, and messaging all in one place. We use it ourselves. Every feature exists because we ran into the problem it solves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Vietnam */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-3 mb-6">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <h2 className="font-heading text-2xl font-bold text-foreground">Why Vietnam, and why it matters</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Vietnam is one of the fastest-growing manufacturing regions in the world. Brands are moving production here from China at scale — but the infrastructure hasn't caught up. Most sourcing tools still assume you're on Alibaba.
              </p>
              <p>
                Our team has visited these factories, met the owners, stood on the production floors. We know which facilities are actually at capacity. We know which claims are overstated. We know which factory owners pick up the phone.
              </p>
              <p>
                That context can't be built from a San Francisco office. It's the foundation of everything Sourcery does.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What we are and aren't */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">What Sourcery is — and isn't</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                <h3 className="font-semibold text-foreground">It is</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "A manufacturing OS — the infrastructure layer between your brand and your factory",
                    "BYOF — bring your existing factory onto the platform and manage everything in one place",
                    "A curated marketplace when you need to find a new factory",
                    "Built by operators, not consultants",
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">—</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                <h3 className="font-semibold text-foreground">It isn't</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "A sourcing agent that manages production for you",
                    "A directory of unverified factories with no accountability",
                    "Another platform that charges you before you've seen value",
                    "Built for enterprise — it's built for founders doing 300–10,000 units per style",
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-0.5">—</span>
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
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              The best demo is a real order
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              We run OKIO orders through Sourcery. If you want to see how it compares to your current WhatsApp + email + WeTransfer workflow, let's talk.
            </p>
            <Link to="/contact">
              <Button size="lg">
                Get in touch
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
