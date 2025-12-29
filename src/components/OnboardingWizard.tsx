import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowRight, 
  ArrowLeft,
  Building2,
  Package,
  Target,
  Check,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType: "brand" | "factory";
  onComplete: (data: OnboardingData) => void;
}

interface OnboardingData {
  companyName: string;
  website: string;
  description: string;
  categories: string[];
  goals: string[];
}

const brandCategories = [
  "Apparel - Womenswear",
  "Apparel - Menswear",
  "Apparel - Childrenswear",
  "Footwear",
  "Accessories",
  "Bags & Leather",
  "Swimwear",
  "Activewear",
  "Knitwear",
  "Denim",
];

const brandGoals = [
  "Find new manufacturing partners",
  "Reduce production costs",
  "Improve sustainability",
  "Increase production capacity",
  "Find specialty manufacturers",
  "Diversify supply chain",
];

const factoryCategories = [
  "Cut & Sew",
  "Knitwear",
  "Denim",
  "Leather Goods",
  "Footwear",
  "Printing & Dyeing",
  "Embroidery",
  "Accessories",
];

const factoryGoals = [
  "Connect with international brands",
  "Increase order volume",
  "Find long-term partners",
  "Showcase certifications",
  "Expand product offerings",
];

export function OnboardingWizard({ 
  open, 
  onOpenChange, 
  userType,
  onComplete 
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const categories = userType === "brand" ? brandCategories : factoryCategories;
  const goals = userType === "brand" ? brandGoals : factoryGoals;

  const totalSteps = 3;

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete({
        companyName,
        website,
        description,
        categories: selectedCategories,
        goals: selectedGoals,
      });
      toast.success("Profile completed successfully!");
      onOpenChange(false);
    }, 1500);
  };

  const canProceedStep1 = companyName.length > 0;
  const canProceedStep2 = selectedCategories.length > 0;
  const canComplete = selectedGoals.length > 0;

  const steps = [
    { icon: Building2, title: "Company Info" },
    { icon: Package, title: "Categories" },
    { icon: Target, title: "Goals" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step > i + 1
                      ? "bg-primary text-primary-foreground"
                      : step === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > i + 1 ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <s.icon className="h-5 w-5" />
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                      step > i + 1 ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">
              {steps[step - 1].title}
            </h2>
            <p className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  placeholder={userType === "brand" ? "Your Brand Name" : "Your Factory Name"}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  placeholder="https://yourcompany.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Brief Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder={
                    userType === "brand"
                      ? "Tell us about your brand..."
                      : "Tell us about your manufacturing capabilities..."
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Categories */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                {userType === "brand"
                  ? "What product categories are you interested in?"
                  : "What do you manufacture?"}
              </p>

              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCategories.includes(cat)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={() => toggleCategory(cat)}
                    />
                    <span className="text-sm text-foreground">{cat}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                What are your main goals? (Select all that apply)
              </p>

              <div className="space-y-3">
                {goals.map((goal) => (
                  <label
                    key={goal}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedGoals.includes(goal)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedGoals.includes(goal)}
                      onCheckedChange={() => toggleGoal(goal)}
                    />
                    <span className="text-foreground">{goal}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleComplete} disabled={!canComplete || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Complete Setup
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
