import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, AlertTriangle, Info, TrendingUp, ExternalLink } from "lucide-react";

const briefs = [
  {
    date: "Sample brief — March 2026",
    isSample: true,
    headline: "Freight rates holding steady; Vietnam tariff scrutiny increases",
    summary: "Ocean freight on Asia-US routes remained broadly stable through February after the Red Sea disruption premium eased. The Freightos Baltic Index (FBX) shows Shanghai-LA at approximately $2,100 per 40-foot container, down from a Q3 2024 peak above $7,000. Brands with Q2 production should book freight now before the pre-summer peak typically seen in April.",
    items: [
      {
        type: "freight",
        label: "Freight",
        headline: "Asia-US spot rates: ~$2,100 per 40ft (FBX, March 2026)",
        detail: "Rates have stabilised following the Red Sea disruption premium. Peak season surcharges expected from April. Book Q2 freight by end of March for best rates.",
        source: "Freightos Baltic Index",
        sourceUrl: "https://www.freightos.com/freight-resources/freightos-baltic-index-fbi/",
        sentiment: "neutral",
      },
      {
        type: "tariffs",
        label: "Trade policy",
        headline: "Vietnam origin scrutiny: USTR reviewing substantial transformation rules",
        detail: "The USTR is actively reviewing whether goods assembled in Vietnam using Chinese inputs qualify for Vietnamese origin. Brands sourcing fabric from China and sewing in Vietnam should verify their supply chain meets substantial transformation requirements. This is evolving — monitor official USTR announcements.",
        source: "USTR.gov",
        sourceUrl: "https://ustr.gov",
        sentiment: "watch",
      },
      {
        type: "market",
        label: "Market",
        headline: "Cotton prices: stable at $0.72-0.78/lb after Q4 2025 volatility",
        detail: "Cotton spot prices have normalised after a volatile Q4. US cotton (ICE futures) trading in the $0.72-0.78/lb range. For brands with cotton-heavy BOM, current pricing represents a reasonable forward-purchasing window if your factory is open to locking in fabric pricing.",
        source: "ICE Futures / World Bank",
        sourceUrl: "https://www.worldbank.org/en/research/commodity-markets",
        sentiment: "stable",
      },
    ],
    disclaimer: "This brief is AI-generated from publicly available sources including Freightos, USTR.gov, and World Bank commodity data. Figures are sourced but should be independently verified before making production or financial decisions. Sources and publication dates are linked for your reference.",
  },
];

const sentimentConfig = {
  neutral: { label: "Stable", className: "text-muted-foreground bg-secondary border-border" },
  watch: { label: "Monitor", className: "text-amber-700 bg-amber-500/10 border-amber-400/30" },
  stable: { label: "Stable", className: "text-green-700 bg-green-500/10 border-green-500/20" },
  risk: { label: "Risk", className: "text-rose-700 bg-rose-500/10 border-rose-400/30" },
};

const sources = [
  { name: "Freightos Baltic Index", desc: "Daily ocean freight spot rates by route", url: "https://www.freightos.com/freight-resources/freightos-baltic-index-fbi/" },
  { name: "USTR.gov", desc: "US trade policy, tariff announcements, trade agreement updates", url: "https://ustr.gov" },
  { name: "US Federal Register", desc: "Regulatory and tariff changes the day they publish", url: "https://www.federalregister.gov" },
  { name: "World Bank Commodity Prices", desc: "Cotton, wool, synthetic fibre price data", url: "https://www.worldbank.org/en/research/commodity-markets" },
  { name: "CBP.gov", desc: "US Customs duty rates and enforcement updates", url: "https://www.cbp.gov" },
];

export default function Intelligence() {
  return (
    <Layout>
      <SEO
        title="Supply chain intelligence — Sourcery"
        description="Weekly supply chain briefings for apparel brands — freight rates, trade policy, tariff changes, and market moves. AI-synthesised from public data sources, fully disclosed."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)] border-b border-border">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">Supply chain intelligence</p>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                  Current intelligence, not generic news.
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Weekly briefings on freight rates, trade policy, tariff changes, and market moves — curated specifically for brands sourcing from Asia. AI-synthesised from live public data sources, with full methodology disclosure on every brief.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Not a news aggregator. A filtered signal with context for production decisions.
                </p>
              </div>

              {/* How it works */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">How this works — fully disclosed</p>
                </div>
                <div className="space-y-3">
                  {[
                    { step: "1", text: "Weekly automated pull from public data sources — Freightos, USTR.gov, Federal Register, World Bank, CBP.gov." },
                    { step: "2", text: "AI synthesis using the Anthropic API — raw data is summarised in plain language with production relevance explained." },
                    { step: "3", text: "Every figure is linked to its source. Dates of original publication are shown. Nothing is presented without attribution." },
                    { step: "4", text: "Disclaimer on every brief: verify before acting. These are starting points for research, not confirmed facts." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-0.5">{item.step}</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sample brief */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-400/30 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">This is a sample brief showing the format</p>
              <p className="text-sm text-muted-foreground">Live weekly briefs require signing up. Every brief includes a disclaimer and links to all source data. Figures should be independently verified before making production decisions.</p>
            </div>
          </div>

          {briefs.map((brief, bi) => (
            <motion.div key={bi} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {/* Brief header */}
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{brief.date}</p>
                  <h2 className="font-heading text-xl font-bold text-foreground">{brief.headline}</h2>
                </div>
              </div>

              {/* Brief summary */}
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">{brief.summary}</p>

              {/* Items */}
              <div className="space-y-4 mb-8">
                {brief.items.map((item, ii) => {
                  const sc = sentimentConfig[item.sentiment as keyof typeof sentimentConfig];
                  return (
                    <div key={ii} className="p-5 rounded-xl bg-card border border-border">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{item.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${sc.className}`}>{sc.label}</span>
                        </div>
                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                          {item.source} <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.headline}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                    </div>
                  );
                })}
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{brief.disclaimer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Data sources */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Data sources</h2>
            <p className="text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Every brief draws from public sources only. No proprietary data. No paid research. The links are provided so you can verify independently — and should.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {sources.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors group"
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{s.name}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Why we show our sources:</span> AI-generated summaries of live data can contain errors. Showing every source means you can verify every number independently. We'd rather you check and trust us than take our word for it.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Get weekly briefs when they publish.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Sign up free. Briefs go out every Monday. Unsubscribe any time.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">Get started free <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/resources">
                <Button variant="hero-outline" size="xl">Browse resource library</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
