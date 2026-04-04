import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  ArrowLeft, ArrowRight, Plus, X, Building2, Mail, CheckCircle,
  Send, Info, Globe, HelpCircle, ExternalLink, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Product brief" },
  { id: 2, title: "Recipients" },
  { id: 3, title: "Review & send" },
];

const FABRIC_EXAMPLES: Record<string, string> = {
  tops: "e.g. 180gsm cotton jersey, or 30s ring-spun combed cotton",
  hoodies_sweats: "e.g. 380gsm cotton fleece, 80% cotton 20% polyester",
  outerwear: "e.g. 200D ripstop nylon with DWR coating, or wool-poly blend",
  knitwear: "e.g. 12-gauge merino wool, or cotton-acrylic blend",
  tailoring: "e.g. 280gsm wool suiting, or polyester-viscose blend",
  denim: "e.g. 12oz ring-spun selvedge denim, 98% cotton 2% elastane",
  trousers: "e.g. 260gsm cotton twill, or linen-cotton blend",
  skirts: "e.g. 140gsm viscose crepe, or cotton poplin",
  activewear: "e.g. 200gsm 4-way stretch nylon-spandex (80/20)",
  swimwear: "e.g. 210gsm recycled nylon-spandex (80/20), chlorine resistant",
  footwear: "e.g. full-grain leather upper, rubber outsole",
  bags: "e.g. 600D polyester, or full-grain cowhide leather",
  accessories: "e.g. 100% wool felt, or brass hardware",
  home: "e.g. 400 thread count percale cotton",
  other: "e.g. describe the material — fabric type, weight, fibre content",
};

interface Recipient {
  type: "network" | "external";
  factory_id?: string;
  factory_name: string;
  factory_email: string;
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{children}</p>;
}

