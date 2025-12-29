import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  MessageSquare, 
  BarChart3,
  Settings,
  Eye,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Send,
  ExternalLink
} from "lucide-react";
import { ProfileViewsChart, InquirySourcesChart, InquiryStatusChart } from "@/components/dashboard/AnalyticsCharts";

/**
 * Factory Dashboard
 * 
 * API Endpoints:
 * - GET /api/dashboard/factory
 *   Response: { profile: Factory, stats: FactoryStats, inquiries: Inquiry[] }
 * 
 * - PUT /api/factories/:id
 *   Request: Partial<Factory>
 *   Response: { factory: Factory }
 * 
 * - GET /api/factories/:id/inquiries
 *   Response: { inquiries: Inquiry[], total: number }
 * 
 * - POST /api/inquiries/:id/respond
 *   Request: { message: string }
 *   Response: { success: boolean }
 */

// Mock stats
const mockStats = {
  profileViews: 1247,
  viewsChange: 12,
  inquiriesReceived: 23,
  inquiriesChange: 8,
  profileCompleteness: 85,
  savedByBrands: 156,
};

// Mock inquiries from brands
const mockInquiries = [
  {
    id: "1",
    brandName: "Nordic Apparel Co.",
    brandEmail: "sourcing@nordicapparel.com",
    status: "new",
    receivedAt: "2024-01-20",
    message: "We're looking for a manufacturer for our upcoming spring collection. Need 2000 units of organic cotton t-shirts. Can you provide a quote?",
  },
  {
    id: "2",
    brandName: "Urban Style Brands",
    brandEmail: "production@urbanstyle.com",
    status: "replied",
    receivedAt: "2024-01-18",
    message: "Interested in your denim production capabilities. We need a partner for our new sustainable denim line.",
    reply: "Thank you for your interest! We'd be happy to discuss your denim production needs...",
  },
  {
    id: "3",
    brandName: "EcoWear Collective",
    brandEmail: "hello@ecowear.co",
    status: "new",
    receivedAt: "2024-01-17",
    message: "Looking for GOTS certified manufacturer for organic baby clothing line. MOQ requirements?",
  },
];

export default function FactoryDashboard() {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const handleSendReply = (inquiryId: string) => {
    // API Call: POST /api/inquiries/:id/respond
    console.log("Sending reply:", { inquiryId, message: replyMessage });
    setReplyingTo(null);
    setReplyMessage("");
  };

  return (
    <Layout>
      <SEO 
        title="Factory Dashboard | Manufactory" 
        description="Manage your factory profile, respond to inquiries, and track your performance."
      />
      
      <section className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Factory Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your profile and connect with brands
              </p>
            </div>
            <Button asChild>
              <Link to="/directory/your-factory-slug">
                <Eye className="mr-2 h-4 w-4" />
                View Public Profile
              </Link>
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{mockStats.viewsChange}%
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {mockStats.profileViews.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Profile Views</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{mockStats.inquiriesChange}%
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {mockStats.inquiriesReceived}
              </div>
              <div className="text-sm text-muted-foreground">Inquiries Received</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {mockStats.savedByBrands}
              </div>
              <div className="text-sm text-muted-foreground">Saved by Brands</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {mockStats.profileCompleteness}%
              </div>
              <div className="text-sm text-muted-foreground">Profile Complete</div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="inquiries" className="space-y-6">
            <TabsList>
              <TabsTrigger value="inquiries" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Inquiries
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {mockInquiries.filter(i => i.status === "new").length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Inquiries Tab */}
            <TabsContent value="inquiries" className="space-y-4">
              {mockInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={`bg-card border rounded-xl p-6 ${
                    inquiry.status === "new" 
                      ? "border-primary/50 bg-primary/5" 
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {inquiry.brandName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {inquiry.brandEmail}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {inquiry.status === "new" ? (
                        <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                          New
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Replied
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {inquiry.receivedAt}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-foreground">{inquiry.message}</p>
                  </div>

                  {inquiry.reply && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 mb-4">
                      <div className="text-xs text-green-600 font-medium mb-1">
                        Your Response
                      </div>
                      <p className="text-sm text-foreground">{inquiry.reply}</p>
                    </div>
                  )}

                  {replyingTo === inquiry.id ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Write your response..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={4}
                      />
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleSendReply(inquiry.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Reply
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyMessage("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {inquiry.status === "new" && (
                        <Button onClick={() => setReplyingTo(inquiry.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Reply
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-3 w-3" />
                        View Brand
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Edit Factory Profile
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    Profile completeness: {mockStats.profileCompleteness}%
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Factory Name</Label>
                      <Input defaultValue="Premium Textiles Co." />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input defaultValue="https://premiumtextiles.pt" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      defaultValue="Leading textile manufacturer specializing in sustainable fashion production..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Minimum MOQ</Label>
                      <Input type="number" defaultValue="200" />
                    </div>
                    <div className="space-y-2">
                      <Label>Lead Time (weeks)</Label>
                      <Input type="number" defaultValue="4" />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Employees</Label>
                      <Input type="number" defaultValue="150" />
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h4 className="font-medium text-foreground mb-4">Gallery</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i}
                          className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors"
                        >
                          <span className="text-sm text-muted-foreground">+ Add</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Preview</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Performance Analytics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Profile Views (Last 30 Days)</h4>
                    <ProfileViewsChart />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Inquiry Sources</h4>
                    <InquirySourcesChart />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium text-foreground mb-4">Inquiry Status</h4>
                  <InquiryStatusChart />
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium text-foreground mb-4">Top Search Terms</h4>
                  <div className="flex flex-wrap gap-2">
                    {["sustainable textiles", "organic cotton", "GOTS certified", "Portugal manufacturer"].map((term) => (
                      <span 
                        key={term}
                        className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                      <Label>Contact Email</Label>
                      <Input type="email" defaultValue="contact@premiumtextiles.pt" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input defaultValue="+351 123 456 789" />
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
                          Email me when I receive a new inquiry
                        </span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-foreground">
                          Weekly analytics summary
                        </span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-foreground">
                          Marketing and promotional emails
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h4 className="font-medium text-foreground mb-4">Subscription</h4>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">Growth Plan</div>
                          <div className="text-sm text-muted-foreground">
                            $49/month • Renews on Feb 15, 2024
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage Plan
                        </Button>
                      </div>
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
