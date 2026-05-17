import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { shouldShow, ORDER_STAGE_CONFIG, type OrderStatus } from "@/lib/orderStageConfig";
import { OrderStatusGuide } from "@/components/orders/OrderStatusGuide";
import { useAuth } from "@/hooks/useAuth";
import { useFactoryMembership } from "@/hooks/useFactoryMembership";
import { PlatformMessaging } from "@/components/platform/PlatformMessaging";
import { OrderChatSummary } from "@/components/orders/OrderChatSummary";
import { DisputeFiling } from "@/components/orders/DisputeFiling";
import { ReorderIntelligence } from "@/components/orders/ReorderIntelligence";
import { OrderExport } from "@/components/orders/OrderExport";
import { FactoryReview } from "@/components/trust/FactoryReview";
import { SampleReviewPanel } from "@/components/orders/SampleReviewPanel";
import { RevisionRounds } from "@/components/orders/RevisionRounds";
import { TechPackVersions } from "@/components/orders/TechPackVersions";
import { DefectReports } from "@/components/orders/DefectReports";
import { ReorderButton } from "@/components/orders/ReorderButton";
import { OrderSKUs } from "@/components/orders/OrderSKUs";
import { ProductionPhotoLog } from "@/components/orders/ProductionPhotoLog";
import { TimezoneApproval } from "@/components/orders/TimezoneApproval";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { OrderExportPDF } from "@/components/orders/OrderExportPDF";
import { ProductionCountdown } from "@/components/orders/ProductionCountdown";
import { ProactiveGuidance } from "@/components/platform/ProactiveGuidance";
import { MessageDrafter } from "@/components/platform/MessageDrafter";
import { ChangeOrderFlow } from "@/components/orders/ChangeOrderFlow";
import { SampleAnnotation } from "@/components/orders/SampleAnnotation";
import { TechPackReviewer } from "@/components/orders/TechPackReviewer";
import { BillOfMaterials } from "@/components/orders/BillOfMaterials";
import { ShipmentTracker } from "@/components/orders/ShipmentTracker";
import { FreightChecklist } from "@/components/platform/FreightChecklist";
import { SafetyStockCalculator } from "@/components/orders/SafetyStockCalculator";
import { ShipmentDocs } from "@/components/orders/ShipmentDocs";
import { SupplyChainCompliance } from "@/components/orders/SupplyChainCompliance";
import { ComplianceExport } from "@/components/orders/ComplianceExport";
import { ProductionAssistant } from "@/components/va/ProductionAssistant";
import { toast } from "sonner";
import {
  ArrowLeft,
  Shield,
  Loader2,
  Package,
  Building2,
  FileText,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  Truck,
  FlaskConical,
} from "lucide-react";
import { format } from "date-fns";

type QCMode = "clewa" | "byo" | "factory_self";

interface OrderData {
  id: string;
  order_number: string;
  status: string;
  quantity: number;
  unit_price: number;
  total_amount: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
  delivery_window_start: string | null;
  delivery_window_end: string | null;
  incoterms: string | null;
  tech_pack_url: string | null;
  bom_url: string | null;
  specifications: Record<string, unknown> | null;
  factories: { id: string; name: string; slug: string } | null;
  order_milestones: {
    id: string;
    label: string;
    percentage: number;
    amount: number;
    status: string;
    sequence_order: number;
    release_condition: string | null;
  }[];
}

// Statuses where QC tab is relevant
const QC_STATUSES = [
  "po_accepted", "sampling", "sample_sent", "sample_revision",
  "sample_approved", "in_production", "qc_scheduled", "qc_uploaded",
  "qc_pass", "qc_fail", "qc_pending", "qc_approved",
  "ready_to_ship", "shipped", "closed",
];

// Statuses where Shipping tab is relevant
const SHIPPING_STATUSES = ["ready_to_ship", "shipped", "closed"];

