import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, CheckCircle, Shield, Package, BarChart3, 
  MessageSquare, FileText, Star, Globe, Clock, 
  Calculator, AlertTriangle, TrendingUp, Zap, Brain
} from "lucide-react";

const FEATURE_GROUPS = [
  {
    category: "Production intelligence",
    tagline: "What Nike, Amazon, and Apple use. Now at $49/month.",
    features: [
      {
        icon: Clock,
        title: "Backward scheduling",
        method: "Nike's critical path method",
        desc: "Enter your delivery date. Sourcery reverse-engineers every gate — sample approval by June 16, bulk start by July 28, QC by September 3, cargo cutoff September 10. Fires alerts the moment anything slips.",
      },
      {
        icon: Calculator,
        title: "Safety stock calculator",
        method: "Amazon's inventory formula",
        desc: "Enter your weekly sales velocity and current stock. Sourcery calculates your reorder point and the exact date to issue your next PO before you hit zero. No stockouts. No emergency air freight.",
      },
      {
        icon: BarChart3,
        title: "Order health dashboard",
        method: "Nike's control tower concept",
        desc: "Every active order gets a live health score — on track, at risk, or critical. Scored against three signals: delivery proximity, production stage, QC completion. One view. Instant visibility.",
      },
      {
        icon: TrendingUp,
        title: "Reorder intelligence",
        method: "Bullwhip effect prevention",
        desc: "Analyses your actual lead time history per factory, checks their current order load, and tells you exactly when to issue the next PO. The most common cause of missed seasons — prevented automatically.",
      },
      {
        icon: Star,
        title: "Factory OTIF scores",
        method: "Walmart's vendor scorecard",
        desc: "Every factory earns an on-time/in-full delivery rate from verified completed orders. Visible before you commit. Trends over time. Compared against the platform average. Never self-reported.",
      },
    ],
  },
  {
    category: "Order management",
    tagline: "Every order documented from brief to delivery.",
    features: [
      {
        icon: Shield,
        title: "Milestone-gated payments",
        method: "Your money moves when you say so",
        desc: "Every payment stage locked behind a verified condition. 30% deposit on PO. Bulk payment after sample approval. Final payment after QC passes. You release each milestone manually.",
      },
      {
        icon: Package,
        title: "Structured PO creation",
        method: "Every decision explained",
        desc: "Four-step order creation: product specs, tech pack upload, commercial terms, QC standard. Each field includes plain-English guidance — incoterms, AQL thresholds, milestone structures.",
      },
      {
        icon: FileText,
        title: "QC documentation",
        method: "Final payment blocked until it passes",
        desc: "Defects filed as structured reports — type, severity, quantity, photos, factory response. AQL standard enforced. Final milestone blocked until QC passes or dispute is resolved.",
      },
      {
        icon: MessageSquare,
        title: "On-platform messaging",
        method: "No more WhatsApp production management",
        desc: "Every message timestamped and attached to the right order. Factory and brand on the same thread. Nothing communicated outside the platform. Full history permanently attached.",
      },
      {
        icon: Brain,
        title: "Production assistant AI",
        method: "Order context, not generic advice",
        desc: "An AI that knows your actual order — status, factory, specs, milestones. Ask anything: dispute leverage, incoterm explanations, timeline risk, negotiation strategy. Answers in context.",
      },
    ],
  },
  {
    category: "Trade & finance tools",
    tagline: "Know what your goods actually cost before you commit.",
    features: [
      {
        icon: Globe,
        title: "Tariff comparison calculator",
        method: "Vietnam vs China vs Bangladesh vs India",
        desc: "Real-time comparison of total landed cost across five manufacturing countries. Shows China's 145% US tariff impact in actual dollar savings. Includes freight and duty in every calculation.",
      },
      {
        icon: Calculator,
        title: "HTS code & duty lookup",
        method: "15 apparel categories, 3 destination markets",
        desc: "Searchable duty rate table for Vietnam-origin goods to US, UK, and EU. FTA qualification checker — CPTPP, EVFTA, VKFTA status and rules of origin requirements.",
      },
      {
        icon: TrendingUp,
        title: "Margin calculator",
        method: "Landed cost → wholesale → retail",
        desc: "Full P&L from unit cost to retail price. Wholesale margin health indicator benchmarked against industry standards. Shows the impact of freight and duty on final margin.",
      },
      {
        icon: BarChart3,
        title: "Payment calendar",
        method: "Your cash flow, 90 days out",
        desc: "Every pending milestone across all active orders, with estimated payment dates. Total pending outflow at a glance. Flags milestones ready to release.",
      },
    ],
  },
  {
    category: "Compliance & documentation",
    tagline: "Already your compliance infrastructure.",
    features: [
      {
        icon: Shield,
        title: "Supply chain compliance export",
        method: "CSDDD, UFLPA, Modern Slavery Act",
        desc: "One-click export of your complete supply chain record — factories, certifications, order history, QC results. Maps directly to EU and US regulatory requirements. No additional work.",
      },
      {
        icon: FileText,
        title: "Shareable production records",
        method: "Show investors and buyers your track record",
        desc: "Every completed order generates a public production record — quantity, factory, QC standard, delivery. Share with investors, retailers, or future factory partners. Permanent.",
      },
      {
        icon: AlertTriangle,
        title: "Holiday & risk alerts",
        method: "Tet, Golden Week, factory capacity",
        desc: "Fires 45 days before Vietnamese and Chinese holidays when you have active orders. Factory capacity warnings when a supplier has too many concurrent orders.",
      },
      {
        icon: Zap,
        title: "AI toolkit",
        method: "Quote analyser · RFQ generator · Negotiation coach",
        desc: "Three AI tools powered by real production data: analyse factory quotes against benchmarks, generate professional RFQs from a brief, get negotiation strategy for your specific situation.",
      },
    ],
  },
];

export default function Features() {
  return (
    <Layout>
      <SEO
        title="Features — Sourcery Manufacturing OS"
        description="Enterprise supply chain tools built for small brands. Backward scheduling, safety stock math, factory OTIF scores, trade tools, compliance exports — at $49/month."
      />

      {/* Hero */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-6">
              Manufacturing OS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.1] mb-6">
              Enterprise supply chain tools.<br />Built for small brands.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Nike has backward scheduling. Amazon has safety stock formulas. Apple gives every supplier a scorecard. Walmart tracks OTIF rates. All of it is now in Sourcery — automated, at $49/month.
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
              <h2 className="text-2xl font-bold text-foreground">{group.tagline}</h2>
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
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="text-xs text-primary/70 font-medium mt-0.5">{f.method}</p>
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
          <h2 className="text-2xl font-bold text-foreground mb-3">Your first order is free. No time limit.</h2>
          <p className="text-muted-foreground mb-6">Experience the full platform — every intelligence feature, all trade tools, complete documentation — on your first production run.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth?mode=signup">Start free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/alternatives">Compare to Anvyl & Pietra</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
