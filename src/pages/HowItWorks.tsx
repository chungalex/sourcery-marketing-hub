import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, CheckCircle, Shield, AlertCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect your factory",
    description: "Invite an existing manufacturer or browse the Sourcery network. Either way, all order management runs through the same system. BYOF factories don't need network approval — invite them and start immediately.",
    gate: null,
  },
  {
    number: "02",
    title: "Create a production order",
    description: "Quantity, pricing, incoterms, QC option, AQL standard, and delivery window — all captured in a structured form with plain-English guidance at each step. Not sure what FOB means or which AQL standard to use? The form explains each option before you choose. Tech pack attached and versioned. Both parties see the same spec from the same place.",
    gate: null,
  },
  {
    number: "03",
    title: "Sample approval gate",
    description: "Factory submits sample with photos and measurements. You review and approve — or request a formal revision round with documented feedback the factory must acknowledge before production continues.",
    gate: "Bulk production milestones cannot be funded until sample is approved. This gate is enforced by the platform.",
  },
  {
    number: "04",
    title: "Production with full documentation",
    description: "Every spec change is a formal revision round the factory must acknowledge. Tech pack versions are tracked — the factory confirms which version they're building from. Defects are filed as structured reports. Nothing important is communicated outside the platform.",
    gate: null,
  },
  {
    number: "05",
    title: "QC gates the final payment",
    description: "Quality inspection logged against the order with photos, defect reports, and pass/fail result. In a dispute, payment freezes and both parties submit evidence before resolution. The paper trail built throughout the order is your leverage.",
    gate: "Final milestone cannot release without QC pass. Payment is never released automatically.",
  },
];

const protectionFeatures = [
  { title: "Sampling gate", desc: "No bulk production funding without approved sample" },
  { title: "Revision rounds", desc: "Every spec change formally acknowledged by factory" },
  { title: "Tech pack versioning", desc: "Factory always confirms current version" },
  { title: "Defect documentation", desc: "Structured reports with photos and factory response" },
  { title: "QC gate", desc: "Final payment blocked without QC pass" },
  { title: "Dispute freeze", desc: "Funds held pending evidence review" },
];

export default function HowItWorks() {
  return (
    <Layout>
      <SEO
        title="How It Works — Sourcery"
        description="One system. Every step of production. From factory connection to closed delivery — with accountability built into every stage."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              One system. Every step of production.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Sourcery is a platform, not an agency. It gives you the structure, documentation, and payment protection to manage your own production relationships — with accountability built into every stage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid md:grid-cols-[80px_1fr] gap-6 md:gap-10"
              >
                <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
                  <div className="text-4xl font-bold text-primary/20 font-heading leading-none">
                    {step.number}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                  {step.gate && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground font-medium">{step.gate}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protection features */}
      <section className="section-padding bg-card/50">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Every protection mechanism — explained
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The platform enforces these at the code level. They're not optional. They're not guidelines.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protectionFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border"
              >
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">{f.title}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Honest framing */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-start gap-4 p-8 rounded-xl bg-card border border-border">
            <AlertCircle className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2 text-lg">One thing worth being clear about</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sourcery is a platform, not an agent. We don't negotiate on your behalf, manage your factory relationships, or intervene in production disputes. What we do is give every order the structure and documentation that makes disputes rare — and when they do happen, ensures both parties have a clear record of what was agreed.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ready to start?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Free to get started. Bring your factory on in under 10 minutes.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">
                  Get started free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="hero-outline" size="xl">See pricing</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
