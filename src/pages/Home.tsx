import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import {
  ArrowRight, CheckCircle, Shield, Package, MessageSquare,
  FileText, BarChart3, Sparkles, Building2, Loader2, Search
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const features = [
  {
    icon: Building2,
    title: "Bring your own factory",
    sub: "No marketplace required.",
    description: "Invite your existing manufacturer and manage every order on-platform from day one. Full platform functionality immediately.",
  },
  {
    icon: Shield,
    title: "Milestone-gated payments",
    sub: "Your money moves when you approve it.",
    description: "Sample approved before bulk. QC passed before final release. Nothing moves without your confirmation.",
  },
  {
    icon: Package,
    title: "Structured order creation",
    sub: "Every decision explained before you make it.",
    description: "Incoterms, QC standard, AQL threshold — each with plain-English guidance. Built for first orders and experienced operators alike.",
  },
  {
    icon: FileText,
    title: "QC documentation",
    sub: "No more 'defect found after the wire.'",
    description: "Defects filed as structured reports — type, severity, quantity, photos, factory response. Final payment blocked until QC passes.",
  },
  {
    icon: MessageSquare,
    title: "On-platform communication",
    sub: "No more scattered WhatsApp threads.",
    description: "Every message logged, timestamped, and attached to the right order. Full history. Nothing important communicated outside the platform.",
  },
  {
    icon: BarChart3,
    title: "Factory performance tracking",
    sub: "Know exactly what you're working with.",
    description: "Every order completed on the platform adds to a factory's verified record — QC results, response times, defect reports. Builds from the first order. Never self-reported.",
  },
  {
    icon: Search,
    title: "Factory marketplace",
    sub: "Find the right factory. Or bring your own.",
    description: "Browse vetted manufacturers with real performance data. AI-matched recommendations in plain language. Or invite your existing factory — same platform either way.",
  },
];

const aiTools = [
  { name: "Production assistant", desc: "An AI with full order context — risk, timing, factory communication, defect leverage. Answers in the context of your actual order.", live: true },
  { name: "AI Factory Matcher", desc: "Describe what you need in plain language. Get ranked recommendations from verified network data.", live: false },
  { name: "AI Tech Pack Reviewer", desc: "Risk analysis on your tech pack before it goes to the factory. Catches what becomes revision rounds.", live: false },
  { name: "AI RFQ Generator", desc: "Describe your product. Get a professional, structured RFQ ready to send to any manufacturer.", live: false },
  { name: "AI Quote Analyzer", desc: "Paste a factory quote. Get an independent analysis benchmarked against real order data.", live: false },
];

const proofPoints = [
  "Every payment milestone-gated",
  "Sampling gated before bulk production",
  "Full paper trail on every order",
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);

  const handleEmailCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setCapturing(true);
    try {
      await supabase.from("contact_submissions").insert({
        email: email.trim(),
        message: "Homepage email capture",
        name: "—",
        type: "waitlist",
      });
      setCaptured(true);
      setEmail("");
    } catch {
      toast.error("Something went wrong — try again.");
    } finally {
      setCapturing(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Sourcery — The Manufacturing OS for Physical Product Brands"
        description="Whether you're placing your first order or your fiftieth, production deserves better than WhatsApp and spreadsheets. Sourcery is the marketplace to find the right factory and the OS to manage every order properly."
        canonical="/"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--hero-gradient)]" />
        <div className="container-wide relative">
          <div className="min-h-[calc(100vh-5rem)] flex items-center py-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center w-full">

              {/* Left — copy */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                  The manufacturing OS for brands who take production seriously.
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-xl">
                  Whether you're placing your first order or your fiftieth, production deserves better infrastructure than WhatsApp and spreadsheets. Sourcery is the marketplace to find the right factory and the OS to manage every order — documented, gated, and traceable from PO to delivery.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { gate: "Verified factory network", desc: "Find manufacturers with credentials confirmed before you reach out" },
                    { gate: "Guided from first PO to delivery", desc: "Every decision explained — incoterms, AQL, QC — before you make it" },
                    { gate: "Your money moves when you confirm it", desc: "Milestone-gated payments. Sample gate. QC gate. Nothing moves without you" },
                  ].map(item => (
                    <div key={item.gate} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{item.gate} — </span>
                        <span className="text-sm text-muted-foreground">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/auth?mode=signup">
                    <Button size="xl" variant="hero">
                      Get started free
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/how-it-works">
                    <Button size="xl" variant="hero-outline">
                      See how it works
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Right — live order preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  {/* Main order card */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-mono text-xs text-muted-foreground mb-0.5">SRC-2026-00042</div>
                        <div className="font-semibold text-foreground">Premium Denim Jacket</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Factory — Ho Chi Minh City</div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-amber-500/10 text-amber-700 border-amber-400/40">
                        Sample to Review
                      </span>
                    </div>

                    {/* Sample submitted alert */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="text-xs font-medium text-foreground">Sample submitted — round 1</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Factory uploaded 4 photos and measurements. Approve or request revision.</p>
                      </div>
                    </div>

                    {/* Milestone track */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Payment milestones</span>
                        <span>30% released</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {["Deposit", "Production", "Final"].map((label, i) => (
                          <div key={label} className="flex-1">
                            <div className={`h-2 rounded-full ${i === 0 ? "bg-green-500" : "bg-muted"}`} />
                            <div className="text-xs text-muted-foreground mt-1 text-center">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Protection badges */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                      {[
                        { label: "Gates active", status: "Enforced", color: "text-green-600" },
                        { label: "Sample gate", status: "Pending", color: "text-amber-600" },
                        { label: "QC gate", status: "Upcoming", color: "text-muted-foreground" },
                      ].map(p => (
                        <div key={p.label} className="text-center">
                          <div className={`text-xs font-medium ${p.color}`}>{p.status}</div>
                          <div className="text-xs text-muted-foreground">{p.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating notification */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-3 shadow-lg flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">QC passed</p>
                      <p className="text-xs text-muted-foreground">Final milestone unlocked</p>
                    </div>
                  </motion.div>

                  {/* Floating revision tag */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.4 }}
                    className="absolute -top-3 -right-3 bg-card border border-border rounded-lg px-3 py-2 shadow-lg"
                  >
                    <p className="text-xs font-medium text-foreground">Revision round logged</p>
                    <p className="text-xs text-muted-foreground">Factory acknowledged ✓</p>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Platform pillars strip */}
      <section className="border-y border-border bg-card/40">
        <div className="container-wide py-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Guided order creation",
                body: "Every decision in the order process — incoterms, QC standard, AQL threshold — includes a plain-English explanation before you commit. Nothing left to assumption.",
              },
              {
                title: "Milestone-gated payments",
                body: "Every payment stage is gated behind a verified condition. Sample approved before bulk. QC passed before final release. You release each milestone manually — nothing moves without your confirmation.",
              },
              {
                title: "Formal revision tracking",
                body: "Every spec change is a logged revision round the factory must acknowledge before work continues. Full timestamp trail on every change.",
              },
              {
                title: "QC gate",
                body: "Final payment blocked until quality inspection passes. Defects documented as structured reports — type, severity, quantity, factory response — all against the order.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="text-sm font-semibold text-foreground mb-2">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything production needs. Nothing it doesn't.
            </h2>
            <p className="text-lg text-muted-foreground">
              From finding the right factory to closing an order with a permanent record — structured, gated, and traceable at every stage.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-0.5">{f.title}</h3>
                <p className="text-xs text-primary font-medium mb-2">{(f as any).sub}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="section-padding bg-card/50">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI toolkit
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Intelligence built into every order.
            </h2>
            <p className="text-lg text-muted-foreground">
              The Sourcery AI toolkit integrates directly into the production workflow — factory matching, tech pack review, RFQ generation, and quote analysis, all running on real network and order data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {aiTools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-6 rounded-xl bg-card border border-border flex gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-foreground text-sm">{tool.name}</h3>
                    {tool.live ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 border border-green-500/20 font-medium">Live</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 font-medium">In development</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tool.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground text-center mb-5">
            Every AI tool improves as the platform grows — factory profiles, order history, and performance records all feed in. The more orders completed on the platform, the sharper every recommendation becomes.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link to="/marketplace">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                Try AI factory matching → Builder <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link to="/assistant">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                Meet the production assistant → Pro <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
                Factory marketplace
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-5">
                Don't have a factory yet — or ready to find a better one?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Finding a manufacturer is hard whether it's your first order or you're replacing a factory that's let you down. The Sourcery marketplace shows you verified manufacturers with credentials confirmed before listing — AI-matched to your product, MOQ, certifications, and timeline. Browse free. Commit with data.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Already have a factory? Invite them directly. BYOF brings your existing relationship onto the platform immediately — no marketplace needed.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/marketplace">
                  <Button className="gap-1.5">
                    Explore the marketplace <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/directory">
                  <Button variant="outline" className="gap-1.5">Browse factories</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-card border border-border rounded-2xl p-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Factory network standards</p>
                <div className="space-y-3 mb-5">
                  {[
                    { label: "Credential review before listing", sub: "Certifications verified, capability assessed" },
                    { label: "Performance score from real orders", sub: "QC rates, response time, defect history, retention" },
                    { label: "AI-matched by your requirements", sub: "Product type, MOQ, certifications, timeline" },
                    { label: "Free to browse, Builder to contact", sub: "See full capabilities before you upgrade" },
                    { label: "Factories with declining scores flagged", sub: "Network stays useful by staying selective" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">We recommend all brands request samples and start with smaller trial orders regardless of network membership status.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Production this serious deserves better infrastructure.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Find your factory in the marketplace or bring your own. First order free — full platform from day one. No credit card, no time limit.
            </p>

            {!captured ? (
              <form onSubmit={handleEmailCapture} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={capturing}>
                  {capturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Get started free <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-700 mb-6">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">You're on the list. We'll be in touch.</span>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button variant="outline">Create account</Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="ghost">See how it works</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
