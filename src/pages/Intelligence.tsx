import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Star, BarChart3, Shield, Zap } from "lucide-react";

export default function Intelligence() {
  return (
    <Layout>
      <SEO
        title="Production Intelligence — Sourcery"
        description="The Sourcery intelligence layer — OTIF scores, reorder timing, order health, backward scheduling. Enterprise supply chain intelligence built for brands doing 300 units."
      />

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-6">
              Intelligence layer
            </div>
            <h1 className="text-4xl font-bold text-foreground leading-[1.15] mb-5">
              The supply chain tools that cost enterprise brands $1M+ per year — automated.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nike's critical path scheduling. Amazon's safety stock formulas. Apple's factory scorecards. Walmart's OTIF tracking. Not expensive software. Not a sourcing team. Sourcery — built from the data in your orders.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-3">Why intelligence compounds</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Unlike spreadsheets and generic tools, Sourcery gets more accurate with every order. Your first order gives you a lead time estimate. Your fifth gives you an average. Your twentieth gives you variance, trend detection, and factory comparison. The platform earns its value over time.
          </p>
          <div className="space-y-4">
            {[
              {
                icon: TrendingUp,
                title: "Reorder intelligence — from your actual history",
                body: "Not a generic 14-week assumption. Your lead time with HU LA Studios is calculated from every order you've run through them. The more orders, the more accurate. After 5 orders, the system knows your lead time variance, your seasonal patterns, and your factory's busy periods.",
              },
              {
                icon: Star,
                title: "OTIF scores — built from real completed orders",
                body: "Every factory on Sourcery earns an on-time/in-full score. Not self-reported. Built from verified order data. After 10 orders, the score is meaningful. After 50, it's a market benchmark. The first brand to place 10 orders with a factory creates a score that helps the next 100 brands make a better decision.",
              },
              {
                icon: BarChart3,
                title: "Backward scheduling — calibrated to your product",
                body: "The production countdown uses your actual completion patterns. A brand running denim orders discovers their QC stage consistently takes 2 weeks longer than average — so their countdown automatically accounts for that. The system learns your supply chain.",
              },
              {
                icon: Shield,
                title: "Order health — calibrated to your factory",
                body: "After enough orders with a specific factory, the health scoring model knows that this factory typically runs 3 days late on QC. It adjusts the at-risk threshold accordingly. Generic tools give you generic alerts. Sourcery gives you alerts based on this factory's actual behaviour.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 p-5 bg-card border border-border rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-3">What this replaces</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">What enterprise brands use</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Annual cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary font-semibold">Sourcery equivalent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Critical path scheduling software", "$12,000–$50,000/yr", "Production countdown — included in Builder"],
                  ["Inventory planning / demand forecasting", "$8,000–$30,000/yr", "Safety stock calculator — included in Builder"],
                  ["Vendor scorecard system", "$5,000–$20,000/yr", "Factory OTIF scores — built automatically"],
                  ["Supply chain visibility platform", "$15,000–$60,000/yr", "Order health dashboard — included in Builder"],
                  ["Compliance documentation", "$3,000–$15,000/yr", "One-click export — included in Pro"],
                  ["Trade & tariff analysis", "$5,000–$25,000/yr", "Trade tools — free, no login required"],
                  ["Total", "$48,000–$200,000/yr", "Sourcery Builder: $588/yr"],
                ].map(([enterprise, cost, sourcery], i) => (
                  <tr key={i} className={i === 6 ? "font-semibold bg-primary/5" : ""}>
                    <td className="px-4 py-3 text-foreground">{enterprise}</td>
                    <td className="px-4 py-3 text-muted-foreground">{cost}</td>
                    <td className="px-4 py-3 text-primary">{sourcery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl text-center">
          <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Every order makes it smarter.</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto leading-relaxed">
            Your first order is free. The intelligence starts building immediately. By your third order, you have real lead time data. By your tenth, you have a factory score that protects every brand that comes after you.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/auth?mode=signup">Start your first order free <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
