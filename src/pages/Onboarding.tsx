import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Package, Building2, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";

const PRODUCT_CATEGORIES = [
  { value: "apparel", label: "Apparel & clothing" },
  { value: "denim", label: "Denim" },
  { value: "accessories", label: "Accessories & bags" },
  { value: "footwear", label: "Footwear" },
  { value: "activewear", label: "Activewear" },
  { value: "home", label: "Home & soft goods" },
  { value: "other", label: "Other" },
];

const STAGES = [
  { value: "first_order", label: "Planning my first production order" },
  { value: "repeat", label: "I've ordered before, looking for structure" },
  { value: "scaling", label: "Scaling — managing multiple factories" },
  { value: "just_looking", label: "Just exploring" },
];

type Step = 1 | 2 | 3;

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");

  // Step 2
  const [stage, setStage] = useState("");
  const [hasFactory, setHasFactory] = useState<boolean | null>(null);

  // Step 3 — factory invite (shown if hasFactory = true)
  const [factoryName, setFactoryName] = useState("");
  const [factoryEmail, setFactoryEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) navigate("/auth");
  }, [user, isLoading]);

  const handleSaveProfile = async () => {
    if (!brandName.trim()) { toast.error("Add your brand name"); return; }
    setSaving(true);
    try {
      await supabase.auth.updateUser({
        data: { brand_name: brandName.trim(), product_category: category, stage }
      });
      // Save to brand_profiles if table exists
      try {
        await (supabase as any).from("brand_profiles").upsert({
          user_id: user!.id,
          brand_name: brandName.trim(),
          product_category: category || null,
          stage: stage || null,
        });
      } catch (e) {
        // brand_profiles table may not exist yet — auth metadata is the fallback
        console.log("brand_profiles not available, using auth metadata only");
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleInviteFactory = async () => {
    if (!factoryName.trim() || !factoryEmail.trim()) { toast.error("Factory name and email required"); return; }
    setInviting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.functions.invoke("factory-invite", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { factory_name: factoryName.trim(), factory_email: factoryEmail.trim(), action: "send_invite" },
      });
      setInvited(true);
      toast.success(`Invite sent to ${factoryEmail}`);
    } catch {
      toast.error("Failed to send invite");
    }
    setInviting(false);
  };

  const handleFinish = async () => {
    await handleSaveProfile();
    navigate("/dashboard");
  };

  const handleNext = async (nextStep: Step) => {
    if (step === 1) await handleSaveProfile();
    setStep(nextStep);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <>
      <SEO title="Set up your account — Sourcery" description="" noIndex />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-base">S</span>
            </div>
            <span className="font-semibold text-foreground text-lg">Sourcery</span>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 mb-8">
            {[1, 2, 3].map(n => (
              <div key={n} className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                step >= n ? "bg-primary" : "bg-secondary"
              )} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1 — What are you making? */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">What are you making?</h1>
                  <p className="text-muted-foreground text-sm">Helps us show the right factories and defaults.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Brand name</label>
                  <Input
                    value={brandName}
                    onChange={e => setBrandName(e.target.value)}
                    placeholder="e.g. OKIO Denim"
                    autoFocus
                    onKeyDown={e => e.key === "Enter" && brandName.trim() && handleNext(2)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Product category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRODUCT_CATEGORIES.map(cat => (
                      <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                        className={cn(
                          "text-left px-3 py-2.5 rounded-xl border text-sm transition-all",
                          category === cat.value
                            ? "border-primary bg-primary/5 text-foreground font-medium"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        )}>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={() => handleNext(2)} disabled={!brandName.trim() || saving} className="w-full gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 2 — Where are you in your production journey? */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">Where are you in your journey?</h1>
                  <p className="text-muted-foreground text-sm">Helps us show the most relevant guidance.</p>
                </div>

                <div className="space-y-2">
                  {STAGES.map(s => (
                    <button key={s.value} type="button" onClick={() => setStage(s.value)}
                      className={cn(
                        "w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all",
                        stage === s.value
                          ? "border-primary bg-primary/5 text-foreground font-medium"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      )}>
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 pt-2 border-t border-border">
                  <p className="text-sm font-medium text-foreground">Do you already have a factory?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setHasFactory(true)}
                      className={cn("px-4 py-3 rounded-xl border text-sm transition-all",
                        hasFactory === true ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      )}>
                      Yes — I'll invite them
                    </button>
                    <button type="button" onClick={() => setHasFactory(false)}
                      className={cn("px-4 py-3 rounded-xl border text-sm transition-all",
                        hasFactory === false ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      )}>
                      Not yet
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => handleNext(3)} disabled={!stage || hasFactory === null} className="flex-1 gap-2">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Invite factory or go to dashboard */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6">
                {hasFactory ? (
                  <>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-1">Invite your factory</h1>
                      <p className="text-muted-foreground text-sm">They join free. You're connected in 30 seconds.</p>
                    </div>

                    {invited ? (
                      <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/20 text-center space-y-3">
                        <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
                        <p className="font-semibold text-foreground">Invite sent to {factoryEmail}</p>
                        <p className="text-xs text-muted-foreground">They'll get an email with a link to join. Once they're set up, your orders will be connected.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Factory name</label>
                          <Input value={factoryName} onChange={e => setFactoryName(e.target.value)} placeholder="e.g. HU LA Studios" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Email address</label>
                          <Input type="email" value={factoryEmail} onChange={e => setFactoryEmail(e.target.value)} placeholder="contact@factory.com" />
                        </div>
                        <Button onClick={handleInviteFactory} disabled={inviting || !factoryName.trim() || !factoryEmail.trim()} className="w-full gap-2">
                          {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4" />}
                          Send invite
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">You're set up.</h1>
                    <p className="text-muted-foreground text-sm mb-6">Create your first order — it's free, no time limit. Or browse our factory network to find one.</p>
                    <div className="p-5 rounded-xl bg-card border border-border space-y-3 mb-6">
                      {[
                        { icon: Package, text: "Browse verified factories in Vietnam and Southeast Asia" },
                        { icon: Building2, text: "Send an RFQ to multiple factories and compare quotes" },
                        { icon: CheckCircle, text: "Your first order is completely free" },
                      ].map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm text-foreground">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button onClick={handleFinish} className="w-full gap-2">
                    Go to dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                  {hasFactory && !invited && (
                    <Button variant="ghost" onClick={handleFinish} className="w-full text-sm">
                      Skip — invite from dashboard later
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
