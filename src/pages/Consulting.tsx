import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { 
  ArrowRight, 
  Calculator, 
  Users, 
  Shield, 
  Sparkles, 
  CheckCircle,
  Globe,
  Clock,
  MessageSquare,
  Award
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [orderValue, setOrderValue] = useState([100000]);
  const [selectedCategory, setSelectedCategory] = useState("Apparel");

  // ROI calculations based on case study data
  const roiData = useMemo(() => {
    const benchmark = categoryBenchmarks[selectedCategory];
    const orderAmount = orderValue[0];
    
    // Conservative estimates based on case study results
    const potentialSavings = orderAmount * benchmark.avgCostReduction;
    const defectCostAvoided = orderAmount * 0.08 * benchmark.avgDefectReduction;
    const leadTimeSavings = (benchmark.avgLeadTimeReduction * 4) * 2500;
    const totalImpact = potentialSavings + defectCostAvoided + leadTimeSavings;
    const sourceryFee = orderAmount * 0.03;
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
