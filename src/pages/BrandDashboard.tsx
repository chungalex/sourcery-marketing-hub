import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { ProductionAssistant } from "@/components/va/ProductionAssistant";
import { useInquiries, type InquiryWithFactory } from "@/hooks/useInquiries";
import { useOrders, type OrderWithDetails } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Building2, MessageSquare, Settings, Search, Bell, BookOpen,
  Clock, CheckCircle, XCircle, ArrowRight, Package, Send,
  RefreshCw, Loader2, UserPlus, AlertCircle, ChevronRight,
  Calendar, FileText, BarChart3, Wrench, User, Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { BrandOnboardingPrompt } from "@/components/onboarding/BrandOnboardingPrompt";
import { PlatformMessaging } from "@/components/platform/PlatformMessaging";
import { lazy, Suspense } from "react";
const RFQDashboard = lazy(() => import("./RFQDashboard"));

// ── Status config ─────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; needsAction: boolean; isFactory: boolean }> = {
  draft:          { label: "Draft",              color: "border-muted-foreground/30 text-muted-foreground bg-secondary/50",  needsAction: true,  isFactory: false },
  po_issued:      { label: "PO Issued",          color: "border-amber-400 text-amber-700 bg-amber-50",                      needsAction: false, isFactory: true  },
  po_accepted:    { label: "PO Accepted",        color: "border-blue-400 text-blue-700 bg-blue-50",                         needsAction: true,  isFactory: false },
  sample_sent:    { label: "Sample to Review",   color: "border-amber-400 text-amber-700 bg-amber-50",                      needsAction: true,  isFactory: false },
  sample_revision:{ label: "Revision Requested", color: "border-orange-400 text-orange-700 bg-orange-50",                   needsAction: false, isFactory: true  },
  sample_approved:{ label: "Sample Approved",    color: "border-green-400 text-green-700 bg-green-50",                      needsAction: false, isFactory: false },
  in_production:  { label: "In Production",      color: "border-blue-400 text-blue-700 bg-blue-50",                         needsAction: false, isFactory: false },
  qc_scheduled:   { label: "QC Scheduled",       color: "border-blue-400 text-blue-700 bg-blue-50",                         needsAction: false, isFactory: false },
  qc_uploaded:    { label: "QC to Review",       color: "border-amber-400 text-amber-700 bg-amber-50",                      needsAction: true,  isFactory: false },
  qc_pass:        { label: "QC Passed",          color: "border-green-400 text-green-700 bg-green-50",                      needsAction: true,  isFactory: false },
  qc_fail:        { label: "QC Failed",          color: "border-red-400 text-red-700 bg-red-50",                            needsAction: true,  isFactory: false },
  ready_to_ship:  { label: "Ready to Ship",      color: "border-green-400 text-green-700 bg-green-50",                      needsAction: false, isFactory: false },
  shipped:        { label: "Shipped",            color: "border-blue-400 text-blue-700 bg-blue-50",                         needsAction: false, isFactory: false },
  closed:         { label: "Closed",             color: "border-border text-muted-foreground bg-secondary/30",              needsAction: false, isFactory: false },
  disputed:       { label: "Disputed",           color: "border-red-400 text-red-700 bg-red-50",                            needsAction: true,  isFactory: false },
  cancelled:      { label: "Cancelled",          color: "border-border text-muted-foreground bg-secondary/30",              needsAction: false, isFactory: false },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "border-border text-muted-foreground bg-secondary/30" };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border", cfg.color)}>
      {cfg.label}
    </span>
  );
}

