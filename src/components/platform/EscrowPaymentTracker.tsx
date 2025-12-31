import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  DollarSign, 
  Factory, 
  ClipboardCheck, 
  Truck, 
  Package,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaymentMilestone {
  id: string;
  label: string;
  description: string;
  amount: number;
  percentage: number;
  status: "pending" | "locked" | "released" | "disputed";
  date?: string;
  icon: typeof DollarSign;
}

interface EscrowPaymentTrackerProps {
  orderId?: string;
  orderTotal?: number;
  currency?: string;
  className?: string;
}

const mockMilestones: PaymentMilestone[] = [
  {
    id: "1",
    label: "Deposit",
    description: "Initial order deposit",
    amount: 2500,
    percentage: 30,
    status: "released",
    date: "Jan 15, 2024",
    icon: DollarSign,
  },
  {
    id: "2",
    label: "Production Start",
    description: "Factory begins production",
    amount: 2500,
    percentage: 30,
    status: "locked",
    date: "Jan 22, 2024",
    icon: Factory,
  },
  {
    id: "3",
    label: "Quality Approved",
    description: "QC inspection passed",
    amount: 1666,
    percentage: 20,
    status: "pending",
    icon: ClipboardCheck,
  },
  {
    id: "4",
    label: "Shipped",
    description: "Order dispatched",
    amount: 833,
    percentage: 10,
    status: "pending",
    icon: Truck,
  },
  {
    id: "5",
    label: "Delivered",
    description: "Final payment release",
    amount: 833,
    percentage: 10,
    status: "pending",
    icon: Package,
  },
];

export function EscrowPaymentTracker({ 
  orderId = "ORD-2024-001",
  orderTotal = 8332,
  currency = "USD",
  className 
}: EscrowPaymentTrackerProps) {
  const [milestones] = useState<PaymentMilestone[]>(mockMilestones);

  const getStatusColor = (status: PaymentMilestone["status"]) => {
    switch (status) {
      case "released":
        return "text-emerald-500 bg-emerald-500/10";
      case "locked":
        return "text-primary bg-primary/10";
      case "disputed":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: PaymentMilestone["status"]) => {
    switch (status) {
      case "released":
        return <CheckCircle className="w-4 h-4" />;
      case "locked":
        return <Shield className="w-4 h-4" />;
      case "disputed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const totalReleased = milestones
    .filter(m => m.status === "released")
    .reduce((sum, m) => sum + m.amount, 0);

  const totalLocked = milestones
    .filter(m => m.status === "locked")
    .reduce((sum, m) => sum + m.amount, 0);

  const completedSteps = milestones.filter(m => m.status === "released").length;

  return (
    <div className={cn("bg-card border border-border rounded-xl p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">
              Payment Milestones
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Order {orderId} • Recommended payment structure
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <Clock className="w-3 h-3 mr-1" />
          Escrow Coming Soon
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Order</div>
          <div className="text-xl font-semibold text-foreground">
            ${orderTotal.toLocaleString()} {currency}
          </div>
        </div>
        <div className="bg-emerald-500/10 rounded-lg p-4">
          <div className="text-sm text-emerald-600 mb-1">Released</div>
          <div className="text-xl font-semibold text-emerald-600">
            ${totalReleased.toLocaleString()}
          </div>
        </div>
        <div className="bg-primary/10 rounded-lg p-4">
          <div className="text-sm text-primary mb-1">In Escrow</div>
          <div className="text-xl font-semibold text-primary">
            ${totalLocked.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">
            {completedSteps} of {milestones.length} milestones
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps / milestones.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full"
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative flex items-start gap-4 p-4 rounded-lg border transition-colors",
              milestone.status === "locked" && "border-primary/30 bg-primary/5",
              milestone.status === "released" && "border-emerald-500/30 bg-emerald-500/5",
              milestone.status === "pending" && "border-border bg-muted/30",
              milestone.status === "disputed" && "border-destructive/30 bg-destructive/5"
            )}
          >
            {/* Icon */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              getStatusColor(milestone.status)
            )}>
              <milestone.icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-medium text-foreground">{milestone.label}</h4>
                <div className="flex items-center gap-2">
                  {getStatusIcon(milestone.status)}
                  <span className="text-sm capitalize text-muted-foreground">
                    {milestone.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {milestone.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium text-foreground">
                    ${milestone.amount.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    ({milestone.percentage}%)
                  </span>
                </div>
                {milestone.date && (
                  <span className="text-xs text-muted-foreground">
                    {milestone.date}
                  </span>
                )}
              </div>
            </div>

            {/* Status Indicator */}
            {milestone.status === "locked" && (
              <div className="shrink-0">
                <Badge variant="outline" className="text-primary border-primary/30">
                  In Progress
                </Badge>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          We help structure payments around verified milestones
        </p>
        <Button variant="ghost" size="sm">
          Report Issue
        </Button>
      </div>
    </div>
  );
}
