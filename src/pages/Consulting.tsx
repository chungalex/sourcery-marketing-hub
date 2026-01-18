import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Shield, 
  Sparkles, 
  CheckCircle,
  Globe,
  Clock,
  MessageSquare,
  Award,
  Quote
} from "lucide-react";

// Case study results by category
const caseStudyResults: Record<string, {
  brand: string;
  headline: string;
  results: { metric: string; label: string }[];
  quote: string;
  quoteName: string;
  quoteRole: string;
}> = {
  "Apparel": {
    brand: "Urban Essentials",
    headline: "3x Production Capacity in 60 Days",
    results: [
      { metric: "3x", label: "Production capacity" },
      { metric: "30-day", label: "Payment terms" },
      { metric: "98.5%", label: "On-time delivery" },
    ],
    quote: "We went from constant stockouts to having the capacity to meet any demand.",
    quoteName: "Michael Torres",
    quoteRole: "COO, Urban Essentials",
  },
  "Home & Kitchen": {
    brand: "Heritage Goods Co.",
    headline: "Saved $67,500 on First Order",
    results: [
      { metric: "45%", label: "Cost reduction" },
      { metric: "0", label: "Defects in 10K units" },
      { metric: "3 weeks", label: "Faster lead time" },
    ],
    quote: "Sourcery found us the perfect factory on the first try.",
    quoteName: "Sarah Chen",
    quoteRole: "Founder, Heritage Goods Co.",
  },
  "Furniture": {
    brand: "Coastal Living",
    headline: "Launched Sustainable Line with 100% Recycled Materials",
    results: [
      { metric: "100%", label: "Recycled certified" },
      { metric: "3", label: "Sustainability certs" },
      { metric: "20%", label: "Premium justified" },
    ],
    quote: "They found partners who shared our values. Game-changer for our brand story.",
    quoteName: "Emma Fitzgerald",
    quoteRole: "CEO, Coastal Living",
  },
  "Beauty": {
    brand: "Nova Beauty",
    headline: "Cut Production Time by 50%",
    results: [
      { metric: "50%", label: "Faster production" },
      { metric: "99%", label: "Fill rate achieved" },
      { metric: "Real-time", label: "Order visibility" },
    ],
    quote: "We haven't missed a launch date since working with Sourcery.",
    quoteName: "Jessica Park",
    quoteRole: "VP Operations, Nova Beauty",
  },
  "Outdoor": {
    brand: "Summit Outdoor",
    headline: "Scaled from 5K to 50K Units",
    results: [
      { metric: "10x", label: "Volume growth" },
      { metric: "<1%", label: "Defect rate" },
      { metric: "0", label: "QC-related returns" },
    ],
    quote: "Zero returns from quality issues on our first major order.",
    quoteName: "David Huang",
    quoteRole: "Founder, Summit Outdoor",
  },
};

const categories = Object.keys(caseStudyResults);

const consultingServices = [
  {
    icon: Users,
    title: "Factory Sourcing",
    description: "We find, vet, and negotiate with factories on your behalf. Get matched with the right manufacturers for your specific product requirements.",
    features: [
      "Custom factory shortlist (3-5 vetted options)",
      "On-site factory audits",
      "Price negotiation support",
      "Contract review and terms optimization",
      "Sample coordination",
    ],
    price: "From $2,500",
    slug: "factory-sourcing",
    timeline: "2-4 weeks",
  },
  {
    icon: Shield,
    title: "Supply Chain Audit",
    description: "Comprehensive review of your current suppliers with actionable recommendations to reduce risk and improve efficiency.",
    features: [
      "Supplier capability assessment",
      "Risk and compliance review",
      "Cost structure analysis",
      "Quality system evaluation",
      "Improvement roadmap",
    ],
    price: "From $1,500",
    slug: "supply-chain-audit",
    timeline: "1-2 weeks",
  },
  {
    icon: Sparkles,
    title: "Launch Strategy",
    description: "End-to-end production planning for new product launches. Timeline, costing, risk mitigation—everything you need for a successful launch.",
    features: [
      "Production timeline planning",
      "Full costing breakdown",
      "Risk assessment and mitigation",
      "Supplier selection strategy",
      "Quality control framework",
    ],
    price: "From $3,500",
    slug: "launch-strategy",
    timeline: "2-3 weeks",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Discovery Call",
    description: "30-minute call to understand your specific needs, timeline, and budget constraints.",
  },
  {
    step: "02",
    title: "Custom Proposal",
    description: "We'll send you a detailed scope, timeline, and fixed-price proposal within 48 hours.",
  },
  {
    step: "03",
    title: "Execution",
    description: "Our team handles the research, vetting, and negotiations. You stay informed at every step.",
  },
  {
    step: "04",
    title: "Handoff",
    description: "Complete documentation, introductions to suppliers, and optional ongoing support.",
  },
];

