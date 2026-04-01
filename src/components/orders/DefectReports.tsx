import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertCircle, CheckCircle, Loader2,
  ChevronDown, ChevronUp, Camera
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const DEFECT_TYPES = [
  { value: "stitching", label: "Stitching" },
  { value: "measurement", label: "Measurement" },
  { value: "colorway", label: "Colorway" },
  { value: "finishing", label: "Finishing" },
  { value: "hardware", label: "Hardware" },
  { value: "packaging", label: "Packaging" },
  { value: "fabric", label: "Fabric" },
  { value: "other", label: "Other" },
];

const SEVERITIES = [
  { value: "minor", label: "Minor", desc: "Cosmetic — does not affect function or safety", cls: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  { value: "major", label: "Major", desc: "Significant — affects usability or marketability", cls: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
  { value: "critical", label: "Critical", desc: "Unacceptable — production halt or full rejection", cls: "bg-rose-500/10 text-rose-700 border-rose-500/20" },
];

interface DefectReport {
  id: string;
  defect_type: string;
  severity: "minor" | "major" | "critical";
  quantity_affected: number;
  percentage_affected: number | null;
  description: string;
  photo_urls: string[];
  factory_response: string | null;
  factory_responded_at: string | null;
  status: "open" | "acknowledged" | "disputed" | "resolved";
  created_at: string;
}

interface DefectReportsProps {
  orderId: string;
  totalQuantity: number;
  isFactory?: boolean;
  onActionComplete?: () => void;
}

export function DefectReports({ orderId, totalQuantity, isFactory = false, onActionComplete }: DefectReportsProps) {
  const [reports, setReports] = useState<DefectReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [defectType, setDefectType] = useState("stitching");
  const [severity, setSeverity] = useState("minor");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrls, setPhotoUrls] = useState([""]);

  // Factory response
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const openCount = reports.filter(r => r.status === "open").length;

  useEffect(() => { load(); }, [orderId]);

  async function load() {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("defect_reports")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    setReports((data as DefectReport[]) || []);
    if (data?.length) setExpanded((data as any[])[0].id);
    setLoading(false);
  }

  const pct = (qty: number) => totalQuantity > 0 ? ((qty / totalQuantity) * 100).toFixed(1) : "—";

  const handleFile = async () => {
    const qty = parseInt(quantity);
    if (!description.trim()) { toast.error("Describe the defect."); return; }
    if (!qty || qty < 1) { toast.error("Enter quantity affected."); return; }
    setIsActing(true);
    try {
      const validPhotos = photoUrls.filter(u => u.trim());
      // Get session for auth
      const { data: { session: _sess } } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke("order-action", {
        headers: { Authorization: `Bearer ${_sess?.access_token}` },
        body: {
          action: "file_defect_report",
          order_id: orderId,
          defect: {
            defect_type: defectType,
            severity,
            quantity_affected: qty,
            percentage_affected: totalQuantity > 0 ? parseFloat(((qty / totalQuantity) * 100).toFixed(2)) : undefined,
            description: description.trim(),
            photo_urls: validPhotos,
          },
        },
      });
      if (error) throw new Error(error.message);
      toast.success("Defect report filed.");
      setShowForm(false);
      setDescription(""); setQuantity(""); setPhotoUrls([""]);
      load(); onActionComplete?.();
    } catch (e: any) { toast.error(e.message || "Failed to file report."); }
    finally { setIsActing(false); }
  };

  const handleRespond = async (reportId: string) => {
    if (!responseText.trim()) { toast.error("Write your response."); return; }
    setIsActing(true);
    try {
      // Get session for auth
      const { data: { session: _sess } } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke("order-action", {
        headers: { Authorization: `Bearer ${_sess?.access_token}` },
        body: { action: "respond_to_defect", order_id: orderId, defect_report_id: reportId, factory_response: responseText.trim() },
      });
      if (error) throw new Error(error.message);
      toast.success("Response submitted.");
      setRespondingId(null); setResponseText("");
      load(); onActionComplete?.();
    } catch (e: any) { toast.error(e.message || "Failed to respond."); }
    finally { setIsActing(false); }
  };

  const sevCfg = (s: string) => SEVERITIES.find(x => x.value === s) || SEVERITIES[0];

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      {reports.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {["minor","major","critical"].map(s => {
            const count = reports.filter(r => r.severity === s).length;
            const cfg = sevCfg(s);
            return (
              <div key={s} className={`rounded-lg border p-3 text-center ${cfg.cls}`}>
                <div className="text-lg font-semibold">{count}</div>
                <div className="text-xs capitalize">{s}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Brand — file report */}
      {!isFactory && !showForm && (
        <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="w-full">
          <AlertCircle className="mr-2 h-3 w-3" />
          File Defect Report
        </Button>
      )}

      {/* Factory — open defects alert */}
      {isFactory && openCount > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-rose-500/30 bg-rose-500/5">
          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
          <p className="text-sm text-foreground">{openCount} defect report{openCount > 1 ? "s" : ""} awaiting your response.</p>
        </div>
      )}

      {/* New defect form */}
      {!isFactory && showForm && (
        <div className="border border-border rounded-lg p-4 space-y-4 bg-secondary/20">
          <p className="text-sm font-medium text-foreground">File defect report</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Defect type <span className="text-rose-500">*</span></Label>
              <select
                value={defectType}
                onChange={e => setDefectType(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {DEFECT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Quantity affected <span className="text-rose-500">*</span></Label>
              <Input
                type="number"
                placeholder={`of ${totalQuantity.toLocaleString()} units`}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="text-sm"
                min={1}
              />
              {quantity && totalQuantity > 0 && (
                <p className="text-xs text-muted-foreground">{pct(parseInt(quantity))}% of total order</p>
              )}
            </div>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label className="text-xs">Severity <span className="text-rose-500">*</span></Label>
            <div className="grid grid-cols-3 gap-2">
              {SEVERITIES.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSeverity(s.value)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    severity === s.value ? `${s.cls} border-current` : "border-border bg-background hover:bg-secondary/50"
                  }`}
                >
                  <div className="text-xs font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Description <span className="text-rose-500">*</span></Label>
            <Textarea
              placeholder="Be specific — location of defect, how it presents, which units are affected..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="min-h-[80px] text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1"><Camera className="h-3 w-3" /> Photo URLs (optional — required for major/critical)</Label>
            {photoUrls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <Input type="url" placeholder="https://..." value={url} onChange={e => setPhotoUrls(p => p.map((u,idx) => idx===i ? e.target.value : u))} className="text-sm flex-1" />
                {photoUrls.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setPhotoUrls(p => p.filter((_,idx) => idx!==i))} className="px-2">×</Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setPhotoUrls(p => [...p, ""])} className="w-full text-xs">+ Add photo</Button>
          </div>

          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleFile} disabled={isActing || !description.trim() || !quantity}>
              {isActing && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              File Report
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setDescription(""); setQuantity(""); }}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {reports.length === 0 && (
        <div className="py-8 text-center">
          <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No defects reported on this order.</p>
        </div>
      )}

      {/* Report list */}
      {reports.map(r => {
        const cfg = sevCfg(r.severity);
        const isOpen = expanded === r.id;
        const needsResponse = isFactory && r.status === "open";

        return (
          <div key={r.id} className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
              onClick={() => setExpanded(isOpen ? null : r.id)}
            >
              <div className="flex items-center gap-3 flex-wrap">
                {needsResponse && <div className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${cfg.cls}`}>
                  {r.severity}
                </span>
                <span className="text-sm font-medium text-foreground capitalize">{r.defect_type.replace("_"," ")}</span>
                <span className="text-xs text-muted-foreground">
                  {r.quantity_affected.toLocaleString()} units
                  {r.percentage_affected ? ` (${r.percentage_affected}%)` : ""}
                </span>
                <span className="text-xs text-muted-foreground">{format(new Date(r.created_at), "MMM d")}</span>
                {r.status === "acknowledged" && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="h-3 w-3" /> responded
                  </span>
                )}
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
            </button>

            {isOpen && (
              <div className="p-4 space-y-4 border-t border-border">
                <p className="text-sm text-foreground whitespace-pre-wrap">{r.description}</p>

                {r.photo_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {r.photo_urls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline border border-primary/20 rounded px-2 py-1 bg-primary/5">
                        Photo {i + 1}
                      </a>
                    ))}
                  </div>
                )}

                {r.factory_response && (
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Factory response</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{r.factory_response}</p>
                    {r.factory_responded_at && (
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(r.factory_responded_at), "MMM d, yyyy 'at' HH:mm")}</p>
                    )}
                  </div>
                )}

                {/* Factory respond */}
                {needsResponse && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    {respondingId === r.id ? (
                      <>
                        <Textarea
                          placeholder="Acknowledge the defect, explain the cause, and describe corrective action..."
                          value={responseText}
                          onChange={e => setResponseText(e.target.value)}
                          className="min-h-[80px] text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleRespond(r.id)} disabled={isActing || !responseText.trim()}>
                            {isActing && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                            Submit Response
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setRespondingId(null); setResponseText(""); }}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setRespondingId(r.id)} className="w-full">
                        Respond to this defect report
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
