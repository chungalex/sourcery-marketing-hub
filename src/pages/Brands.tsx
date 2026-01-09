import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, CheckCircle, Shield, Clock, TrendingUp, Users, Zap, Handshake } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const benefits = [
  {
    icon: Handshake,
    title: "Pre-Negotiated Rates",
    description: "We've already audited and negotiated with every factory in our network. Competitive pricing and favorable terms are secured before you even start.",
  },
  {
    icon: Shield,
    title: "Risk Mitigation",
    description: "Every factory undergoes rigorous vetting including facility audits, compliance checks, and production capability assessment.",
  },
  {
    icon: Clock,
    title: "Faster Time to Market",
    description: "Skip months of factory research. We match you with qualified manufacturers within 48 hours of your initial inquiry.",
  },
  {
    icon: TrendingUp,
    title: "Cost Optimization",
    description: "Leverage our buying power and pre-negotiated terms to get the best pricing without compromising quality.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Your personal sourcing manager handles all factory communication, eliminating timezone and language barriers.",
  },
  {
    icon: Zap,
    title: "Real-Time Visibility",
    description: "Track every order through our dashboard with live updates on production status, QC results, and shipping.",
  },
];

const idealFor = [
  "Direct-to-consumer brands launching new products",
  "Established retailers expanding into private label",
  "Startups looking to scale from prototype to production",
  "Brands diversifying their manufacturing base",
  "Companies seeking more reliable supply chains",
];

const vettingFaqs = [
  {
    question: "How do you vet factories before adding them to your network?",
    answer: "Every factory goes through a multi-step vetting process. We start with document verification (business licenses, certifications, export permits), followed by a virtual or on-site facility audit assessing production capacity, equipment, and working conditions. We also review their production history, request references from existing clients, and evaluate sample quality. Only factories that meet our standards across all criteria are approved.",
  },
  {
    question: "What does 'pre-negotiated terms' actually mean?",
    answer: "We work with factories to establish baseline pricing tiers, payment terms, and production timelines before they join our network. This gives you a starting point with competitive rates from vetted partners. However, this doesn't guarantee the lowest prices in the market—there may be other factories elsewhere offering different rates. You're always free to negotiate further, compare options, and determine the best price for your specific needs. We simply ensure the factories in our network are reliable and that initial terms are fair and transparent.",
  },
  {
    question: "Do I still need to do my own due diligence?",
    answer: "Yes, absolutely. While our vetting reduces risk significantly, we always recommend brands conduct their own verification. This includes requesting samples, reviewing certifications relevant to your industry, starting with smaller trial orders, and visiting factories when possible. Our vetting is a strong first filter, not a replacement for your own judgment.",
  },
  {
    question: "What certifications do you look for in factories?",
    answer: "We verify a range of certifications depending on the industry: GOTS, OEKO-TEX, and BCI for sustainable textiles; ISO 9001 for quality management; BSCI and SMETA for social compliance; FDA registration for food and cosmetics. We display all verified certifications on factory profiles so you can filter based on your requirements.",
  },
  {
    question: "What happens if there are disputes or quality issues?",
    answer: "Once you connect with a factory, all negotiations, production management, and dispute resolution are between you and the factory directly. We provide tools like quality checklists, contract templates, and supplier scorecards to help you manage relationships effectively—but we don't act as an intermediary or handle disputes on your behalf. This is why we emphasize doing your own due diligence and starting with smaller trial orders.",
  },
  {
    question: "Can I negotiate my own terms directly with factories?",
    answer: "Absolutely. Our pre-negotiated terms provide a baseline, but you have full freedom to negotiate pricing, payment schedules, and production terms directly with any factory. Many brands secure better rates as their order volumes grow or as they build longer-term relationships with factories.",
  },
];

export default function Brands() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                For Brands
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Scale Production Without the Headaches
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-4">
                We've built a network of 500+ vetted factories so you don't have to. Get matched with the right manufacturer, manage production seamlessly, and deliver quality products—every time.
              </p>
              <p className="text-lg text-primary font-medium mb-8">
                Every factory pre-audited and pre-negotiated — competitive rates secured on your behalf.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact?type=sourcing">
                  <Button variant="hero" size="xl">
                    Request Sourcing
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/case-studies">
                  <Button variant="hero-outline" size="xl">
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-card rounded-2xl border border-border p-8 shadow-card-lg">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-6">
                  Ideal for
                </h3>
                <ul className="space-y-4">
                  {idealFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Brands Choose Sourcery
            </h2>
            <p className="text-lg text-muted-foreground">
              We've helped 200+ brands navigate the complexities of manufacturing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Preview */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Process
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              From inquiry to delivery, we handle every step so you can focus on growing your brand.
            </p>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                See How It Works
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Vetting & Negotiation FAQ */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              How We Vet & Partner with Factories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparency is core to how we work. Here's everything you need to know about our factory vetting and negotiation process.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {vettingFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border">
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-foreground text-background p-8 md:p-12 text-center"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Start Your Sourcing Journey
            </h2>
            <p className="text-background/70 mb-8 max-w-lg mx-auto">
              Tell us about your product and we'll match you with vetted factories within 48 hours.
            </p>
            <Link to="/contact?type=sourcing">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
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