function MilestoneTrack({ milestones }: { milestones: { status: string; percentage: number; label: string; amount: number; sequence_order: number }[] }) {
  if (!milestones?.length) return null;
  const sorted = [...milestones].sort((a, b) => a.sequence_order - b.sequence_order);
  return (
    <div className="flex items-center gap-1 mt-3">
      {sorted.map((m, i) => {
        const isReleased = m.status === "released";
        const isEligible = m.status === "eligible";
        return (
          <div key={m.label} className="flex items-center flex-1 gap-1">
            <div className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              isReleased ? "bg-green-500" : isEligible ? "bg-amber-400" : "bg-muted"
            )} />
            {i === sorted.length - 1 && (
              <div className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                isReleased ? "bg-green-500" : isEligible ? "bg-amber-400" : "bg-muted"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function formatPrice(order: OrderWithDetails) {
  if (!order.unit_price) return null;
  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency || "USD" });
  return `${order.quantity.toLocaleString()} units · ${fmt.format(order.total_amount || order.quantity * order.unit_price)}`;
}

function getProductName(order: OrderWithDetails): string {
  const specs = order.specifications as any;
  if (specs?.product_name) return specs.product_name;
  return order.factories?.name || "Order";
}

function getProductCategory(order: OrderWithDetails): string {
  const specs = order.specifications as any;
  if (specs?.product_category) return (specs.product_category as string).replace(/_/g, " ");
  return "";
}

function getCollection(order: OrderWithDetails): string {
  const specs = order.specifications as any;
  return specs?.collection || "";
}

function getInquiryStatusIcon(status: string) {
  switch (status) {
    case "new": return <Clock className="h-4 w-4 text-amber-500" />;
    case "replied": return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case "declined": return <XCircle className="h-4 w-4 text-red-500" />;
    default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

function OrdersSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map(i => (
        <div key={i} className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between mb-3"><Skeleton className="h-4 w-32" /><Skeleton className="h-6 w-24 rounded-full" /></div>
          <Skeleton className="h-3 w-48 mb-3" />
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}


function RFQList({ userId }: { userId?: string }) {
  const [rfqs, setRfqs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await (supabase as any)
        .from("rfqs")
        .select("*, rfq_recipients(*)")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });
      setRfqs(data || []);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) return <div className="space-y-2">{[1,2].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>;

  if (rfqs.length === 0) return (
    <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
      <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
      <p className="text-sm font-semibold text-foreground mb-1">No RFQs yet</p>
      <p className="text-xs text-muted-foreground mb-4">Send a product brief to multiple factories and compare quotes.</p>
      <a href="/rfq/create"><Button size="sm">Create your first RFQ</Button></a>
    </div>
  );

  return (
    <div className="space-y-3">
      {rfqs.map((rfq: any) => {
        const recipients = rfq.rfq_recipients || [];
        const quoted = recipients.filter((r: any) => r.status === "quoted").length;
        const total = recipients.length;
        return (
          <div key={rfq.id} className="p-4 bg-card border border-border rounded-xl">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{rfq.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sent to {total} {total === 1 ? "factory" : "factories"} · {quoted} {quoted === 1 ? "quote" : "quotes"} received
                </p>
              </div>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0",
                rfq.status === "sent" && quoted > 0 ? "bg-green-500/10 text-green-700 border-green-500/20" :
                rfq.status === "sent" ? "bg-blue-500/10 text-blue-700 border-blue-400/30" :
                "bg-secondary text-muted-foreground border-border"
              )}>
                {rfq.status === "sent" && quoted > 0 ? `${quoted} quote${quoted > 1 ? "s" : ""}` : rfq.status}
              </span>
            </div>
            {quoted > 0 && (
              <div className="mt-3 space-y-1.5">
                {recipients.filter((r: any) => r.status === "quoted").map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 border border-border">
                    <span className="text-xs font-medium text-foreground">{r.factory_name}</span>
                    <span className="text-xs text-foreground font-semibold">
                      {r.currency} {r.quoted_unit_price}/unit · {r.quoted_lead_time_weeks}wk lead · MOQ {r.quoted_moq?.toLocaleString()}
                    </span>
                  </div>
                ))}
                {quoted > 1 && (
                  <p className="text-xs text-primary font-medium mt-1">
                    Best price: {(() => {
                      const best = recipients.filter((r: any) => r.status === "quoted").sort((a: any, b: any) => a.quoted_unit_price - b.quoted_unit_price)[0];
                      return `${best.currency} ${best.quoted_unit_price}/unit from ${best.factory_name}`;
                    })()}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BrandDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { inquiries, isLoading: inquiriesLoading, refetch: refetchInquiries } = useInquiries();
  const { orders, isLoading: ordersLoading, refetch: refetchOrders } = useOrders();
  const [byofFactories, setByofFactories] = useState<Array<{ id: string; name: string; city: string | null; country: string }>>([]);
  const [loadingByof, setLoadingByof] = useState(true);
  const [converting, setConverting] = useState<string | null>(null);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (supabase as any).from("factories").select("id, name, city, country")
      .eq("is_byof", true).eq("invited_by", user.id)
      .then(({ data }: any) => { setByofFactories(data || []); setLoadingByof(false); });
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/dashboard");
  }, [user, authLoading, navigate]);

  const defaultTab = searchParams.get("tab") || "orders";
  const highlightId = searchParams.get("highlight");

  const needsActionOrders = orders.filter(o => STATUS_CONFIG[o.status]?.needsAction);
  const activeOrders = orders.filter(o => !["closed", "cancelled"].includes(o.status));
  const newInquiries = inquiries.filter(i => i.status === "new");

  const handleConvert = async (inquiryId: string) => {
    setConverting(inquiryId);
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase.functions.invoke("convert-inquiry-to-order", {
      headers: { Authorization: `Bearer ${session?.access_token}` },
      body: { inquiry_id: inquiryId }
    });
    if (error || !data?.success) { toast.error(data?.error || "Failed to convert"); setConverting(null); return; }
    toast.success(`Order ${data.order_number} created`);
    refetchInquiries(); refetchOrders();
    navigate(`/dashboard?tab=orders&highlight=${data.order_id}`);
  };

  if (authLoading) return (
    <Layout><div className="section-padding"><div className="container-wide flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></div></Layout>
  );
  if (!user) return null;

  return (
    <Layout>
      <SEO title="Dashboard — Sourcery" description="Manage your production orders and factory relationships." />
      <section className="section-padding">
        <div className="container-wide">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                  {user.email?.split("@")[0] ? `Hi, ${user.email.split("@")[0]}` : "Dashboard"}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {needsActionOrders.length > 0
                    ? `${needsActionOrders.length} order${needsActionOrders.length > 1 ? "s" : ""} need${needsActionOrders.length === 1 ? "s" : ""} your attention`
                    : "All orders are up to date"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/rfq/create">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <FileText className="h-4 w-4" />
                    New RFQ
                  </Button>
                </Link>
                <Link to="/orders/create">
                  <Button size="sm" className="gap-1.5">
                    <Package className="h-4 w-4" />
                    New order
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Action banner — only when something needs attention */}
          {needsActionOrders.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 space-y-2">
              {needsActionOrders.map(order => (
                <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-foreground">{order.order_number}</span>
                      <span className="text-sm text-muted-foreground ml-2">·</span>
                      <span className="text-sm text-muted-foreground ml-2">{STATUS_CONFIG[order.status]?.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-700 font-medium">
                    Review
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </motion.div>
          )}

          {/* Stats — action-oriented */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Active orders",      value: ordersLoading   ? "—" : activeOrders.length,   icon: Package,      accent: false },
              { label: "Need your action",   value: ordersLoading   ? "—" : needsActionOrders.length, icon: AlertCircle, accent: needsActionOrders.length > 0 },
              { label: "New inquiries",      value: inquiriesLoading ? "—" : newInquiries.length,   icon: MessageSquare, accent: newInquiries.length > 0 },
              { label: "Your factories",     value: loadingByof     ? "—" : byofFactories.length,   icon: Building2,    accent: false },
            ].map(stat => (
              <div key={stat.label} className={cn(
                "bg-card border rounded-xl p-4 flex items-center gap-3",
                stat.accent ? "border-amber-400/50 bg-amber-500/5" : "border-border"
              )}>
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", stat.accent ? "bg-amber-500/15" : "bg-primary/10")}>
                  <stat.icon className={cn("h-4 w-4", stat.accent ? "text-amber-600" : "text-primary")} />
                </div>
                <div>
                  <div className={cn("text-xl font-semibold", stat.accent ? "text-amber-700" : "text-foreground")}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Onboarding prompt — shown until brand has factory + order */}
          {!loadingByof && !ordersLoading && (
            <BrandOnboardingPrompt
              hasFactory={byofFactories.length > 0}
              hasOrder={orders.length > 0}
            />
          )}

          {/* Tabs */}
          <Tabs defaultValue={defaultTab} className="space-y-5">
            <TabsList className="h-auto p-1">
              <TabsTrigger value="orders" className="flex items-center gap-1.5 text-xs">
                <Package className="h-3.5 w-3.5" />
                Orders
                {!ordersLoading && activeOrders.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-primary/15 text-primary font-medium">{activeOrders.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-1.5 text-xs">
                <Building2 className="h-3.5 w-3.5" />
                Your Factories
                {!loadingByof && byofFactories.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-primary/15 text-primary font-medium">{byofFactories.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="flex items-center gap-1.5 text-xs">
                <MessageSquare className="h-3.5 w-3.5" />
                Inquiries
                {!inquiriesLoading && newInquiries.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-amber-500/15 text-amber-700 font-medium">{newInquiries.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1.5 text-xs">
                <Settings className="h-3.5 w-3.5" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="rfq" className="flex items-center gap-1.5 text-xs">
                <Send className="h-3.5 w-3.5" />
                RFQs
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-1.5 text-xs">
                <Wrench className="h-3.5 w-3.5" />
                Tools
              </TabsTrigger>
            </TabsList>

            {/* Orders */}
            <TabsContent value="orders" className="space-y-3">
              {ordersLoading ? <OrdersSkeleton /> : orders.length > 0 ? (
                orders.map(order => {
                  const cfg = STATUS_CONFIG[order.status];
                  const needsAction = cfg?.needsAction;
                  const isClosed = ["closed", "cancelled"].includes(order.status);
                  const priceStr = formatPrice(order);
                  return (
                    <Link key={order.id} to={`/orders/${order.id}`} className="block">
                      <div className={cn(
                        "bg-card border rounded-xl p-5 hover:border-primary/40 transition-all group",
                        needsAction ? "border-amber-400/40 bg-amber-500/5" : isClosed ? "border-border opacity-70" : "border-border",
                        highlightId === order.id && "ring-2 ring-primary/20 border-primary"
                      )}>
                        {needsAction && (
                          <div className="flex items-center gap-1.5 mb-3 text-xs font-medium text-amber-700">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Action required
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-foreground text-sm leading-tight mb-0.5">
                              {getProductName(order)}
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs text-muted-foreground">{order.factories?.name}</span>
                              {getProductCategory(order) && (
                                <>
                                  <span className="text-muted-foreground/40 text-xs">·</span>
                                  <span className="text-xs text-muted-foreground capitalize">{getProductCategory(order)}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          {order.total_amount ? (
                            <div className="text-sm font-semibold text-foreground">
                              {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency || "USD", maximumFractionDigits: 0 }).format(order.total_amount)}
                            </div>
                          ) : null}
                          {order.delivery_window_end && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Delivery by {format(new Date(order.delivery_window_end), "MMM d, yyyy")}
                            </div>
                          )}
                          {order.quantity > 0 && (
                            <div className="text-xs text-muted-foreground">{order.quantity.toLocaleString()} units</div>
                          )}
                        </div>
                        <MilestoneTrack milestones={(order.order_milestones || []) as any} />
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground font-mono">{order.order_number}</span>
                          <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Open order <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="py-8 space-y-4">
                  <div className="p-5 rounded-xl bg-card border border-border">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">How Sourcery works</p>
                    <div className="space-y-4">
                      {[
                        {
                          num: "01",
                          title: "Connect your factory",
                          body: "Invite your manufacturer from the Your Factories tab — they'll get an email with a free account link. Or browse the Sourcery network if you're still sourcing.",
                          action: "Invite a factory →",
                          href: "/dashboard?action=invite",
                        },
                        {
                          num: "02",
                          title: "Create a structured PO",
                          body: "Every order captures the agreed price, incoterms, delivery window, QC standard, and payment milestones. Each field is explained so you know what you're agreeing to before you commit.",
                          action: "Create your first order →",
                          href: "/orders/create",
                        },
                        {
                          num: "03",
                          title: "Issue the PO to your factory",
                          body: "Once the order looks right, issue the formal PO. The factory reviews it and accepts. From here, every step — sampling, revisions, QC, payments — is documented on the order.",
                          action: null,
                          href: null,
                        },
                      ].map((step, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <span className="font-mono text-sm font-bold text-primary/40 flex-shrink-0 mt-0.5 w-6">{step.num}</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground mb-0.5">{step.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-1">{step.body}</p>
                            {step.action && step.href && (
                              <Link to={step.href} className="text-xs text-primary hover:underline font-medium">{step.action}</Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1"><Link to="/orders/create"><Package className="mr-2 h-4 w-4" />Create your first order</Link></Button>
                    <Button variant="outline" asChild><Link to="/directory"><Search className="mr-2 h-4 w-4" />Find a factory</Link></Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Your Factories */}
            <TabsContent value="saved" className="space-y-3">
              {loadingByof ? (
                <div className="space-y-2">{[1,2].map(i=><Skeleton key={i} className="h-16 w-full rounded-xl"/>)}</div>
              ) : byofFactories.length > 0 ? (
                <>
                  {byofFactories.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{f.name}</p>
                          <p className="text-xs text-muted-foreground">{f.city ? `${f.city}, ` : ""}{f.country}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Your factory</span>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/orders/create?factory=${f.id}`}>Create Order</Link>
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/directory"><Search className="mr-2 h-4 w-4" />Browse Sourcery network</Link>
                  </Button>
                </>
              ) : (
                <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
                  <Building2 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-base font-semibold text-foreground mb-1">No factories connected yet</h3>
                  <p className="text-sm text-muted-foreground mb-2 max-w-sm mx-auto">
                    Already working with a manufacturer? Invite them directly — they get a free account and you can start managing orders together immediately.
                  </p>
                  <p className="text-xs text-muted-foreground mb-6 max-w-sm mx-auto">
                    Or browse the Sourcery network to discover vetted factories with real performance scores.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button asChild><Link to="/dashboard?tab=invite"><UserPlus className="mr-2 h-4 w-4" />Invite your factory</Link></Button>
                    <Button variant="outline" asChild><Link to="/directory"><Search className="mr-2 h-4 w-4" />Browse network</Link></Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Inquiries */}
            <TabsContent value="inquiries" className="space-y-3">
              {inquiriesLoading ? (
                <div className="space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-24 w-full rounded-xl"/>)}</div>
              ) : inquiries.length > 0 ? (
                inquiries.map(inquiry => (
                  <div key={inquiry.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {inquiry.factories?.logo_url
                            ? <img src={inquiry.factories.logo_url} alt="" className="w-full h-full rounded-lg object-cover" />
                            : <Building2 className="h-4 w-4 text-primary" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {inquiry.factories ? (
                              <Link to={`/directory/${inquiry.factories.slug}`} className="hover:text-primary transition-colors">
                                {inquiry.factories.name}
                              </Link>
                            ) : "Factory unavailable"}
                          </div>
                          <div className="text-xs text-muted-foreground">{format(new Date(inquiry.created_at), "MMM d, yyyy")}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getInquiryStatusIcon(inquiry.status)}
                        <span className="text-xs text-muted-foreground">
                          {inquiry.status === "new" ? "Awaiting response" : inquiry.status === "replied" ? "Factory replied" : inquiry.status}
                        </span>
                      </div>
                    </div>
                    {inquiry.message && (
                      <div className="mb-3 space-y-1.5">
                        <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">{inquiry.message}</p>
                        {(inquiry as any).factory_reply && (
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-xs font-semibold text-primary mb-1">Factory replied:</p>
                            <p className="text-xs text-foreground leading-relaxed">{(inquiry as any).factory_reply}</p>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {inquiry.factories && (
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/directory/${inquiry.factories.slug}`}>View factory <ArrowRight className="ml-1 h-3 w-3" /></Link>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? null : inquiry.id)}>
                        <MessageSquare className="mr-1.5 h-3 w-3" />
                        {expandedInquiry === inquiry.id ? "Hide thread" : "Message"}
                      </Button>
                      {!inquiry.order_id && inquiry.factory_id && inquiry.conversion_status !== "declined" && (
                        <Button size="sm" onClick={() => {
                          const params = new URLSearchParams({ factory: inquiry.factory_id || "" });
                          navigate(`/orders/create?${params.toString()}`);
                        }} disabled={converting === inquiry.id}>
                          <Package className="mr-1.5 h-3 w-3" />Create order
                        </Button>
                      )}
                    </div>
                    {expandedInquiry === inquiry.id && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <PlatformMessaging inquiryId={inquiry.id} title="Inquiry thread" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-base font-semibold text-foreground mb-1">No inquiries yet</h3>
                  <p className="text-sm text-muted-foreground mb-6">Contact a factory from the directory to start a conversation.</p>
                  <Button asChild><Link to="/directory"><Search className="mr-2 h-4 w-4" />Browse Factories</Link></Button>
                </div>
              )}
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-base font-semibold text-foreground mb-6">Account settings</h3>
                <div className="space-y-6">
                  <div className="max-w-sm space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input type="email" value={user?.email || ""} disabled className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-muted-foreground text-sm" />
                  </div>
                  <div className="border-t border-border pt-6">
                    <h4 className="text-sm font-medium text-foreground mb-4">Notification preferences</h4>
                    <div className="space-y-3">
                      {["Email me when a factory responds to my inquiry", "Email me when a sample is submitted for review", "Email me when a QC report is uploaded"].map(pref => (
                        <label key={pref} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">{pref}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Save changes</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* RFQs */}
            <TabsContent value="rfq">
              <Suspense fallback={<div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>}>
                <RFQDashboard />
              </Suspense>
            </TabsContent>

            {/* RFQs */}
            

            {/* Tools */}
            <TabsContent value="tools" className="space-y-6">

              {/* AI Production Hub */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Production assistant</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Ask anything about your orders, factories, incoterms, QC, or freight</p>
                  </div>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { label: "Help me write a tech pack", prompt: "I need help creating a tech pack for my garment. What should I include and how should I structure it?" },
                    { label: "Analyse my tech pack", prompt: "I have a tech pack — can you help me check if it has everything a factory needs? What am I likely missing?" },
                    { label: "What's my biggest production risk right now?", prompt: "Based on my active orders, what are the biggest risks I should be managing?" },
                    { label: "Explain incoterms for Vietnam sourcing", prompt: "Which incoterms should I use when sourcing from Vietnam? What are the pros and cons of FOB vs DDP for a small brand?" },
                    { label: "How do I structure payment milestones?", prompt: "How should I structure payment milestones for a first order with a new factory?" },
                    { label: "Draft a message to my factory", prompt: "Help me draft a professional message to my factory about a production delay." },
                  ].map(({ label, prompt }) => (
                    <a key={label} href={`/assistant?q=${encodeURIComponent(prompt)}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:border-primary/40 hover:bg-primary/5 transition-all group text-left w-full">
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      <span className="text-sm text-foreground">{label}</span>
                    </a>
                  ))}
                  <Link to="/assistant" className="flex items-center justify-center gap-2 mt-2 p-2.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                    <Sparkles className="h-3.5 w-3.5" />Open full assistant
                  </Link>
                </div>
              </div>

              {/* Tech pack tools */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Tech pack tools</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Create, check, and upload your tech packs</p>
                  </div>
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="divide-y divide-border">
                  {[
                    {
                      title: "What goes in a tech pack",
                      desc: "The complete checklist — technical drawings, measurement chart, fabric spec, trims, labels. What factories actually need.",
                      href: "/resources/tech-pack-guide",
                      tag: "Guide",
                    },
                    {
                      title: "Tech pack template",
                      desc: "A structured template you can fill in and send directly to your factory. Works for any garment category.",
                      href: "/resources/tech-pack-guide",
                      tag: "Template",
                    },
                    {
                      title: "Analyse my tech pack with AI",
                      desc: "Paste your tech pack link and the assistant will flag what's missing and what might cause revision rounds.",
                      href: `/assistant?q=${encodeURIComponent("Can you help me review my tech pack? Here's the link: ")}`,
                      tag: "AI",
                    },
                  ].map(item => (
                    <a key={item.title} href={item.href}
                      className="flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{item.tag}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Key resources */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Production guides</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Essential reading for physical product brands</p>
                  </div>
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="divide-y divide-border">
                  {[
                    { title: "Incoterms explained", desc: "EXW, FOB, CIF, DDP — which to use and what each means for your risk and cost.", href: "/resources" },
                    { title: "AQL quality standards", desc: "What AQL 1.0, 2.5, and 4.0 mean, when to use each, and how inspections work.", href: "/resources" },
                    { title: "Lead time stacking", desc: "Why brands underestimate production by 6 weeks — and how to plan backwards from delivery.", href: "/resources" },
                    { title: "How milestone payments work", desc: "Structuring deposits and final payments to protect yourself without damaging factory trust.", href: "/resources" },
                    { title: "Building a bill of materials", desc: "A BOM that actually works — every material, trim, and component your factory needs.", href: "/resources" },
                  ].map(item => (
                    <a key={item.title} href={item.href}
                      className="flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-0.5">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                    </a>
                  ))}
                  <a href="/resources" className="flex items-center justify-center gap-2 p-3 text-xs text-muted-foreground hover:text-primary transition-colors">
                    View all 33 guides <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Quick links */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Search, title: "Factory directory", desc: "Browse verified factories", href: "/directory" },
                  { icon: Bell, title: "Notifications", desc: "All order events", href: "/notifications" },
                ].map(item => (
                  <a key={item.title} href={item.href}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </a>
                ))}
              </div>

            </TabsContent>
          </Tabs>
        </div>
      </section>
      {/* Floating dashboard VA */}
      <div className="fixed bottom-6 right-6 z-50">
        <ProductionAssistant mode="dashboard" className="w-80 shadow-xl" />
      </div>
    </Layout>
  );
}
