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
import { useAuth } from "@/hooks/useAuth";
import { PlatformMessaging } from "@/components/platform/PlatformMessaging";
import { FactoryReview } from "@/components/trust/FactoryReview";
import { SampleReviewPanel } from "@/components/sampling/SampleReviewPanel";
import { RevisionRounds } from "@/components/orders/RevisionRounds";
import { TechPackVersions } from "@/components/orders/TechPackVersions";
import { DefectReports } from "@/components/orders/DefectReports";
import { ReorderButton } from "@/components/orders/ReorderButton";
import { toast } from "sonner";
import {
  ArrowLeft,
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

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?redirect=/orders/${id}`);
    }
  }, [user, authLoading, navigate, id]);

  // Fetch order
  useEffect(() => {
    if (!user || !id) return;

    const fetchOrder = async () => {
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
        console.error("Order fetch error:", error);
        toast.error("Order not found");
        navigate("/dashboard?tab=orders");
        return;
      }

      const orderData = data as unknown as OrderData;
      setOrder(orderData);
      setUnitPrice(orderData.unit_price > 0 ? String(orderData.unit_price) : "");
      setQuantity(String(orderData.quantity));

      // Restore QC mode from specifications if saved
      const specs = orderData.specifications as Record<string, unknown> | null;
      if (specs?.qc_mode) {
        setQcMode(specs.qc_mode as QCMode);
      }

      setLoading(false);
    };

    fetchOrder();
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
      console.error("Save error:", error);
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

    const { data, error } = await supabase.functions.invoke("order-action", {
      body: {
        action: "issue_po",
        order_id: order.id,
        metadata: { qc_mode: qcMode },
      },
    });

    if (error || data?.error) {
      toast.error(data?.error || "Failed to issue PO");
      console.error("Issue PO error:", error || data);
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
      console.error("Stripe checkout error:", error || data);
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
        title={`Order ${order.order_number} | Sourcery`}
        description="Manage your production order."
      />

      <section className="section-padding">
        <div className="container-wide">
          {/* Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard?tab=orders")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div>
                <div className="font-mono text-sm text-muted-foreground mb-0.5">{order.order_number}</div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                  {order.factories?.name || "Order"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {order.factories ? (
                    <Link
                      to={`/directory/${order.factories.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {order.factories.name}
                    </Link>
                  ) : "Factory unavailable"}
                  <span>•</span>
                  <span>{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Needs attention banner */}
            {(() => {
              const attentionStatuses: Record<string, string> = {
                draft: "This order is a draft. Set pricing and issue the PO to send it to the factory.",
                po_accepted: "The factory has accepted the PO. Review and approve the sample before bulk production is funded.",
                sample_sent: "Sample submitted by the factory. Review and approve or request a revision.",
                sample_revision: "Revision requested. Awaiting updated sample from the factory.",
                qc_uploaded: "QC report uploaded. Review and release the final payment milestone.",
                qc_fail: "QC failed. File a defect report or request a remedy before releasing payment.",
                disputed: "This order is in dispute. Submit your evidence through the platform.",
              };
              const msg = attentionStatuses[order.status];
              if (!msg) return null;
              return (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/25 mb-6">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{msg}</p>
                </div>
              );
            })()}

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
                          value={editQuantity}
                          onChange={e => setEditQuantity(Number(e.target.value))}
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
                            value={editUnitPrice}
                            onChange={e => setEditUnitPrice(Number(e.target.value))}
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

                  {(editQuantity > 0 && editUnitPrice > 0) && (
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Order total</span>
                      <span className="text-sm font-semibold text-foreground">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: editCurrency }).format(editQuantity * editUnitPrice)}
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
                          <div key={m.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                            m.status === "released" ? "bg-green-500/5 border-green-500/20" :
                            m.status === "eligible" ? "bg-amber-500/8 border-amber-500/25" :
                            "bg-background border-border"
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                m.status === "released" ? "bg-green-500" :
                                m.status === "eligible" ? "bg-amber-500" : "bg-muted-foreground/30"
                              }`} />
                              <div>
                                <p className="text-sm font-medium text-foreground">{m.label}</p>
                                <p className="text-xs text-muted-foreground">{m.percentage}% — {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(m.amount)}</p>
                              </div>
                            </div>
                            {m.status === "released" ? (
                              <span className="text-xs text-green-600 font-medium">Paid</span>
                            ) : m.status === "eligible" ? (
                              <Button
                                size="sm"
                                onClick={() => handlePayMilestone(m.id)}
                                disabled={payingMilestone === m.id}
                              >
                                {payingMilestone === m.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Release"}
                              </Button>
                            ) : (
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
                      Sample must be approved before bulk production milestones can be funded.
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

                {/* Reorder */}
                {order.status === "closed" && order.factories && (
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
              </div>

            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );

      <section className="section-padding">
        <div className="container-wide max-w-3xl mx-auto">
          {/* Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard?tab=orders")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {order.order_number}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {order.factories ? (
                    <Link
                      to={`/directory/${order.factories.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {order.factories.name}
                    </Link>
                  ) : (
                    "Factory unavailable"
                  )}
                  <span>•</span>
                  <span>{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Inquiry context */}
            {specs?.product_description && (
              <div className="bg-muted/50 border border-border rounded-xl p-4">
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                  From Inquiry
                </div>
                <p className="text-sm text-foreground">
                  {String(specs.product_description)}
                </p>
              </div>
            )}

            {/* Editable fields (draft only) */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Order Details
                </h2>
                {isDraft && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    Editable
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (units)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={!isDraft}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_price">
                    Unit Price ({order.currency})
                  </Label>
                  <Input
                    id="unit_price"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    disabled={!isDraft}
                  />
                </div>
              </div>

              {parsedPrice > 0 && parsedQty > 0 && (
                <div className="text-sm text-muted-foreground">
                  Total:{" "}
                  <span className="font-semibold text-foreground">
                    {formatter.format(computedTotal)}
                  </span>{" "}
                  ({parsedQty.toLocaleString()} × {formatter.format(parsedPrice)})
                </div>
              )}

              {/* QC Mode */}
              <div className="space-y-2">
                <Label>Quality Control Mode</Label>
                <Select
                  value={qcMode}
                  onValueChange={(v) => setQcMode(v as QCMode)}
                  disabled={!isDraft}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sourcery">
                      Sourcery QC — We coordinate inspection
                    </SelectItem>
                    <SelectItem value="byo">
                      Bring Your Own — You assign your QC partner
                    </SelectItem>
                    <SelectItem value="factory_self">
                      Factory Self-QC — Factory handles inspection
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {qcMode === "sourcery" &&
                    "Our QC network will be assigned after the factory accepts the PO."}
                  {qcMode === "byo" &&
                    "You'll assign your own QC partner after the PO is accepted."}
                  {qcMode === "factory_self" &&
                    "The factory will conduct and upload their own QC report."}
                </p>
              </div>

              {isDraft && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Draft
                </Button>
              )}
            </div>

            {/* Milestones */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Payment Milestones
                </h2>
              </div>

              <div className="space-y-3">
                {[...order.order_milestones]
                  .sort((a, b) => a.sequence_order - b.sequence_order)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm text-foreground">
                          {m.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {m.release_condition || "—"} • {m.percentage}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm text-foreground">
                          {computedTotal > 0
                            ? formatter.format(computedTotal * (m.percentage / 100))
                            : "—"}
                        </div>
                        <MilestoneStatusBadge status={m.status} />
                        {/* Pay button for pending/eligible milestones after PO issued */}
                        {!isDraft && (m.status === "pending" || m.status === "eligible") && computedTotal > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs h-7"
                            disabled={payingMilestone === m.id}
                            onClick={() => handlePayMilestone(m.id)}
                          >
                            {payingMilestone === m.id ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <CreditCard className="h-3 w-3 mr-1" />
                            )}
                            Pay Milestone
                          </Button>
                        )}
                        {m.status === "released" && (
                          <span className="text-xs text-green-600 font-medium mt-1 block">✓ Paid</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Messaging */}
            <PlatformMessaging orderId={order.id} />

            {/* Sampling — hard gate between po_accepted and in_production */}
            {["po_accepted", "sample_sent", "sample_approved", "sample_revision"].includes(order.status) && (
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <h2 className="text-lg font-semibold text-foreground">Sample Review</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Sample must be approved before bulk production milestones can be funded.
                </p>
                <SampleReviewPanel
                  orderId={order.id}
                  orderStatus={order.status}
                  isFactory={false}
                  onActionComplete={loadOrder}
                />
              </div>
            )}

            {/* Tech pack versions — available once order is beyond draft */}
            {order.status !== "draft" && (
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <h2 className="text-lg font-semibold text-foreground">Tech Pack</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Every version is preserved. The factory must confirm they've switched to the latest version before production continues.
                </p>
                <TechPackVersions
                  orderId={order.id}
                  isFactory={false}
                  onActionComplete={loadOrder}
                />
              </div>
            )}

            {/* Revision rounds — available during production */}
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

            {/* Defect reports — available from QC onwards */}
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

            {/* Review — shown for completed orders */}
            {order.factories && !isDraft && (
              <FactoryReview
                orderId={order.id}
                factoryId={order.factories.id}
                factoryName={order.factories.name}
                orderStatus={order.status}
              />
            )}

            {/* Reorder — only on closed orders */}
            {order.status === "closed" && order.factories && (
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

            {/* Issue PO */}
            {isDraft && (
              <div className="bg-card border-2 border-primary/20 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Order?
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Issuing the PO sends this order to the factory for review. Make sure
                  quantity and unit price are set before proceeding.
                </p>

                {!canIssuePO && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    Set a unit price greater than 0 and confirm quantity to proceed.
                  </div>
                )}

                <Button
                  onClick={handleIssuePO}
                  disabled={!canIssuePO || issuingPO}
                  className="w-full sm:w-auto"
                >
                  {issuingPO ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Issue Purchase Order
                </Button>
              </div>
            )}

            {/* Non-draft status info */}
            {!isDraft && (
              <div className="bg-muted/50 border border-border rounded-xl p-6 text-center">
                <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  This order has been submitted. Status:{" "}
                  <span className="font-semibold text-foreground capitalize">
                    {order.status.replace(/_/g, " ")}
                  </span>
                </p>
              </div>
            )}
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
