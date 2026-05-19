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
    num: "01",
    label: "No factory yet",
    headline: "We'll find you one.",
    body: "Registered manufacturers with verified performance scores — built from real completed orders, never self-reported. AI matching from a plain-language brief. Your first order, fully guided.",
    features: [
      "Factory directory — Vietnam, Indonesia, Bangladesh, China",
      "AI factory matcher — describe it, we find it",
      "Multi-factory RFQ — one brief, multiple quotes",
      "Due diligence checklist — every question that matters",
    ],
    cta: "Browse factories",
    href: "/directory",
  },
  {
    icon: Shield,
    num: "02",
    label: "Have one, not sure",
    headline: "We give you the tools to be certain.",
    body: "Verification badges, audit requests, OTIF performance scoring from real transaction data. Know exactly who you're working with before another dollar leaves your account.",
    features: [
      "Factory verification and certification checks",
      "OTIF scores from real completed orders — never self-reported",
      "Formal audit request system",
      "Dispute filing with evidence trail",
    ],
    cta: "See verification tools",
    href: "/factories",
  },
  {
    icon: Zap,
    num: "03",
    label: "Have one you trust",
    headline: "Invite them in 60 seconds.",
    body: "BYOF — Bring Your Own Factory. One link. They join free. Full platform, full features, immediately. Structure every order and protect every payment from day one.",
    features: [
      "One invite link — they join free, full features immediately",
      "Guided PO creation — every decision explained",
      "Milestone-gated payments — deposit, sample gate, QC gate",
      "Intelligence activates from your first completed order",
    ],
    cta: "Start free",
    href: "/auth?mode=signup",
  },
];

