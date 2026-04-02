import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle, AlertCircle, Package, FileText, Shield, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusGuideProps {
  status: string;
  role: "brand" | "factory";
  orderNumber?: string;
  factoryName?: string;
  className?: string;
}

const brandGuide: Record<string, {
  icon: React.ElementType;
  color: string;
  title: string;
  description: string;
  action?: string;
  actionHref?: string;
}> = {
  draft: {
    icon: FileText,
    color: "bg-secondary border-border text-foreground",
    title: "Order saved as draft",
    description: "Your order has been saved. Review the details and issue the PO to send it to the factory for review. Nothing is committed until you issue the PO.",
    action: "Issue the PO",
  },
  po_issued: {
    icon: Clock,
    color: "bg-amber-500/5 border-amber-400/30 text-amber-700",
    title: "Waiting for the factory to accept",
    description: "Your PO has been sent to the factory. They typically respond within 24–48 hours. You'll be notified when they accept or have questions.",
  },
  po_accepted: {
    icon: CheckCircle,
    color: "bg-blue-500/5 border-blue-400/30 text-blue-700",
    title: "PO accepted — deposit milestone now active",
    description: "The factory has accepted your order. Your deposit milestone is now ready to release. Production begins once the factory receives confirmation of payment.",
    action: "Release deposit",
  },
  sample_sent: {
    icon: Package,
    color: "bg-amber-500/5 border-amber-400/30 text-amber-700",
    title: "Sample submitted — review required",
    description: "The factory has submitted a sample for your review. Check the measurements against your spec sheet and inspect construction quality before approving. Bulk cannot begin until you formally approve.",
    action: "Review sample",
  },
  sample_approved: {
    icon: CheckCircle,
    color: "bg-green-500/5 border-green-500/20 text-green-700",
    title: "Sample approved — bulk production can begin",
    description: "Your sample approval is on record. The factory can now begin bulk production. Release the bulk payment milestone to confirm.",
    action: "Release bulk milestone",
  },
  sample_revision: {
    icon: AlertCircle,
    color: "bg-amber-500/5 border-amber-400/30 text-amber-700",
    title: "Revision requested — waiting for factory",
    description: "You've requested changes. The factory must acknowledge the revision before production continues. You'll be notified when they respond.",
  },
  in_production: {
    icon: Clock,
    color: "bg-blue-500/5 border-blue-400/30 text-blue-700",
    title: "In production",
    description: "Bulk production is underway. Keep an eye on your delivery window. If the factory sends any updates or has questions, they'll appear in the order messages.",
  },
  qc_uploaded: {
    icon: Shield,
    color: "bg-amber-500/5 border-amber-400/30 text-amber-700",
    title: "QC report ready for review",
    description: "The inspection result has been uploaded. Review it carefully before releasing the final payment. Once you release the final milestone, the order closes.",
    action: "Review QC report",
  },
  qc_pass: {
    icon: CheckCircle,
    color: "bg-green-500/5 border-green-500/20 text-green-700",
    title: "QC passed — final payment ready",
    description: "Inspection passed. Release the final payment milestone to complete the order. The full order record will be permanently archived.",
    action: "Release final payment",
  },
  qc_fail: {
    icon: AlertCircle,
    color: "bg-rose-500/5 border-rose-400/30 text-rose-700",
    title: "QC failed — do not release final payment",
    description: "The inspection found issues exceeding your AQL threshold. Do not release the final payment. File a defect report and open a formal resolution process. Your full order record is your leverage.",
    action: "File defect report",
  },
  ready_to_ship: {
    icon: Truck,
    color: "bg-blue-500/5 border-blue-400/30 text-blue-700",
    title: "Ready to ship",
    description: "Goods are ready. Confirm freight arrangements with your forwarder. Once shipped, ask the factory to mark the order as shipped with tracking details.",
  },
  shipped: {
    icon: Truck,
    color: "bg-blue-500/5 border-blue-400/30 text-blue-700",
    title: "Shipped — track your cargo",
    description: "Goods are in transit. Monitor cargo status and prepare your customs documents. When goods arrive and you've confirmed the shipment, close the order.",
  },
};

const factoryGuide: Record<string, {
  icon: React.ElementType;
  color: string;
  title: string;
  description: string;
}> = {
  po_issued: {
    icon: Package,
    color: "bg-amber-500/5 border-amber-400/30 text-amber-700",
    title: "New order to review",
    description: "You have a new PO from your brand. Review the specs, quantity, pricing, and delivery window carefully before accepting. If anything needs clarification, message the brand before accepting.",
  },
  po_accepted: {
    icon: CheckCircle,
    color: "bg-green-500/5 border-green-500/20 text-green-700",
    title: "Order accepted",
    description: "You've accepted the order. The brand will release the deposit milestone. Once you receive payment confirmation, begin material sourcing and production prep.",
  },
  sample_sent: {
    icon: Clock,
    color: "bg-blue-500/5 border-blue-400/30 text-blue-700",
    title: "Sample submitted — waiting for approval",
    description: "Your sample has been submitted for review. The brand typically responds within 5–7 business days. Bulk production cannot begin until they formally approve.",
  },
  sample_revision: {
    icon: AlertCircle,
    color: "bg-amber-500/5 border-amber-400/30 text-amber-700",
    title: "Revision requested",
    description: "The brand has requested changes to the sample. Read their revision notes carefully. Acknowledge the revision to confirm you've received and understood the changes, then produce a revised sample.",
  },
  in_production: {
    icon: Package,
    color: "bg-blue-500/5 border-blue-400/30 text-blue-700",
    title: "In bulk production",
    description: "Bulk production is underway. Communicate proactively if the timeline changes. The brand cannot release the final payment until QC is complete.",
  },
};

export function OrderStatusGuide({ status, role, orderNumber, factoryName, className }: StatusGuideProps) {
  const guide = role === "brand" ? brandGuide[status] : factoryGuide[status];
  if (!guide) return null;

  const Icon = guide.icon;

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-xl border",
      guide.color,
      className
    )}>
      <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold mb-1">{guide.title}</p>
        <p className="text-xs leading-relaxed opacity-80">{guide.description}</p>
      </div>
    </div>
  );
}
