import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { useFactoryMembership } from "@/hooks/useFactoryMembership";
import { useEffect } from "react";
import {
  ArrowRight, CheckCircle, Shield, Search, Zap,
  Lock, FileText, AlertTriangle, BarChart3, Clock,
  Globe, TrendingUp
} from "lucide-react";

// ─── Three situations ─────────────────────────────────────────────────────────
const SITUATIONS = [
  {
    icon: Search,
    label: "Don't have a factory yet",
    headline: "We'll find you one.",
    body: "Registered manufacturers with verified performance scores — built from real completed orders, never self-reported. AI matching from a plain-language brief. Every step of finding, vetting, and running your first order is guided.",
    features: [
      "Factory directory — registered manufacturers across Vietnam, Indonesia, Bangladesh",
      "AI factory matcher — describe what you need in plain language",
      "Multi-factory RFQ — one brief, multiple quotes, side-by-side",
      "Due diligence checklist — every question to ask before you commit",
    ],
    cta: "Browse factories",
    href: "/directory",
    accent: "bg-blue-500/8 border-blue-400/25",
    check: "text-blue-500",
  },
  {
    icon: Shield,
    label: "Have one but not fully sure",
    headline: "We give you the tools to be certain.",
    body: "Factory verification, audit requests, OTIF scoring from real order data. Know exactly who you're working with before another dollar changes hands. The due diligence most brands skip — structured into the platform.",
    features: [
      "Factory verification and certification checks",
      "OTIF scoring from real completed orders — never self-reported",
      "Audit request system — formal documentation",
      "Dispute filing — formal mechanism with evidence trail",
    ],
    cta: "See how verification works",
    href: "/factories",
    accent: "bg-amber-500/8 border-amber-400/25",
    check: "text-amber-500",
  },
  {
    icon: Zap,
    label: "Have one you trust",
    headline: "Invite them in 60 seconds.",
    body: "BYOF — Bring Your Own Factory. Full platform, full features, immediately. One link. They join free. Structure every order, protect every payment, document everything automatically.",
    features: [
      "One invite link — factory joins free, full features immediately",
      "Guided PO creation — every field explained, every decision contextualised",
      "Milestone-gated payments — deposit, sample gate, QC gate",
      "Intelligence activates from your first completed order",
    ],
    cta: "Start free",
    href: "/auth?mode=signup",
    accent: "bg-primary/8 border-primary/25",
    check: "text-primary",
  },
];

