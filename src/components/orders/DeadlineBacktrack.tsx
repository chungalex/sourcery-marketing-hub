import { useMemo } from "react";
import { addWeeks, format, differenceInDays, isPast } from "date-fns";
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeadlineGate {
  label: string;
  weeksBeforeDelivery: number;
  status: "completed" | "current" | "upcoming" | "overdue";
  date: Date;
}

interface DeadlineBacktrackProps {
  deliveryDate: string | null;
  orderStatus: string;
  orderCreatedAt: string;
  factoryLeadTimeWeeks?: number;
}

const STATUS_ORDER = [
  "draft", "po_issued", "po_accepted", "sample_sent",
  "sample_approved", "in_production", "qc_scheduled",
  "qc_uploaded", "qc_pass", "ready_to_ship", "shipped", "closed",
];

const GATES = [
  { label: "Issue PO", weeksBeforeDelivery: 16, statusGate: "po_issued" },
  { label: "Factory accepts", weeksBeforeDelivery: 15, statusGate: "po_accepted" },
  { label: "Sample approved", weeksBeforeDelivery: 12, statusGate: "sample_approved" },
  { label: "Bulk production starts", weeksBeforeDelivery: 8, statusGate: "in_production" },
  { label: "QC completed", weeksBeforeDelivery: 3, statusGate: "qc_pass" },
  { label: "Ready to ship", weeksBeforeDelivery: 1, statusGate: "ready_to_ship" },
];

export function DeadlineBacktrack({ deliveryDate, orderStatus, orderCreatedAt, factoryLeadTimeWeeks = 16 }: DeadlineBacktrackProps) {
  const gates = useMemo(() => {
    if (!deliveryDate) return [];

    const delivery = new Date(deliveryDate);
    const currentStatusIndex = STATUS_ORDER.indexOf(orderStatus);

    return GATES.map(gate => {
      const gateDate = addWeeks(delivery, -gate.weeksBeforeDelivery);
      const gateStatusIndex = STATUS_ORDER.indexOf(gate.statusGate);
      
      let status: DeadlineGate["status"];
      if (currentStatusIndex >= gateStatusIndex) {
        status = "completed";
      } else if (isPast(gateDate)) {
        status = "overdue";
      } else if (gateStatusIndex === currentStatusIndex + 1) {
        status = "current";
      } else {
        status = "upcoming";
      }

      return { label: gate.label, weeksBeforeDelivery: gate.weeksBeforeDelivery, status, date: gateDate };
    });
  }, [deliveryDate, orderStatus]);

  if (!deliveryDate || gates.length === 0) return null;

  const delivery = new Date(deliveryDate);
  const daysToDelivery = differenceInDays(delivery, new Date());
  const overdue = gates.filter(g => g.status === "overdue").length;
  const isOnTrack = overdue === 0;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Production timeline</p>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
          isOnTrack
            ? "bg-green-500/10 text-green-700 border-green-500/20"
            : "bg-amber-500/10 text-amber-700 border-amber-400/30"
        )}>
          {isOnTrack
            ? <><CheckCircle className="h-3 w-3" /> On track</>
            : <><AlertTriangle className="h-3 w-3" /> {overdue} gate{overdue !== 1 ? "s" : ""} overdue</>}
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Delivery target */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">Target delivery</p>
            <p className="text-base font-bold text-foreground">{format(delivery, "MMMM d, yyyy")}</p>
          </div>
          <div className="text-right">
            <p className={cn("text-lg font-bold", daysToDelivery < 0 ? "text-rose-600" : daysToDelivery < 30 ? "text-amber-600" : "text-foreground")}>
              {daysToDelivery < 0 ? `${Math.abs(daysToDelivery)}d overdue` : `${daysToDelivery}d remaining`}
            </p>
          </div>
        </div>

        {/* Gates */}
        <div className="relative">
          <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border" />
          <div className="space-y-3">
            {gates.map((gate, i) => (
              <div key={i} className="flex items-start gap-3 relative">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2",
                  gate.status === "completed" ? "bg-green-500 border-green-500" :
                  gate.status === "overdue" ? "bg-rose-500 border-rose-500" :
                  gate.status === "current" ? "bg-primary border-primary" :
                  "bg-background border-border"
                )}>
                  {gate.status === "completed" && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                  {gate.status === "overdue" && <AlertTriangle className="h-3.5 w-3.5 text-white" />}
                  {gate.status === "current" && <ArrowRight className="h-3.5 w-3.5 text-primary-foreground" />}
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-baseline justify-between">
                    <p className={cn(
                      "text-sm font-medium",
                      gate.status === "completed" ? "text-muted-foreground line-through" :
                      gate.status === "overdue" ? "text-rose-600" :
                      gate.status === "current" ? "text-foreground font-semibold" :
                      "text-muted-foreground"
                    )}>
                      {gate.label}
                    </p>
                    <p className={cn(
                      "text-xs flex-shrink-0 ml-2",
                      gate.status === "overdue" ? "text-rose-600 font-medium" :
                      gate.status === "current" ? "text-primary font-medium" :
                      "text-muted-foreground"
                    )}>
                      {format(gate.date, "MMM d")}
                      {gate.status === "overdue" && ` (${differenceInDays(new Date(), gate.date)}d late)`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {overdue > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-400/30">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>{overdue} production gate{overdue !== 1 ? "s are" : " is"} behind schedule.</strong> Contact your factory to understand the delay and whether the delivery date is still achievable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
