import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { AdminQCPartners } from "@/components/admin/AdminQCPartners";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminDisputesTable } from "@/components/admin/AdminDisputesTable";
import { toast } from "sonner";
import { 
  Shield,
  LayoutDashboard,
  Package,
  Users,
  ClipboardCheck,
  BarChart3,
  AlertTriangle,
  Loader2
} from "lucide-react";

// Mock data for demonstration
const mockStats = { orders: 0, brands: 0, factories: 0, qc: 0, disputes: 0 };

const mockOrders = [
  { id: "1", order_number: "ORD-2024-001", buyer_name: "Fashion Brand Co", factory_name: "Eco Textiles Portugal", status: "in_production", total_amount: 45000, currency: "USD", created_at: "2024-01-15", has_dispute: false, qc_assigned: true },
  { id: "2", order_number: "ORD-2024-002", buyer_name: "Urban Wear Ltd", factory_name: "Milano Leather Works", status: "qc_scheduled", total_amount: 28000, currency: "USD", created_at: "2024-01-18", has_dispute: false, qc_assigned: true },
  { id: "3", order_number: "ORD-2024-003", buyer_name: "Green Apparel Inc", factory_name: "Bengal Garments", status: "disputed", total_amount: 72000, currency: "USD", created_at: "2024-01-10", has_dispute: true, qc_assigned: true },
  { id: "4", order_number: "ORD-2024-004", buyer_name: "Luxe Fashion", factory_name: "Turkish Denim Co", status: "shipped", total_amount: 156000, currency: "USD", created_at: "2024-01-05", has_dispute: false, qc_assigned: true },
  { id: "5", order_number: "ORD-2024-005", buyer_name: "Eco Brands", factory_name: "Vietnam Textiles", status: "draft", total_amount: 34000, currency: "USD", created_at: "2024-01-20", has_dispute: false, qc_assigned: false },
];

const mockUsers = [
  { id: "1", email: "admin@sourcery.so", role: "admin" as const, created_at: "2023-06-01", last_sign_in: "2024-01-20", is_factory_user: false },
  { id: "2", email: "john@fashionbrand.com", role: "user" as const, created_at: "2023-09-15", last_sign_in: "2024-01-19", is_factory_user: false },
  { id: "3", email: "contact@ecotextiles.pt", role: "user" as const, created_at: "2023-08-20", last_sign_in: "2024-01-20", factory_name: "Eco Textiles Portugal", is_factory_user: true },
  { id: "4", email: "mod@sourcery.so", role: "moderator" as const, created_at: "2023-07-10", last_sign_in: "2024-01-18", is_factory_user: false },
];

const mockQCPartners = [
  { id: "1", name: "Asia Quality Focus", location: "Shanghai, China", is_verified: true, created_at: "2023-05-01", active_assignments: 12 },
  { id: "2", name: "Euro Inspection Services", location: "Milan, Italy", is_verified: true, created_at: "2023-06-15", active_assignments: 8 },
  { id: "3", name: "Quality First BD", location: "Dhaka, Bangladesh", is_verified: false, created_at: "2024-01-10", active_assignments: 3 },
];

const mockDisputes = [
  { id: "1", order_id: "3", order_number: "ORD-2024-003", reason: "Quality issues with fabric - does not match approved sample", status: "open" as const, initiated_by_email: "john@fashionbrand.com", created_at: "2024-01-18", resolution: null, resolved_at: null },
  { id: "2", order_id: "6", order_number: "ORD-2023-089", reason: "Delayed shipment beyond agreed delivery window", status: "escalated" as const, initiated_by_email: "buyer@ecobrands.com", created_at: "2024-01-12", resolution: null, resolved_at: null },
  { id: "3", order_id: "7", order_number: "ORD-2023-078", reason: "Incorrect sizing on 30% of units", status: "resolved" as const, initiated_by_email: "orders@luxefashion.com", created_at: "2024-01-05", resolution: "Factory agreed to remake affected units at no cost", resolved_at: "2024-01-15" },
];

export default function Admin() {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  const handleViewOrder = (orderId: string) => toast.info(`Viewing order ${orderId}`);
  const handleOpenDispute = (orderId: string) => toast.info(`Opening dispute for ${orderId}`);
  const handleReleaseMilestone = (orderId: string) => toast.info(`Releasing milestone for ${orderId}`);
  const handleAssignQC = (orderId: string) => toast.info(`Assigning QC for ${orderId}`);
  const handleRoleChange = (userId: string, role: string) => toast.success(`Role updated to ${role}`);
  const handleDeleteUser = (userId: string) => toast.success("User deleted");
  const handleAddQCPartner = (name: string) => toast.success(`Added QC partner: ${name}`);
  const handleAssignToOrder = (partnerId: string, orderId: string) => toast.success("QC partner assigned");
  const handleVerifyPartner = (partnerId: string, verified: boolean) => toast.success(verified ? "Partner verified" : "Verification removed");
  const handleResolveDispute = (disputeId: string) => toast.success("Dispute resolved");
  const handleEscalateDispute = (disputeId: string) => toast.success("Dispute escalated");

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) return null;

  return (
    <Layout>
      <SEO title="Admin Dashboard | Sourcery" description="Platform administration and management." />
      
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform overview and management</p>
            </div>
          </motion.div>

          <AdminStats stats={mockStats} />

          <Tabs defaultValue="overview" className="mt-8 space-y-6">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="h-4 w-4" />Overview</TabsTrigger>
              <TabsTrigger value="orders" className="gap-2"><Package className="h-4 w-4" />Orders</TabsTrigger>
              <TabsTrigger value="disputes" className="gap-2"><AlertTriangle className="h-4 w-4" />Disputes</TabsTrigger>
              <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" />Users</TabsTrigger>
              <TabsTrigger value="qc" className="gap-2"><ClipboardCheck className="h-4 w-4" />QC Partners</TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview"><AdminAnalytics /></TabsContent>
            <TabsContent value="orders">
              <AdminOrdersTable orders={mockOrders} onViewOrder={handleViewOrder} onOpenDispute={handleOpenDispute} onReleaseMilestone={handleReleaseMilestone} onAssignQC={handleAssignQC} />
            </TabsContent>
            <TabsContent value="disputes">
              <AdminDisputesTable disputes={mockDisputes} onResolve={handleResolveDispute} onEscalate={handleEscalateDispute} onViewOrder={handleViewOrder} />
            </TabsContent>
            <TabsContent value="users">
              <AdminUsersTable users={mockUsers} onRoleChange={handleRoleChange} onDeleteUser={handleDeleteUser} />
            </TabsContent>
            <TabsContent value="qc">
              <AdminQCPartners partners={mockQCPartners} pendingOrders={mockOrders.filter(o => !o.qc_assigned)} onAddPartner={handleAddQCPartner} onAssignToOrder={handleAssignToOrder} onVerifyPartner={handleVerifyPartner} />
            </TabsContent>
            <TabsContent value="analytics"><AdminAnalytics /></TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
