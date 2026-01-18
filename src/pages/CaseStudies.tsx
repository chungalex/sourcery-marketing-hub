import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Quote, TrendingUp, Shield, Clock, Package, Calculator, Users, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const industries = [
  "All",
  "Apparel",
  "Home & Kitchen",
  "Furniture",
  "Beauty",
  "Outdoor",
];

// ROI data based on actual case studies
const categoryBenchmarks: Record<string, {
  avgCostReduction: number;
  avgDefectReduction: number;
  avgLeadTimeReduction: number;
  caseStudyBrand: string;
  highlight: string;
}> = {
  "Apparel": {
    avgCostReduction: 0.25,
    avgDefectReduction: 0.98,
    avgLeadTimeReduction: 0.40,
    caseStudyBrand: "Urban Essentials",
    highlight: "3x production capacity, 98.5% on-time delivery",
  },
  "Home & Kitchen": {
    avgCostReduction: 0.45,
    avgDefectReduction: 1.0,
    avgLeadTimeReduction: 0.30,
    caseStudyBrand: "Heritage Goods Co.",
    highlight: "45% cost reduction, zero defects in 10K units",
  },
  "Furniture": {
    avgCostReduction: 0.20,
    avgDefectReduction: 0.95,
    avgLeadTimeReduction: 0.25,
    caseStudyBrand: "Coastal Living",
    highlight: "100% recycled materials certified, 20% premium justified",
  },
  "Beauty": {
    avgCostReduction: 0.30,
    avgDefectReduction: 0.99,
    avgLeadTimeReduction: 0.50,
    caseStudyBrand: "Nova Beauty",
    highlight: "50% faster production, 99% fill rate achieved",
  },
  "Outdoor": {
    avgCostReduction: 0.35,
    avgDefectReduction: 0.99,
    avgLeadTimeReduction: 0.35,
    caseStudyBrand: "Summit Outdoor",
    highlight: "10x volume growth, <1% defect rate",
  },
};

const caseStudies = [
  {
    brand: "Heritage Goods Co.",
    category: "Home & Kitchen",
    headline: "Saved $67,500 on First Order",
    featured: true,
    challenge: "Needed to find a factory for their new line of artisan ceramics while maintaining strict quality standards and keeping costs competitive. Their previous supplier was charging a 15% premium with ongoing quality issues.",
    solution: "We matched them with a family-owned ceramic manufacturer in Portugal with 40+ years of experience and helped negotiate favorable terms including extended payment windows.",
    results: [
      { metric: "45%", label: "Cost reduction" },
      { metric: "0", label: "Defects in 10K units" },
      { metric: "3 weeks", label: "Faster lead time" },
    ],
    quote: "Sourcery found us the perfect factory on the first try. The quality exceeded our expectations and the process was completely painless.",
    quoteName: "Sarah Chen",
    quoteRole: "Founder, Heritage Goods Co.",
  },
  {
    brand: "Urban Essentials",
    category: "Apparel",
    headline: "3x Production Capacity in 60 Days",
    featured: false,
    challenge: "Rapid growth meant their existing factory couldn't keep up with demand. They needed to add capacity quickly without compromising the quality that built their brand.",
    solution: "We identified and vetted 3 additional factories across Vietnam and Bangladesh, creating a diversified supply chain with milestone-based payments and QC gating.",
    results: [
      { metric: "3x", label: "Production capacity" },
      { metric: "30-day", label: "Payment terms" },
      { metric: "98.5%", label: "On-time delivery" },
    ],
    quote: "We went from constant stockouts to having the capacity to meet any demand. Sourcery's QC process gives us total confidence.",
    quoteName: "Michael Torres",
    quoteRole: "COO, Urban Essentials",
  },
  {
    brand: "Coastal Living",
    category: "Furniture",
    headline: "Launched Sustainable Line with 100% Recycled Materials",
    featured: false,
    challenge: "Launching a new outdoor furniture line required finding manufacturers who could work with sustainable recycled ocean plastic materials at scale—a rare capability.",
    solution: "We sourced recycled ocean plastic suppliers and matched them with furniture manufacturers in Indonesia experienced in sustainable production and certification.",
    results: [
      { metric: "100%", label: "Recycled certified" },
      { metric: "3", label: "Sustainability features" },
      { metric: "20%", label: "Premium justified" },
    ],
    quote: "They understood our sustainability requirements from day one and found partners who shared our values. Game-changer for our brand story.",
    quoteName: "Emma Fitzgerald",
    quoteRole: "CEO, Coastal Living",
  },
  {
    brand: "Nova Beauty",
    category: "Beauty",
    headline: "Cut Production Time by 50%",
    featured: false,
    challenge: "Long lead times and communication gaps with their overseas cosmetics factory were creating inventory nightmares and missed launch dates for seasonal products.",
    solution: "We introduced milestone tracking and real-time communication protocols, then matched them with a second factory for redundancy during peak seasons.",
    results: [
      { metric: "50%", label: "Faster production" },
      { metric: "99%", label: "Fill rate achieved" },
      { metric: "Real-time", label: "Order visibility" },
    ],
    quote: "The visibility into our supply chain changed everything for inventory planning. We haven't missed a launch date since.",
    quoteName: "Jessica Park",
    quoteRole: "VP Operations, Nova Beauty",
  },
  {
    brand: "Summit Outdoor",
    category: "Outdoor",
    headline: "Scaled from 5K to 50K Units Without Quality Issues",
    featured: false,
    challenge: "First-time importing technical outdoor gear at scale. They were worried about factory capability, quality control, and protecting their investment on a large initial order.",
    solution: "We vetted factories with technical gear experience, implemented pre-shipment inspections, and structured milestone payments to protect their capital until quality was confirmed.",
    results: [
      { metric: "10x", label: "Volume growth" },
      { metric: "<1%", label: "Defect rate" },
      { metric: "0", label: "Returns from QC issues" },
    ],
    quote: "We had zero returns from quality issues on our first major order. The QC caught everything before it shipped.",
    quoteName: "David Huang",
    quoteRole: "Founder, Summit Outdoor",
  },
];

