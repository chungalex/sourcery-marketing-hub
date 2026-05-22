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
  Globe, TrendingUp, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const SITUATIONS = [
  {
    icon: Search,
    num: "01",
    tag: "No factory yet",
    headline: "We'll find you one.",
    body: "Registered manufacturers with OTIF scores from real completed orders. AI matching from a plain-language brief. Every question answered before you commit.",
    features: ["Factory directory — Vietnam, Indonesia, Bangladesh", "AI factory matcher", "Multi-factory RFQ", "Due diligence checklist"],
    href: "/directory",
    cta: "Browse factories",
  },
  {
    icon: Shield,
    num: "02",
    tag: "Have one, not sure",
    headline: "We give you certainty.",
    body: "Verification, audit requests, OTIF scoring from real transaction data. Know exactly who you're working with. Before another dollar leaves.",
    features: ["Factory verification", "OTIF from real orders — never claimed", "Audit request system", "Dispute filing"],
    href: "/factories",
    cta: "See verification",
  },
  {
    icon: Zap,
    num: "03",
    tag: "Have one you trust",
    headline: "Invite them in 60 seconds.",
    body: "BYOF — Bring Your Own Factory. One link. They join free. Structure every order, protect every payment, document everything from day one.",
    features: ["One invite link — full features immediately", "Guided PO creation", "Milestone-gated payments", "Intelligence from your first order"],
    href: "/auth?mode=signup",
    cta: "Start free",
  },
];

const GUIDANCE_MOMENTS = [
  { icon: Search,       stage: "Choosing a factory",   copy: "The questions experienced buyers always ask. What the answers mean. What to watch for." },
  { icon: FileText,     stage: "Issuing the PO",        copy: "Is your tech pack complete? AQL set? Delivery falls near Tet — production shutdown accounted for?" },
  { icon: Clock,        stage: "During production",     copy: "QC is overdue. Based on this factory's pattern, here's what that means for your window — and the message to send." },
  { icon: AlertTriangle,stage: "At QC + payment",       copy: "14 defects on 300 units. Your AQL was 2.5. Here are your three options and what each means." },
];

const STATS = [
  { value: "Week 4",  label: "When you find out",        sub: "Not week 10 — when it's too late" },
  { value: "94%",     label: "OTIF — HU LA Studios",     sub: "From real cycles. Not claimed." },
  { value: "$399",    label: "Growth, per year",          sub: "vs $10–30K for a sourcing agent" },
  { value: "3 gates", label: "Deposit · Sample · QC",     sub: "Nothing moves without your confirm" },
];

