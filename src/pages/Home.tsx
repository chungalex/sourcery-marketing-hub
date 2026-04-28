import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, CheckCircle, Shield, Package, MessageSquare, FileText, BarChart3, Sparkles, Building2, Loader2, Search, Globe, Zap, TrendingUp, Star, Clock, Brain, Calculator, AlertTriangle, BookOpen, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useFactoryMembership } from "@/hooks/useFactoryMembership";

const features = [
  {
    icon: BarChart3,
    title: "Production countdown",
    sub: "Nike's method. Your price.",
    description: "Enter your delivery date. Sourcery reverse-engineers every required gate — sample approval, bulk start, QC date, cargo cutoff — and fires alerts when anything slips.",
  },
  {
    icon: Shield,
    title: "Milestone-gated payments",
    sub: "Your money moves when you say so.",
    description: "Sample approved before bulk. QC passed before final release. Every payment milestone released manually by you. Nothing moves without your confirmation.",
  },
  {
    icon: Package,
    title: "Safety stock & reorder timing",
    sub: "Amazon's formula. Your inventory.",
    description: "Enter your weekly sales velocity. Sourcery calculates your reorder point and tells you the exact date to issue your next PO — before you hit zero stock.",
  },
  {
    icon: Star,
    title: "Factory OTIF scores",
    sub: "Walmart tracks this. Now you can too.",
    description: "Every factory earns an on-time/in-full rate built from verified completed orders. Visible before you commit. Never self-reported. Gets more accurate with every order.",
  },
  {
    icon: Globe,
    title: "Trade tools built in",
    sub: "HTS codes, duties, FTA guidance.",
    description: "Searchable duty rate table, tariff comparison across 5 countries, FTA qualification checker. Know your true landed cost — not just the FOB quote.",
  },
  {
    icon: FileText,
    title: "Complete order documentation",
    sub: "Your compliance infrastructure.",
    description: "Every spec, revision, QC report, and milestone — permanent and exportable. One click generates your CSDDD, UFLPA, and Modern Slavery Act compliance documentation.",
  },
  {
    icon: MessageSquare,
    title: "Production intelligence",
    sub: "Order health. Cash flow. Risk flags.",
    description: "Traffic-light order health dashboard. Upcoming payment calendar. Holiday warnings before Tet and Golden Week. Intelligence that prevents expensive surprises.",
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
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { hasFactoryAccess } = useFactoryMembership(user?.id);

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate(hasFactoryAccess ? "/dashboard/factory" : "/dashboard", { replace: true });
    }
  }, [user, authLoading, hasFactoryAccess, navigate]);

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
        title="Sourcery — Production Intelligence for Physical Product Brands"
        description="The supply chain tools enterprise brands use — backward scheduling, safety stock math, OTIF factory scores — built for brands doing 300 units. Start free."
        canonical="/"
        ogImage="https://sourcery.so/og-image.png"
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
The supply chain tools
enterprise brands use.
Built for yours.
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-xl">
                  Nike has backward scheduling. Amazon has safety stock math. Apple has factory scorecards. Walmart tracks OTIF rates. All of it is now available to a brand doing 300 units — at $49/month.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { gate: "Starting out? We'll walk you through every step.", desc: "Guided PO creation. Milestone-gated payments that protect your money. Verified factories you can trust. Every decision explained, not assumed." },
                    { gate: "Running production? Stop managing it. Start controlling it.", desc: "Backward scheduling tells you every gate. Order health surfaces problems before they become crises. Safety stock math tells you exactly when to reorder." },
                    { gate: "Scaling up? Get the infrastructure that matches.", desc: "OTIF scores from verified order data. Team visibility across every active order. Compliance documentation that builds itself as you produce." }
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
                  <Link to="/studio" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Need it managed end to end? <span className="text-primary">Sourcery Studio →</span>
                  </Link>
                  <Link to="/how-it-works">
                    <Button size="xl" variant="hero-outline">
                      See how it works
                    </Button>
                  </Link>
                </div>
              </motion.div>

                            {/* Right — live intelligence demo */}
              
              {/* Mobile proof strip — visible on mobile only */}
              <div className="lg:hidden grid grid-cols-3 gap-2 mt-6">
                {[
                  { n: "6", label: "Production gates tracked automatically" },
                  { n: "14wk", label: "Avg lead time calculated from real orders" },
                  { n: "$49", label: "Per month — enterprise tools, startup price" },
                ].map(({ n, label }) => (
                  <div key={n} className="bg-card border border-border rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{n}</p>
                    <p className="text-xs text-muted-foreground leading-tight mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

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
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-mono text-xs text-muted-foreground mb-0.5">SRC-2026-00089</div>
                        <div className="font-semibold text-foreground">Indigo Selvedge Jacket — SS26</div>
                        <div className="text-xs text-muted-foreground mt-0.5">HU LA Studios · Ho Chi Minh City</div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-amber-500/10 text-amber-700 border-amber-400/40">
                        In Production
                      </span>
                    </div>

                    {/* Backward scheduling countdown */}
                    <div className="space-y-2 mb-4">
                      {[
                        { gate: "Sample approved", date: "May 12", status: "done" },
                        { gate: "Bulk production start", date: "Jun 3", status: "done" },
                        { gate: "In-line QC", date: "Jul 14", status: "alert" },
                        { gate: "Final QC", date: "Aug 4", status: "upcoming" },
                        { gate: "Cargo cutoff", date: "Aug 22", status: "upcoming" },
                      ].map((item) => (
                        <div key={item.gate} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            item.status === "done" ? "bg-green-500" :
                            item.status === "alert" ? "bg-amber-500 animate-pulse" :
                            "bg-border"
                          }`} />
                          <span className={`text-xs flex-1 ${
                            item.status === "done" ? "text-muted-foreground line-through" :
                            item.status === "alert" ? "text-foreground font-medium" :
                            "text-muted-foreground"
                          }`}>{item.gate}</span>
                          <span className={`text-xs ${
                            item.status === "alert" ? "text-amber-600 font-medium" : "text-muted-foreground"
                          }`}>{item.date}</span>
                        </div>
                      ))}
                    </div>

                    {/* Milestone track */}
                    <div className="pt-3 border-t border-border">
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
                  </div>

                  {/* Alert notification */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                    className="absolute -bottom-4 -left-4 bg-card border border-amber-400/30 rounded-xl p-3 shadow-lg flex items-center gap-3 max-w-[220px]"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">In-line QC overdue 3 days</p>
                      <p className="text-xs text-muted-foreground">Delivery window shrinking</p>
                    </div>
                  </motion.div>

                  {/* Reorder chip */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="absolute -top-3 -right-3 bg-card border border-primary/30 rounded-lg px-3 py-2 shadow-lg"
                  >
                    <p className="text-xs font-semibold text-primary">Issue FW26 PO by Aug 1</p>
                    <p className="text-xs text-muted-foreground">Based on 14-week lead time</p>
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
                title: "Find the right factory.",
                body: "Browse verified manufacturers with real performance scores — not self-reported. AI factory matching from a plain-language brief. Your existing factory? Invite them in one link.",
              },
              {
                title: "Protect your money.",
                body: "Every payment is milestone-gated. Sample approved before bulk starts. QC passed before final releases. Nothing moves without your confirmation. Your first order, fully protected.",
              },
              {
                title: "Know before it becomes a crisis.",
                body: "Production countdown calculates every gate backwards from your delivery date. Order health flags problems in week 4, not week 12. Safety stock math tells you exactly when to reorder.",
              },
              {
                title: "Build a record that compounds.",
                body: "Every completed order makes your factory's OTIF score more accurate. Your lead time history more reliable. Your compliance documentation more complete. The platform earns its value over time.",
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
              One platform.
Every stage of production.
            </h2>
            <p className="text-lg text-muted-foreground">
              Starting out or scaling up — the chaos of physical production hits everyone. Sourcery gives you the infrastructure to get ahead of it, at every stage.
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

      {/* For factories — language, ease */}
      <section className="section-padding bg-card/50 border-y border-border">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">For factories</p>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Built for the factory too — not just the brand.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most production software is built entirely from the brand's perspective. Sourcery works for both sides. Factories get their own dashboard, their own order view, and tools designed around how they actually work — including communication in their own language.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Globe, title: "Message translation built in", body: "Every message thread can be translated between English, Vietnamese, and Chinese. Factories write in their language, brands read in theirs." },
                  { icon: Package, title: "Orders arrive structured, not chaotic", body: "No more decoding a brand's email to understand what they want. Every order comes with specs, timeline, payment milestones, and QC standard already set." },
                  { icon: BarChart3, title: "A performance record that builds over time", body: "Every completed order contributes to a verified score — QC results, response time, on-time delivery. It compounds. It's yours." },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-0.5">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-5 rounded-xl bg-background border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Factory dashboard</p>
                <div className="space-y-2">
                  {[
                    { label: "New order from OKIO Denim", status: "Review", statusColor: "text-amber-700 bg-amber-500/10 border-amber-400/30" },
                    { label: "Sample approved — bulk confirmed", status: "In production", statusColor: "text-blue-700 bg-blue-500/10 border-blue-400/30" },
                    { label: "QC passed — payment released", status: "Closed", statusColor: "text-green-700 bg-green-500/10 border-green-500/20" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                      <span className="text-xs text-foreground">{row.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${row.statusColor}`}>{row.status}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                  <Globe className="h-3 w-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Tap any message to translate — EN / VI / 中文</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resources + Community + Intelligence */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Beyond the platform</p>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              Production knowledge, community, and intelligence.
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              The infrastructure extends beyond the order. Resources written by people who've managed production on both sides. A community where brands and factories talk to each other. Weekly supply chain intelligence from live public data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}>
              <a href="/resources" className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:-translate-y-0.5 h-full">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-4.5 w-4.5 text-primary" style={{width:18,height:18}} />
                </div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Resource library</p>
                <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">The knowledge experienced buyers carry.</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">AQL standards, incoterms, supply chain traceability, compliance certifications, import duties, factory evaluation, market guides. Written specifically for physical product brands.</p>
                <div className="flex items-center gap-1 text-primary text-xs font-medium mt-4">Browse resources <ArrowRight className="h-3 w-3" /></div>
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }}>
              <a href="/forum" className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:-translate-y-0.5 h-full">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-4.5 w-4.5 text-primary" style={{width:18,height:18}} />
                </div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Community</p>
                <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Brands and factories talking to each other.</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Factory recommendations. Production questions answered by people who've been through it. Supply chain discussion on tariffs, freight, and market moves. A space that didn't exist until now.</p>
                <div className="flex items-center gap-1 text-primary text-xs font-medium mt-4">Join the forum <ArrowRight className="h-3 w-3" /></div>
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}>
              <a href="/intelligence" className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:-translate-y-0.5 h-full">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-4.5 w-4.5 text-primary" style={{width:18,height:18}} />
                </div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Supply chain intelligence</p>
                <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Current signals, not generic news.</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Weekly briefings on freight rates, tariff changes, and market moves — AI-synthesised from live public data. Freightos, USTR, Federal Register. Every figure linked to its source.</p>
                <div className="flex items-center gap-1 text-primary text-xs font-medium mt-4">See the feed <ArrowRight className="h-3 w-3" /></div>
              </a>
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
              Find your factory in the marketplace or bring your own. First order free — full platform from day one. No credit card, no time limit. Not sure where to start? Read the <a href="/resources" className="text-primary hover:underline">production resources</a>.
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
