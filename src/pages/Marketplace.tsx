import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Search, Sparkles, BarChart3, GitCompare, Lock, Building2, Shield } from "lucide-react";

const categories = ["Apparel", "Denim", "Outerwear", "Knitwear", "Accessories", "Footwear", "Bags", "Home goods", "Soft goods"];

export default function Marketplace() {
  return (
    <Layout>
      <SEO
        title="Factory Marketplace — Sourcery"
        description="Find vetted manufacturers with real performance scores. Or bring your own factory. Either way, all production runs on the same platform."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Factory marketplace
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                Find your next factory.<br className="hidden md:block" />
                Or bring the one you have.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Browse vetted manufacturers with real performance scores. Get AI-matched to the right factory for your product. Or invite your existing manufacturer and manage every order on the same platform. Both paths. Same infrastructure.
              </p>

              {/* Two paths */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-background border-2 border-primary">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Looking for a factory</p>
                  <h3 className="font-semibold text-foreground text-lg mb-2">Browse the network</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Vetted, verified manufacturers with real performance data. Search by category, location, MOQ, certifications.</p>
                  <Link to="/directory">
                    <Button className="gap-1.5 text-sm">Browse factories <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
                <div className="p-6 rounded-2xl bg-background border border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Already have a factory</p>
                  <h3 className="font-semibold text-foreground text-lg mb-2">Bring your own</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Invite your manufacturer directly. They get a free account. Full OS, same platform, no network required.</p>
                  <Link to="/auth?mode=signup">
                    <Button variant="outline" className="gap-1.5 text-sm">Get started free <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why the marketplace */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Finding the right factory is hard.<br />Trusting one is harder.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most factory directories show you a name and a location. Sourcery shows you a factory's complete production record — every QC result, every defect report, every response time, built from real completed orders. You can confirm a factory is the right fit before you even reach out.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                And once you place an order, everything — the order creation, sampling, revision rounds, QC, payments — runs through the same platform that sourced them. No handover, no starting over.
              </p>
              <div className="space-y-2.5">
                {[
                  "Performance scores built from real order data — not self-reported",
                  "Credential review and certification verification before listing",
                  "Factories with disputes or declining scores are flagged automatically",
                  "Every inquiry and order managed on the same platform",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Score card visual */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Factory performance</p>
                    <p className="font-semibold text-foreground">HU LA Studios</p>
                    <p className="text-xs text-muted-foreground">Ho Chi Minh City, Vietnam</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">9.4</div>
                    <div className="text-xs text-muted-foreground">/ 10</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "QC pass rate", val: "98%", w: 98 },
                    { label: "Response time", val: "< 8hr", w: 92 },
                    { label: "On-time delivery", val: "96%", w: 96 },
                    { label: "Brand retention", val: "91%", w: 91 },
                    { label: "Defect rate", val: "Low", w: 88 },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{m.label}</span>
                        <span className="font-medium text-foreground">{m.val}</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${m.w}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">Built from real completed order data</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI matcher */}
      <section className="section-padding bg-card/50 border-y border-border">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-background border border-border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">AI factory matcher</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Your request</p>
                  <p className="text-sm text-foreground italic">"Premium denim outerwear, 300–500 units, 12-week lead time, prefer Vietnam, GOTS certified if possible"</p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: "HU LA Studios", loc: "Vietnam", score: "9.4", match: "98%" },
                    { name: "████████ Co.", loc: "Vietnam", score: "8.9", match: "94%" },
                    { name: "████████ Ltd.", loc: "Portugal", score: "8.6", match: "87%" },
                  ].map((f, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${i === 0 ? "border-primary/30 bg-primary/3" : "border-border bg-card"}`}>
                      <div>
                        <p className={`text-sm font-medium ${i > 0 ? "blur-sm select-none" : "text-foreground"}`}>{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.loc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-primary font-semibold">{f.match} match</p>
                        <p className="text-xs text-muted-foreground">Score: {f.score}</p>
                      </div>

                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">Factory names visible on Builder and above</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">AI factory matcher</p>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Describe what you need.<br />Get ranked matches.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Not a keyword search. Describe your product, quantity, timeline, and requirements in plain language. The AI reads real factory data — category expertise, order history, QC rates, certifications — and returns ranked matches that actually fit.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The more orders completed on the platform, the better the matching gets. Every order adds to the real data the AI works from.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(c => (
                  <span key={c} className="text-xs px-3 py-1.5 rounded-full bg-secondary border border-border text-foreground">{c}</span>
                ))}
              </div>
              <Link to="/auth?mode=signup&plan=builder">
                <Button className="gap-1.5">Try AI matching — Builder <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Performance scores */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              Scores built from real orders.<br />Not claims.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every factory's performance score is calculated from completed order data on the platform. No self-reporting. No paying for placement. The best-performing factories rank highest.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: BarChart3, title: "QC pass rate", desc: "What % of orders pass quality inspection on the first submission. Calculated from every completed order." },
              { icon: Search, title: "Response time", desc: "Average time to respond to brand messages on active orders. Tracked on every order automatically." },
              { icon: CheckCircle, title: "On-time delivery", desc: "Orders delivered within the agreed delivery window. Logged against every closed order." },
              { icon: Shield, title: "Defect rate", desc: "Defect reports per completed order. Factories must respond to every report — it feeds directly into their score." },
              { icon: Building2, title: "Brand retention", desc: "% of brands that place a second order with the same factory. The strongest signal of real satisfaction." },
              { icon: GitCompare, title: "Score transparency", desc: "Factories see their full score breakdown. Declining trends trigger alerts before they become problems." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="p-5 rounded-xl bg-card border border-border">
                <item.icon className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Identity gating explained */}
      <section className="section-padding bg-card/50 border-y border-border">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Confirm fit before you upgrade.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Free accounts can see every factory's capabilities, categories, certifications, MOQ, lead time, and performance scores. Factory names and contact details are visible on Builder and above.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  This means you can browse the full network, filter by everything that matters, and confirm a factory is exactly what you need — before paying anything.
                </p>
                <Link to="/pricing">
                  <Button variant="outline" className="gap-1.5">See pricing <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Free", items: ["Category + capabilities", "MOQ and lead time", "Certifications", "Performance score", "Country"], locked: ["Factory name", "City", "Contact details"] },
                  { label: "Builder", items: ["Everything above", "Factory name", "City", "Contact directly", "Request quotes"], locked: [] },
                ].map((tier) => (
                  <div key={tier.label} className="p-4 rounded-xl bg-background border border-border">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2.5">{tier.label}</p>
                    <div className="space-y-1.5">
                      {tier.items.map(item => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                          <span className="text-xs text-foreground">{item}</span>
                        </div>
                      ))}
                      {tier.locked.map(item => (
                        <div key={item} className="flex items-center gap-2">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground/50">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* For factories callout */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-card border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">For factories</p>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Join the network free.</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Free to join, free to list, free to receive orders. Build a public performance record that compounds with every order. The best-performing factories get featured placement and priority AI matching.
                </p>
              </div>
              <div className="space-y-2">
                {["Join and list — free", "Receive and manage orders — free", "Build a verified performance score", "Priority AI matching as your score grows"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <Link to="/factories">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">Learn more about factories <ArrowRight className="h-3.5 w-3.5" /></Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50 border-t border-border">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Find your factory. Then manage everything.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The marketplace and the OS are the same platform. Find a factory here, manage every order on the same system. No switching, no starting over.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/directory">
                <Button variant="hero" size="xl">Browse factories <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="hero-outline" size="xl">Start free</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
