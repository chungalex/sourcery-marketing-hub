import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, Loader2, Building2 } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function RFQRespond() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [rfq, setRfq] = useState<any>(null);
  const [recipient, setRecipient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [unitPrice, setUnitPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [moq, setMoq] = useState("");
  const [leadTimeWeeks, setLeadTimeWeeks] = useState("");
  const [notes, setNotes] = useState("");
  const [declining, setDeclining] = useState(false);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    (async () => {
      const { data: rec } = await (supabase as any)
        .from("rfq_recipients")
        .select("*, rfqs(*)")
        .eq("token", token)
        .single();

      if (rec) {
        setRecipient(rec);
        setRfq(rec.rfqs);
        // Mark as viewed
        if (rec.status === "pending") {
          await (supabase as any).from("rfq_recipients")
            .update({ status: "viewed", viewed_at: new Date().toISOString() })
            .eq("token", token);
        }
        if (rec.status === "quoted") setSubmitted(true);
      }
      setLoading(false);
    })();
  }, [token]);

  const handleSubmit = async () => {
    if (!unitPrice || !leadTimeWeeks) { toast.error("Price and lead time are required"); return; }
    setSubmitting(true);
    try {
      await (supabase as any).from("rfq_recipients").update({
        status: "quoted",
        quoted_unit_price: parseFloat(unitPrice),
        quoted_currency: currency,
        quoted_moq: moq ? parseInt(moq) : null,
        quoted_lead_time_weeks: parseInt(leadTimeWeeks),
        quote_notes: notes.trim() || null,
        responded_at: new Date().toISOString(),
      }).eq("token", token);
      setSubmitted(true);
      toast.success("Quote submitted successfully.");
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const handleDecline = async () => {
    await (supabase as any).from("rfq_recipients")
      .update({ status: "declined", responded_at: new Date().toISOString() })
      .eq("token", token);
    setDeclined(true);
  };

  const [declined, setDeclined] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!token || !rfq) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-foreground font-medium mb-2">This link is invalid or has expired.</p>
        <Link to="/" className="text-primary hover:underline text-sm">Visit Sourcery →</Link>
      </div>
    </div>
  );

  return (
    <>
      <SEO title={`RFQ: ${rfq.title} — Sourcery`} description="Submit your quote for this request for quotation." noIndex />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-base">S</span>
            </div>
            <span className="font-semibold text-foreground">Sourcery</span>
            <span className="text-muted-foreground text-sm ml-2">Request for Quotation</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10">
          {submitted || declined ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                {declined ? "Response recorded" : "Quote submitted"}
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                {declined
                  ? "The brand has been notified that you're unable to fulfil this request."
                  : "The brand will review your quote alongside others and be in touch if they'd like to proceed."}
              </p>
              <p className="text-xs text-muted-foreground">
                Want to manage orders on Sourcery?{" "}
                <Link to="/auth?mode=signup&factory=1" className="text-primary hover:underline">Create a free factory account →</Link>
              </p>
            </motion.div>
          ) : (
            <>
              {/* RFQ brief */}
              <div className="mb-8">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Request for quotation</p>
                <h1 className="text-2xl font-bold text-foreground mb-1">{rfq.title}</h1>
                <p className="text-muted-foreground text-sm mb-4">
                  Submitted by a brand on Sourcery · Respond with your quote below
                </p>
                <div className="p-5 rounded-xl bg-card border border-border space-y-3">
                  {rfq.product_category && (
                    <div className="flex gap-3 text-sm">
                      <span className="text-muted-foreground w-28 flex-shrink-0">Category</span>
                      <span className="text-foreground capitalize">{rfq.product_category.replace(/_/g, " ")}</span>
                    </div>
                  )}
                  {(rfq.quantity_min || rfq.quantity_max) && (
                    <div className="flex gap-3 text-sm">
                      <span className="text-muted-foreground w-28 flex-shrink-0">Quantity</span>
                      <span className="text-foreground">{rfq.quantity_min}{rfq.quantity_max ? `–${rfq.quantity_max}` : "+"} units</span>
                    </div>
                  )}
                  {rfq.target_delivery_weeks && (
                    <div className="flex gap-3 text-sm">
                      <span className="text-muted-foreground w-28 flex-shrink-0">Target delivery</span>
                      <span className="text-foreground">{rfq.target_delivery_weeks} weeks from PO</span>
                    </div>
                  )}
                  {(rfq.target_price_min || rfq.target_price_max) && (
                    <div className="flex gap-3 text-sm">
                      <span className="text-muted-foreground w-28 flex-shrink-0">Target price</span>
                      <span className="text-foreground">{rfq.currency} {rfq.target_price_min}{rfq.target_price_max ? `–${rfq.target_price_max}` : "+"}/unit</span>
                    </div>
                  )}
                  {rfq.product_description && (
                    <div className="flex gap-3 text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground w-28 flex-shrink-0 pt-0.5">Details</span>
                      <span className="text-foreground leading-relaxed whitespace-pre-wrap">{rfq.product_description}</span>
                    </div>
                  )}
                  {rfq.tech_pack_url && (
                    <div className="flex gap-3 text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground w-28 flex-shrink-0">Tech pack</span>
                      <a href={rfq.tech_pack_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        View tech pack →
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Quote form */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h2 className="font-semibold text-foreground">Your quote</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit price <span className="text-rose-500">*</span></Label>
                    <div className="flex gap-2">
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["USD","EUR","GBP","CNY","VND"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input type="number" step="0.01" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="e.g. 28.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Lead time (weeks) <span className="text-rose-500">*</span></Label>
                    <Input type="number" value={leadTimeWeeks} onChange={e => setLeadTimeWeeks(e.target.value)} placeholder="e.g. 14" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Minimum order quantity</Label>
                  <Input type="number" value={moq} onChange={e => setMoq(e.target.value)} placeholder="e.g. 100 units per colourway" />
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder={"Any conditions, questions, or context for your quote:\n— Fabric sourcing notes\n— Capacity availability\n— Questions about the spec\n— Samples timeline"}
                    className="min-h-[120px] text-sm"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleDecline}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Unable to fulfil this request
                  </button>
                  <Button onClick={handleSubmit} disabled={submitting || !unitPrice || !leadTimeWeeks} className="gap-2">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    Submit quote
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-6">
                No Sourcery account required. Your quote goes directly to the brand.{" "}
                <Link to="/" className="text-primary hover:underline">Learn about Sourcery →</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
