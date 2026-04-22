import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Package, CheckCircle, Clock, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShipmentTrackerProps {
  orderId: string;
  isFactory?: boolean;
}

interface Shipment {
  id: string;
  carrier: string;
  tracking_number: string;
  estimated_arrival: string | null;
  status: "booked" | "in_transit" | "at_customs" | "delivered";
  origin_port: string;
  destination_port: string;
  vessel_name: string | null;
  notes: string | null;
  created_at: string;
}

const STATUS_CONFIG = {
  booked: { label: "Booked", color: "bg-blue-500/10 text-blue-700 border-blue-400/20", icon: Package },
  in_transit: { label: "In transit", color: "bg-amber-500/10 text-amber-700 border-amber-400/20", icon: Truck },
  at_customs: { label: "At customs", color: "bg-rose-500/10 text-rose-700 border-rose-400/20", icon: Clock },
  delivered: { label: "Delivered", color: "bg-green-500/10 text-green-700 border-green-400/20", icon: CheckCircle },
};

const CARRIER_LINKS: Record<string, string> = {
  "Maersk": "https://www.maersk.com/tracking/",
  "MSC": "https://www.msc.com/track-a-shipment?trackingNumber=",
  "COSCO": "https://elines.coscoshipping.com/ebtracking/publicQuery?",
  "Evergreen": "https://www.evergreen-line.com/statics/inquiry/trackingCargoSearch/",
  "CMA CGM": "https://www.cma-cgm.com/ebusiness/tracking/search?",
  "DHL": "https://www.dhl.com/en/express/tracking.html?AWB=",
  "FedEx": "https://www.fedex.com/apps/fedextrack/?tracknumbers=",
  "UPS": "https://www.ups.com/track?tracknum=",
};

export function ShipmentTracker({ orderId, isFactory = false }: ShipmentTrackerProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ carrier: "Maersk", tracking_number: "", origin_port: "Ho Chi Minh City", destination_port: "", estimated_arrival: "", vessel_name: "", notes: "" });

  useEffect(() => { load(); }, [orderId]);

  async function load() {
    const { data } = await (supabase as any).from("shipment_tracking").select("*").eq("order_id", orderId).order("created_at");
    if (data) setShipments(data);
  }

  async function addShipment() {
    if (!form.tracking_number || !form.carrier) return;
    const { error } = await (supabase as any).from("shipment_tracking").insert({
      order_id: orderId,
      ...form,
      status: "booked",
      estimated_arrival: form.estimated_arrival || null,
    });
    if (!error) { await load(); setAdding(false); toast.success("Shipment added"); }
    else toast.error("Failed to add shipment");
  }

  async function updateStatus(id: string, status: Shipment["status"]) {
    await (supabase as any).from("shipment_tracking").update({ status }).eq("id", id);
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  }

  const activeShipment = shipments.find(s => s.status !== "delivered");
  const trackingUrl = activeShipment ? (CARRIER_LINKS[activeShipment.carrier] || "") + activeShipment.tracking_number : "";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
      <button type="button" onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 text-left">
        <div className="flex items-center gap-3">
          <Truck className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Shipment tracking</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeShipment
                ? `${activeShipment.carrier} ${activeShipment.tracking_number} — ${STATUS_CONFIG[activeShipment.status].label}`
                : shipments.length > 0 ? "All shipments delivered" : "No shipment added yet"}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {shipments.map(s => {
            const cfg = STATUS_CONFIG[s.status];
            const Icon = cfg.icon;
            const link = (CARRIER_LINKS[s.carrier] || "") + s.tracking_number;
            return (
              <div key={s.id} className="px-5 py-4 border-b border-border last:border-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{s.carrier}</span>
                    <span className="font-mono text-xs text-muted-foreground">{s.tracking_number}</span>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", cfg.color)}>{cfg.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                  <span>{s.origin_port} → {s.destination_port}</span>
                  {s.estimated_arrival && <span>ETA: {format(new Date(s.estimated_arrival), "MMM d, yyyy")}</span>}
                  {s.vessel_name && <span>Vessel: {s.vessel_name}</span>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {link && (
                    <Button variant="outline" size="sm" asChild className="gap-1 h-7">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" /> Track on {s.carrier}
                      </a>
                    </Button>
                  )}
                  {isFactory && s.status !== "delivered" && (
                    <>
                      {s.status === "booked" && <Button variant="outline" size="sm" className="h-7" onClick={() => updateStatus(s.id, "in_transit")}>Mark in transit</Button>}
                      {s.status === "in_transit" && <Button variant="outline" size="sm" className="h-7" onClick={() => updateStatus(s.id, "at_customs")}>Mark at customs</Button>}
                      {s.status === "at_customs" && <Button size="sm" className="h-7" onClick={() => updateStatus(s.id, "delivered")}>Mark delivered</Button>}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {(isFactory || shipments.length === 0) && !adding && (
            <div className="px-5 py-3">
              <Button variant="outline" size="sm" onClick={() => setAdding(true)}>+ Add shipment</Button>
            </div>
          )}

          {adding && (
            <div className="px-5 py-4 bg-secondary/20 border-t border-border">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: "Carrier", key: "carrier", type: "select", options: Object.keys(CARRIER_LINKS) },
                  { label: "Tracking number", key: "tracking_number", placeholder: "MAEU1234567" },
                  { label: "Origin port", key: "origin_port", placeholder: "Ho Chi Minh City" },
                  { label: "Destination port", key: "destination_port", placeholder: "Los Angeles" },
                  { label: "Vessel name (optional)", key: "vessel_name", placeholder: "Maersk Evora" },
                  { label: "ETA (optional)", key: "estimated_arrival", type: "date" },
                ].map(({ label, key, type, placeholder, options }) => (
                  <div key={key}>
                    <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                    {type === "select" ? (
                      <select value={(form as any)[key]} onChange={e => setForm(p => ({...p, [key]: e.target.value}))}
                        className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground">
                        {options!.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={type || "text"} value={(form as any)[key]} placeholder={placeholder}
                        onChange={e => setForm(p => ({...p, [key]: e.target.value}))}
                        className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addShipment} disabled={!form.tracking_number}>Add</Button>
                <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
