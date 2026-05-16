// ─── Formal Change Order Flow ─────────────────────────────────────────────────
// Every spec change is a formal change order on Ariadne.
// Brand raises the change — field level, what was agreed vs what is changing.
// Factory receives it, reviews, formally acknowledges.
// Change order attached to PO. Audit trail permanent.
// Replaces: "I texted them the change, hope they got it."

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Plus, ArrowRight, Loader2, CheckCircle, 
  AlertTriangle, FileText, ChevronDown, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChangeOrder {
  id: string;
  orderId: string;
  fieldChanged: string;
  originalValue: string;
  newValue: string;
  reason: string;
  status: "pending" | "acknowledged" | "rejected";
  createdAt: Date;
  acknowledgedAt?: Date;
}

interface ChangeOrderFlowProps {
  orderId: string;
  orderStatus: string;
  existingChanges?: ChangeOrder[];
  onChangeCreated?: () => void;
}

const CHANGE_FIELDS = [
  { value: "fabric_composition", label: "Fabric composition" },
  { value: "fabric_weight_gsm", label: "Fabric weight (GSM)" },
  { value: "colour", label: "Colour / colourway" },
  { value: "construction", label: "Construction detail" },
  { value: "measurement", label: "Measurement / size" },
  { value: "trim", label: "Trim specification" },
  { value: "quantity", label: "Order quantity" },
  { value: "delivery_date", label: "Delivery date" },
  { value: "payment_terms", label: "Payment terms" },
  { value: "packaging", label: "Packaging requirement" },
  { value: "labelling", label: "Label / care instruction" },
  { value: "other", label: "Other" },
];

export function ChangeOrderFlow({
  orderId,
  orderStatus,
  existingChanges = [],
  onChangeCreated,
}: ChangeOrderFlowProps) {
  const [creating, setCreating] = useState(false);
  const [field, setField] = useState("");
  const [originalValue, setOriginalValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const canCreateChange = !["closed", "cancelled", "shipped"].includes(orderStatus);
  const pendingCount = existingChanges.filter(c => c.status === "pending").length;

  async function submitChange() {
    if (!field || !newValue.trim()) {
      toast.error("Select a field and enter the new value");
      return;
    }
    setSaving(true);
    try {
      // Log change order as a special message type
      await (supabase as any).from("order_messages").insert({
        order_id: orderId,
        content: `Change order: ${CHANGE_FIELDS.find(f => f.value === field)?.label || field}${originalValue ? ` — from "${originalValue}"` : ""} → "${newValue}".${reason ? ` Reason: ${reason}` : ""} Factory acknowledgement required before work continues.`,
        message_type: "change_order",
        metadata: JSON.stringify({ 
          field, 
          original_value: originalValue, 
          new_value: newValue, 
          reason,
          requires_acknowledgement: true,
        }),
      });

      toast.success("Change order sent — factory must acknowledge before continuing");
      setCreating(false);
      setField(""); setOriginalValue(""); setNewValue(""); setReason("");
      onChangeCreated?.();
    } catch (e) {
      toast.error("Failed to create change order");
    }
    setSaving(false);
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Change orders</span>
          {pendingCount > 0 && (
            <span className="text-xs bg-amber-500/15 text-amber-600 font-medium px-1.5 py-0.5 rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>
        {canCreateChange && !creating && (
          <Button size="sm" variant="outline" onClick={() => setCreating(true)} className="gap-1.5 h-7 text-xs">
            <Plus className="h-3 w-3" /> New change
          </Button>
        )}
      </div>

      {/* Warning about importance */}
      {canCreateChange && !creating && existingChanges.length === 0 && (
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every spec change should be a formal change order — not a WhatsApp message. 
            This creates an official record the factory must acknowledge, preventing 
            "I didn't know about that change" disputes.
          </p>
        </div>
      )}

      {/* Create change form */}
      {creating && (
        <div className="p-4 space-y-3 border-b border-border">
          <div className="bg-amber-500/5 border border-amber-400/20 rounded-lg px-3 py-2">
            <p className="text-xs text-amber-600 leading-relaxed">
              The factory must formally acknowledge this change before work continues. 
              Unacknowledged changes are logged as disputed.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">What is changing?</label>
            <div className="grid grid-cols-2 gap-1.5">
              {CHANGE_FIELDS.map(f => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setField(f.value)}
                  className={cn(
                    "text-left px-2.5 py-2 rounded-lg border text-xs transition-all",
                    field === f.value
                      ? "border-primary bg-primary/5 text-foreground font-medium"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Original value <span className="font-normal">(optional)</span>
              </label>
              <input
                value={originalValue}
                onChange={e => setOriginalValue(e.target.value)}
                placeholder="e.g. 12oz"
                className="w-full text-xs border border-border rounded-lg px-2.5 py-2 bg-background"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                New value <span className="text-red-400">*</span>
              </label>
              <input
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="e.g. 11oz"
                className="w-full text-xs border border-border rounded-lg px-2.5 py-2 bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Reason <span className="font-normal">(optional but recommended)</span>
            </label>
            <input
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Customer feedback on prototype weight"
              className="w-full text-xs border border-border rounded-lg px-2.5 py-2 bg-background"
            />
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={submitChange}
              disabled={saving || !field || !newValue.trim()}
              className="gap-1.5"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
              Issue change order
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setCreating(false); setField(""); setOriginalValue(""); setNewValue(""); setReason(""); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Change history */}
      {existingChanges.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowHistory(v => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary/30 transition-colors"
          >
            <span className="text-xs font-medium text-muted-foreground">
              {existingChanges.length} change order{existingChanges.length !== 1 ? "s" : ""}
            </span>
            {showHistory ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>

          {showHistory && (
            <div className="divide-y divide-border border-t border-border">
              {existingChanges.map((change, i) => (
                <div key={change.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-medium text-foreground">
                          {CHANGE_FIELDS.find(f => f.value === change.fieldChanged)?.label || change.fieldChanged}
                        </span>
                        {change.originalValue && (
                          <>
                            <span className="text-xs text-muted-foreground">{change.originalValue}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          </>
                        )}
                        <span className="text-xs font-medium text-primary">{change.newValue}</span>
                      </div>
                      {change.reason && (
                        <p className="text-xs text-muted-foreground">{change.reason}</p>
                      )}
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0",
                      change.status === "acknowledged" ? "bg-green-500/10 text-green-600" :
                      change.status === "rejected" ? "bg-red-500/10 text-red-500" :
                      "bg-amber-500/10 text-amber-600"
                    )}>
                      {change.status === "acknowledged" ? "✓ Acknowledged" :
                       change.status === "rejected" ? "Disputed" :
                       "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
