import { useMemo } from "react";
import { differenceInDays, addDays, format, isPast, isToday } from "date-fns";
import { AlertTriangle, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductionCountdownProps {
  deliveryDate: string;
  orderCreatedAt: string;
  orderStatus: string;
  sampleApprovedAt?: string | null;
  bulkStartedAt?: string | null;
  leadTimeWeeks?: number;
}

interface Gate {
  id: string;
  label: string;
  description: string;
  daysBeforeDelivery: number;
  status: "complete" | "on_track" | "at_risk" | "critical" | "upcoming";
  date: Date;
  daysRemaining: number;
}

export function ProductionCountdown({
  deliveryDate,
  orderCreatedAt,
  orderStatus,
  sampleApprovedAt,
  leadTimeWeeks = 14,
}: ProductionCountdownProps) {
  const gates = useMemo((): Gate[] => {
    const delivery = new Date(deliveryDate);
    const today = new Date();

    const rawGates = [
      { id: "sample_approval", label: "Sample approved", description: "Final sample signed off before bulk starts", daysBeforeDelivery: Math.round(leadTimeWeeks * 7 * 0.65) },
      { id: "bulk_start", label: "Bulk production starts", description: "Factory begins cutting and sewing", daysBeforeDelivery: Math.round(leadTimeWeeks * 7 * 0.5) },
      { id: "inline_qc", label: "In-line QC check", description: "Quality check at 30% production complete", daysBeforeDelivery: Math.round(leadTimeWeeks * 7 * 0.3) },
      { id: "final_qc", label: "Final QC inspection", description: "Full AQL inspection before packing", daysBeforeDelivery: 21 },
      { id: "cargo_cutoff", label: "Cargo cutoff", description: "Goods must be at port for loading", daysBeforeDelivery: 10 },
      { id: "vessel_departure", label: "Vessel departs", description: "Ship leaves origin port", daysBeforeDelivery: 7 },
    ];

    const completedGates = new Set<string>();
    if (["in_production", "qc_scheduled", "qc_uploaded", "qc_pass", "qc_fail", "ready_to_ship", "shipped", "closed"].includes(orderStatus)) {
      completedGates.add("sample_approval");
      completedGates.add("bulk_start");
    }
    if (sampleApprovedAt) completedGates.add("sample_approval");
    if (["qc_scheduled", "qc_uploaded", "qc_pass", "qc_fail", "ready_to_ship", "shipped", "closed"].includes(orderStatus)) {
      completedGates.add("inline_qc");
    }
    if (["qc_pass", "ready_to_ship", "shipped", "closed"].includes(orderStatus)) {
      completedGates.add("final_qc");
    }
    if (["shipped", "closed"].includes(orderStatus)) {
      completedGates.add("cargo_cutoff");
      completedGates.add("vessel_departure");
    }

    return rawGates.map(g => {
      const date = addDays(delivery, -g.daysBeforeDelivery);
      const daysRemaining = differenceInDays(date, today);
      const isComplete = completedGates.has(g.id);
      const isPastDue = isPast(date) && !isToday(date);

      let status: Gate["status"] = "upcoming";
      if (isComplete) status = "complete";
      else if (isPastDue) status = "critical";
      else if (daysRemaining <= 5) status = "at_risk";
      else if (daysRemaining <= 14) status = "on_track";
      else status = "upcoming";

      return { ...g, date, daysRemaining, status };
    });
  }, [deliveryDate, orderStatus, sampleApprovedAt, leadTimeWeeks]);

  const criticalCount = gates.filter(g => g.status === "critical").length;
  const atRiskCount = gates.filter(g => g.status === "at_risk").length;
  const daysToDelivery = differenceInDays(new Date(deliveryDate), new Date());

  const overallStatus = criticalCount > 0 ? "critical" : atRiskCount > 0 ? "at_risk" : "on_track";

  const statusConfig = {
    critical: { bg: "border-rose-400/40 bg-rose-500/5", icon: AlertTriangle, iconColor: "text-rose-500", label: "Behind schedule", labelColor: "text-rose-700" },
    at_risk: { bg: "border-amber-400/40 bg-amber-500/5", icon: Clock, iconColor: "text-amber-500", label: "Action needed", labelColor: "text-amber-700" },
    on_track: { bg: "border-primary/20 bg-primary/5", icon: CheckCircle, iconColor: "text-primary", label: "On track", labelColor: "text-primary" },
  };

  const cfg = statusConfig[overallStatus];
  const Icon = cfg.icon;

  if (orderStatus === "closed" || orderStatus === "cancelled") return null;

  return (
    <div className={cn("rounded-xl border p-5 mb-4", cfg.bg)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", cfg.iconColor)} />
          <span className={cn("text-sm font-semibold", cfg.labelColor)}>{cfg.label}</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{format(new Date(deliveryDate), "MMM d, yyyy")}</p>
          <p className="text-xs text-muted-foreground">
            {daysToDelivery > 0 ? `${daysToDelivery} days to delivery` : daysToDelivery === 0 ? "Delivery today" : `${Math.abs(daysToDelivery)} days overdue`}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {gates.map((gate, i) => {
          const gateConfig = {
            complete: { dot: "bg-green-500", text: "text-muted-foreground line-through", sub: "text-muted-foreground/60", badge: null },
            on_track: { dot: "bg-primary", text: "text-foreground", sub: "text-muted-foreground", badge: null },
            at_risk: { dot: "bg-amber-500 animate-pulse", text: "text-foreground", sub: "text-amber-600", badge: `${gate.daysRemaining}d` },
            critical: { dot: "bg-rose-500 animate-pulse", text: "text-foreground font-medium", sub: "text-rose-600 font-medium", badge: `${Math.abs(gate.daysRemaining)}d overdue` },
            upcoming: { dot: "bg-border", text: "text-muted-foreground", sub: "text-muted-foreground/60", badge: null },
          };
          const gc = gateConfig[gate.status];

          return (
            <div key={gate.id} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", gc.dot)} />
                {i < gates.length - 1 && <div className="w-px h-4 bg-border mt-1" />}
              </div>
              <div className="flex-1 flex items-center justify-between gap-2 pb-1">
                <div>
                  <span className={cn("text-xs", gc.text)}>{gate.label}</span>
                  <span className="text-xs text-muted-foreground/50 ml-2">{format(gate.date, "MMM d")}</span>
                </div>
                {gc.badge && (
                  <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0", gate.status === "critical" ? "bg-rose-500/10 text-rose-700" : "bg-amber-500/10 text-amber-700")}>
                    {gc.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {criticalCount > 0 && (
        <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-400/20">
          <AlertCircle className="h-3.5 w-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700 leading-relaxed">
            {criticalCount} gate{criticalCount > 1 ? "s are" : " is"} overdue. Each day of delay shrinks your remaining production window. Act today.
          </p>
        </div>
      )}
    </div>
  );
}
