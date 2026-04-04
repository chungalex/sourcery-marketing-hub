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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchFactories } from "@/lib/factories";
import type { Factory } from "@/types/database";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Plus, X, Building2, Mail, CheckCircle, Send, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Product brief" },
  { id: 2, title: "Recipients" },
  { id: 3, title: "Review & send" },
];

interface Recipient {
  type: "network" | "external";
  factory_id?: string;
  factory_name: string;
  factory_email: string;
}

export default function CreateRFQ() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [factories, setFactories] = useState<Factory[]>([]);

  // Step 1 — Product brief
  const [title, setTitle] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [fabricComposition, setFabricComposition] = useState("");
  const [quantityMin, setQuantityMin] = useState("");
  const [quantityMax, setQuantityMax] = useState("");
  const [targetPriceMin, setTargetPriceMin] = useState("");
  const [targetPriceMax, setTargetPriceMax] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [targetDeliveryWeeks, setTargetDeliveryWeeks] = useState("");
  const [techPackUrl, setTechPackUrl] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Step 2 — Recipients
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [addMode, setAddMode] = useState<"network" | "external" | null>(null);
  const [selectedFactoryId, setSelectedFactoryId] = useState("");
  const [externalName, setExternalName] = useState("");
  const [externalEmail, setExternalEmail] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/rfq/create");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchFactories().then(setFactories).catch(() => {});
  }, [user]);

  const networkFactories = factories.filter(f =>
    !recipients.find(r => r.factory_id === f.id)
  );

  const addNetworkFactory = () => {
    const f = factories.find(f => f.id === selectedFactoryId);
    if (!f) return;
    if (!f.email) { toast.error("This factory doesn't have an email on file. Add them manually."); return; }
    setRecipients(prev => [...prev, {
      type: "network",
      factory_id: f.id,
      factory_name: f.name,
      factory_email: f.email!,
    }]);
    setSelectedFactoryId("");
    setAddMode(null);
  };

  const addExternalRecipient = () => {
    if (!externalName.trim() || !externalEmail.trim()) { toast.error("Name and email required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(externalEmail)) { toast.error("Enter a valid email address"); return; }
    setRecipients(prev => [...prev, {
      type: "external",
      factory_name: externalName.trim(),
      factory_email: externalEmail.trim().toLowerCase(),
    }]);
    setExternalName("");
    setExternalEmail("");
    setAddMode(null);
  };

  const handleSend = async () => {
    if (!user) return;
    if (!title.trim()) { toast.error("Add an RFQ title"); return; }
    if (recipients.length === 0) { toast.error("Add at least one recipient"); return; }

    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Create RFQ record
      const { data: rfq, error: rfqError } = await (supabase as any)
        .from("rfqs")
        .insert({
          title: title.trim(),
          product_category: productCategory || null,
          product_description: productDescription.trim() || null,
          fabric_composition: fabricComposition.trim() || null,
          quantity_min: quantityMin ? parseInt(quantityMin) : null,
          quantity_max: quantityMax ? parseInt(quantityMax) : null,
          target_price_min: targetPriceMin ? parseFloat(targetPriceMin) : null,
          target_price_max: targetPriceMax ? parseFloat(targetPriceMax) : null,
          currency,
          target_delivery_weeks: targetDeliveryWeeks ? parseInt(targetDeliveryWeeks) : null,
          tech_pack_url: techPackUrl.trim() || null,
          additional_notes: additionalNotes.trim() || null,
          created_by: user.id,
          status: "draft",
        })
        .select()
        .single();

      if (rfqError) throw rfqError;

      // Insert recipients with unique tokens
      const recipientRows = recipients.map(r => ({
        rfq_id: rfq.id,
        factory_id: r.factory_id || null,
        factory_name: r.factory_name,
        factory_email: r.factory_email,
        token: crypto.randomUUID(),
        status: "pending",
      }));

      const { error: recipError } = await (supabase as any)
        .from("rfq_recipients")
        .insert(recipientRows);

      if (recipError) throw recipError;

      // Send emails via edge function
      const { error: sendError } = await supabase.functions.invoke("send-rfq", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { rfq_id: rfq.id },
      });

      if (sendError) throw sendError;

      setSent(true);
      toast.success(`RFQ sent to ${recipients.length} ${recipients.length === 1 ? "factory" : "factories"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send RFQ");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <Layout>
        <section className="section-padding min-h-[70vh] flex items-center">
          <div className="container max-w-lg text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">RFQ sent</h1>
              <p className="text-muted-foreground mb-2">
                Your request for quotation has been sent to {recipients.length} {recipients.length === 1 ? "factory" : "factories"}.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Each factory receives a unique link to submit their quote — price, MOQ, lead time, and any questions. You'll be notified when responses come in. Quotes typically arrive within 24–72 hours.
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link to="/dashboard?tab=rfq">View RFQ responses</Link>
                </Button>
                <Button variant="outline" onClick={() => { setSent(false); setStep(1); setTitle(""); setRecipients([]); setProductDescription(""); }}>
                  Send another RFQ
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Request for Quotation — Sourcery" description="Send a product brief to multiple factories and compare quotes." />
      <section className="section-padding min-h-[80vh]">
        <div className="container max-w-2xl">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">Request for Quotation</h1>
            <p className="text-muted-foreground text-sm">
              Send your product brief to multiple factories at once. Each factory submits their own quote — price, MOQ, lead time. You compare and convert the best one to a formal PO.
            </p>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-3 mb-8">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    step === s.id ? "bg-primary text-primary-foreground" :
                    step > s.id ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {step > s.id ? <CheckCircle className="h-4 w-4" /> : s.id}
                  </div>
                  <span className={cn("text-sm font-medium hidden sm:block", step === s.id ? "text-foreground" : "text-muted-foreground")}>
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div className={cn("h-px flex-1", step > s.id ? "bg-green-500" : "bg-muted")} />}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8">

            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Product brief</h2>
                  <p className="text-sm text-muted-foreground">Describe what you need produced. The more detail you provide, the more accurate the quotes you receive.</p>
                </div>

                <div className="space-y-1.5">
                  <Label>RFQ title <span className="text-rose-500">*</span></Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. SS26 Denim Jacket — 300 units, 3 colourways" />
                  <p className="text-xs text-muted-foreground">This is the subject line factories see in the email.</p>
                </div>

                <div className="space-y-1.5">
                  <Label>Product category</Label>
                  <Select value={productCategory} onValueChange={setProductCategory}>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "tops", label: "Tops — T-shirts, shirts, blouses" },
                        { value: "hoodies_sweats", label: "Hoodies & sweatshirts" },
                        { value: "outerwear", label: "Outerwear — jackets, coats" },
                        { value: "knitwear", label: "Knitwear & sweaters" },
                        { value: "tailoring", label: "Tailoring & suiting" },
                        { value: "denim", label: "Denim — jeans, jackets, shorts" },
                        { value: "trousers", label: "Trousers & shorts" },
                        { value: "skirts", label: "Skirts & dresses" },
                        { value: "activewear", label: "Activewear & sportswear" },
                        { value: "swimwear", label: "Swimwear & beachwear" },
                        { value: "footwear", label: "Footwear" },
                        { value: "bags", label: "Bags & leather goods" },
                        { value: "accessories", label: "Accessories" },
                        { value: "home", label: "Home & soft goods" },
                        { value: "other", label: "Other" },
                      ].map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Product description</Label>
                  <Textarea
                    value={productDescription}
                    onChange={e => setProductDescription(e.target.value)}
                    placeholder={"Describe the product in detail — construction, key features, fit, finish.\ne.g. 5-pocket slim fit denim jacket, chain stitch hem, washed finish, branded metal hardware."}
                    className="min-h-[100px] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Fabric composition</Label>
                  <Input value={fabricComposition} onChange={e => setFabricComposition(e.target.value)} placeholder="e.g. 98% cotton, 2% elastane — 12oz ring-spun denim" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Quantity — minimum</Label>
                    <Input type="number" value={quantityMin} onChange={e => setQuantityMin(e.target.value)} placeholder="e.g. 200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Quantity — maximum</Label>
                    <Input type="number" value={quantityMax} onChange={e => setQuantityMax(e.target.value)} placeholder="e.g. 500" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-1">
                    <Label>Target price — from</Label>
                    <Input type="number" step="0.01" value={targetPriceMin} onChange={e => setTargetPriceMin(e.target.value)} placeholder="e.g. 22" />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <Label>Target price — to</Label>
                    <Input type="number" step="0.01" value={targetPriceMax} onChange={e => setTargetPriceMax(e.target.value)} placeholder="e.g. 30" />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <Label>Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["USD", "EUR", "GBP", "CNY", "VND"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Target delivery</Label>
                  <Select value={targetDeliveryWeeks} onValueChange={setTargetDeliveryWeeks}>
                    <SelectTrigger><SelectValue placeholder="When do you need the goods?" /></SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "8", label: "8 weeks (rush)" },
                        { value: "12", label: "12 weeks" },
                        { value: "16", label: "16 weeks" },
                        { value: "20", label: "20 weeks" },
                        { value: "24", label: "24 weeks" },
                        { value: "30", label: "30+ weeks (no rush)" },
                      ].map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Tech pack or reference</Label>
                  <Input type="url" value={techPackUrl} onChange={e => setTechPackUrl(e.target.value)} placeholder="Google Drive, Dropbox, or Notion link — shared with all recipients" />
                </div>

                <div className="space-y-1.5">
                  <Label>Additional notes</Label>
                  <Textarea
                    value={additionalNotes}
                    onChange={e => setAdditionalNotes(e.target.value)}
                    placeholder="Certifications required, specific machinery, sustainability requirements, or anything else the factory needs to know before quoting."
                    className="min-h-[80px] text-sm"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={() => setStep(2)} disabled={!title.trim()}>
                    Continue <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Recipients */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Recipients</h2>
                  <p className="text-sm text-muted-foreground">
                    Add factories from the Sourcery network or send to any factory by email — even if they're not on the platform. Each receives their own unique response link. No account required to quote.
                  </p>
                </div>

                {/* Added recipients */}
                {recipients.length > 0 && (
                  <div className="space-y-2">
                    {recipients.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {r.type === "network" ? <Building2 className="h-4 w-4 text-primary" /> : <Mail className="h-4 w-4 text-primary" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{r.factory_name}</p>
                            <p className="text-xs text-muted-foreground">{r.factory_email}</p>
                          </div>
                          {r.type === "network" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Network</span>
                          )}
                        </div>
                        <button onClick={() => setRecipients(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-foreground transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add recipient UI */}
                {!addMode && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setAddMode("network")} className="flex-1 gap-2">
                      <Building2 className="h-4 w-4" /> Add from network
                    </Button>
                    <Button variant="outline" onClick={() => setAddMode("external")} className="flex-1 gap-2">
                      <Mail className="h-4 w-4" /> Add by email
                    </Button>
                  </div>
                )}

                {addMode === "network" && (
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                    <Label>Select a factory from the network</Label>
                    <Select value={selectedFactoryId} onValueChange={setSelectedFactoryId}>
                      <SelectTrigger><SelectValue placeholder="Search factories..." /></SelectTrigger>
                      <SelectContent>
                        {networkFactories.map(f => (
                          <SelectItem key={f.id} value={f.id}>
                            <div className="flex items-center gap-2">
                              <span>{f.name}</span>
                              <span className="text-muted-foreground">— {f.city}, {f.country}</span>
                              {!f.email && <span className="text-rose-500 text-xs">(no email on file)</span>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addNetworkFactory} disabled={!selectedFactoryId}>Add factory</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setAddMode(null); setSelectedFactoryId(""); }}>Cancel</Button>
                    </div>
                  </div>
                )}

                {addMode === "external" && (
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Add factory by email</p>
                      <p className="text-xs text-muted-foreground">The factory receives the RFQ email and can submit a quote without creating an account.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Factory name</Label>
                        <Input value={externalName} onChange={e => setExternalName(e.target.value)} placeholder="e.g. HU LA Studios" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Email address</Label>
                        <Input type="email" value={externalEmail} onChange={e => setExternalEmail(e.target.value)} placeholder="contact@factory.com" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addExternalRecipient} disabled={!externalName.trim() || !externalEmail.trim()}>Add recipient</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setAddMode(null); setExternalName(""); setExternalEmail(""); }}>Cancel</Button>
                    </div>
                  </div>
                )}

                {recipients.length === 0 && !addMode && (
                  <div className="p-4 rounded-xl bg-secondary/30 border border-dashed border-border text-center">
                    <p className="text-sm text-muted-foreground">No recipients yet. Add factories from the network or by email.</p>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-secondary/50 border border-border flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Each factory receives an individual email with a unique link. They submit their quote — price per unit, MOQ, lead time, and any conditions — directly through a response page. No Sourcery account required. You see all quotes in your dashboard.
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={recipients.length === 0}>
                    Review RFQ <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Review & Send */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Review & send</h2>
                  <p className="text-sm text-muted-foreground">Check the details before sending. Factories receive their emails immediately.</p>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                  <p className="font-semibold text-foreground">{title}</p>
                  {productCategory && <p className="text-xs text-muted-foreground capitalize">{productCategory.replace(/_/g, " ")}</p>}
                  {productDescription && <p className="text-sm text-foreground leading-relaxed">{productDescription}</p>}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-primary/10">
                    {quantityMin && (
                      <div>
                        <p className="text-xs text-muted-foreground">Quantity</p>
                        <p className="text-sm font-medium text-foreground">{quantityMin}{quantityMax ? `–${quantityMax}` : "+"} units</p>
                      </div>
                    )}
                    {targetPriceMin && (
                      <div>
                        <p className="text-xs text-muted-foreground">Target price</p>
                        <p className="text-sm font-medium text-foreground">{currency} {targetPriceMin}{targetPriceMax ? `–${targetPriceMax}` : "+"}/unit</p>
                      </div>
                    )}
                    {targetDeliveryWeeks && (
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <p className="text-sm font-medium text-foreground">{targetDeliveryWeeks} weeks</p>
                      </div>
                    )}
                    {techPackUrl && (
                      <div>
                        <p className="text-xs text-muted-foreground">Tech pack</p>
                        <a href={techPackUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">View →</a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recipients */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Sending to {recipients.length} {recipients.length === 1 ? "factory" : "factories"}</p>
                  <div className="space-y-2">
                    {recipients.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {r.type === "network" ? <Building2 className="h-3.5 w-3.5 text-primary" /> : <Mail className="h-3.5 w-3.5 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{r.factory_name}</p>
                          <p className="text-xs text-muted-foreground">{r.factory_email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{r.type === "network" ? "Network" : "External"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button onClick={handleSend} disabled={sending} className="gap-2">
                    {sending ? (
                      <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                    ) : (
                      <><Send className="h-4 w-4" />Send RFQ to {recipients.length} {recipients.length === 1 ? "factory" : "factories"}</>
                    )}
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
