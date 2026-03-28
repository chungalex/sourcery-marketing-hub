import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Package,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
} from "lucide-react";
import { format } from "date-fns";

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
  incoterms: string | null;
  delivery_window_start: string | null;
  delivery_window_end: string | null;
  profiles: { full_name: string | null; email: string | null } | null;
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

export default function FactoryAccept() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?redirect=/factory-accept/${orderId}`);
    }
  }, [user, authLoading, navigate, orderId]);

  // Fetch order
  useEffect(() => {
    if (!user || !orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id, order_number, status, quantity, unit_price,
          total_amount, currency, created_at, specifications,
          incoterms, delivery_window_start, delivery_window_end,
          profiles:buyer_id (full_name, email),
          order_milestones (id, label, percentage, amount, status, sequence_order, release_condition)
        `)
        .eq("id", orderId)
        .single();

      if (error || !data) {
        toast.error("Order not found");
        navigate("/dashboard/factory");
        return;
      }

      setOrder(data as unknown as OrderData);
      setLoading(false);
    };

    fetchOrder();
  }, [user, orderId, navigate]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: order?.currency || "USD",
  });

  const isPOIssued = order?.status === "po_issued";

  const handleAccept = async () => {
    if (!order) return;
    setAccepting(true);

    const { data, error } = await supabase.functions.invoke("order-action", {
      body: { action: "accept_po", order_id: order.id },
    });

    if (error || data?.error) {
      toast.error(data?.error || "Failed to accept PO");
      setAccepting(false);
      return;
    }

    toast.success("PO accepted — order is now in progress.");
    navigate("/dashboard/factory");
  };

  const handleDecline = async () => {
    if (!order || !declineReason.trim()) {
      toast.error("Please provide a reason for declining.");
      return;
    }
    setDeclining(true);

    const { data, error } = await supabase.functions.invoke("order-action", {
      body: {
        action: "cancel_order",
        order_id: order.id,
        cancellation_reason: declineReason.trim(),
      },
    });

    if (error || data?.error) {
      toast.error(data?.error || "Failed to decline PO");
      setDeclining(false);
      return;
    }

    toast.success("PO declined. The brand has been notified.");
    navigate("/dashboard/factory");
  };

  return (
    <Layout>
      <SEO title="Review Purchase Order — Sourcery" />
      <section className="py-12 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Back */}
            <button
              onClick={() => navigate("/dashboard/factory")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>

            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                New order from your brand
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Review the order details below. Accept to confirm you can produce this order, or decline if you cannot.
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            ) : !order ? null : (
              <>
                {/* Status banner */}
                {!isPOIssued && (
                  <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    This order has already been actioned (status:{" "}
                    <span className="font-semibold capitalize">
                      {order.status.replace(/_/g, " ")}
                    </span>
                    ).
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Order Summary
                    </h2>
                    <Badge variant="secondary" className="ml-auto">
                      {order.order_number}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Brand</div>
                      <div className="font-medium text-foreground mt-0.5">
                        {order.profiles?.full_name || order.profiles?.email || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Placed</div>
                      <div className="font-medium text-foreground mt-0.5">
                        {format(new Date(order.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Quantity</div>
                      <div className="font-medium text-foreground mt-0.5">
                        {order.quantity.toLocaleString()} units
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Unit Price</div>
                      <div className="font-medium text-foreground mt-0.5">
                        {formatter.format(order.unit_price)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Value</div>
                      <div className="font-bold text-foreground mt-0.5 text-base">
                        {formatter.format(order.total_amount ?? order.unit_price * order.quantity)}
                      </div>
                    </div>
                    {order.incoterms && (
                      <div>
                        <div className="text-muted-foreground">Incoterms</div>
                        <div className="font-medium text-foreground mt-0.5">
                          {order.incoterms}
                        </div>
                      </div>
                    )}
                    {order.delivery_window_start && (
                      <div className="col-span-2">
                        <div className="text-muted-foreground">Delivery Window</div>
                        <div className="font-medium text-foreground mt-0.5">
                          {format(new Date(order.delivery_window_start), "MMM d, yyyy")}
                          {order.delivery_window_end &&
                            ` – ${format(new Date(order.delivery_window_end), "MMM d, yyyy")}`}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Specs */}
                  {order.specifications && Object.keys(order.specifications).length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                        Specifications
                      </div>
                      <div className="space-y-1">
                        {Object.entries(order.specifications)
                          .filter(([k]) => k !== "qc_mode")
                          .map(([key, val]) => (
                            <div key={key} className="flex gap-2 text-sm">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/_/g, " ")}:
                              </span>
                              <span className="text-foreground">{String(val)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Milestones */}
                {order.order_milestones.length > 0 && (
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
                            <div className="text-right font-semibold text-sm text-foreground">
                              {formatter.format(m.amount)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {isPOIssued && (
                  <div className="bg-card border-2 border-primary/20 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">
                        Your Response
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Accepting confirms your ability to fulfill this order under the terms above. Declining notifies the brand immediately.
                    </p>

                    {!showDeclineForm ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleAccept}
                          disabled={accepting || declining}
                          className="flex-1"
                        >
                          {accepting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Accept PO
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeclineForm(true)}
                          disabled={accepting || declining}
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="decline-reason" className="text-sm">
                            Reason for declining
                          </Label>
                          <Textarea
                            id="decline-reason"
                            placeholder="e.g. Capacity full for requested window, MOQ not met, unable to meet delivery date..."
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="mt-1.5 resize-none"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="destructive"
                            onClick={handleDecline}
                            disabled={declining || !declineReason.trim()}
                            className="flex-1"
                          >
                            {declining ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            Confirm Decline
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setShowDeclineForm(false);
                              setDeclineReason("");
                            }}
                            disabled={declining}
                          >
                            Back
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
