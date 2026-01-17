import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { 
  ArrowRight, 
  CheckCircle, 
  HelpCircle, 
  Shield, 
  Users, 
  MessageSquare,
  ClipboardCheck,
  Factory,
  AlertTriangle,
  Lock,
  FileText,
  History,
  Scale,
  Percent
} from "lucide-react";
import { cn } from "@/lib/utils";

// Platform fee tiers based on order volume
const platformFee = {
  rate: "2–5%",
  description: "of order value, buyer-paid",
  includes: [
    { icon: Lock, text: "Enforced order lifecycle" },
    { icon: Scale, text: "Milestone-gated payments" },
    { icon: ClipboardCheck, text: "QC gating (pass before payout)" },
    { icon: AlertTriangle, text: "Dispute infrastructure" },
    { icon: History, text: "Immutable order history" },
  ],
};

// What buyers are actually comparing against
const realAlternatives = [
  { risk: "Defect losses (10–50% of order)", cost: "$5,000 – $25,000" },
  { risk: "Factory disappears mid-production", cost: "$15,000+ deposit lost" },
  { risk: "Months of dispute back-and-forth", cost: "Priceless time" },
  { risk: "Hiring a sourcing agent", cost: "5–10% of order value" },
  { risk: "In-house ops staff", cost: "$4,000+/month" },
  { risk: "Flying to factory yourself", cost: "$3,000+ per trip" },
];

// Example order breakdown
const exampleOrder = {
  orderValue: 50000,
  platformFee: 1500,
  feePercent: 3,
  risks: [
    { scenario: "Minor sizing issue → 10% unsellable", loss: 5000 },
    { scenario: "Major QC miss → rework + delays", loss: 15000 },
    { scenario: "Factory disappears → deposit lost", loss: 15000 },
  ],
};

// What the fee really buys
const coreOutcomes = [
  {
    text: "I can't ship unless payment + QC happened",
    subtext: "Production is gated. No shortcuts.",
  },
  {
    text: "If something goes wrong, there's a paper trail",
    subtext: "Every message, milestone, and decision is recorded.",
  },
  {
    text: "The factory can't gaslight me",
    subtext: "Evidence-backed disputes. Clear accountability.",
  },
  {
    text: "I'm not guessing what's happening",
    subtext: "Real-time status updates at every stage.",
  },
  {
    text: "I don't need to babysit production",
    subtext: "System enforcement means less manual follow-up.",
  },
];

const platformFeatures = [
  {
    icon: Factory,
    title: "Curated Matching",
    description: "Our team handpicks the best factories for your needs from our verified network.",
  },
  {
    icon: Shield,
    title: "Escrow Protection",
    description: "Your payments are held securely until each production milestone is verified and approved.",
  },
  {
    icon: ClipboardCheck,
    title: "Quality Gating",
    description: "Production doesn't advance until QC passes. Your choice of inspection method.",
  },
  {
    icon: MessageSquare,
    title: "Verified Communication",
    description: "All messages are logged and factories are verified for secure, reliable communication.",
  },
];

const qcOptions = [
  {
    name: "Sourcery QC",
    tag: "Recommended",
    description: "Independent third-party inspector assigned by Sourcery. Strongest dispute protection.",
    details: [
      "Buyer-paid, separate line item",
      "Standardized reporting format",
      "Sourcery coordinates scheduling",
      "We recommend, we don't guarantee outcomes",
    ],
    protection: "high",
  },
  {
    name: "Bring Your Own QC",
    tag: "Experienced",
    description: "Use your existing inspector. Same system enforcement applies.",
    details: [
      "Buyer assigns their own inspector",
      "Inspector uploads through Sourcery",
      "Same milestone gating rules",
      "Full control over relationship",
    ],
    protection: "medium",
  },
  {
    name: "Factory Self-QC",
    tag: "Trusted Only",
    description: "Factory provides photos/video evidence. Buyer explicitly approves.",
    details: [
      "Factory uploads evidence",
      "Buyer reviews and approves",
      "Limited dispute support",
      "For established relationships",
    ],
    protection: "low",
  },
];

const protectionStyles = {
  high: "border-emerald-500/30 bg-emerald-500/5",
  medium: "border-amber-500/30 bg-amber-500/5",
  low: "border-red-500/30 bg-red-500/5",
};

const protectionLabels = {
  high: { text: "Strong Protection", color: "text-emerald-600" },
  medium: { text: "Standard Protection", color: "text-amber-600" },
  low: { text: "Limited Protection", color: "text-red-600" },
};

const faqs = [
  {
    q: "Why is the platform fee buyer-paid?",
    a: "The fee funds infrastructure that protects you: escrow, milestone enforcement, dispute resolution, and immutable records. Factories don't pay because they're not the ones needing protection from wire fraud or missing shipments.",
  },
  {
    q: "Is QC mandatory?",
    a: "No. QC is optional and always buyer-paid. You choose from three options based on your relationship with the factory. We recommend third-party QC for first orders, but the choice is yours.",
  },
  {
    q: "Does Sourcery guarantee QC outcomes?",
    a: "No. Sourcery recommends QC and coordinates inspections, but we do not guarantee outcomes. Your QC choice affects your level of platform support during disputes.",
  },
  {
    q: "How does escrow protection work?",
    a: "Your funds are held securely until each production milestone is complete. You release payment only after verifying quality at each stage—deposit, production, shipping, and delivery.",
  },
  {
    q: "What happens if there's a dispute?",
    a: "All order history, messages, and QC reports are preserved. If you chose Sourcery QC or BYOQC, you have stronger evidence for dispute resolution. Factory self-QC offers limited dispute support.",
  },
  {
    q: "How is the 2-5% fee calculated?",
    a: "The fee is calculated on order value. Higher volume orders and repeat customers may qualify for lower rates. Contact us for enterprise pricing.",
  },
];

