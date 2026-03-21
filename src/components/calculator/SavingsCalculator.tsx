import { useState } from "react";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const BUILDER_ANNUAL = 399;

export function SavingsCalculator() {
  const [orderValue, setOrderValue] = useState(15000);
  const [ordersPerYear, setOrdersPerYear] = useState(4);

  const annualVolume = orderValue * ordersPerYear;

  // Failure rate assumptions — conservative, based on scenarios documented on this page
  const measurementErrorRate  = 0.03; // 3% of orders hit a rework/measurement issue
  const lostSpecChangeRate    = 0.05; // 5% of orders have a disputed spec change
  const postPaymentDefectRate = 0.08; // 8% of orders surface post-payment defects

  const annualMeasurementRisk = ordersPerYear * measurementErrorRate  * (orderValue * 0.18);
  const annualSpecRisk        = ordersPerYear * lostSpecChangeRate    * (orderValue * 0.40);
  const annualDefectRisk      = ordersPerYear * postPaymentDefectRate * (orderValue * 0.10);
  const totalExposure         = annualMeasurementRisk + annualSpecRisk + annualDefectRisk;

  const net        = totalExposure - BUILDER_ANNUAL;
  const isPositive = net > 0;

  const sliderClass = "w-full h-1.5 rounded-full appearance-none bg-border cursor-pointer accent-primary";

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-8">

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Average order value</label>
            <span className="text-sm font-semibold text-foreground">{fmt(orderValue)}</span>
          </div>
          <input type="range" min={2000} max={200000} step={1000}
            value={orderValue} onChange={e => setOrderValue(Number(e.target.value))}
            className={sliderClass} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>$2k</span><span>$200k</span></div>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Orders per year</label>
            <span className="text-sm font-semibold text-foreground">{ordersPerYear}</span>
          </div>
          <input type="range" min={1} max={24} step={1}
            value={ordersPerYear} onChange={e => setOrdersPerYear(Number(e.target.value))}
            className={sliderClass} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1</span><span>24</span></div>
        </div>
      </div>

      {/* Annual volume */}
      <div className="flex items-center justify-between py-3 border-y border-border">
        <span className="text-sm text-muted-foreground">Annual production volume</span>
        <span className="text-base font-semibold text-foreground">{fmt(annualVolume)}</span>
      </div>

      {/* Failure exposure */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Estimated annual failure exposure</p>
        {[
          { label: "Measurement / rework errors", sub: `${(measurementErrorRate*100).toFixed(0)}% of orders × avg rework cost`, val: annualMeasurementRisk },
          { label: "Lost or disputed spec changes", sub: `${(lostSpecChangeRate*100).toFixed(0)}% of orders × avg loss`, val: annualSpecRisk },
          { label: "Post-payment QC defects", sub: `${(postPaymentDefectRate*100).toFixed(0)}% of orders × avg defect loss`, val: annualDefectRisk },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
            <div>
              <p className="text-sm text-foreground">{row.label}</p>
              <p className="text-xs text-muted-foreground">{row.sub}</p>
            </div>
            <span className="text-sm font-semibold text-rose-600 ml-4 flex-shrink-0">{fmt(row.val)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
          <span className="text-sm font-semibold text-foreground">Total estimated exposure</span>
          <span className="text-base font-bold text-rose-600">{fmt(totalExposure)}</span>
        </div>
      </div>

      {/* Sourcery cost — subscription, not percentage */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sourcery cost</p>
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div>
            <p className="text-sm text-foreground">Builder plan — flat annual subscription</p>
            <p className="text-xs text-muted-foreground">Milestone gate enforcement, sample gate, QC gating, dispute documentation, marketplace access</p>
          </div>
          <span className="text-base font-bold text-primary ml-4 flex-shrink-0">{fmt(BUILDER_ANNUAL)}/yr</span>
        </div>
      </div>

      {/* Net */}
      <div className={cn(
        "flex items-center justify-between p-4 rounded-xl border",
        isPositive ? "bg-primary/5 border-primary/20" : "bg-card border-border"
      )}>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isPositive ? "Estimated exposure protected vs. subscription cost" : "Net cost at this volume"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isPositive
              ? `$${BUILDER_ANNUAL}/year protects against ${fmt(totalExposure)} in estimated failure exposure`
              : "Subscription exceeds estimated failure exposure at this volume — may still save significant time"}
          </p>
        </div>
        <span className={cn("text-xl font-bold ml-4 flex-shrink-0", isPositive ? "text-primary" : "text-foreground")}>
          {isPositive ? "+" : ""}{fmt(net)}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Failure rates and cost estimates are illustrative — based on the production scenarios documented on this page. Actual results vary by factory, product type, order size, and circumstances.
      </p>
    </div>
  );
}
