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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { OrderStatusGuide } from "@/components/orders/OrderStatusGuide";
import { useAuth } from "@/hooks/useAuth";
import { PlatformMessaging } from "@/components/platform/PlatformMessaging";
import { OrderChatSummary } from "@/components/orders/OrderChatSummary";
import { DisputeFiling } from "@/components/orders/DisputeFiling";
import { ReorderIntelligence } from "@/components/orders/ReorderIntelligence";
import { OrderExport } from "@/components/orders/OrderExport";
import { FactoryReview } from "@/components/trust/FactoryReview";
import { SampleReviewPanel } from "@/components/sampling/SampleReviewPanel";
import { RevisionRounds } from "@/components/orders/RevisionRounds";
import { TechPackVersions } from "@/components/orders/TechPackVersions";
import { DefectReports } from "@/components/orders/DefectReports";
import { ReorderButton } from "@/components/orders/ReorderButton";
import { ProductionAssistant } from "@/components/va/ProductionAssistant";
import { toast } from "sonner";
import {
  ArrowLeft, Shield,
  Loader2,
  Package,
  Building2,
  FileText,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

type QCMode = "sourcery" | "byo" | "factory_self";

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

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  // Handle Stripe return
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast.success("Payment successful! Milestone released.");
      setSearchParams({}, { replace: true });
    } else if (paymentStatus === "cancelled") {
      toast.info("Payment cancelled.");
      setSearchParams({}, { replace: true });
    }
  }, []);

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [issuingPO, setIssuingPO] = useState(false);
  const [payingMilestone, setPayingMilestone] = useState<string | null>(null);

  // Editable fields
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [qcMode, setQcMode] = useState<QCMode>("sourcery");
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
        total_amount, currency, created_at, specifications,
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

    // Restore QC mode from specifications if saved
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

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: order?.currency || "USD",
  });

  // Save draft changes
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
      // Update milestones amounts
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
      // Refresh order data
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

  // Issue PO
  const handleIssuePO = async () => {
    if (!order || !canIssuePO) return;

    // Save first
    await handleSave();

    setIssuingPO(true);

    // Get session for auth
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

    toast.success("Purchase Order issued! The factory will be notified.");
    navigate("/dashboard?tab=orders&highlight=" + order.id);
  };

  // Pay a milestone via Stripe Checkout
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

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-wide max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  const specs = order.specifications as Record<string, unknown> | null;

  return (
    <Layout>
      <SEO
        title={`${(specs?.product_name as string) || order.order_number} | Sourcery`}
        description="Manage your production order."
      />

      <section className="section-padding">
        <div className="container-wide">
          {/* Back */}
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
                  const specs = order.specifications as any;
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
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

            {/* Needs attention banner */}
            {(() => {
              const attentionStatuses: Record<string, string> = {
                draft: "This order is a draft. Set pricing and issue the PO to send it to the factory.",
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
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 mb-6">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{msg}</p>
                </div>
              );
            })()}

            {/* Status guide */}
            <OrderStatusGuide
              status={order.status}
              role="brand"
              orderNumber={order.order_number}
              factoryName={order.factories?.name}
              className="mb-6"
            />

            {/* Two-column layout */}
            <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">

              {/* Left column — order content */}
              <div className="space-y-6 min-w-0">

                {/* Inquiry context */}
                {specs?.product_description && (
                  <div className="bg-muted/50 border border-border rounded-xl p-4">
                    <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">From Inquiry</div>
                    <p className="text-sm text-foreground">{String(specs.product_description)}</p>
                  </div>
                )}

                {/* Editable fields (draft only) */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Order Details</h2>
                    {isDraft && (
                      <Badge variant="outline" className="ml-auto text-xs">Editable</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Quantity</Label>
                      {isDraft ? (
                        <Input
                          type="number"
                          value={parsedQty}
                          onChange={e => setQuantity(e.target.value)}
                          min={1}
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-foreground">{order.quantity.toLocaleString()} units</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Unit price</Label>
                      {isDraft ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={parsedPrice}
                            onChange={e => setUnitPrice(e.target.value)}
                            min={0}
                            step={0.01}
                            className="text-sm"
                          />
                          <Select value={editCurrency} onValueChange={setEditCurrency}>
                            <SelectTrigger className="w-24 text-sm">
                              <SelectValue />
                            </SelectTrigger>
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

                  {(parsedQty > 0 && parsedPrice > 0) && (
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Order total</span>
                      <span className="text-sm font-semibold text-foreground">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: editCurrency }).format(parsedQty * parsedPrice)}
                      </span>
                    </div>
                  )}

                  {isDraft && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                        Save changes
                      </Button>
                    </div>
                  )}
                </div>

                {/* Milestones */}
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
                                  {m.percentage}% · <span className="font-medium text-foreground">{new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(m.amount)}</span>
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
                              const sampleNotApproved = isBulkMilestone && !["sample_approved", "in_production", "qc_scheduled", "qc_uploaded", "qc_pass", "qc_fail", "ready_to_ship", "shipped", "closed"].includes(order.status);
                              const qcNotPassed = isFinalMilestone && !["qc_pass", "ready_to_ship", "shipped"].includes(order.status);
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

                {/* Sampling */}
                {["po_accepted", "sample_sent", "sample_approved", "sample_revision"].includes(order.status) && (
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

                {/* Tech pack */}
                {order.status !== "draft" && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <h2 className="text-lg font-semibold text-foreground">Tech Pack</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Every version is preserved. The factory confirms which version they're building from.
                    </p>
                    <TechPackVersions
                      orderId={order.id}
                      isFactory={false}
                      onActionComplete={loadOrder}
                    />
                  </div>
                )}

                {/* Revision rounds */}
                {["sample_approved", "in_production", "qc_scheduled", "qc_uploaded"].includes(order.status) && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Revision Rounds</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      All spec changes must be formally logged and acknowledged by the factory before production continues.
                    </p>
                    <RevisionRounds
                      orderId={order.id}
                      isFactory={false}
                      onActionComplete={loadOrder}
                    />
                  </div>
                )}

                {/* Defect reports */}
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

                {/* Factory review */}
                {order.factories && !isDraft && (
                  <FactoryReview
                    orderId={order.id}
                    factoryId={order.factories.id}
                    factoryName={order.factories.name}
                    orderStatus={order.status}
                  />
                )}

                {/* Dispute filing — available for in-production and QC-stage orders */}
                {["in_production", "qc_scheduled", "qc_uploaded", "qc_fail", "ready_to_ship"].includes(order.status) && order.factories && (
                  <DisputeFiling
                    orderId={order.id}
                    orderNumber={order.order_number}
                    factoryName={order.factories.name}
                    onFiled={loadOrder}
                  />
                )}

                {/* Reorder */}
                {order.status === "closed" && order.factories && (
                  <>
                    <ReorderIntelligence
                      orderId={order.id}
                      factoryId={order.factories.id}
                      factoryName={order.factories.name}
                    />
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
                  </>
                )}

                {/* Issue PO */}
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

              </div>

              {/* Right column — messaging always visible */}
              <div className="lg:sticky lg:top-6 space-y-4">
                <PlatformMessaging orderId={order.id} />
                <OrderChatSummary orderId={order.id} />
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

                {/* Order meta */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-sm">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Order details</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium text-foreground">{order.quantity.toLocaleString()} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unit price</span>
                    <span className="font-medium text-foreground">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(order.unit_price)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="text-muted-foreground">Order total</span>
                    <span className="font-semibold text-foreground">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(order.total_amount || order.quantity * order.unit_price)}
                    </span>
                  </div>
                  {order.delivery_window_end && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery by</span>
                      <span className="font-medium text-foreground">{format(new Date(order.delivery_window_end), "MMM d, yyyy")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-foreground">{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                  </div>
                  {order.factories && (
                    <Link
                      to={`/directory/${order.factories.slug}`}
                      className="flex items-center gap-1 text-primary text-xs hover:underline pt-1"
                    >
                      View factory profile <ExternalLink className="h-3 w-3" />
                    </Link>
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
              </div>

            </div>
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

function MilestoneStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "text-muted-foreground",
    eligible: "text-primary",
    released: "text-primary",
    disputed: "text-destructive",
    cancelled: "text-muted-foreground line-through",
  };
  return (
    <span className={`text-xs font-medium capitalize ${colors[status] || "text-muted-foreground"}`}>
      {status}
    </span>
  );
}
