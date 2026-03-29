import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, CheckCircle, TrendingUp, Package, Star } from "lucide-react";

export default function Factories() {
  return (
    <Layout>
      <SEO
        title="For Factories — Sourcery"
        description="Join the Sourcery network free. Build a verified performance record that compounds with every order. Better clients, structured orders, real reputation."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                For factories
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                Structured orders, serious brands,<br className="hidden md:block" />
                and a reputation that builds with every run.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Brands on Sourcery come with clear specs and structured payment milestones. Every completed order builds your verified performance record — the longer you work on the platform, the more your reputation works for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/apply">
                  <Button variant="hero" size="xl">
                    Apply to the network <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/auth?mode=signup&type=factory">
                  <Button variant="hero-outline" size="xl">
                    Accept a brand invite
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-card border border-border">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">A brand invited you</p>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Accept the invite and start immediately.</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                If a brand you work with sent you an invite, accept it, complete your profile, and you're connected. No application needed. You start receiving structured orders from that brand right away.
              </p>
              <Link to="/auth?mode=signup&type=factory">
                <Button size="sm" className="gap-1.5">Accept invite <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }} className="p-8 rounded-2xl bg-card border border-border">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">Join the marketplace</p>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Apply and get discovered by new brands.</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Apply to the Sourcery network, complete a credential review, and build a public profile. Brands searching for your category see your capabilities, certifications, and growing performance record.
              </p>
<Link to="/apply"><Button size="sm" variant="outline" className="gap-1.5 text-xs">Apply <ArrowRight className="h-3 w-3" /></Button></Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What changes for factories */}
      <section className="section-padding bg-card/50 border-y border-border">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">What working through Sourcery means for you.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Orders arrive differently. Payments are structured. And every order you complete builds something that works in your favour permanently.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Package,
                title: "Orders that arrive with everything you need.",
                sub: "No more chasing specs.",
                desc: "Brands on Sourcery create structured POs — versioned tech packs, documented AQL standards, clear QC requirements, milestone payment terms. Every order arrives with the information you need to build correctly.",
              },
              {
                icon: TrendingUp,
                title: "Payments with clear, agreed terms.",
                sub: "No more chasing payment.",
                desc: "Every order has documented payment milestones both sides agree to before production begins. Terms are visible to both parties on the platform — no ambiguity about when and what gets released.",
              },
              {
                icon: Star,
                title: "A performance record that compounds.",
                sub: "Your track record becomes your ranking.",
                desc: "Every completed order on the platform adds to your public performance record — QC results, response times, on-time delivery, brand retention. It starts from zero and builds permanently. High-performing factories get priority placement over time.",
              },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="p-6 rounded-2xl bg-background border border-border">
                <item.icon className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-primary font-medium mb-3">{item.sub}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance score */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Your track record becomes your ranking.</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sourcery scores build from completed order data on the platform. Factories can't pay for better placement. The score starts from zero and the only way to build it is through real orders.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Factories with high scores get featured placement in search results and priority matching in the AI matcher — meaning more brands see your profile first.
              </p>
              <div className="space-y-2.5">
                {[
                  "QC pass rate — from every completed order",
                  "Response time — tracked on every active order",
                  "On-time delivery — logged against every closed order",
                  "Defect rate — reported by brands, factory-acknowledged",
                  "Brand retention — % of brands that reorder",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-card border border-border rounded-2xl p-6">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">What happens as your score builds over time</p>
                <div className="space-y-4">
                  {[
                    { score: "7.0+", label: "Listed in network", desc: "Your profile appears in search results. Brands can see your capabilities and certifications. Score begins building from your first completed order." },
                    { score: "8.0+", label: "Verified badge", desc: "Verified status shown on your profile. Higher placement in search results." },
                    { score: "9.0+", label: "Elite status", desc: "Featured placement. Priority in AI matching. First seen by brands searching your category." },
                  ].map((tier, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-background border border-border">
                      <div className="text-xl font-bold text-primary flex-shrink-0 w-12 text-center">{tier.score}</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-0.5">{tier.label}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{tier.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Always free */}
      <section className="section-padding bg-card/50 border-y border-border">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Free to join. Free forever.</h2>
              <p className="text-muted-foreground">Sourcery charges brands. Factories join, list, and operate on the platform at no cost.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {[
                "Join the network",
                "Complete factory profile",
                "Receive and manage orders",
                "Sample submission + revision rounds",
                "Performance score tracking",
                "On-platform messaging",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-background border border-border">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                  <span className="ml-auto text-xs text-primary font-medium">Free</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What joining looks like */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Less chaos. More clarity. Starting from the first order.</h2>
            <p className="text-muted-foreground leading-relaxed max-w-xl">
              You don't need to change how you produce. You just get a better system around it — one that works in your language, tracks everything automatically, and makes you look more professional to every brand you work with.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                label: "Clarity",
                title: "No more unclear orders.",
                body: "Every order that comes through has the spec, timeline, payment milestones, and QC standard already defined. You know exactly what's being asked before you say yes.",
              },
              {
                label: "Language",
                title: "Work in Vietnamese or Chinese.",
                body: "A language selector on your dashboard and in every message thread. You write the way you think. Brands read in their language. No misunderstandings from rough translation.",
              },
              {
                label: "Protection",
                title: "A record that protects you too.",
                body: "Every spec change, revision, and message is timestamped and attached to the order. If there's ever a disagreement about what was agreed, the record is there for both sides.",
              },
              {
                label: "Payments",
                title: "You always know what triggers the next payment.",
                body: "Each milestone is defined at the start — what needs to happen, what gets released. No chasing. No ambiguity. The structure is the agreement.",
              },
              {
                label: "AI tools",
                title: "Production intelligence built in.",
                body: "Order summaries so you always know where things stand. Suggested responses when a brand asks something complex. Smart tools that help you manage multiple orders without losing track.",
              },
              {
                label: "Reputation",
                title: "Every order builds your track record.",
                body: "QC pass rate, response times, on-time delivery — all tracked automatically from real orders. The longer you're on platform, the stronger your profile gets.",
              },
              {
                label: "Visibility",
                title: "Brands looking for you can find you.",
                body: "Your factory profile is searchable by category, MOQ, certifications, and location. Inbound interest from brands who match what you actually produce.",
              },
              {
                label: "Community",
                title: "Part of a network, not just a listing.",
                body: "Sourcery is a two-sided community — brands and factories both participating, both building reputations. The platform grows more valuable the more people use it.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl bg-card border border-border"
              >
                <span className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 block">{item.label}</span>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ready to join the network?</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Free to join. No fees on any order. Build a public performance record that works for you permanently.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/apply">
                <Button variant="hero" size="xl">Apply to the network <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/auth?mode=signup&type=factory">
                <Button variant="hero-outline" size="xl">Accept a brand invite</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
