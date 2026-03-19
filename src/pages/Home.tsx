import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import {
  ArrowRight, CheckCircle, Shield, Package, MessageSquare,
  FileText, BarChart3, Sparkles, Building2, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const features = [
  {
    icon: Building2,
    title: "Bring your own factory",
    description: "Already working with a manufacturer? Invite them and manage every order on-platform from day one. No marketplace required to get started.",
  },
  {
    icon: Shield,
    title: "Milestone escrow",
    description: "Payments held and released in stages. Sample approved before bulk production is funded. QC passed before final release. You control every unlock.",
  },
  {
    icon: Package,
    title: "Structured order creation",
    description: "Every decision that matters — incoterms, QC option, AQL standard, delivery window — captured in a guided form with plain-English explanations at each step. Built for first-time brands and experienced operators alike.",
  },
  {
    icon: FileText,
    title: "QC documentation",
    description: "Defects filed as structured reports — type, severity, quantity, photos, factory response. Logged against the order with timestamps.",
  },
  {
    icon: MessageSquare,
    title: "On-platform communication",
    description: "Every message between you and your factory is logged, timestamped, and attached to the order. Full history. No scattered threads.",
  },
  {
    icon: BarChart3,
    title: "Factory performance scores",
    description: "Every completed order builds a factory's performance record — QC pass rate, response time, defect history. Real data, not self-reported claims.",
  },
];

const aiTools = [
  { name: "AI Factory Matcher", desc: "Describe what you need in plain language. Get ranked recommendations from verified network data.", live: true },
  { name: "AI Tech Pack Reviewer", desc: "Risk analysis on your tech pack before it goes to the factory. Catches what becomes revision rounds.", live: false },
  { name: "AI RFQ Generator", desc: "Describe your product. Get a professional, structured RFQ ready to send to any manufacturer.", live: false },
  { name: "AI Quote Analyzer", desc: "Paste a factory quote. Get an independent analysis benchmarked against real order data.", live: false },
];

const proofPoints = [
  "Every payment milestone-protected",
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
        description="Manage every production order — sampling, revisions, QC, and payments — in one structured system. Bring your existing factory or connect with one from our vetted network."
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
                  The manufacturing OS for physical product brands.
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-xl">
                  Placing your first production order or your fiftieth — Sourcery walks you through every decision that matters, protects your capital at every stage, and builds a permanent record of every order automatically.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { gate: "Sample gate", desc: "No bulk production funded until sample is approved" },
                    { gate: "Revision log", desc: "Every spec change formally acknowledged by factory" },
                    { gate: "QC gate", desc: "Final payment blocked until quality inspection passes" },
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
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/8 border border-amber-500/20 mb-5">
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
                        { label: "Escrow", status: "Active", color: "text-green-600" },
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

      {/* Security + guidance narrative */}
      <section className="border-y border-border bg-card/40">
        <div className="container-wide py-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "\"I don't know what incoterms to use.\"",
                solution: "Each option is explained before you choose — who pays for shipping, who's responsible if goods are lost, when to use each one. You don't need to know going in.",
              },
              {
                title: "\"I wired a deposit and lost all leverage.\"",
                solution: "Funds are held in milestone escrow and released in stages you control. The factory earns each payment — it's not transferred upfront.",
              },
              {
                title: "\"The sample was wrong but nothing was in writing.\"",
                solution: "Every sample submission is formally documented. Revision requests are logged and factory-acknowledged before production continues.",
              },
              {
                title: "\"I found the defect after the final payment.\"",
                solution: "Final payment requires QC pass. Defects are filed as structured reports. The gate is enforced by the platform — not optional.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="text-sm text-muted-foreground mb-3 italic">"{item.title}"</p>
                <p className="text-sm text-foreground leading-relaxed">{item.solution}</p>
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
              Built for production — not just sourcing.
            </h2>
            <p className="text-lg text-muted-foreground">
              Most platforms stop at the introduction. Sourcery manages the entire order lifecycle from first contact to closed delivery.
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
                <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
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
              Intelligence built in. Not bolted on.
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

          <p className="text-sm text-muted-foreground text-center">
            Every AI tool runs on real Sourcery data — factory profiles, performance scores, and anonymized order history. The more the network grows, the more accurate every tool becomes.
          </p>
        </div>
      </section>

      {/* Network */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              A network built on standards, not volume.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                Factories enter the Sourcery network through an application and review process — credentials verified, certifications reviewed, production capability assessed based on submitted documentation and references. Once in the network, performance is tracked across every completed order.
              </p>
              <p>
                High-performing factories receive featured placement and priority matching with new brands. Those that fall below threshold are removed. The network stays useful by staying selective.
              </p>
            </div>
            <p className="text-sm text-muted-foreground italic border-l-2 border-border pl-4">
              We recommend all brands conduct their own verification — including requesting samples and starting with smaller trial orders — regardless of network membership status.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Email capture */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Ready to manage production properly?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              No retainer. No upfront fee. 3% transaction fee only when your production is moving. Get started free and bring your first factory on in under 10 minutes.
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
                  {capturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Get early access <ArrowRight className="ml-2 h-4 w-4" /></>}
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
