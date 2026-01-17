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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle,
  ArrowUpCircle,
  Eye
} from "lucide-react";

interface Dispute {
  id: string;
  order_id: string;
  order_number: string;
  reason: string;
  status: "open" | "escalated" | "resolved";
  initiated_by_email: string;
  created_at: string;
  resolution: string | null;
  resolved_at: string | null;
}

interface AdminDisputesTableProps {
  disputes: Dispute[];
  onResolve: (disputeId: string, resolution: string) => void;
  onEscalate: (disputeId: string) => void;
  onViewOrder: (orderId: string) => void;
}

const statusColors: Record<string, string> = {
  open: "bg-destructive/10 text-destructive",
  escalated: "bg-yellow-100 text-yellow-700",
  resolved: "bg-emerald-100 text-emerald-700",
};

const statusIcons: Record<string, React.ReactNode> = {
  open: <AlertTriangle className="h-3 w-3" />,
  escalated: <ArrowUpCircle className="h-3 w-3" />,
  resolved: <CheckCircle className="h-3 w-3" />,
};

export function AdminDisputesTable({ 
  disputes, 
  onResolve, 
  onEscalate,
  onViewOrder 
}: AdminDisputesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolution, setResolution] = useState("");

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = 
      dispute.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.initiated_by_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleResolveClick = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setResolution("");
    setShowResolveDialog(true);
  };

  const handleResolveConfirm = () => {
    if (selectedDispute && resolution) {
      onResolve(selectedDispute.id, resolution);
      setShowResolveDialog(false);
      setSelectedDispute(null);
      setResolution("");
    }
  };

  const openDisputes = disputes.filter(d => d.status === "open").length;
  const escalatedDisputes = disputes.filter(d => d.status === "escalated").length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-xl">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span className="font-medium text-foreground">{openDisputes} Open</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpCircle className="h-5 w-5 text-yellow-600" />
          <span className="font-medium text-foreground">{escalatedDisputes} Escalated</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span className="font-medium text-foreground">
            {disputes.filter(d => d.status === "resolved").length} Resolved
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search disputes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {["all", "open", "escalated", "resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Order</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Initiated By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDisputes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No disputes found
                </TableCell>
              </TableRow>
            ) : (
              filteredDisputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell>
                    <button 
                      onClick={() => onViewOrder(dispute.order_id)}
                      className="font-medium text-primary hover:underline"
                    >
                      {dispute.order_number}
                    </button>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="truncate text-foreground">{dispute.reason}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[dispute.status]} font-normal gap-1`}>
                      {statusIcons[dispute.status]}
                      {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dispute.initiated_by_email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(dispute.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onViewOrder(dispute.order_id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {dispute.status === "open" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onEscalate(dispute.id)}
                          >
                            Escalate
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleResolveClick(dispute)}
                          >
                            Resolve
                          </Button>
                        </>
                      )}
                      {dispute.status === "escalated" && (
                        <Button 
                          size="sm"
                          onClick={() => handleResolveClick(dispute)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Provide a resolution for order {selectedDispute?.order_number}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label className="text-muted-foreground">Dispute Reason</Label>
              <p className="text-sm text-foreground mt-1">{selectedDispute?.reason}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Textarea
                id="resolution"
                placeholder="Describe how this dispute was resolved..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolveConfirm} disabled={!resolution}>
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