const expertise = [
  {
    icon: Award,
    stat: "50+",
    label: "Years Combined Experience",
  },
  {
    icon: CheckCircle,
    stat: "500+",
    label: "Successful Projects",
  },
  {
    icon: Globe,
    stat: "2,000+",
    label: "Vetted Factories",
  },
  {
    icon: MessageSquare,
    stat: "4",
    label: "Languages Spoken",
  },
];

export default function Consulting() {
  const [selectedCategory, setSelectedCategory] = useState("Home & Kitchen");
  const currentCaseStudy = caseStudyResults[selectedCategory];

  return (
    <Layout>
      <SEO
        title="Consulting Services | Sourcery"
        description="Expert sourcing consulting for brands. Factory sourcing, supply chain audits, and launch strategy from experienced manufacturing professionals."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <MessageSquare className="h-4 w-4" />
              Done-For-You Services
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Expert Sourcing Consulting
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Work directly with our manufacturing experts on your specific challenges. 
              One-time projects, fixed pricing, no ongoing commitment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact?type=consulting">
                <Button variant="hero" size="xl">
                  Schedule a Call
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#services">
                <Button variant="outline" size="xl">
                  View Services
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expertise Stats */}
      <section className="py-12 border-b border-border">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {expertise.map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-heading font-bold text-foreground">{item.stat}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Results Browser */}
      <section className="section-padding">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <TrendingUp className="h-4 w-4" />
                Real Results
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                What Brands Have Achieved
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Browse actual results from brands we've worked with across different industries.
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Case Study Content */}
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Brand Header */}
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Case Study</p>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    {currentCaseStudy.brand}
                  </h3>
                  <p className="text-lg text-primary font-semibold">
                    {currentCaseStudy.headline}
                  </p>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {currentCaseStudy.results.map((result) => (
                    <div key={result.label} className="bg-muted/50 rounded-xl p-4 text-center">
                      <p className="text-2xl md:text-3xl font-heading font-bold text-primary">
                        {result.metric}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{result.label}</p>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="bg-foreground text-background rounded-xl p-6 relative">
                  <Quote className="w-8 h-8 text-primary/30 absolute top-4 left-4" />
                  <blockquote className="pl-8">
                    <p className="text-lg leading-relaxed mb-4 italic">
                      "{currentCaseStudy.quote}"
                    </p>
                    <footer>
                      <p className="font-semibold">{currentCaseStudy.quoteName}</p>
                      <p className="text-sm text-background/70">{currentCaseStudy.quoteRole}</p>
                    </footer>
                  </blockquote>
                </div>
              </motion.div>

              <div className="text-center mt-6">
                <Link to="/case-studies">
                  <Button variant="link" className="text-primary">
                    View All Case Studies →
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consulting Services */}
      <section id="services" className="section-padding bg-muted/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Our Services
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose the service that fits your needs. All projects include full documentation and ongoing support options.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {consultingServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-8 flex flex-col"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-6 flex-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-heading font-bold text-foreground">{service.price}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {service.timeline}
                      </p>
                    </div>
                  </div>
                  <Link to={`/contact?type=consulting&service=${service.slug}`} className="block">
                    <Button className="w-full" variant="outline">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A simple, transparent process from first call to final handoff.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-5xl font-heading font-bold text-primary/20 mb-4">
                  {step.step}
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-border -ml-3" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Project CTA */}
      <section className="section-padding bg-foreground">
        <div className="container max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-background mb-4">
              Need Something Specific?
            </h2>
            <p className="text-background/70 text-lg mb-8 max-w-xl mx-auto">
              Every brand has unique challenges. Let's talk about your requirements and build a custom scope together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact?type=consulting">
                <Button 
                  variant="outline" 
                  size="xl"
                  className="bg-transparent border-background/30 text-background hover:bg-background/10"
                >
                  Schedule a Consultation
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/case-studies">
                <Button 
                  variant="ghost" 
                  size="xl"
                  className="text-background hover:bg-background/10"
                >
                  View Case Studies
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
