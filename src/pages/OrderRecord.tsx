import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { format } from "date-fns";
import { CheckCircle, Package, Building2, Shield, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface OrderRecord {
  order_number: string;
  status: string;
  quantity: number;
  currency: string;
  total_amount: number;
  unit_price: number;
  created_at: string;
  delivery_window_end: string | null;
  specifications: Record<string, any> | null;
  factories: { name: string; city: string | null; country: string | null } | null;
}

export default function OrderRecord() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const { data, error } = await (supabase as any)
        .from("orders")
        .select("order_number, status, quantity, currency, total_amount, unit_price, created_at, delivery_window_end, specifications, factories(name, city, country)")
        .eq("id", id)
        .eq("status", "closed") // Only closed orders are shareable
        .single();

      if (error || !data) { setNotFound(true); }
      else { setOrder(data); }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (notFound || !order) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">This production record isn't available.</p>
        <Link to="/" className="text-sm text-primary hover:underline">Sourcery →</Link>
      </div>
    </div>
  );

  const specs = order.specifications as any;
  const productName = specs?.product_name || order.order_number;
  const collection = specs?.collection;
  const category = specs?.product_category;
  const aql = specs?.qc_standard?.aql || specs?.aql_standard;

  return (
    <>
      <SEO
        title={`${productName} — Production Record | Sourcery`}
        description={`${order.quantity} units of ${productName}${order.factories ? ` produced by ${order.factories.name}` : ""}. Documented on Sourcery.`}
      />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-foreground">Sourcery</span>
            </Link>
            <span className="text-xs text-muted-foreground">Production record</span>
          </div>
        </div>

        {/* Record */}
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Status banner */}
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Production complete</span>
          </div>

          {/* Product heading */}
          <h1 className="text-3xl font-bold text-foreground mb-1">{productName}</h1>
          {collection && <p className="text-muted-foreground mb-6">{collection}</p>}

          {/* Key stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Package, label: "Units produced", value: order.quantity.toLocaleString() },
              { icon: Building2, label: "Factory", value: order.factories?.name || "—" },
              { icon: Clock, label: "Order placed", value: format(new Date(order.created_at), "MMM yyyy") },
              ...(order.delivery_window_end ? [{ icon: CheckCircle, label: "Delivered by", value: format(new Date(order.delivery_window_end), "MMM d, yyyy") }] : []),
              ...(aql ? [{ icon: Shield, label: "QC standard", value: `AQL ${aql}` }] : []),
              ...(category ? [{ icon: Package, label: "Category", value: category }] : []),
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
                <p className="font-semibold text-foreground text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* What was documented */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Documented on Sourcery</p>
            <div className="space-y-2">
              {[
                "Purchase order with agreed specs and pricing",
                "Sample approval before bulk production",
                "Milestone-gated payments",
                "QC inspection on delivery",
                "Full revision and message history",
                "Permanent archived record",
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Factory location */}
          {order.factories && (
            <p className="text-sm text-muted-foreground mb-8">
              Produced by <strong className="text-foreground">{order.factories.name}</strong>
              {[order.factories.city, order.factories.country].filter(Boolean).length > 0
                ? ` in ${[order.factories.city, order.factories.country].filter(Boolean).join(", ")}`
                : ""}
              .
            </p>
          )}

          {/* CTA */}
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              This production record was documented on Sourcery — the manufacturing OS for physical product brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link to="/auth?mode=signup">Start your own production record</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/how-it-works" className="flex items-center gap-2">
                  How Sourcery works <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
