import { useEffect, useState } from "react";
import { checkProactiveRules, type OrderContext } from "@/lib/proactiveRules";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, X, ArrowRight, Loader2, AlertTriangle, Info, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useProactiveAlerts } from "@/hooks/useProactiveAlerts";

interface ProactiveGuidanceProps {
  orderId: string;
  orderStatus: string;
  deliveryWindowEnd?: string | null;
  factoryName?: string;
  qcStandard?: string;
  orderQuantity?: number;
  orderUpdatedAt?: string;
  orderCreatedAt?: string;
  orderSpecifications?: any;
}

export function ProactiveGuidance({
  orderId,
  orderStatus,
  deliveryWindowEnd,
  factoryName,
  qcStandard,
  orderQuantity,
  orderUpdatedAt,
  orderCreatedAt,
  orderSpecifications,
}: ProactiveGuidanceProps) {
  // Use rule engine first
  const { alert, dismiss } = useProactiveAlerts(
    orderId ? {
      id: orderId,
      status: orderStatus,
      delivery_window_end: deliveryWindowEnd,
      created_at: orderCreatedAt || new Date().toISOString(),
      updated_at: orderUpdatedAt || new Date().toISOString(),
      quantity: orderQuantity,
      specifications: orderSpecifications,
      factories: factoryName ? { name: factoryName } : null,
    } : null
  );

  if (!alert) return null;

  const colors = {
    warning: "bg-amber-500/8 border-amber-400/30",
    action: "bg-secondary/60 border-border",
    info: "bg-card border-border",
  };

  const icons = {
    warning: AlertTriangle,
    action: Zap,
    info: Info,
  };

  const dotColors = {
    warning: "bg-amber-500",
    action: "bg-primary",
    info: "bg-muted-foreground/40",
  };

  const Icon = icons[alert.type];
  const urgencyPulse = alert.urgency === "high" ? "animate-pulse" : "";

  return (
    <div className={cn(
      "rounded-xl border px-4 py-3 mb-3 flex items-start gap-3",
      colors[alert.type]
    )}>
      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", dotColors[alert.type], urgencyPulse)} />
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground mb-0.5">{alert.headline}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{alert.body}</p>
        {alert.action && (
          <button
            type="button"
            className="text-xs text-primary font-medium hover:underline mt-1 inline-flex items-center gap-1"
            onClick={() => {
              // Scroll to message drafter
              const drafter = document.querySelector('[data-message-drafter]');
              if (drafter) drafter.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {alert.action.label} <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="flex-shrink-0 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
