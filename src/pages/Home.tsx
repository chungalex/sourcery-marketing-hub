import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Newsletter } from "@/components/Newsletter";
import { Testimonials } from "@/components/Testimonials";
import { 
  ArrowRight, 
  CheckCircle, 
  Factory, 
  Shield, 
  Sparkles, 
  Package, 
  Globe, 
  Users,
  MessageSquare,
  ClipboardCheck,
  CreditCard
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Curated Factory Matching",
    description: "Tell us your needs and our team handpicks the best factories from our verified network—personalized just for you.",
  },
  {
    icon: Shield,
    title: "Escrow Protection",
    description: "Your payments are held securely and released only when each production milestone is verified.",
  },
  {
    icon: ClipboardCheck,
    title: "Quality Assurance",
    description: "Professional inspections at every stage with detailed reports and photo documentation.",
  },
  {
    icon: MessageSquare,
    title: "Verified Messaging",
    description: "Communicate securely with verified factory representatives. All messages logged for protection.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Access vetted factories across 12+ countries, all verified and ready to work with you.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Our team handles disputes, quality issues, and ensures smooth production from start to finish.",
  },
];

const stats = [
  { value: "500+", label: "Verified Factories" },
  { value: "$50M+", label: "Orders Protected" },
  { value: "98%", label: "Satisfaction Rate" },
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

const platformTools = [
  { name: "Factory Matching", desc: "Curated selection for your needs" },
  { name: "Quote Comparison", desc: "Side-by-side analysis & insights" },
  { name: "RFQ Templates", desc: "Professional request for quotes" },
  { name: "Expert Support", desc: "Guidance throughout your order" },
];

export default function Home() {
  return (
    <Layout>
      <SEO
        title="Manufactory | Curated Manufacturing with Payment Protection"
        description="Find verified factories, get expert guidance, and protect every payment. Personalized sourcing with escrow protection and quality assurance."
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
                  <Shield className="w-4 h-4" />
                  Every Payment Protected
                </div>
                
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                  Manufacturing Made{" "}
                  <span className="text-primary">Simple & Safe</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
                  Curated factory matching, escrow payment protection, and quality assurance at every step. Source with confidence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact?type=sourcing">
                    <Button variant="hero" size="xl">
                      Get Matched
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/directory">
                    <Button variant="hero-outline" size="xl">
                      Browse Factories
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Escrow protected
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Verified factories
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Hands-on support
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
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-full space-y-4">
                      {/* Factory Matching Preview */}
                      <div className="bg-background rounded-xl border border-border p-4 shadow-card-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Factory className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground text-sm">Factory Matching</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Curating your factory list...</p>
                      </div>

                      {/* Escrow Status */}
                      <div className="bg-background rounded-xl border border-border p-4 shadow-card-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-green-500" />
                          </div>
                          <span className="font-medium text-foreground text-sm">Payment Protected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">$12,500 in escrow</span>
                        </div>
                      </div>

                      {/* QC Status */}
                      <div className="bg-background rounded-xl border border-border p-4 shadow-card-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">QC Passed</p>
                            <p className="text-xs text-muted-foreground">Order #4821 • Ready to ship</p>
                          </div>
                        </div>
                      </div>
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

      {/* Platform Tools Highlight */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Hands-On Support
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Source
            </h2>
            <p className="text-lg text-muted-foreground">
              From finding the right factory to protecting your payments, we guide you through every step.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {platformTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-card-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                See How It Works
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="section-padding bg-card/50">
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
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Platform Protection
            </h2>
            <p className="text-lg text-muted-foreground">
              Every transaction is protected with escrow payments, verified communication, and professional quality assurance.
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
                className="p-6 rounded-xl bg-card border border-border hover:shadow-card-lg transition-shadow group"
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

      {/* How It Works Preview */}
      <section className="section-padding bg-card/50">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              From curated matching to protected delivery in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Factory, step: "1", title: "Get Matched", desc: "Curated factory selection" },
              { icon: MessageSquare, step: "2", title: "Connect", desc: "Chat with verified factories" },
              { icon: CreditCard, step: "3", title: "Pay Safe", desc: "Escrow-protected payments" },
              { icon: Package, step: "4", title: "Receive", desc: "QC verified delivery" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-xs text-primary font-medium mb-1">Step {item.step}</p>
                <p className="font-heading font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
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
              Hear from brands who source with confidence on our platform.
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
              Get sourcing tips, industry insights, and platform updates delivered to your inbox.
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
                Ready to Source with Confidence?
              </h2>
              <p className="text-background/70 text-lg mb-8 max-w-xl mx-auto">
                Try our AI Factory Matcher for free and see why brands trust us to protect their manufacturing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/ai-tools">
                  <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                    Try AI Matcher Free
                    <Sparkles className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                    See How It Works
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
