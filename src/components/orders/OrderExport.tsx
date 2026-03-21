import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FileDown, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface OrderExportProps {
  order: {
    id: string;
    order_number: string;
    status: string;
    quantity: number;
    unit_price: number;
    currency: string;
    specifications: string | null;
    created_at: string;
    factories: { name: string; country: string; city: string | null } | null;
  };
  isPro?: boolean;
}

export function OrderExport({ order, isPro = false }: OrderExportProps) {
  const { user } = useAuth();
  const [brandName, setBrandName] = useState("");
  const [showBrandInput, setShowBrandInput] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      // Fetch full order data
      const { data: messages } = await supabase
        .from("messages" as never)
        .select("sender_role, content, created_at")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true })
        .limit(50);

      const { data: revisions } = await supabase
        .from("revision_rounds" as never)
        .select("round_number, status, notes, created_at")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true });

      const { data: defects } = await supabase
        .from("defect_reports" as never)
        .select("defect_type, severity, quantity_affected, notes, created_at")
        .eq("order_id", order.id);

      const displayBrand = isPro && brandName.trim() ? brandName.trim() : "Sourcery";
      const currSym = order.currency === "EUR" ? "€" : order.currency === "GBP" ? "£" : order.currency === "CNY" ? "¥" : "$";
      const total = order.quantity * order.unit_price;

      // Build HTML document for print-to-PDF
      const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Order ${order.order_number} — ${displayBrand}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; background: white; padding: 40px; font-size: 13px; line-height: 1.5; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #111; margin-bottom: 32px; }
  .brand { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
  .doc-type { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }
  .meta { text-align: right; }
  .meta p { font-size: 11px; color: #444; }
  .meta .order-num { font-size: 14px; font-weight: 600; color: #111; }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #666; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; margin-bottom: 12px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
  .field label { font-size: 10px; color: #888; display: block; margin-bottom: 1px; }
  .field value, .field p { font-size: 13px; color: #111; font-weight: 500; }
  .message-row { padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
  .message-row:last-child { border-bottom: none; }
  .msg-meta { font-size: 10px; color: #888; margin-bottom: 2px; }
  .msg-content { font-size: 12px; color: #333; }
  .revision-row { padding: 6px 10px; background: #f8f8f8; border-radius: 4px; margin-bottom: 4px; }
  .defect-row { padding: 6px 10px; background: #fff5f5; border-radius: 4px; margin-bottom: 4px; border-left: 3px solid #f87171; }
  .status { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; background: #f0fdf4; color: #16a34a; border: 1px solid #86efac; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; }
  .footer p { font-size: 10px; color: #aaa; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="brand">${displayBrand}</div>
    <div class="doc-type">Production Order — Audit Trail</div>
  </div>
  <div class="meta">
    <div class="order-num">${order.order_number}</div>
    <p>Generated ${format(new Date(), "MMM d, yyyy")}</p>
    <p><span class="status">${order.status.replace(/_/g, " ")}</span></p>
  </div>
</div>

<div class="section">
  <div class="section-title">Order details</div>
  <div class="grid">
    <div class="field"><label>Factory</label><p>${order.factories?.name || "—"}</p></div>
    <div class="field"><label>Location</label><p>${order.factories?.city ? order.factories.city + ", " : ""}${order.factories?.country || "—"}</p></div>
    <div class="field"><label>Quantity</label><p>${order.quantity.toLocaleString()} units</p></div>
    <div class="field"><label>Unit price</label><p>${currSym}${order.unit_price.toFixed(2)}</p></div>
    <div class="field"><label>Total value</label><p>${currSym}${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></div>
    <div class="field"><label>Created</label><p>${format(new Date(order.created_at), "MMM d, yyyy")}</p></div>
  </div>
  ${order.specifications ? `<div style="margin-top:12px"><div class="field"><label>Specifications</label><p style="font-weight:400;color:#444;white-space:pre-wrap">${order.specifications}</p></div></div>` : ""}
</div>

${(revisions as any[])?.length > 0 ? `
<div class="section">
  <div class="section-title">Revision rounds (${(revisions as any[]).length})</div>
  ${(revisions as any[]).map((r: any) => `
    <div class="revision-row">
      <strong>Round ${r.round_number}</strong> — ${r.status} — ${format(new Date(r.created_at), "MMM d, yyyy")}
      ${r.notes ? `<div style="color:#555;font-size:12px;margin-top:2px">${r.notes}</div>` : ""}
    </div>`).join("")}
</div>` : ""}

${(defects as any[])?.length > 0 ? `
<div class="section">
  <div class="section-title">Defect reports (${(defects as any[]).length})</div>
  ${(defects as any[]).map((d: any) => `
    <div class="defect-row">
      <strong>${d.defect_type}</strong> — ${d.severity} severity — ${d.quantity_affected} units — ${format(new Date(d.created_at), "MMM d, yyyy")}
      ${d.notes ? `<div style="color:#555;font-size:12px;margin-top:2px">${d.notes}</div>` : ""}
    </div>`).join("")}
</div>` : ""}

${(messages as any[])?.length > 0 ? `
<div class="section">
  <div class="section-title">Message log (${(messages as any[]).length} messages)</div>
  ${(messages as any[]).map((m: any) => `
    <div class="message-row">
      <div class="msg-meta">${m.sender_role.toUpperCase()} — ${format(new Date(m.created_at), "MMM d, yyyy 'at' h:mm a")}</div>
      <div class="msg-content">${m.content}</div>
    </div>`).join("")}
</div>` : ""}

<div class="footer">
  <p>This document was generated from ${isPro && brandName ? brandName : "Sourcery"} — production management platform.</p>
  <p>Order ${order.order_number} — ${format(new Date(), "MMM d, yyyy HH:mm")}</p>
</div>
</body>
</html>`;

      // Open in new window for print-to-PDF
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => win.print(), 500);
      }
      toast.success("PDF opened — use Print → Save as PDF");
    } catch {
      toast.error("Could not generate export.");
    }
    setGenerating(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <FileDown className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Export order</h3>
      </div>

      {isPro && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">White-label — export under your brand name</p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Your brand name (optional)"
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              className="text-sm h-8"
            />
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-3">
        Full audit trail — every spec, revision, message, defect report, and milestone.
        {isPro && " Your brand name on every page."}
      </p>

      <Button size="sm" variant="outline" onClick={generatePDF} disabled={generating} className="w-full text-xs gap-1.5">
        {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
        {generating ? "Generating..." : "Export as PDF"}
      </Button>

      {!isPro && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          White-label exports on <a href="/pricing" className="text-primary hover:underline">Pro</a>
        </p>
      )}
    </div>
  );
}
