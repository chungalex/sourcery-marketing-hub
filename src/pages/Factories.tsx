import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, CheckCircle, Globe, TrendingUp, Users, ShieldCheck, Briefcase } from "lucide-react";

const benefits = [
  {
    icon: Globe,
    title: "Global Brand Access",
    description: "Connect with quality-focused brands from North America, Europe, and beyond who are actively seeking reliable manufacturing partners.",
  },
  {
    icon: TrendingUp,
    title: "Consistent Orders",
    description: "Build long-term relationships with brands that value reliability. Many of our brand partners place repeat orders year after year.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Our local team works with you to streamline communication, manage expectations, and ensure successful production runs.",
  },
  {
    icon: ShieldCheck,
    title: "Fair Terms",
    description: "We believe in partnerships that work for everyone. Our payment terms and contracts are designed to be fair and transparent.",
  },
  {
    icon: Briefcase,
    title: "No Hidden Fees",
    description: "Join our network for free. We only succeed when you get orders, so there's no upfront cost to become a partner.",
  },
];

const requirements = [
  "Minimum 3 years of export manufacturing experience",
  "Relevant compliance certifications (BSCI, SEDEX, etc.)",
  "Demonstrated quality control processes",
  "Capacity to handle MOQ of 500+ units",
  "English-speaking point of contact preferred",
];

export default function Factories() {
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
                For Factories
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Partner with Growing Brands Worldwide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Join our vetted factory network and get connected with quality-focused brands looking for reliable manufacturing partners. No fees to join, no hidden costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact?type=factory">
                  <Button variant="hero" size="xl">
                    Apply to Join Network
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact?type=call">
                  <Button variant="hero-outline" size="xl">
                    Schedule a Call
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
                  What We Look For
                </h3>
                <ul className="space-y-4">
                  {requirements.map((item, index) => (
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
              Why Factories Join Sourcery
            </h2>
            <p className="text-lg text-muted-foreground">
              500+ factories trust us to connect them with quality brand partners
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

      {/* How It Works */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              How to Join
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Apply Online", desc: "Fill out our factory application form with your capabilities and certifications." },
              { step: "2", title: "Verification", desc: "Our team reviews your application and may conduct a virtual or on-site audit." },
              { step: "3", title: "Start Receiving RFQs", desc: "Once approved, you'll receive relevant project inquiries matched to your capabilities." },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-background border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-heading font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
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
              Ready to Grow Your Factory's Reach?
            </h2>
            <p className="text-background/70 mb-8 max-w-lg mx-auto">
              Apply to join our network and start receiving inquiries from quality-focused brands.
            </p>
            <Link to="/contact?type=factory">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
