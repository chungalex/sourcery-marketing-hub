import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ClipboardCheck, 
  Camera, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  FileText,
  Upload,
  Calendar,
  TrendingUp,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Inspection {
  id: string;
  type: "pre-production" | "in-line" | "final" | "pre-shipment";
  status: "scheduled" | "in-progress" | "passed" | "failed" | "pending";
  date: string;
  inspector?: string;
  score?: number;
  findings?: string[];
}

interface DefectReport {
  id: string;
  title: string;
  severity: "minor" | "major" | "critical";
  status: "open" | "investigating" | "resolved";
  reportedDate: string;
  images: number;
  description: string;
}

const mockInspections: Inspection[] = [
  {
    id: "1",
    type: "pre-production",
    status: "passed",
    date: "Jan 10, 2024",
    inspector: "QC Team A",
    score: 95,
    findings: ["Fabric quality verified", "Color matching approved"]
  },
  {
    id: "2",
    type: "in-line",
    status: "passed",
    date: "Jan 18, 2024",
    inspector: "QC Team A",
    score: 92,
    findings: ["Stitching quality good", "Minor sizing adjustment needed"]
  },
  {
    id: "3",
    type: "final",
    status: "in-progress",
    date: "Jan 25, 2024",
    inspector: "QC Team B",
  },
  {
    id: "4",
    type: "pre-shipment",
    status: "scheduled",
    date: "Jan 28, 2024",
  },
];

const mockDefects: DefectReport[] = [
  {
    id: "1",
    title: "Color variation on batch #23",
    severity: "minor",
    status: "resolved",
    reportedDate: "Jan 15, 2024",
    images: 3,
    description: "Slight color difference between batch 23 and reference sample"
  },
  {
    id: "2",
    title: "Stitching issue on side seams",
    severity: "major",
    status: "investigating",
    reportedDate: "Jan 20, 2024",
    images: 5,
    description: "Inconsistent stitching tension on 12 units"
  },
];

interface QualityDashboardProps {
  orderId?: string;
  className?: string;
}

export function QualityDashboard({ orderId = "ORD-2024-001", className }: QualityDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("inspections");

  const getStatusColor = (status: Inspection["status"]) => {
    switch (status) {
      case "passed":
        return "bg-emerald-500/10 text-emerald-600";
      case "failed":
        return "bg-destructive/10 text-destructive";
      case "in-progress":
        return "bg-primary/10 text-primary";
      case "scheduled":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: Inspection["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: DefectReport["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/10 text-destructive";
      case "major":
        return "bg-amber-500/10 text-amber-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const overallScore = Math.round(
    mockInspections
      .filter(i => i.score)
      .reduce((sum, i) => sum + (i.score || 0), 0) / 
    mockInspections.filter(i => i.score).length
  );

  const passedInspections = mockInspections.filter(i => i.status === "passed").length;

  return (
    <div className={cn("bg-card border border-border rounded-xl p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">
              Quality Assurance
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Order {orderId} • Quality tracking and inspections
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Inspection
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{overallScore}%</div>
          <div className="text-sm text-muted-foreground">Quality Score</div>
        </div>
        <div className="bg-emerald-500/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{passedInspections}</div>
          <div className="text-sm text-emerald-600">Passed</div>
        </div>
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{mockInspections.filter(i => i.status === "in-progress").length}</div>
          <div className="text-sm text-primary">In Progress</div>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{mockDefects.filter(d => d.status !== "resolved").length}</div>
          <div className="text-sm text-amber-600">Open Issues</div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="inspections" className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Inspections
          </TabsTrigger>
          <TabsTrigger value="defects" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Defect Reports
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="space-y-4">
          {/* Timeline */}
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-4">
              {mockInspections.map((inspection, index) => (
                <motion.div
                  key={inspection.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4 pl-12"
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    "absolute left-4 w-4 h-4 rounded-full border-2 border-background",
                    inspection.status === "passed" && "bg-emerald-500",
                    inspection.status === "in-progress" && "bg-primary",
                    inspection.status === "scheduled" && "bg-muted-foreground",
                    inspection.status === "failed" && "bg-destructive"
                  )} />

                  <div className="flex-1 bg-muted/30 rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground capitalize">
                          {inspection.type.replace("-", " ")} Inspection
                        </h4>
                        <Badge className={cn("text-xs", getStatusColor(inspection.status))}>
                          {getStatusIcon(inspection.status)}
                          <span className="ml-1 capitalize">{inspection.status}</span>
                        </Badge>
                      </div>
                      {inspection.score && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="font-semibold text-emerald-600">
                            {inspection.score}%
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {inspection.date}
                      </span>
                      {inspection.inspector && (
                        <span>Inspector: {inspection.inspector}</span>
                      )}
                    </div>

                    {inspection.findings && inspection.findings.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Findings:</p>
                        <ul className="space-y-1">
                          {inspection.findings.map((finding, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Report
                      </Button>
                      {inspection.status === "passed" && (
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="defects" className="space-y-4">
          {/* Report Issue Button */}
          <div className="flex justify-end">
            <Button>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report New Issue
            </Button>
          </div>

          {/* Defect List */}
          <div className="space-y-4">
            {mockDefects.map((defect, index) => (
              <motion.div
                key={defect.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/30 rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{defect.title}</h4>
                      <Badge className={cn("text-xs capitalize", getSeverityColor(defect.severity))}>
                        {defect.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{defect.description}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "capitalize",
                      defect.status === "resolved" && "bg-emerald-500/10 text-emerald-600"
                    )}
                  >
                    {defect.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-muted-foreground">
                    Reported: {defect.reportedDate}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    {defect.images} images
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Camera className="w-4 h-4 mr-1" />
                    View Photos
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <h4 className="font-medium text-foreground mb-1">Upload Quality Documentation</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop photos or videos, or click to browse
            </p>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i}
                className="aspect-square rounded-lg bg-muted flex items-center justify-center"
              >
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
