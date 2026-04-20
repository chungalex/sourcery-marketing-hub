import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Shield, TrendingUp, Package, CheckCircle, Clock, DollarSign, Camera, BarChart3, RefreshCw, Globe, Zap } from "lucide-react";

const PILLARS = [
  {
    icon: FileText,
    tag: "Document",
    title: "Every order has a permanent record.",
    body: "Spec versions, revision rounds, approved samples, QC reports, payment milestones, production photos, message threads. Every action is timestamped and attached to the order. When disputes happen — and they do — your record is the resolution.",
    color: "text-primary",
    bg: "bg-primary/5 border-primary/20",
    features: [
      { icon: FileText, name: "Tech pack versioning", desc: "Every spec version preserved. Factory always works from the approved version." },
      { icon: Camera, name: "Production photo log", desc: "Factory uploads photos at each stage. You see progress without asking." },
      { icon: Package, name: "SKU-level tracking", desc: "Individual status per colourway and size. No guessing which units are done." },
      { icon: Globe, name: "Shareable production record", desc: "One link to share a completed order summary with investors or partners." },
    ]
  },
  {
    icon: Shield,
    tag: "Control",
    title: "Your money moves when you say so.",
    body: "Milestone-gated payments mean nothing is released without your explicit approval. Sample approval gate before bulk production starts. QC inspection gate before final payment. Every control point is built into the workflow — not bolted on.",
    color: "text-blue-600",
    bg: "bg-blue-500/5 border-blue-400/20",
    features: [
      { icon: Shield, name: "Milestone-gated payments", desc: "30% deposit → sample approval → bulk production → QC pass → final payment. Each stage requires your confirmation." },
      { icon: CheckCircle, name: "Sampling gate", desc: "Formal sample approval before bulk production can begin. Revision rounds documented." },
      { icon: Shield, name: "QC gate", desc: "AQL inspection before final payment releases. Defect reports trigger dispute flow." },
      { icon: DollarSign, name: "Cash flow calendar", desc: "See all upcoming payment milestones across all active orders in one view." },
    ]
  },
  {
    icon: TrendingUp,
    tag: "Intelligence",
    title: "Your production intelligence layer.",
    body: "The bullwhip effect costs fashion brands millions every year — small demand changes cause massive production disruptions because brands and factories can't see each other's signals. Sourcery closes this gap. After your first completed order, the platform tracks your exact lead times, tells you when to issue the next PO, shows your factory's current capacity, and flags orders at risk before you miss your season.. It tells you when to act — before the delay happens.",
    color: "text-green-600",
    bg: "bg-green-500/5 border-green-500/20",
    features: [
      { icon: RefreshCw, name: "Reorder intelligence", desc: "Calculates your suggested PO date based on your actual lead time history with each factory. Fires alerts before you're behind — not after. The platform that prevents the delays most brands don't see coming." },
      { icon: Clock, name: "Deadline backtrack calculator", desc: "Works backwards from your delivery date. 6 production gates with on-track/overdue status. Catches delays early." },
      { icon: BarChart3, name: "Factory performance scores", desc: "QC pass rate, on-time delivery, response time — built automatically from order history. Know which factories to trust with your next run." },
      { icon: Globe, name: "Compliance export", desc: "One-click report with manufacturer details, certifications, payment trail, and QC records. Supports UFLPA, EU CSDDD requirements." },
      { icon: Zap, name: "Production intelligence dashboard", desc: "Cross-order signals: which orders need attention, which reorders are overdue, which factories are running behind. One view across your entire production operation." },
    ]
  }
];

const ALSO_INCLUDED = [
  { name: "RFQ system", desc: "Send one brief to multiple factories. Compare quotes on price, lead time, and MOQ before committing." },
  { name: "AI production assistant", desc: "Full order context. Ask about risk, timing, factory communication — specific to your actual order." },
  { name: "Timezone-aware approvals", desc: "Shows the factory what time it is for you. Flags if requests land outside business hours." },
  { name: "BYOF — Bring Your Own Factory", desc: "Invite your existing factory. They join free. Full platform from day one." },
  { name: "Message translation", desc: "Real-time translation for factory messages. Communicate in any language." },
  { name: "Tech pack guidance", desc: "Built-in checklist of what factories actually need. Reduces revision rounds." },
  { name: "Order timeline", desc: "Chronological log of every event on an order. Invaluable for disputes." },
  { name: "Production calendar", desc: "All active orders plotted by delivery window. See what's due when." },
];

export default function Features() {
  return (
    <Layout>
      <SEO
        title="Features — Sourcery Manufacturing OS"
        description="Document every order, control every payment, and let the platform learn your production patterns. The full Sourcery feature set."
      />

      {/* Hero */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Features</p>
          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            Three things. One platform.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Document everything. Control every payment. Let the platform learn your production. These aren't separate features — they're one system that compounds over time.
          </p>
          <Button asChild className="gap-2">
            <Link to="/auth?mode=signup">Start free <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Three pillars */}
      {PILLARS.map((pillar, i) => {
        const Icon = pillar.icon;
        return (
          <section key={pillar.tag} className="section-padding border-b border-border">
            <div className="container max-w-4xl">
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-5 ${pillar.bg} ${pillar.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {pillar.tag}
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">{pillar.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">{pillar.body}</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {pillar.features.map(f => {
                    const FIcon = f.icon;
                    return (
                      <div key={f.name} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-0.5">{f.name}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* Also included */}
      <section className="section-padding border-b border-border">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-2">Also included</h2>
          <p className="text-muted-foreground mb-8">Everything else that makes the platform complete.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {ALSO_INCLUDED.map(f => (
              <div key={f.name} className="flex gap-2.5 p-3 bg-card border border-border rounded-xl">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Your first order is free.</h2>
          <p className="text-muted-foreground mb-6">No credit card. No time limit. Full platform from day one.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth?mode=signup">Get started free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
