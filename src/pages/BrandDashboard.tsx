import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FactoryCard } from "@/components/marketplace/FactoryCard";
import { EscrowPaymentTracker } from "@/components/platform/EscrowPaymentTracker";
import { QualityDashboard } from "@/components/platform/QualityDashboard";
import { mockFactories } from "@/data/mockData";
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
  Package
} from "lucide-react";

/**
 * Brand Dashboard
 * 
 * API Endpoints:
 * - GET /api/dashboard/brand
 *   Response: { savedCount, inquiryCount, recentActivity[] }
 * 
 * - GET /api/saved-factories
 *   Response: { factories: Factory[], total: number }
 * 
 * - GET /api/inquiries
 *   Response: { inquiries: Inquiry[], total: number }
 */

// Mock inquiries data
const mockInquiries = [
  {
    id: "1",
    factoryName: "Premium Textiles Co.",
    factorySlug: "premium-textiles-co",
    status: "pending",
    sentAt: "2024-01-15",
    message: "Looking for sustainable cotton t-shirt production...",
  },
  {
    id: "2",
    factoryName: "EcoFashion Manufacturing",
    factorySlug: "ecofashion-manufacturing",
    status: "replied",
    sentAt: "2024-01-10",
    message: "Need quote for 500 units of organic denim...",
    reply: "Thank you for your inquiry. We'd be happy to discuss...",
  },
  {
    id: "3",
    factoryName: "Artisan Leather Works",
    factorySlug: "artisan-leather-works",
    status: "declined",
    sentAt: "2024-01-05",
    message: "Interested in leather bag production...",
  },
];

export default function BrandDashboard() {
  const [savedFactories, setSavedFactories] = useState<string[]>(
    mockFactories.slice(0, 3).map(f => f.id)
  );

  const handleUnsave = (factoryId: string) => {
    setSavedFactories(prev => prev.filter(id => id !== factoryId));
  };

  const savedFactoryList = mockFactories.filter(f => savedFactories.includes(f.id));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "replied":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "declined":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Awaiting Response";
      case "replied":
        return "Factory Replied";
      case "declined":
        return "Declined";
      default:
        return status;
    }
  };

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
                    {mockInquiries.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Inquiries</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {mockInquiries.filter(i => i.status === "replied").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Responses Received</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="orders" className="space-y-6">
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
            <TabsContent value="orders" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Payment Tracking</h3>
                  <EscrowPaymentTracker />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quality Assurance</h3>
                  <QualityDashboard />
                </div>
              </div>
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
              {mockInquiries.length > 0 ? (
                <div className="space-y-4">
                  {mockInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="bg-card border border-border rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <Link 
                              to={`/directory/${inquiry.factorySlug}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors"
                            >
                              {inquiry.factoryName}
                            </Link>
                            <div className="text-sm text-muted-foreground">
                              Sent on {inquiry.sentAt}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(inquiry.status)}
                          <span className="text-sm text-muted-foreground">
                            {getStatusLabel(inquiry.status)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-foreground">{inquiry.message}</p>
                      </div>

                      {inquiry.reply && (
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                          <div className="text-xs text-primary font-medium mb-1">
                            Factory Response
                          </div>
                          <p className="text-sm text-foreground">{inquiry.reply}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/directory/${inquiry.factorySlug}`}>
                            View Factory
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
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
                        Company Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Acme Brands Inc."
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="contact@acmebrands.com"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
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
