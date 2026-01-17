import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

// Platform activity over time
const activityData = [
  { date: "Jan 1", signups: 45, inquiries: 120, orders: 12 },
  { date: "Jan 8", signups: 52, inquiries: 145, orders: 18 },
  { date: "Jan 15", signups: 68, inquiries: 180, orders: 24 },
  { date: "Jan 22", signups: 72, inquiries: 165, orders: 21 },
  { date: "Jan 29", signups: 85, inquiries: 210, orders: 32 },
  { date: "Feb 5", signups: 95, inquiries: 195, orders: 28 },
  { date: "Feb 12", signups: 110, inquiries: 250, orders: 38 },
];

// User breakdown
const userBreakdownData = [
  { name: "Buyers", value: 65, color: "hsl(var(--primary))" },
  { name: "Factory Users", value: 28, color: "hsl(var(--chart-2))" },
  { name: "QC Partners", value: 5, color: "hsl(var(--chart-3))" },
  { name: "Admins", value: 2, color: "hsl(var(--chart-4))" },
];

// Order status distribution
const orderStatusData = [
  { status: "Draft", count: 12 },
  { status: "In Production", count: 28 },
  { status: "QC Phase", count: 15 },
  { status: "Shipped", count: 42 },
  { status: "Completed", count: 156 },
  { status: "Disputed", count: 4 },
];

// Geographic distribution
const geoData = [
  { country: "Portugal", factories: 24, orders: 89 },
  { country: "Italy", factories: 18, orders: 67 },
  { country: "Turkey", factories: 15, orders: 54 },
  { country: "Bangladesh", factories: 12, orders: 123 },
  { country: "Vietnam", factories: 10, orders: 78 },
];

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* Platform Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Platform Activity</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="signupsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="inquiriesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="signups"
                name="New Signups"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#signupsGradient)"
              />
              <Area
                type="monotone"
                dataKey="inquiries"
                name="Inquiries"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#inquiriesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">User Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {userBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Percentage"]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => (
                    <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Order Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  dataKey="status" 
                  type="category" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Geographic Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Geographic Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={geoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="country" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
              <Bar 
                dataKey="factories" 
                name="Factories"
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="orders" 
                name="Orders"
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