const stats = [
  { value: "500+", label: "Brands Served" },
  { value: "$15M+", label: "Orders Protected" },
  { value: "98.5%", label: "On-Time Delivery" },
];

const consultingServices = [
  {
    icon: Users,
    title: "Factory Sourcing",
    description: "We find, vet, and negotiate with factories on your behalf. Flat project fee.",
    price: "From $2,500",
    slug: "factory-sourcing",
  },
  {
    icon: Shield,
    title: "Supply Chain Audit",
    description: "Comprehensive review of your current suppliers with actionable recommendations.",
    price: "From $1,500",
    slug: "supply-chain-audit",
  },
  {
    icon: Sparkles,
    title: "Launch Strategy",
    description: "End-to-end production planning for new product launches. Timeline, costing, risk mitigation.",
    price: "From $3,500",
    slug: "launch-strategy",
  },
];

export default function CaseStudies() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [orderValue, setOrderValue] = useState([100000]);
  const [selectedCategory, setSelectedCategory] = useState("Apparel");

  const filteredStudies = caseStudies.filter(
    (study) => activeFilter === "All" || study.category === activeFilter
  );

  const featuredStudy = caseStudies.find((study) => study.featured);
  const otherStudies = filteredStudies.filter((study) => !study.featured);

  // ROI calculations based on case study data
  const roiData = useMemo(() => {
    const benchmark = categoryBenchmarks[selectedCategory];
    const orderAmount = orderValue[0];
    
    // Conservative estimates based on case study results
    const potentialSavings = orderAmount * benchmark.avgCostReduction;
    const defectCostAvoided = orderAmount * 0.08 * benchmark.avgDefectReduction; // 8% typical defect cost
    const leadTimeSavings = (benchmark.avgLeadTimeReduction * 4) * 2500; // weeks saved * weekly holding cost
    const totalImpact = potentialSavings + defectCostAvoided + leadTimeSavings;
    const sourceryFee = orderAmount * 0.03; // 3% standard fee
    const netBenefit = totalImpact - sourceryFee;
    const roi = ((netBenefit) / sourceryFee) * 100;

    return {
      potentialSavings,
      defectCostAvoided,
      leadTimeSavings,
      totalImpact,
      sourceryFee,
      netBenefit,
      roi,
      benchmark,
    };
  }, [orderValue, selectedCategory]);

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
              Customer Success Stories
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              See how brands like yours transformed their manufacturing with Sourcery.
            </p>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap gap-8 pt-4 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-heading font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="section-padding">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Calculator className="h-4 w-4" />
                ROI Calculator
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Estimate Your Savings
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Based on actual results from brands in your category. Adjust the inputs to see your potential ROI.
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              {/* Inputs */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Annual Order Value
                  </label>
                  <div className="mb-3">
                    <span className="text-3xl font-heading font-bold text-foreground">
                      ${orderValue[0].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={orderValue}
                    onValueChange={setOrderValue}
                    min={25000}
                    max={1000000}
                    step={25000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>$25K</span>
                    <span>$1M</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Product Category
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(categoryBenchmarks).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-3">
                    Based on: <span className="text-foreground font-medium">{roiData.benchmark.caseStudyBrand}</span>
                  </p>
                  <p className="text-xs text-primary mt-1">{roiData.benchmark.highlight}</p>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Cost Reduction</p>
                  <p className="text-xl font-heading font-bold text-foreground">
                    ${Math.round(roiData.potentialSavings).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{(roiData.benchmark.avgCostReduction * 100).toFixed(0)}% savings</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Defects Avoided</p>
                  <p className="text-xl font-heading font-bold text-foreground">
                    ${Math.round(roiData.defectCostAvoided).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{(roiData.benchmark.avgDefectReduction * 100).toFixed(0)}% reduction</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Lead Time Value</p>
                  <p className="text-xl font-heading font-bold text-foreground">
                    ${Math.round(roiData.leadTimeSavings).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{(roiData.benchmark.avgLeadTimeReduction * 100).toFixed(0)}% faster</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Sourcery Fee</p>
                  <p className="text-xl font-heading font-bold text-foreground">
                    ${Math.round(roiData.sourceryFee).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">3% of order value</p>
                </div>
              </div>

              {/* Total Impact */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Impact</p>
                    <p className="text-3xl font-heading font-bold text-foreground">
                      ${Math.round(roiData.totalImpact).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Net Benefit</p>
                    <p className="text-3xl font-heading font-bold text-primary">
                      ${Math.round(roiData.netBenefit).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Return on Investment</p>
                    <p className="text-3xl font-heading font-bold text-primary">
                      {Math.round(roiData.roi)}%
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                *Estimates based on actual case study results. Individual results may vary based on order complexity and factory relationships.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Case Study */}
      {featuredStudy && (
        <section className="section-padding bg-card/50">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              {/* Content */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Featured
                  </span>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {featuredStudy.category}
                  </span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {featuredStudy.brand}
                </h2>
                <p className="text-xl text-primary font-semibold mb-6">
                  {featuredStudy.headline}
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      Challenge
                    </h4>
                    <p className="text-muted-foreground">{featuredStudy.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      Solution
                    </h4>
                    <p className="text-muted-foreground">{featuredStudy.solution}</p>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  {featuredStudy.results.map((result) => (
                    <div key={result.label} className="text-center">
                      <p className="text-2xl font-heading font-bold text-primary">{result.metric}</p>
                      <p className="text-xs text-muted-foreground">{result.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote Card */}
              <div className="bg-foreground text-background rounded-2xl p-8 lg:p-10 relative">
                <Quote className="w-10 h-10 text-primary/30 absolute top-6 left-6" />
                <blockquote className="pt-10">
                  <p className="text-xl leading-relaxed mb-8">{featuredStudy.quote}</p>
                  <footer>
                    <p className="font-heading font-semibold text-lg">{featuredStudy.quoteName}</p>
                    <p className="text-background/70">{featuredStudy.quoteRole}</p>
                  </footer>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filter + Case Study Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {/* Industry Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setActiveFilter(industry)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeFilter === industry
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {industry}
              </button>
            ))}
          </div>

          {/* Case Study Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherStudies.map((study, index) => (
              <motion.div
                key={study.brand}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {study.category}
                  </span>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>

                {/* Brand + Headline */}
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {study.brand}
                </h3>
                <p className="text-primary font-semibold text-sm mb-4">
                  {study.headline}
                </p>

                {/* Challenge Summary */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {study.challenge}
                </p>

                {/* Key Metrics */}
                <div className="flex gap-4 mb-4 pt-4 border-t border-border">
                  {study.results.slice(0, 2).map((result) => (
                    <div key={result.label}>
                      <p className="text-lg font-heading font-bold text-foreground">{result.metric}</p>
                      <p className="text-xs text-muted-foreground">{result.label}</p>
                    </div>
                  ))}
                </div>

                {/* Quote Snippet */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-muted-foreground italic line-clamp-2">
                    "{study.quote}"
                  </p>
                  <p className="text-xs text-foreground font-medium mt-2">
                    — {study.quoteName}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consulting Services */}
      <section className="section-padding bg-gradient-to-br from-muted/30 to-muted/60">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <MessageSquare className="h-4 w-4" />
                Consulting Services
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Need Hands-On Help?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Our sourcing experts can handle the heavy lifting. One-time projects, no ongoing commitment.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {consultingServices.map((service) => (
                <Link
                  key={service.title}
                  to={`/contact?type=consulting&service=${service.slug}`}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-primary font-semibold">{service.price}</p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-foreground text-background rounded-2xl p-8 text-center">
              <h3 className="font-heading text-xl font-bold mb-2">
                Custom Project?
              </h3>
              <p className="text-background/70 mb-6 max-w-md mx-auto">
                Need something specific? Let's talk about your requirements and build a custom scope.
              </p>
              <Link to="/contact?type=consulting">
                <Button variant="outline" className="bg-transparent border-background/30 text-background hover:bg-background/10">
                  Schedule a Consultation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
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
              Join 500+ brands who've transformed their manufacturing with Sourcery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/factories">
                <Button variant="hero" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="xl">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
