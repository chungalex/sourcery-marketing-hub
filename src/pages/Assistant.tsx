import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ProductionAssistant } from "@/components/va/ProductionAssistant";
import { ArrowRight, Sparkles, FileText, MessageSquare, TrendingUp, Search, Shield, Clock, Info } from "lucide-react";

const capabilities = [
  {
    icon: Search,
    stage: "Before you commit",
    headline: "Is this quote reasonable for this type of order?",
    body: "Ask before you sign anything. The assistant applies production expertise — what's realistic for this factory location, this product category, this volume — and helps you know where to push back.",
    examples: ["Is this lead time realistic?", "What incoterms should I use?", "Should I be worried about this MOQ?"],
  },
  {
    icon: FileText,
    stage: "During production",
    headline: "What needs my attention right now?",
    body: "Get a plain-English summary of where your order stands — what's happened, what's next, whether anything looks off. No hunting through message threads.",
    examples: ["Summarise this order for me", "Is anything behind schedule?", "What do I need to do next?"],
  },
  {
    icon: MessageSquare,
    stage: "Communication",
    headline: "Help me write this message to the factory.",
    body: "Describe what you need to say. The assistant drafts it — professional tone, specific to your order, in Vietnamese or Chinese if needed.",
    examples: ["Draft a message about this spec change", "How do I push back on this timeline?", "Write a follow-up on the missing revision"],
  },
  {
    icon: Shield,
    stage: "When things go wrong",
    headline: "What are my options here?",
    body: "When something goes wrong, the assistant helps you understand what was agreed, what was delivered, and what leverage you have before you release the final payment.",
    examples: ["Is this defect serious enough to withhold payment?", "What's my position on this dispute?", "Draft a formal defect summary"],
  },
  {
    icon: TrendingUp,
    stage: "Supply chain",
    headline: "When do I need to order trims to hit this delivery?",
    body: "Ask supply chain timing questions based on your actual delivery window and BOM. The assistant works the numbers so you don't have to.",
    examples: ["When do I need to place my trim order?", "What's my real landed cost if freight goes up?", "Walk me through the timeline on this order"],
  },
  {
    icon: Clock,
    stage: "Reordering",
    headline: "What should I do differently this time?",
    body: "Before you reorder a style, ask what happened last time — QC results, revision rounds, defects, factory notes. Don't repeat avoidable mistakes.",
    examples: ["What changed on the last run of this style?", "Any issues I should carry forward?", "Which factory performed best on this category?"],
  },
];

export default function Assistant() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || undefined;
  return (
    <Layout>
      <SEO
        title="Production Assistant — Sourcery"
        description="A production assistant that works with your order context — not a generic chatbot. Get specific answers on any active order, fast."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Production assistant</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Pro</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                Get specific answers on your production — not generic advice.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-xl">
                The production assistant works with the context of your active order — factory, specs, milestones, timeline — so every answer is relevant to your actual situation. No re-explaining. No generic responses.
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-xl mb-4">
                Ask it anything: whether a quote looks right, what to say to the factory, how your timeline is tracking, what your options are when something goes wrong.
              </p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 max-w-xl mb-8">
                <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use with discretion. The assistant is a well-informed starting point — always verify numbers and decisions against your own sources before acting.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button>
                </Link>
                <Link to="/walkthrough">
                  <Button variant="hero-outline" size="xl">See the walkthrough</Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero right — closed by default, inviting */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Try a production question</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                This is demo mode — no order context. Ask anything about production and get a real answer. On a live order, answers are specific to your factory, spec, and timeline.
              </p>
              <div className="space-y-1.5 mb-5">
                {[
                  "What incoterms should I use for Vietnam?",
                  "Is a 12-week lead time realistic for 500 garments?",
                  "What documents do I need to import into the US?",
                  "How do milestone payments protect me?",
                ].map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs text-primary mt-0.5 flex-shrink-0">→</span>
                    <span className="text-xs text-muted-foreground italic">"{q}"</span>
                  </div>
                ))}
              </div>
              <ProductionAssistant mode="demo" initialQuery={initialQuery} className="w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it's different — simpler, less scary */}
      <section className="section-padding border-b border-border">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
              Why it's more useful than a general AI tool.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Ask ChatGPT "is this lead time reasonable?" and you get a general answer. Ask the Sourcery assistant the same question on an active order, and the answer is based on that specific factory, your delivery window, and the current milestone status. The difference is context — your order context, used only to answer your questions.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  title: "Without order context",
                  items: ["Generic production advice", "You have to re-explain your situation every time", "No connection to your actual factory or timeline", "Answers based on general knowledge only"],
                  muted: true,
                },
                {
                  title: "With your order context",
                  items: ["Answers specific to your factory, spec, and timeline", "No re-explaining — the context is already there", "Advice grounded in what's actually in your order", "Your data stays yours — never shared with other users"],
                  muted: false,
                },
              ].map((col, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`p-6 rounded-2xl border ${col.muted ? "bg-card border-border" : "bg-primary/5 border-primary/20"}`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-4 ${col.muted ? "text-muted-foreground" : "text-primary"}`}>
                    {col.title}
                  </p>
                  <div className="space-y-2.5">
                    {col.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2.5">
                        <span className={`text-sm mt-0.5 flex-shrink-0 ${col.muted ? "text-muted-foreground" : "text-primary"}`}>
                          {col.muted ? "—" : "✓"}
                        </span>
                        <span className="text-sm text-foreground leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Six capabilities — tighter cards */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
              What you can ask it.
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              Six types of questions across the full production lifecycle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <cap.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cap.stage}</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-2 leading-snug">{cap.headline}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{cap.body}</p>
                <div className="space-y-1 pt-3 border-t border-border">
                  {cap.examples.map((ex, j) => (
                    <div key={j} className="flex items-start gap-1.5">
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

      {/* Where it lives — simplified */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
              Available in three places.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
              The more context it has, the more specific the answers.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  num: "01",
                  title: "Inside an active order",
                  body: "Works with that order's factory, specs, milestones, and message history. Best for order-specific questions.",
                  badge: "Pro",
                  primary: true,
                },
                {
                  num: "02",
                  title: "On your dashboard",
                  body: "Works across all your active orders. Good for portfolio questions — what needs attention, how factories are performing.",
                  badge: "Pro",
                  primary: true,
                },
                {
                  num: "03",
                  title: "On this page",
                  body: "No account needed. Answers general production questions — incoterms, lead times, factory evaluation, freight. Good starting point.",
                  badge: "Free",
                  primary: false,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-xl bg-background border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-muted-foreground">{item.num}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.primary ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary text-muted-foreground border border-border"}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Paper trail — reframed positively */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
              Decisions saved to your order record.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              When the assistant helps you think through a decision — whether to approve a sample, how to respond to a defect, whether a timeline is realistic — that conversation is saved against the order. Six months later, you have a record of what you considered and why you decided. That's useful in a dispute, and useful when you reorder.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "A record of your decisions",
                  body: "If someone asks why a timeline was accepted or a spec was approved, the conversation is there. You don't have to reconstruct it from memory.",
                },
                {
                  title: "Context that transfers",
                  body: "When a new person joins the team, they can get up to speed on any order without relying on what's in someone else's inbox.",
                },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-5 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold text-foreground text-sm mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Better answers on every order.
            </h2>
            <p className="text-muted-foreground mb-2 max-w-md mx-auto">
              Included in every Pro plan. Your first order is free on any plan.
            </p>
            <p className="text-xs text-muted-foreground mb-8 max-w-md mx-auto">
              Use with discretion — treat answers as a starting point and verify before acting.
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
