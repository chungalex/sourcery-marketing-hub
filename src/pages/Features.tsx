import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CheckCircle, Shield, Package, BarChart3,
  MessageSquare, FileText, Star, Globe, Clock,
  Calculator, AlertTriangle, TrendingUp, Zap, Brain
} from "lucide-react";

const FEATURE_GROUPS = [
  {
    category: "Production intelligence",
    tagline: "Know what's coming before your factory tells you.",
    sub: "Most brands find out something is wrong in week 10. The factory has gone quiet. The delivery window that felt safe isn't anymore. By the time it's visible, the options are bad. These features tell you in week 4.",
    features: [
      {
        icon: Clock,
        title: "Backward scheduling",
        hook: "Find out in week 4, not week 12",
        desc: "Enter your delivery date. Clewa reverse-engineers every gate — sample approval, bulk start, QC, cargo cutoff. Fires an alert the moment anything slips. You don't check the timeline. The timeline tells you.",
      },
      {
        icon: BarChart3,
        title: "Order health",
        hook: "On track, at risk, or critical — one view",
        desc: "Every active order scored live against three signals: delivery proximity, production stage, QC completion. Not a spreadsheet. Not a status meeting. One dashboard, instant read.",
      },
      {
        icon: Star,
        title: "Factory OTIF scores",
        hook: "Know if they deliver before you commit",
        desc: "Every factory earns an on-time/in-full rate from verified completed orders. Visible before you commit. Trends over time. Compared against the platform average. Never self-reported.",
      },
      {
        icon: TrendingUp,
        title: "Reorder intelligence",
        hook: "The most common cause of missed seasons, prevented",
        desc: "Analyses your actual lead time history per factory, checks their current order load, and gives you the exact date to issue your next PO. Not a formula. Your data, your factory, your number.",
      },
      {
        icon: Calculator,
        title: "Safety stock calculator",
        hook: "The date to reorder before you hit zero",
        desc: "Enter your weekly sales velocity and current stock level. Clewa calculates your reorder point and the exact date you'll need to issue the next PO. No stockouts. No emergency air freight.",
      },
    ],
  },
  {
    category: "Order management",
    tagline: "Your money never moves without your approval.",
    sub: "Every payment is milestone-gated. Every spec change is formally logged. Every message is attached to the right order. Nothing falls through the cracks because there are no cracks.",
    features: [
      {
        icon: Shield,
        title: "Milestone-gated payments",
        hook: "No payment releases until the condition is met",
        desc: "30% deposit on PO issue. Bulk payment only after sample approved. Final payment only after QC passes. You release each milestone manually. Your money is protected at every stage — the factory can't receive the next payment without meeting the condition.",
      },
      {
        icon: Package,
        title: "Structured PO creation",
        hook: "Every decision explained as you make it",
        desc: "Four-step order creation: product specs, tech pack upload, commercial terms, QC standard. Each field includes plain-English guidance on what it means, what's normal, and what to watch for. Incoterms, AQL thresholds, milestone structures — all contextualised.",
      },
      {
        icon: FileText,
        title: "QC documentation",
        hook: "Final payment blocked until QC passes",
        desc: "Defects filed as structured reports — type, severity, quantity, photos, factory response required. AQL standard enforced. Final milestone blocked until QC passes or dispute is resolved. Your leverage is built in.",
      },
      {
        icon: MessageSquare,
        title: "On-platform messaging",
        hook: "Every message attached to the right order, permanently",
        desc: "Factory and brand on the same thread. Every message timestamped and attached to the right order. Nothing communicated outside the platform. Full history permanently on record. No more 'I thought you said' conversations.",
      },
      {
        icon: Brain,
        title: "Production assistant AI",
        hook: "Ask anything. It knows your actual order.",
        desc: "Not a generic chatbot. An AI that knows your order status, your factory, your specs, your milestones. Ask about dispute leverage, timeline risk, negotiation strategy, what to message the factory today. Answers in context — not in theory.",
      },
    ],
  },
  {
    category: "Trade & finance tools",
    tagline: "Know what you're actually paying before you commit.",
    sub: "The number your factory quotes is not the number you pay. Freight, duty, tariffs, FX — they add up to a landed cost that's often 30–50% higher than the unit price. These tools show you the real number before you commit.",
    features: [
      {
        icon: Globe,
        title: "Tariff comparison calculator",
        hook: "The exact tariff impact before you choose a country",
        desc: "Real-time comparison of total landed cost across five manufacturing countries. Shows China's 145% US tariff impact in actual dollar savings per unit. Includes freight and duty in every calculation. Vietnam vs China comparison at a glance.",
      },
      {
        icon: Calculator,
        title: "HTS code & duty lookup",
        hook: "Your duty rate, confirmed",
        desc: "Searchable duty rate table for Vietnam-origin goods to US, UK, and EU markets. FTA qualification checker — CPTPP, EVFTA, VKFTA status and rules of origin requirements. Know your rate before you quote a price.",
      },
      {
        icon: TrendingUp,
        title: "Margin calculator",
        hook: "From factory gate to retail shelf — the real number",
        desc: "Full P&L from unit cost to retail price. Freight and duty included. Wholesale margin health indicator benchmarked against industry standards. Shows exactly which cost line is compressing your margin.",
      },
      {
        icon: BarChart3,
        title: "Payment calendar",
        hook: "Every payment due, 90 days out",
        desc: "Every pending milestone across all active orders, with estimated payment dates and amounts. Total pending outflow at a glance. Flags milestones that are ready to release. Your cash flow, before it surprises you.",
      },
    ],
  },
  {
    category: "Compliance & documentation",
    tagline: "Documentation that builds itself.",
    sub: "Running orders on Clewa generates your compliance record as a side effect. By the time a regulator or retailer asks, everything is already there.",
    features: [
      {
        icon: Shield,
        title: "Supply chain compliance export",
        hook: "One click when regulators ask",
        desc: "Your complete supply chain record — factories, certifications, order history, QC results — mapped to CSDDD, UFLPA, and Modern Slavery Act requirements. One-click export. No additional work required because you were already documenting everything.",
      },
      {
        icon: FileText,
        title: "Shareable production records",
        hook: "Your track record, permanently documented",
        desc: "Every completed order generates a public production record — quantity, factory, QC standard, delivery performance. Share with investors, retailers, or future factory partners. Shows you run production professionally.",
      },
      {
        icon: AlertTriangle,
        title: "Holiday & capacity alerts",
        hook: "Tet is 6 weeks away — here's what that means",
        desc: "Fires 45 days before Vietnamese and Chinese public holidays when you have active orders in-production. Factory capacity warnings when a supplier is approaching concurrent order limits. The surprises that aren't actually surprises — flagged early.",
      },
      {
        icon: Zap,
        title: "AI toolkit",
        hook: "Quote analyser · RFQ generator · Negotiation coach",
        desc: "Three AI tools wired to real production data: analyse factory quotes against category benchmarks, generate professional RFQs from a plain-language brief, get negotiation strategy specific to your situation. Not generic. Contextual.",
      },
    ],
  },
];