export default function Pricing() {
  const [selectedQC, setSelectedQC] = useState<number | null>(null);

  return (
    <Layout>
      <SEO 
        title="Pricing | Sourcery"
        description="Transparent platform fee of 2-5% on order value. Protection, not software. Escrow payments, milestone enforcement, and dispute infrastructure."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Risk Reduction Infrastructure
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Protection, Not Software Pricing
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A 2–5% platform fee covers enforced order lifecycle, milestone payments, QC gating, 
              and dispute infrastructure. You're not paying for features—you're paying for outcomes.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-card border border-border">
              <Percent className="w-8 h-8 text-primary" />
              <div className="text-left">
                <p className="text-3xl font-bold text-foreground">{platformFee.rate}</p>
                <p className="text-sm text-muted-foreground">{platformFee.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What the Fee Covers */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Your 2–5% Actually Covers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This isn't a subscription. It's infrastructure that enforces production accountability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-4">
            {platformFee.includes.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl bg-card border border-border text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Psychology Section - What You're Really Comparing */}
      <section className="section-padding bg-card/50">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: The Real Comparison */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                You're Not Comparing 3% to "Free"
              </h2>
              <p className="text-muted-foreground mb-8">
                You're comparing it to real downside risk. Without protection, 
                here's what sourcing actually costs:
              </p>

              <div className="space-y-3">
                {realAlternatives.map((alt, index) => (
                  <motion.div
                    key={alt.risk}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/10"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                      <span className="text-sm text-foreground">{alt.risk}</span>
                    </div>
                    <span className="text-sm font-medium text-destructive">{alt.cost}</span>
                  </motion.div>
                ))}
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                People happily pay ~3% credit card fees to buy sneakers. 
                For $50,000 production orders, 3% is psychologically acceptable—and far cheaper than the alternatives.
              </p>
            </motion.div>

            {/* Right: Example Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-background border border-border p-6 md:p-8"
            >
              <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
                Example: $50,000 Order
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="text-foreground">Order Value</span>
                  <span className="text-xl font-bold text-foreground">
                    ${exampleOrder.orderValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <span className="text-foreground">Platform Fee ({exampleOrder.feePercent}%)</span>
                  <span className="text-xl font-bold text-primary">
                    ${exampleOrder.platformFee.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-sm font-medium text-foreground mb-4">
                  Without Sourcery, potential losses:
                </p>
                <div className="space-y-3">
                  {exampleOrder.risks.map((risk) => (
                    <div key={risk.scenario} className="flex items-start justify-between gap-4 text-sm">
                      <span className="text-muted-foreground">{risk.scenario}</span>
                      <span className="font-medium text-destructive shrink-0">
                        -${risk.loss.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-emerald-700">
                  <strong>${exampleOrder.platformFee.toLocaleString()}</strong> feels like insurance, ops staff, 
                  documentation, and leverage—all in one.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Outcomes - What You're Really Buying */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              What 3% Is Really Buying
            </h2>
            <p className="text-lg text-muted-foreground">
              Not features—outcomes. Here's what changes when you use Sourcery:
            </p>
          </motion.div>

          <div className="space-y-4">
            {coreOutcomes.map((outcome, index) => (
              <motion.div
                key={outcome.text}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-xl bg-card border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-lg">"{outcome.text}"</p>
                    <p className="text-muted-foreground mt-1">{outcome.subtext}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QC Options */}
      <section className="section-padding bg-card/50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              QC Is Optional, Buyer-Paid, and Honest
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We recommend QC, but we don't guarantee outcomes. Choose the option that fits 
              your relationship with the factory.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {qcOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "rounded-2xl border-2 p-6 transition-all cursor-pointer",
                  protectionStyles[option.protection as keyof typeof protectionStyles],
                  selectedQC === index && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => setSelectedQC(index)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    option.protection === "high" && "bg-emerald-500/20 text-emerald-700",
                    option.protection === "medium" && "bg-amber-500/20 text-amber-700",
                    option.protection === "low" && "bg-red-500/20 text-red-700",
                  )}>
                    {option.tag}
                  </span>
                  <span className={cn(
                    "text-xs font-medium",
                    protectionLabels[option.protection as keyof typeof protectionLabels].color
                  )}>
                    {protectionLabels[option.protection as keyof typeof protectionLabels].text}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {option.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {option.description}
                </p>

                <ul className="space-y-2">
                  {option.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 p-4 rounded-lg bg-muted/50 border border-border text-center"
          >
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> Sourcery recommends QC but does not guarantee QC outcomes. 
              Your choice affects the level of platform support available during disputes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built-In Platform Protection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every transaction is protected with escrow payments, verified communication, and quality gating.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-background rounded-xl border border-border p-6"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </div>
                </div>
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
              Ready to Source with Protection?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Browse verified factories, create protected orders, and ship with confidence. 
              The 2–5% fee covers everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/directory">
                <Button variant="hero" size="xl">
                  Browse Factories
                  <Factory className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact?type=call">
                <Button variant="hero-outline" size="xl">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
