import { useState } from "react";
import { Calculator, ArrowRight } from "lucide-react";
import { format, addWeeks, addDays } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SafetyStockCalculatorProps {
  factoryId?: string;
  avgLeadWeeks?: number;
  orderId?: string;
}

export function SafetyStockCalculator({ avgLeadWeeks = 14, orderId }: SafetyStockCalculatorProps) {
  const [weeklyUnits, setWeeklyUnits] = useState(12);
  const [currentStock, setCurrentStock] = useState(300);
  const [safetyWeeks, setSafetyWeeks] = useState(3);
  const [expanded, setExpanded] = useState(false);

  const leadTimeWeeks = avgLeadWeeks;
  const reorderPoint = (leadTimeWeeks + safetyWeeks) * weeklyUnits;
  const weeksOfStockLeft = currentStock / weeklyUnits;
  const daysUntilReorder = Math.max(0, (weeksOfStockLeft - leadTimeWeeks - safetyWeeks) * 7);
  const reorderDate = addDays(new Date(), daysUntilReorder);
  const stockoutDate = addWeeks(new Date(), weeksOfStockLeft);
  const isUrgent = daysUntilReorder <= 14;
  const isOverdue = daysUntilReorder <= 0 && currentStock < reorderPoint;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Calculator className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Safety stock calculator</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isOverdue
                ? "Reorder point already reached — act now"
                : isUrgent
                ? `Reorder in ${Math.round(daysUntilReorder)} days — ${format(reorderDate, "MMM d")}`
                : `Next reorder around ${format(reorderDate, "MMM d, yyyy")}`}
            </p>
          </div>
        </div>
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${isOverdue ? "bg-rose-500/10 text-rose-700" : isUrgent ? "bg-amber-500/10 text-amber-700" : "bg-primary/10 text-primary"}`}>
          {isOverdue ? "Overdue" : isUrgent ? "Soon" : "On track"}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border p-5">
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Safety stock ensures you never hit zero units while waiting for production. Adjust your numbers below.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Weekly sales (units)</label>
              <input
                type="number"
                value={weeklyUnits}
                onChange={e => setWeeklyUnits(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                min="1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Current stock (units)</label>
              <input
                type="number"
                value={currentStock}
                onChange={e => setCurrentStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Safety buffer (weeks)</label>
              <input
                type="number"
                value={safetyWeeks}
                onChange={e => setSafetyWeeks(Math.max(1, Math.min(8, parseInt(e.target.value) || 2)))}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                min="1" max="8"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Reorder point", value: `${reorderPoint.toLocaleString()} units`, highlight: currentStock <= reorderPoint },
              { label: "Stock lasts until", value: format(stockoutDate, "MMM d, yyyy") },
              { label: "Issue PO by", value: format(reorderDate, "MMM d, yyyy"), highlight: isUrgent },
              { label: "Lead time", value: `${leadTimeWeeks} weeks (your avg)` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`p-3 rounded-xl border ${highlight ? "border-amber-400/40 bg-amber-500/5" : "border-border bg-secondary/30"}`}>
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className={`text-sm font-semibold ${highlight ? "text-amber-700" : "text-foreground"}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-secondary/40 rounded-xl p-3 mb-4 text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Formula: </span>
            Reorder at {reorderPoint.toLocaleString()} units = ({leadTimeWeeks} weeks lead time + {safetyWeeks} weeks safety) × {weeklyUnits} units/week.
            At current pace you have {Math.round(weeksOfStockLeft * 10) / 10} weeks of stock.
          </div>

          <Button asChild size="sm" className="gap-1.5">
            <Link to="/orders/create">Start next production run <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      )}
    </div>
  );
}
