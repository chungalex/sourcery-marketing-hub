import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Define your product spec before you talk to any factory",
    body: "A factory can't quote accurately without knowing: product type, materials, quantity, colourways, size range, and target delivery. Write this down first. The more specific your brief, the more comparable the quotes you get back.",
  },
  {
    n: "02", 
    title: "Research factories by category and region",
    body: "Vietnam is strong in denim, knitwear, and activewear. China for accessories and technical fabrics. Bangladesh for basics at scale. Don't source denim from a country that doesn't specialize in it.",
  },
  {
    n: "03",
    title: "Send RFQs to 3–5 factories simultaneously",
    body: "Never negotiate with one factory at a time. Send the same brief to multiple manufacturers and compare their quotes on price, lead time, MOQ, and how they communicate. How a factory responds to an RFQ tells you a lot.",
  },
  {
    n: "04",
    title: "Verify before you pay anything",
    body: "Ask for: previous client references, a factory visit if possible, certifications relevant to your market, and a sample before bulk production. A factory that won't provide samples is a red flag.",
  },
  {
    n: "05",
    title: "Structure your payment to protect yourself",
    body: "Never pay 100% upfront. Standard structure: 30% deposit on PO, 70% balance on delivery after QC. Use milestone-gated payments — nothing moves without your sign-off.",
  },
  {
    n: "06",
    title: "Document everything in writing",
    body: "Every spec, revision, approved sample, and payment should be in writing. WhatsApp messages disappear. Email threads get lost. Use a platform that creates a permanent record.",
  },
];

const RED_FLAGS = [
  "Won't provide client references",
  "Quotes unusually low — they'll make up margin in quality or speed",
  "Slow to respond before you've placed an order",
  "No clear sampling process",
  "Wants full payment upfront",
  "Can't provide factory certifications",
];

export default function HowToFindFactory() {
  return (
    <Layout>
      <SEO
        title="How to Find a Factory for Your Clothing Brand | Sourcery"
        description="Step-by-step guide to finding, vetting, and working with apparel manufacturers. From RFQ to first order. Written by people who've done it."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Find a Factory for Your Clothing Brand",
        "description": "Step-by-step guide to finding and vetting apparel manufacturers",
        "step": STEPS.map((s, i) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "name": s.title,
          "text": s.body,
        })),
      })}} />

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Production guide</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            How to find a factory for your clothing brand.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Written by the team behind HU LA Studios and OKIO Denim. We manufacture and we source. This is what actually works.
          </p>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl space-y-8">
          {STEPS.map(step => (
            <div key={step.n} className="flex gap-5">
              <span className="font-mono text-sm font-bold text-primary/40 flex-shrink-0 mt-1 w-8">{step.n}</span>
              <div>
                <h2 className="font-bold text-foreground text-lg mb-2">{step.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Red flags to walk away from</h2>
          <div className="space-y-2">
            {RED_FLAGS.map(flag => (
              <div key={flag} className="flex items-start gap-2.5 p-3 rounded-lg border border-rose-400/20 bg-rose-500/5">
                <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{flag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl">
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="text-xl font-bold text-foreground mb-2">Do this on Sourcery</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Send RFQs to multiple factories, get comparable quotes, create structured POs with milestone payments, and document every step. Free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="gap-2">
                <Link to="/auth?mode=signup">Start free <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/marketplace">Browse factories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
