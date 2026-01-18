import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Check, Shield, Clock, Users, Zap, Building2, ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const marketplaceFeatures = [
  "Browse verified factories",
  "Send unlimited RFQs",
  "Message and compare suppliers",
  "Invite your own factories",
  "Save searches and shortlists",
];

const orderFeatures = [
  "Enforced order lifecycle",
  "Milestone-gated payments",
  "QC gating before shipment",
  "Dispute resolution",
  "Full audit trail",
];

const enterpriseFeatures = [
  "Volume-based rates (as low as 1.5%)",
  "Dedicated account manager",
  "Priority factory matching",
  "Custom integrations (ERP, inventory)",
  "Quarterly business reviews",
];

const trustPoints = [
  {
    icon: Shield,
    title: "Milestone Protection",
    description: "Funds released only when milestones are met",
  },
  {
    icon: Clock,
    title: "14-Day Free Trial",
    description: "Try Marketplace Access risk-free",
  },
  {
    icon: Users,
    title: "500+ Brands",
    description: "Trusted by growing fashion brands",
  },
  {
    icon: Zap,
    title: "Cancel Anytime",
    description: "No long-term contracts or commitments",
  },
];

const testimonials = [
  {
    quote: "The QC process alone is worth it. Catching defects before shipping has saved us thousands in returns and protected our brand reputation.",
    author: "Marcus Williams",
    role: "Founder",
    company: "Urban Essentials",
  },
  {
    quote: "We cut production time by 40% and finally have visibility into our factory relationships. The milestone payments give us leverage we never had before.",
    author: "Sarah Chen",
    role: "Head of Production",
    company: "Modern Apparel Co.",
  },
];

const faqs = [
  {
    question: "Do I need a paid plan to place an order?",
    answer: "No. Marketplace Access is optional. You can place an order with any factory—including ones you invite yourself—without a subscription.",
  },
  {
    question: "When do I pay the enforcement fee?",
    answer: "The 2–5% fee is charged only when an order is created through Sourcery. You're never charged for browsing, messaging, or RFQs.",
  },
  {
    question: "What's included in QC?",
    answer: "QC inspection coordination is included in the enforcement fee. We schedule and gate shipments based on inspection results—no separate charges.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Marketplace Access is month-to-month with no long-term commitment. Cancel anytime from your account settings.",
  },
  {
    question: "What if I already have a factory?",
    answer: "You can invite your own factory to Sourcery and still use our order enforcement, milestone payments, and QC coordination—no marketplace subscription required.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Get 14 days free on Marketplace Access. No credit card required to start exploring factories.",
  },
  {
    question: "What qualifies for Enterprise pricing?",
    answer: "Brands with $500K+ in annual production volume qualify for custom Enterprise pricing, including reduced enforcement rates and dedicated support.",
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const monthlyPrice = { min: 49, max: 99 };
  const annualPrice = { min: 39, max: 79 };
  const currentPrice = isAnnual ? annualPrice : monthlyPrice;

  return (
    <Layout>
      <SEO
        title="Pricing | Sourcery"
        description="Simple pricing for factory sourcing and order enforcement. Pay for access when sourcing, percentage only when orders ship."
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-20 md:py-28">
          <div className="container max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight text-foreground">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Free to browse. Subscribe to source.
              <br />
              Pay a percentage only when orders ship.
            </p>

            {/* Billing Toggle */}
            <div className="mt-10 inline-flex items-center gap-4 p-1 bg-muted rounded-full">
              <button
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  !isAnnual
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                  isAnnual
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Annual
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Two-Column Pricing */}
        <section className="pb-16 md:pb-24">
          <div className="container max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Marketplace Access */}
              <div className="rounded-xl border border-border bg-card p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-heading font-semibold text-foreground">
                    Marketplace Access
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">Optional · 14-day free trial</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-semibold text-foreground">
                    ${currentPrice.min}–${currentPrice.max}
                  </span>
                  <span className="text-muted-foreground"> / month</span>
                  {isAnnual && (
                    <p className="text-sm text-primary mt-1">
                      Billed annually · Save up to $240/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {marketplaceFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full" variant="outline">
                  <Link to="/auth">Start Free Trial</Link>
                </Button>
              </div>

              {/* Order Enforcement */}
              <div className="rounded-xl border-2 border-primary bg-card p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-heading font-semibold text-foreground">
                    Order Enforcement
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">Per order · Buyer-paid</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-semibold text-foreground">2–5%</span>
                  <span className="text-muted-foreground"> per order</span>
                  <span className="ml-2 text-sm text-muted-foreground">· 3% standard</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {orderFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full">
                  <Link to="/factories">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="pb-16 md:pb-24">
          <div className="container max-w-5xl">
            <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <Building2 className="h-4 w-4" />
                    Enterprise
                  </div>
                  <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
                    Custom Pricing for High-Volume Brands
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    For brands with $500K+ in annual production. Get volume-based rates, dedicated support, and custom integrations.
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                    {enterpriseFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild>
                    <Link to="/contact" className="inline-flex items-center gap-2">
                      Contact Sales <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study Callout */}
        <section className="pb-16 md:pb-24">
          <div className="container max-w-3xl">
            <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
              <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                Case Study
              </span>
              <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-4">
                Heritage Goods saved $67,500 on their first order
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-left max-w-lg mx-auto mb-6">
                <div className="p-3 bg-background/60 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Before Sourcery</p>
                  <p className="text-sm text-foreground">15% premium + quality issues with previous supplier</p>
                </div>
                <div className="p-3 bg-background/60 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">After Sourcery</p>
                  <p className="text-sm text-foreground">45% cost reduction, zero defects across 10,000 units</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm italic mb-6">
                "Sourcery found us the perfect factory on the first try."
                <br />
                <span className="text-foreground font-medium not-italic">— Sarah Chen, Founder</span>
              </p>
              <Button asChild variant="link" className="text-primary">
                <Link to="/case-studies">Read Full Case Study →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="pb-16 md:pb-24">
          <div className="container max-w-5xl">
            <h2 className="text-2xl font-heading font-semibold text-foreground text-center mb-10">
              What Brands Are Saying
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-6 relative"
                >
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
                  <p className="text-foreground mb-6 relative z-10">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Points */}
        <section className="pb-16 md:pb-24">
          <div className="container max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustPoints.map((point) => (
                <div key={point.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <point.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground text-sm">{point.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-16 md:pb-24">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-heading font-semibold text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="pb-20 md:pb-28">
          <div className="container max-w-4xl text-center">
            <p className="text-muted-foreground mb-8">
              Sourcery is designed for serious production orders where enforcement matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/factories">Browse Factories</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
