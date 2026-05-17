import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import {
  ArrowRight, CheckCircle, Shield, Package, MessageSquare,
  FileText, BarChart3, Sparkles, Search, Globe, Zap,
  TrendingUp, Star, Clock, AlertTriangle, Users, Lock,
  ShoppingBag, Award, Layers
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFactoryMembership } from "@/hooks/useFactoryMembership";

// ─── The three situations ─────────────────────────────────────────────────────
const SITUATIONS = [
  {
    icon: Search,
    label: "Don't have a factory yet",
    headline: "We'll find you one.",
    body: "Browse registered manufacturers with real performance scores — built from completed orders, never self-reported. AI factory matching from a plain-language brief. Compare quotes from multiple factories side by side. Your first structured order, fully guided.",
    features: [
      "Factory directory — registered manufacturers across Vietnam, Indonesia, Bangladesh, China",
      "AI factory matcher — describe what you need in plain language",
      "Multi-factory RFQ — one brief, multiple quotes, side-by-side comparison",
      "Factory OTIF scores — on-time/in-full rates from real completed orders",
      "Due diligence checklist — every question to ask before you commit",
    ],
    cta: "Browse factories",
    href: "/directory",
    color: "border-blue-400/30 bg-blue-500/5",
    iconColor: "text-blue-600",
    checkColor: "text-blue-500",
  },
  {
    icon: Shield,
    label: "Have one but not fully sure",
    headline: "We give you the tools to be certain.",
    body: "Factory verification badges, audit request system, performance scoring from verified order data. Know exactly who you're working with before another dollar leaves your account. The due diligence most brands skip — built into the platform.",
    features: [
      "Factory verification and certification checks",
      "Audit request system — formal audit documentation",
      "OTIF scoring — track their on-time/in-full performance",
      "Factory review system — documented quality history",
      "Dispute filing — formal mechanism with evidence trail if things go wrong",
    ],
    cta: "See how verification works",
    href: "/factories",
    color: "border-amber-400/30 bg-amber-500/5",
    iconColor: "text-amber-600",
    checkColor: "text-amber-500",
  },
  {
    icon: Zap,
    label: "Have one you trust",
    headline: "Invite them in 60 seconds.",
    body: "Bring Your Own Factory — full platform, full features, immediately. Structure every order with a guided PO. Protect every payment with milestone gates. Document everything automatically. Let the intelligence layer activate as your order history builds.",
    features: [
      "BYOF — invite your factory with one link, they join free",
      "Structured PO creation — guided, every decision explained",
      "Milestone-gated payments — deposit, sample gate, QC gate",
      "Production intelligence — countdown, health, safety stock",
      "Full documentation — specs, revisions, QC, permanently archived",
    ],
    cta: "Invite your factory",
    href: "/auth?mode=signup",
    color: "border-primary/30 bg-primary/5",
    iconColor: "text-primary",
    checkColor: "text-primary",
  },
];

// ─── Full platform lifecycle ──────────────────────────────────────────────────
const LIFECYCLE = [
  { n: "01", title: "Find", detail: "Marketplace + AI matching" },
  { n: "02", title: "Vet", detail: "Verification + audits + OTIF" },
  { n: "03", title: "Quote", detail: "RFQ + comparison + negotiation" },
  { n: "04", title: "Contract", detail: "Auto-generated production contracts" },
  { n: "05", title: "Order", detail: "Guided 4-step PO creation" },
  { n: "06", title: "Pay", detail: "Milestone-gated payment releases" },
  { n: "07", title: "Sample", detail: "Submit, review, approve, revise" },
  { n: "08", title: "Produce", detail: "SKUs, photos, timezone approvals" },
  { n: "09", title: "QC", detail: "Defect reports + AQL enforcement" },
  { n: "10", title: "Dispute", detail: "Formal filing with evidence trail" },
  { n: "11", title: "Ship", detail: "Carrier tracking + freight checklist" },
  { n: "12", title: "Comply", detail: "CSDDD, UFLPA, Modern Slavery Act" },
  { n: "13", title: "Reorder", detail: "Intelligence from real order history" },
];

