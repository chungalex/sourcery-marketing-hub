import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

const faqs = [
  {
    question: "What types of products can Sourcery help me source?",
    answer: "We specialize in soft goods (apparel, bags, accessories), home goods (furniture, textiles, ceramics), and consumer products. Our network includes factories experienced in everything from basic manufacturing to complex, multi-component products. If you're unsure whether we can help with your specific product category, reach out and we'll let you know.",
  },
  {
    question: "What are your minimum order quantities (MOQs)?",
    answer: "MOQs vary by product type and factory. Generally, our factory partners require minimums of 500-1,000 units for apparel and 200-500 units for hard goods. For brands just starting out, we can often negotiate lower MOQs for first orders, especially if there's potential for growth.",
  },
  {
    question: "How do you vet factories?",
    answer: "Every factory in our network undergoes a comprehensive vetting process including: facility audits (capacity, equipment, processes), compliance verification (BSCI, SEDEX, or equivalent), quality system assessment, financial stability check, and production capability evaluation. We also conduct ongoing monitoring and annual re-audits.",
  },
  {
    question: "How long does the sourcing process take?",
    answer: "From initial inquiry to receiving samples typically takes 4-6 weeks. Once you approve samples and place a production order, lead times vary by product complexity—usually 6-12 weeks for apparel, 8-16 weeks for furniture and hard goods. We'll provide specific timelines based on your product requirements.",
  },
  {
    question: "What quality control measures do you have in place?",
    answer: "We implement a multi-stage QC process: pre-production inspection (materials, components), in-line inspections during production, pre-shipment inspection (AQL sampling), and optional full inspection for critical orders. All inspection reports are shared with you in real-time through our tracking dashboard.",
  },
  {
    question: "How much does Sourcery cost?",
    answer: "We charge a percentage of your production order value—typically 4-5% depending on volume. There are no upfront fees, retainers, or hidden costs. You only pay when your order ships. Visit our pricing page for detailed tier information.",
  },
  {
    question: "Do you handle shipping and logistics?",
    answer: "Yes, we can coordinate the entire logistics process including factory pickup, freight forwarding, customs documentation, and delivery to your warehouse. We work with trusted freight partners to ensure competitive rates and reliable service. You can also use your own logistics provider if preferred.",
  },
  {
    question: "What if there are quality issues with my order?",
    answer: "Quality issues are rare thanks to our rigorous QC process, but when they occur, we work with the factory to resolve them. Depending on the nature and extent of the issue, solutions may include rework, partial refunds, or replacement orders. Our contracts with factories include clear quality guarantees to protect your interests.",
  },
  {
    question: "Can you help with product development and sampling?",
    answer: "Absolutely. We can help you refine product specifications, source materials, and manage the sampling process. Our team includes product development experts who can advise on design for manufacturing, cost optimization, and material selection.",
  },
  {
    question: "How do I communicate with factories?",
    answer: "You don't have to—that's our job. Your dedicated sourcing manager handles all factory communication, eliminating timezone and language barriers. You'll receive regular updates through our platform, and we facilitate direct calls when needed for complex technical discussions.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer,
    },
  })),
};

export default function FAQ() {
  return (
    <Layout>
      <Helmet>
        <title>FAQ - Sourcery | Manufacturing & Sourcing Questions Answered</title>
        <meta
          name="description"
          content="Find answers to common questions about Sourcery's manufacturing sourcing services, quality control, pricing, and more."
        />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Everything you need to know about working with Sourcery. Can't find what you're looking for? Contact our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-padding">
        <div className="container-tight">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card rounded-xl border border-border px-6 data-[state=open]:shadow-card"
                >
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
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
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Our team is here to help. Reach out and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="hero" size="xl">
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact?type=call">
                <Button variant="hero-outline" size="xl">
                  Book a Call
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
