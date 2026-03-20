import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What happens to my orders if I stop subscribing?",
    a: "Every order record stays accessible permanently — specs, revisions, messages, defect reports, milestones. You can view and export any order regardless of your current plan. You just can't create new orders without an active plan.",
  },
  {
    q: "What does the free marketplace look like?",
    a: "Free accounts see factory capabilities, categories, certifications, MOQ, lead times, and performance scores. Factory names and contact details are visible only on Builder and above — so you can confirm a factory is the right fit before upgrading.",
  },
  {
    q: "Does Sourcery take a percentage of my production payments?",
    a: "No. Sourcery charges a flat subscription fee. Payments move directly between you and your factory. Sourcery enforces milestone gate conditions and builds the paper trail — you control every payment release.",
  },
  {
    q: "Can I upgrade from one-off to Builder mid-order?",
    a: "Yes. Upgrade at any time and your existing orders carry over completely.",
  },
  {
    q: "What is the founding member offer?",
    a: "The first 5 brands to subscribe to Builder are locked in at $299/year forever. Once those 5 spots are filled, the standard rate of $399/year applies permanently.",
  },
  {
    q: "How does the referral program work?",
    a: "Refer a brand — both get 1 month free. Refer a factory to the network — you get 2 months free and the factory gets 60-day priority placement in search and AI matching.",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <Layout>
      <SEO
        title="Pricing — Sourcery"
        description="Your first order is free. Full infrastructure, no credit card, no time limit."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5">
              Your first order is free.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Full platform, full infrastructure, no credit card required. Try it on a real order. If it works for you, upgrading is straightforward. If it doesn't, you've lost nothing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founding member */}
      <div className="bg-primary/5 border-y border-primary/20 py-3.5">
        <div className="container-tight flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <Star className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">Founding member — 5 spots only.</span>
              {" "}First 5 brands on Builder are locked at $299/year forever. Standard rate is $399/year.
            </p>
          </div>
          <Link to="/auth?mode=signup&plan=builder&founding=true">
            <Button size="sm" variant="outline" className="flex-shrink-0 text-xs">
              Claim your spot <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Billing toggle */}
      <div className="pt-12 pb-2 flex justify-center">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary border border-border">
          <button
            onClick={() => setAnnual(false)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-medium transition-colors",
              !annual ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
              annual ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annual
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md">−30%</span>
          </button>
        </div>
      </div>

      {/* Three main tiers */}
      <section className="pt-6 pb-16">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">

            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-7 flex flex-col"
            >
              <div className="mb-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Free</p>
                <div className="text-4xl font-bold text-foreground mb-1">$0</div>
                <p className="text-sm text-muted-foreground">First order, no time limit</p>
              </div>
              <Link to="/auth?mode=signup" className="mb-7">
                <Button variant="outline" className="w-full">Get started free</Button>
              </Link>
              <div className="space-y-3 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Includes</p>
                {[
                  "1 order — full production OS",
                  "Structured PO, sampling, revisions, QC",
                  "Milestone-gated payment tracking",
                  "On-platform messaging",
                  "Permanent order record",
                  "Marketplace browse — capabilities visible, names hidden",
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-snug">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Builder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
              className="rounded-2xl border-2 border-primary bg-primary/3 p-7 flex flex-col shadow-sm"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-primary uppercase tracking-wide">Builder</p>
                  <span className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-medium">Most popular</span>
                </div>
                <div className="flex items-end gap-1.5 mb-1">
                  <div className="text-4xl font-bold text-foreground">
                    ${annual ? "399" : "49"}
                  </div>
                  <div className="text-muted-foreground text-sm pb-1.5">
                    {annual ? "/year" : "/month"}
                  </div>
                </div>
                {annual && (
                  <p className="text-xs text-muted-foreground">$33/month billed annually</p>
                )}
                {!annual && (
                  <p className="text-xs text-muted-foreground">$588/year — save $189 with annual</p>
                )}
              </div>
              <Link to="/auth?mode=signup&plan=builder" className="mb-7">
                <Button className="w-full">Start free trial <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
              </Link>
              <div className="space-y-3 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Everything in Free, plus</p>
                {[
                  { text: "5 active orders simultaneously", coming: false },
                  { text: "Full marketplace — contact factories, request quotes", coming: false },
                  { text: "AI factory matcher — 10 searches/month", coming: false },
                  { text: "Message translation — EN, VN, CN", coming: false },
                  { text: "Order chat summaries", coming: false },
                  { text: "Dispute filing through platform", coming: false },
                  { text: "Document export — full PDF audit trail", coming: false },
                  { text: "Supplier contact book", coming: false },
                  { text: "Tech pack reviewer", coming: true },
                  { text: "RFQ generator", coming: true },
                  { text: "Quote analyzer", coming: true },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-snug">
                      {f.text}
                      {f.coming && (
                        <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/20 font-medium">
                          coming
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
              className="rounded-2xl border border-border bg-card p-7 flex flex-col"
            >
              <div className="mb-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Pro</p>
                <div className="flex items-end gap-1.5 mb-1">
                  <div className="text-4xl font-bold text-foreground">
                    ${annual ? "899" : "99"}
                  </div>
                  <div className="text-muted-foreground text-sm pb-1.5">
                    {annual ? "/year" : "/month"}
                  </div>
                </div>
                {annual && (
                  <p className="text-xs text-muted-foreground">$75/month billed annually</p>
                )}
                {!annual && (
                  <p className="text-xs text-muted-foreground">$1,188/year — save $289 with annual</p>
                )}
              </div>
              <Link to="/auth?mode=signup&plan=pro" className="mb-7">
                <Button variant="outline" className="w-full">Get started <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
              </Link>
              <div className="space-y-3 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Everything in Builder, plus</p>
                {[
                  "Unlimited active orders",
                  "AI factory matcher — unlimited",
                  "Production calendar — visual order timeline",
                  "Spec library — reusable product specs",
                  "Order templates",
                  "Factory health alerts",
                  "Reorder intelligence",
                  "Analytics dashboard",
                  "3 team seats",
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-snug">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* One-off callout */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mt-5 p-5 rounded-xl border border-border bg-card/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">
                One-off — $79 per order
              </p>
              <p className="text-sm text-muted-foreground">
                No subscription. Full OS, all AI tools, message translation, permanent order record. For brands who produce once or twice a year.
              </p>
            </div>
            <Link to="/auth?mode=signup&plan=oneoff" className="flex-shrink-0">
              <Button variant="outline" size="sm">Pay per order</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value line */}
      <section className="py-8 border-y border-border bg-card/40">
        <div className="container-tight text-center">
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
            One unstructured production order costs $2,000–15,000 in rework, disputed specs, or post-payment defects.
            Builder costs $399/year. <Link to="/why-sourcery" className="text-foreground underline underline-offset-2">See the full cost breakdown →</Link>
          </p>
        </div>
      </section>

      {/* For factories */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wide mb-3">For factories</p>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Free to join. Free forever.</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Sourcery charges brands, not factories. Joining the network, receiving orders, managing production, and building your performance record are all free.
              </p>
              <p className="text-sm text-muted-foreground">
                Featured placement and priority AI matching — coming as the network grows.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "Join the network",
                "Complete factory profile",
                "Receive and manage orders",
                "Sample submission + revision rounds",
                "Performance score tracking",
                "On-platform messaging",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-card border border-border">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                  <span className="ml-auto text-xs text-primary font-medium">Free</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Referral */}
      <section className="section-padding bg-card/50 border-y border-border">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Referral program</h2>
            <p className="text-muted-foreground mb-8">Grow the network. Get rewarded with free time or marketplace placement.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { who: "Brand refers brand", reward: "Both get 1 month free on their current plan." },
                { who: "Brand refers factory", reward: "Brand gets 2 months free. Factory gets priority marketplace placement for 60 days." },
                { who: "Factory refers brand", reward: "Factory gets 60-day priority placement in search and AI matching. Brand gets 1 month free." },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-background border border-border">
                  <p className="text-sm font-semibold text-foreground mb-2">{item.who}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.reward}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">Common questions</h2>
            <div className="space-y-0 divide-y divide-border">
              {faqs.map((faq, i) => (
                <div key={i} className="py-5">
                  <p className="font-semibold text-foreground mb-2 text-sm">{faq.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50 border-t border-border">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Start with your first order — free.</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              No credit card. No time limit. Full infrastructure from day one.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">
                  Get started free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/why-sourcery">
                <Button variant="hero-outline" size="xl">See the cost math</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="py-6 border-t border-border">
        <div className="container-tight">
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            Sourcery is a production management platform. It does not hold, process, or custody funds. Payments are made directly between brands and factories. Sourcery enforces milestone gate conditions and documents every stage — the brand controls every payment release.
          </p>
        </div>
      </div>
    </Layout>
  );
}
