import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useFactoryMembership } from "@/hooks/useFactoryMembership";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { ArrowRight, ArrowLeft, Building2, Camera, DollarSign, Clock, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Apparel","Denim","Knitwear","Outerwear","Footwear",
  "Accessories","Bags","Home goods","Sportswear","Other"
];

type Step = "welcome" | "profile" | "capabilities" | "pricing" | "sla" | "done";
const STEPS: Step[] = ["welcome","profile","capabilities","pricing","sla","done"];

export default function FactoryOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { factoryIds } = useFactoryMembership(user?.id);
  const factoryId = factoryIds[0];

  const [step, setStep] = useState<Step>("welcome");
  const [saving, setSaving] = useState(false);

  // Profile
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");
  const [totalEmployees, setTotalEmployees] = useState("");

  // Capabilities
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [moqMin, setMoqMin] = useState("");
  const [leadTimeWeeks, setLeadTimeWeeks] = useState("");
  const [certifications, setCertifications] = useState("");

  // Pricing
  const [photoUrls, setPhotoUrls] = useState(["", "", ""]);

  const stepIndex = STEPS.indexOf(step);

  const next = () => {
    const n = STEPS[stepIndex + 1];
    if (n) setStep(n);
  };
  const back = () => {
    const p = STEPS[stepIndex - 1];
    if (p) setStep(p);
  };

  const saveProfile = async () => {
    if (!factoryId) { toast.error("No factory linked to your account."); return; }
    setSaving(true);
    try {
      const certArray = certifications.split(",").map(c => c.trim()).filter(Boolean);
      const galleryUrls = photoUrls.filter(u => u.trim());

      const { error } = await supabase
        .from("factories")
        .update({
          description: description.trim() || null,
          website: website.trim() || null,
          phone: phone.trim() || null,
          year_established: yearEstablished ? parseInt(yearEstablished) : null,
          total_employees: totalEmployees ? parseInt(totalEmployees) : null,
          categories: selectedCategories,
          moq_min: moqMin ? parseInt(moqMin) : null,
          lead_time_weeks: leadTimeWeeks ? parseInt(leadTimeWeeks) : null,
          certifications: certArray,
          gallery_urls: galleryUrls,
        })
        .eq("id", factoryId);

      if (error) throw new Error(error.message);
      next();
    } catch (e: any) {
      toast.error(e.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const complete = async () => {
    setSaving(true);
    try {
      await supabase.auth.updateUser({ data: { factory_onboarding_completed: true } });
      toast.success("Profile complete. You're ready to receive orders.");
      navigate("/dashboard/factory");
    } catch {
      navigate("/dashboard/factory");
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (c: string) =>
    setSelectedCategories(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );

  const slide = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  };

  return (
    <>
      <SEO title="Set up your factory profile — Sourcery" description="Complete your factory profile to start receiving orders." />
      <div className="min-h-screen bg-background flex flex-col">
        {step !== "welcome" && step !== "done" && (
          <div className="h-0.5 bg-border">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(stepIndex / (STEPS.length - 2)) * 100}%` }}
            />
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div key={step} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>

                {/* WELCOME */}
                {step === "welcome" && (
                  <div className="text-center space-y-6">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-2">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-3">Your account is ready.</h1>
                      <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        Set up your factory profile in a few minutes and start managing orders with your brands — all in one place, with a full record of every order.
                      </p>
                    </div>
                    <div className="text-left space-y-3 bg-secondary/50 rounded-xl p-5">
                      {[
                        "Messages can be translated — communicate in your language",
                        "Sampling, revisions, and QC all on-platform",
                        "Milestone-gated payments — each stage released only when verified",
                        "Your performance score builds your reputation over time",
                      ].map((t, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground">{t}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-left">
                      <p className="text-xs font-medium text-amber-700 mb-1">Response time matters</p>
                      <p className="text-xs text-muted-foreground">
                        Target: reply to inquiries within 24 hours, messages within 12 hours. Faster responses = higher placement in search. Brands can see your response time.
                      </p>
                    </div>
                    <Button size="lg" className="w-full" onClick={next}>
                      Set up my profile <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* PROFILE */}
                {step === "profile" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Your factory</h2>
                      <p className="text-sm text-muted-foreground">This is what brands see first. Be specific — vague profiles rank lower.</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm">About your factory <span className="text-rose-500">*</span></Label>
                      <Textarea
                        placeholder="What does your factory make? How many workers? What are you best at? A few sentences is enough."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="min-h-[120px] resize-none text-sm"
                      />
                      <p className="text-xs text-muted-foreground">Min 2–3 sentences. This is your pitch.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-sm">Year established</Label>
                        <Input type="number" placeholder="e.g. 2012" value={yearEstablished} onChange={e => setYearEstablished(e.target.value)} className="text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm">Total employees</Label>
                        <Input type="number" placeholder="e.g. 85" value={totalEmployees} onChange={e => setTotalEmployees(e.target.value)} className="text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-sm">Website (optional)</Label>
                        <Input type="url" placeholder="https://..." value={website} onChange={e => setWebsite(e.target.value)} className="text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm">WhatsApp / phone</Label>
                        <Input placeholder="+84 ..." value={phone} onChange={e => setPhone(e.target.value)} className="text-sm" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" onClick={back} className="w-20"><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
                      <Button className="flex-1" onClick={next} disabled={!description.trim()}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* CAPABILITIES */}
                {step === "capabilities" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">What you make</h2>
                      <p className="text-sm text-muted-foreground">Brands filter by category and MOQ. Be accurate — wrong categories mean wrong inquiries.</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleCategory(c)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm border transition-all",
                              selectedCategories.includes(c)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            )}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-sm">Minimum order (units)</Label>
                        <div className="relative">
                          <Input type="number" placeholder="e.g. 300" value={moqMin} onChange={e => setMoqMin(e.target.value)} className="text-sm" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm">Lead time (weeks)</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input type="number" placeholder="e.g. 8" value={leadTimeWeeks} onChange={e => setLeadTimeWeeks(e.target.value)} className="pl-8 text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm">Certifications (optional)</Label>
                      <Input
                        placeholder="e.g. GOTS, OEKO-TEX, ISO 9001 (comma separated)"
                        value={certifications}
                        onChange={e => setCertifications(e.target.value)}
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground">Certifications appear as badges on your profile and improve search ranking.</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" onClick={back} className="w-20"><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
                      <Button className="flex-1" onClick={next}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* PHOTOS */}
                {step === "pricing" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Show your work</h2>
                      <p className="text-sm text-muted-foreground">
                        Factory photos are the single biggest factor in whether a brand sends an inquiry. Paste URLs to photos of your facility, production floor, or finished goods.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm flex items-center gap-2">
                        <Camera className="h-3.5 w-3.5" />
                        Photo URLs (Google Drive, Dropbox, your website, etc.)
                      </Label>
                      {photoUrls.map((url, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            type="url"
                            placeholder={i === 0 ? "Production floor photo" : i === 1 ? "Finished goods / samples" : "Factory exterior or team"}
                            value={url}
                            onChange={e => setPhotoUrls(prev => prev.map((u, idx) => idx === i ? e.target.value : u))}
                            className="text-sm"
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPhotoUrls(prev => [...prev, ""])}
                        className="w-full text-xs"
                      >
                        + Add another photo
                      </Button>
                    </div>

                    <div className="bg-secondary/50 rounded-xl p-4 text-sm text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground text-xs uppercase tracking-wide">What works best</p>
                      <p className="text-xs">Production floor showing scale and equipment</p>
                      <p className="text-xs">Close-up of finished products or samples</p>
                      <p className="text-xs">Team at work — shows real operation, builds trust</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" onClick={back} className="w-20"><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
                      <Button className="flex-1" onClick={saveProfile} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save profile <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <button type="button" onClick={() => { saveProfile(); }} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Skip photos — add later from your dashboard
                    </button>
                  </div>
                )}

                {/* SLA + DONE */}
                {step === "sla" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">One last thing</h2>
                      <p className="text-sm text-muted-foreground">Response time is how brands choose between factories with similar capabilities.</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { target: "New inquiries", time: "Within 24 hours", note: "Brands move fast. A quick reply means they choose you." },
                        { target: "Messages on active orders", time: "Within 12 hours", note: "Quick replies build trust. Slow replies cause worry." },
                        { target: "Sample delivery", time: "On the date you commit to", note: "If something changes, tell the brand early. They can work with it." },
                      ].map(s => (
                        <div key={s.target} className="p-4 rounded-xl border border-border bg-card space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">{s.target}</span>
                            <span className="text-xs text-primary font-medium">{s.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{s.note}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={back} className="w-20"><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
                      <Button className="flex-1" onClick={complete} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Go to my dashboard
                      </Button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
