import { useState } from "react";
import { FileText, ChevronDown, ChevronUp, CheckCircle, Circle } from "lucide-react";

interface FreightChecklistProps {
  incoterms?: string;
  destination?: string;
  orderStatus?: string;
}

interface CheckItem { id: string; label: string; description: string; required: boolean; done: boolean; }

function getChecklist(incoterms: string, destination: string): CheckItem[] {
  const isFOB = !incoterms || incoterms.startsWith("FOB");
  const isDDP = incoterms?.startsWith("DDP");
  const isUS = destination?.toLowerCase().includes("us") || destination?.toLowerCase().includes("united states");

  return [
    // Factory docs — always needed
    { id: "commercial_invoice", label: "Commercial invoice", description: "From factory: lists goods, values, buyer/seller, country of origin. Required for customs.", required: true, done: false },
    { id: "packing_list", label: "Packing list", description: "From factory: carton count, weights, dimensions, unit breakdown per carton.", required: true, done: false },
    { id: "bill_of_lading", label: "Bill of lading (OBL)", description: "From shipping line: title document for your goods. Required to release at destination.", required: true, done: false },
    { id: "cert_origin", label: "Certificate of origin", description: "From factory/chamber of commerce: proves goods are made in Vietnam. Required for duty assessment.", required: true, done: false },
    // US-specific
    ...(isUS ? [
      { id: "bol_us", label: "US customs entry (CBP Form 3461)", description: "Filed by your customs broker. Required for US import clearance.", required: true, done: false },
      { id: "bonds", label: "Customs bond", description: "Single entry or continuous bond. Your customs broker arranges.", required: true, done: false },
      { id: "isf", label: "ISF (Importer Security Filing)", description: "Must be filed 24h before vessel departure. Your freight forwarder files this.", required: true, done: false },
    ] : []),
    // FOB specific
    ...(isFOB ? [
      { id: "freight_fwd", label: "Freight forwarder booked", description: "You arrange ocean freight on FOB terms. Confirm booking and get B/L number.", required: true, done: false },
    ] : []),
    // Optional quality
    { id: "qc_report", label: "QC inspection report", description: "Third-party or Sourcery-documented QC results. Not legally required but strongly recommended.", required: false, done: false },
    { id: "fta_cert", label: "FTA certificate (if applicable)", description: "For CPTPP preferential rates to UK/AU/CA: Form D or certified origin declaration.", required: false, done: false },
  ];
}

export function FreightChecklist({ incoterms = "FOB", destination = "United States", orderStatus = "ready_to_ship" }: FreightChecklistProps) {
  const [items, setItems] = useState<CheckItem[]>(() => getChecklist(incoterms, destination));
  const [expanded, setExpanded] = useState(false);

  const required = items.filter(i => i.required);
  const done = required.filter(i => i.done);
  const allDone = done.length === required.length;

  if (!["ready_to_ship", "shipped", "qc_pass"].includes(orderStatus)) return null;

  const toggle = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
      <button type="button" onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 text-left">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Freight document checklist</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {allDone ? "All required documents accounted for ✓" : `${done.length}/${required.length} required documents checked`}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border divide-y divide-border">
          {items.map(item => (
            <button key={item.id} type="button" onClick={() => toggle(item.id)}
              className="w-full flex items-start gap-3 px-5 py-3 hover:bg-secondary/20 text-left">
              {item.done
                ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                : <Circle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.label}
                  </span>
                  {!item.required && <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">Optional</span>}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.description}</p>
              </div>
            </button>
          ))}
          <div className="px-5 py-3 bg-secondary/20">
            <p className="text-xs text-muted-foreground">Checklist for {incoterms} shipment to {destination}. Check each item as you receive or file it.</p>
          </div>
        </div>
      )}
    </div>
  );
}