// ─── What the guidance layer does ─────────────────────────────────────────────
const GUIDANCE = [
  {
    icon: AlertTriangle,
    title: "Before you choose a factory",
    body: "Here are the questions you need to ask. Here are the documents you need to see. Here's what the answers should look like — and what should concern you.",
  },
  {
    icon: FileText,
    title: "Before you issue a PO",
    body: "Is your tech pack complete enough? Have you agreed on AQL? Does your delivery window account for Tet? The platform catches what you're about to skip before you skip it.",
  },
  {
    icon: Clock,
    title: "During production",
    body: "Your in-line QC is overdue. At this factory's average pattern, here's what that means for your delivery window. Here's what to message them today. Here's what escalation looks like if they don't respond.",
  },
  {
    icon: Shield,
    title: "At QC and payment release",
    body: "You have 14 defects on 300 units — 4.6%. Your agreed AQL was 2.5%. Here are your three options, what each means for your relationship, and what most brands do in this situation.",
  },
];

// ─── Intelligence stats ───────────────────────────────────────────────────────
const INTEL_STATS = [
  { n: "$5K–$20K", l: "Average cost of one missed season", sub: "Clewa Growth: $399/year" },
  { n: "94%", l: "OTIF — HU LA Studios, HCMC", sub: "From 12 verified completed orders" },
  { n: "14.2wks", l: "Real avg lead time — verified", sub: "Not what the factory claims" },
  { n: "6 gates", l: "Auto-calculated from delivery date", sub: "Backward scheduling, no setup" },
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
        description="Clewa gives brands the thread to navigate overseas manufacturing. Find factories, run structured orders, protect every payment. The infrastructure the whole category was missing."
        canonical="/"
      />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-5">
                The thread through your manufacturing labyrinth
              </p>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground leading-[1.06] mb-6">
                Everything your factory<br className="hidden md:block" />
                relationship needs.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-4 max-w-2xl font-light">
                Finding the right manufacturer. Verifying them properly. Structuring every order. Protecting every payment. Documenting everything. Knowing what to do at every step.
              </p>
              <p className="text-xl text-foreground leading-relaxed mb-8 max-w-2xl font-medium">
                The infrastructure the whole category was missing — in one platform.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth?mode=signup">
                    Get started free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/how-it-works">See the full platform</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Free for your first order. No credit card. No time limit.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FULL LIFECYCLE STRIP ──────────────────────────────────────────── */}
      <section className="border-b border-border bg-card/40 overflow-x-auto">
        <div className="flex min-w-max">
          {LIFECYCLE.map((step, i) => (
            <div key={step.n} className="flex items-center">
              <div className="px-5 py-4 text-center">
                <p className="text-xs font-mono text-muted-foreground mb-0.5">{step.n}</p>
                <p className="text-sm font-semibold text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">{step.detail}</p>
              </div>
              {i < LIFECYCLE.length - 1 && (
                <div className="text-border text-sm px-1">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── THREE SITUATIONS ──────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              However you work with factories
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              We built the infrastructure<br className="hidden md:block" /> for every part of it.
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Don't have a factory. Have one you're not sure about. Have one you trust. Whatever your situation — Clewa handles it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {SITUATIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl border p-6 flex flex-col ${s.color}`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-background flex items-center justify-center mb-4 flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${s.iconColor}`} />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{s.label}</p>
                  <h3 className="text-xl font-bold text-foreground mb-3">{s.headline}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{s.body}</p>
                  <div className="space-y-2 mb-6">
                    {s.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <CheckCircle className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${s.checkColor}`} />
                        <span className="text-xs text-foreground leading-relaxed">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" size="sm" className="gap-1.5 w-full">
                    <Link to={s.href}>
                      {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── THE GUIDANCE LAYER ───────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
                Built-in guidance
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
                You'll never miss a step.<br />Or a beat.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Most brands learn production by making expensive mistakes. Clewa tells you what to do before you need to ask — the questions to raise, the steps in the right order, the decisions that matter and why.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                At every stage of every order, the platform surfaces the guidance an experienced sourcing director would give you. Not in a help article. Not in a FAQ. Right there, in context, when the decision is being made.
              </p>
              <Button asChild className="gap-2">
                <Link to="/how-it-works">
                  See how it works <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <div className="space-y-3">
              {GUIDANCE.map((g, i) => {
                const Icon = g.icon;
                return (
                  <motion.div
                    key={g.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-card border border-border rounded-xl p-4 flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">{g.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{g.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINANCIAL PROTECTION ─────────────────────────────────────────── */}
      <section className="section-padding border-b border-border bg-foreground text-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-background/50">
                Financial protection
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-5 leading-tight text-background">
                Your money never moves<br />without your approval.
              </h2>
              <p className="text-lg leading-relaxed text-background/70 mb-4">
                Every payment is milestone-gated. Sample approved before bulk starts. QC passed before final releases. Dispute filing if something goes wrong. Contract generation at PO stage.
              </p>
              <p className="text-base leading-relaxed text-background/60">
                Nothing moves without your confirmation — ever. The platform is built so that your factory has every incentive to do the job right, because nothing gets paid until they do.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Lock, title: "Milestone gates", body: "Deposit, sample gate, production, QC. Each locked behind a verified condition." },
                { icon: FileText, title: "Contract generation", body: "Auto-generate production contracts at PO stage. Terms tied to platform conditions." },
                { icon: AlertTriangle, title: "Dispute filing", body: "Formal disputes with evidence documentation. Final payment blocked until resolved." },
                { icon: BarChart3, title: "Payment tracking", body: "Full history per order. Every release timestamped and attributed permanently." },
              ].map(({ icon: Icon, title, body }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border border-background/10 rounded-xl p-4"
                >
                  <Icon className="h-4 w-4 text-background/60 mb-3" />
                  <p className="text-sm font-semibold text-background mb-1.5">{title}</p>
                  <p className="text-xs text-background/50 leading-relaxed">{body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTELLIGENCE STATS ───────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">The intelligence layer</p>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              The platform gets smarter<br className="hidden md:block" /> with every order.
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              OTIF scores. Lead time benchmarks. Safety stock calculations. Reorder intelligence. All built from your real order history — not industry averages.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTEL_STATS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-2xl p-5 text-center"
              >
                <p className="text-3xl font-bold text-foreground mb-1.5">{s.n}</p>
                <p className="text-xs font-semibold text-foreground mb-1">{s.l}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/intelligence" className="text-sm text-primary font-medium hover:underline">
              See the full intelligence layer →
            </Link>
          </div>
        </div>
      </section>

      {/* ── OKIO CASE STUDY ──────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border bg-card/40">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Live on Clewa</p>
                <h2 className="text-xl font-bold text-foreground">OKIO Denim runs every production run on Clewa.</h2>
              </div>
              <Link to="/case-studies" className="text-sm text-primary font-medium whitespace-nowrap hover:underline flex-shrink-0">
                Read the case study →
              </Link>
            </div>
            <div className="grid sm:grid-cols-4 gap-3">
              {[
                { l: "Factory", v: "HU LA Studios · HCMC" },
                { l: "Order size", v: "300–500 units" },
                { l: "Lead time", v: "14 weeks avg" },
                { l: "QC standard", v: "AQL 2.5" },
              ].map(({ l, v }) => (
                <div key={l} className="bg-background border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{l}</p>
                  <p className="text-sm font-semibold text-foreground">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRADE TOOLS ──────────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Free trade tools</p>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4 leading-tight">
                Know your real costs<br />before you commit.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Tariff comparison across five manufacturing countries. HTS code duty rates for 15 apparel categories. Margin calculator from landed cost to retail. FTA qualification guide. All free — no login required.
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/trade-tools">
                  Open trade tools <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Globe, title: "Tariff calculator", body: "Vietnam vs China — real dollar savings on your specific order" },
                { icon: Calculator, title: "Margin calculator", body: "Landed cost to retail with industry health benchmark" },
                { icon: FileText, title: "HTS code lookup", body: "15 apparel categories · US, UK, EU duty rates" },
                { icon: TrendingUp, title: "FTA guide", body: "CPTPP, EVFTA, VKFTA — who qualifies and what it saves" },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-card border border-border rounded-xl p-4">
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
        <div className="container max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Start where you are.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Whatever your factory situation — Clewa handles it. Free for your first order. The full platform available from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/auth?mode=signup">
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card. No time limit. Switch tiers anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
