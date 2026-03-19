import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useInquiries, type InquiryWithFactory } from "@/hooks/useInquiries";
import { useOrders, type OrderWithDetails } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Building2, MessageSquare, Settings, Search,
  Clock, CheckCircle, XCircle, ArrowRight, Package,
  RefreshCw, Loader2, UserPlus, AlertCircle, ChevronRight
} from "lucide-react";
import { format } from "date-fns";

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

export default function BrandDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { inquiries, isLoading: inquiriesLoading, refetch: refetchInquiries } = useInquiries();
  const { orders, isLoading: ordersLoading, refetch: refetchOrders } = useOrders();
  const [byofFactories, setByofFactories] = useState<Array<{ id: string; name: string; city: string | null; country: string }>>([]);
  const [loadingByof, setLoadingByof] = useState(true);
  const [converting, setConverting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("factories").select("id, name, city, country")
      .eq("is_byof", true).eq("invited_by", user.id)
      .then(({ data }) => { setByofFactories(data || []); setLoadingByof(false); });
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
    const { data, error } = await supabase.functions.invoke("convert-inquiry-to-order", { body: { inquiry_id: inquiryId } });
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
              <Link to="/orders/create">
                <Button>
                  <Package className="mr-2 h-4 w-4" />
                  Create Order
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Action banner — only when something needs attention */}
          {needsActionOrders.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 space-y-2">
              {needsActionOrders.map(order => (
                <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between p-4 rounded-xl bg-amber-500/8 border border-amber-500/25 hover:bg-amber-500/12 transition-colors group">
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
                        needsAction ? "border-amber-400/40 bg-amber-500/3" : isClosed ? "border-border opacity-70" : "border-border",
                        highlightId === order.id && "ring-2 ring-primary/20 border-primary"
                      )}>
                        {needsAction && (
                          <div className="flex items-center gap-1.5 mb-3 text-xs font-medium text-amber-700">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Action required
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-mono text-xs text-muted-foreground mb-0.5">{order.order_number}</div>
                            <div className="font-semibold text-foreground text-sm">
                              {order.factories?.name || "Factory"}
                            </div>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>
                        {priceStr && <div className="text-xs text-muted-foreground mb-1">{priceStr}</div>}
                        <MilestoneTrack milestones={(order.order_milestones || []) as any} />
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(order.created_at || Date.now()), "MMM d, yyyy")}
                          </span>
                          <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Open order <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
                  <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-base font-semibold text-foreground mb-1">No orders yet</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                    Invite your factory and create your first order in under 10 minutes.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button asChild><Link to="/orders/create"><Package className="mr-2 h-4 w-4" />Create Order</Link></Button>
                    <Button variant="outline" asChild><Link to="/directory"><Search className="mr-2 h-4 w-4" />Browse Network</Link></Button>
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
                  <h3 className="text-base font-semibold text-foreground mb-1">No factories yet</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                    Bring your existing factory relationships onto Sourcery, or find new ones in the network.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button asChild><Link to="/dashboard?tab=invite"><UserPlus className="mr-2 h-4 w-4" />Invite a Factory</Link></Button>
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
                      <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3 line-clamp-2 mb-3">{inquiry.message}</p>
                    )}
                    <div className="flex gap-2">
                      {inquiry.factories && (
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/directory/${inquiry.factories.slug}`}>View factory <ArrowRight className="ml-1 h-3 w-3" /></Link>
                        </Button>
                      )}
                      {!inquiry.order_id && inquiry.factory_id && inquiry.conversion_status !== "declined" && (
                        <Button size="sm" onClick={() => handleConvert(inquiry.id)} disabled={converting === inquiry.id}>
                          {converting === inquiry.id ? <><RefreshCw className="mr-1.5 h-3 w-3 animate-spin" />Converting...</> : <><Package className="mr-1.5 h-3 w-3" />Convert to order</>}
                        </Button>
                      )}
                    </div>
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
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
