import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle, Shield, Search, FileText, MessageSquare, Package, Archive, Truck, BookOpen, Users, Zap, Globe, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductionAssistant } from "@/components/va/ProductionAssistant";

const steps = [
  {
    number: "01",
    icon: Search,
    label: "Find your factory",
    headline: "Start with data, not a leap of faith.",
    description: "Browse verified manufacturers — credentials confirmed, performance tracked from every order on the platform. Describe what you need in plain language and get AI-matched results. Or skip the marketplace entirely and invite your existing factory directly.",
    note: "Free to browse. Factory names and contact on Builder.",
    tag: "Marketplace",
    tagColor: "text-primary bg-primary/10",
    mockup: {
      type: "marketplace",
      title: "AI factory matcher",
      input: "Premium denim outerwear, 300–500 units, Vietnam preferred, 12-week lead time",
      results: [
        { name: "HU LA Studios", loc: "Ho Chi Minh City, Vietnam", badge: "Top match", verified: true },
        { name: "████████ Co.", loc: "Vietnam", badge: "Strong match", verified: false },
        { name: "████████ Ltd.", loc: "Portugal", badge: "Good match", verified: false },
      ],
    },
  },
  {
    number: "02",
    icon: FileText,
    label: "Create a structured PO",
    headline: "Every decision explained before you make it.",
    description: "Quantity, pricing, incoterms, QC option, AQL standard, delivery window — each with plain-English guidance before you choose. Not sure what FOB means? The form explains it. You know exactly what you're agreeing to before you commit.",
    note: "The PO is the shared source of truth both sides work from.",
    tag: "Production OS",
    tagColor: "text-muted-foreground bg-secondary",
    mockup: {
      type: "po",
      title: "New production order",
      fields: [
        { label: "Product", value: "Premium Denim Jacket — SS26" },
        { label: "Quantity", value: "500 units" },
        { label: "Incoterms", value: "FOB Ho Chi Minh City", tooltip: "Factory gets goods to port. You arrange freight from there." },
        { label: "AQL standard", value: "2.5 — Industry standard", tooltip: "Up to 2.5% defect rate acceptable on inspection." },
        { label: "Delivery window", value: "Jun 15 – Jun 30, 2026" },
        { label: "Payment structure", value: "30% deposit / 40% bulk / 30% QC pass" },
      ],
    },
  },
  {
    number: "03",
    icon: Package,
    label: "Sample gate",
    headline: "Bulk can't begin until this is formally approved.",
    description: "The factory submits the sample with photos and measurements logged against the order. You review and either approve or request a formal revision round — with documented feedback the factory must acknowledge. The platform enforces this gate.",
    note: "Not an email. A logged, timestamped approval the whole order is built from.",
    tag: "Enforced gate",
    tagColor: "text-primary bg-primary/10",
    mockup: {
      type: "sample",
      title: "Sample submitted — round 1",
      factoryNote: "HU LA Studios uploaded 4 photos and measurements. Awaiting approval.",
      items: [
        { label: "Chest", spec: "52cm", actual: "52cm", pass: true },
        { label: "Waist", spec: "46cm", actual: "46cm", pass: true },
        { label: "Length", spec: "68cm", actual: "67.5cm", pass: false },
        { label: "Sleeve", spec: "64cm", actual: "64cm", pass: true },
      ],
    },
  },
  {
    number: "04",
    icon: MessageSquare,
    label: "Revision rounds",
    headline: "Every spec change acknowledged before work continues.",
    description: "Every change during production is submitted as a formal revision round. The factory must acknowledge it before production continues. Tech pack versions are numbered and factory-confirmed. No more 'which file did you use?' disputes.",
    note: "Not sent over WhatsApp. Logged with a timestamp. Permanent.",
    tag: "Production OS",
    tagColor: "text-muted-foreground bg-secondary",
    mockup: {
      type: "revision",
      title: "Revision round 01",
      changes: [
        { field: "Length", from: "67.5cm", to: "68cm", note: "Must match approved spec exactly" },
        { field: "Stitching", from: "Single", to: "Double topstitch on hem", note: "Per original tech pack v2" },
      ],
      status: "Awaiting factory acknowledgment",
    },
  },
  {
    number: "05",
    icon: Shield,
    label: "QC gate",
    headline: "Final payment blocked until quality passes.",
    description: "QC is logged with photos and defect reports. The final payment milestone cannot release without a QC pass. Defects are filed as structured reports — type, severity, quantity, factory response — all against the order with timestamps. You release every milestone manually.",
    note: "You never wire the final amount until this step is complete.",
    tag: "Enforced gate",
    tagColor: "text-primary bg-primary/10",
    mockup: {
      type: "qc",
      title: "QC inspection complete",
      result: "pass",
      stats: [
        { label: "Units inspected", value: "125 of 500" },
        { label: "Defects found", value: "2 minor" },
        { label: "AQL 2.5 threshold", value: "Passed" },
        { label: "Final milestone", value: "Unlocked" },
      ],
    },
  },
  {
    number: "06",
    icon: Archive,
    label: "Closed order — permanent record",
    headline: "Every decision, forever searchable.",
    description: "Once the order closes, the full record stays — every message, spec version, revision, defect report, and payment milestone. Searchable and exportable. Reorder from a complete spec in one click. Your institutional knowledge doesn't live in anyone's inbox.",
    note: "This is the record you'd want in a dispute. It built itself.",
    tag: "Production OS",
    tagColor: "text-muted-foreground bg-secondary",
    mockup: {
      type: "closed",
      title: "SRC-2026-00042 — Closed",
      timeline: [
        { event: "PO created", date: "Jan 15", done: true },
        { event: "Sample approved", date: "Feb 02", done: true },
        { event: "Revision round acknowledged", date: "Feb 08", done: true },
        { event: "Bulk production complete", date: "Mar 20", done: true },
        { event: "QC passed", date: "Mar 24", done: true },
        { event: "Final payment released", date: "Mar 24", done: true },
      ],
    },
  },
];

