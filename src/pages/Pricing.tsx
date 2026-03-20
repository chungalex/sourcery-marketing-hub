import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, Check, X, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free first order",
    price: { monthly: null, annual: null, label: "Free" },
    description: "Try the full infrastructure on one real order. No credit card, no commitment. Your order record lives on the platform permanently.",
    cta: "Start free",
    ctaLink: "/auth?mode=signup",
    highlight: false,
    features: [
      { text: "1 order — full OS", included: true },
      { text: "Structured PO creation with guided incoterms + AQL", included: true },
      { text: "Sampling gate, revision rounds, tech pack versioning", included: true },
      { text: "QC documentation + defect reports", included: true },
      { text: "Milestone-gated payment tracking", included: true },
      { text: "On-platform messaging", included: true },
      { text: "Permanent order record — forever", included: true },
      { text: "Email notifications", included: true },
      { text: "AI tools", included: false },
      { text: "Message translation", included: false },
      { text: "Marketplace access", included: false },
      { text: "Document export (PDF audit trail)", included: false },
    ],
  },
  {
    name: "One-off",
    price: { monthly: null, annual: null, label: "$79 per order" },
    description: "For brands who produce once or twice a year. Pay per order, full platform including AI tools, no subscription required.",
    cta: "Pay per order",
    ctaLink: "/auth?mode=signup&plan=oneoff",
    highlight: false,
    features: [
      { text: "1 order — full OS", included: true },
      { text: "Structured PO creation with guided incoterms + AQL", included: true },
      { text: "Sampling gate, revision rounds, tech pack versioning", included: true },
      { text: "QC documentation + defect reports", included: true },
      { text: "Milestone-gated payment tracking", included: true },
      { text: "On-platform messaging", included: true },
      { text: "Permanent order record — forever", included: true },
      { text: "Email notifications", included: true },
      { text: "AI dispute summary + paper trail", included: true },
      { text: "Message translation EN/VN/CN", included: true },
      { text: "Document export (PDF audit trail)", included: true },
      { text: "Marketplace access", included: false },
    ],
  },
  {
    name: "Builder",
    price: { monthly: 49, annual: 399, label: "" },
    description: "For brands actively managing production. Full marketplace access, AI tools, and infrastructure for every order.",
    cta: "Start free trial",
    ctaLink: "/auth?mode=signup&plan=builder",
    highlight: true,
    badge: "Most popular",
    features: [
      { text: "5 active orders simultaneously", included: true },
      { text: "Full OS on every order", included: true },
      { text: "Permanent order records — forever", included: true },
      { text: "Full marketplace access — browse, contact, request quotes", included: true },
      { text: "AI factory matcher — 10 searches/month", included: true },
      { text: "Tech pack reviewer", included: true, coming: true },
      { text: "RFQ generator", included: true, coming: true },
      { text: "Quote analyzer", included: true, coming: true },
      { text: "Order chat summaries", included: true },
      { text: "Message translation EN/VN/CN", included: true },
      { text: "Dispute filing through platform", included: true },
      { text: "Supplier contact book", included: true },
      { text: "Document export (PDF audit trail)", included: true },
      { text: "Email notifications", included: true },
      { text: "1 seat", included: true },
    ],
  },
  {
    name: "Pro",
    price: { monthly: 99, annual: 899, label: "" },
    description: "For brands running serious operations — multiple orders, multiple factories, full team access, and proactive intelligence.",
    cta: "Get started",
    ctaLink: "/auth?mode=signup&plan=pro",
    highlight: false,
    features: [
      { text: "Everything in Builder", included: true },
      { text: "Unlimited active orders", included: true },
      { text: "AI factory matcher — unlimited", included: true },
      { text: "Production calendar — visual order timeline", included: true },
      { text: "Spec library — save + reuse product specs", included: true },
      { text: "Order templates — save full order setups", included: true },
      { text: "Factory health alerts — proactive decline notifications", included: true },
      { text: "Reorder intelligence — AI flags issues from last order", included: true },
      { text: "Analytics dashboard — spend, QC rates, lead times", included: true },
      { text: "3 team seats", included: true },
    ],
  },
];

const referralProgram = [
  {
    who: "Brand refers brand",
    reward: "Both get 1 month free on their current plan.",
  },
  {
    who: "Brand refers factory",
    reward: "Brand gets 2 months free. Factory gets boosted marketplace placement for 60 days.",
  },
  {
    who: "Factory refers brand",
    reward: "Factory gets priority placement in search + AI matching for 60 days. Brand gets 1 month free.",
  },
];

