import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, CheckCircle, Clock, Truck, Factory, Ship, AlertTriangle, Filter } from "lucide-react";

interface OrderMilestone {
  id: string;
  label: string;
  date: string;
  completed: boolean;
  current: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  productName: string;
  factory: string;
  quantity: number;
  status: "production" | "quality_check" | "shipping" | "delivered" | "delayed";
  estimatedDelivery: string;
  milestones: OrderMilestone[];
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    productName: "Premium Cotton T-Shirts",
    factory: "Sunrise Textiles",
    quantity: 5000,
    status: "shipping",
    estimatedDelivery: "2024-02-15",
    milestones: [
      { id: "m1", label: "Order Placed", date: "2024-01-01", completed: true, current: false },
      { id: "m2", label: "Production Started", date: "2024-01-05", completed: true, current: false },
      { id: "m3", label: "Quality Check", date: "2024-01-20", completed: true, current: false },
      { id: "m4", label: "Shipped", date: "2024-01-25", completed: true, current: true },
      { id: "m5", label: "Delivered", date: "", completed: false, current: false },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    productName: "Organic Linen Dresses",
    factory: "Pacific Manufacturing",
    quantity: 2000,
    status: "production",
    estimatedDelivery: "2024-03-01",
    milestones: [
      { id: "m1", label: "Order Placed", date: "2024-01-15", completed: true, current: false },
      { id: "m2", label: "Production Started", date: "2024-01-18", completed: true, current: true },
      { id: "m3", label: "Quality Check", date: "", completed: false, current: false },
      { id: "m4", label: "Shipped", date: "", completed: false, current: false },
      { id: "m5", label: "Delivered", date: "", completed: false, current: false },
    ],
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    productName: "Recycled Polyester Jackets",
    factory: "Golden Thread Co.",
    quantity: 1500,
    status: "delayed",
    estimatedDelivery: "2024-02-28",
    milestones: [
      { id: "m1", label: "Order Placed", date: "2024-01-10", completed: true, current: false },
      { id: "m2", label: "Production Started", date: "2024-01-14", completed: true, current: true },
      { id: "m3", label: "Quality Check", date: "", completed: false, current: false },
      { id: "m4", label: "Shipped", date: "", completed: false, current: false },
      { id: "m5", label: "Delivered", date: "", completed: false, current: false },
    ],
  },
];

const getStatusConfig = (status: Order["status"]) => {
  const configs = {
    production: { label: "In Production", icon: Factory, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    quality_check: { label: "Quality Check", icon: CheckCircle, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    shipping: { label: "Shipping", icon: Ship, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    delivered: { label: "Delivered", icon: Truck, color: "bg-green-500/10 text-green-600 border-green-500/20" },
    delayed: { label: "Delayed", icon: AlertTriangle, color: "bg-red-500/10 text-red-600 border-red-500/20" },
  };
  return configs[status];
};

export function OrderTracker({ className }: { className?: string }) {
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.factory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Tracker
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor production milestones and delivery status
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Order List */}
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const status = getStatusConfig(order.status);
                return (
                  <motion.div
                    key={order.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedOrder?.id === order.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
                        <h3 className="font-medium text-foreground">{order.productName}</h3>
                        <p className="text-sm text-muted-foreground">{order.factory}</p>
                      </div>
                      <Badge className={`${status.color} border`}>
                        <status.icon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{order.quantity.toLocaleString()} units</span>
                      <span>Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Details */}
            <div>
              {selectedOrder ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">{selectedOrder.orderNumber}</p>
                    <h2 className="text-xl font-semibold text-foreground">
                      {selectedOrder.productName}
                    </h2>
                    <p className="text-muted-foreground">{selectedOrder.factory}</p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-6">
                    <h3 className="font-medium text-foreground mb-6">Production Timeline</h3>
                    <div className="relative">
                      {selectedOrder.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="flex gap-4 pb-6 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                milestone.completed
                                  ? "bg-green-500 text-white"
                                  : milestone.current
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted-foreground/20 text-muted-foreground"
                              }`}
                            >
                              {milestone.completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Clock className="w-4 h-4" />
                              )}
                            </div>
                            {index < selectedOrder.milestones.length - 1 && (
                              <div
                                className={`w-0.5 flex-1 mt-2 ${
                                  milestone.completed ? "bg-green-500" : "bg-muted-foreground/20"
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <p
                              className={`font-medium ${
                                milestone.current ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {milestone.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {milestone.date
                                ? new Date(milestone.date).toLocaleDateString()
                                : "Pending"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      Contact Factory
                    </Button>
                    <Button className="flex-1">
                      View Full Details
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-8 bg-muted/30 rounded-xl min-h-[400px]">
                  <div>
                    <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Select an order to view its timeline and details
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
