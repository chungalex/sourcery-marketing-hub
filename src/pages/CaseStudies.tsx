import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight } from "lucide-react";

export default function CaseStudies() {
  return (
    <Layout>
      <SEO
        title="Production Stories — Sourcery"
        description="How brands use Sourcery to manage production with confidence. Real orders, real outcomes."
      />
      <section className="section-padding min-h-[70vh] flex items-center">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-6">
              Production stories — coming soon.
            </h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-10">
              <p>
                The most compelling proof of what Sourcery does is a real brand using it on a real order — and being able to show the difference it made. That's what this page will be.
              </p>
              <p>
                The platform is live and orders are being placed. Production stories will be published here as they complete.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/why-sourcery">
                <Button className="gap-1.5">See why it matters <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="outline" className="gap-1.5">Start your first order</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
