import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Search, Sparkles, BarChart3, Lock, Building2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["Apparel", "Denim", "Outerwear", "Knitwear", "Accessories", "Footwear", "Bags", "Home goods", "Soft goods"];

const whyPoints = [
  "Performance scores that build with every completed order — not self-reported",
  "Credential review and certification verification before listing",
  "Factories with declining scores are flagged automatically",
  "Every inquiry and order managed on the same platform",
];

const aiMatches = [
  { name: "HU LA Studios", loc: "Vietnam", match: "Top match", locked: false },
  { name: "████████ Co.", loc: "Vietnam", match: "Strong match", locked: true },
  { name: "████████ Ltd.", loc: "Portugal", match: "Good match", locked: true },
];

const scoreCards = [
  { icon: BarChart3, title: "QC pass rate", desc: "What % of orders pass quality inspection on first submission. Calculated from every order completed on platform — starts empty, compounds over time." },
  { icon: Search, title: "Response time", desc: "Average time to respond to brand messages on active orders. Tracked automatically." },
  { icon: CheckCircle, title: "On-time delivery", desc: "Orders delivered within the agreed window. Logged against every closed order." },
  { icon: Shield, title: "Defect rate", desc: "Defect reports per completed order. Factories must respond to every report." },
  { icon: Building2, title: "Brand retention", desc: "% of brands that place a second order. The strongest signal of real satisfaction." },
  { icon: BarChart3, title: "Score transparency", desc: "Factories see their full breakdown. Declining trends trigger alerts before they become problems." },
];

const freeTierItems = ["Category + capabilities", "MOQ and lead time", "Certifications", "Performance score", "Country"];
const freeTierLocked = ["Factory name", "City", "Contact details"];
const builderTierItems = ["Everything above", "Factory name", "City", "Contact directly", "Request quotes"];

const factoryPerks = ["Join and list — free", "Receive and manage orders — free", "Build a verified performance score", "Priority AI matching as your score grows"];

export default function Marketplace() {
  return (
    <Layout>
      <SEO
        title="Factory Marketplace — Sourcery"
        description="Find vetted manufacturers with verified credentials. Or bring your own factory. Both paths run on the same platform."
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
                A small network of factories you can actually trust.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                The Sourcery marketplace is intentionally small. Every factory is personally evaluated before listing — categories verified, capabilities confirmed, credentials checked. We'd rather show you four manufacturers you can trust than fifty you'd have to filter through yourself.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                We're a new platform and the network is growing. If you have a factory you work with and trust, invite them directly — that's what BYOF is for.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-background border-2 border-primary">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Looking for a factory</p>
                  <h3 className="font-semibold text-foreground text-lg mb-2">Browse the network</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Vetted, verified manufacturers with real performance data.</p>
                  <Link to="/directory">
                    <Button className="gap-1.5 text-sm">Browse factories <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
                <div className="p-6 rounded-2xl bg-background border border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Already have a factory</p>
                  <h3 className="font-semibold text-foreground text-lg mb-2">Bring your own</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Invite your manufacturer directly. Free account. Full OS immediately.</p>
                  <Link to="/auth?mode=signup">
                    <Button variant="outline" className="gap-1.5 text-sm">Get started free <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                See credentials before you commit to anything.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Locking in a 30% deposit before you've seen real data on a manufacturer is one of the most stressful moments in production. A good sample is useful — but it doesn't tell you QC pass rates, response time, or how the factory handles disputes.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every factory in the Sourcery network has been personally evaluated. You see what they're verified for, what categories they produce, their MOQ range, and a performance record that builds from real completed orders. Browse before you reach out. Reach out before you commit.
              </p>
              <div className="space-y-2.5">
                {whyPoints.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Factory profile</p>
                    <p className="font-semibold text-foreground">HU LA Studios</p>
                    <p className="text-xs text-muted-foreground">Ho Chi Minh City, Vietnam</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <p className="text-xs font-semibold text-primary">Verified</p>
                  </div>
                </div>
                <div className="space-y-0 mb-5">
                  {[
                    { label: "Categories", val: "Denim, Outerwear, Woven" },
                    { label: "MOQ", val: "300 units" },
                    { label: "Lead time", val: "10–14 weeks" },
                    { label: "Location", val: "Ho Chi Minh City, Vietnam" },
                    { label: "Certifications", val: "ISO 9001, WRAP" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between text-xs py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-medium text-foreground">{m.val}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 text-center">
                  <p className="text-xs text-muted-foreground">Performance record builds from the first order placed on platform</p>
                </div>
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
                  {aiMatches.map((f, i) => (
                    <div key={i} className={cn("flex items-center justify-between p-3 rounded-lg border", i === 0 ? "border-primary/30 bg-primary/5" : "border-border bg-card")}>
                      <div>
                        <p className={cn("text-sm font-medium", f.locked ? "blur-sm select-none text-foreground" : "text-foreground")}>{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.loc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-primary font-semibold">{f.match}</p>
                
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
                Not a keyword search. Describe your product, quantity, timeline, and requirements in plain language. The AI reads real factory data and returns ranked matches that actually fit.
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
              Scores that build with every order. Not claims.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every completed order on the platform contributes to a factory's performance score. No self-reporting. No paying for placement. The score builds from zero — transparently — from the first order placed.
            </p>
            <div className="mt-6 p-5 rounded-xl bg-card border border-border max-w-2xl mx-auto text-left">
              <p className="text-sm font-semibold text-foreground mb-1.5">We're building this network carefully.</p>
              <p className="text-sm text-muted-foreground leading-relaxed">Sourcery is a new platform. The factory network is intentionally small right now — every manufacturer is personally evaluated before listing. We'd rather grow slowly with factories we can stand behind than list broadly and leave brands to figure out who's reliable. Have a factory you trust and would like to recommend? <Link to="/contact" className="text-primary hover:underline">Reach out.</Link></p>
            </div>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scoreCards.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="p-5 rounded-xl bg-card border border-border">
                <item.icon className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Identity gating */}
      <section className="section-padding bg-card/50 border-y border-border">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Confirm fit before you upgrade.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Free accounts see capabilities, certifications, MOQ, lead time, and any performance score already built. Factory names and contact details are visible on Builder and above.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Browse the full network and confirm a factory is exactly right before paying anything.
                </p>
                <Link to="/pricing">
                  <Button variant="outline" className="gap-1.5">See pricing <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
              <div className="space-y-3">
                {/* Free tier */}
                <div className="p-4 rounded-xl bg-background border border-border">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2.5">Free</p>
                  <div className="space-y-1.5">
                    {freeTierItems.map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-foreground">{item}</span>
                      </div>
                    ))}
                    {freeTierLocked.map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground/50">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Builder tier */}
                <div className="p-4 rounded-xl bg-background border border-border">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2.5">Builder</p>
                  <div className="space-y-1.5">
                    {builderTierItems.map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* For factories */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-card border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">For factories</p>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Join the network free.</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Free to join, free to list, free to receive orders. Build a public performance record that compounds with every order.
                </p>
              </div>
              <div className="space-y-2.5">
                {factoryPerks.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <Link to="/factories">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">Learn more <ArrowRight className="h-3.5 w-3.5" /></Button>
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
              The marketplace and the OS are the same platform. Find a factory here, manage every order on the same system.
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
