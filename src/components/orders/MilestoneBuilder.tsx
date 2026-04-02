import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Milestone {
  id: string;
  label: string;
  percentage: number;
  release_condition: string;
}

const DEFAULT_MILESTONES: Milestone[] = [
  { id: "1", label: "Deposit", percentage: 30, release_condition: "On PO acceptance — factory confirms they can produce your order" },
  { id: "2", label: "Bulk production", percentage: 40, release_condition: "After sample approved — you've confirmed the product is right before bulk begins" },
  { id: "3", label: "Final release", percentage: 30, release_condition: "After QC pass — goods meet the agreed standard before final payment" },
];

const PRESETS = [
  {
    name: "Standard (3 stage)",
    desc: "Deposit → Bulk production → Final release",
    milestones: DEFAULT_MILESTONES,
  },
  {
    name: "Conservative (4 stage)",
    desc: "Smaller stages, more control",
    milestones: [
      { id: "1", label: "Deposit", percentage: 20, release_condition: "On PO acceptance" },
      { id: "2", label: "Sample approval", percentage: 20, release_condition: "After sample approved" },
      { id: "3", label: "Bulk production", percentage: 40, release_condition: "After bulk begins" },
      { id: "4", label: "Final release", percentage: 20, release_condition: "After QC pass" },
    ],
  },
  {
    name: "High-value (5 stage)",
    desc: "Maximum control for large orders",
    milestones: [
      { id: "1", label: "Booking deposit", percentage: 10, release_condition: "On PO acceptance" },
      { id: "2", label: "Sample approval", percentage: 20, release_condition: "After sample approved" },
      { id: "3", label: "Fabric confirmation", percentage: 30, release_condition: "After fabric cut confirmed" },
      { id: "4", label: "Production milestone", percentage: 30, release_condition: "After QC pass" },
      { id: "5", label: "Shipment release", percentage: 10, release_condition: "After confirmed shipment" },
    ],
  },
];

interface MilestoneBuilderProps {
  value: Milestone[];
  onChange: (milestones: Milestone[]) => void;
  isPro?: boolean;
  orderTotal?: number;
  currency?: string;
}

export function MilestoneBuilder({ value, onChange, isPro = false, orderTotal = 0, currency = "USD" }: MilestoneBuilderProps) {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [selectedPreset, setSelectedPreset] = useState(0);

  const total = value.reduce((s, m) => s + m.percentage, 0);
  const isValid = Math.round(total) === 100;

  const fmt = (n: number) => {
    const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "CNY" ? "¥" : "$";
    return `${sym}${((n / 100) * orderTotal).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const addMilestone = () => {
    const remaining = 100 - total;
    onChange([...value, {
      id: crypto.randomUUID(),
      label: "New milestone",
      percentage: Math.max(remaining, 0),
      release_condition: "",
    }]);
  };

  const updateMilestone = (id: string, field: keyof Milestone, val: string | number) => {
    onChange(value.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const removeMilestone = (id: string) => {
    if (value.length <= 2) return;
    onChange(value.filter(m => m.id !== id));
  };

  const applyPreset = (index: number) => {
    setSelectedPreset(index);
    onChange(PRESETS[index].milestones.map(m => ({ ...m, id: crypto.randomUUID() })));
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <p className="text-xs font-semibold text-foreground mb-1.5">How milestone payments protect you</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Each milestone releases only when you manually approve it — nothing moves automatically. Your deposit secures the factory's commitment. The bulk payment releases only after you've approved the sample. The final payment releases only after QC passes. You hold leverage at every stage.
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Payment milestones</p>
          <p className="text-xs text-muted-foreground mt-0.5">Define how payments are structured and released</p>
        </div>
        <div className="flex gap-1 p-0.5 bg-secondary rounded-lg border border-border">
            <button onClick={() => setMode("preset")} className={cn("text-xs px-3 py-1.5 rounded-md transition-colors", mode === "preset" ? "bg-background text-foreground font-medium" : "text-muted-foreground")}>
              Presets
            </button>
            <button onClick={() => setMode("custom")} className={cn("text-xs px-3 py-1.5 rounded-md transition-colors", mode === "custom" ? "bg-background text-foreground font-medium" : "text-muted-foreground")}>
              Custom
            </button>
        </div>
      </div>

      {/* Pro preset selector */}
      {isPro && mode === "preset" && (
        <div className="space-y-2">
          {PRESETS.map((preset, i) => (
            <button key={preset.name} onClick={() => applyPreset(i)} className={cn(
              "w-full text-left p-3 rounded-lg border transition-colors",
              selectedPreset === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
            )}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{preset.name}</p>
                {selectedPreset === i && <span className="text-xs text-primary font-medium">Selected</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{preset.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Milestone list — always shown */}
      <div className={cn("space-y-2", isPro && mode === "preset" && "opacity-75 pointer-events-none")}>
        {value.map((m, i) => (
          <div key={m.id} className="flex items-start gap-2 p-3 rounded-lg border border-border bg-card">
            {isPro && mode === "custom" && (
              <GripVertical className="h-4 w-4 text-muted-foreground mt-2.5 flex-shrink-0 cursor-grab" />
            )}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Label</p>
                <Input
                  value={m.label}
                  onChange={e => updateMilestone(m.id, "label", e.target.value)}
                  disabled={!isPro || mode !== "custom"}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Percentage</p>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={1}
                    max={99}
                    value={m.percentage}
                    onChange={e => updateMilestone(m.id, "percentage", parseFloat(e.target.value) || 0)}
                    disabled={!isPro || mode !== "custom"}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                  {orderTotal > 0 && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{fmt(m.percentage)}</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Release condition</p>
                <Input
                  value={m.release_condition}
                  onChange={e => updateMilestone(m.id, "release_condition", e.target.value)}
                  disabled={!isPro || mode !== "custom"}
                  placeholder="e.g. After QC pass"
                  className="h-8 text-sm"
                />
              </div>
            </div>
            {isPro && mode === "custom" && value.length > 2 && (
              <button onClick={() => removeMilestone(m.id)} className="text-muted-foreground hover:text-destructive mt-2 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Total validation */}
      <div className={cn(
        "flex items-center justify-between px-3 py-2 rounded-lg text-sm",
        isValid ? "bg-green-500/10 text-green-700" : "bg-amber-500/10 text-amber-700"
      )}>
        <span>Total: {total}%</span>
        {!isValid && <span className="text-xs">Must equal 100%</span>}
        {isValid && <span className="text-xs">✓ Valid</span>}
      </div>

      {/* Add milestone button — Pro custom only */}
      {isPro && mode === "custom" && (
        <Button type="button" variant="outline" size="sm" onClick={addMilestone} className="w-full text-xs gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add milestone
        </Button>
      )}

      {/* Builder upgrade prompt */}
      {!isPro && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Custom milestone structures are available on Pro. Upgrade to define your own payment stages, percentages, and release conditions.{" "}
            <a href="/pricing" className="text-primary hover:underline">See Pro →</a>
          </p>
        </div>
      )}
    </div>
  );
}
