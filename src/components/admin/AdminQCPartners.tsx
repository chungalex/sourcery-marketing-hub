import { useState } from "react";
import { motion } from "framer-motion";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle,
  MapPin,
  ClipboardCheck
} from "lucide-react";

interface QCPartner {
  id: string;
  name: string;
  location: string | null;
  is_verified: boolean;
  created_at: string;
  active_assignments: number;
}

interface Order {
  id: string;
  order_number: string;
  factory_name: string;
}

interface AdminQCPartnersProps {
  partners: QCPartner[];
  pendingOrders: Order[];
  onAddPartner: (name: string, location: string) => void;
  onAssignToOrder: (partnerId: string, orderId: string) => void;
  onVerifyPartner: (partnerId: string, verified: boolean) => void;
}

export function AdminQCPartners({ 
  partners, 
  pendingOrders,
  onAddPartner, 
  onAssignToOrder,
  onVerifyPartner 
}: AdminQCPartnersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<QCPartner | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [newPartner, setNewPartner] = useState({ name: "", location: "" });

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (partner.location && partner.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddPartner = () => {
    if (newPartner.name) {
      onAddPartner(newPartner.name, newPartner.location);
      setNewPartner({ name: "", location: "" });
      setShowAddDialog(false);
    }
  };

  const handleAssignClick = (partner: QCPartner) => {
    setSelectedPartner(partner);
    setShowAssignDialog(true);
  };

  const handleAssignConfirm = () => {
    if (selectedPartner && selectedOrderId) {
      onAssignToOrder(selectedPartner.id, selectedOrderId);
      setShowAssignDialog(false);
      setSelectedPartner(null);
      setSelectedOrderId("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search QC partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add QC Partner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add QC Partner</DialogTitle>
              <DialogDescription>
                Add a new quality control partner to the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Partner Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Asia Quality Focus"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Shanghai, China"
                  value={newPartner.location}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPartner} disabled={!newPartner.name}>
                Add Partner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{partners.length}</p>
              <p className="text-sm text-muted-foreground">Total Partners</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {partners.filter(p => p.is_verified).length}
              </p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingOrders.length}</p>
              <p className="text-sm text-muted-foreground">Orders Awaiting QC</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Partner Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active Assignments</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No QC partners found
                </TableCell>
              </TableRow>
            ) : (
              filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>
                    {partner.location ? (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {partner.location}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {partner.is_verified ? (
                      <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground gap-1">
                        <XCircle className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{partner.active_assignments}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(partner.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAssignClick(partner)}
                        disabled={pendingOrders.length === 0}
                      >
                        Assign to Order
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onVerifyPartner(partner.id, !partner.is_verified)}
                      >
                        {partner.is_verified ? "Unverify" : "Verify"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign QC Partner</DialogTitle>
            <DialogDescription>
              Assign {selectedPartner?.name} to an order for quality control inspection.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="order">Select Order</Label>
            <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose an order..." />
              </SelectTrigger>
              <SelectContent>
                {pendingOrders.map(order => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.order_number} - {order.factory_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignConfirm} disabled={!selectedOrderId}>
              Assign Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
