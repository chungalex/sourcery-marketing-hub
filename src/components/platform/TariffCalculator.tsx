import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

const COUNTRIES = [
  { code: "VN", name: "Vietnam", rates: { US: 17, UK: 12, EU: 12, AU: 5, CA: 0 } },
  { code: "CN", name: "China", rates: { US: 162, UK: 12, EU: 12, AU: 5, CA: 18 } },
  { code: "BD", name: "Bangladesh", rates: { US: 15.9, UK: 0, EU: 0, AU: 0, CA: 0 } },
  { code: "ID", name: "Indonesia", rates: { US: 16.5, UK: 12, EU: 12, AU: 5, CA: 18 } },
  { code: "IN", name: "India", rates: { US: 18, UK: 12, EU: 12, AU: 5, CA: 18 } },
];

const DEST = ["US", "UK", "EU", "AU", "CA"];
const DEST_LABELS: Record<string, string> = { US: "United States", UK: "United Kingdom", EU: "European Union", AU: "Australia", CA: "Canada" };

export function TariffCalculator() {
  const [fob, setFob] = useState(12);
  const [qty, setQty] = useState(300);
  const [freight, setFreight] = useState(1800);
  const [dest, setDest] = useState("US");
  const [expanded, setExpanded] = useState(false);

  const fobTotal = fob * qty;
  const cif = fobTotal + freight;

  const rows = COUNTRIES.map(c => {
    const rate = (c.rates as any)[dest] || 0;
    const duty = cif * (rate / 100);
    const landedPerUnit = (fobTotal + freight + duty) / qty;
    return { ...c, rate, duty, landedPerUnit };
  }).sort((a, b) => a.landedPerUnit - b.landedPerUnit);

  const cheapest = rows[0];
  const fmt = (n: number) => `$${n.toFixed(2)}`;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Tariff comparison calculator</p>
            <p className="text-xs text-muted-foreground mt-0.5">Compare landed cost: Vietnam vs China vs Bangladesh</p>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-border p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: "FOB per unit ($)", val: fob, set: setFob, min: 1 },
              { label: "Quantity (units)", val: qty, set: setQty, min: 1 },
              { label: "Total freight ($)", val: freight, set: setFreight, min: 0 },
            ].map(({ label, val, set, min }) => (
              <div key={label}>
                <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                <input type="number" value={val} min={min}
                  onChange={e => set(Math.max(min, parseFloat(e.target.value) || min))}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground" />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Destination</label>
              <select value={dest} onChange={e => setDest(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground">
                {DEST.map(d => <option key={d} value={d}>{DEST_LABELS[d]}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {rows.map((c, i) => (
              <div key={c.code} className={`flex items-center gap-3 p-3 rounded-xl border ${i === 0 ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/20"}`}>
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                    {i === 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">cheapest</span>}
                    {c.code === "CN" && dest === "US" && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 font-medium">145% tariff</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c.rate}% duty · ${(c.duty / qty).toFixed(2)}/unit duty cost
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{fmt(c.landedPerUnit)}</p>
                  <p className="text-xs text-muted-foreground">per unit landed</p>
                </div>
              </div>
            ))}
          </div>

          {dest === "US" && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-400/20 text-xs text-amber-800 leading-relaxed">
              China's 145% US tariff (2025) adds {fmt((rows.find(r => r.code === "CN")?.duty || 0) / qty)} per unit in duties alone.
              Vietnam saves you {fmt((rows.find(r => r.code === "CN")?.landedPerUnit || 0) - rows.find(r => r.code === "VN")?.landedPerUnit!)} per unit vs China on this order.
              At {qty} units that's {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                ((rows.find(r => r.code === "CN")?.landedPerUnit || 0) - (rows.find(r => r.code === "VN")?.landedPerUnit || 0)) * qty
              )} in savings.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