function SectionGuide({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-secondary/50 transition-colors">
        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <span className="ml-auto text-xs text-muted-foreground">{open ? "Hide" : "Show"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-3 pb-3 pt-1 text-xs text-muted-foreground leading-relaxed space-y-1.5 border-t border-border">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CreateRFQ() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [factories, setFactories] = useState<Factory[]>([]);

  // Step 1
  const [title, setTitle] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [fabricComposition, setFabricComposition] = useState("");
  const [fabricNotes, setFabricNotes] = useState("");
  const [quantityMin, setQuantityMin] = useState("");
  const [quantityMax, setQuantityMax] = useState("");
  const [targetPriceMin, setTargetPriceMin] = useState("");
  const [targetPriceMax, setTargetPriceMax] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [targetDeliveryWeeks, setTargetDeliveryWeeks] = useState("");
  const [techPackUrl, setTechPackUrl] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Step 2
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

  const networkFactories = factories.filter(f => !recipients.find(r => r.factory_id === f.id));

  const addNetworkFactory = () => {
    const f = factories.find(f => f.id === selectedFactoryId);
    if (!f) return;
    if (!f.email) { toast.error("This factory has no email on file. Add them manually below."); return; }
    setRecipients(prev => [...prev, { type: "network", factory_id: f.id, factory_name: f.name, factory_email: f.email! }]);
    setSelectedFactoryId(""); setAddMode(null);
  };

  const addExternalRecipient = () => {
    if (!externalName.trim() || !externalEmail.trim()) { toast.error("Factory name and email required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(externalEmail)) { toast.error("Enter a valid email address"); return; }
    if (recipients.find(r => r.factory_email.toLowerCase() === externalEmail.toLowerCase())) {
      toast.error("That email is already in the list"); return;
    }
    setRecipients(prev => [...prev, { type: "external", factory_name: externalName.trim(), factory_email: externalEmail.trim().toLowerCase() }]);
    setExternalName(""); setExternalEmail(""); setAddMode(null);
  };

  const handleSend = async () => {
    if (!user) return;
    if (!title.trim()) { toast.error("Add an RFQ title"); setStep(1); return; }
    if (recipients.length === 0) { toast.error("Add at least one recipient"); setStep(2); return; }

    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const finalCategory = productCategory === "other" && otherCategory.trim()
        ? otherCategory.trim()
        : productCategory || null;

      // BUG FIX: use brand_id not created_by
      const { data: rfq, error: rfqError } = await (supabase as any)
        .from("rfqs")
        .insert({
          brand_id: user.id,
          title: title.trim(),
          product_category: finalCategory,
          product_description: productDescription.trim() || null,
          quantity_min: quantityMin ? parseInt(quantityMin) : null,
          quantity_max: quantityMax ? parseInt(quantityMax) : null,
          target_price_min: targetPriceMin ? parseFloat(targetPriceMin) : null,
          target_price_max: targetPriceMax ? parseFloat(targetPriceMax) : null,
          currency,
          target_delivery_weeks: targetDeliveryWeeks ? parseInt(targetDeliveryWeeks) : null,
          tech_pack_url: techPackUrl.trim() || null,
          specifications: {
            fabric_composition: fabricComposition.trim() || null,
            fabric_notes: fabricNotes.trim() || null,
            additional_notes: additionalNotes.trim() || null,
          },
          status: "draft",
        })
        .select()
        .single();

      if (rfqError) throw rfqError;

      // Insert recipients
      const { error: recipError } = await (supabase as any)
        .from("rfq_recipients")
        .insert(recipients.map(r => ({
          rfq_id: rfq.id,
          factory_id: r.factory_id || null,
          factory_name: r.factory_name,
          factory_email: r.factory_email,
          status: "pending",
        })));

      if (recipError) throw recipError;

      // Send emails via edge function (best effort — don't fail if not deployed yet)
      try {
        await supabase.functions.invoke("send-rfq", {
          headers: { Authorization: `Bearer ${session?.access_token}` },
          body: { rfq_id: rfq.id },
        });
      } catch {
        // Edge function not deployed yet — RFQ saved but emails not sent
        toast.warning("RFQ saved. Deploy the send-rfq edge function in Lovable to enable email delivery.");
      }

      setSentCount(recipients.length);
      setSent(true);
    } catch (err: any) {
      console.error("RFQ send error:", err);
      toast.error(err.message || "Failed to send RFQ. Check that the rfqs table SQL has been run.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <Layout>
        <SEO title="RFQ Sent — Sourcery" description="" noIndex />
        <section className="section-padding min-h-[70vh] flex items-center">
          <div className="container max-w-lg">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">RFQ sent</h1>
              <p className="text-muted-foreground mb-2">
                Your request for quotation has been sent to <strong>{sentCount} {sentCount === 1 ? "factory" : "factories"}</strong>.
              </p>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Each factory received a unique link to submit their quote — price per unit, MOQ, lead time, and conditions.
                You'll see all responses in your dashboard as they come in. Most quotes arrive within 24–72 hours.
              </p>

              <div className="p-4 rounded-xl bg-secondary/50 border border-border text-left mb-8 space-y-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">What happens next</p>
                {[
                  "Factories open their email and click their unique quote link",
                  "Each factory submits their price, MOQ, lead time, and any conditions",
                  "You see all quotes side by side in the RFQs tab of your dashboard",
                  "Select the best quote and hit 'Create PO' — their pricing pre-fills your order form",
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-xs text-muted-foreground leading-relaxed">{s}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/dashboard?tab=rfq">View RFQ responses</Link>
                </Button>
                <Button variant="outline" onClick={() => {
                  setSent(false); setStep(1); setTitle(""); setProductCategory("");
                  setProductDescription(""); setFabricComposition(""); setRecipients([]);
                }}>
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
            <p className="text-muted-foreground text-sm leading-relaxed">
              Send your product brief to multiple factories at once. Each factory submits their own quote — price, MOQ, lead time. You compare and convert the best one to a formal PO. Factories outside Sourcery can respond without creating an account.
            </p>
          </div>

          {/* Progress steps */}
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
                {i < STEPS.length - 1 && <div className={cn("h-px flex-1 transition-colors", step > s.id ? "bg-green-500" : "bg-muted")} />}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8">

            {/* ── STEP 1: Product brief ── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Product brief</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tell factories exactly what you need. The more detail you include, the more accurate and comparable the quotes you'll receive. Vague briefs get vague quotes.
                  </p>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <Label>RFQ title <span className="text-rose-500">*</span></Label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. SS26 Denim Jacket — 300 units, 3 colourways"
                  />
                  <FieldHint>This is the subject line factories see in the email. Be specific — a clear title signals a professional buyer.</FieldHint>
                </div>

                {/* Category */}
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
                        { value: "other", label: "Other — I'll describe it" },
                      ].map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldHint>Helps factories confirm they have the right equipment and expertise before quoting.</FieldHint>
                  {productCategory === "other" && (
                    <div className="pt-1">
                      <Input
                        value={otherCategory}
                        onChange={e => setOtherCategory(e.target.value)}
                        placeholder="Describe your product type — e.g. pet accessories, medical scrubs, luggage"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label>Product description</Label>
                  <Textarea
                    value={productDescription}
                    onChange={e => setProductDescription(e.target.value)}
                    placeholder={"Describe the product clearly — construction, key features, fit, finish, and any details that affect manufacturing cost or complexity.\n\ne.g. 5-pocket slim fit denim jacket, chain stitch hem and outseam, YKK zip closure, washed finish, branded corozo buttons. Inspired by vintage Levi's Type III but with a modern slim silhouette."}
                    className="min-h-[120px] text-sm"
                  />
                  <FieldHint>Include anything that affects cost or production complexity — closures, stitching types, special washes, embroidery, printing, labelling. The factory uses this to assess whether they can make it and at what price.</FieldHint>
                </div>

                {/* Fabric */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>Fabric / material</Label>
                    <a href="/resources" className="text-xs text-primary hover:underline flex items-center gap-1">
                      Fabric guide <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <Input
                    value={fabricComposition}
                    onChange={e => setFabricComposition(e.target.value)}
                    placeholder={FABRIC_EXAMPLES[productCategory] || "e.g. fabric type, fibre content, weight — or describe what you're looking for"}
                  />
                  <FieldHint>
                    Include fibre content (e.g. 98% cotton 2% elastane), weight (gsm or oz), and construction type (jersey, twill, woven, knit). If you're not sure, describe the look and feel you want — factories can suggest options.
                  </FieldHint>
                  <Textarea
                    value={fabricNotes}
                    onChange={e => setFabricNotes(e.target.value)}
                    placeholder="Optional: describe the look, feel, or performance you want if you don't know the exact spec — e.g. 'medium weight, structured but has some stretch, matte finish, similar to workwear canvas'"
                    className="min-h-[60px] text-sm"
                  />
                </div>

                <SectionGuide title="Not sure what fabric to specify?">
                  <p>It's fine not to know the exact spec — describe what you want instead:</p>
                  <p>• <strong>Look:</strong> matte, shiny, textured, smooth, structured, drapey</p>
                  <p>• <strong>Feel:</strong> soft, crisp, heavy, lightweight, stretchy, rigid</p>
                  <p>• <strong>Performance:</strong> moisture-wicking, quick-dry, UV-resistant, waterproof</p>
                  <p>• <strong>Sustainability:</strong> organic, recycled, GOTS-certified, deadstock</p>
                  <p>Factories will suggest materials that match — and include their cost implications in the quote.</p>
                </SectionGuide>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <Label>Quantity range</Label>
                  <div className="flex items-center gap-3">
                    <Input type="number" value={quantityMin} onChange={e => setQuantityMin(e.target.value)} placeholder="Min" className="w-28" />
                    <span className="text-muted-foreground text-sm flex-shrink-0">to</span>
                    <Input type="number" value={quantityMax} onChange={e => setQuantityMax(e.target.value)} placeholder="Max" className="w-28" />
                    <span className="text-muted-foreground text-sm flex-shrink-0">units total</span>
                  </div>
                  <FieldHint>Total units across all sizes and colourways. A range lets you see how pricing changes at different volumes. Factories will quote at their MOQ if your minimum is below it.</FieldHint>
                </div>

                {/* Pricing */}
                <div className="space-y-1.5">
                  <Label>Target unit price</Label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["USD", "EUR", "GBP", "CNY", "VND", "AUD"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input type="number" step="0.01" value={targetPriceMin} onChange={e => setTargetPriceMin(e.target.value)} placeholder="From" className="w-24" />
                    <span className="text-muted-foreground text-sm">–</span>
                    <Input type="number" step="0.01" value={targetPriceMax} onChange={e => setTargetPriceMax(e.target.value)} placeholder="To" className="w-24" />
                    <span className="text-muted-foreground text-sm">/unit</span>
                  </div>
                  <FieldHint>Your target landed cost per unit — not including freight or duties. Being transparent about your budget helps factories decide whether to quote and how. Factories won't always match it, but it anchors the conversation.</FieldHint>
                </div>

                {/* Delivery */}
                <div className="space-y-1.5">
                  <Label>Target delivery</Label>
                  <Select value={targetDeliveryWeeks} onValueChange={setTargetDeliveryWeeks}>
                    <SelectTrigger><SelectValue placeholder="When do you need goods in hand?" /></SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "8", label: "8 weeks — urgent / rush" },
                        { value: "12", label: "12 weeks" },
                        { value: "16", label: "16 weeks — standard" },
                        { value: "20", label: "20 weeks" },
                        { value: "24", label: "24 weeks — no rush" },
                        { value: "30", label: "30+ weeks — planning ahead" },
                      ].map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldHint>Count from today to when goods need to arrive at your warehouse or port. Include 2–3 weeks buffer for sampling revisions. Most Vietnam garment factories need 12–16 weeks from approved tech pack.</FieldHint>
                </div>

                {/* Tech pack */}
                <div className="space-y-1.5">
                  <Label>Tech pack or reference</Label>
                  <Input
                    type="url"
                    value={techPackUrl}
                    onChange={e => setTechPackUrl(e.target.value)}
                    placeholder="Google Drive, Dropbox, or Notion — shared with all recipients"
                  />
                  <FieldHint>
                    Sharing a tech pack or even a reference image dramatically improves quote accuracy and response rates. Even a rough sketch is better than nothing. All recipients see the same link.
                    {" "}<a href="/resources/tech-pack-guide" className="text-primary hover:underline">What should be in a tech pack →</a>
                  </FieldHint>
                </div>

                {/* Additional notes */}
                <div className="space-y-1.5">
                  <Label>Additional notes</Label>
                  <Textarea
                    value={additionalNotes}
                    onChange={e => setAdditionalNotes(e.target.value)}
                    placeholder={"Certifications required (GOTS, OEKO-TEX, BSCI)\nPackaging requirements\nLabelling — market-specific compliance\nSustainability requirements\nAny machinery or process requirements\nAnything else the factory needs to know before quoting"}
                    className="min-h-[90px] text-sm"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={() => setStep(2)} disabled={!title.trim()}>
                    Add factories <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Recipients ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Who receives this RFQ?</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Add factories from the Sourcery network or send to any factory by email — even if they're not on the platform yet. Each receives a unique response link. No account required to quote.
                  </p>
                </div>

                {/* Recipient list */}
                {recipients.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sending to {recipients.length} {recipients.length === 1 ? "factory" : "factories"}</p>
                    {recipients.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {r.type === "network" ? <Building2 className="h-4 w-4 text-primary" /> : <Globe className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{r.factory_name}</p>
                            <p className="text-xs text-muted-foreground">{r.factory_email}</p>
                          </div>
                          {r.type === "network" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Network</span>
                          )}
                        </div>
                        <button onClick={() => setRecipients(prev => prev.filter((_, j) => j !== i))}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add modes */}
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
                    <Label>Select a factory from the Sourcery network</Label>
                    {networkFactories.length === 0 ? (
                      <p className="text-sm text-muted-foreground">All network factories have been added, or none are available.</p>
                    ) : (
                      <Select value={selectedFactoryId} onValueChange={setSelectedFactoryId}>
                        <SelectTrigger><SelectValue placeholder="Select a factory..." /></SelectTrigger>
                        <SelectContent>
                          {networkFactories.map(f => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.name} — {f.city ?? ""}{f.city ? ", " : ""}{f.country}
                              {!f.email && " (no email on file)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addNetworkFactory} disabled={!selectedFactoryId}>Add</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setAddMode(null); setSelectedFactoryId(""); }}>Cancel</Button>
                    </div>
                  </div>
                )}

                {addMode === "external" && (
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-0.5">Add any factory by email</p>
                      <p className="text-xs text-muted-foreground">They receive the RFQ email and respond through a public link — no Sourcery account needed. This works for any factory you've worked with before or found independently.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Factory name</Label>
                        <Input value={externalName} onChange={e => setExternalName(e.target.value)} placeholder="e.g. HU LA Studios" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Email address</Label>
                        <Input type="email" value={externalEmail} onChange={e => setExternalEmail(e.target.value)} placeholder="contact@factory.com"
                          onKeyDown={e => e.key === "Enter" && addExternalRecipient()} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addExternalRecipient} disabled={!externalName.trim() || !externalEmail.trim()}>Add recipient</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setAddMode(null); setExternalName(""); setExternalEmail(""); }}>Cancel</Button>
                    </div>
                  </div>
                )}

                {recipients.length === 0 && !addMode && (
                  <div className="p-6 rounded-xl bg-secondary/30 border border-dashed border-border text-center">
                    <p className="text-sm text-muted-foreground mb-1">No recipients yet</p>
                    <p className="text-xs text-muted-foreground">Add factories from the network above, or enter any factory's email address directly.</p>
                  </div>
                )}

                <div className="p-3.5 rounded-lg bg-secondary/50 border border-border flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Sending to multiple factories is normal practice</strong> — factories expect to be quoting alongside others. Being transparent about this builds trust. You're not obligated to work with anyone who quotes.
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={recipients.length === 0}>
                    Review & send <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Review & Send ── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Review & send</h2>
                  <p className="text-sm text-muted-foreground">Factories receive their emails immediately after you hit send.</p>
                </div>

                {/* Brief summary */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    {(productCategory || otherCategory) && (
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {productCategory === "other" ? otherCategory : productCategory?.replace(/_/g, " ")}
                      </p>
                    )}
                  </div>
                  {productDescription && (
                    <p className="text-sm text-foreground leading-relaxed">{productDescription}</p>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-primary/10">
                    {quantityMin && (
                      <div>
                        <p className="text-xs text-muted-foreground">Quantity</p>
                        <p className="text-sm font-semibold text-foreground">{quantityMin}{quantityMax ? `–${quantityMax}` : "+"} units</p>
                      </div>
                    )}
                    {targetPriceMin && (
                      <div>
                        <p className="text-xs text-muted-foreground">Target price</p>
                        <p className="text-sm font-semibold text-foreground">{currency} {targetPriceMin}{targetPriceMax ? `–${targetPriceMax}` : "+"}/unit</p>
                      </div>
                    )}
                    {targetDeliveryWeeks && (
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <p className="text-sm font-semibold text-foreground">{targetDeliveryWeeks} weeks</p>
                      </div>
                    )}
                    {fabricComposition && (
                      <div>
                        <p className="text-xs text-muted-foreground">Fabric</p>
                        <p className="text-sm font-semibold text-foreground">{fabricComposition}</p>
                      </div>
                    )}
                  </div>
                  {techPackUrl && (
                    <a href={techPackUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      Tech pack attached <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* Recipient list */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Sending to {recipients.length} {recipients.length === 1 ? "factory" : "factories"}
                  </p>
                  <div className="space-y-2">
                    {recipients.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {r.type === "network" ? <Building2 className="h-3.5 w-3.5 text-primary" /> : <Globe className="h-3.5 w-3.5 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{r.factory_name}</p>
                          <p className="text-xs text-muted-foreground">{r.factory_email}</p>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium",
                          r.type === "network"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-secondary text-muted-foreground border-border"
                        )}>
                          {r.type === "network" ? "Network" : "External"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button onClick={handleSend} disabled={sending} className="gap-2 min-w-[160px]">
                    {sending ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Sending...</>
                    ) : (
                      <><Send className="h-4 w-4" />Send to {recipients.length} {recipients.length === 1 ? "factory" : "factories"}</>
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
