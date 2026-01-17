import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Package, 
  MessageSquare, 
  DollarSign, 
  AlertTriangle,
  Building2,
  CheckCircle
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  iconBgColor?: string;
}

function StatCard({ label, value, change, changeType = "neutral", icon, iconBgColor = "bg-primary/10" }: StatCardProps) {
  const changeColorClass = changeType === "positive" 
    ? "text-emerald-600" 
    : changeType === "negative" 
      ? "text-destructive" 
      : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${changeColorClass}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    activeOrders: number;
    openDisputes: number;
    pendingApplications: number;
    totalRevenue: number;
    newInquiries: number;
    conversionRate: number;
    factories: number;
  };
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Users"
        value={stats.totalUsers.toLocaleString()}
        change="+12% from last month"
        changeType="positive"
        icon={<Users className="h-5 w-5 text-primary" />}
      />
      <StatCard
        label="Active Orders"
        value={stats.activeOrders}
        change={`${stats.openDisputes} disputes open`}
        changeType={stats.openDisputes > 0 ? "negative" : "neutral"}
        icon={<Package className="h-5 w-5 text-primary" />}
      />
      <StatCard
        label="New Inquiries"
        value={stats.newInquiries}
        change="+8% this week"
        changeType="positive"
        icon={<MessageSquare className="h-5 w-5 text-primary" />}
      />
      <StatCard
        label="Pending Applications"
        value={stats.pendingApplications}
        icon={<Building2 className="h-5 w-5 text-yellow-600" />}
        iconBgColor="bg-yellow-500/10"
      />
      <StatCard
        label="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        change="+23% from last month"
        changeType="positive"
        icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
        iconBgColor="bg-emerald-500/10"
      />
      <StatCard
        label="Conversion Rate"
        value={`${stats.conversionRate}%`}
        change="+2.3% improvement"
        changeType="positive"
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
      />
      <StatCard
        label="Open Disputes"
        value={stats.openDisputes}
        changeType={stats.openDisputes > 0 ? "negative" : "neutral"}
        icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
        iconBgColor="bg-destructive/10"
      />
      <StatCard
        label="Verified Factories"
        value={stats.factories}
        change="+5 this month"
        changeType="positive"
        icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
        iconBgColor="bg-emerald-500/10"
      />
    </div>
  );
}
