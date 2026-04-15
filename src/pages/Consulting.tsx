import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Consulting() {
  return (
    <Layout>
      <SEO
        title="Production Consulting — Sourcery"
        description="Managed production and consulting for physical product brands sourcing from Vietnam."
      />
      <section className="section-padding">
        <div className="container max-w-2xl text-center">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Production support</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">You need more than software.</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Sourcery Studio handles your production end to end — factory selection, PO, sampling, QC, and delivery.
            For brands who want the outcome, not the overhead.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/studio">See Sourcery Studio <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
