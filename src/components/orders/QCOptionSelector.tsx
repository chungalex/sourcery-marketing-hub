import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  UserCheck, 
  Building2, 
  Check, 
  AlertTriangle,
  Star,
  Info,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type QCOption = "sourcery" | "byoqc" | "factory";

interface QCOptionConfig {
  id: QCOption;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  recommended?: boolean;
  features: string[];
  tradeoffs: string[];
  bestFor: string;
  protectionLevel: "high" | "medium" | "low";
  costInfo: string;
}

const qcOptions: QCOptionConfig[] = [
  {
    id: "sourcery",
    title: "Sourcery QC",
    subtitle: "Independent third-party inspection",
    icon: Shield,
    recommended: true,
    features: [
      "Independent third-party inspector",
      "Standardized reporting format",
      "Strongest dispute resolution",
      "Sourcery coordinates scheduling",
    ],
    tradeoffs: [
      "Buyer pays (separate line item)",
      "Requires scheduling lead time",
    ],
    bestFor: "Recommended for new factories and first orders.",
    protectionLevel: "high",
    costInfo: "Buyer-paid, quoted separately",
  },
  {
    id: "byoqc",
    title: "Bring Your Own QC",
    subtitle: "Use your existing inspector",
    icon: UserCheck,
    features: [
      "Use your preferred inspector",
      "Inspector uploads to same system",
      "Same milestone gating rules apply",
      "Full control over relationship",
    ],
    tradeoffs: [
      "Buyer manages inspector directly",
      "Must meet report standards",
    ],
    bestFor: "For experienced buyers with existing inspectors.",
    protectionLevel: "medium",
    costInfo: "You pay your inspector directly",
  },
  {
    id: "factory",
    title: "Factory Self-QC",
    subtitle: "Factory provides evidence",
    icon: Building2,
    features: [
      "Factory uploads photos & process docs",
      "Buyer reviews and explicitly approves",
      "Fastest turnaround time",
      "No additional third-party cost",
    ],
    tradeoffs: [
      "Limited dispute support",
      "Lower protection level",
      "Relies on factory honesty",
    ],
    bestFor: "For trusted, established relationships only.",
    protectionLevel: "low",
    costInfo: "No additional cost",
  },
];

const protectionColors = {
  high: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low: "bg-red-500/10 text-red-600 border-red-500/20",
};

const protectionLabels = {
  high: "Strong Protection",
  medium: "Standard Protection",
  low: "Limited Protection",
};

interface QCOptionSelectorProps {
  value?: QCOption;
  onChange: (option: QCOption) => void;
  disabled?: boolean;
  className?: string;
}

export function QCOptionSelector({ 
  value, 
  onChange, 
  disabled = false,
  className 
}: QCOptionSelectorProps) {
  const [hoveredOption, setHoveredOption] = useState<QCOption | null>(null);

  return (
    <TooltipProvider>
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-foreground">
            Quality Control Option
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-sm">
                QC is optional and always buyer-paid. Sourcery recommends QC but does not 
                guarantee outcomes. Your choice affects dispute resolution support.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <p className="text-sm text-muted-foreground -mt-2 mb-4">
          Choose how you want quality inspections handled. This affects your protection level during disputes.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {qcOptions.map((option) => {
            const isSelected = value === option.id;
            const isHovered = hoveredOption === option.id;
            const Icon = option.icon;

            return (
              <motion.button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => onChange(option.id)}
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
                className={cn(
                  "relative flex flex-col p-4 rounded-xl border-2 text-left transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card hover:border-primary/50 hover:bg-accent/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                whileHover={{ scale: disabled ? 1 : 1.02 }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
              >
                {/* Recommended Badge */}
                {option.recommended && (
                  <div className="absolute -top-2.5 left-4">
                    <Badge className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-lg shrink-0",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{option.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{option.subtitle}</p>
                  </div>
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Protection Level Badge */}
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border mb-2 w-fit",
                  protectionColors[option.protectionLevel]
                )}>
                  <Shield className="h-3 w-3" />
                  {protectionLabels[option.protectionLevel]}
                </div>

                {/* Cost Info */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <DollarSign className="h-3 w-3" />
                  {option.costInfo}
                </div>

                {/* Features */}
                <ul className="space-y-1.5 mb-3 flex-1">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Tradeoffs - shown on hover or selection */}
                <AnimatePresence>
                  {(isSelected || isHovered) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Trade-offs
                        </p>
                        <ul className="space-y-1">
                          {option.tradeoffs.map((tradeoff, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-muted-foreground/50">•</span>
                              {tradeoff}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Best For */}
                <div className="pt-3 mt-auto border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    {option.bestFor}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Legal Disclaimer */}
        <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 border border-border">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-medium text-foreground">
              Important: Sourcery recommends QC but does not guarantee QC outcomes.
            </p>
            <p className="text-xs text-muted-foreground">
              QC is optional and always buyer-paid. Your choice affects the level of platform 
              support available during disputes. Stronger QC options provide stronger evidence 
              for dispute resolution.
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Compact version for order summaries
interface QCOptionBadgeProps {
  option: QCOption;
  className?: string;
}

export function QCOptionBadge({ option, className }: QCOptionBadgeProps) {
  const config = qcOptions.find(o => o.id === option);
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border",
      protectionColors[config.protectionLevel],
      className
    )}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{config.title}</span>
    </div>
  );
}

// Get QC option config for external use
export function getQCOptionConfig(option: QCOption): QCOptionConfig | undefined {
  return qcOptions.find(o => o.id === option);
}
