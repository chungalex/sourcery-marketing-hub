import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Package, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SKU_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-muted text-muted-foreground" },
  { value: "approved", label: "Approved", color: "bg-blue-500/10 text-blue-700 border-blue-400/30" },
  { value: "in_cutting", label: "In cutting", color: "bg-amber-500/10 text-amber-700 border-amber-400/30" },
  { value: "in_sewing", label: "In sewing", color: "bg-amber-500/10 text-amber-700 border-amber-400/30" },
  { value: "finishing", label: "Finishing", color: "bg-purple-500/10 text-purple-700 border-purple-400/30" },
  { value: "qc_pending", label: "QC pending", color: "bg-orange-500/10 text-orange-700 border-orange-400/30" },
  { value: "passed", label: "Passed QC", color: "bg-green-500/10 text-green-700 border-green-400/30" },
  { value: "failed", label: "Failed QC", color: "bg-rose-500/10 text-rose-700 border-rose-400/30" },
];

interface SKU {
  id: string;
  order_id: string;
  sku_code: string;
  colourway: string | null;
  size: string | null;
  quantity: number;
  status: string;
  notes: string | null;
  created_at: string;
}

interface OrderSKUsProps {
  orderId: string;
  isFactory?: boolean;
  orderStatus?: string;
}

export function OrderSKUs({ orderId, isFactory = false, orderStatus }: OrderSKUsProps) {
  const [skus, setSkus] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newSku, setNewSku] = useState({ sku_code: "", colourway: "", size: "", quantity: "" });

  useEffect(() => { load(); }, [orderId]);

  async function load() {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("order_skus")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });
    setSkus(data || []);
    setLoading(false);
  }

  const handleAdd = async () => {
    if (!newSku.sku_code.trim() || !newSku.quantity) {
      toast.error("SKU code and quantity required");
      return;
    }
    setSaving(true);
    const { error } = await (supabase as any).from("order_skus").insert({
      order_id: orderId,
      sku_code: newSku.sku_code.trim(),
      colourway: newSku.colourway.trim() || null,
      size: newSku.size.trim() || null,
      quantity: parseInt(newSku.quantity),
      status: "pending",
    });
    if (error) { toast.error("Failed to add SKU"); }
    else {
      toast.success("SKU added");
      setNewSku({ sku_code: "", colourway: "", size: "", quantity: "" });
      setShowAdd(false);
      load();
    }
    setSaving(false);
  };

  const handleStatusChange = async (skuId: string, status: string) => {
    await (supabase as any).from("order_skus").update({ status }).eq("id", skuId);
    setSkus(prev => prev.map(s => s.id === skuId ? { ...s, status } : s));
    toast.success("Status updated");
  };

  const totalUnits = skus.reduce((s, sku) => s + sku.quantity, 0);
  const passedCount = skus.filter(s => s.status === "passed").length;
  const failedCount = skus.filter(s => s.status === "failed").length;
  const inProgressCount = skus.filter(s => ["in_cutting","in_sewing","finishing"].includes(s.status)).length;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Package className="h-4 w-4 text-primary" />
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">
              SKU tracking
              {skus.length > 0 && <span className="ml-2 text-xs font-normal text-muted-foreground">{skus.length} SKUs · {totalUnits.toLocaleString()} units</span>}
            </p>
            {skus.length > 0 && (
              <div className="flex gap-2 mt-0.5">
                {passedCount > 0 && <span className="text-xs text-green-600">{passedCount} passed</span>}
                {failedCount > 0 && <span className="text-xs text-rose-600">{failedCount} failed</span>}
                {inProgressCount > 0 && <span className="text-xs text-amber-600">{inProgressCount} in production</span>}
              </div>
            )}
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {skus.length === 0 && !showAdd && (
                <div className="px-5 py-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">No SKUs added yet. Break this order into individual SKUs to track each colourway and size separately.</p>
                </div>
              )}

              {skus.length > 0 && (
                <div className="divide-y divide-border">
                  {skus.map(sku => {
                    const statusConfig = SKU_STATUSES.find(s => s.value === sku.status) || SKU_STATUSES[0];
                    return (
                      <div key={sku.id} className="px-5 py-3 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-semibold text-foreground">{sku.sku_code}</span>
                            {sku.colourway && <span className="text-xs text-muted-foreground">{sku.colourway}</span>}
                            {sku.size && <span className="text-xs px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">{sku.size}</span>}
                            <span className="text-xs text-muted-foreground">{sku.quantity.toLocaleString()} units</span>
                          </div>
                        </div>
                        <div>
                          {isFactory ? (
                            <select
                              value={sku.status}
                              onChange={e => handleStatusChange(sku.id, e.target.value)}
                              className="text-xs border border-border rounded-lg px-2 py-1 bg-card text-foreground"
                            >
                              {SKU_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                          ) : (
                            <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", statusConfig.color)}>
                              {statusConfig.label}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!isFactory && (
                <div className="px-5 py-3 border-t border-border">
                  {!showAdd ? (
                    <Button size="sm" variant="outline" onClick={() => setShowAdd(true)} className="gap-1.5 w-full">
                      <Plus className="h-3.5 w-3.5" /> Add SKU
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">SKU code *</p>
                          <Input value={newSku.sku_code} onChange={e => setNewSku(p => ({...p, sku_code: e.target.value}))} placeholder="e.g. OKS26-001-IND-S" className="text-sm h-8" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Quantity *</p>
                          <Input type="number" value={newSku.quantity} onChange={e => setNewSku(p => ({...p, quantity: e.target.value}))} placeholder="e.g. 50" className="text-sm h-8" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Colourway</p>
                          <Input value={newSku.colourway} onChange={e => setNewSku(p => ({...p, colourway: e.target.value}))} placeholder="e.g. Indigo" className="text-sm h-8" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Size</p>
                          <Input value={newSku.size} onChange={e => setNewSku(p => ({...p, size: e.target.value}))} placeholder="e.g. S" className="text-sm h-8" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAdd} disabled={saving} className="gap-1.5">
                          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                          Add SKU
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
