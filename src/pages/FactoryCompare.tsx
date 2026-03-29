import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Building2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Factory } from "@/types/database";

function Cell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("py-4 px-4 border-b border-border", className)}>{children}</div>;
}

function RowLabel({ label, sub }: { label: string; sub?: string }) {
  return (
    <Cell className="bg-card/60 flex flex-col justify-center">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </Cell>
  );
}

export default function FactoryCompare() {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) || [];
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length < 2) { setLoading(false); return; }
    async function load() {
      const { data } = await supabase
        .from("factories")
        .select("*")
        .in("id", ids.slice(0, 3));
      setFactories((data as unknown as Factory[]) || []);
      setLoading(false);
    }
    load();
  }, [ids.join(",")]);

  const rows: { label: string; sub?: string; render: (f: Factory) => React.ReactNode }[] = [
    {
      label: "Location",
      render: f => <span className="text-sm text-foreground">{[f.city, f.country].filter(Boolean).join(", ")}</span>,
    },
    {
      label: "Factory type",
      render: f => <span className="text-sm text-foreground capitalize">{(f.factory_type || "—").replace(/_/g, " ")}</span>,
    },
    {
      label: "Minimum order quantity",
      sub: "MOQ",
      render: f => <span className="text-sm font-semibold text-foreground">{f.moq_min != null ? `${f.moq_min.toLocaleString()} units` : "—"}</span>,
    },
    {
      label: "Lead time",
      sub: "Production weeks",
      render: f => <span className="text-sm font-semibold text-foreground">{f.lead_time_weeks != null ? `${f.lead_time_weeks} weeks` : "—"}</span>,
    },
    {
      label: "Categories",
      render: f => (
        <div className="flex flex-wrap gap-1">
          {(f.categories || []).length > 0
            ? (f.categories || []).map(c => (
                <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-foreground">{c}</span>
              ))
            : <span className="text-sm text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      label: "Certifications",
      render: f => (
        <div className="flex flex-wrap gap-1">
          {(f.certifications || []).length > 0
            ? (f.certifications || []).map(c => (
                <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{c}</span>
              ))
            : <span className="text-sm text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      label: "Verified",
      sub: "Network membership",
      render: f => f.is_verified
        ? <span className="flex items-center gap-1.5 text-sm text-green-600"><CheckCircle className="h-4 w-4" />Verified</span>
        : <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><XCircle className="h-4 w-4" />Not verified</span>,
    },
    {
      label: "Performance score",
      sub: "Based on completed orders",
      render: _f => <span className="text-sm text-muted-foreground italic">Builds from first order</span>,
    },
  ];

  if (!loading && ids.length < 2) {
    return (
      <Layout>
        <SEO title="Compare Factories — Sourcery" description="Side-by-side factory comparison." />
        <section className="section-padding">
          <div className="container-tight text-center py-20">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-semibold text-foreground mb-3">Select factories to compare</h1>
            <p className="text-muted-foreground mb-6">Visit the factory directory and select two or three factories to compare side-by-side.</p>
            <Link to="/directory"><Button>Browse factory directory</Button></Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Compare Factories — Sourcery" description="Side-by-side factory comparison on MOQ, lead time, certifications, and performance." />
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-foreground mb-1">Factory comparison</h1>
              <p className="text-muted-foreground text-sm">Side-by-side on MOQ, lead time, certifications, and capabilities.</p>
            </div>

            {loading ? (
              <div className="grid gap-4"><Skeleton className="h-96 w-full rounded-xl" /></div>
            ) : factories.length < 2 ? (
              <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">Could not load factory data. Return to the <Link to="/directory" className="text-primary hover:underline">factory directory</Link>.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <div className={cn("grid min-w-[600px]", factories.length === 3 ? "grid-cols-[180px_1fr_1fr_1fr]" : "grid-cols-[180px_1fr_1fr]")}>

                  {/* Header row */}
                  <div className="bg-card/60 border-b border-border p-4" />
                  {factories.map(f => (
                    <div key={f.id} className="bg-card border-b border-border border-l p-4">
                      <Link to={`/directory/${f.slug}`} className="group flex items-start gap-2">
                        {f.logo_url ? (
                          <img src={f.logo_url} alt={f.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{f.name}</p>
                          <p className="text-xs text-muted-foreground">{f.country}</p>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground ml-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                  ))}

                  {/* Data rows */}
                  {rows.map(row => (
                    <>
                      <RowLabel key={`label-${row.label}`} label={row.label} sub={row.sub} />
                      {factories.map(f => (
                        <Cell key={`${row.label}-${f.id}`} className="border-l">
                          {row.render(f)}
                        </Cell>
                      ))}
                    </>
                  ))}

                  {/* CTA row */}
                  <div className="bg-card/60 p-4" />
                  {factories.map(f => (
                    <div key={`cta-${f.id}`} className="p-4 border-l bg-card">
                      <Link to={`/orders/create?factory=${f.id}`}>
                        <Button size="sm" className="w-full">Start order</Button>
                      </Link>
                      <Link to={`/directory/${f.slug}`}>
                        <Button size="sm" variant="ghost" className="w-full mt-2 text-xs text-muted-foreground">View profile</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && factories.length > 0 && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Performance scores build from real completed order data. New factories show no score until their first order is closed on the platform.
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
