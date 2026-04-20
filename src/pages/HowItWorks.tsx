import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, CheckCircle, Clock, Shield, BarChart3, 
  Globe, Calculator, AlertTriangle, Star, Brain, FileText
} from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Connect your factory — or find one",
    body: "Invite your existing manufacturer with one link. They join free and get the full platform immediately. Or browse verified factories with real OTIF scores — on-time/in-full rates calculated from actual completed orders. Either way, same platform.",
    features: ["BYOF — bring your own factory, full feature parity", "Factory OTIF scores from verified order data", "AI factory matcher with plain-language matching", "Vietnam, Indonesia, Bangladesh, China — all supported"],
    icon: Star,
  },
  {
    n: "02",
    title: "Create a structured purchase order",
    body: "Four steps: product specs, tech pack upload, commercial terms, QC standard. Every field includes plain-English guidance — incoterms, AQL thresholds, milestone structures. The system builds your backward schedule automatically from the delivery date you enter.",
    features: ["Production countdown — every deadline calculated from delivery date", "Incoterms guidance at point of selection", "Milestone payment structure you define", "AQL standard set before production starts"],
    icon: Clock,
  },
  {
    n: "03",
    title: "Sourcery monitors everything — and tells you when to act",
    body: "From the moment the PO is issued, the platform tracks every gate. Is your sample approval on track? Is the factory running behind? Are you approaching cargo cutoff with QC not yet complete? You find out before it becomes a crisis.",
    features: ["Order health dashboard — green/amber/red across all orders", "Holiday alerts 45 days before Tet and Golden Week", "Factory capacity warnings when load is high", "Reorder intelligence using your actual lead time history"],
    icon: AlertTriangle,
  },
  {
    n: "04",
    title: "Payments release only when conditions are met",
    body: "Every milestone is gated. Bulk production doesn't start until the sample is approved. Final payment doesn't release until QC passes. You release each milestone manually — nothing moves without your confirmation.",
    features: ["30% deposit on PO issue", "Sample gate before bulk production", "In-line QC and final QC gate", "Dispute filing blocks final release if needed"],
    icon: Shield,
  },
  {
    n: "05",
    title: "Know your true costs before you commit",
    body: "The trade tools give you the numbers that matter before you sign anything. Import duty rates for 15 apparel categories. Tariff comparison across 5 manufacturing countries. Margin calculator from landed cost to retail. FTA qualification checker.",
    features: ["HTS code lookup with Vietnam→US/UK/EU rates", "China vs Vietnam tariff comparison in real dollar savings", "Margin calculator with wholesale health indicator", "FTA guidance: CPTPP, EVFTA, VKFTA status"],
    icon: Globe,
  },
  {
    n: "06",
    title: "Every completed order becomes a permanent record",
    body: "When an order closes, the full record is archived permanently — spec versions, revision history, QC reports, payment trail. Exportable for CSDDD, UFLPA, and Modern Slavery Act compliance. Shareable as a production record for investors and partners.",
    features: ["Permanent order archive — never deletable", "Compliance export: CSDDD, UFLPA, Modern Slavery Act", "Shareable production record link", "Factory OTIF score updated with every order"],
    icon: FileText,
  },
];

export default function HowItWorks() {
  return (
    <Layout>
      <SEO
        title="How Sourcery Works — Production Intelligence for Small Brands"
        description="From factory connection to closed delivery. Backward scheduling, safety stock math, OTIF scores, trade tools — the enterprise supply chain system built for brands doing 300 units."
      />

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">How it works</p>
            <h1 className="text-4xl font-bold text-foreground leading-[1.15] mb-5">
              One platform. Every step of production.<br />Intelligence at every stage.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The tools enterprise brands use to prevent production disasters — backward scheduling, safety stock formulas, factory scorecards — automated and built into every order.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl">
          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  {i < STEPS.length - 1 && <div className="w-px flex-1 bg-border mt-3" />}
                </div>
                <div className="pb-8 flex-1">
                  <p className="text-xs font-mono text-muted-foreground mb-1">{step.n}</p>
                  <h2 className="text-xl font-bold text-foreground mb-3">{step.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.body}</p>
                  <div className="space-y-1.5">
                    {step.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-border bg-card/40">
        <div className="container max-w-3xl">
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { n: "$49/mo", label: "Builder plan — full intelligence suite" },
              { n: "Free", label: "First order — no time limit" },
              { n: "300+", label: "Unit minimum — works from first production run" },
            ].map(({ n, label }) => (
              <div key={n} className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground mb-1">{n}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth?mode=signup">Start free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/features">See all features</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
