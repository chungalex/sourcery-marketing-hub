import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
];

export default function Pricing() {
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
                  <p className="mt-1 text-sm text-muted-foreground">Optional</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-semibold text-foreground">$49–$99</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {marketplaceFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-muted-foreground">
                  Not required to place an order.
                </p>
              </div>

              {/* Order Enforcement */}
              <div className="rounded-xl border-2 border-primary bg-card p-8">
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

                <p className="text-sm text-muted-foreground">
                  Charged only when an order is created.
                </p>
              </div>
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
