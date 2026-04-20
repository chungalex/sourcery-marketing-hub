import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Shield, Download, CheckCircle, FileText, Loader2, Building2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function Compliance() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [factories, setFactories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [ordersRes, factoriesRes] = await Promise.all([
        (supabase as any).from("orders").select("id, order_number, status, created_at, total_amount, currency, specifications, factories(name, country, certifications, is_verified)").eq("buyer_id", user!.id).order("created_at", { ascending: false }).limit(50),
        (supabase as any).from("factories").select("id, name, country, city, certifications, is_verified, website").in("id", (await (supabase as any).from("orders").select("factory_id").eq("buyer_id", user!.id)).data?.map((o: any) => o.factory_id).filter(Boolean) || []),
      ]);
      setOrders(ordersRes.data || []);
      setFactories(factoriesRes.data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const report = {
        generated: new Date().toISOString(),
        brand: user?.user_metadata?.brand_name || user?.email,
        factories: factories.map(f => ({
          name: f.name,
          country: f.country,
          city: f.city,
          certifications: f.certifications || [],
          verified: f.is_verified,
          website: f.website,
        })),
        orders: orders.map(o => ({
          order_number: o.order_number,
          status: o.status,
          date: o.created_at,
          factory: o.factories?.name,
          country: o.factories?.country,
          value: `${o.currency} ${o.total_amount}`,
          product: (o.specifications as any)?.product_name,
        })),
        summary: {
          total_orders: orders.length,
          completed_orders: orders.filter((o: any) => o.status === "closed").length,
          factory_countries: [...new Set(factories.map(f => f.country).filter(Boolean))],
          certifications: [...new Set(factories.flatMap(f => f.certifications || []))],
        },
      };

      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sourcery-supply-chain-report-${format(new Date(), "yyyy-MM-dd")}.json`;
      a.click();
      toast.success("Supply chain report downloaded");
    } catch { toast.error("Export failed"); }
    setExporting(false);
  };

  const REGULATIONS = [
    { name: "EU CSDDD", desc: "Corporate Sustainability Due Diligence — supply chain mapping required", status: orders.length > 0 ? "covered" : "needs_orders" },
    { name: "UFLPA", desc: "Uyghur Forced Labor Prevention Act — factory country documentation", status: factories.some(f => f.country !== "China") ? "covered" : "review" },
    { name: "UK Modern Slavery Act", desc: "Supply chain transparency statement", status: orders.length > 5 ? "covered" : "building" },
    { name: "EU Ecodesign (2026)", desc: "Digital product passport — material and factory traceability", status: "building" },
  ];

  return (
    <Layout>
      <SEO title="Supply Chain Compliance — Sourcery" description="Export your complete supply chain documentation for CSDDD, UFLPA, and Modern Slavery Act compliance." />
      
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Compliance</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Your supply chain documentation</h1>
          <p className="text-muted-foreground leading-relaxed">
            Every order you run through Sourcery generates the documentation that EU and US regulations increasingly require.
            Export your complete supply chain record at any time.
          </p>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">Regulatory coverage</h2>
          <div className="space-y-3">
            {REGULATIONS.map(reg => (
              <div key={reg.name} className="flex items-start justify-between gap-4 p-4 bg-card border border-border rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-foreground">{reg.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{reg.desc}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium flex-shrink-0 ${
                  reg.status === "covered" ? "bg-green-500/10 text-green-700 border-green-400/30" :
                  reg.status === "review" ? "bg-amber-500/10 text-amber-700 border-amber-400/30" :
                  "bg-secondary text-muted-foreground border-border"
                }`}>
                  {reg.status === "covered" ? "Documented" : reg.status === "review" ? "Review needed" : "Building"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">What's documented</h2>
          {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : (
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Orders recorded", value: orders.length, icon: FileText },
                { label: "Factories documented", value: factories.length, icon: Building2 },
                { label: "Completed orders", value: orders.filter((o: any) => o.status === "closed").length, icon: CheckCircle },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          )}
          <Button onClick={handleExport} disabled={exporting || loading} className="gap-2">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export full supply chain report
          </Button>
          <p className="text-xs text-muted-foreground mt-2">JSON format — importable into compliance platforms or readable by legal teams.</p>
        </div>
      </section>
    </Layout>
  );
}
