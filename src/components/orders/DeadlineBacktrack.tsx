import { useMemo } from "react";
import { differenceInWeeks, addWeeks, format, isPast, isWithinInterval, addDays } from "date-fns";
import { AlertTriangle, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeadlineGate {
  label: string;
  daysBeforeDelivery: number;
  status: "completed" | "current" | "upcoming" | "overdue";
  date: Date;
  description: string;
}

interface DeadlineBacktrackProps {
  deliveryDate: string;
  orderStatus: string;
  createdAt: string;
  leadTimeWeeks?: number;
}

const STATUS_GATES: { label: string; weeksBeforeDelivery: number; description: string; requiredOrderStatus?: string[] }[] = [
  { label: "Issue PO", weeksBeforeDelivery: 18, description: "PO must be issued and accepted for production to begin on time", requiredOrderStatus: ["draft"] },
  { label: "Tech pack approved", weeksBeforeDelivery: 16, description: "Factory needs final approved tech pack before cutting" },
  { label: "Sample approved", weeksBeforeDelivery: 12, description: "Sample approval triggers bulk production" },
  { label: "Bulk production start", weeksBeforeDelivery: 8, description: "Cutting and sewing begin — no more spec changes" },
  { label: "QC inspection", weeksBeforeDelivery: 3, description: "Quality control before goods are packed and shipped" },
  { label: "Ready to ship", weeksBeforeDelivery: 1, description: "Goods packed and ready for freight pickup" },
  { label: "Delivery", weeksBeforeDelivery: 0, description: "Goods arrive at destination" },
];

const ORDER_STATUS_PROGRESS: Record<string, number> = {
  draft: 0, po_issued: 1, po_accepted: 1, sample_sent: 2, sample_revision: 2,
  sample_approved: 3, in_production: 4, qc_scheduled: 5, qc_uploaded: 5,
  qc_pass: 5, ready_to_ship: 6, shipped: 6, closed: 7,
};

export function DeadlineBacktrack({ deliveryDate, orderStatus, createdAt, leadTimeWeeks = 16 }: DeadlineBacktrackProps) {
  const delivery = new Date(deliveryDate);
  const now = new Date();
  const weeksUntilDelivery = differenceInWeeks(delivery, now);
  const currentProgress = ORDER_STATUS_PROGRESS[orderStatus] ?? 0;

  const gates = useMemo(() => {
    return STATUS_GATES.map((gate, i) => {
      const gateDate = addDays(delivery, -gate.weeksBeforeDelivery * 7);
      let status: DeadlineGate["status"];
      if (i < currentProgress) status = "completed";
      else if (i === currentProgress) status = isPast(gateDate) ? "overdue" : "current";
      else status = isPast(gateDate) ? "overdue" : "upcoming";
      return { ...gate, date: gateDate, status };
    });
  }, [delivery, currentProgress]);

  const overdueCount = gates.filter(g => g.status === "overdue").length;
  const isOnTrack = overdueCount === 0;
  const weeksLate = overdueCount > 0 ? Math.max(...gates.filter(g => g.status === "overdue").map(g => Math.abs(differenceInWeeks(g.date, now)))) : 0;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Production timeline</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Delivery {format(delivery, "MMM d, yyyy")} · {weeksUntilDelivery > 0 ? `${weeksUntilDelivery} weeks away` : "past due"}
            </p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
          isOnTrack
            ? "bg-green-500/10 text-green-700 border-green-500/20"
            : "bg-amber-500/10 text-amber-700 border-amber-400/30"
        )}>
          {isOnTrack ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
          {isOnTrack ? "On track" : `${overdueCount} gate${overdueCount > 1 ? "s" : ""} overdue`}
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-3.5 top-3 bottom-3 w-px bg-border" />

          <div className="space-y-3">
            {gates.map((gate, i) => (
              <div key={i} className="flex items-start gap-3 relative">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 bg-card",
                  gate.status === "completed" ? "border-green-500 bg-green-500/10" :
                  gate.status === "current" ? "border-primary bg-primary/10" :
                  gate.status === "overdue" ? "border-rose-500 bg-rose-500/10" :
                  "border-border"
                )}>
                  {gate.status === "completed"
                    ? <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    : gate.status === "overdue"
                    ? <AlertTriangle className="h-3 w-3 text-rose-600" />
                    : gate.status === "current"
                    ? <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    : <div className="w-2 h-2 rounded-full bg-border" />
                  }
                </div>
                <div className={cn("flex-1 min-w-0 pt-0.5 pb-2", gate.status === "completed" && "opacity-60")}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={cn(
                      "text-sm font-medium",
                      gate.status === "overdue" ? "text-rose-700" :
                      gate.status === "current" ? "text-foreground font-semibold" :
                      "text-foreground"
                    )}>{gate.label}</p>
                    <span className={cn(
                      "text-xs flex-shrink-0",
                      gate.status === "overdue" ? "text-rose-600 font-medium" :
                      gate.status === "current" ? "text-primary font-medium" :
                      "text-muted-foreground"
                    )}>
                      {gate.status === "completed" ? "Done" :
                       gate.status === "overdue" ? `${Math.abs(differenceInWeeks(gate.date, now))}w overdue` :
                       format(gate.date, "MMM d")}
                    </span>
                  </div>
                  {(gate.status === "current" || gate.status === "overdue") && (
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{gate.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isOnTrack && (
          <div className="mt-3 p-3 rounded-lg bg-rose-500/5 border border-rose-400/30">
            <p className="text-xs font-semibold text-rose-700 mb-0.5">Timeline risk</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {overdueCount} production gate{overdueCount > 1 ? "s are" : " is"} behind schedule.
              Based on typical lead times, your delivery date may slip by {overdueCount * 1}-{overdueCount * 2} weeks
              unless production accelerates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