function MarketplaceMockup({ data }: { data: any }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <p className="text-xs font-semibold text-primary mb-3">{data.title}</p>
      <div className="bg-secondary/50 rounded-lg p-3 mb-3 text-xs text-muted-foreground italic">
        "{data.input}"
      </div>
      <div className="space-y-2">
        {data.results.map((r: any, i: number) => (
          <div key={i} className={cn("flex items-center justify-between p-2.5 rounded-lg border text-xs", i === 0 ? "border-primary/30 bg-primary/5" : "border-border bg-card")}>
            <div>
              <p className={cn("font-medium", !r.verified ? "blur-sm select-none" : "")}>{r.name}</p>
              <p className="text-muted-foreground">{r.loc}</p>
            </div>
            <div className="text-right">
              <span className={cn("text-xs font-semibold", i === 0 ? "text-primary" : "text-muted-foreground")}>{r.badge}</span>
              {r.verified && <p className="text-xs text-green-600">Verified ✓</p>}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">Factory names visible on Builder</p>
    </div>
  );
}

function POMockup({ data }: { data: any }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <p className="text-xs font-semibold text-foreground mb-3">{data.title}</p>
      <div className="space-y-0">
        {data.fields.map((f: any, i: number) => (
          <div key={i} className="flex items-start justify-between py-2 border-b border-border last:border-0 gap-3">
            <span className="text-xs text-muted-foreground flex-shrink-0">{f.label}</span>
            <div className="text-right">
              <span className="text-xs font-medium text-foreground">{f.value}</span>
              {f.tooltip && <p className="text-xs text-primary mt-0.5">{f.tooltip}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SampleMockup({ data }: { data: any }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-foreground">{data.title}</p>
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-400/30">Pending review</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{data.factoryNote}</p>
      <div className="space-y-0">
        <div className="grid grid-cols-4 gap-2 pb-1.5 border-b border-border">
          {["Measurement", "Spec", "Actual", ""].map(h => <span key={h} className="text-xs text-muted-foreground font-medium">{h}</span>)}
        </div>
        {data.items.map((item: any, i: number) => (
          <div key={i} className="grid grid-cols-4 gap-2 py-1.5 border-b border-border last:border-0">
            <span className="text-xs text-foreground">{item.label}</span>
            <span className="text-xs text-muted-foreground">{item.spec}</span>
            <span className="text-xs text-foreground">{item.actual}</span>
            <span className={cn("text-xs font-semibold", item.pass ? "text-green-600" : "text-rose-600")}>{item.pass ? "✓" : "✗ Off"}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Button size="sm" className="flex-1 text-xs h-7">Approve sample</Button>
        <Button size="sm" variant="outline" className="flex-1 text-xs h-7">Request revision</Button>
      </div>
    </div>
  );
}

function RevisionMockup({ data }: { data: any }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-foreground">{data.title}</p>
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-400/30">{data.status}</span>
      </div>
      <div className="space-y-2.5">
        {data.changes.map((c: any, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs font-semibold text-foreground mb-1">{c.field}</p>
            <div className="flex items-center gap-2 text-xs mb-1">
              <span className="text-muted-foreground line-through">{c.from}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground font-medium">{c.to}</span>
            </div>
            <p className="text-xs text-muted-foreground italic">{c.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary text-center">
        Production paused until factory acknowledges
      </div>
    </div>
  );
}

function QCMockup({ data }: { data: any }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-foreground">{data.title}</p>
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 border border-green-500/20">Passed</span>
      </div>
      <div className="space-y-0">
        {data.stats.map((s: any, i: number) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <span className={cn("text-xs font-semibold", s.label === "Final milestone" ? "text-primary" : "text-foreground")}>{s.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-green-500/5 border border-green-500/20">
        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-foreground">Final milestone unlocked</p>
          <p className="text-xs text-muted-foreground">Ready for your release confirmation</p>
        </div>
      </div>
    </div>
  );
}

function ClosedMockup({ data }: { data: any }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-foreground">{data.title}</p>
        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">Closed</span>
      </div>
      <div className="space-y-2">
        {data.timeline.map((t: any, i: number) => (
          <div key={i} className="flex items-center gap-3">
            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", t.done ? "bg-primary/15" : "bg-secondary")}>
              {t.done && <CheckCircle className="h-3 w-3 text-primary" />}
            </div>
            <div className="flex items-center justify-between flex-1">
              <span className="text-xs text-foreground">{t.event}</span>
              <span className="text-xs text-muted-foreground">{t.date}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border flex gap-2">
        <Button size="sm" className="flex-1 text-xs h-7 gap-1">Reorder <ArrowRight className="h-3 w-3" /></Button>
        <Button size="sm" variant="outline" className="text-xs h-7 px-2">Export PDF</Button>
      </div>
    </div>
  );
}

function StepMockup({ step }: { step: typeof steps[0] }) {
  const m = step.mockup;
  if (m.type === "marketplace") return <MarketplaceMockup data={m} />;
  if (m.type === "po") return <POMockup data={m} />;
  if (m.type === "sample") return <SampleMockup data={m} />;
  if (m.type === "revision") return <RevisionMockup data={m} />;
  if (m.type === "qc") return <QCMockup data={m} />;
  if (m.type === "closed") return <ClosedMockup data={m} />;
  return null;
}

export default function Walkthrough() {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const isLast = current === steps.length - 1;

  return (
    <Layout>
      <SEO
        title="See how Sourcery works — Interactive walkthrough"
        description="A complete production order from finding your factory to closing the delivery. See every step before you sign up."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)] border-b border-border">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              A production order, start to finish.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Walk through every stage before you sign up. See exactly what the platform does — and why it matters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Step nav */}
      <div className="border-b border-border bg-background sticky top-16 z-10">
        <div className="container-wide overflow-x-auto">
          <div className="flex items-stretch min-w-max">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const state = i < current ? "done" : i === current ? "active" : "upcoming";
              return (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors text-left whitespace-nowrap",
                    state === "active" ? "border-primary text-foreground" : "border-transparent",
                    state === "done" ? "text-primary" : state === "upcoming" ? "text-muted-foreground hover:text-foreground" : ""
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                    state === "done" ? "bg-primary/15" : state === "active" ? "bg-primary/15" : "bg-secondary"
                  )}>
                    {state === "done"
                      ? <CheckCircle className="h-3 w-3 text-primary" />
                      : <span className="text-xs font-mono font-bold text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    }
                  </div>
                  <span className="text-xs font-medium">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main walkthrough */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid lg:grid-cols-2 gap-12 items-start"
            >
              {/* Left — description */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-xs text-muted-foreground">{step.number}</span>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", step.tagColor)}>
                    {step.tag}
                  </span>
                </div>

                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                  {step.headline}
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                  {step.description}
                </p>

                <div className="flex items-start gap-2.5 p-4 rounded-xl bg-card border border-border mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  <p className="text-sm text-foreground leading-relaxed">{step.note}</p>
                </div>

                {/* Nav buttons */}
                <div className="flex items-center gap-3">
                  {current > 0 && (
                    <Button variant="outline" onClick={() => setCurrent(c => c - 1)} className="gap-1.5">
                      <ArrowLeft className="h-4 w-4" /> Previous
                    </Button>
                  )}
                  {!isLast ? (
                    <Button onClick={() => setCurrent(c => c + 1)} className="gap-1.5">
                      Next step <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Link to="/auth?mode=signup">
                      <Button variant="hero" className="gap-1.5">
                        Start your first order free <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <span className="text-xs text-muted-foreground ml-2">{current + 1} of {steps.length}</span>
                </div>
              </div>

              {/* Right — mockup */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <StepMockup step={step} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pb-8">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "rounded-full transition-all",
              i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-muted-foreground"
            )}
          />
        ))}
      </div>

      {/* Demo VA */}
      <section className="section-padding border-t border-border">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Production assistant</p>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                  Have a production question? Ask it here.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Before you sign up — ask anything. Incoterms, factory evaluation, lead times, freight documents, QC standards. The assistant knows production. On a live order it knows your specific context.
                </p>
                <p className="text-sm text-muted-foreground">Try: "What incoterms should I use for Vietnam?" or "How do I know if a factory quote is fair?"</p>
              </div>
              <ProductionAssistant mode="demo" className="w-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Supply chain — what Pro unlocks */}
      <section className="section-padding bg-card/50 border-t border-border">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Supply chain — Pro</p>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
              Coordinate your full supply chain on one order.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Pro brands can link trim and fabric suppliers directly to a production order. Material handoffs between suppliers are tracked — both parties confirm receipt, production gates on it. Your BOM, landed costs, freight docs, and shipment tracking all live on the same record.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Truck, title: "Multi-supplier coordination", body: "Trim supplier ships to garment factory. Both confirm. Production gates on receipt." },
                { icon: FileText, title: "Bill of materials tracker", body: "Every material, trim, and component with supplier, cost, and lead time." },
                { icon: Globe, title: "Landed cost calculator", body: "Manufacturing + freight + import duties by country = real cost per unit." },
                { icon: TrendingUp, title: "FX rate alerts", body: "Currency moves while your order is open. You get an updated landed cost estimate." },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="p-5 rounded-xl bg-background border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link to="/features" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                See all supply chain features <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform overview — everything else */}
      <section className="section-padding border-t border-border">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
              Everything else on the platform.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              The production order walkthrough above is the core. Around it, Sourcery is building the full infrastructure layer for physical product brands.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Search,
                label: "Marketplace",
                href: "/marketplace",
                headline: "Find the right factory before you commit.",
                body: "Vetted manufacturers with verified credentials — categories, certifications, MOQ, lead times. AI-matched to your product. Browse free. Every factory personally vetted before listing.",
              },
              {
                icon: Zap,
                label: "Production assistant",
                href: "/assistant",
                headline: "An AI that knows your order.",
                body: "Ask anything about an active order — risk, timing, draft a factory message, supply chain timing. Reads your full order context before you ask. Use with discretion — verify before acting.",
              },
              {
                icon: BookOpen,
                label: "Resource library",
                href: "/resources",
                headline: "The knowledge experienced buyers have.",
                body: "AQL, incoterms, supply chain traceability, compliance certifications, import duties, factory evaluation, market guides for Vietnam, China, Portugal, and India.",
              },
              {
                icon: Globe,
                label: "Intelligence feed",
                href: "/intelligence",
                headline: "Current supply chain signals.",
                body: "Weekly briefings on freight rates, trade policy, tariff changes, and market moves. AI-synthesised from live public data — Freightos, USTR, Federal Register — with full methodology disclosure.",
              },
              {
                icon: Users,
                label: "Community forum",
                href: "/forum",
                headline: "Brands and factories talking to each other.",
                body: "Three spaces: founder forum (brand-to-brand), factory channel (capacity and discovery), and supply chain discussion (tariffs, freight, logistics, market moves).",
              },
              {
                icon: Shield,
                label: "Full feature list",
                href: "/features",
                headline: "38 features across 7 categories.",
                body: "Production OS, marketplace, AI toolkit, communication, organisation, intelligence, and supply chain. Free tier, Builder ($399/yr), and Pro ($699/yr) with supply chain coordination.",
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={item.href} className="group block p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:-translate-y-0.5 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">{item.label}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{item.headline}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                  <div className="flex items-center gap-1 text-xs text-primary mt-3 font-medium">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-card/50 border-t border-border">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Your first order is free.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Bring your factory or find one in the marketplace. Full infrastructure from day one. No credit card, no time limit.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="hero-outline" size="xl">Read how it works</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
