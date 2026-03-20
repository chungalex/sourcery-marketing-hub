import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqSections = [
  {
    title: "The basics",
    faqs: [
      {
        q: "What is Sourcery?",
        a: "A manufacturing operating system for physical product brands. It replaces fragmented email chains, file-sharing links, and bank wire coordination with a single system where every order, revision, sample, QC report, and payment is documented and traceable.",
      },
      {
        q: "Who built Sourcery?",
        a: "Sourcery was built by operators with direct experience on both sides of manufacturing — as brands managing production and as manufacturers supplying them. Every feature exists because we encountered the problem it solves.",
      },
      {
        q: "Is Sourcery an agency or a platform?",
        a: "A platform. Sourcery doesn't manage your factory relationships, negotiate on your behalf, or intervene in production. It gives you the structure, documentation, and milestone gate enforcement to manage your own production — with accountability built into every stage.",
      },
      {
        q: "What types of products does Sourcery support?",
        a: "Apparel, accessories, bags, footwear, home goods, and most soft goods categories. The order management, sampling, and QC workflow applies to any physical product manufactured in runs.",
      },
    ],
  },
  {
    title: "For brands",
    faqs: [
      {
        q: "Do I have to use factories in your network?",
        a: "No. Bring Your Own Factory is the primary entry point. Invite your existing manufacturer and manage every order on-platform immediately. The marketplace is available when you need to find a new manufacturing partner.",
      },
      {
        q: "I'm new to production. Will I understand what the platform is asking for?",
        a: "Yes — that's a core part of how the platform is built. Every decision in the order creation form includes a plain-English explanation before you choose. Incoterms (EXW, FOB, CIF, DDP) are explained with who pays, who's responsible, and when to use each one. AQL standards (1.0, 2.5, 4.0) are explained with what defect tolerance they allow. QC options show trade-offs, protection levels, and who each is best for. You're guided through every decision that matters — not left to figure it out.",
      },
      {
        q: "What is AQL and which standard should I use?",
        a: "AQL stands for Acceptable Quality Level — the international standard that defines how many defective units are acceptable when a statistical sample is inspected. AQL 2.5 is the industry standard for most apparel and soft goods orders and is the default on the platform. AQL 1.0 is stricter and suited to higher-value goods or categories where defects are especially costly. AQL 4.0 is more relaxed, suited to established factory relationships with strong track records. Your choice is written into the order record so the factory knows the quality threshold before production begins.",
      },
      {
        q: "How do I invite my factory?",
        a: "From your brand dashboard, click 'Invite a Factory.' Enter their name, email, and country. They receive a link to create a free account and connect with you. Once they accept, you can create orders together immediately.",
      },
      {
        q: "What are typical MOQs in the network?",
        a: "MOQs vary by factory and category. Network factories typically require 300–1,000 units for apparel and soft goods. For first orders, some factories accommodate lower quantities — this is visible on each factory profile.",
      },
      {
        q: "What if there are quality issues?",
        a: "Every defect is documented as a structured report — type, severity, quantity affected, photos, factory response — all timestamped against the order. The platform requires QC pass before releasing final payment. In a formal dispute, the brand withholds final payment and both parties submit documented evidence before resolution. The documentation built throughout the order is your protection.",
      },
      {
        q: "How long does the process take?",
        a: "If you're using BYOF, you can have an order created in under 10 minutes. For new factory matching through the network, timing depends on factory response and your category. The platform doesn't add process time — it replaces the unstructured coordination that typically causes delays.",
      },
      {
        q: "Does Sourcery handle shipping and logistics?",
        a: "Not currently. Shipping is coordinated between you and your factory or freight forwarder. The platform tracks order status through to shipped and closed, and shipment documentation can be uploaded to the order record. Logistics integration is on the roadmap.",
      },
    ],
  },
  {
    title: "For factories",
    faqs: [
      {
        q: "Does joining the network cost anything?",
        a: "No. Network membership is free. Sourcery charges brands a subscription fee — factories join and use the full platform at no cost.",
      },
      {
        q: "I was invited by a brand — do I need to apply to the network?",
        a: "No. If a brand invited you directly, accept the invite, complete your profile, and you're connected. Network membership is separate — it's for factories who want to be discoverable to new brands through our marketplace.",
      },
      {
        q: "What does the application process involve?",
        a: "Credential review, certification verification, and production capability assessment based on submitted documentation and references. We do not conduct on-site audits for all applicants. Factories invited directly by a brand do not need to go through the application process.",
      },
      {
        q: "How does the performance score work?",
        a: "Calculated from real order data across completed orders — QC pass rate, response time, on-time delivery, defect history, and brand retention. Factories see their full breakdown. Brands see your tier. High-scoring factories get featured placement and priority matching with new brands.",
      },
      {
        q: "What response time is expected?",
        a: "Target: inquiries within 24 hours, messages on active orders within 12 hours. Response time is tracked and feeds directly into your performance score. Faster responses mean better placement. Brands on the platform expect professional, timely communication.",
      },
    ],
  },
  {
    title: "Pricing",
    faqs: [
      {
        q: "How much does Sourcery cost?",
        a: "Sourcery offers a free first order, a one-off option at $79/order, and annual subscriptions — Builder at $399/year and Pro at $899/year. Your first order is always free, no credit card required. See the full breakdown on the pricing page.",
      },
      {
        q: "What does a subscription include?",
        a: "Every subscription tier includes the full production OS — structured PO creation, sampling gates, revision rounds, tech pack versioning, QC documentation, defect reports, milestone tracking, on-platform messaging, and permanent order records. Builder adds full marketplace access, AI tools, and order templates. Pro adds unlimited orders, production calendar, spec library, analytics, and 3 team seats.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes. Your first order is completely free — full platform, no credit card, no time limit. After that, you can continue on a one-off basis ($79/order) or subscribe to Builder or Pro for ongoing production management.",
      },
    ],
  },
  {
    title: "AI tools",
    faqs: [
      {
        q: "What AI tools are available?",
        a: "The AI Factory Matcher is live — describe what you need in plain language and get ranked recommendations from our verified network. AI Tech Pack Reviewer, RFQ Generator, and Quote Analyzer are in development and will be available to all accounts when released.",
      },
      {
        q: "Does the factory matcher use real data?",
        a: "Yes. It queries real factory rows in the Sourcery database — if no factories match your criteria, it returns an empty state with suggestions. It never generates fictional results.",
      },
      {
        q: "How does the AI get better over time?",
        a: "Every completed order adds to the platform's data — pricing, performance records, defect history, response times. The quote analyzer and factory matcher both improve as that data grows. The more orders on the platform, the more accurate every recommendation becomes.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <Layout>
      <SEO
        title="FAQ — Sourcery"
        description="Common questions about Sourcery — pricing, how it works, factory vetting, BYOF, and the AI toolkit."
      />

      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently asked questions
            </h1>
            <p className="text-xl text-muted-foreground">
              If you don't find what you're looking for, <Link to="/contact" className="text-primary hover:underline">get in touch</Link>.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight space-y-12">
          {faqSections.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: si * 0.05 }}
            >
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{section.title}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {section.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`${si}-${i}`} className="bg-card border border-border rounded-xl px-6">
                    <AccordionTrigger className="text-left font-medium text-foreground py-5">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-card/50">
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">We're happy to walk you through anything — platform, pricing, or factory network.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/contact"><Button variant="hero" size="lg">Get in touch <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
              <Link to="/auth?mode=signup"><Button variant="outline" size="lg">Create free account</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
