import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisputeFilingProps {
  orderId: string;
  orderNumber: string;
  factoryName: string;
  onFiled?: () => void;
}

const DISPUTE_TYPES = [
  "Quality does not match approved sample",
  "Spec built from wrong version",
  "Defects exceed agreed AQL threshold",
  "Delivery significantly delayed",
  "Quantity delivered does not match PO",
  "Unauthorised material substitution",
  "Other",
];

export function DisputeFiling({ orderId, orderNumber, factoryName, onFiled }: DisputeFilingProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filed, setFiled] = useState(false);

  const submit = async () => {
    if (!type || !description.trim()) {
      toast.error("Select a dispute type and describe the issue.");
      return;
    }
    setSubmitting(true);
    try {
      await (supabase as any).from("order_disputes").insert({
        order_id: orderId,
        filed_by: user!.id,
        dispute_type: type,
        description: description.trim(),
        status: "open",
      });

      // Fire notification via edge function
      await supabase.functions.invoke("order-action", {
        body: { action: "file_dispute", order_id: orderId, metadata: { type, description } },
      });

      setFiled(true);
      toast.success("Dispute filed. Both parties have been notified.");
      onFiled?.();
    } catch {
      toast.error("Could not file dispute. Try again.");
    }
    setSubmitting(false);
  };

  if (filed) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Dispute filed</p>
          <p className="text-xs text-muted-foreground">Both parties notified. Your full order record — every message, revision, and defect report — is your evidence.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-amber-500/25 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">File a dispute</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            For marketplace factories, disputes are logged against their public performance record. This creates real incentive to resolve properly.
          </p>
        </div>
      </div>

      {!open ? (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/5">
          File dispute for {orderNumber}
        </Button>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Dispute type</p>
            <div className="space-y-1.5">
              {DISPUTE_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors",
                    type === t ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-foreground mb-2">Describe the issue</p>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Be specific — what was agreed, what was delivered, what evidence you have..."
              className="text-sm resize-none min-h-[100px]"
            />
          </div>

          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your complete order record — every message, revision round, defect report, and tech pack version — is automatically attached as evidence when you file. Sourcery does not mediate disputes but provides the documented record that gives you leverage.
            </p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={submit} disabled={submitting} className="text-xs">
              {submitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
              File dispute
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)} className="text-xs">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