function getVisibleTabs(status: string) {
  return {
    timeline: status !== "draft" && status !== "cancelled",
    messages: status !== "draft" && status !== "cancelled",
    qc: QC_STATUSES.includes(status),
    shipping: SHIPPING_STATUSES.includes(status),
  };
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { hasFactoryAccess } = useFactoryMembership(user?.id);

  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "overview");

  // Handle Stripe return
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast.success("Payment successful! Milestone released.");
      setSearchParams({ tab: "payments" }, { replace: true });
      setActiveTab("payments");
    } else if (paymentStatus === "cancelled") {
      toast.info("Payment cancelled.");
      setSearchParams({ tab: "payments" }, { replace: true });
      setActiveTab("payments");
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  };

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [issuingPO, setIssuingPO] = useState(false);
  const [payingMilestone, setPayingMilestone] = useState<string | null>(null);

  // Editable fields
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [qcMode, setQcMode] = useState<QCMode>("clewa");
  const [editCurrency, setEditCurrency] = useState("USD");
  const [milestones, setMilestones] = useState<{ label: string; percentage: number }[]>([
    { label: "Deposit", percentage: 30 },
    { label: "Pre-production approval", percentage: 20 },
    { label: "Balance on shipment", percentage: 50 },
  ]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?redirect=/orders/${id}`);
    }
  }, [user, authLoading, navigate, id]);

  // Fetch order
  const loadOrder = async () => {
    if (!user || !id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id, order_number, status, quantity, unit_price,
        total_amount, currency, created_at, updated_at,
        delivery_window_start, delivery_window_end, incoterms,
        tech_pack_url, bom_url, specifications,
        factories (id, name, slug),
        order_milestones (id, label, percentage, amount, status, sequence_order, release_condition)
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Order not found");
      navigate("/dashboard?tab=orders");
      return;
    }

    const orderData = data as unknown as OrderData;
    setOrder(orderData);
    setUnitPrice(orderData.unit_price > 0 ? String(orderData.unit_price) : "");
    setQuantity(String(orderData.quantity));
    setEditCurrency(orderData.currency || "USD");

    const specs = orderData.specifications as Record<string, unknown> | null;
    if (specs?.qc_mode) {
      setQcMode(specs.qc_mode as QCMode);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!user || !id) return;
    loadOrder();
  }, [user, id, navigate]);

  const isDraft = order?.status === "draft";
  const parsedPrice = parseFloat(unitPrice) || 0;
  const parsedQty = parseInt(quantity) || 0;
  const computedTotal = parsedPrice * parsedQty;
  const canIssuePO = isDraft && parsedPrice > 0 && parsedQty > 0;

  const handleSave = async () => {
    if (!order || !isDraft) return;
    setSaving(true);

    const updatedSpecs = {
      ...(order.specifications || {}),
      qc_mode: qcMode,
    };

    const { error } = await supabase
      .from("orders")
      .update({
        unit_price: parsedPrice,
        quantity: parsedQty,
        total_amount: computedTotal,
        specifications: updatedSpecs as unknown as Record<string, never>,
      })
      .eq("id", order.id);

    if (error) {
      toast.error("Failed to save changes");
    } else {
      if (order.order_milestones.length > 0) {
        for (const m of order.order_milestones) {
          const newAmount = computedTotal * (m.percentage / 100);
          await supabase
            .from("order_milestones")
            .update({ amount: newAmount })
            .eq("id", m.id);
        }
      }

      toast.success("Draft saved");
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              unit_price: parsedPrice,
              quantity: parsedQty,
              total_amount: computedTotal,
              specifications: updatedSpecs,
              order_milestones: prev.order_milestones.map((m) => ({
                ...m,
                amount: computedTotal * (m.percentage / 100),
              })),
            }
          : null
      );
    }
    setSaving(false);
  };

  const handleIssuePO = async () => {
    if (!order || !canIssuePO) return;
    await handleSave();
    setIssuingPO(true);

    const { data: { session: _sess } } = await supabase.auth.getSession();
    const { data, error } = await supabase.functions.invoke("order-action", {
      headers: { Authorization: `Bearer ${_sess?.access_token}` },
      body: {
        action: "issue_po",
        order_id: order.id,
        metadata: { qc_mode: qcMode },
      },
    });

    if (error || data?.error) {
      toast.error(data?.error || "Failed to issue PO");
      setIssuingPO(false);
      return;
    }

    toast.success("PO sent. The factory will be notified and can accept or message you with questions.");
    navigate("/dashboard?tab=orders&highlight=" + order.id);
  };

  const handlePayMilestone = async (milestoneId: string) => {
    if (!order) return;
    setPayingMilestone(milestoneId);

    const { data, error } = await supabase.functions.invoke("stripe-checkout", {
      body: { milestone_id: milestoneId, order_id: order.id },
    });

    if (error || data?.error) {
      toast.error(data?.error || "Failed to create payment session");
      setPayingMilestone(null);
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    } else {
      toast.error("No checkout URL returned");
      setPayingMilestone(null);
    }
  };

  if (loadError) {
    return (
      <Layout>
        <section className="section-padding min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{loadError}</p>
            <Link to="/dashboard" className="text-sm text-primary hover:underline">Back to dashboard →</Link>
          </div>
        </section>
      </Layout>
    );
  }

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-wide max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  const specs = order.specifications as Record<string, unknown> | null;
  const visible = getVisibleTabs(order.status);

  return (
    <Layout>
      <SEO
        title={`${(specs?.product_name as string) || order.order_number} | Clewa`}
        description="Track specs, revisions, milestones, and QC for this order."
      />

      <section className="section-padding">
        <div className="container-wide max-w-5xl mx-auto">

          {/* Back + duplicate */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard?tab=orders")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            {["closed", "shipped"].includes(order.status) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams({
                    factory: order.factories?.id || "",
                    duplicate: order.id,
                  });
                  navigate(`/orders/create?${params.toString()}`);
                }}
                className="gap-2"
              >
                <Package className="h-3.5 w-3.5" />
                Duplicate order
              </Button>
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* ── Order header ── */}
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div>
                <div className="font-mono text-xs text-muted-foreground mb-1">{order.order_number}</div>
                <h1 className="text-2xl font-bold text-foreground mb-2 leading-tight">
                  {(specs?.product_name as string) || order.factories?.name || "Order"}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {order.factories ? (
                      <Link to={`/directory/${order.factories.slug}`} className="hover:text-primary transition-colors">
                        {order.factories.name}
                      </Link>
                    ) : "Factory"}
                  </div>
                  {(specs?.product_category as string) && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground capitalize">
                      {(specs.product_category as string).replace(/_/g, " ")}
                    </span>
                  )}
                  {(specs?.collection as string) && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
                      {specs.collection as string}
                    </span>
                  )}
                  <span className="text-muted-foreground/40 text-sm">·</span>
                  <span className="text-sm text-muted-foreground">{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={order.status} />
                <div className="text-xl font-bold text-foreground mt-2">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency, maximumFractionDigits: 0 }).format(order.total_amount || order.quantity * order.unit_price)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.quantity.toLocaleString()} units · {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(order.unit_price)}/unit
                </div>
              </div>
            </div>

            {/* ── Needs attention banner (always visible) ── */}
            {(() => {
              const attentionStatuses: Record<string, string> = {
                draft: "Draft order — set pricing and quantity, then issue the PO when you're ready.",
                po_accepted: "The factory has accepted the PO. Review and approve the sample before bulk production can begin.",
                sample_sent: "Sample submitted by the factory. Review and approve or request a revision.",
                sample_revision: "Revision requested. Awaiting updated sample from the factory.",
                qc_uploaded: "QC report uploaded. Review and release the final payment milestone.",
                qc_fail: "QC failed. File a defect report or request a remedy before releasing payment.",
                disputed: "This order is in dispute. Submit your evidence through the platform.",
              };
              const msg = attentionStatuses[order.status];
              if (!msg) return null;
              return (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 mb-4">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{msg}</p>
                </div>
              );
            })()}

            {/* ── AI proactive guidance (always visible when active) ── */}
            {order.status !== "closed" && order.status !== "cancelled" && order.status !== "draft" && (
              <ProactiveGuidance
                orderId={order.id}
                orderStatus={order.status}
                deliveryWindowEnd={order.delivery_window_end}
                factoryName={order.factories?.name}
                qcStandard={(order.specifications as any)?.qc_standard?.aql}
                orderQuantity={order.quantity}
                orderUpdatedAt={order.updated_at}
                orderCreatedAt={order.created_at}
                orderSpecifications={order.specifications}
              />
            )}

            {/* ── Tab navigation ── */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
              <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/50 p-1 rounded-xl mb-6 w-full justify-start">
                <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Overview
                </TabsTrigger>
                {visible.timeline && (
                  <TabsTrigger value="timeline" className="gap-1.5 text-xs sm:text-sm">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Timeline
                  </TabsTrigger>
                )}
                {visible.messages && (
                  <TabsTrigger value="messages" className="gap-1.5 text-xs sm:text-sm">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Messages
                  </TabsTrigger>
                )}
                <TabsTrigger value="documents" className="gap-1.5 text-xs sm:text-sm">
                  <FileText className="h-3.5 w-3.5" />
                  Documents
                </TabsTrigger>
                {visible.qc && (
                  <TabsTrigger value="qc" className="gap-1.5 text-xs sm:text-sm">
                    <FlaskConical className="h-3.5 w-3.5" />
                    QC
                  </TabsTrigger>
                )}
                <TabsTrigger value="payments" className="gap-1.5 text-xs sm:text-sm">
                  <CreditCard className="h-3.5 w-3.5" />
                  Payments
                </TabsTrigger>
                {visible.shipping && (
                  <TabsTrigger value="shipping" className="gap-1.5 text-xs sm:text-sm">
                    <Truck className="h-3.5 w-3.5" />
                    Shipping
                  </TabsTrigger>
                )}
              </TabsList>

              {/* ══════════════════════════════════════════════
                  OVERVIEW TAB
              ══════════════════════════════════════════════ */}
              <TabsContent value="overview" className="space-y-6 mt-0">

                {/* Draft: Issue PO prompts */}
                {isDraft && canIssuePO && (
                  <div className="p-5 rounded-xl bg-primary/5 border-2 border-primary/20 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground mb-0.5">Ready to send this PO?</p>
                      <p className="text-xs text-muted-foreground">Issues the order to {order.factories?.name} for formal acceptance.</p>
                    </div>
                    <Button onClick={handleIssuePO} disabled={issuingPO} className="flex-shrink-0 gap-2">
                      {issuingPO ? <><Loader2 className="h-4 w-4 animate-spin" />Issuing...</> : <>Issue PO</>}
                    </Button>
                  </div>
                )}
                {isDraft && !canIssuePO && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-400/30 flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-700">Set quantity and unit price to issue the PO</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Edit the fields below, then come back to issue.</p>
                    </div>
                  </div>
                )}

                {/* Stage focus */}
                {order.status && ORDER_STAGE_CONFIG[order.status as OrderStatus] && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide mr-2">
                          {ORDER_STAGE_CONFIG[order.status as OrderStatus].label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {ORDER_STAGE_CONFIG[order.status as OrderStatus].focus}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Production countdown */}
                {order.delivery_window_end && !["draft", "closed", "cancelled"].includes(order.status) && (
                  <ProductionCountdown
                    deliveryDate={order.delivery_window_end}
                    orderCreatedAt={order.created_at}
                    orderStatus={order.status}
                    leadTimeWeeks={16}
                  />
                )}

                {/* Production timeline (deadline backtrack) */}
                {order.delivery_window_end && !["closed", "cancelled"].includes(order.status) && (() => {
                  const delivery = new Date(order.delivery_window_end);
                  const today = new Date();
                  const daysUntilDelivery = Math.floor((delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const shipDate = new Date(delivery); shipDate.setDate(shipDate.getDate() - 7);
                  const qcDate = new Date(shipDate); qcDate.setDate(qcDate.getDate() - 7);
                  const bulkStartDate = new Date(qcDate); bulkStartDate.setDate(bulkStartDate.getDate() - 28);
                  const sampleApprovalDate = new Date(bulkStartDate); sampleApprovalDate.setDate(sampleApprovalDate.getDate() - 7);
                  const poIssuedDate = new Date(sampleApprovalDate); poIssuedDate.setDate(poIssuedDate.getDate() - 21);
                  const isLate = daysUntilDelivery < 0;
                  const isTight = daysUntilDelivery < 60;

                  return (
                    <div className={`p-4 rounded-xl border ${isLate ? "bg-rose-500/5 border-rose-400/30" : isTight ? "bg-amber-500/5 border-amber-400/30" : "bg-secondary/30 border-border"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Production timeline</p>
                        <span className={`text-xs font-medium ${isLate ? "text-rose-600" : isTight ? "text-amber-600" : "text-muted-foreground"}`}>
                          {isLate ? `${Math.abs(daysUntilDelivery)} days overdue` : `${daysUntilDelivery} days to delivery`}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          { label: "Issue PO", date: poIssuedDate, status: ["po_issued","po_accepted","sample_sent","sample_approved","in_production","qc_scheduled","qc_uploaded","qc_pass","ready_to_ship","shipped"].includes(order.status) },
                          { label: "Sample approval", date: sampleApprovalDate, status: ["sample_approved","in_production","qc_scheduled","qc_uploaded","qc_pass","ready_to_ship","shipped"].includes(order.status) },
                          { label: "Bulk production start", date: bulkStartDate, status: ["in_production","qc_scheduled","qc_uploaded","qc_pass","ready_to_ship","shipped"].includes(order.status) },
                          { label: "QC inspection", date: qcDate, status: ["qc_pass","ready_to_ship","shipped"].includes(order.status) },
                          { label: "Ship goods", date: shipDate, status: ["shipped"].includes(order.status) },
                          { label: "Delivery", date: delivery, status: false },
                        ].map(({ label, date, status: done }) => {
                          const isPast = date < today;
                          const isNext = !done && date >= today;
                          return (
                            <div key={label} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${done ? "bg-green-500" : isNext ? "bg-amber-500 animate-pulse" : isPast ? "bg-rose-400" : "bg-muted-foreground/30"}`} />
                                <span className={done ? "text-muted-foreground line-through" : "text-foreground"}>{label}</span>
                              </div>
                              <span className={`font-medium ${isPast && !done ? "text-rose-600" : "text-muted-foreground"}`}>
                                {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                {isPast && !done && " — overdue"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Order details card */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Order Details</h2>
                    {isDraft && <Badge variant="outline" className="ml-auto text-xs">Editable</Badge>}
                  </div>

                  {specs?.product_description && (
                    <div className="bg-muted/50 border border-border rounded-lg p-3">
                      <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">From Inquiry</div>
                      <p className="text-sm text-foreground">{String(specs.product_description)}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Quantity</Label>
                      {isDraft ? (
                        <Input type="number" value={parsedQty} onChange={e => setQuantity(e.target.value)} min={1} className="text-sm" />
                      ) : (
                        <p className="text-sm font-medium text-foreground">{order.quantity.toLocaleString()} units</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Unit price</Label>
                      {isDraft ? (
                        <div className="flex gap-2">
                          <Input type="number" value={parsedPrice} onChange={e => setUnitPrice(e.target.value)} min={0} step={0.01} className="text-sm" />
                          <Select value={editCurrency} onValueChange={setEditCurrency}>
                            <SelectTrigger className="w-24 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {["USD","EUR","GBP","VND","SGD","HKD"].map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-foreground">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(order.unit_price)}
                        </p>
                      )}
                    </div>
                  </div>

                  {parsedQty > 0 && parsedPrice > 0 && (
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Order total</span>
                      <span className="text-sm font-semibold text-foreground">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: editCurrency }).format(parsedQty * parsedPrice)}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border text-sm">
                    {order.delivery_window_end && (
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery by</p>
                        <p className="font-medium text-foreground">{format(new Date(order.delivery_window_end), "MMM d, yyyy")}</p>
                      </div>
                    )}
                    {order.incoterms && (
                      <div>
                        <p className="text-xs text-muted-foreground">Incoterms</p>
                        <p className="font-medium text-foreground">{order.incoterms}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="font-medium text-foreground">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
                    </div>
                    {order.factories && (
                      <div>
                        <p className="text-xs text-muted-foreground">Factory</p>
                        <Link to={`/directory/${order.factories.slug}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                          {order.factories.name} <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {isDraft && (
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                        Save changes
                      </Button>
                    </div>
                  )}
                </div>

                {/* Production Assistant */}
                <ProductionAssistant
                  mode="order"
                  orderContext={{
                    orderNumber: order.order_number,
                    status: order.status,
                    factoryName: order.factories?.name,
                    quantity: order.quantity,
                    unitPrice: order.unit_price,
                    currency: order.currency,
                    totalAmount: order.total_amount ?? order.quantity * order.unit_price,
                    milestones: order.order_milestones,
                    specifications: order.specifications ?? undefined,
                  }}
                />

                {/* Closed: post-order actions */}
                {order.status === "closed" && (
                  <div className="space-y-4">
                    <div className="bg-card border border-border rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Share this production record</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Share a public summary with investors, partners, or future factories.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 w-full"
                        onClick={() => {
                          const url = `${window.location.origin}/record/${order.id}`;
                          navigator.clipboard.writeText(url);
                          toast.success("Link copied to clipboard");
                        }}
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Copy shareable link
                      </Button>
                    </div>

                    {shouldShow("SafetyStockCalculator", order.status as OrderStatus) && (
                      <SafetyStockCalculator avgLeadWeeks={14} orderId={order.id} />
                    )}

                    {order.factories && shouldShow("ReorderIntelligence", order.status as OrderStatus) && (
                      <ReorderIntelligence
                        orderId={order.id}
                        factoryId={order.factories.id}
                        factoryName={order.factories.name}
                      />
                    )}

                    {order.factories && (
                      <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <h2 className="text-lg font-semibold text-foreground">Order again</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Pre-fills all specs from this order. Confirm quantity and price before submitting.
                        </p>
                        <ReorderButton
                          order={{
                            id: order.id,
                            order_number: order.order_number,
                            factory_id: order.factories.id,
                            quantity: order.quantity,
                            unit_price: order.unit_price,
                            currency: order.currency,
                            incoterms: null,
                            tech_pack_url: null,
                            bom_url: null,
                            specifications: order.specifications,
                            factories: order.factories,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Draft: bottom Issue PO */}
                {isDraft && (
                  <div className="bg-card border-2 border-primary/20 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-2">Ready to issue the PO?</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Issuing the PO sends this order to the factory for review. Ensure quantity and unit price are set before proceeding.
                    </p>
                    {!canIssuePO && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 mb-4">
                        <AlertCircle className="h-4 w-4" />
                        Set a unit price greater than 0 and confirm quantity to proceed.
                      </div>
                    )}
                    <Button onClick={handleIssuePO} disabled={!canIssuePO || issuingPO}>
                      {issuingPO ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Issue Purchase Order
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* ══════════════════════════════════════════════
                  TIMELINE TAB
              ══════════════════════════════════════════════ */}
              {visible.timeline && (
                <TabsContent value="timeline" className="space-y-6 mt-0">
                  <OrderStatusGuide
                    status={order.status}
                    role="brand"
                    orderNumber={order.order_number}
                    factoryName={order.factories?.name}
                  />
                  <OrderTimeline
                    orderId={order.id}
                    orderCreatedAt={order.created_at}
                  />
                </TabsContent>
              )}

              {/* ══════════════════════════════════════════════
                  MESSAGES TAB
              ══════════════════════════════════════════════ */}
              {visible.messages && (
                <TabsContent value="messages" className="space-y-6 mt-0">
                  <MessageDrafter
                    orderId={order.id}
                    orderStatus={order.status}
                    factoryName={order.factories?.name}
                  />
                  <PlatformMessaging orderId={order.id} />
                  <OrderChatSummary orderId={order.id} />
                  {!["closed", "cancelled"].includes(order.status) && (
                    <TimezoneApproval
                      orderId={order.id}
                      isFactory={false}
                      deliveryDate={order.delivery_window_end || undefined}
                    />
                  )}
                </TabsContent>
              )}

              {/* ══════════════════════════════════════════════
                  DOCUMENTS TAB
              ══════════════════════════════════════════════ */}
              <TabsContent value="documents" className="space-y-6 mt-0">
                {order.status !== "draft" && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <h2 className="text-lg font-semibold text-foreground">Tech Pack</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Every version is preserved. The factory confirms which version they're building from.
                    </p>
                    <TechPackVersions orderId={order.id} isFactory={false} onActionComplete={loadOrder} />
                  </div>
                )}

                {!["closed", "cancelled"].includes(order.status) && (
                  <TechPackReviewer
                    orderId={order.id}
                    techPackUrl={order.tech_pack_url}
                    specifications={order.specifications as any}
                  />
                )}

                <BillOfMaterials orderId={order.id} quantity={order.quantity} />

                <OrderSKUs orderId={order.id} isFactory={false} orderStatus={order.status} />

                {["sampling", "sample_sent", "sample_revision", "sample_approved", "in_production"].includes(order.status) && (
                  <SampleAnnotation orderId={order.id} photoUrl={(order.specifications as any)?.sample_photo_url || ""} />
                )}

                {["sampling", "sample_approved", "in_production", "qc_scheduled", "qc_uploaded", "qc_pass", "qc_fail"].includes(order.status) && (
                  <ChangeOrderFlow orderId={order.id} orderStatus={order.status} onChangeCreated={loadOrder} />
                )}

                {!["draft", "closed", "cancelled"].includes(order.status) && (
                  <ProductionPhotoLog orderId={order.id} isFactory={false} />
                )}

                {["ready_to_ship", "shipped", "closed"].includes(order.status) && (
                  <ShipmentDocs orderId={order.id} />
                )}

                {order.status !== "draft" && (
                  <SupplyChainCompliance orderId={order.id} specifications={order.specifications} />
                )}

                {order.status === "closed" && shouldShow("ComplianceExport", order.status as OrderStatus) && (
                  <ComplianceExport orderId={order.id} orderNumber={order.order_number} />
                )}

                <div className="flex flex-col gap-3">
                  <OrderExportPDF orderId={order.id} orderNumber={order.order_number} />
                  <OrderExport
                    order={{
                      id: order.id,
                      order_number: order.order_number,
                      status: order.status,
                      quantity: order.quantity,
                      unit_price: order.unit_price,
                      currency: order.currency,
                      specifications: order.specifications ? JSON.stringify(order.specifications) : null,
                      created_at: order.created_at,
                      factories: order.factories ? { name: order.factories.name, country: "", city: null } : null,
                    }}
                    isPro={false}
                  />
                </div>
              </TabsContent>

              {/* ══════════════════════════════════════════════
                  QC TAB
              ══════════════════════════════════════════════ */}
              {visible.qc && (
                <TabsContent value="qc" className="space-y-6 mt-0">
                  {["po_accepted", "sampling", "sample_sent", "sample_approved", "sample_revision"].includes(order.status) && (
                    <div className="bg-card border border-border rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <h2 className="text-lg font-semibold text-foreground">Sample Review</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sample must be approved before bulk production can begin.
                      </p>
                      <SampleReviewPanel
                        orderId={order.id}
                        orderStatus={order.status}
                        isFactory={false}
                        onActionComplete={loadOrder}
                      />
                    </div>
                  )}

                  {["sample_approved", "in_production", "qc_scheduled", "qc_uploaded"].includes(order.status) && (
                    <div className="bg-card border border-border rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <h2 className="text-lg font-semibold text-foreground">Revision Rounds</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        All spec changes must be formally logged and acknowledged by the factory.
                      </p>
                      <RevisionRounds orderId={order.id} isFactory={false} onActionComplete={loadOrder} />
                    </div>
                  )}

                  {["qc_scheduled", "qc_uploaded", "qc_pass", "qc_fail", "ready_to_ship", "shipped", "closed"].includes(order.status) && (
                    <div className="bg-card border border-border rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-rose-500" />
                        <h2 className="text-lg font-semibold text-foreground">Defect Reports</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Structured defect log. Factory must respond to every report. Feeds into factory performance score.
                      </p>
                      <DefectReports
                        orderId={order.id}
                        totalQuantity={order.quantity}
                        isFactory={false}
                        onActionComplete={loadOrder}
                      />
                    </div>
                  )}

                  {order.factories && shouldShow("FactoryReview", order.status as OrderStatus) && (
                    <FactoryReview
                      orderId={order.id}
                      factoryId={order.factories.id}
                      factoryName={order.factories.name}
                      orderStatus={order.status}
                    />
                  )}
                </TabsContent>
              )}

              {/* ══════════════════════════════════════════════
                  PAYMENTS TAB
              ══════════════════════════════════════════════ */}
              <TabsContent value="payments" className="space-y-6 mt-0">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Payment milestones</h2>
                  </div>

                  {isDraft ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 p-3 rounded-lg bg-muted/50">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        Milestone percentages must total 100%. Payments release when each stage is verified.
                      </div>
                      {milestones.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
                          <Input
                            value={m.label}
                            onChange={e => {
                              const updated = [...milestones];
                              updated[idx].label = e.target.value;
                              setMilestones(updated);
                            }}
                            className="flex-1 text-sm h-8"
                            placeholder="Milestone label"
                          />
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={m.percentage}
                              onChange={e => {
                                const updated = [...milestones];
                                updated[idx].percentage = Number(e.target.value);
                                setMilestones(updated);
                              }}
                              className="w-20 text-sm h-8"
                              min={0}
                              max={100}
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">
                          Total: {milestones.reduce((s, m) => s + (m.percentage || 0), 0)}%
                          {milestones.reduce((s, m) => s + (m.percentage || 0), 0) !== 100 && (
                            <span className="text-amber-600 ml-1">(must equal 100%)</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {order.order_milestones
                        .sort((a, b) => a.sequence_order - b.sequence_order)
                        .map(m => (
                          <div key={m.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                            m.status === "released" ? "bg-green-500/5 border-green-500/20" :
                            m.status === "eligible" ? "bg-amber-500/5 border-amber-400/40 ring-1 ring-amber-400/20" :
                            "bg-background border-border"
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                m.status === "released" ? "bg-green-500" :
                                m.status === "eligible" ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/30"
                              }`} />
                              <div>
                                <p className="text-sm font-semibold text-foreground">{m.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {m.percentage}% · <span className="font-medium text-foreground">
                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(m.amount)}
                                  </span>
                                </p>
                                {m.release_condition && (
                                  <p className="text-xs text-muted-foreground mt-0.5 italic">{m.release_condition}</p>
                                )}
                              </div>
                            </div>
                            {m.status === "released" ? (
                              <span className="text-xs text-green-600 font-medium">Paid</span>
                            ) : m.status === "eligible" ? (() => {
                              const isBulkMilestone = m.label.toLowerCase().includes("bulk") || m.sequence_order === 2;
                              const isFinalMilestone = m.label.toLowerCase().includes("final") || m.sequence_order === (order.order_milestones?.length || 0);
                              const sampleNotApproved = isBulkMilestone && !["sample_approved","in_production","qc_scheduled","qc_uploaded","qc_pass","qc_fail","ready_to_ship","shipped","closed"].includes(order.status);
                              const qcNotPassed = isFinalMilestone && !["qc_pass","ready_to_ship","shipped"].includes(order.status);
                              if (sampleNotApproved || qcNotPassed) {
                                return (
                                  <div className="text-right">
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                      <Shield className="h-3 w-3" />
                                      {sampleNotApproved ? "Awaiting sample approval" : "Awaiting QC pass"}
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                                  onClick={() => handlePayMilestone(m.id)}
                                  disabled={payingMilestone === m.id}
                                >
                                  {payingMilestone === m.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Release"}
                                </Button>
                              );
                            })() : (
                              <span className="text-xs text-muted-foreground">Pending</span>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {shouldShow("DisputeFiling", order.status as OrderStatus) && order.factories && (
                  <DisputeFiling
                    orderId={order.id}
                    orderNumber={order.order_number}
                    factoryName={order.factories.name}
                    onFiled={loadOrder}
                  />
                )}
              </TabsContent>

              {/* ══════════════════════════════════════════════
                  SHIPPING TAB
              ══════════════════════════════════════════════ */}
              {visible.shipping && (
                <TabsContent value="shipping" className="space-y-6 mt-0">
                  {shouldShow("ShipmentTracker", order.status as OrderStatus) && (
                    <ShipmentTracker orderId={order.id} isFactory={false} />
                  )}
                  {shouldShow("FreightChecklist", order.status as OrderStatus) && (
                    <FreightChecklist
                      incoterms={order.incoterms || "FOB"}
                      destination={(order.specifications as any)?.shipping_destination || "United States"}
                      orderStatus={order.status}
                    />
                  )}
                  <ShipmentDocs orderId={order.id} />
                </TabsContent>
              )}

            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    draft: { label: "Draft", variant: "outline" },
    po_issued: { label: "PO Issued", variant: "secondary" },
    po_accepted: { label: "PO Accepted", variant: "secondary" },
    in_production: { label: "In Production", variant: "default" },
    qc_scheduled: { label: "QC Scheduled", variant: "secondary" },
    qc_uploaded: { label: "QC Uploaded", variant: "secondary" },
    qc_pass: { label: "QC Passed", variant: "default" },
    qc_fail: { label: "QC Failed", variant: "destructive" },
    ready_to_ship: { label: "Ready to Ship", variant: "default" },
    shipped: { label: "Shipped", variant: "default" },
    closed: { label: "Closed", variant: "outline" },
    disputed: { label: "Disputed", variant: "destructive" },
    cancelled: { label: "Cancelled", variant: "outline" },
  };
  const c = config[status] || { label: status, variant: "outline" as const };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}
