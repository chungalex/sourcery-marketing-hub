import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, ArrowRight } from "lucide-react";

const COMPARISON = [
  {
    feature: "Free tier",
    sourcery: true,
    sourcery_note: "First order free, no time limit",
    anvyl: false,
    anvyl_note: "$1,500+/month minimum",
    pietra: "partial",
    pietra_note: "Limited free features",
  },
  {
    feature: "Works for brands under 5,000 units",
    sourcery: true,
    anvyl: false,
    anvyl_note: "Enterprise-focused",
    pietra: true,
  },
  {
    feature: "Vietnam factory network",
    sourcery: true,
    sourcery_note: "Founding team based in HCMC",
    anvyl: "partial",
    anvyl_note: "Global but US-centric",
    pietra: "partial",
  },
  {
    feature: "RFQ to multiple factories",
    sourcery: true,
    anvyl: true,
    pietra: false,
  },
  {
    feature: "Bring your own factory (BYOF)",
    sourcery: true,
    sourcery_note: "Full OS works with any factory",
    anvyl: true,
    pietra: false,
    pietra_note: "Only their network",
  },
  {
    feature: "Milestone-gated payments",
    sourcery: true,
    anvyl: true,
    pietra: false,
  },
  {
    feature: "AI production assistant",
    sourcery: true,
    sourcery_note: "Has full order context",
    anvyl: "partial",
    pietra: false,
  },
  {
    feature: "Vietnam/Zalo notifications",
    sourcery: true,
    sourcery_note: "Built specifically for Vietnam",
    anvyl: false,
    pietra: false,
  },
  {
    feature: "Shareable production record",
    sourcery: true,
    anvyl: false,
    pietra: false,
  },
  {
    feature: "Backward scheduling (critical path)",
    sourcery: true,
    sourcery_note: "Auto-calculated from delivery date",
    anvyl: "partial",
    anvyl_note: "Manual, enterprise only",
    pietra: false,
  },
  {
    feature: "Safety stock calculator",
    sourcery: true,
    anvyl: false,
    pietra: false,
  },
  {
    feature: "Factory OTIF scoring",
    sourcery: true,
    sourcery_note: "Verified from real order data",
    anvyl: true,
    anvyl_note: "Enterprise plan only",
    pietra: false,
  },
  {
    feature: "HTS codes & duty calculator",
    sourcery: true,
    anvyl: false,
    pietra: false,
  },
  {
    feature: "Tet/holiday warnings",
    sourcery: true,
    sourcery_note: "Vietnam-native",
    anvyl: false,
    pietra: false,
  },
  {
    feature: "Monthly pricing available",
    sourcery: true,
    sourcery_note: "$49/month",
    anvyl: false,
    anvyl_note: "Annual contracts only",
    pietra: "partial",
  },
];

function Cell({ value, note }: { value: boolean | "partial"; note?: string }) {
  return (
    <td className="px-4 py-3 text-center">
      {value === true ? (
        <div className="flex flex-col items-center gap-0.5">
          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
          {note && <span className="text-xs text-muted-foreground">{note}</span>}
        </div>
      ) : value === false ? (
        <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs text-amber-600 font-medium">Partial</span>
          {note && <span className="text-xs text-muted-foreground">{note}</span>}
        </div>
      )}
    </td>
  );
}

export default function Alternatives() {
  return (
    <Layout>
      <SEO
        title="Sourcery vs enterprise platforms — Production Management Software Comparison"
        description="Compare production management tools for apparel brands. Sourcery vs enterprise platforms: pricing, features, and who each is built for."
      />

      <section className="section-padding border-b border-border">
        <div className="container max-w-4xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Comparison</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Sourcery vs the alternatives.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Most production management tools were built for enterprise brands with $10M+ in revenue. Sourcery was built for brands from their first order — and by people who actually manufacture.
          </p>
        </div>
      </section>

      <section className="section-padding border-b border-border overflow-x-auto">
        <div className="container max-w-4xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground w-1/3">Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-primary">Sourcery</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Enterprise platform</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Network platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPARISON.map(row => (
                <tr key={row.feature} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{row.feature}</td>
                  <Cell value={row.sourcery as any} note={row.sourcery_note} />
                  <Cell value={row.anvyl as any} note={row.anvyl_note} />
                  <Cell value={(row.pietra ?? false) as any} note={row.pietra_note} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Who each tool is built for</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                name: "Sourcery",
                for: "Emerging brands from first order. Vietnam-native. Works with any factory you bring. Free to start.",
                price: "Free → $49/month",
                highlight: true,
              },
              {
                name: "Anvyl",
                for: "Enterprise brands with dedicated sourcing teams. $1,500+/month. US-focused supply chain.",
                price: "$1,500–$5,000/month",
                highlight: false,
              },
              {
                name: "Pietra",
                for: "Brands who want to use Pietra's own factory network. Limited BYOF. Good for very early stage.",
                price: "Free (limited) + per-order fees",
                highlight: false,
              },
            ].map(tool => (
              <div key={tool.name} className={`p-5 rounded-xl border ${tool.highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
                <p className={`font-bold mb-1 ${tool.highlight ? "text-primary" : "text-foreground"}`}>{tool.name}</p>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{tool.for}</p>
                <p className="text-xs font-semibold text-foreground">{tool.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Start free. No credit card.</h2>
          <p className="text-muted-foreground mb-6">Your first order is fully supported. When you're ready to run two simultaneously, upgrade.</p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/auth?mode=signup">Get started free <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
