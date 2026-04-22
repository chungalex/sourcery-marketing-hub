import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

interface OrderExportPDFProps {
  orderId: string;
  orderNumber: string;
}

function buildPOHtml(order: any): string {
  const specs = (order.specifications as any) || {};
  const milestones = ((order.order_milestones || []) as any[]).sort((a, b) => a.sequence_order - b.sequence_order);
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency || "USD" }).format(n);
  const today = format(new Date(), "MMMM d, yyyy");
  const issued = format(new Date(order.created_at), "MMMM d, yyyy");

  const milestonesRows = milestones.map((m: any, i: number) => (
    "<tr><td>" + (i + 1) + "</td><td>" + m.label + "</td><td>" + m.percentage + "%</td><td>" + fmt(m.amount || 0) + "</td><td>" + m.status + "</td></tr>"
  )).join("");

  const totalVal = order.total_amount || order.quantity * order.unit_price;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Purchase Order ${order.order_number}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,system-ui,sans-serif;color:#1a1a1a;padding:48px;max-width:820px;margin:0 auto;font-size:13px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:24px;border-bottom:2px solid #1a1a1a}
.po-num{font-size:26px;font-weight:700}
.doc-type{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:3px}
.brand{font-size:20px;font-weight:700}
.section{margin-bottom:28px}
.sec-title{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:10px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:32px}
.field{margin-bottom:8px}
.fl{font-size:10px;color:#999;margin-bottom:2px}
.fv{font-size:13px;font-weight:500}
table{width:100%;border-collapse:collapse}
th{background:#f5f5f5;padding:8px 10px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#666}
td{padding:9px 10px;border-bottom:1px solid #eee;font-size:13px}
.tot td{font-weight:700;font-size:14px;border-top:2px solid #1a1a1a;border-bottom:none}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:10px;color:#aaa;line-height:1.6}
@media print{body{padding:24px}}
</style>
</head>
<body>
<div class="hdr">
  <div>
    <div class="doc-type">Purchase Order</div>
    <div class="po-num">${order.order_number}</div>
    <div style="font-size:12px;color:#888;margin-top:4px">Issued ${issued}</div>
  </div>
  <div style="text-align:right">
    <div class="brand">Sourcery</div>
    <div style="font-size:11px;color:#888;margin-top:3px">sourcery.so</div>
  </div>
</div>

<div class="section two">
  <div>
    <div class="sec-title">Buyer</div>
    ${order.brands?.brand_name ? `<div class="fv">${order.brands.brand_name}</div>` : ""}
    ${order.brands?.email ? `<div style="color:#666">${order.brands.email}</div>` : ""}
  </div>
  <div>
    <div class="sec-title">Manufacturer</div>
    <div class="fv">${order.factories?.name || "—"}</div>
    ${order.factories?.city ? `<div style="color:#666">${[order.factories.city, order.factories.country].filter(Boolean).join(", ")}</div>` : ""}
    ${order.factories?.email ? `<div style="color:#666">${order.factories.email}</div>` : ""}
    ${order.factories?.website ? `<div style="color:#666">${order.factories.website}</div>` : ""}
  </div>
</div>

<div class="section">
  <div class="sec-title">Order details</div>
  <div class="two">
    <div>
      ${specs.product_name ? `<div class="field"><div class="fl">Product</div><div class="fv">${specs.product_name}</div></div>` : ""}
      ${specs.collection ? `<div class="field"><div class="fl">Collection / Season</div><div class="fv">${specs.collection}</div></div>` : ""}
      ${specs.product_category ? `<div class="field"><div class="fl">Category</div><div class="fv">${specs.product_category}</div></div>` : ""}
      ${specs.fabric_composition ? `<div class="field"><div class="fl">Fabric</div><div class="fv">${specs.fabric_composition}</div></div>` : ""}
      ${specs.colourway_count ? `<div class="field"><div class="fl">Colourways</div><div class="fv">${specs.colourway_count}</div></div>` : ""}
      ${specs.size_range ? `<div class="field"><div class="fl">Size range</div><div class="fv">${specs.size_range}</div></div>` : ""}
    </div>
    <div>
      <div class="field"><div class="fl">Quantity</div><div class="fv" style="font-size:16px">${(order.quantity || 0).toLocaleString()} units</div></div>
      <div class="field"><div class="fl">Unit price</div><div class="fv">${fmt(order.unit_price || 0)}</div></div>
      <div class="field"><div class="fl">Total order value</div><div class="fv" style="font-size:18px;font-weight:700">${fmt(totalVal)}</div></div>
      ${order.incoterms ? `<div class="field"><div class="fl">Incoterms</div><div class="fv">${order.incoterms}</div></div>` : ""}
      ${order.currency && order.currency !== "USD" ? `<div class="field"><div class="fl">Currency</div><div class="fv">${order.currency}</div></div>` : ""}
    </div>
  </div>
</div>

${order.delivery_window_start || order.delivery_window_end ? `<div class="section">
  <div class="sec-title">Delivery window</div>
  <div class="fv">${order.delivery_window_start ? format(new Date(order.delivery_window_start), "MMMM d, yyyy") : "—"}${order.delivery_window_end ? " → " + format(new Date(order.delivery_window_end), "MMMM d, yyyy") : ""}</div>
</div>` : ""}

${milestones.length > 0 ? `<div class="section">
  <div class="sec-title">Payment milestones</div>
  <table>
    <thead><tr><th>#</th><th>Milestone</th><th>%</th><th>Amount</th><th>Status</th></tr></thead>
    <tbody>
      ${milestonesRows}
      <tr class="tot"><td colspan="3">Total</td><td>${fmt(totalVal)}</td><td></td></tr>
    </tbody>
  </table>
</div>` : ""}

${specs.notes ? `<div class="section"><div class="sec-title">Notes & specifications</div><div style="line-height:1.6;color:#444">${specs.notes}</div></div>` : ""}

<div style="margin-top:32px;padding:16px;background:#f9f9f9;border-radius:8px;font-size:12px;color:#666">
  <strong>Terms:</strong> This purchase order is subject to the specifications, quality standards, and milestone payment conditions agreed on Sourcery. All deliverables must meet AQL ${(specs as any)?.qc_standard?.aql || "2.5"} inspection standard. Final payment releases after successful QC inspection.
</div>

<div class="footer">
  Issued and managed on Sourcery (sourcery.so) — production intelligence platform. Order ID: ${order.id} · Generated ${today}
</div>
</body>
</html>`;
}

export function OrderExportPDF({ orderId, orderNumber }: OrderExportPDFProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const { data: order } = await (supabase as any)
        .from("orders")
        .select("*, factories(name, city, country, email, website), order_milestones(label, percentage, amount, status, sequence_order), brands:profiles!buyer_id(brand_name, email)")
        .eq("id", orderId)
        .single();

      if (!order) { toast.error("Could not load order"); setLoading(false); return; }

      const html = buildPOHtml(order);
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 500);
        toast.success("PO opened — use 'Save as PDF' in the print dialog");
      } else {
        toast.error("Popup blocked — allow popups for this site");
      }
    } catch (e) {
      console.error("Export error:", e);
      toast.error("Export failed");
    }
    setLoading(false);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading} className="gap-1.5">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
      Export PO as PDF
    </Button>
  );
}