const faqs = [
  {
    q: "What happens to my orders if I stop subscribing?",
    a: "Every order you've created on the platform stays accessible permanently. You can view, export, and reference any order record regardless of your current plan. You just can't create new orders without an active plan.",
  },
  {
    q: "Can I upgrade from one-off to Builder mid-order?",
    a: "Yes. Upgrade at any time and your existing orders carry over. You don't lose anything.",
  },
  {
    q: "What does 'marketplace browse' look like on the free plan?",
    a: "Free accounts can see factory capabilities, categories, certifications, MOQ, lead times, and performance scores — but factory names and contact details are hidden. You can confirm a factory is the right fit before upgrading to contact them.",
  },
  {
    q: "Does Sourcery take a cut of my production payments?",
    a: "No. Sourcery charges a subscription fee only. Payments move directly between you and your factory. Sourcery enforces the milestone gate conditions and documents every stage — you control every payment release.",
  },
  {
    q: "What does 'permanent order record' mean?",
    a: "Every order you create on Sourcery — every spec, revision, message, defect report, and milestone — is stored permanently. Even after your subscription ends. If you need that record for a dispute, a reorder, or due diligence six months later, it's there.",
  },
  {
    q: "What is the founding member offer?",
    a: "The first 5 brands to subscribe to Builder are locked in at $299/year forever — regardless of future price increases. Once those 5 spots are gone, the standard price of $399/year applies.",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <Layout>
      <SEO
        title="Pricing — Sourcery"
        description="Start free. One order, full infrastructure, no commitment. Upgrade when you're ready."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Start free. Scale when you're ready.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-4 max-w-2xl mx-auto">
              Your first order is free — full infrastructure, no credit card, no time limit. If Sourcery works for you, upgrading is obvious. If it doesn't, you've lost nothing.
            </p>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              One bad production order costs $2,000–15,000. The Why Sourcery page shows the math. Builder costs $399/year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founding member banner */}
      <section className="bg-primary/5 border-y border-primary/20 py-4">
        <div className="container-tight">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Star className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Founding member offer — 5 spots only</p>
                <p className="text-xs text-muted-foreground">First 5 brands to subscribe to Builder get $299/year locked forever. Standard price is $399/year.</p>
              </div>
            </div>
            <Link to="/auth?mode=signup&plan=builder&founding=true">
              <Button size="sm" variant="outline" className="flex-shrink-0">
                Claim your spot
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Billing toggle */}
      <section className="pt-12 pb-4">
        <div className="container-tight flex justify-center">
          <div className="flex items-center gap-3 p-1 rounded-xl bg-secondary border border-border">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                !annual ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                annual ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
              <span className="text-xs bg-primary/15 text-primary px-1.5 py-0.5 rounded-md font-medium">Save 30%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="pb-16">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn(
                  "rounded-2xl border p-6 flex flex-col",
                  tier.highlight
                    ? "border-primary bg-primary/3 shadow-md"
                    : "border-border bg-card"
                )}
              >
                {tier.badge && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-3 w-fit">
                    <Zap className="h-3 w-3" />
                    {tier.badge}
                  </div>
                )}

                <h2 className="font-heading text-lg font-bold text-foreground mb-1">{tier.name}</h2>

                <div className="mb-3">
                  {tier.price.monthly ? (
                    <div>
                      <span className="text-3xl font-bold text-foreground">
                        ${annual ? Math.round(tier.price.annual! / 12) : tier.price.monthly}
                      </span>
                      <span className="text-muted-foreground text-sm">/month</span>
                      {annual && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Billed ${tier.price.annual}/year
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-foreground">{tier.price.label}</span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-shrink-0 min-h-[60px]">
                  {tier.description}
                </p>

                <Link to={tier.ctaLink} className="mb-6">
                  <Button
                    className="w-full"
                    variant={tier.highlight ? "default" : "outline"}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>

                <div className="space-y-2.5 flex-1">
                  {tier.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2.5">
                      {f.included ? (
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={cn(
                        "text-xs leading-relaxed",
                        f.included ? "text-foreground" : "text-muted-foreground/50"
                      )}>
                        {f.text}
                        {f.coming && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/20">
                            coming
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Factory pricing */}
      <section className="section-padding border-y border-border bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wide mb-3">For factories</p>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                Free to join. Free forever.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sourcery charges brands, not factories. There are no fees to join the network, receive orders, or complete production cycles on the platform. Factory listing, profile, and order management are all free.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Featured placement and priority AI matching for factories — coming later as the network grows.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-background border border-border space-y-3">
              {[
                "Join the network — free",
                "Complete factory profile — free",
                "Receive and manage orders — free",
                "Sample submission + revision rounds — free",
                "Performance score tracking — free",
                "On-platform messaging — free",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Referral program */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Referral program</h2>
            <p className="text-muted-foreground mb-8 max-w-lg">
              Grow the network, get rewarded. Every referral that results in a subscription or a new factory joining earns you time or placement.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {referralProgram.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="p-5 rounded-xl bg-card border border-border"
                >
                  <p className="text-sm font-semibold text-foreground mb-2">{item.who}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.reward}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">Common questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border pb-6 last:border-0">
                  <p className="font-semibold text-foreground mb-2">{faq.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Your first order is free.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Full infrastructure, no credit card, no time limit. Try it on a real order and see if the platform delivers.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">
                  Get started free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/why-sourcery">
                <Button variant="hero-outline" size="xl">
                  See the cost math
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 border-t border-border">
        <div className="container-tight">
          <p className="text-xs text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
            Sourcery is a production management platform. It does not hold, process, or custody funds. Payments are made directly between brands and factories. Sourcery enforces milestone gate conditions and documents every stage — the brand controls every payment release.
          </p>
        </div>
      </section>
    </Layout>
  );
}
