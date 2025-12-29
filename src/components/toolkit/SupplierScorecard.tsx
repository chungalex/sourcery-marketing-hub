import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, TrendingDown, Clock, Package, MessageSquare, Shield, Plus } from "lucide-react";

interface SupplierScore {
  id: string;
  name: string;
  overallScore: number;
  metrics: {
    quality: number;
    delivery: number;
    communication: number;
    pricing: number;
  };
  trend: "up" | "down" | "stable";
  ordersCompleted: number;
  lastOrderDate: string;
  notes: string;
}

const mockSuppliers: SupplierScore[] = [
  {
    id: "1",
    name: "Sunrise Textiles",
    overallScore: 92,
    metrics: { quality: 95, delivery: 88, communication: 94, pricing: 90 },
    trend: "up",
    ordersCompleted: 12,
    lastOrderDate: "2024-01-15",
    notes: "Excellent quality consistency. Minor delays during peak season.",
  },
  {
    id: "2",
    name: "Pacific Manufacturing",
    overallScore: 78,
    metrics: { quality: 82, delivery: 70, communication: 85, pricing: 75 },
    trend: "down",
    ordersCompleted: 5,
    lastOrderDate: "2024-01-08",
    notes: "Good pricing but delivery times have slipped recently.",
  },
  {
    id: "3",
    name: "Golden Thread Co.",
    overallScore: 88,
    metrics: { quality: 90, delivery: 92, communication: 80, pricing: 88 },
    trend: "stable",
    ordersCompleted: 8,
    lastOrderDate: "2024-01-20",
    notes: "Reliable partner. Communication could be more proactive.",
  },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-amber-600";
  return "text-red-600";
};

const getScoreBadge = (score: number) => {
  if (score >= 90) return { label: "Excellent", variant: "default" as const };
  if (score >= 75) return { label: "Good", variant: "secondary" as const };
  return { label: "Needs Attention", variant: "destructive" as const };
};

export function SupplierScorecard({ className }: { className?: string }) {
  const [suppliers] = useState<SupplierScore[]>(mockSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierScore | null>(null);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Supplier Scorecard
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track and compare supplier performance over time
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Supplier List */}
            <div className="lg:col-span-1 space-y-3">
              {suppliers.map((supplier) => {
                const badge = getScoreBadge(supplier.overallScore);
                return (
                  <motion.div
                    key={supplier.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedSupplier(supplier)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedSupplier?.id === supplier.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-foreground">{supplier.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {supplier.ordersCompleted} orders completed
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-xl font-bold ${getScoreColor(supplier.overallScore)}`}>
                          {supplier.overallScore}
                        </span>
                        {supplier.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {supplier.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
                      </div>
                    </div>
                    <Badge variant={badge.variant} className="text-xs">
                      {badge.label}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>

            {/* Detailed View */}
            <div className="lg:col-span-2">
              {selectedSupplier ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {selectedSupplier.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Last order: {new Date(selectedSupplier.lastOrderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(selectedSupplier.overallScore)}`}>
                        {selectedSupplier.overallScore}
                      </div>
                      <p className="text-xs text-muted-foreground">Overall Score</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "Quality", value: selectedSupplier.metrics.quality, icon: Shield },
                      { label: "On-Time Delivery", value: selectedSupplier.metrics.delivery, icon: Clock },
                      { label: "Communication", value: selectedSupplier.metrics.communication, icon: MessageSquare },
                      { label: "Pricing Value", value: selectedSupplier.metrics.pricing, icon: Package },
                    ].map((metric) => (
                      <div key={metric.label} className="p-4 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <metric.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{metric.label}</span>
                          <span className={`ml-auto font-bold ${getScoreColor(metric.value)}`}>
                            {metric.value}%
                          </span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl">
                    <h4 className="text-sm font-medium text-foreground mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedSupplier.notes}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      View Order History
                    </Button>
                    <Button className="flex-1">
                      Update Scorecard
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-8 bg-muted/30 rounded-xl min-h-[400px]">
                  <div>
                    <Star className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Select a supplier to view detailed performance metrics
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
