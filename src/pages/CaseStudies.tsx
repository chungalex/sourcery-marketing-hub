import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CaseStudies() {
  return (
    <Layout>
      <SEO
        title="Case Studies — Sourcery"
        description="Real production orders managed through Sourcery. Coming soon."
      />
      <section className="section-padding min-h-[70vh] flex items-center">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-6">
              Case studies — coming soon.
            </h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-10">
              <p>
                We're documenting real production orders managed through Sourcery — the problems they ran into, how the platform handled them, and what the outcomes looked like.
              </p>
              <p>
                We won't publish case studies until we have real orders to write about with real data. No fabricated brands, no invented metrics.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/why-sourcery">
                <Button>
                  See how it protects brands
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="outline">Get started free</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
