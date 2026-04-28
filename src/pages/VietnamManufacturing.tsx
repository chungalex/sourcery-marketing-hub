import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, MapPin } from "lucide-react";

const VIETNAM_FACTS = [
  "Vietnam is the world's 3rd largest garment exporter",
  "Labour cost advantage over China: 40–60%",
  "Strong in: denim, knitwear, activewear, outerwear",
  "Key hubs: Ho Chi Minh City, Hanoi, Da Nang",
  "Most factories accept 300+ unit MOQs",
  "Average lead time: 60–90 days for full production",
];

export default function VietnamManufacturing() {
  return (
    <Layout>
      <SEO
        title="Apparel Manufacturing in Vietnam — Find Factories | Sourcery"
        description="Find verified apparel and garment manufacturers in Vietnam. Low MOQ accepted. Direct factory relationships, milestone-gated payments, full documentation."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Apparel Manufacturing in Vietnam",
        "description": "Find verified garment factories in Vietnam. Sourcery connects brands with manufacturers in Ho Chi Minh City, Hanoi, and beyond.",
        "url": "https://sourcery.so/vietnam-manufacturing",
      })}} />

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Vietnam manufacturing</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Find apparel factories in Vietnam.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Vietnam is the world's third largest garment exporter. Sourcery connects brands with verified manufacturers — denim, knitwear, activewear, and more. Free to browse. Milestone-gated payments. Every order documented.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/marketplace">Browse Vietnam factories <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/auth?mode=signup">Start free</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Why Vietnam?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {VIETNAM_FACTS.map(fact => (
              <div key={fact} className="flex items-start gap-2.5 p-4 bg-card border border-border rounded-xl">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">How Sourcery works for Vietnam sourcing</h2>
          <div className="space-y-4">
            {[
              { n: "01", title: "Browse or get matched", body: "Filter by category, MOQ, certifications, and location. AI matcher describes what you need in plain language and gets ranked recommendations." },
              { n: "02", title: "Invite your factory or contact new ones", body: "Already have a factory in Vietnam? Invite them — they join free. Finding a new one? Contact directly through the platform." },
              { n: "03", title: "Create a structured PO", body: "Spec, pricing, delivery window, QC standard, milestone payments — all agreed before production starts. Both sides confirm." },
              { n: "04", title: "Sampling, QC, delivery — all documented", body: "Sample approval gate before bulk. QC inspection before final payment. Full order record archived permanently." },
            ].map(step => (
              <div key={step.n} className="flex gap-4">
                <span className="font-mono text-sm font-bold text-primary/40 flex-shrink-0 w-8 mt-0.5">{step.n}</span>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">{step.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl">
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="text-xl font-bold text-foreground mb-2">Built by people in Vietnam</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We run HU LA Studios — a garment factory in Ho Chi Minh City — and OKIO Denim, a brand that sources from Vietnam. Sourcery was built because we couldn't find software that worked for how production actually runs here.
            </p>
            <Button asChild>
              <Link to="/about">About Sourcery →</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
