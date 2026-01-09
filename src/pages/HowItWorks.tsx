import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Shield, 
  ClipboardCheck, 
  Package, 
  CheckCircle,
  Factory,
  CreditCard,
  Eye,
  Handshake
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Handshake,
    title: "Pre-Negotiated Partnerships",
    description: "Before you even start, we've already done the hard work. Every factory in our network has been personally audited, vetted, and negotiated with by our team — securing competitive pricing and favorable terms on your behalf.",
    highlight: "Done For You",
  },
  {
    number: "02",
    icon: Factory,
    title: "Curated Factory Selection",
    description: "Tell us about your product, budget, and timeline. Our team reviews your requirements and handpicks factories from our verified network that are the perfect fit for you.",
    highlight: "Personalized for You",
  },
  {
    number: "03",
    icon: Eye,
    title: "Review & Compare",
    description: "Browse detailed factory profiles, certifications, and past work. We help you compare quotes side-by-side, highlighting key differences and flagging potential concerns.",
    highlight: "Expert Guidance",
  },
  {
    number: "04",
    icon: MessageSquare,
    title: "Verified Communication",
    description: "Connect with factory representatives through our secure messaging platform. All communications are logged for your protection.",
    highlight: "Secure & Logged",
  },
  {
    number: "05",
    icon: CreditCard,
    title: "Structured Payments",
    description: "We help you negotiate payment terms with clear milestone schedules. Know exactly when and how much to pay at each stage — no surprises.",
    highlight: "Clear Terms",
  },
  {
    number: "06",
    icon: ClipboardCheck,
    title: "Quality Inspections",
    description: "Our QC team inspects production at key milestones. You receive detailed reports with photos before approving each payment release.",
    highlight: "Photo Documentation",
  },
  {
    number: "07",
    icon: Package,
    title: "Delivery & Release",
    description: "Track your shipment in real-time. Final payment is released only after you confirm receipt and quality of your order.",
    highlight: "Full Transparency",
  },
];

const protectionFeatures = [
  {
    icon: Handshake,
    title: "Pre-Negotiated Terms",
    description: "Competitive pricing already secured for you",
  },
  {
    icon: Shield,
    title: "Payment Structure",
    description: "Structured milestone payments with escrow coming soon",
  },
  {
    icon: MessageSquare,
    title: "Verified Factories",
    description: "All factories are vetted and verified before joining",
  },
  {
    icon: ClipboardCheck,
    title: "Quality Guarantee",
    description: "Professional inspections at every production stage",
  },
];

export default function HowItWorks() {
  return (
    <Layout>
      <SEO 
        title="How It Works | Manufactory"
        description="Personalized factory matching, escrow payment protection, and quality assurance at every step. See how we make manufacturing sourcing safe and simple."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Protected at Every Step
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Source with Confidence
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From personalized factory matching to structured payment terms, we've built a platform that puts your interests first at every step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Protection Banner */}
      <section className="border-y border-border bg-card/50">
        <div className="container-wide py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {protectionFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Journey, Protected
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every step is designed to give you control, transparency, and peace of mind.
            </p>
          </motion.div>

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
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {step.highlight}
                        </span>
                      </div>
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

      {/* Payment Structure */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recommended Payment Structure
            </h2>
            <p className="text-lg text-muted-foreground mb-3">
              We help structure payments around verified milestones
            </p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="w-4 h-4" />
              Coming Soon: Full Escrow Protection
            </span>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { stage: "Deposit", percent: "30%", desc: "Secure initial payment" },
              { stage: "Production", percent: "30%", desc: "After production QC" },
              { stage: "Pre-Ship", percent: "20%", desc: "After final inspection" },
              { stage: "Shipped", percent: "10%", desc: "When goods depart" },
              { stage: "Delivered", percent: "10%", desc: "After you receive" },
            ].map((item, index) => (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center p-6 rounded-xl bg-background border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-heading text-2xl font-bold text-foreground mb-1">{item.percent}</p>
                  <p className="font-medium text-foreground text-sm">{item.stage}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Expectations */}
      <section className="section-padding">
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
              From first inquiry to delivery
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { phase: "Day 1-3", title: "Getting Matched", desc: "Receive your curated factory list" },
              { phase: "Week 1-2", title: "Sampling", desc: "Review and approve samples" },
              { phase: "Week 3-8", title: "Production & QC", desc: "Manufacturing with inspections" },
              { phase: "Week 9-10", title: "Shipping", desc: "Delivery to your door" },
            ].map((item, index) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-card border border-border"
              >
                <p className="text-sm text-primary font-medium mb-2">{item.phase}</p>
                <p className="font-heading font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
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
              Tell us what you're looking for and we'll match you with the right factories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact?type=sourcing">
                <Button variant="hero" size="xl">
                  Get Matched
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/directory">
                <Button variant="hero-outline" size="xl">
                  Browse Factories
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
