import { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Search, 
  Eye, 
  AlertTriangle, 
  DollarSign,
  UserPlus,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  order_number: string;
  buyer_name: string;
  factory_name: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  has_dispute: boolean;
  qc_assigned: boolean;
}

interface AdminOrdersTableProps {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
  onOpenDispute: (orderId: string) => void;
  onReleaseMilestone: (orderId: string) => void;
  onAssignQC: (orderId: string) => void;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  po_issued: "bg-blue-100 text-blue-700",
  po_accepted: "bg-cyan-100 text-cyan-700",
  in_production: "bg-yellow-100 text-yellow-700",
  qc_scheduled: "bg-purple-100 text-purple-700",
  qc_uploaded: "bg-indigo-100 text-indigo-700",
  qc_pass: "bg-emerald-100 text-emerald-700",
  qc_fail: "bg-red-100 text-red-700",
  ready_to_ship: "bg-teal-100 text-teal-700",
  shipped: "bg-sky-100 text-sky-700",
  closed: "bg-muted text-muted-foreground",
  disputed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
};

export function AdminOrdersTable({ 
  orders, 
  onViewOrder, 
  onOpenDispute, 
  onReleaseMilestone,
  onAssignQC 
}: AdminOrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.factory_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = [...new Set(orders.map(o => o.status))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map(status => (
              <SelectItem key={status} value={status}>
                {formatStatus(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Order #</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Factory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {order.order_number}
                      {order.has_dispute && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{order.buyer_name}</TableCell>
                  <TableCell>{order.factory_name}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[order.status] || "bg-muted"} font-normal`}>
                      {formatStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {order.currency} {order.total_amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewOrder(order.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {!order.qc_assigned && order.status === "in_production" && (
                          <DropdownMenuItem onClick={() => onAssignQC(order.id)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign QC Partner
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onReleaseMilestone(order.id)}>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Release Milestone
                        </DropdownMenuItem>
                        {!order.has_dispute && (
                          <DropdownMenuItem 
                            onClick={() => onOpenDispute(order.id)}
                            className="text-destructive"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Open Dispute
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredOrders.length} of {orders.length} orders</span>
        <span>
          {orders.filter(o => o.has_dispute).length} with active disputes
        </span>
      </div>
    </div>
  );
}
