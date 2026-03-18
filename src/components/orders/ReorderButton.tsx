import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { RotateCcw, Loader2, Check, X, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface OrderSnapshot {
  id: string;
  order_number: string;
  factory_id: string;
  quantity: number;
  unit_price: number;
  currency: string;
  incoterms: string | null;
  tech_pack_url: string | null;
  bom_url: string | null;
  specifications: Record<string, unknown> | null;
  factories: { id: string; name: string } | null;
}

interface ReorderButtonProps {
  order: OrderSnapshot;
}

export function ReorderButton({ order }: ReorderButtonProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Editable fields — pre-filled from parent order
  const [quantity, setQuantity] = useState(String(order.quantity));
  const [unitPrice, setUnitPrice] = useState(String(order.unit_price));
  const [notes, setNotes] = useState("");

  const totalAmount = (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0);

  const handleReorder = async () => {
    const qty = parseInt(quantity);
    const price = parseFloat(unitPrice);
    if (!qty || qty < 1) { toast.error("Enter a valid quantity."); return; }
    if (!price || price <= 0) { toast.error("Enter a valid unit price."); return; }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("order-action", {
        body: {
          action: "create_order",
          factory_id: order.factory_id,
          quantity: qty,
          unit_price: price,
          currency: order.currency,
          incoterms: order.incoterms,
          tech_pack_url: order.tech_pack_url,
          bom_url: order.bom_url,
          specifications: {
            ...(order.specifications || {}),
            reorder_of: order.id,
            reorder_notes: notes.trim() || undefined,
          },
          qc_option: "sourcery",
        },
      });

      if (error || !data?.order?.id) throw new Error(error?.message || "Failed to create reorder");

      toast.success(`Reorder created — ${data.order.order_number}`);
      navigate(`/orders/${data.order.id}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to create reorder.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <RotateCcw className="mr-2 h-3 w-3" />
        Reorder
      </Button>
    );
  }

  return (
    <div className="border border-border rounded-xl p-5 bg-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Reorder from {order.factories?.name || "this factory"}
          </span>
        </div>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Pre-filled from order {order.order_number}. Confirm or adjust before submitting.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Quantity (units)</Label>
          <Input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            min={1}
            className="text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Unit price ({order.currency})</Label>
          <Input
            type="number"
            step="0.01"
            value={unitPrice}
            onChange={e => setUnitPrice(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Carried over fields — read only display */}
      <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Carried over from {order.order_number}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex gap-1"><span className="text-muted-foreground">Factory:</span><span className="text-foreground">{order.factories?.name}</span></div>
          <div className="flex gap-1"><span className="text-muted-foreground">Currency:</span><span className="text-foreground">{order.currency}</span></div>
          {order.incoterms && <div className="flex gap-1"><span className="text-muted-foreground">Incoterms:</span><span className="text-foreground">{order.incoterms}</span></div>}
          {order.tech_pack_url && <div className="flex gap-1"><span className="text-muted-foreground">Tech pack:</span><span className="text-foreground">Linked</span></div>}
        </div>
      </div>

      {totalAmount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Order value</span>
          <span className="font-medium text-foreground">
            {order.currency} {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs">Notes for this reorder (optional)</Label>
        <Input
          placeholder="e.g. Same spec as last time but update colorway to black"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="text-sm"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          onClick={handleReorder}
          disabled={submitting || !quantity || !unitPrice}
          className="flex-1"
        >
          {submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Create Reorder
        </Button>
        <Button variant="outline" onClick={() => setOpen(false)} className="w-20">
          Cancel
        </Button>
      </div>
    </div>
  );
}
