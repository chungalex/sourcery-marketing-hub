import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Quote } from "lucide-react";

const caseStudies = [
  {
    brand: "Heritage Goods Co.",
    category: "Home & Kitchen",
    challenge: "Needed to find a factory for their new line of artisan ceramics while maintaining strict quality standards and keeping costs competitive.",
    solution: "We matched them with a family-owned ceramic manufacturer in Portugal with 40+ years of experience and helped negotiate favorable terms.",
    results: [
      "45% cost reduction vs. previous supplier",
      "Zero defects across 10,000 unit order",
      "3-week faster lead time",
    ],
    quote: "Sourcery found us the perfect factory on the first try. The quality exceeded our expectations and the process was completely painless.",
    quoteName: "Sarah Chen",
    quoteRole: "Founder, Heritage Goods Co.",
  },
  {
    brand: "Urban Essentials",
    category: "Apparel",
    challenge: "Rapid growth meant their existing factory couldn't keep up with demand. They needed to add capacity without compromising quality.",
    solution: "We identified and vetted 3 additional factories across Vietnam and Bangladesh, creating a diversified supply chain.",
    results: [
      "3x production capacity",
      "30-day payment terms negotiated",
      "98.5% on-time delivery rate",
    ],
    quote: "We went from constant stockouts to having the capacity to meet any demand. Sourcery's QC process gives us total confidence.",
    quoteName: "Michael Torres",
    quoteRole: "COO, Urban Essentials",
  },
  {
    brand: "Coastal Living",
    category: "Furniture",
    challenge: "Launching a new outdoor furniture line required finding manufacturers who could work with sustainable materials at scale.",
    solution: "We sourced recycled ocean plastic suppliers and matched them with furniture manufacturers in Indonesia experienced in sustainable production.",
    results: [
      "100% recycled materials certified",
      "Featured in 3 major sustainability reports",
      "20% premium price justified",
    ],
    quote: "They understood our sustainability requirements from day one and found partners who shared our values. Game-changer for our brand story.",
    quoteName: "Emma Fitzgerald",
    quoteRole: "CEO, Coastal Living",
  },
];

export default function CaseStudies() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              See how brands across industries have transformed their manufacturing operations with Sourcery's help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.brand}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-12"
              >
                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                    {study.category}
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {study.brand}
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-heading font-semibold text-foreground mb-1">Challenge</h4>
                      <p className="text-muted-foreground text-sm">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-foreground mb-1">Solution</h4>
                      <p className="text-muted-foreground text-sm">{study.solution}</p>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-4 mb-6">
                    <h4 className="font-heading font-semibold text-foreground mb-3">Results</h4>
                    <ul className="space-y-2">
                      {study.results.map((result) => (
                        <li key={result} className="flex items-center gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quote Card */}
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""} flex items-center`}>
                  <div className="bg-foreground text-background rounded-2xl p-8 relative">
                    <Quote className="w-8 h-8 text-primary/50 absolute top-6 left-6" />
                    <blockquote className="pt-8">
                      <p className="text-lg leading-relaxed mb-6">{study.quote}</p>
                      <footer>
                        <p className="font-heading font-semibold">{study.quoteName}</p>
                        <p className="text-background/70 text-sm">{study.quoteRole}</p>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container-tight text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join 200+ brands who've transformed their manufacturing with Sourcery.
            </p>
            <Link to="/contact?type=sourcing">
              <Button variant="hero" size="xl">
                Request Sourcing
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