export default function Home() {
  const { user } = useAuth();
  const { isFactoryMember } = useFactoryMembership();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(isFactoryMember ? "/dashboard/factory" : "/dashboard");
    }
  }, [user, isFactoryMember]);

  return (
    <Layout>
      <SEO
        title="Clewa — Factory relationship infrastructure"
        description="Find factories. Verify them. Run structured orders. Protect every payment. The professional infrastructure for your factory relationship."
        canonical="/"
      />

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container-wide">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Eyebrow */}
              <div className="label-with-thread mb-6">
                Factory relationship infrastructure
              </div>

              {/* H1 */}
              <h1 className="text-[2.625rem] md:text-[3.25rem] font-bold tracking-[-0.04em] leading-[1.04] text-foreground mb-5">
                Run your factory relationship<br className="hidden md:block" />
                like a business.
              </h1>

              {/* Sub */}
              <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[28rem] mb-8">
                Find manufacturers. Verify them. Structure every order with milestone payments, documented specs, and built-in guidance at every step.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3 flex-wrap mb-5">
                <Button asChild size="xl">
                  <Link to="/auth?mode=signup">
                    Get started free <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="/how-it-works">See how it works</Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Free for your first order. No credit card required.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PROOF BAR ─────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-secondary/40">
        <div className="container">
          <div className="flex items-center gap-8 py-3 overflow-x-auto scrollbar-none text-xs text-muted-foreground whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <div className="h-px w-4 bg-primary flex-shrink-0" />
              <span><strong className="text-foreground font-semibold">$5K–$20K</strong> avg cost of a missed season</span>
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1.5">
              <div className="h-px w-4 bg-primary flex-shrink-0" />
              <span>Clewa Growth — <strong className="text-foreground font-semibold">$399/year</strong></span>
            </span>
            <span className="text-border">·</span>
            <Link to="/why-clewa" className="flex items-center gap-1 text-primary font-medium hover:underline ml-auto flex-shrink-0">
              Full comparison <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── THREE SITUATIONS ──────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="label-with-thread mb-3">Three situations. One platform.</div>
            <h2 className="text-[1.875rem] md:text-[2.25rem] font-bold tracking-[-0.03em] leading-[1.1] text-foreground">
              Whatever your factory situation —<br className="hidden md:block" />
              Clewa handles it.
            </h2>
          </motion.div>

          {/* Situations as clean bordered rows */}
          <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
            {SITUATIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="grid md:grid-cols-[1fr_1fr_160px] gap-0 bg-card hover:bg-secondary/20 transition-colors"
                >
                  {/* Left */}
                  <div className="p-6 md:border-r border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.06em]">{s.num}</span>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.06em]">{s.tag}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2 tracking-[-0.01em]">{s.headline}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>

                  {/* Features */}
                  <div className="p-6 md:border-r border-border">
                    <ul className="space-y-2">
                      {s.features.map(f => (
                        <li key={f} className="flex items-start gap-2">
                          <div className="h-px w-3.5 bg-primary mt-[9px] flex-shrink-0" />
                          <span className="text-sm text-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="p-6 flex items-center justify-start md:justify-center">
                    <Button asChild variant="outline" size="sm">
                      <Link to={s.href}>{s.cta} <ArrowRight className="h-3 w-3" /></Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── GUIDANCE ──────────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="label-with-thread mb-3">Built-in guidance</div>
              <h2 className="text-[1.875rem] md:text-[2.25rem] font-bold tracking-[-0.03em] leading-[1.1] text-foreground mb-4">
                Tells you what to do<br />before you need to ask.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                At every stage of every order, Clewa surfaces what an experienced sourcing director would tell you — in context, at the exact decision point.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Most brands learn production by making expensive mistakes. Clewa means you don't have to.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
                {GUIDANCE_MOMENTS.map((g) => {
                  const Icon = g.icon;
                  return (
                    <div key={g.stage} className="flex gap-3 p-4 bg-card">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary flex-shrink-0 mt-0.5">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.06em] mb-1">{g.stage}</p>
                        <p className="text-sm text-foreground leading-snug">{g.copy}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── PROTECTION — dark ─────────────────────────────────────────── */}
      <section className="section-padding border-b border-border bg-foreground">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2.5 text-[11px] font-semibold text-primary uppercase tracking-[0.08em] mb-3">
                <div className="h-px w-6 bg-primary flex-shrink-0" />
                Payment protection
              </div>
              <h2 className="text-[1.875rem] md:text-[2.25rem] font-bold tracking-[-0.03em] leading-[1.1] text-white mb-4">
                Your money never moves<br />without your approval.
              </h2>
              <p className="text-sm text-white/60 leading-relaxed mb-3">
                Every payment is milestone-gated. Sample approved before bulk starts. QC passes before final releases. You confirm every release manually.
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                Clewa doesn't hold your funds — you pay your factory directly. But the gate enforces the sequence. Nothing skips.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: Lock,         title: "Milestone gates",    body: "Deposit, sample, QC. Each locked behind a verified condition." },
                { icon: FileText,     title: "Contract generation",body: "Auto-generated at PO. Tied to agreed terms, this order." },
                { icon: AlertTriangle,title: "Dispute filing",     body: "Formal disputes with evidence. Final payment blocked." },
                { icon: BarChart3,    title: "Payment history",    body: "Every release timestamped, attributed, permanent." },
              ].map(({ icon: Icon, title, body }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-md border border-white/10 bg-white/5"
                >
                  <Icon className="h-4 w-4 text-primary mb-3" />
                  <p className="text-sm font-semibold text-white mb-1">{title}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{body}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ─── INTELLIGENCE ──────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="label-with-thread mb-3">Intelligence layer</div>
              <h2 className="text-[1.875rem] md:text-[2.25rem] font-bold tracking-[-0.03em] leading-[1.1] text-foreground">
                Gets smarter with every order.
              </h2>
            </div>
            <Link to="/intelligence" className="flex items-center gap-1 text-sm text-primary font-medium hover:underline flex-shrink-0">
              Open workspace <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
            {STATS.map((s, i) => (
              <motion.div
                key={s.value}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card p-5"
              >
                <p className="text-2xl font-bold tracking-[-0.02em] text-foreground mb-1">{s.value}</p>
                <p className="text-xs font-semibold text-foreground mb-0.5">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRADE TOOLS ───────────────────────────────────────────────── */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="label-with-thread mb-3">Free trade tools</div>
              <h2 className="text-[1.875rem] md:text-[2.25rem] font-bold tracking-[-0.03em] leading-[1.1] text-foreground mb-4">
                Know your real costs<br />before you commit.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Tariff comparison across five countries. HTS duty rates for 15 apparel categories. Margin calculator from landed cost to retail. No account needed.
              </p>
              <Button asChild variant="outline">
                <Link to="/trade-tools">Open trade tools <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: Globe,       title: "Tariff calculator",  body: "Vietnam vs China — real savings on your order" },
                { icon: TrendingUp,  title: "Margin calculator",  body: "Landed cost to retail with benchmark" },
                { icon: FileText,    title: "HTS code lookup",    body: "15 categories · US, UK, EU duty rates" },
                { icon: BarChart3,   title: "FTA guide",          body: "CPTPP, EVFTA, VKFTA — who qualifies" },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="p-4 rounded-md border border-border bg-card">
                  <Icon className="h-4 w-4 text-primary mb-3" />
                  <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-px w-full bg-border mb-8" />
            <h2 className="text-[1.875rem] md:text-[2.25rem] font-bold tracking-[-0.03em] leading-[1.1] text-foreground mb-4">
              Start where you are.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-7">
              Whatever your factory situation. Free for your first order. The full platform available from day one.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="xl">
                <Link to="/auth?mode=signup">Get started free <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">No credit card. No time limit.</p>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
}
