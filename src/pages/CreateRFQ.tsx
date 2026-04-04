import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { fetchFactories } from "@/lib/factories";
import { toast } from "sonner";
import { ArrowLeft, Plus, X, Send, Building2, Mail, Loader2, Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Factory } from "@/types/database";

interface Recipient {
  id: string;
  factory_id?: string;
  factory_name: string;
  factory_email: string;
  type: "network" | "external";
}

export default function CreateRFQ() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [factories, setFactories] = useState<Factory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Brief fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [qtyMin, setQtyMin] = useState("");
  const [qtyMax, setQtyMax] = useState("");
  const [targetPriceMin, setTargetPriceMin] = useState("");
  const [targetPriceMax, setTargetPriceMax] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [deliveryWeeks, setDeliveryWeeks] = useState("");
  const [techPackUrl, setTechPackUrl] = useState("");
  const [fabricComposition, setFabricComposition] = useState("");
  const [sizeRange, setSizeRange] = useState("");

  // Recipients
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [externalName, setExternalName] = useState("");
  const [externalEmail, setExternalEmail] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/rfq/create");
    if (user) fetchFactories().then(setFactories).catch(() => {});
  }, [user, authLoading]);

  const networkFactories = factories.filter(f => !recipients.find(r => r.factory_id === f.id));

  const addNetworkFactory = (factory: Factory) => {
    if (recipients.find(r => r.factory_id === factory.id)) return;
    setRecipients(prev => [...prev, {
      id: crypto.randomUUID(),
      factory_id: factory.id,
      factory_name: factory.name,
      factory_email: factory.email || `contact@${factory.slug}.sourcery`,
      type: "network",
    }]);
  };

  const addExternal = () => {
    if (!externalName.trim() || !externalEmail.trim()) { toast.error("Enter factory name and email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(externalEmail)) { toast.error("Enter a valid email"); return; }
    setRecipients(prev => [...prev, {
      id: crypto.randomUUID(),
      factory_name: externalName.trim(),
      factory_email: externalEmail.trim(),
      type: "external",
    }]);
    setExternalName(""); setExternalEmail("");
  };

  const removeRecipient = (id: string) => setRecipients(prev => prev.filter(r => r.id !== id));

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error("Add a title for your RFQ"); return; }
    if (!recipients.length) { toast.error("Add at least one factory to send to"); return; }
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Create RFQ
      const { data: rfq, error: rfqError } = await (supabase as any)
        .from("rfqs")
        .insert({
          brand_id: user!.id,
          title: title.trim(),
          product_category: category || null,
          product_description: description.trim() || null,
          quantity_min: qtyMin ? parseInt(qtyMin) : null,
          quantity_max: qtyMax ? parseInt(qtyMax) : null,
          target_price_min: targetPriceMin ? parseFloat(targetPriceMin) : null,
          target_price_max: targetPriceMax ? parseFloat(targetPriceMax) : null,
          currency,
          target_delivery_weeks: deliveryWeeks ? parseInt(deliveryWeeks) : null,
          tech_pack_url: techPackUrl.trim() || null,
          specifications: {
            fabric_composition: fabricComposition || null,
            size_range: sizeRange || null,
          },
          status: "draft",
        })
        .select()
        .single();

      if (rfqError || !rfq) throw new Error(rfqError?.message || "Failed to create RFQ");

      // Create recipients
      await (supabase as any).from("rfq_recipients").insert(
        recipients.map(r => ({
          rfq_id: rfq.id,
          factory_id: r.factory_id || null,
          factory_name: r.factory_name,
          factory_email: r.factory_email,
        }))
      );

      // Send emails
      const { data: sendResult } = await supabase.functions.invoke("send-rfq", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { rfq_id: rfq.id },
      });

      toast.success(`RFQ sent to ${recipients.length} ${recipients.length === 1 ? "factory" : "factories"}.`);
      navigate("/dashboard?tab=rfq");
    } catch (e: any) {
      toast.error(e.message || "Failed to send RFQ");
    }
    setSubmitting(false);
  };

  const canProceedStep1 = title.trim().length > 0;

  return (
    <Layout>
      <SEO title="New RFQ — Sourcery" description="Send a request for quotation to multiple factories." />
      <section className="section-padding">
        <div className="container max-w-2xl">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">New Request for Quotation</h1>
            <p className="text-muted-foreground text-sm">
              Send a product brief to multiple factories at once — on the Sourcery network or anywhere via email. Each factory responds with their quote. You compare and convert the best one to a formal PO.
            </p>
          </div>

          {/* Step tabs */}
          <div className="flex gap-1 mb-8 bg-secondary/50 p-1 rounded-lg">
            {[{ n: 1, label: "Product brief" }, { n: 2, label: "Select factories" }].map(s => (
              <button
                key={s.n}
                type="button"
                onClick={() => step === 2 || canProceedStep1 ? setStep(s.n as 1 | 2) : null}
                className={cn(
                  "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                  step === s.n ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s.n === 1 && step > 1 && <Check className="inline h-3.5 w-3.5 mr-1.5 text-green-600" />}
                {s.label}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="space-y-2">
                  <Label>RFQ title</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. SS26 Denim Jacket — 300 units, 3 colourways" />
                  <p className="text-xs text-muted-foreground">Factories will see this as the subject of your RFQ.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {[
                          ["tops", "Tops"], ["hoodies_sweats", "Hoodies & sweatshirts"],
                          ["outerwear", "Outerwear"], ["knitwear", "Knitwear"],
                          ["denim", "Denim"], ["trousers", "Trousers & shorts"],
                          ["activewear", "Activewear"], ["swimwear", "Swimwear"],
                          ["footwear", "Footwear"], ["bags", "Bags & leather goods"],
                          ["accessories", "Accessories"], ["home", "Home & soft goods"],
                          ["other", "Other"],
                        ].map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Size range</Label>
                    <Select value={sizeRange} onValueChange={setSizeRange}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {[["one_size","One size"],["xs_xl","XS–XL"],["xs_xxl","XS–XXL"],["s_xl","S–XL"],["numeric_28_38","Numeric 28–38"],["custom","Custom"]].map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product description</Label>
                  <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder={"Construction: e.g. 5-pocket, chain stitch hem, bar tacks\nFabric: e.g. 12oz selvedge denim, 98% cotton 2% elastane\nColourways: e.g. 3 colourways — indigo, stone, black\nFinishes: e.g. garment washed, enzyme treated\nAny special requirements or reference to previous season."}
                    className="min-h-[140px] text-sm"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fabric composition</Label>
                    <Input value={fabricComposition} onChange={e => setFabricComposition(e.target.value)} placeholder="e.g. 98% cotton, 2% elastane" />
                  </div>
                  <div className="space-y-2">
                    <Label>Target delivery</Label>
                    <Select value={deliveryWeeks} onValueChange={setDeliveryWeeks}>
                      <SelectTrigger><SelectValue placeholder="Weeks from now" /></SelectTrigger>
                      <SelectContent>
                        {[["12","12 weeks"],["14","14 weeks"],["16","16 weeks"],["18","18 weeks"],["20","20 weeks"],["24","24 weeks"],["28","28 weeks"]].map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity range</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" value={qtyMin} onChange={e => setQtyMin(e.target.value)} placeholder="Min" className="w-24" />
                      <span className="text-muted-foreground text-sm">to</span>
                      <Input type="number" value={qtyMax} onChange={e => setQtyMax(e.target.value)} placeholder="Max" className="w-24" />
                      <span className="text-muted-foreground text-sm">units</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Target price range</Label>
                    <div className="flex items-center gap-2">
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["USD","EUR","GBP","AUD","CAD"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input type="number" value={targetPriceMin} onChange={e => setTargetPriceMin(e.target.value)} placeholder="Min" className="w-20" step="0.01" />
                      <span className="text-muted-foreground text-sm">–</span>
                      <Input type="number" value={targetPriceMax} onChange={e => setTargetPriceMax(e.target.value)} placeholder="Max" className="w-20" step="0.01" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tech pack link</Label>
                  <Input type="url" value={techPackUrl} onChange={e => setTechPackUrl(e.target.value)} placeholder="Google Drive, Dropbox, or Notion" />
                  <p className="text-xs text-muted-foreground">Sharing your tech pack gets more accurate quotes and reduces back-and-forth.</p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                    Select factories →
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* Selected recipients */}
                {recipients.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Sending to {recipients.length} {recipients.length === 1 ? "factory" : "factories"}</Label>
                    {recipients.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-primary/5">
                        <div className="flex items-center gap-2.5">
                          {r.type === "network"
                            ? <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                            : <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          }
                          <div>
                            <p className="text-sm font-medium text-foreground">{r.factory_name}</p>
                            <p className="text-xs text-muted-foreground">{r.factory_email}</p>
                          </div>
                          {r.type === "network" && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Sourcery network</span>
                          )}
                        </div>
                        <button type="button" onClick={() => removeRecipient(r.id)} className="text-muted-foreground hover:text-foreground p-1">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add from network */}
                {networkFactories.length > 0 && (
                  <div className="space-y-2">
                    <Label>Add from Sourcery network</Label>
                    <div className="space-y-1.5">
                      {networkFactories.slice(0, 10).map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => addNetworkFactory(f)}
                          className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{f.name}</p>
                              <p className="text-xs text-muted-foreground">{f.city ? `${f.city}, ` : ""}{f.country}{f.moq_min ? ` · MOQ ${f.moq_min.toLocaleString()}` : ""}</p>
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add off-network factory */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div>
                    <Label className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Send to any factory by email
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Factories don't need a Sourcery account to receive and respond to your RFQ. They get an email with a link to submit their quote directly.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input value={externalName} onChange={e => setExternalName(e.target.value)} placeholder="Factory name" />
                    <Input type="email" value={externalEmail} onChange={e => setExternalEmail(e.target.value)} placeholder="contact@factory.com" />
                  </div>
                  <Button type="button" variant="outline" onClick={addExternal} className="gap-2">
                    <Plus className="h-4 w-4" />Add factory
                  </Button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                  <Button onClick={handleSubmit} disabled={!recipients.length || submitting} className="gap-2">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send RFQ to {recipients.length || ""} {recipients.length === 1 ? "factory" : "factories"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
