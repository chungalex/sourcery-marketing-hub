import { useState } from "react";
import { TrendingUp, ChevronDown } from "lucide-react";

export function MarginCalculator() {
  const [landed, setLanded] = useState(16.30);
  const [overhead, setOverhead] = useState(4);
  const [wsMultiple, setWsMultiple] = useState(2.3);
  const [rtMultiple, setRtMultiple] = useState(2.0);
  const [expanded, setExpanded] = useState(false);

  const totalCost = landed + overhead;
  const wholesale = totalCost * wsMultiple;
  const retail = wholesale * rtMultiple;
  const wsMargin = ((wholesale - totalCost) / wholesale) * 100;
  const rtMargin = ((retail - wholesale) / retail) * 100;
  const contribution = wholesale - totalCost;
  const fmt = (n: number) => `$${n.toFixed(2)}`;
  const pct = (n: number) => `${Math.round(n)}%`;

  const health = wsMargin >= 55 ? "good" : wsMargin >= 40 ? "ok" : "low";
  const healthConfig = {
    good: { label: "Healthy margin", color: "text-green-700", bg: "bg-green-500/10 border-green-400/20" },
    ok: { label: "Acceptable margin", color: "text-amber-700", bg: "bg-amber-500/10 border-amber-400/20" },
    low: { label: "Low margin — review costs", color: "text-rose-700", bg: "bg-rose-500/10 border-rose-400/20" },
  };
  const hc = healthConfig[health];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button type="button" onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors text-left">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Margin calculator</p>
            <p className="text-xs text-muted-foreground mt-0.5">Landed cost → wholesale → retail with margin at each level</p>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-border p-5">
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Landed cost per unit ($)", val: landed, set: setLanded, step: 0.5 },
              { label: "Brand overhead per unit ($)", val: overhead, set: setOverhead, step: 0.5 },
              { label: "Wholesale multiple (×)", val: wsMultiple, set: setWsMultiple, step: 0.1 },
              { label: "Retail multiple (×)", val: rtMultiple, set: setRtMultiple, step: 0.1 },
            ].map(({ label, val, set, step }) => (
              <div key={label}>
                <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                <input type="number" value={val} step={step} min={0}
                  onChange={e => set(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground" />
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            {[
              { label: "Total unit cost", value: fmt(totalCost), sub: `${fmt(landed)} landed + ${fmt(overhead)} overhead`, highlight: false },
              { label: "Wholesale price", value: fmt(wholesale), sub: `${pct(wsMargin)} margin · ${fmt(contribution)} contribution`, highlight: true },
              { label: "Retail price", value: fmt(retail), sub: `Retailer margin: ${pct(rtMargin)}`, highlight: false },
            ].map(({ label, value, sub, highlight }) => (
              <div key={label} className={`flex items-center justify-between p-3 rounded-xl border ${highlight ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/20"}`}>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                </div>
                <p className={`text-lg font-semibold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className={`p-3 rounded-xl border text-xs ${hc.bg} ${hc.color}`}>
            {hc.label} — wholesale margin at {pct(wsMargin)}.
            {wsMargin < 50 && " Industry benchmark is 50%+ wholesale margin. Review landed cost or increase wholesale price."}
            {wsMargin >= 55 && " Strong economics — your pricing supports healthy brand operations."}
          </div>
        </div>
      )}
    </div>
  );
}
