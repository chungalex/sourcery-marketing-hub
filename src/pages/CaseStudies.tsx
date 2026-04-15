import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { ArrowRight, Package, CheckCircle } from "lucide-react";

const CASE_STUDIES = [
  {
    brand: "OKIO Denim",
    location: "Los Angeles / Ho Chi Minh City",
    product: "Selvedge denim jacket — SS26",
    factory: "HU LA Studios, HCMC",
    units: 300,
    outcome: "First production run completed in 14 weeks. Full tech pack version history, 1 sample revision round, AQL 2.5 QC pass. Milestone payments released on delivery. Complete order record archived on Sourcery.",
    tags: ["Denim", "Vietnam", "First run"],
  },
];

export default function CaseStudies() {
  return (
    <Layout>
      <SEO
        title="Case Studies — Sourcery"
        description="Real brands using Sourcery to manage production in Vietnam and Southeast Asia."
      />
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Case studies</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">Built with Sourcery.</h1>
          <p className="text-lg text-muted-foreground">Real production runs. Real outcomes.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl space-y-6">
          {CASE_STUDIES.map((cs, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-foreground text-lg">{cs.brand}</p>
                  <p className="text-sm text-muted-foreground">{cs.location}</p>
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {cs.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground">{cs.product}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{cs.factory} · {cs.units} units</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{cs.outcome}</p>
            </div>
          ))}

          <div className="p-6 rounded-2xl border border-dashed border-border text-center">
            <p className="text-sm font-medium text-foreground mb-1">Your brand could be next.</p>
            <p className="text-sm text-muted-foreground mb-4">3–5 managed production slots available this season.</p>
            <Link to="/studio" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Apply for a managed slot <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
