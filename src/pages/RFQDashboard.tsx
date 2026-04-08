import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Plus, ChevronRight, Clock, CheckCircle, XCircle, Send, Package, Loader2, MessageSquare } from "lucide-react";
import { PlatformMessaging } from "@/components/platform/PlatformMessaging";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RFQWithRecipients {
  id: string;
  title: string;
  product_category: string | null;
  quantity_min: number | null;
  quantity_max: number | null;
  status: string;
  created_at: string;
  rfq_recipients: {
    id: string;
    factory_name: string;
    status: string;
    quoted_unit_price: number | null;
    quoted_lead_time_weeks: number | null;
    quoted_currency: string | null;
    quote_notes: string | null;
    responded_at: string | null;
  }[];
}

export default function RFQDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState<RFQWithRecipients[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [converting, setConverting] = useState<string | null>(null);
  const [rfqThread, setRfqThread] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (supabase as any)
      .from("rfqs")
      .select("*, rfq_recipients(*)")
      .eq("brand_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }: any) => { setRfqs(data || []); setLoading(false); });
  }, [user]);

  const handleConvertToOrder = (rfq: RFQWithRecipients, recipient: RFQWithRecipients["rfq_recipients"][0]) => {
    const specs = rfq as any;
    const params = new URLSearchParams({
      rfq_title: rfq.title,
      rfq_category: rfq.product_category || "",
      prefill_price: String(recipient.quoted_unit_price || ""),
      prefill_currency: recipient.quoted_currency || "USD",
    });
    const recipientFactory = (recipient as any).factory_id;
    if (recipientFactory) params.set("factory", recipientFactory);
    navigate(`/orders/create?${params.toString()}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  if (!rfqs.length) return (
    <div className="py-8 space-y-4">
      <div className="p-5 rounded-xl bg-card border border-border">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Get competing quotes before you commit.</p>
        <div className="space-y-3">
          {[
            { n: "01", t: "Write one brief", b: "Describe what you're making — specs, quantity range, target price, delivery window. Takes 3 minutes." },
            { n: "02", t: "Send to every factory at once", b: "Pick from the Sourcery network or type any factory's email address. No account needed to respond." },
            { n: "03", t: "See who quotes what", b: "Each factory submits their price, MOQ, and lead time. Everything in one place, no inbox archaeology." },
            { n: "04", t: "Convert the best one to a PO", b: "Select the quote you want. Their pricing pre-fills your order form. Done." },
          ].map(s => (
            <div key={s.n} className="flex gap-3">
              <span className="font-mono text-xs font-bold text-primary/40 flex-shrink-0 mt-0.5 w-6">{s.n}</span>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">{s.t}</p>
                <p className="text-xs text-muted-foreground">{s.b}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button asChild className="w-full gap-2">
        <Link to="/rfq/create"><Plus className="h-4 w-4" />Send your first RFQ</Link>
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rfqs.length} RFQ{rfqs.length !== 1 ? "s" : ""} sent</p>
        <Button asChild size="sm" className="gap-1.5">
          <Link to="/rfq/create"><Plus className="h-3.5 w-3.5" />New RFQ</Link>
        </Button>
      </div>

      {rfqs.map(rfq => {
        const quotes = rfq.rfq_recipients.filter(r => r.status === "quoted");
        const pending = rfq.rfq_recipients.filter(r => ["pending", "viewed"].includes(r.status));
        const isExpanded = expanded === rfq.id;

        return (
          <div key={rfq.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(isExpanded ? null : rfq.id)}
              className="w-full text-left p-5 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{rfq.title}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">{format(new Date(rfq.created_at), "MMM d, yyyy")}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{rfq.rfq_recipients.length} sent</span>
                    {quotes.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 border border-green-500/20 font-medium">
                        {quotes.length} quote{quotes.length !== 1 ? "s" : ""} received
                      </span>
                    )}
                    {pending.length > 0 && (
                      <span className="text-xs text-muted-foreground">{pending.length} awaiting response</span>
                    )}
                  </div>
                </div>
                <ChevronRight className={cn("h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform", isExpanded && "rotate-90")} />
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-border divide-y divide-border">
                {rfq.rfq_recipients.map(r => (
                  <div key={r.id} className={cn("p-4", r.status === "quoted" && "bg-green-500/3")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground">{r.factory_name}</p>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full border font-medium",
                            r.status === "quoted" ? "bg-green-500/10 text-green-700 border-green-500/20" :
                            r.status === "declined" ? "bg-rose-500/10 text-rose-700 border-rose-400/30" :
                            r.status === "viewed" ? "bg-blue-500/10 text-blue-700 border-blue-400/30" :
                            "bg-secondary text-muted-foreground border-border"
                          )}>
                            {r.status === "quoted" ? "Quote received" :
                             r.status === "declined" ? "Declined" :
                             r.status === "viewed" ? "Viewed" : "Awaiting response"}
                          </span>
                        </div>

                        {r.status === "quoted" && (
                          <div className="grid grid-cols-3 gap-3 mt-2">
                            <div className="p-2.5 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-0.5">Unit price</p>
                              <p className="text-sm font-bold text-foreground">{r.quoted_currency} {r.quoted_unit_price?.toFixed(2)}</p>
                            </div>
                            <div className="p-2.5 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-0.5">Lead time</p>
                              <p className="text-sm font-bold text-foreground">{r.quoted_lead_time_weeks}w</p>
                            </div>
                            <div className="p-2.5 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-0.5">Responded</p>
                              <p className="text-sm font-medium text-foreground">{r.responded_at ? format(new Date(r.responded_at), "MMM d") : "—"}</p>
                            </div>
                          </div>
                        )}

                        {r.quote_notes && (
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed bg-secondary/50 rounded-lg p-2.5">{r.quote_notes}</p>
                        )}
                      </div>

                      {r.status === "quoted" && (
                        <Button
                          size="sm"
                          onClick={() => handleConvertToOrder(rfq, r)}
                          className="flex-shrink-0 gap-1.5"
                        >
                          <Package className="h-3.5 w-3.5" />
                          Create PO
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
