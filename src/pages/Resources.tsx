import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Globe, Shield, Truck, Search, TrendingUp, FileText, Zap } from "lucide-react";

const categories = [
  {
    id: "fundamentals",
    icon: BookOpen,
    label: "Production fundamentals",
    desc: "The knowledge experienced buyers have that nobody teaches first-timers.",
    color: "text-primary bg-primary/10 border-primary/20",
    articles: [
      {
        slug: "what-is-aql",
        title: "What is AQL and how do you choose the right standard?",
        sub: "AQL 1.0, 1.5, 2.5, 4.0 — what they mean, what defect rate each allows, and how to pick the right one for your product and risk tolerance.",
        readTime: "5 min",
        tags: ["QC", "Basics"],
      },
      {
        slug: "incoterms-explained",
        title: "Incoterms explained — EXW, FOB, CIF, DDP",
        sub: "The four terms every brand needs to understand. Where your responsibility begins, where the factory's ends, and which one to use for which situation.",
        readTime: "6 min",
        tags: ["Shipping", "Basics"],
      },
      {
        slug: "milestone-payments",
        title: "How milestone payments protect you — and when they don't",
        sub: "The standard 30/40/30 structure, why it exists, when to deviate, and the specific gates that give each milestone its protective power.",
        readTime: "5 min",
        tags: ["Payments", "Basics"],
      },
      {
        slug: "tech-pack-guide",
        title: "What goes in a tech pack — and what happens without one",
        sub: "Every element a factory needs to build your product correctly. Why version control matters and what 'building from the wrong file' actually costs.",
        readTime: "7 min",
        tags: ["Documentation", "Basics"],
      },
      {
        slug: "sampling-rounds",
        title: "How many sampling rounds is normal?",
        sub: "PP samples, GPT samples, TOP samples — what each one is, when to request them, and what a pass actually means before bulk begins.",
        readTime: "4 min",
        tags: ["Sampling", "Basics"],
      },
    ],
  },
  {
    id: "supply-chain",
    icon: Truck,
    label: "Supply chain",
    desc: "How materials, trims, and finished goods move — and where things go wrong.",
    color: "text-amber-700 bg-amber-500/10 border-amber-400/30",
    articles: [
      {
        slug: "garment-supply-chain-map",
        title: "The garment supply chain — every node, every handoff risk",
        sub: "From yarn to your warehouse. What happens at each stage, who controls it, and where brands lose visibility.",
        readTime: "8 min",
        tags: ["Supply chain", "Overview"],
      },
      {
        slug: "trim-coordination",
        title: "Coordinating trim suppliers with garment factories",
        sub: "Buttons, zippers, labels, elastic — how to manage handoffs between suppliers without WhatsApp and hope.",
        readTime: "5 min",
        tags: ["Supply chain", "Trims"],
      },
      {
        slug: "lead-time-stacking",
        title: "Lead time stacking — why brands underestimate production by 6 weeks",
        sub: "Fabric, trims, cut-and-sew, QC, freight — each has its own lead time and most run sequentially. The math that most brands get wrong.",
        readTime: "5 min",
        tags: ["Lead time", "Planning"],
      },
      {
        slug: "bill-of-materials",
        title: "Building a bill of materials that actually works",
        sub: "Every material, trim, and component with supplier, unit, cost, and lead time. Why the spreadsheet always breaks and what to do instead.",
        readTime: "4 min",
        tags: ["BOM", "Documentation"],
      },
      {
        slug: "single-source-risk",
        title: "Single-source dependency — the supply chain risk nobody talks about",
        sub: "If your trim supplier for a critical component goes down, your production stops. How to identify dependencies before they become emergencies.",
        readTime: "4 min",
        tags: ["Risk", "Planning"],
      },
    ],
  },
  {
    id: "traceability",
    icon: Shield,
    label: "Traceability & compliance",
    desc: "What certifications mean, who needs them, and how to verify them.",
    color: "text-green-700 bg-green-500/10 border-green-500/20",
    articles: [
      {
        slug: "gots-bsci-oeko-tex",
        title: "GOTS, BSCI, OEKO-TEX, WRAP — what each certification actually means",
        sub: "The four certifications brands ask about most. Who issues them, what they cover, when you need them, and how to verify a factory actually has them.",
        readTime: "7 min",
        tags: ["Compliance", "Certifications"],
      },
      {
        slug: "factory-auditing",
        title: "How to audit a factory before you commit",
        sub: "What to look for, what questions to ask, what red flags to walk away from. The difference between a factory visit and a real evaluation.",
        readTime: "8 min",
        tags: ["Auditing", "Due diligence"],
      },
      {
        slug: "supply-chain-traceability",
        title: "Supply chain traceability — why it matters more than ever",
        sub: "US and EU regulatory requirements are tightening. What traceability means, who is asking for it, and what you need to document.",
        readTime: "6 min",
        tags: ["Traceability", "Compliance"],
      },
      {
        slug: "rsl-testing",
        title: "RSL testing and chemical compliance",
        sub: "Restricted Substances Lists, Bluesign, REACH — what they require, which markets enforce them, and what a failing test report means for your shipment.",
        readTime: "5 min",
        tags: ["Testing", "Compliance"],
      },
    ],
  },
  {
    id: "markets",
    icon: Globe,
    label: "Market guides",
    desc: "Where to manufacture — real comparisons by category, MOQ, cost, and lead time.",
    color: "text-blue-700 bg-blue-500/10 border-blue-400/30",
    articles: [
      {
        slug: "vietnam-manufacturing-guide",
        title: "Vietnam — the production guide for apparel brands",
        sub: "Why Vietnam became the default for premium garment production, what categories it's strong in, what MOQs to expect, and what questions to ask every factory.",
        readTime: "9 min",
        tags: ["Vietnam", "Market"],
      },
      {
        slug: "vietnam-vs-china",
        title: "Vietnam vs China — which is right for your brand?",
        sub: "Cost, lead time, certifications, category strength, communication, minimum orders. A real comparison, not a generic one.",
        readTime: "7 min",
        tags: ["Vietnam", "China", "Comparison"],
      },
      {
        slug: "portugal-manufacturing",
        title: "Portugal — premium European production for accessible brands",
        sub: "Why Portugal is the move for made-in-Europe positioning, what it actually costs vs Asia, and what categories it does better.",
        readTime: "6 min",
        tags: ["Portugal", "Market"],
      },
      {
        slug: "india-manufacturing",
        title: "India — the underestimated manufacturing hub",
        sub: "Strong on knitwear, hand-embroidery, and artisan categories. What brands miss when they overlook India for apparel production.",
        readTime: "5 min",
        tags: ["India", "Market"],
      },
    ],
  },
  {
    id: "imports-exports",
    icon: TrendingUp,
    label: "Imports & exports",
    desc: "Freight, duties, HTS codes, customs — everything between factory and warehouse.",
    color: "text-purple-700 bg-purple-500/10 border-purple-400/30",
    articles: [
      {
        slug: "landed-cost-calculation",
        title: "How to calculate your real landed cost",
        sub: "FOB price is not your cost. Add freight, insurance, import duties, customs brokerage, and port handling — then you know your real cost per unit.",
        readTime: "6 min",
        tags: ["Landed cost", "Duties"],
      },
      {
        slug: "hts-codes-apparel",
        title: "HTS codes for apparel — why getting them wrong costs money",
        sub: "The Harmonized Tariff Schedule determines your import duty rate. A cotton woven jacket and a cotton knit jacket have different codes — and different rates.",
        readTime: "5 min",
        tags: ["HTS codes", "Duties"],
      },
      {
        slug: "freight-documents",
        title: "Freight documents — what you need and when",
        sub: "Commercial invoice, packing list, bill of lading, certificate of origin, phytosanitary certificates. What each is, who produces it, and what happens if it's missing.",
        readTime: "6 min",
        tags: ["Freight", "Documents"],
      },
      {
        slug: "us-import-duties-apparel",
        title: "US import duties on apparel — what brands actually pay",
        sub: "Denim at 27.9%, knitwear at 32%, synthetic wovens at 28.6%. The real duty rates by category and how to calculate your exposure before committing.",
        readTime: "5 min",
        tags: ["USA", "Duties"],
      },
      {
        slug: "fx-risk-production",
        title: "FX risk in production — why a 3% currency move matters",
        sub: "Your order takes 16 weeks. A lot can happen to VND, RMB, or EUR in 16 weeks. How currency exposure works and when to hedge.",
        readTime: "4 min",
        tags: ["FX", "Finance"],
      },
    ],
  },
  {
    id: "supplier-trust",
    icon: Search,
    label: "Supplier trust",
    desc: "How to evaluate, onboard, and maintain healthy factory relationships.",
    color: "text-rose-700 bg-rose-500/10 border-rose-400/30",
    articles: [
      {
        slug: "evaluating-factory-before-wiring",
        title: "How to evaluate a factory before wiring a deposit",
        sub: "The questions to ask, the documents to request, the red flags to walk away from. What due diligence looks like before $15,000 leaves your account.",
        readTime: "7 min",
        tags: ["Due diligence", "Basics"],
      },
      {
        slug: "factory-relationship-management",
        title: "Managing a factory relationship over time",
        sub: "The dynamics that make a factory a long-term partner vs a recurring problem. Communication, leverage, documentation, and what healthy expectations look like.",
        readTime: "6 min",
        tags: ["Relationships", "Operations"],
      },
      {
        slug: "reading-factory-quote",
        title: "How to read a factory quote — and what to push back on",
        sub: "Every line on a factory quote and what it means. Where there's room to negotiate, where there isn't, and how to frame the conversation.",
        readTime: "5 min",
        tags: ["Negotiation", "Quotes"],
      },
      {
        slug: "dispute-resolution",
        title: "When something goes wrong — factory dispute resolution",
        sub: "What you can and can't do when goods arrive wrong. The leverage you have, the documentation you need, and how to approach the conversation.",
        readTime: "6 min",
        tags: ["Disputes", "Risk"],
      },
    ],
  },
  {
    id: "tariffs-trade",
    icon: TrendingUp,
    label: "Tariffs & trade",
    desc: "How trade policy, tariffs, and shipping disruptions affect your production costs.",
    color: "text-rose-700 bg-rose-500/10 border-rose-400/30",
    articles: [
      {
        slug: "us-tariffs-apparel-2025",
        title: "US tariffs on apparel in 2025 — what brands actually need to know",
        sub: "Section 301 tariffs on China, Vietnam's tariff status, GSP expiry, and how to calculate your real duty exposure before committing to a sourcing decision.",
        readTime: "8 min",
        tags: ["Tariffs", "USA", "Trade policy"],
      },
      {
        slug: "vietnam-tariff-status",
        title: "Vietnam's tariff status — current rates and what's changing",
        sub: "Vietnam enjoys favourable tariff treatment in most markets but that position is under review. What the current rates are, what's at risk, and how to plan around uncertainty.",
        readTime: "6 min",
        tags: ["Vietnam", "Tariffs"],
      },
      {
        slug: "supply-chain-disruption-playbook",
        title: "When supply chains break — the brand playbook",
        sub: "Port congestion, factory shutdowns, freight rate spikes, raw material shortages. What to do when the supply chain breaks and how to build resilience before it does.",
        readTime: "7 min",
        tags: ["Disruption", "Risk"],
      },
      {
        slug: "ocean-freight-rates-explained",
        title: "Ocean freight rates — how they work and why they spike",
        sub: "Why a container that cost $2,000 in 2019 cost $15,000 in 2021 and $1,800 in 2024. How spot rates, contract rates, and surcharges work — and how to protect against volatility.",
        readTime: "6 min",
        tags: ["Freight", "Logistics"],
      },
      {
        slug: "china-plus-one",
        title: "China Plus One — the sourcing diversification strategy explained",
        sub: "Why brands are diversifying production out of China, where they're going, and how to evaluate whether it makes sense for your specific product and volume.",
        readTime: "7 min",
        tags: ["China", "Strategy"],
      },
    ],
  },
];

