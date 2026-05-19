import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shield, BarChart3, Package, Lock } from "lucide-react";

const HOW_IT_WORKS = [
  {
    icon: Clock,
    title: "Production countdown from delivery date",
    body: "Every order has a target delivery date. Clewa automatically calculates every required gate — sample approval by X, bulk start by Y, cargo cutoff by Z — and fires alerts if anything slips. No sourcing director required.",
  },
  {
    icon: Shield,
    title: "Milestone-gated payments",
    body: "30% deposit on PO issue. Sample approval before bulk production starts. Final payment only after QC passes AQL. Every milestone released manually. No wire transfer without a verified condition met.",
  },
  {
    icon: BarChart3,
    title: "Factory OTIF score builds with every order",
    body: "Each completed order contributes to your factory's on-time/in-full score on the platform. The score becomes more accurate with each production run and is visible to any brand browsing the factory directory.",
  },
  {
    icon: Package,
    title: "Reorder intelligence prevents stockouts",
    body: "After your first order closes, Clewa tracks lead time history. It then tells you exactly when to issue the next PO based on your actual average — before you hit zero inventory.",
  },
  {
    icon: Lock,
    title: "Permanent documentation on every order",
    body: "Every spec, every revision, every sample photo, every payment release — permanently archived. The full paper trail that protects you if anything is ever disputed.",
  },
];

export default function CaseStudies() {
  return (
    <Layout>
      <SEO
        title="How Clewa Works in Practice — Real Order Infrastructure"
        description="How brands use Clewa to run structured orders, protect payments, build factory OTIF scores, and never miss a production deadline."
      />

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">The platform in practice</p>
          <h1 className="text-4xl font-bold text-foreground mb-5">What a Clewa order actually looks like.</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From the first factory search to the last payment release — this is the infrastructure behind every order on Clewa. Every step guided. Every payment protected. Every document permanently archived.
          </p>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Countries covered", value: "Vietnam, Indonesia, Bangladesh, China, Portugal" },
              { label: "Typical order size", value: "100–2,000 units" },
              { label: "Avg lead time (verified)", value: "12–16 weeks" },
              { label: "Payment structure", value: "Milestone-gated — 3 stages" },
              { label: "QC standard", value: "AQL 2.5 (configurable)" },
              { label: "Documentation", value: "Permanent — never expires" },
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
          <h2 className="text-2xl font-bold text-foreground mb-6">How the platform works on every order</h2>
          <div className="space-y-6">
            {HOW_IT_WORKS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
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
          <h2 className="text-2xl font-bold text-foreground mb-4">What's documented on every order</h2>
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
                <div className="h-3.5 w-3.5 rounded-full bg-primary flex-shrink-0" />
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
              The full platform — factory directory, structured PO, milestone payments, production intelligence, permanent documentation. Free for your first order.
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
