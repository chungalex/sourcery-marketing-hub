import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Shield, BarChart3, Package } from "lucide-react";

export default function CaseStudies() {
  return (
    <Layout>
      <SEO
        title="Case Studies — OKIO Denim on Sourcery"
        description="How OKIO Denim manages production from Ho Chi Minh City using Sourcery. Real numbers, real orders, real results."
      />

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Case study</p>
          <h1 className="text-4xl font-bold text-foreground mb-5">How OKIO Denim runs production on Sourcery.</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            OKIO is a premium denim brand with a Vietnam–LA identity, sourcing from Ho Chi Minh City. Every production run is managed on Sourcery — from PO to delivery.
          </p>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Production city", value: "Ho Chi Minh City" },
              { label: "Factory", value: "HU LA Studios" },
              { label: "Category", value: "Premium denim" },
              { label: "Order size", value: "300–500 units" },
              { label: "Lead time", value: "14 weeks avg" },
              { label: "QC standard", value: "AQL 2.5" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">How OKIO uses the platform</h2>
          <div className="space-y-6">
            {[
              {
                icon: Clock,
                title: "Production countdown from delivery date",
                body: "Every OKIO order has a target delivery date. Sourcery automatically calculates every required gate — sample approval by X, bulk start by Y, cargo cutoff by Z — and fires alerts if anything slips. No sourcing director required.",
              },
              {
                icon: Shield,
                title: "Milestone-gated payments to HU LA",
                body: "30% deposit on PO issue. Sample approval before bulk production starts. Final payment only after QC passes AQL 2.5. Every milestone released manually. No wire transfer without a verified condition met.",
              },
              {
                icon: BarChart3,
                title: "HU LA's OTIF score builds with every order",
                body: "Each completed OKIO order contributes to HU LA Studios' on-time/in-full score on the platform. The score becomes more accurate with each production run and is visible to any brand browsing the factory directory.",
              },
              {
                icon: Package,
                title: "Reorder intelligence prevents stockouts",
                body: "After the first OKIO order closed, Sourcery began tracking lead time history. It now tells OKIO exactly when to issue the next PO based on their actual 14-week average — before they hit zero inventory.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">What's documented on every OKIO order</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "Purchase order with agreed specs and pricing",
              "Tech pack version history",
              "Sample photos and approval record",
              "Revision rounds with factory acknowledgement",
              "Milestone payment releases with timestamps",
              "QC inspection results and defect reports",
              "Shipment documents and cargo cutoff",
              "Permanent closed order record",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl">
                <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl">
          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Start your own</p>
            <h2 className="text-xl font-bold text-foreground mb-3">Your first order is free. No time limit.</h2>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              The same platform. Whether you're placing your first order or your fiftieth — same intelligence, same factory scorecard system, same protection. Free for your first order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="gap-2">
                <Link to="/auth?mode=signup">Start free <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/how-it-works">See how it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
