import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield,
  FileText,
  Users,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Building2,
  MapPin,
  Mail,
  Globe,
  Award,
  AlertTriangle
} from "lucide-react";

/**
 * Admin Panel
 * 
 * API Endpoints:
 * - GET /api/admin/applications
 *   Query: { status?: string, page?: number }
 *   Response: { applications: Application[], total: number }
 * 
 * - GET /api/admin/applications/:id
 *   Response: Application (full details)
 * 
 * - POST /api/admin/applications/:id/decision
 *   Request: { decision: "approve" | "reject", feedback?: string }
 *   Response: { success: boolean }
 */

// Mock applications data
const mockApplications = [
  {
    id: "app-1",
    factoryName: "Eco Textiles Portugal",
    country: "Portugal",
    city: "Porto",
    email: "contact@ecotextiles.pt",
    website: "https://ecotextiles.pt",
    factoryType: "Full Package",
    categories: ["Apparel", "Textiles", "Knitwear"],
    moqMin: 200,
    leadTime: 4,
    employees: 120,
    certifications: ["GOTS", "OEKO-TEX", "BSCI"],
    status: "pending",
    submittedAt: "2024-01-20",
    description: "Sustainable textile manufacturer with 25 years of experience in European fashion production.",
  },
  {
    id: "app-2",
    factoryName: "Milano Leather Works",
    country: "Italy",
    city: "Milan",
    email: "sales@milanoleather.it",
    website: "https://milanoleather.it",
    factoryType: "OEM",
    categories: ["Leather Goods", "Accessories"],
    moqMin: 50,
    leadTime: 6,
    employees: 45,
    certifications: ["ISO 9001", "LWG"],
    status: "pending",
    submittedAt: "2024-01-19",
    description: "Artisan leather goods manufacturer specializing in luxury handbags and accessories.",
  },
  {
    id: "app-3",
    factoryName: "Bengal Garments Ltd",
    country: "Bangladesh",
    city: "Dhaka",
    email: "export@bengalgarments.bd",
    website: "https://bengalgarments.com",
    factoryType: "CMT",
    categories: ["Apparel", "Denim", "Activewear"],
    moqMin: 1000,
    leadTime: 8,
    employees: 800,
    certifications: ["WRAP", "SEDEX", "ISO 14001"],
    status: "approved",
    submittedAt: "2024-01-15",
    description: "Large-scale garment manufacturer with capacity for high-volume orders.",
  },
  {
    id: "app-4",
    factoryName: "Quick Fashion Co",
    country: "China",
    city: "Guangzhou",
    email: "info@quickfashion.cn",
    factoryType: "ODM",
    categories: ["Apparel"],
    moqMin: 500,
    leadTime: 3,
    employees: 200,
    certifications: [],
    status: "rejected",
    submittedAt: "2024-01-10",
    description: "Fast fashion manufacturer.",
    rejectionReason: "Insufficient quality documentation and no sustainability certifications.",
  },
];

export default function Admin() {
  const [selectedApplication, setSelectedApplication] = useState<typeof mockApplications[0] | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredApplications = mockApplications.filter(app => 
    filterStatus === "all" || app.status === filterStatus
  );

  const handleDecision = (decision: "approve" | "reject") => {
    // API Call: POST /api/admin/applications/:id/decision
    console.log("Decision:", { 
      applicationId: selectedApplication?.id, 
      decision, 
      feedback: feedbackText 
    });
    setSelectedApplication(null);
    setFeedbackText("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            <Clock className="h-3 w-3" />
            Pending Review
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <SEO 
        title="Admin Panel | Manufactory" 
        description="Manage factory applications and platform settings."
      />
      
      <section className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-muted-foreground">
                Manage applications and platform settings
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {mockApplications.filter(a => a.status === "pending").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {mockApplications.filter(a => a.status === "approved").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {mockApplications.filter(a => a.status === "rejected").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {mockApplications.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Applications</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Applications List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">Filter:</span>
                    {["all", "pending", "approved", "rejected"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          filterStatus === status
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>

                  {filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApplication(app)}
                      className={`bg-card border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
                        selectedApplication?.id === app.id
                          ? "border-primary ring-1 ring-primary"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {app.factoryName}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {app.city}, {app.country}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {app.categories.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Submitted: {app.submittedAt}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Application Detail */}
                <div className="lg:col-span-1">
                  {selectedApplication ? (
                    <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">
                          Application Details
                        </h3>
                        {getStatusBadge(selectedApplication.status)}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Factory Name
                          </div>
                          <div className="font-medium text-foreground">
                            {selectedApplication.factoryName}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Location
                            </div>
                            <div className="text-sm text-foreground">
                              {selectedApplication.city}, {selectedApplication.country}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Type
                            </div>
                            <div className="text-sm text-foreground">
                              {selectedApplication.factoryType}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              MOQ
                            </div>
                            <div className="text-sm text-foreground">
                              {selectedApplication.moqMin} units
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Employees
                            </div>
                            <div className="text-sm text-foreground">
                              {selectedApplication.employees}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Contact
                          </div>
                          <div className="text-sm text-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {selectedApplication.email}
                          </div>
                          {selectedApplication.website && (
                            <div className="text-sm text-primary flex items-center gap-1 mt-1">
                              <Globe className="h-3 w-3" />
                              {selectedApplication.website}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Certifications
                          </div>
                          {selectedApplication.certifications.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedApplication.certifications.map((cert) => (
                                <span
                                  key={cert}
                                  className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded flex items-center gap-1"
                                >
                                  <Award className="h-3 w-3" />
                                  {cert}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                              <AlertTriangle className="h-3 w-3" />
                              No certifications
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Description
                          </div>
                          <div className="text-sm text-foreground">
                            {selectedApplication.description}
                          </div>
                        </div>

                        {selectedApplication.status === "pending" && (
                          <>
                            <div className="border-t border-border pt-4">
                              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                Feedback (Optional)
                              </div>
                              <Textarea
                                placeholder="Add feedback for the applicant..."
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                rows={3}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                className="flex-1"
                                onClick={() => handleDecision("approve")}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => handleDecision("reject")}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          </>
                        )}

                        {selectedApplication.status === "rejected" && selectedApplication.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="text-xs text-red-600 font-medium mb-1">
                              Rejection Reason
                            </div>
                            <div className="text-sm text-red-800">
                              {selectedApplication.rejectionReason}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                      <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Select an application to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  User Management
                </h3>
                <p className="text-muted-foreground">
                  User management interface will be displayed here.
                </p>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Platform Settings
                </h3>
                <p className="text-muted-foreground">
                  Platform settings interface will be displayed here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