// ─── Guidance moments ─────────────────────────────────────────────────────────
const MOMENTS = [
  {
    icon: AlertTriangle,
    when: "Before you choose a factory",
    what: "Here are the questions experienced buyers always ask. Here's what the answers should look like — and what should concern you.",
  },
  {
    icon: FileText,
    when: "Before you issue the PO",
    what: "Is your tech pack complete? Have you set your AQL standard? Your delivery window falls near Tet — have you accounted for the shutdown?",
  },
  {
    icon: Clock,
    when: "During production",
    what: "Your in-line QC is overdue. At this factory's pattern, here's what that means for your delivery window. Here's what to message them today.",
  },
  {
    icon: Shield,
    when: "At QC and payment release",
    what: "You have 14 defects on 300 units — 4.6%. Your agreed AQL was 2.5%. Here are your three options, what each means for the relationship, and what most brands do.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const { isFactoryMember } = useFactoryMembership();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (isFactoryMember) navigate("/dashboard/factory");
      else navigate("/dashboard");
    }
  }, [user, isFactoryMember]);

  return (
    <Layout>
      <SEO
        title="Clewa — The thread through your manufacturing labyrinth"
        description="Factory relationship infrastructure for physical product brands. Find factories, run structured orders, protect every payment. The infrastructure the whole category was missing."
        canonical="/"
      />

      {/* ── HERO — mythology first ──────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Thread motif */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Factory relationship infrastructure
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-[3.75rem] font-normal text-foreground leading-[1.08] tracking-tight mb-7">
                You're in the labyrinth.<br className="hidden md:block" />
                Here's the thread.
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-3 max-w-2xl">
                Overseas manufacturing is complex, opaque, and full of invisible risks. Most brands find out something is wrong in week 10. Clewa tells you in week 4 — and structures every order so you have leverage when it matters.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-8 max-w-2xl font-medium">
                Find factories. Verify them. Run structured orders. Protect every payment. Know what to do at every step.
              </p>

              <div className="flex flex-wrap gap-3 mb-5">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth?mode=signup">
                    Start free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/how-it-works">See how it works</Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Free for your first order. No credit card. No time limit.
              </p>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ROI STRIP ────────────────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-primary flex-shrink-0" />
              <span className="text-sm text-foreground font-semibold">$5K–$20K</span>
              <span className="text-sm text-muted-foreground">average cost of one missed season</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-primary flex-shrink-0" />
              <span className="text-sm text-foreground font-semibold">$399/year</span>
              <span className="text-sm text-muted-foreground">Clewa Growth, annually</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-border" />
            <Link to="/why-clewa" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              See the full cost breakdown <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── THREE SITUATIONS ─────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                However you work with factories
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-3 leading-snug">
              We built the infrastructure<br className="hidden md:block" /> for every part of it.
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              Don't have a factory. Have one you're not sure about. Have one you trust. Whatever your situation — Clewa handles it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {SITUATIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`rounded-2xl border p-6 flex flex-col ${s.accent}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                      <Icon className={`h-4 w-4 ${s.check}`} />
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{s.label}</p>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{s.headline}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{s.body}</p>
                  <div className="space-y-2 mb-5">
                    {s.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <CheckCircle className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${s.check}`} />
                        <span className="text-xs text-foreground leading-relaxed">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" size="sm" className="gap-1.5 w-full">
                    <Link to={s.href}>{s.cta} <ArrowRight className="h-3.5 w-3.5" /></Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GUIDANCE + PROTECTION (combined) ─────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            {/* Guidance */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">Built-in guidance</span>
              </div>
              <h2 className="font-display text-3xl font-normal text-foreground mb-4 leading-snug">
                You'll never miss a step.<br />Or a beat.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At every stage of every order the platform tells you what to do before you need to ask. The questions to raise, the steps in the right order, the decisions that matter and why.
              </p>
              <div className="space-y-3">
                {MOMENTS.map(m => {
                  const Icon = m.icon;
                  return (
                    <div key={m.when} className="flex gap-3 py-3 border-b border-border last:border-0">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{m.when}</p>
                        <p className="text-sm text-foreground leading-relaxed">{m.what}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Protection */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">Payment protection</span>
              </div>
              <h2 className="font-display text-3xl font-normal text-foreground mb-4 leading-snug">
                Your money never moves<br />without your approval.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every payment is milestone-gated. Sample approved before bulk starts. QC passes before final releases. Nothing moves without your confirmation — ever.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Lock, title: "Milestone gates", body: "Deposit, sample, QC. Each locked behind a verified condition." },
                  { icon: FileText, title: "Contract generation", body: "Auto-generated at PO stage. Tied to platform-documented terms." },
                  { icon: AlertTriangle, title: "Dispute filing", body: "Formal mechanism with evidence trail. Final payment blocked." },
                  { icon: BarChart3, title: "Payment tracking", body: "Every release timestamped and attributed. Permanent record." },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="border border-border rounded-xl p-4 bg-card">
                    <Icon className="h-4 w-4 text-primary mb-3" />
                    <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── INTELLIGENCE ─────────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border bg-foreground text-background">
        <div className="container">
          <div className="max-w-2xl mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-background/30" />
              <span className="text-xs font-semibold text-background/50 uppercase tracking-widest">Intelligence layer</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-background mb-3 leading-snug">
              The platform gets smarter<br className="hidden md:block" /> with every order.
            </h2>
            <p className="text-background/60 leading-relaxed">
              OTIF scores. Lead time benchmarks. Safety stock calculations. Reorder intelligence. All built from your real order history — not industry averages. Not guesses.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { n: "Week 4", l: "When you find out", sub: "Not week 10 when it's too late to fix" },
              { n: "94%", l: "OTIF — HU LA Studios", sub: "From real production cycles in HCMC" },
              { n: "$399", l: "Growth tier, per year", sub: "vs $10K–$30K for a sourcing agent" },
              { n: "6 gates", l: "Auto-calculated", sub: "Backward from your delivery date" },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="border border-background/10 rounded-xl p-5"
              >
                <p className="text-3xl font-bold text-background mb-1">{s.n}</p>
                <p className="text-xs font-semibold text-background mb-1">{s.l}</p>
                <p className="text-xs text-background/50 leading-relaxed">{s.sub}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/intelligence" className="text-sm text-background/60 hover:text-background flex items-center gap-1.5 w-fit">
              Open the intelligence workspace <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRADE TOOLS ──────────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">Free trade tools</span>
              </div>
              <h2 className="font-display text-3xl font-normal text-foreground mb-4 leading-snug">
                Know your real costs<br />before you commit.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Tariff comparison across five manufacturing countries. HTS duty rates for 15 apparel categories. Margin calculator from landed cost to retail. FTA qualification guide. All free — no account needed.
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/trade-tools">Open trade tools <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </motion.div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Globe, title: "Tariff calculator", body: "Vietnam vs China — real dollar savings on your specific order" },
                { icon: TrendingUp, title: "Margin calculator", body: "Landed cost to retail with industry health benchmark" },
                { icon: FileText, title: "HTS code lookup", body: "15 apparel categories · US, UK, EU duty rates" },
                { icon: BarChart3, title: "FTA guide", body: "CPTPP, EVFTA, VKFTA — who qualifies and what it saves" },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="border border-border rounded-xl p-4 bg-card">
                  <Icon className="h-4 w-4 text-primary mb-3" />
                  <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-4 leading-snug">
              Start where you are.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whatever your factory situation — Clewa handles it. Free for your first order. The full platform available from day one.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/auth?mode=signup">Get started free <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">No credit card. No time limit. Switch tiers anytime.</p>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
}
