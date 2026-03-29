import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  return (
    <Layout>
      <SEO
        title="Page not found — Sourcery"
        description="This page doesn't exist."
        noIndex={true}
      />

      <section className="section-padding min-h-[70vh] flex items-center">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-lg"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">404</p>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4 leading-tight">
              This page doesn't exist.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              The link might be broken, or the page may have moved. Here's where to go instead.
            </p>

            <div className="flex flex-col gap-2.5 mb-10">
              {[
                { label: "Homepage", href: "/" },
                { label: "How it works", href: "/how-it-works" },
                { label: "Marketplace", href: "/marketplace" },
                { label: "Pricing", href: "/pricing" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>

            <Button variant="outline" onClick={() => window.history.back()} className="gap-2 text-sm">
              Go back
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
