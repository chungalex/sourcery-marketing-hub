import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ProductionAssistant } from "@/components/va/ProductionAssistant";
import { ArrowRight, Sparkles, FileText, MessageSquare, TrendingUp, Search, Shield, Clock } from "lucide-react";

const capabilities = [
  {
    icon: Search,
    stage: "Before you commit",
    headline: "Is this factory quote reasonable?",
    body: "The assistant draws on your own order history — what you paid this factory before, what your previous quotes looked like, what revisions came up last time. It also applies deep production expertise: what's realistic for this factory location, this product category, this order volume. It tells you if something looks off and where to push back — based on your data and real production knowledge, not other brands' private information.",
    examples: ["Is this lead time realistic for this order?", "Should I be worried about this MOQ?", "What incoterms should I use for this order?"],
  },
  {
    icon: FileText,
    stage: "During production",
    headline: "What's happening on this order right now?",
    body: "The assistant reads your full order record — every message, every milestone, every revision — and gives you a plain-English briefing. Ask it to summarise the week, flag what needs your attention, or tell you if the factory is behind.",
    examples: ["Summarise what's happened this week", "Is the factory behind on this order?", "What do I need to do next?"],
  },
  {
    icon: MessageSquare,
    stage: "Communication",
    headline: "Draft a message to the factory.",
    body: "Describe what you need to say and the assistant drafts it — professionally, in the right tone, in Vietnamese or Chinese if needed. It knows the order context so the message is specific, not generic. No more staring at a blank message field.",
    examples: ["Draft a message about this spec change", "How do I push back on this timeline professionally?", "Write a follow-up on the missing revision"],
  },
  {
    icon: Shield,
    stage: "When things go wrong",
    headline: "Is this defect serious? What's my leverage?",
    body: "When something goes wrong, the assistant reads the full order record and tells you exactly where you stand. What was agreed, what was delivered, what the documented discrepancy is, and what your options are before you release the final payment.",
    examples: ["What are my options on this defect?", "Is the documented revision enough to withhold payment?", "Draft a formal dispute summary"],
  },
  {
    icon: TrendingUp,
    stage: "Supply chain",
    headline: "When do I need to order trims to hit this delivery?",
    body: "The assistant knows your BOM, your factory location, your delivery window, and your trim supplier lead times. It works backwards from the delivery date and tells you the exact date you need to place your trim order — and flags if you've already missed it.",
    examples: ["When do I need to order trims?", "What's my real landed cost if freight goes up 20%?", "Which currency exposure do I have on open orders?"],
  },
  {
    icon: Clock,
    stage: "Institutional memory",
    headline: "What went wrong last time with this factory?",
    body: "The assistant reads your entire order history with a factory — every QC result, every revision round, every defect, every dispute. Before you reorder, it tells you what to spec differently and what to watch for. Your institutional knowledge doesn't live in anyone's inbox.",
    examples: ["What changed last time we ran this style?", "Which factory has our best QC pass rate?", "What issues should I carry forward to the reorder?"],
  },
];

const orderSuggested = [
  "Is this lead time realistic?",
  "What could go wrong here?",
  "Draft a message to the factory",
  "What do I need to do next?",
];

