import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Newsletter } from "@/components/Newsletter";
import { Testimonials } from "@/components/Testimonials";
import { ArrowRight, CheckCircle, Factory, Shield, TrendingUp, Package, Globe, Users } from "lucide-react";

const features = [
  {
    icon: Factory,
    title: "Vetted Factories",
    description: "Access our network of pre-qualified, audited manufacturers across 12+ countries.",
  },
  {
    icon: Shield,
    title: "Quality Control",
    description: "On-site QC inspections at every production milestone, documented and shared in real-time.",
  },
  {
    icon: TrendingUp,
    title: "Production Tracking",
    description: "Live dashboards showing order status, timeline updates, and delivery estimates.",
  },
  {
    icon: Package,
    title: "Sample Management",
    description: "Streamlined sampling process with fast turnaround and detailed feedback loops.",
  },
  {
    icon: Globe,
    title: "Global Sourcing",
    description: "Source from Asia, Europe, and Americas with local teams ensuring smooth operations.",
  },
  {
    icon: Users,
    title: "Dedicated Team",
    description: "Your personal sourcing manager handles every detail from inquiry to delivery.",
  },
];

const stats = [
  { value: "500+", label: "Vetted Factories" },
  { value: "$50M+", label: "Production Managed" },
  { value: "98%", label: "On-Time Delivery" },
  { value: "12+", label: "Countries" },
];

const logos = [
  "Modern Apparel Co.",
  "Urban Essentials",
  "Heritage Goods",
  "Artisan Home",
  "Coastal Living",
  "Nordic Design",
];

export default function Home() {
  return (
    <Layout>
      <SEO
        title="Sourcery | Premium Manufacturing Sourcing for Modern Brands"
        description="From factory vetting to final delivery. We handle sourcing, quality control, and production tracking so you can focus on building your brand."
        canonical="/"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--hero-gradient)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
        
        <div className="container-wide relative">
          <div className="min-h-[calc(100vh-5rem)] flex items-center py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Now sourcing in 12+ countries
                </div>
                
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                  Premium Sourcing for{" "}
                  <span className="text-primary">Modern Brands</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
                  From factory vetting to final delivery. We handle sourcing, quality control, and production tracking so you can focus on building your brand.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact?type=sourcing">
                    <Button variant="hero" size="xl">
                      Request Sourcing
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/contact?type=call">
                    <Button variant="hero-outline" size="xl">
                      Book a Call
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    No minimums
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Free consultation
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-8">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl bg-background shadow-card-lg border border-border/50 flex items-center justify-center"
                        >
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Factory className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-background shadow-card-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">QC Passed</p>
                      <p className="text-xs text-muted-foreground">Order #4821</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50">
        <div className="container-wide py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mb-8"
          >
            Trusted by growing brands worldwide
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((logo, index) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-muted-foreground/50 font-heading font-medium text-lg hover:text-muted-foreground transition-colors cursor-default"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-card/50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Scale Production
            </h2>
            <p className="text-lg text-muted-foreground">
              From initial sourcing to final delivery, we provide comprehensive solutions for brands serious about quality manufacturing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-background border border-border hover:shadow-card-lg transition-shadow group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Hear from brands who've transformed their production with Sourcery.
            </p>
          </motion.div>
          
          <Testimonials />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground mb-8">
              Get industry insights, sourcing tips, and Sourcery updates delivered to your inbox.
            </p>
            <Newsletter className="max-w-md mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl bg-foreground text-background overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.3),transparent_60%)]" />
            <div className="relative p-8 md:p-12 lg:p-16 text-center">
              <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Ready to Scale Your Production?
              </h2>
              <p className="text-background/70 text-lg mb-8 max-w-xl mx-auto">
                Get matched with vetted factories and receive a custom sourcing proposal within 48 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact?type=sourcing">
                  <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                    Request Sourcing
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                    Learn How it Works
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
