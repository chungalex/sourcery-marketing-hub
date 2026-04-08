import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Building2, Package, Users, CheckCircle, Loader2, UserPlus, Sparkles } from "lucide-react";
import { ExperienceQuiz, type BrandProfile } from "@/components/onboarding/ExperienceQuiz";
import { SEO } from "@/components/SEO";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Apparel", "Denim", "Knitwear", "Outerwear",
  "Footwear", "Accessories", "Bags", "Home goods", "Other"
];

const VOLUMES = [
  { value: "under_300", label: "Under 300 units", sub: "per style" },
  { value: "300_1000", label: "300–1,000 units", sub: "per style" },
  { value: "1000_5000", label: "1,000–5,000 units", sub: "per style" },
  { value: "over_5000", label: "5,000+ units", sub: "per style" },
];

type Step = "welcome" | "brand_profile" | "experience" | "factories" | "invite" | "done";
const STEPS: Step[] = ["welcome", "brand_profile", "experience", "factories", "invite", "done"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("welcome");
  const [saving, setSaving] = useState(false);
  const [hasByof, setHasByof] = useState<boolean | null>(null);

  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [volume, setVolume] = useState("");

  const [factoryName, setFactoryName] = useState("");
  const [factoryEmail, setFactoryEmail] = useState("");
  const [factoryCountry, setFactoryCountry] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const next = () => {
    const n = STEPS[stepIndex + 1];
    if (n) setStep(n);
  };
  const back = () => {
    const p = STEPS[stepIndex - 1];
    if (p) setStep(p);
  };

  const saveBrandProfile = async () => {
    if (!brandName.trim()) { toast.error("Enter your brand name."); return; }
    setSaving(true);
    try {
      await supabase.auth.updateUser({
        data: { brand_name: brandName.trim(), category, volume, onboarding_step: "brand_profile_done" }
      });
      next();
    } catch {
      toast.error("Failed to save — try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveExperience = async (profile: BrandProfile) => {
    setSaving(true);
    try {
      await supabase.auth.updateUser({
        data: { 
          experience: profile.experience,
          moq_range: profile.moq_range,
          has_tech_pack: profile.has_tech_pack,
          factory_situation: profile.factory_situation,
          primary_category: profile.primary_category,
          onboarding_step: "experience_done"
        }
      });
      next();
    } catch {
      toast.error("Failed to save — try again.");
    } finally {
      setSaving(false);
    }
  };

  const sendInvite = async () => {
    if (!factoryEmail.trim() || !factoryName.trim()) {
      toast.error("Factory name and email are required.");
      return;
    }
    setSendingInvite(true);
    try {
      const { error } = await supabase.functions.invoke("factory-invite", {
        body: { action: "send", factory_name: factoryName.trim(), factory_email: factoryEmail.trim(), country: factoryCountry.trim() || undefined },
      });
      if (error) throw new Error(error.message);
      setInviteSent(true);
      toast.success(`Invite sent to ${factoryEmail}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to send invite.");
    } finally {
      setSendingInvite(false);
    }
  };

  const completeOnboarding = async () => {
    setSaving(true);
    try {
      await supabase.auth.updateUser({ data: { onboarding_completed: true } });
    } catch {}
    navigate("/dashboard");
    setSaving(false);
  };

  const slide = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const progress = step === "welcome" || step === "done" ? 0 : (stepIndex / (STEPS.length - 2)) * 100;

  return (
    <>
      <SEO title="Welcome to Sourcery" description="Set up your Sourcery account — invite your factory, create your first order, and manage production properly from day one." />
      <div className="min-h-screen bg-background flex flex-col">

        {/* Progress */}
        {step !== "welcome" && step !== "done" && (
          <div className="h-0.5 bg-border">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div key={step} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>

                {/* WELCOME */}
                {step === "welcome" && (
                  <div className="text-center space-y-7">
                    <div className="space-y-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">You're in.</h1>
                        <p className="text-muted-foreground leading-relaxed">
                          A few quick questions to set up your account. Takes 60 seconds. milestone payments, QC gates, and a permanent record on every run. Let's get you set up in two minutes.
                        </p>
                      </div>
                    </div>

                    <div className="text-left space-y-2.5 bg-secondary/50 rounded-xl p-5">
                      {[
                        { title: "Bring your factory or find one", sub: "Invite your existing manufacturer or browse the network" },
                        { title: "Every order has a paper trail", sub: "Specs, revisions, payments, and QC — all in one place" },
                        { title: "Your first order is free", sub: "No credit card needed. Full platform from day one." },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button size="lg" className="w-full gap-2" onClick={next}>
                      Let's go <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* BRAND PROFILE */}
                {step === "brand_profile" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">What are you making?</h2>
                      <p className="text-sm text-muted-foreground">This helps us show the right factories and tailor guidance to your situation.</p>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <Label>Brand name <span className="text-rose-500">*</span></Label>
                        <Input
                          placeholder="e.g. OKIO Denim"
                          value={brandName}
                          onChange={e => setBrandName(e.target.value)}
                          autoFocus
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>What do you make?</Label>
                        <div className="flex flex-wrap gap-2">
                          {CATEGORIES.map(c => (
                            <button
                              key={c} type="button"
                              onClick={() => setCategory(cat => cat === c ? "" : c)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-sm border transition-all",
                                category === c
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                              )}
                            >{c}</button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Typical production volume</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {VOLUMES.map(v => (
                            <button
                              key={v.value} type="button"
                              onClick={() => setVolume(vol => vol === v.value ? "" : v.value)}
                              className={cn(
                                "p-3 rounded-lg text-sm border text-left transition-all",
                                volume === v.value
                                  ? "bg-primary/10 border-primary text-foreground"
                                  : "border-border text-muted-foreground hover:border-primary/30"
                              )}
                            >
                              <span className="font-medium text-foreground">{v.label}</span>
                              <span className="text-xs text-muted-foreground block">{v.sub}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={back} className="w-20 gap-1">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button className="flex-1 gap-2" onClick={saveBrandProfile} disabled={saving || !brandName.trim()}>
                        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* FACTORIES */}
                                {step === "experience" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-1">Where are you in your production journey?</h2>
                      <p className="text-muted-foreground text-sm">Helps us show the most relevant guidance and defaults.</p>
                    </div>
                    <ExperienceQuiz
                      onComplete={(profile) => saveExperience(profile)}
                      onSkip={() => next()}
                    />
                  </div>
                )}

                {step === "factories" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">Do you already have a factory?</h2>
                      <p className="text-sm text-muted-foreground">
                        If you have an existing manufacturer, invite them to Sourcery — it's free for them and you can start managing orders immediately.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => { setHasByof(true); next(); }}
                        className="w-full p-5 rounded-xl border border-border hover:border-primary/40 text-left transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Yes — invite my factory</p>
                            <p className="text-xs text-muted-foreground mt-0.5">They join free. You're connected in 30 seconds.</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setHasByof(false); setStep("done"); }}
                        className="w-full p-5 rounded-xl border border-border hover:border-primary/40 text-left transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                            <Users className="h-4.5 w-4.5 text-muted-foreground" style={{ width: 18, height: 18 }} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Not yet — I'll add one from the dashboard</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Go to your dashboard and invite a factory when you're ready.</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    <Button variant="ghost" onClick={back} size="sm" className="text-muted-foreground gap-1">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                  </div>
                )}

                {/* INVITE FACTORY */}
                {step === "invite" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">Invite your factory</h2>
                      <p className="text-sm text-muted-foreground">
                        They'll get an email with a link to join Sourcery — free for them, no commitment. Once they're in, you can create orders together.
                      </p>
                    </div>

                    {!inviteSent ? (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Factory name <span className="text-rose-500">*</span></Label>
                          <Input placeholder="e.g. HU LA Studios" value={factoryName} onChange={e => setFactoryName(e.target.value)} autoFocus />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Contact email <span className="text-rose-500">*</span></Label>
                          <Input type="email" placeholder="factory@example.com" value={factoryEmail} onChange={e => setFactoryEmail(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Country <span className="text-xs text-muted-foreground">(optional)</span></Label>
                          <Input placeholder="e.g. Vietnam" value={factoryCountry} onChange={e => setFactoryCountry(e.target.value)} />
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" onClick={back} className="w-20">
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            className="flex-1 gap-2"
                            onClick={sendInvite}
                            disabled={sendingInvite || !factoryName.trim() || !factoryEmail.trim()}
                          >
                            {sendingInvite ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                            Send invite
                          </Button>
                        </div>

                        <button type="button" onClick={next} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                          Skip — invite from dashboard later
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">Invite sent to {factoryEmail}</p>
                            <p className="text-xs text-muted-foreground mt-1">Once they join, you'll be connected and can start creating orders together.</p>
                          </div>
                        </div>
                        <Button className="w-full gap-2" onClick={next}>
                          Go to dashboard <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* DONE */}
                {step === "done" && (
                  <div className="text-center space-y-7">
                    <div className="space-y-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">You're all set.</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          You're set up. Create your first order — it's free, no time limit.</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Button
                        size="lg"
                        className="w-full gap-2"
                        onClick={() => navigate("/orders/create")}
                      >
                        <Package className="h-4 w-4" />
                        Create your first order
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={completeOnboarding}
                        disabled={saving}
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Go to dashboard
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      No credit card needed. Full platform from day one.
                    </p>
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