export default function Features() {
  return (
    <Layout>
      <SEO
        title="What Clewa does — features for every stage of production"
        description="Production intelligence, milestone-gated payments, factory OTIF scores, trade tools, compliance exports. Everything your factory relationship needs — from first order to fiftieth."
      />

      {/* Hero */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-6">The thread</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl font-normal text-foreground leading-[1.1] mb-6">
              Everything your factory<br />relationship needs.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
              Most brands find out something is wrong in week 10. The factory has gone quiet. The delivery window that felt safe isn't anymore. The spec the factory is building from isn't the one you sent.
            </p>
            <p className="text-lg text-foreground font-medium leading-relaxed mb-8 max-w-2xl">
              Clewa tells you in week 4. And structures every order so the problems that usually hit week 10 can't get past week 2.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/auth?mode=signup">Get started free <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature groups */}
      {FEATURE_GROUPS.map((group, gi) => (
        <section key={group.category} className={`section-padding ${gi < FEATURE_GROUPS.length - 1 ? "border-b border-border" : ""}`}>
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{group.category}</p>
              <h2 className="font-bold tracking-tight text-2xl md:text-3xl font-normal text-foreground mb-3">{group.tagline}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{group.sub}</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5">
              {group.features.map((f, fi) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: fi * 0.06 }}
                  className="p-5 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="text-xs text-primary/70 font-medium mt-0.5 italic">{f.hook}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container max-w-3xl text-center">
          <h2 className="font-bold tracking-tight text-2xl md:text-3xl font-normal text-foreground mb-3">Your first order is free. No time limit.</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Experience the full platform on your first production run — every intelligence feature, all trade tools, complete documentation. No credit card. No expiry.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth?mode=signup">Start free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/pricing">See all three tiers</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