// ─── How the guidance works ───────────────────────────────────────────────────
const GUIDANCE = [
  {
    icon: AlertTriangle,
    stage: "Before you choose a factory",
    text: "Here are the questions experienced buyers always ask. Here's what the answers should look like — and what should concern you.",
  },
  {
    icon: FileText,
    stage: "Before you issue the PO",
    text: "Is your tech pack complete? Have you agreed on AQL? Your delivery window falls near Tet — have you accounted for the shutdown?",
  },
  {
    icon: Clock,
    stage: "During production",
    text: "Your in-line QC is overdue. At this factory's pattern, here's what that means for your window. Here's the message to send today.",
  },
  {
    icon: Shield,
    stage: "At QC and payment release",
    text: "You have 14 defects on 300 units — 4.6%. Your AQL was 2.5%. Here are your three options and what each means for the relationship.",
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

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Labyrinth background texture */}
        <div className="absolute inset-0 labyrinth-bg-subtle pointer-events-none" />
        
        {/* Vertical thread line — left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-primary/30" />

        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Thread label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-10 bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Factory relationship infrastructure
                </span>
              </div>

              {/* Hero headline — DM Serif, mythology-first */}
              <h1 className="font-display text-5xl md:text-[3.5rem] text-foreground leading-[1.08] mb-7">
                You're in the labyrinth.<br />
                <span className="italic text-primary">Here's the thread.</span>
              </h1>

              {/* The mythology — brief, specific */}
              <div className="thread-border mb-8 max-w-2xl">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Ariadne gave Theseus the thread to navigate the Labyrinth. Without it, he enters a complex, 
                  opaque system and gets lost. Overseas manufacturing is the labyrinth. 
                  Clewa gives brands the thread.
                </p>
              </div>

              {/* The operational promise */}
              <p className="text-lg text-foreground leading-relaxed mb-8 max-w-2xl">
                Find factories. Verify them. Run structured orders. Protect every payment. Know what to do at every step — before you need to ask.
              </p>

              <div className="flex flex-wrap gap-3 mb-5">
                <Button asChild size="lg" className="gap-2 thread-glow">
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

      {/* ── COST STRIP ───────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-secondary/40">
        <div className="container">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 py-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-px w-5 bg-primary flex-shrink-0" />
              <span className="font-semibold text-foreground">$5K–$20K</span>
              <span className="text-muted-foreground">average cost of one missed season</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-px w-5 bg-primary flex-shrink-0" />
              <span className="font-semibold text-foreground">$399/year</span>
              <span className="text-muted-foreground">Clewa Growth — the full intelligence layer</span>
            </div>
            <Link to="/why-clewa" className="flex items-center gap-1.5 text-primary font-semibold hover:underline ml-auto">
              Full cost breakdown <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── THREE SITUATIONS ─────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                However you work with factories
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              We built the infrastructure<br className="hidden md:block" /> for every part of it.
            </h2>
            <p className="text-muted-foreground max-w-lg leading-relaxed">
              Three situations. One platform. Whatever yours is — Clewa handles it.
            </p>
          </motion.div>

          {/* Situations — table-like, not cards */}
          <div className="divide-y divide-border border-t border-border">
            {SITUATIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group grid md:grid-cols-[80px_1fr_1fr_200px] gap-6 items-start py-8 hover:bg-secondary/30 px-4 -mx-4 transition-colors"
                >
                  {/* Number with thread */}
                  <div className="flex items-center gap-3 pt-0.5">
                    <div className="w-px h-10 bg-primary/30 flex-shrink-0" />
                    <span className="text-3xl font-display text-primary/40 leading-none">{s.num}</span>
                  </div>

                  {/* Situation */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{s.label}</span>
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-2">{s.headline}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {s.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <div className="h-px w-4 bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-foreground leading-relaxed">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-start justify-end pt-1">
                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                      <Link to={s.href}>{s.cta} <ArrowRight className="h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── THE GUIDANCE LAYER ───────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">The guidance layer</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                The thread tells you<br />what to do next.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At every stage of every order, the platform surfaces what an experienced sourcing director would tell you — before you need to ask. Not in a help article. Not in a FAQ. Right there, in context, at the exact decision point.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Most brands learn production by making expensive mistakes. Clewa gives you the guidance that prevents them.
              </p>
            </motion.div>

            {/* Guidance moments — thread-connected list */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              {/* Vertical thread line connecting all stages */}
              <div className="absolute left-[11px] top-4 bottom-4 w-px bg-primary/20" />

              <div className="space-y-0 divide-y divide-border">
                {GUIDANCE.map((g, i) => {
                  const Icon = g.icon;
                  return (
                    <div key={g.stage} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                      {/* Thread dot */}
                      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                        <div className="w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center z-10">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{g.stage}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed italic">{g.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── PROTECTION — dark labyrinth section ─────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-foreground">
        <div className="absolute inset-0 labyrinth-bg pointer-events-none opacity-60" />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-thread-dark/40" />

        <div className="container relative py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-thread-dark" />
                <span className="text-xs font-semibold uppercase tracking-widest text-thread-dark">
                  Payment protection
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-stone-50 mb-4">
                Your money never moves<br />without your approval.
              </h2>
              <p className="leading-relaxed text-stone-400 mb-4">
                Every payment is milestone-gated. Sample approved before bulk starts. QC passes before final releases. Dispute filing if something goes wrong. Contract generation at PO stage.
              </p>
              <p className="leading-relaxed text-stone-400">
                Clewa does not hold your funds. You pay your factory directly. But the gate enforces the sequence — nothing releases until the condition is verified and you confirm.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Lock, title: "Milestone gates", body: "Deposit, sample approval, production, QC. Each locked behind a verified condition you confirm." },
                { icon: FileText, title: "Contract generation", body: "Auto-generated at PO stage. Specific to this order, this factory, these agreed terms." },
                { icon: AlertTriangle, title: "Dispute filing", body: "Formal disputes with evidence documentation. Final payment blocked until resolution." },
                { icon: BarChart3, title: "Payment history", body: "Every release timestamped, attributed, permanently logged. The complete payment trail." },
              ].map(({ icon: Icon, title, body }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="border border-stone-700 rounded p-4 bg-stone-900/50"
                >
                  <Icon className="h-4 w-4 text-thread-dark mb-3" />
                  <p className="text-sm font-semibold text-stone-200 mb-1.5">{title}</p>
                  <p className="text-xs text-stone-500 leading-relaxed">{body}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── INTELLIGENCE ─────────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">Intelligence layer</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground">
                The platform gets smarter<br className="hidden md:block" /> with every order.
              </h2>
            </div>
            <Link to="/intelligence" className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline flex-shrink-0">
              Open the intelligence workspace <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Stats — no cards, just ruled rows */}
          <div className="divide-y divide-border border-t border-b border-border">
            {[
              { n: "Week 4", l: "When you find out something is wrong", sub: "Not week 10, when it's too late to fix it." },
              { n: "94%", l: "OTIF — HU LA Studios, Ho Chi Minh City", sub: "From real production cycles. Not claimed. Calculated." },
              { n: "$399", l: "Growth tier, billed annually", sub: "vs $10,000–$30,000/year for a human sourcing agent doing the same job." },
              { n: "6 gates", l: "Auto-calculated from your delivery date", sub: "Backward scheduling. Nike's method. Yours for $49/month." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid md:grid-cols-[120px_1fr_auto] gap-4 items-center py-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-px h-8 bg-primary flex-shrink-0" />
                  <span className="font-display text-2xl text-primary">{s.n}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.l}</p>
                  <p className="text-sm text-muted-foreground">{s.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── TRADE TOOLS ──────────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border bg-secondary/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">Free trade tools</span>
              </div>
              <h2 className="font-display text-3xl text-foreground mb-4">
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
                <div key={title} className="border border-border rounded p-4 bg-card">
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
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-primary" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Start where you are.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Whatever your factory situation — Clewa handles it. Free for your first order. The full platform available from day one. The thread is here whenever you need it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 thread-glow">
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
