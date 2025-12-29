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
  Factory
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    priceNote: "forever",
    description: "Explore the directory and start your sourcing journey",
    features: [
      { text: "Browse factory directory", included: true },
      { text: "Basic factory profiles", included: true },
      { text: "3 inquiries per month", included: true },
      { text: "Community support", included: true },
      { text: "AI Factory Matcher", included: false },
      { text: "Escrow payment protection", included: false },
      { text: "Quality inspections", included: false },
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$99",
    priceNote: "/month",
    description: "Full platform access with AI tools and protection",
    features: [
      { text: "Everything in Free", included: true },
      { text: "Unlimited inquiries", included: true },
      { text: "AI Factory Matcher", included: true },
      { text: "AI Quote Analyzer", included: true },
      { text: "AI RFQ Generator", included: true },
      { text: "Escrow payment protection", included: true },
      { text: "Standard quality inspections", included: true },
      { text: "Verified messaging", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "volume-based",
    description: "For high-volume brands with complex needs",
    features: [
      { text: "Everything in Growth", included: true },
      { text: "AI Negotiation Coach", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "On-site quality team", included: true },
      { text: "Custom integrations", included: true },
      { text: "Supply chain consulting", included: true },
      { text: "24/7 priority support", included: true },
      { text: "Volume discounts", included: true },
    ],
    cta: "Contact Sales",
    highlighted: false,
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
    title: "Quality Assurance",
    description: "Professional inspections at every stage with detailed reports and photo documentation.",
  },
  {
    icon: MessageSquare,
    title: "Verified Communication",
    description: "All messages are logged and factories are verified for secure, reliable communication.",
  },
];

const faqs = [
  {
    q: "How does the escrow payment protection work?",
    a: "Your funds are held securely until each production milestone is complete. You release payment only after verifying quality at each stage—deposit, production, shipping, and delivery.",
  },
  {
    q: "What tools are included?",
    a: "Growth plans include curated factory matching, quote comparison tools, and RFQ templates. Enterprise adds dedicated account management and negotiation support.",
  },
  {
    q: "Can I try before I subscribe?",
    a: "Yes! The Free tier lets you explore the directory and send up to 3 inquiries per month. Growth includes a 14-day free trial with full access.",
  },
  {
    q: "How do quality inspections work?",
    a: "Our inspection team visits factories at key production milestones. You receive detailed reports with photos, measurements, and pass/fail status. Issues are flagged before shipping.",
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can change plans at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle.",
  },
];

export default function Pricing() {
  return (
    <Layout>
      <SEO 
        title="Pricing | Manufactory"
        description="Simple, transparent pricing with AI-powered tools, escrow protection, and quality assurance. Start free or unlock full platform access."
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
              Protected Platform
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Start free, scale with confidence. Every plan includes platform protection and verified factories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl border p-6 md:p-8 ${
                  plan.highlighted
                    ? "bg-foreground text-background border-foreground relative"
                    : "bg-card border-border"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className={`font-heading text-xl font-semibold mb-2 ${plan.highlighted ? "text-background" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? "text-background/70" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className={`font-heading text-4xl font-bold ${plan.highlighted ? "text-background" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ml-2 ${plan.highlighted ? "text-background/70" : "text-muted-foreground"}`}>
                    {plan.priceNote}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        feature.included 
                          ? (plan.highlighted ? "text-primary" : "text-primary") 
                          : (plan.highlighted ? "text-background/30" : "text-muted-foreground/30")
                      }`} />
                      <span className={`text-sm ${
                        feature.included 
                          ? (plan.highlighted ? "text-background/90" : "text-muted-foreground") 
                          : (plan.highlighted ? "text-background/40 line-through" : "text-muted-foreground/40 line-through")
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.name === "Enterprise" ? "/contact?type=enterprise" : "/contact?type=sourcing"}>
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-background text-foreground hover:bg-background/90"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="section-padding bg-card/50">
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
              Every transaction is protected with escrow payments, verified communication, and quality assurance.
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
                className="p-6 rounded-xl bg-background border border-border text-center"
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

      {/* Platform Tools Highlight */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8 md:p-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                Expert-Guided Sourcing Tools
              </h2>
            </div>
            
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Our team and smart tools help you find the perfect factory match, compare quotes for hidden costs, create professional RFQs, and get guidance on negotiations.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                { name: "Curated Factory Matching", desc: "We handpick the best factories for your needs" },
                { name: "Quote Comparison", desc: "Side-by-side analysis to spot red flags" },
                { name: "RFQ Templates", desc: "Professional templates to save you time" },
                { name: "Negotiation Support", desc: "Expert guidance on getting better terms" },
              ].map((tool) => (
                <div key={tool.name} className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{tool.name}</p>
                    <p className="text-sm text-muted-foreground">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/how-it-works">
              <Button variant="default" size="lg">
                See How It Works
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
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
              Ready to Source Smarter?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Start free and explore the platform. Upgrade anytime to unlock AI tools and full protection.
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
