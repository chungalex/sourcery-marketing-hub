import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Package, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BrandOnboardingPromptProps {
  hasFactory: boolean;
  hasOrder: boolean;
}

const steps = [
  {
    number: "01",
    title: "Invite your factory",
    description: "Bring your existing manufacturer onto the platform. They get a free account and you can start managing orders together immediately.",
    cta: "Invite a factory",
    ctaLink: "/dashboard?action=invite",
    icon: Building2,
  },
  {
    number: "02",
    title: "Create your first order",
    description: "Build a structured PO with guided incoterms, AQL standard, QC option, and delivery window. Every decision explained before you commit.",
    cta: "Create an order",
    ctaLink: "/orders/create",
    icon: Package,
  },
  {
    number: "03",
    title: "Issue the PO",
    description: "Send the order to your factory for review. Production begins with a full paper trail from day one.",
    cta: null,
    ctaLink: null,
    icon: CheckCircle,
  },
];

export function BrandOnboardingPrompt({ hasFactory, hasOrder }: BrandOnboardingPromptProps) {
  const currentStep = !hasFactory ? 0 : !hasOrder ? 1 : 2;
  if (currentStep >= 2) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 mb-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground mb-1">Get started in three steps</h2>
        <p className="text-sm text-muted-foreground">You're set up. Here's how to place your first order.</p>
      </div>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const isComplete = i < currentStep;
          const isActive = i === currentStep;
          const isPending = i > currentStep;
          return (
            <div key={step.number} className={cn(
              "flex items-start gap-4 p-4 rounded-xl border transition-colors",
              isActive && "bg-primary/3 border-primary/30",
              isComplete && "bg-secondary/50 border-border",
              isPending && "border-border opacity-40"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5",
                isActive && "bg-primary text-primary-foreground",
                isComplete && "bg-green-500 text-white",
                isPending && "bg-secondary text-muted-foreground"
              )}>
                {isComplete ? <CheckCircle className="h-4 w-4" /> : step.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-semibold mb-0.5", isPending ? "text-muted-foreground" : "text-foreground")}>{step.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {isActive && step.cta && step.ctaLink && (
                <Link to={step.ctaLink} className="flex-shrink-0">
                  <Button size="sm" className="gap-1.5 text-xs">
                    {step.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        New to production? <Link to="/how-it-works" className="text-primary hover:underline">See how it works →</Link>
      </p>
    </motion.div>
  );
}
