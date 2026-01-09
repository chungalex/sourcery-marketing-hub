import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, MapPin, Users, Target, Heart, Handshake } from "lucide-react";

const team = [
  {
    name: "Alexandra Chen",
    role: "CEO & Co-founder",
    bio: "Former supply chain director at a Fortune 500 retailer. 15+ years in global sourcing.",
  },
  {
    name: "Marcus Williams",
    role: "COO & Co-founder",
    bio: "Built and sold two manufacturing-tech startups. Expert in factory operations.",
  },
  {
    name: "Sofia Rodriguez",
    role: "Head of Quality",
    bio: "Led QC operations for major apparel brands across Asia for 10 years.",
  },
  {
    name: "David Kim",
    role: "Head of Partnerships",
    bio: "Former factory owner turned brand consultant. Deep network across 12 countries.",
  },
];

const values = [
  {
    icon: Handshake,
    title: "Pre-Negotiated Partnerships",
    description: "We do the hard work upfront — auditing facilities, vetting capabilities, and negotiating favorable terms so our brands get competitive rates from day one.",
  },
  {
    icon: Target,
    title: "Quality First",
    description: "We never compromise on quality. Every factory in our network meets our rigorous standards, and every product passes our inspection protocols.",
  },
  {
    icon: Users,
    title: "Partnership Mindset",
    description: "We succeed when our brands and factories succeed. We're not just intermediaries—we're invested partners in every relationship.",
  },
  {
    icon: Heart,
    title: "Ethical Manufacturing",
    description: "We believe in fair wages, safe working conditions, and sustainable practices. Every factory must meet our ethical standards.",
  },
];

const locations = [
  { city: "New York", country: "USA", role: "Headquarters" },
  { city: "Shenzhen", country: "China", role: "Asia Operations" },
  { city: "Ho Chi Minh", country: "Vietnam", role: "Southeast Asia" },
  { city: "Mumbai", country: "India", role: "South Asia" },
];

export default function About() {
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
              About Sourcery
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're building the infrastructure to make global manufacturing accessible, transparent, and reliable for brands of all sizes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Sourcery was born from frustration. Our founders spent years watching brands struggle with the same manufacturing challenges: unreliable factories, quality inconsistencies, communication breakdowns, and complete lack of visibility into production.
              </p>
              <p>
                The traditional model was broken. Brands were forced to either navigate complex global supply chains alone or work with agents who prioritized volume over quality. There had to be a better way.
              </p>
              <p>
                So in 2019, we set out to build it. We started by vetting factories ourselves—visiting facilities, auditing processes, building relationships. But we didn't stop there. We negotiated terms and pricing upfront, so every brand that joins our platform benefits from competitive rates without the back-and-forth.
              </p>
              <p>
                We created systems for real-time production tracking and quality control. We hired local teams who could bridge communication gaps and ensure nothing fell through the cracks.
              </p>
              <p>
                Today, Sourcery connects brands with 500+ vetted factories across 12 countries — each one pre-audited and pre-negotiated. We've managed over $50 million in production, maintaining a 98% on-time delivery rate. But we're just getting started.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-card/50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-background border border-border"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Leadership Team
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <div className="w-16 h-16 rounded-full bg-muted mb-4" />
                <h3 className="font-heading font-semibold text-foreground">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="section-padding bg-card/50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Global Presence
            </h2>
            <p className="text-lg text-muted-foreground">
              Local teams ensuring smooth operations across key manufacturing regions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <motion.div
                key={location.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-background border border-border text-center"
              >
                <MapPin className="w-6 h-6 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-foreground">{location.city}</h3>
                <p className="text-muted-foreground text-sm">{location.country}</p>
                <p className="text-primary text-xs mt-2">{location.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Want to Join Our Team?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              We're always looking for talented people who are passionate about transforming global manufacturing.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="xl">
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
