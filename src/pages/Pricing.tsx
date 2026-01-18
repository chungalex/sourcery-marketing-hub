import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const marketplaceFeatures = [
  "Browse verified factories",
  "Send RFQs",
  "Message and compare suppliers",
  "Invite your own factories",
];

const orderFeatures = [
  "Enforced order lifecycle",
  "Milestone-gated payments",
  "QC gating before shipment",
  "Dispute process",
  "Audit trail",
];

const qcOptions = [
  { name: "Sourcery QC", description: "Third-party, coordinated" },
  { name: "Bring your own QC", description: "Use your existing partner" },
  { name: "Factory self-QC", description: "Lower protection" },
];

export default function Pricing() {
  return (
    <Layout>
      <SEO
        title="Pricing | Sourcery"
        description="Simple pricing for factory sourcing and order enforcement."
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-20 md:py-28">
          <div className="container max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight text-foreground">
              Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Pay for access when you're sourcing.
              <br />
              Pay a percentage only when you enforce an order.
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

        {/* Quality Control */}
        <section className="pb-16 md:pb-24">
          <div className="container max-w-5xl">
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-6">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  Quality Control
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Optional</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                {qcOptions.map((option) => (
                  <div key={option.name} className="text-center sm:text-left">
                    <h3 className="font-medium text-foreground">{option.name}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm text-muted-foreground">
                QC is coordinated, not guaranteed.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
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
