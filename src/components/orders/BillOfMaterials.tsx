import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BOMItem {
  id: string;
  name: string;
  type: "fabric" | "trim" | "label" | "packaging" | "other";
  supplier: string;
  unit: string;
  qty_per_garment: number;
  total_qty: number;
  unit_cost: number;
  colour_ref: string;
  notes: string;
}

interface BillOfMaterialsProps {
  orderId: string;
  quantity: number;
  isFactory?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  fabric: "bg-blue-500/10 text-blue-700 border-blue-400/20",
  trim: "bg-amber-500/10 text-amber-700 border-amber-400/20",
  label: "bg-purple-500/10 text-purple-700 border-purple-400/20",
  packaging: "bg-green-500/10 text-green-700 border-green-400/20",
  other: "bg-secondary text-muted-foreground border-border",
};

export function BillOfMaterials({ orderId, quantity, isFactory = false }: BillOfMaterialsProps) {
  const [items, setItems] = useState<BOMItem[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<BOMItem>>({ type: "fabric", unit: "metres", qty_per_garment: 1.5 });

  useEffect(() => { loadBOM(); }, [orderId]);

  async function loadBOM() {
    const { data } = await (supabase as any)
      .from("order_bom").select("*").eq("order_id", orderId).order("created_at");
    if (data) setItems(data);
  }

  async function addItem() {
    if (!newItem.name) return;
    setLoading(true);
    const item = {
      order_id: orderId,
      name: newItem.name,
      type: newItem.type || "other",
      supplier: newItem.supplier || "",
      unit: newItem.unit || "units",
      qty_per_garment: newItem.qty_per_garment || 1,
      total_qty: (newItem.qty_per_garment || 1) * quantity * 1.05,
      unit_cost: newItem.unit_cost || 0,
      colour_ref: newItem.colour_ref || "",
      notes: newItem.notes || "",
    };
    const { error } = await (supabase as any).from("order_bom").insert(item);
    if (!error) { await loadBOM(); setNewItem({ type: "fabric", unit: "metres", qty_per_garment: 1.5 }); setAdding(false); toast.success("Item added"); }
    else toast.error("Failed to add");
    setLoading(false);
  }

  async function removeItem(id: string) {
    await (supabase as any).from("order_bom").delete().eq("id", id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  const totalCost = items.reduce((s, i) => s + (i.unit_cost * i.total_qty), 0);
  const fmtCost = (n: number) => n > 0 ? `$${n.toFixed(2)}` : "—";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
      <button type="button" onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors text-left">
        <div className="flex items-center gap-3">
          <Package className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Bill of materials</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {items.length > 0 ? `${items.length} items · ${totalCost > 0 ? `est. ${fmtCost(totalCost)} total material cost` : "costs not entered"}` : "No materials logged yet"}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/40">
                    {["Type","Material","Supplier","Qty/garment","Total qty","Unit cost","Colour ref",""].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-secondary/20">
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-xs border capitalize ${TYPE_COLORS[item.type]}`}>{item.type}</span>
                      </td>
                      <td className="px-3 py-2 font-medium text-foreground">{item.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{item.supplier || "—"}</td>
                      <td className="px-3 py-2">{item.qty_per_garment} {item.unit}</td>
                      <td className="px-3 py-2 font-medium">{item.total_qty.toFixed(1)} {item.unit}</td>
                      <td className="px-3 py-2">{fmtCost(item.unit_cost)}</td>
                      <td className="px-3 py-2 text-muted-foreground">{item.colour_ref || "—"}</td>
                      <td className="px-3 py-2">
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-rose-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {totalCost > 0 && (
                    <tr className="bg-secondary/30 font-semibold">
                      <td colSpan={5} className="px-3 py-2 text-muted-foreground text-right">Total material cost:</td>
                      <td className="px-3 py-2 text-foreground">{fmtCost(totalCost)}</td>
                      <td colSpan={2} />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {adding ? (
            <div className="p-4 border-t border-border bg-secondary/20">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Type</label>
                  <select value={newItem.type} onChange={e => setNewItem(p => ({...p, type: e.target.value as any}))}
                    className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background">
                    {["fabric","trim","label","packaging","other"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Material name *</label>
                  <input value={newItem.name || ""} onChange={e => setNewItem(p => ({...p, name: e.target.value}))}
                    placeholder="e.g. 12oz raw denim" className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Supplier</label>
                  <input value={newItem.supplier || ""} onChange={e => setNewItem(p => ({...p, supplier: e.target.value}))}
                    placeholder="Supplier name" className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Colour ref</label>
                  <input value={newItem.colour_ref || ""} onChange={e => setNewItem(p => ({...p, colour_ref: e.target.value}))}
                    placeholder="e.g. Pantone 2965 C" className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Qty per garment</label>
                  <input type="number" value={newItem.qty_per_garment || ""} onChange={e => setNewItem(p => ({...p, qty_per_garment: parseFloat(e.target.value)}))}
                    className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Unit</label>
                  <input value={newItem.unit || ""} onChange={e => setNewItem(p => ({...p, unit: e.target.value}))}
                    placeholder="metres / pcs / kg" className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Unit cost ($)</label>
                  <input type="number" value={newItem.unit_cost || ""} onChange={e => setNewItem(p => ({...p, unit_cost: parseFloat(e.target.value)}))}
                    className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addItem} disabled={loading || !newItem.name}>Add item</Button>
                <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setAdding(true)} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add material
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
