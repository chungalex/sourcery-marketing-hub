import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FactoryCard } from "@/components/marketplace/FactoryCard";
import { EscrowPaymentTracker } from "@/components/platform/EscrowPaymentTracker";
import { QualityDashboard } from "@/components/platform/QualityDashboard";
import { mockFactories } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { useInquiries, type InquiryWithFactory } from "@/hooks/useInquiries";
import { useOrders, type OrderWithDetails } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  Heart, 
  MessageSquare, 
  Settings,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Package,
  RefreshCw,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

// Milestone Progress Component
function MilestoneProgress({ milestones }: { milestones: { status: string; percentage: number; sequence_order: number }[] }) {
  if (!milestones || milestones.length === 0) return null;
  
  const sortedMilestones = [...milestones].sort((a, b) => a.sequence_order - b.sequence_order);
  const releasedCount = sortedMilestones.filter(m => m.status === 'released').length;
  const totalPercentReleased = sortedMilestones
    .filter(m => m.status === 'released')
    .reduce((acc, m) => acc + m.percentage, 0);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{releasedCount}/{sortedMilestones.length} milestones</span>
        <span>{totalPercentReleased}% released</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${totalPercentReleased}%` }}
        />
      </div>
    </div>
  );
}

// Order Status Badge Component
function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
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
  
  const config = statusConfig[status] || { label: status, variant: "outline" as const };
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// Price formatting helper
function formatOrderPrice(order: OrderWithDetails) {
  if (!order.unit_price || order.unit_price === 0) {
    return {
      priceDisplay: null,
      totalDisplay: null,
      showTotal: false
    };
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: order.currency || 'USD'
  });
  
  return {
    priceDisplay: `${order.quantity.toLocaleString()} × ${formatter.format(order.unit_price)}`,
    totalDisplay: formatter.format(order.total_amount || order.quantity * order.unit_price),
    showTotal: true
  };
}

// Status helpers for inquiries
const getStatusIcon = (status: string) => {
  switch (status) {
    case "new":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "replied":
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case "declined":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "closed":
      return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "new": return "Awaiting Response";
    case "replied": return "Factory Replied";
    case "declined": return "Declined";
    case "closed": return "Closed";
    default: return status;
  }
};

// Check if inquiry can be converted to order
const canConvert = (inquiry: InquiryWithFactory): boolean => {
  return (
    inquiry.order_id === null &&           // Primary: not already converted
    inquiry.factory_id !== null &&         // Has factory to convert to
    inquiry.conversion_status !== 'declined' // Not declined
  );
};

// Loading skeletons
function InquiriesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-64 mb-4" />
          <Skeleton className="h-8 w-full" />
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
  
  const [converting, setConverting] = useState<string | null>(null);
  const [savedFactories, setSavedFactories] = useState<string[]>(
    mockFactories.slice(0, 3).map(f => f.id)
  );

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/dashboard');
    }
  }, [user, authLoading, navigate]);

  // Handle tab from URL
  const defaultTab = searchParams.get('tab') || 'orders';
  const highlightId = searchParams.get('highlight');

  const handleUnsave = (factoryId: string) => {
    setSavedFactories(prev => prev.filter(id => id !== factoryId));
  };

  const savedFactoryList = mockFactories.filter(f => savedFactories.includes(f.id));

  // Convert inquiry to order
  const handleConvert = async (inquiryId: string) => {
    setConverting(inquiryId);
    
    const { data, error } = await supabase.functions.invoke('convert-inquiry-to-order', {
      body: { inquiry_id: inquiryId }
    });
    
    if (error || !data?.success) {
      toast.error(data?.error || 'Failed to convert inquiry');
      setConverting(null);
      return;
    }
    
    toast.success(`Order ${data.order_number} created!`);
    refetchInquiries();
    refetchOrders();
    
    // Navigate to orders tab with highlight
    navigate(`/dashboard?tab=orders&highlight=${data.order_id}`);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-wide flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <Layout>
      <SEO 
        title="Dashboard | Manufactory" 
        description="Manage your saved factories and inquiries."
      />
      
      <section className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Manage your saved factories and track your inquiries
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {savedFactories.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Saved Factories</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {inquiriesLoading ? "..." : inquiries.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Inquiries</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {ordersLoading ? "..." : orders.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Orders</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Saved Factories
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Inquiries
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              {ordersLoading ? (
                <OrdersSkeleton />
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const priceInfo = formatOrderPrice(order);
                    const isHighlighted = highlightId === order.id;
                    
                    return (
                      <div
                        key={order.id}
                        className={cn(
                          "bg-card border rounded-xl p-6 transition-all",
                          isHighlighted && "border-primary ring-2 ring-primary/20"
                        )}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="font-mono text-sm text-muted-foreground mb-1">
                              {order.order_number}
                            </div>
                            {order.factories ? (
                              <Link 
                                to={`/directory/${order.factories.slug}`}
                                className="font-semibold text-foreground hover:text-primary transition-colors"
                              >
                                {order.factories.name}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">Factory unavailable</span>
                            )}
                          </div>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        
                        {/* Price display with unit_price=0 handling */}
                        <div className="text-sm text-muted-foreground mb-4">
                          {priceInfo.showTotal ? (
                            <>
                              <span>{priceInfo.priceDisplay}</span>
                              <span className="font-semibold text-foreground ml-2">
                                = {priceInfo.totalDisplay}
                              </span>
                            </>
                          ) : (
                            <span className="text-amber-600 font-medium">
                              {order.quantity.toLocaleString()} units • Price not set
                            </span>
                          )}
                        </div>
                        
                        {/* Milestone Progress */}
                        <MilestoneProgress milestones={order.order_milestones || []} />
                        
                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          {order.status === 'draft' && (
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/orders/${order.id}`}>
                                View Draft
                              </Link>
                            </Button>
                          )}
                          {order.factories && (
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/directory/${order.factories.slug}`}>
                                View Factory
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No orders yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Convert an inquiry to start an order with a factory
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/directory">
                      <Search className="mr-2 h-4 w-4" />
                      Browse Factories
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Saved Factories Tab */}
            <TabsContent value="saved" className="space-y-6">
              {savedFactoryList.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedFactoryList.map((factory) => (
                      <FactoryCard
                        key={factory.id}
                        factory={factory}
                        isSaved={true}
                        onSave={handleUnsave}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <Button variant="outline" asChild>
                      <Link to="/directory">
                        <Search className="mr-2 h-4 w-4" />
                        Browse More Factories
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No saved factories yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring our directory to find manufacturers
                  </p>
                  <Button asChild>
                    <Link to="/directory">
                      <Search className="mr-2 h-4 w-4" />
                      Browse Factories
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Inquiries Tab */}
            <TabsContent value="inquiries" className="space-y-4">
              {inquiriesLoading ? (
                <InquiriesSkeleton />
              ) : inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="bg-card border border-border rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {inquiry.factories?.logo_url ? (
                            <img 
                              src={inquiry.factories.logo_url} 
                              alt={inquiry.factories.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                          )}
                          <div>
                            {inquiry.factories ? (
                              <Link 
                                to={`/directory/${inquiry.factories.slug}`}
                                className="font-semibold text-foreground hover:text-primary transition-colors"
                              >
                                {inquiry.factories.name}
                              </Link>
                            ) : (
                              <span className="font-semibold text-muted-foreground">
                                Factory unavailable
                              </span>
                            )}
                            <div className="text-sm text-muted-foreground">
                              Sent {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(inquiry.status)}
                          <span className="text-sm text-muted-foreground">
                            {getStatusLabel(inquiry.status)}
                          </span>
                          {inquiry.conversion_status === 'converted' && (
                            <Badge variant="secondary" className="ml-2">
                              Converted to Order
                            </Badge>
                          )}
                        </div>
                      </div>

                      {inquiry.message && (
                        <div className="bg-muted/50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">
                            {inquiry.message}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {inquiry.factories && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/directory/${inquiry.factories.slug}`}>
                              View Factory
                              <ArrowRight className="ml-2 h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                        {canConvert(inquiry) && (
                          <Button 
                            size="sm" 
                            onClick={() => handleConvert(inquiry.id)}
                            disabled={converting === inquiry.id}
                          >
                            {converting === inquiry.id ? (
                              <>
                                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                Converting...
                              </>
                            ) : (
                              <>
                                <Package className="mr-2 h-3 w-3" />
                                Convert to Order
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No inquiries yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Contact factories to start a conversation
                  </p>
                  <Button asChild>
                    <Link to="/directory">
                      <Search className="mr-2 h-4 w-4" />
                      Browse Factories
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Account Settings
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h4 className="font-medium text-foreground mb-4">
                      Notification Preferences
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-foreground">
                          Email me when a factory responds to my inquiry
                        </span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-foreground">
                          Weekly digest of new factories matching my interests
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
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
