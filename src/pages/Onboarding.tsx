import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowRight, ArrowLeft, Building2, Package,
  Users, CheckCircle, Loader2, UserPlus
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Apparel","Denim","Knitwear","Outerwear","Footwear",
  "Accessories","Bags","Home goods","Electronics","Other"
];

const VOLUMES = [
  { value: "under_300", label: "Under 300 units/style" },
  { value: "300_1000", label: "300–1,000 units/style" },
  { value: "1000_5000", label: "1,000–5,000 units/style" },
  { value: "over_5000", label: "5,000+ units/style" },
];

type Step = "welcome" | "brand_profile" | "factories" | "invite" | "first_order" | "done";

const STEPS: Step[] = ["welcome","brand_profile","factories","invite","first_order","done"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("welcome");
  const [saving, setSaving] = useState(false);
  const [hasByof, setHasByof] = useState<boolean | null>(null);

  // Brand profile
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [volume, setVolume] = useState("");
  const [markets, setMarkets] = useState("");

  // BYOF invite
  const [factoryName, setFactoryName] = useState("");
  const [factoryEmail, setFactoryEmail] = useState("");
  const [factoryCountry, setFactoryCountry] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const next = () => {
    const nextStep = STEPS[stepIndex + 1];
    if (nextStep) setStep(nextStep);
  };

  const back = () => {
    const prevStep = STEPS[stepIndex - 1];
    if (prevStep) setStep(prevStep);
  };

  const saveBrandProfile = async () => {
    if (!brandName.trim()) { toast.error("Enter your brand name."); return; }
    setSaving(true);
    try {
      await supabase.auth.updateUser({
        data: {
          brand_name: brandName.trim(),
          category,
          volume,
          markets: markets.trim(),
          onboarding_step: "brand_profile_done",
        }
      });
      next();
    } catch (e: any) {
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
        body: {
          action: "send",
          factory_name: factoryName.trim(),
          factory_email: factoryEmail.trim(),
          country: factoryCountry.trim() || undefined,
        },
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
      await supabase.auth.updateUser({
        data: { onboarding_completed: true }
      });
      navigate("/dashboard");
    } catch {
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  };

  return (
    <>
      <SEO title="Welcome to Sourcery" description="Set up your account" />
      <div className="min-h-screen bg-background flex flex-col">
        {/* Progress bar */}
        {step !== "welcome" && step !== "done" && (
          <div className="h-0.5 bg-border">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((stepIndex) / (STEPS.length - 2)) * 100}%` }}
            />
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >

                {/* WELCOME */}
                {step === "welcome" && (
                  <div className="text-center space-y-6">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-2">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-semibold text-foreground mb-3">Welcome to Sourcery</h1>
                      <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        Built in Ho Chi Minh City by a brand and a factory. Everything you need to manage production — without the WhatsApp chaos.
                      </p>
                    </div>
                    <div className="text-left space-y-3 bg-secondary/50 rounded-xl p-5">
                      {[
                        "Bring your existing factory relationships onto Sourcery",
                        "Manage sampling, revisions, QC, and payments in one place",
                        "Every order has a paper trail — no more disputes over WhatsApp",
                      ].map((t, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground">{t}</p>
                        </div>
                      ))}
                    </div>
                    <Button size="lg" className="w-full" onClick={next}>
                      Get started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* BRAND PROFILE */}
                {step === "brand_profile" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Tell us about your brand</h2>
                      <p className="text-sm text-muted-foreground">Takes 60 seconds. Helps us match you with the right factories.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label>Brand name <span className="text-rose-500">*</span></Label>
                        <Input
                          placeholder="e.g. OKIO Denim"
                          value={brandName}
                          onChange={e => setBrandName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label>Product category</Label>
                        <div className="flex flex-wrap gap-2">
                          {CATEGORIES.map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setCategory(c)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-sm border transition-all",
                                category === c
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                              )}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Production volume per style</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {VOLUMES.map(v => (
                            <button
                              key={v.value}
                              type="button"
                              onClick={() => setVolume(v.value)}
                              className={cn(
                                "p-3 rounded-lg text-sm border text-left transition-all",
                                volume === v.value
                                  ? "bg-primary/10 border-primary text-foreground"
                                  : "border-border text-muted-foreground hover:border-primary/30"
                              )}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Primary markets (optional)</Label>
                        <Input
                          placeholder="e.g. US, UK, Australia"
                          value={markets}
                          onChange={e => setMarkets(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={back} className="w-24">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button className="flex-1" onClick={saveBrandProfile} disabled={saving || !brandName.trim()}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* DO YOU HAVE FACTORIES? */}
                {step === "factories" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Do you already work with factories?</h2>
                      <p className="text-sm text-muted-foreground">
                        Bring your existing relationships onto Sourcery — they get a free account and full platform access.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => { setHasByof(true); next(); }}
                        className="p-5 rounded-xl border border-border hover:border-primary/50 text-left transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Yes — I have factory relationships</p>
                            <p className="text-sm text-muted-foreground mt-0.5">Invite them to Sourcery and start managing orders immediately.</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setHasByof(false); setStep("first_order"); }}
                        className="p-5 rounded-xl border border-border hover:border-primary/50 text-left transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">No — I'm looking for factories</p>
                            <p className="text-sm text-muted-foreground mt-0.5">Browse the Sourcery network to find verified manufacturers.</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    <Button variant="ghost" onClick={back} size="sm" className="text-muted-foreground">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                  </div>
                )}

                {/* INVITE FACTORY */}
                {step === "invite" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Invite your factory</h2>
                      <p className="text-sm text-muted-foreground">
                        They'll get an email with a link to create a free account and connect with you.
                      </p>
                    </div>

                    {!inviteSent ? (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Factory name <span className="text-rose-500">*</span></Label>
                          <Input
                            placeholder="e.g. HU LA Studios"
                            value={factoryName}
                            onChange={e => setFactoryName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Contact email <span className="text-rose-500">*</span></Label>
                          <Input
                            type="email"
                            placeholder="factory@example.com"
                            value={factoryEmail}
                            onChange={e => setFactoryEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Country (optional)</Label>
                          <Input
                            placeholder="e.g. Vietnam"
                            value={factoryCountry}
                            onChange={e => setFactoryCountry(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" onClick={back} className="w-24">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={sendInvite}
                            disabled={sendingInvite || !factoryName.trim() || !factoryEmail.trim()}
                          >
                            {sendingInvite ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                            Send Invite
                          </Button>
                        </div>

                        <button
                          type="button"
                          onClick={next}
                          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Skip for now — invite later from dashboard
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Invite sent to {factoryEmail}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              They'll get a link to join Sourcery and connect with your account. You can invite more factories from your dashboard.
                            </p>
                          </div>
                        </div>
                        <Button className="w-full" onClick={next}>
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* FIRST ORDER */}
                {step === "first_order" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">You're set up</h2>
                      <p className="text-sm text-muted-foreground">
                        What do you want to do first?
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => navigate("/orders/create")}
                        className="w-full p-5 rounded-xl border border-border hover:border-primary/50 text-left transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Create your first order</p>
                            <p className="text-sm text-muted-foreground mt-0.5">Start a production order with your factory or browse the network.</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/directory")}
                        className="w-full p-5 rounded-xl border border-border hover:border-primary/50 text-left transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Browse the factory network</p>
                            <p className="text-sm text-muted-foreground mt-0.5">Find verified manufacturers in Vietnam, Cambodia, Portugal and beyond.</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={completeOnboarding}
                        className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                      >
                        Go to dashboard
                      </button>
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
