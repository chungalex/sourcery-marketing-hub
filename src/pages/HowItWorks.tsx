import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, MessageSquare, Search, Factory, ClipboardCheck, Package, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Share Your Requirements",
    description: "Tell us about your product, target price, quantities, and timeline. We'll create a tailored sourcing strategy.",
  },
  {
    number: "02",
    icon: Search,
    title: "Factory Matching",
    description: "We match you with 3-5 pre-vetted factories from our network, each with relevant experience and capacity.",
  },
  {
    number: "03",
    icon: Factory,
    title: "Sampling & Selection",
    description: "Review samples, negotiate terms, and select your ideal manufacturing partner with our guidance.",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Production & QC",
    description: "We manage the production timeline with on-site quality inspections at every critical milestone.",
  },
  {
    number: "05",
    icon: Package,
    title: "Packaging & Prep",
    description: "Final inspection, packaging oversight, and documentation to ensure your products meet all requirements.",
  },
  {
    number: "06",
    icon: Truck,
    title: "Logistics & Delivery",
    description: "Coordinate shipping, customs clearance, and track your order until it arrives at your warehouse.",
  },
];

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              How Sourcery Works
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A streamlined process designed to take the complexity out of manufacturing. From initial inquiry to final delivery, we guide you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative grid md:grid-cols-[100px_1fr] gap-6 md:gap-12 pb-12 last:pb-0"
              >
                {/* Line connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-[50px] top-16 bottom-0 w-px bg-border" />
                )}
                
                {/* Number */}
                <div className="flex md:flex-col items-center gap-4 md:gap-0">
                  <div className="w-[100px] h-[100px] rounded-2xl bg-card border border-border flex items-center justify-center relative z-10">
                    <span className="font-heading text-3xl font-bold text-primary">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-card rounded-xl border border-border p-6 md:p-8 hover:shadow-card-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Expectations */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Typical Timeline
            </h2>
            <p className="text-lg text-muted-foreground">
              Most projects follow a similar timeline from inquiry to delivery
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { phase: "Week 1-2", title: "Discovery & Matching" },
              { phase: "Week 3-4", title: "Sampling" },
              { phase: "Week 5-12", title: "Production & QC" },
              { phase: "Week 13+", title: "Shipping & Delivery" },
            ].map((item, index) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-background border border-border"
              >
                <p className="text-sm text-primary font-medium mb-2">{item.phase}</p>
                <p className="font-heading font-semibold text-foreground">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Submit your sourcing request and receive factory matches within 48 hours.
            </p>
            <Link to="/contact?type=sourcing">
              <Button variant="hero" size="xl">
                Request Sourcing
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
