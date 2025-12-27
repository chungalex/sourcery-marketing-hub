import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, CheckCircle, HelpCircle } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "5%",
    priceNote: "of production value",
    description: "For brands testing new products or categories",
    features: [
      "Up to $50K production value/year",
      "3 factory matches per inquiry",
      "Standard QC inspections",
      "Email support",
      "Basic production tracking",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "4%",
    priceNote: "of production value",
    description: "For scaling brands with consistent orders",
    features: [
      "Up to $250K production value/year",
      "5 factory matches per inquiry",
      "Priority QC inspections",
      "Dedicated sourcing manager",
      "Advanced tracking dashboard",
      "Quarterly business reviews",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "volume-based pricing",
    description: "For high-volume brands with complex needs",
    features: [
      "Unlimited production value",
      "Unlimited factory matches",
      "On-site QC team",
      "24/7 priority support",
      "Custom integrations",
      "Dedicated account team",
      "Supply chain consulting",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "When do I pay?",
    a: "Fees are calculated as a percentage of your production order value and invoiced upon shipment. There are no upfront fees or retainers.",
  },
  {
    q: "Are there any hidden costs?",
    a: "No. Our fee covers sourcing, factory vetting, production management, and standard QC inspections. Additional services like expedited QC or on-site audits may incur extra fees, which we'll always discuss upfront.",
  },
  {
    q: "What if I'm not satisfied with factory matches?",
    a: "We'll continue searching until we find the right fit. If we can't find a suitable factory for your project, you pay nothing.",
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can change plans at any time. We'll prorate any differences and adjust your pricing for future orders.",
  },
];

export default function Pricing() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              No upfront fees, no retainers. Pay a percentage of your production value only when orders ship.
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
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? "text-primary" : "text-primary"}`} />
                      <span className={`text-sm ${plan.highlighted ? "text-background/90" : "text-muted-foreground"}`}>
                        {feature}
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
              Pricing Questions
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
              Not Sure Which Plan?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Book a call with our team and we'll help you find the right fit for your needs.
            </p>
            <Link to="/contact?type=call">
              <Button variant="hero" size="xl">
                Book a Call
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