const featuredArticle = {
  title: "The garment supply chain — every node, every handoff risk",
  sub: "Most brands manage production with two active relationships: the garment factory and the freight forwarder. Everything in between is invisible. Here's the full map — and where things go wrong.",
  category: "Supply chain",
  readTime: "8 min",
  slug: "garment-supply-chain-map",
};

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? categories.filter(c => c.id === activeCategory)
    : categories;

  return (
    <Layout>
      <SEO
        title="Production resources — Sourcery"
        description="Everything brands need to know about production — AQL, incoterms, supply chain, compliance certifications, import duties, factory evaluation, and market guides."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)] border-b border-border">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">Production resources</p>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                Everything production requires you to know.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                AQL standards, incoterms, supply chain traceability, compliance certifications, import duties, factory evaluation, market guides. The knowledge experienced buyers carry instinctively — documented for everyone.
              </p>
            </motion.div>

            {/* Featured article */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Link to={`/resources/${featuredArticle.slug}`}>
                <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{featuredArticle.category}</span>
                    <span className="text-xs text-muted-foreground">{featuredArticle.readTime} read</span>
                  </div>
                  <h2 className="font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{featuredArticle.sub}</p>
                  <div className="flex items-center gap-1.5 text-primary text-sm font-medium">
                    Read <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="border-b border-border bg-background sticky top-16 z-10">
        <div className="container-wide overflow-x-auto">
          <div className="flex items-center gap-1 py-3 min-w-max">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!activeCategory ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              All
            </button>
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                >
                  <Icon className="h-3 w-3" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Articles */}
      <section className="section-padding">
        <div className="container-wide space-y-14">
          {filtered.map((cat, ci) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.05 }}
              >
                {/* Category header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${cat.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-foreground">{cat.label}</h2>
                      <p className="text-sm text-muted-foreground">{cat.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Article grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.articles.map((article, ai) => (
                    <Link key={ai} to={`/resources/${article.slug}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ai * 0.04 }}
                        className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:-translate-y-0.5 group h-full flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex gap-1.5 flex-wrap">
                            {article.tags.map((tag, ti) => (
                              <span key={ti} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{article.readTime}</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors flex-1">
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{article.sub}</p>
                        <div className="flex items-center gap-1 text-primary text-xs font-medium mt-auto">
                          Read <ArrowRight className="h-3 w-3" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Intelligence feed teaser */}
      <section className="section-padding bg-card/50 border-t border-border">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">Supply chain intelligence — coming soon</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">In development</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Weekly briefings on freight rate movements, trade policy changes, regulatory updates, and market shifts — curated for brands sourcing from Asia. Current, specific, and opinionated. Not a news aggregator.
                </p>
                <Link to="/intelligence">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    See the intelligence feed <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Knowledge is one thing. A system is another.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Sourcery puts everything you've learned here into an infrastructure that enforces it — gates, records, and a production assistant that answers specific questions on every live order.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">Start your first order free <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/assistant">
                <Button variant="hero-outline" size="xl">Meet the assistant</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
