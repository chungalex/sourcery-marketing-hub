import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, Download, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ComplianceExportProps {
  orderId: string;
  orderNumber: string;
}

export function ComplianceExport({ orderId, orderNumber }: ComplianceExportProps) {
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      // Gather all compliance data for this order
      const [orderRes, photosRes, qcRes, techPackRes, shipdocsRes] = await Promise.all([
        (supabase as any).from("orders").select("*, factories(name, city, country, certifications, is_verified), order_milestones(*)").eq("id", orderId).single(),
        (supabase as any).from("production_photos").select("*").eq("order_id", orderId),
        (supabase as any).from("defect_reports").select("*").eq("order_id", orderId),
        (supabase as any).from("tech_pack_versions").select("*").eq("order_id", orderId),
        (supabase as any).from("shipment_docs").select("*").eq("order_id", orderId),
      ]);

      const order = orderRes.data;
      if (!order) { toast.error("Order not found"); setLoading(false); return; }

      const specs = order.specifications as any;
      const factory = order.factories;
      const milestones = order.order_milestones || [];
      const photos = photosRes.data || [];
      const qcReports = qcRes.data || [];
      const techPacks = techPackRes.data || [];
      const shipDocs = shipdocsRes.data || [];

      // Generate compliance report as downloadable text
      const report = [
        "SOURCERY SUPPLY CHAIN COMPLIANCE REPORT",
        "=".repeat(50),
        `Generated: ${format(new Date(), "MMMM d, yyyy HH:mm")}`,
        `Order: ${order.order_number}`,
        `Product: ${specs?.product_name || "—"}`,
        "",
        "MANUFACTURER INFORMATION",
        "-".repeat(30),
        `Factory name: ${factory?.name || "—"}`,
        `Location: ${[factory?.city, factory?.country].filter(Boolean).join(", ") || "—"}`,
        `Verified on Sourcery: ${factory?.is_verified ? "Yes" : "No"}`,
        `Certifications: ${(factory?.certifications || []).join(", ") || "None on file"}`,
        "",
        "ORDER DETAILS",
        "-".repeat(30),
        `Order placed: ${format(new Date(order.created_at), "MMMM d, yyyy")}`,
        `Quantity: ${order.quantity?.toLocaleString()} units`,
        `Category: ${specs?.product_category || "—"}`,
        `Material: ${specs?.fabric_composition || "—"}`,
        `Delivery window: ${order.delivery_window_end ? format(new Date(order.delivery_window_end), "MMMM d, yyyy") : "—"}`,
        "",
        "PAYMENT TRAIL",
        "-".repeat(30),
        ...milestones.map((m: any) =>
          `${m.label}: ${m.status.toUpperCase()} — ${m.amount ? `${order.currency} ${m.amount?.toLocaleString()}` : "—"}`
        ),
        "",
        "QUALITY CONTROL",
        "-".repeat(30),
        `QC standard: ${specs?.aql_standard || specs?.qc_option || "—"}`,
        `QC reports: ${qcReports.length} report${qcReports.length !== 1 ? "s" : ""} on file`,
        `Defect reports: ${qcReports.length}`,
        "",
        "PRODUCTION DOCUMENTATION",
        "-".repeat(30),
        `Tech pack versions: ${techPacks.length}`,
        `Production photos: ${photos.length} (${photos.map((p: any) => p.stage).filter((v, i, a) => a.indexOf(v) === i).join(", ") || "—"})`,
        `Shipment documents: ${shipDocs.length} (${shipDocs.map((d: any) => d.doc_type.replace(/_/g, " ")).join(", ") || "—"})`,
        "",
        "COMPLIANCE NOTES",
        "-".repeat(30),
        "This report was generated from documented production data on Sourcery.",
        "All order actions, approvals, and payments are timestamped and immutable.",
        "This documentation supports compliance with:",
        "- US Uyghur Forced Labor Prevention Act (UFLPA) supply chain transparency requirements",
        "- EU Corporate Sustainability Due Diligence Directive (CSDDD)",
        "- UK Modern Slavery Act supply chain transparency statements",
        "",
        "For full order documentation including message history, revision rounds,",
        `and QC reports, access this order on Sourcery: /orders/${orderId}`,
      ].join("\n");

      // Download as text file
      const blob = new Blob([report], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sourcery-compliance-${order.order_number}-${format(new Date(), "yyyy-MM-dd")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Compliance report downloaded");
    } catch (e: any) {
      toast.error("Failed to generate report");
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground mb-0.5">Supply chain compliance export</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Export a compliance report for this order — manufacturer details, certifications, payment trail, QC records, and production documentation. Supports UFLPA, EU CSDDD, and UK Modern Slavery Act requirements.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 w-full"
        onClick={generateReport}
        disabled={loading}
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
        Download compliance report
      </Button>
    </div>
  );
}