export default function Assistant() {
  return (
    <Layout>
      <SEO
        title="Production Assistant — Sourcery"
        description="An AI assistant that knows your order. Not a generic chatbot — a production expert with full context on every order, factory, and decision in your operation."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Production assistant</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Pro</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                An AI that knows your order. Not just production in general.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-xl">
                Every question you ask the production assistant is answered in the context of your actual order — your factory, your spec, your milestone status, your message thread. Not a generic chatbot. A production expert who has read everything before you ask.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Ask it about risk, timing, factory communication, defect leverage, supply chain timing, landed cost — anything. Every conversation is logged against the order record.
              </p>
              <div className="flex gap-3 mt-8 flex-wrap">
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button>
                </Link>
                <Link to="/walkthrough">
                  <Button variant="hero-outline" size="xl">See the walkthrough</Button>
                </Link>
              </div>
            </motion.div>

            {/* Live demo */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <ProductionAssistant mode="demo" className="w-full shadow-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What makes it different */}
      <section className="section-padding border-b border-border">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              The difference between a chatbot and a production assistant.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              You can ask ChatGPT "what's a fair price for 500 denim jackets in Vietnam?" and get a generic answer. The Sourcery assistant knows your factory's quote history, what you paid last season, your BOM, your delivery window, and your open milestones. The answer it gives is about your order — and only your order. Your production data is never used to answer questions for other brands.
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  label: "Generic AI",
                  points: [
                    "No order context",
                    "No factory history",
                    "Generic production advice",
                    "No connection to your data",
                    "Conversation disappears",
                  ],
                  bad: true,
                },
                {
                  label: "Sourcery assistant — on an order",
                  points: [
                    "Knows your order number, status, milestones",
                    "Knows your factory name and location",
                    "Has read your message thread",
                    "Knows your spec and revision history",
                    "Every conversation logged against the order",
                  ],
                  bad: false,
                },
                {
                  label: "Sourcery assistant — on the dashboard",
                  points: [
                    "Knows all your active orders",
                    "Knows your factory performance history",
                    "Flags orders that need attention",
                    "Tracks open exposure across all orders",
                    "Answers portfolio-level questions",
                  ],
                  bad: false,
                },
              ].map((col, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`p-6 rounded-2xl border ${col.bad ? "bg-card border-border opacity-60" : "bg-primary/5 border-primary/20"}`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-4 ${col.bad ? "text-muted-foreground" : "text-primary"}`}>
                    {col.label}
                  </p>
                  <div className="space-y-2">
                    {col.points.map((p, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className={`text-xs mt-0.5 flex-shrink-0 ${col.bad ? "text-muted-foreground" : "text-primary"}`}>
                          {col.bad ? "—" : "✓"}
                        </span>
                        <span className="text-sm text-foreground">{p}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Six capabilities */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              What it actually does.
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Six capabilities across the full production lifecycle. Every answer grounded in your own order data — your factory, your spec, your history. Never any other brand's.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <cap.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cap.stage}</span>
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{cap.headline}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cap.body}</p>
                <div className="space-y-1.5 pt-4 border-t border-border">
                  {cap.examples.map((ex, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-xs text-primary mt-0.5 flex-shrink-0">→</span>
                      <span className="text-xs text-muted-foreground italic">"{ex}"</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Where it lives */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              Where it lives.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              The assistant is available in three places — each with a different level of context.
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  title: "Inside every order",
                  sub: "Highest context",
                  body: "The assistant opens with your full order record loaded — number, status, factory, milestones, spec, and the entire message thread. Every question is answered in the context of that specific order.",
                  badge: "Pro feature",
                },
                {
                  title: "On your dashboard",
                  sub: "Portfolio context",
                  body: "A floating assistant on your production dashboard. Knows all your active orders across all factories. Tells you which orders need attention, which factories are performing, and what your exposure is.",
                  badge: "Pro feature",
                },
                {
                  title: "On this page",
                  sub: "Before you sign up",
                  body: "Ask production questions before you commit to anything. Incoterms, lead times, factory evaluation, freight documents — the assistant answers genuinely. Once you're in, it answers specifically.",
                  badge: "Available now",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-xl bg-background border border-border"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${i === 2 ? "bg-secondary text-muted-foreground border border-border" : "bg-primary/10 text-primary border border-primary/20"}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-primary mb-2">{item.sub}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The logged record */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Every conversation becomes part of the order record.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              This is what separates the production assistant from any other AI tool. When you ask "should I be worried about this lead time?" and the assistant tells you it's tight based on this factory's history — that question and answer are logged against the order. Six months later in a dispute, that's evidence. You didn't just make a decision — you documented it.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  title: "Decisions are documented",
                  body: "Every recommendation the assistant gives is logged with a timestamp. When someone asks later why a spec was approved or why a timeline was accepted, the answer is in the record.",
                },
                {
                  title: "Context survives team changes",
                  body: "When a new production manager joins, they can ask the assistant what happened on any previous order and get a full briefing. Institutional knowledge doesn't live in anyone's inbox.",
                },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live demo section */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  Try it now.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ask a real production question. This is the demo mode — it answers genuinely without order context. On a live order, it answers in the context of your specific factory, spec, and milestone status.
                </p>
                <div className="space-y-2">
                  {[
                    "What incoterms should I use for a Vietnam order?",
                    "How do I know if a factory lead time is realistic?",
                    "What documents do I need to import apparel into the US?",
                    "How do milestone payments protect me as a buyer?",
                    "What's a fair AQL standard for garment production?",
                  ].map((q, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs text-primary mt-0.5">→</span>
                      <span className="text-sm text-muted-foreground italic">"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>
              <ProductionAssistant mode="demo" className="w-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Discretion notice */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="p-6 rounded-xl bg-card border border-border">
              <h2 className="font-heading text-lg font-bold text-foreground mb-3">
                Use the assistant with discretion.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The production assistant is built to help — with real production knowledge, grounded in your actual order context. We do everything we can to give you the best tools AI's capabilities allow. But it is still AI, and AI can be wrong.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Treat every answer as a well-informed starting point, not a final word. Verify figures — duty rates, freight costs, lead time estimates, AQL standards — against authoritative sources before making decisions. The assistant's job is to give you the right direction fast. Your job is to confirm before you act on it.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Production intelligence on every order.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The production assistant is included in every Pro plan. Your first order is free on any plan.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/pricing">
                <Button variant="hero-outline" size="xl">See Pro plan</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
