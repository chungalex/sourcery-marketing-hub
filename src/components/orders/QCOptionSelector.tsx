import { motion, AnimatePresence } from "framer-motion";
import { Shield, UserCheck, Building2, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

export type QCOption = "sourcery" | "byoqc" | "factory";

interface QCOptionConfig {
  id: QCOption;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  recommended?: boolean;
  description: string;
  howItWorks: string;
  protectionLevel: "high" | "medium" | "low";
}

const qcOptions: QCOptionConfig[] = [
  {
    id: "byoqc",
    title: "Third-party inspector",
    subtitle: "You book SGS, QIMA, Bureau Veritas, or your own inspector",
    icon: UserCheck,
    recommended: true,
    description: "You arrange and book an independent inspector directly. They inspect the goods at the factory, upload their report to the order, and the final payment milestone releases only after you review and approve it.",
    howItWorks: "Book your inspector → they attend the factory → upload report here → you approve → final milestone unlocks.",
    protectionLevel: "high",
  },
  {
    id: "factory",
    title: "Factory self-report",
    subtitle: "Factory uploads structured evidence for your review",
    icon: Building2,
    description: "The factory uploads photos, defect count, and AQL result in a structured format. You review the evidence before approving the final milestone. No external cost — but you're relying on the factory's own reporting.",
    howItWorks: "Factory uploads photos and defect summary → you review → approve or dispute → final milestone unlocks.",
    protectionLevel: "medium",
  },
  {
    id: "sourcery",
    title: "Brand inspection on arrival",
    subtitle: "Sourcery walks you through checking the goods yourself",
    icon: Shield,
    description: "When your order arrives, Sourcery provides a structured inspection checklist based on your spec and AQL standard. You work through it yourself and log the result. Best for brands receiving goods directly.",
    howItWorks: "Goods arrive → Sourcery sends you a checklist → you inspect against your spec → log result → close or dispute.",
    protectionLevel: "medium",
  },
];

const protectionColors = {
  high: "text-green-700 bg-green-500/10 border-green-500/20",
  medium: "text-amber-700 bg-amber-500/10 border-amber-400/30",
  low: "text-rose-700 bg-rose-500/10 border-rose-400/30",
};

const protectionLabels = {
  high: "Strongest protection",
  medium: "Standard protection",
  low: "Limited protection",
};

interface QCOptionSelectorProps {
  value?: QCOption;
  onChange: (option: QCOption) => void;
  disabled?: boolean;
  className?: string;
}

export function QCOptionSelector({ value, onChange, disabled = false, className }: QCOptionSelectorProps) {
  return (
    <TooltipProvider>
      <div className={cn("space-y-3", className)}>
        <div className="p-3 rounded-lg bg-secondary/50 border border-border flex items-start gap-2 mb-4">
          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Sourcery does not provide QC services.</span>{" "}
            We provide the framework — the gate, the record, and the tools. You choose how the inspection happens.
            Need a recommendation? <a href="/resources/what-is-aql" className="text-primary hover:underline">Read our QC guide →</a>
          </p>
        </div>

        <div className="space-y-3">
          {qcOptions.map((option) => {
            const isSelected = value === option.id;
            const Icon = option.icon;
            return (
              <motion.button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => onChange(option.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all",
                  isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                whileTap={{ scale: disabled ? 1 : 0.99 }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-foreground text-sm">{option.title}</span>
                      {option.recommended && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Recommended</span>
                      )}
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", protectionColors[option.protectionLevel])}>
                        {protectionLabels[option.protectionLevel]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{option.subtitle}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{option.description}</p>
                    <p className="text-xs text-primary font-medium">{option.howItWorks}</p>
                  </div>
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}

interface QCOptionBadgeProps {
  option: QCOption;
  className?: string;
}

export function QCOptionBadge({ option, className }: QCOptionBadgeProps) {
  const config = qcOptions.find(o => o.id === option);
  if (!config) return null;
  const Icon = config.icon;
  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border", protectionColors[config.protectionLevel], className)}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{config.title}</span>
    </div>
  );
}

export function getQCOptionConfig(option: QCOption): QCOptionConfig | undefined {
  return qcOptions.find(o => o.id === option);
}
