import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  FileText, ExternalLink, CheckCircle, Clock,
  Loader2, ChevronDown, ChevronUp, Upload, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface TechPackVersion {
  id: string;
  version_number: number;
  file_url: string;
  file_name: string;
  notes: string | null;
  uploaded_by: string;
  factory_acknowledged_at: string | null;
  created_at: string;
}

interface TechPackVersionsProps {
  orderId: string;
  isFactory?: boolean;
  onActionComplete?: () => void;
}

export function TechPackVersions({ orderId, isFactory = false, onActionComplete }: TechPackVersionsProps) {
  const [versions, setVersions] = useState<TechPackVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [notes, setNotes] = useState("");

  const latest = versions[0] ?? null;
  const latestUnacked = latest && !latest.factory_acknowledged_at ? latest : null;

  useEffect(() => { load(); }, [orderId]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("tech_pack_versions")
      .select("*")
      .eq("order_id", orderId)
      .order("version_number", { ascending: false });
    setVersions((data as TechPackVersion[]) || []);
    if (data?.length) setExpanded(data[0].id);
    setLoading(false);
  }

  const handleUpload = async () => {
    if (!fileUrl.trim()) { toast.error("Paste a URL to your tech pack file."); return; }
    setIsActing(true);
    try {
      const { error } = await supabase.functions.invoke("order-action", {
        body: {
          action: "upload_tech_pack_version",
          order_id: orderId,
          tech_pack: {
            file_url: fileUrl.trim(),
            file_name: fileName.trim() || `Tech Pack v${(versions.length + 1)}`,
            notes: notes.trim() || undefined,
          },
        },
      });
      if (error) throw new Error(error.message);
      toast.success(`Tech pack v${versions.length + 1} uploaded.`);
      setFileUrl(""); setFileName(""); setNotes(""); setShowForm(false);
      load(); onActionComplete?.();
    } catch (e: any) { toast.error(e.message || "Upload failed."); }
    finally { setIsActing(false); }
  };

  const handleAcknowledge = async (versionId: string) => {
    setIsActing(true);
    try {
      const { error } = await supabase.functions.invoke("order-action", {
        body: { action: "acknowledge_tech_pack_version", order_id: orderId, tech_pack_version_id: versionId },
      });
      if (error) throw new Error(error.message);
      toast.success("Confirmed. You're working from the current version.");
      load(); onActionComplete?.();
    } catch (e: any) { toast.error(e.message || "Failed to acknowledge."); }
    finally { setIsActing(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Factory — unacked alert */}
      {isFactory && latestUnacked && (
        <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">New tech pack — please confirm you've seen it</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              v{latestUnacked.version_number} · {latestUnacked.file_name}
            </p>
          </div>
          <Button size="sm" onClick={() => handleAcknowledge(latestUnacked.id)} disabled={isActing}>
            {isActing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
          </Button>
        </div>
      )}

      {/* Brand — upload button */}
      {!isFactory && !showForm && (
        <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="w-full">
          <Upload className="mr-2 h-3 w-3" />
          {versions.length === 0 ? "Upload Tech Pack" : `Upload New Version (v${versions.length + 1})`}
        </Button>
      )}

      {/* Upload form */}
      {!isFactory && showForm && (
        <div className="border border-border rounded-lg p-4 space-y-3 bg-secondary/20">
          <p className="text-sm font-medium text-foreground">
            Upload tech pack {versions.length > 0 ? `v${versions.length + 1}` : "v1"}
          </p>
          {versions.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Previous versions are preserved. The factory will see the new version and must confirm they've switched to it.
            </p>
          )}
          <div className="space-y-1">
            <Label className="text-xs">File URL <span className="text-rose-500">*</span></Label>
            <Input
              type="url"
              placeholder="https://drive.google.com/... or Dropbox, WeTransfer, etc."
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">File name</Label>
            <Input
              placeholder={`e.g. OKIO-SS25-TechPack-v${versions.length + 1}.pdf`}
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">What changed (optional)</Label>
            <Textarea
              placeholder="e.g. Updated collar rib per revision round 2. Added wash instruction page."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="min-h-[60px] text-sm resize-none"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleUpload} disabled={isActing || !fileUrl.trim()}>
              {isActing && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              Upload
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setFileUrl(""); setFileName(""); setNotes(""); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {versions.length === 0 && (
        <div className="py-8 text-center">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {isFactory ? "No tech pack uploaded yet." : "No tech pack versions yet. Upload one above."}
          </p>
        </div>
      )}

      {/* Version history */}
      {versions.map((v, i) => {
        const isOpen = expanded === v.id;
        const isCurrent = i === 0;
        const acked = !!v.factory_acknowledged_at;

        return (
          <div key={v.id} className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
              onClick={() => setExpanded(isOpen ? null : v.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${isCurrent ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  v{v.version_number}
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">{v.file_name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{format(new Date(v.created_at), "MMM d, yyyy")}</span>
                </div>
                {isCurrent && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border bg-primary/10 text-primary border-primary/20">current</span>
                )}
                {acked ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="h-3 w-3" /> acknowledged
                  </span>
                ) : isCurrent ? (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                    <Clock className="h-3 w-3" /> awaiting confirmation
                  </span>
                ) : null}
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {isOpen && (
              <div className="p-4 space-y-3 border-t border-border">
                <a
                  href={v.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Open {v.file_name}
                  <ExternalLink className="h-3 w-3" />
                </a>

                {v.notes && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">What changed</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{v.notes}</p>
                  </div>
                )}

                {v.factory_acknowledged_at && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Factory confirmed {format(new Date(v.factory_acknowledged_at), "MMM d, yyyy 'at' HH:mm")}
                  </p>
                )}

                {/* Factory ack button on current unacked */}
                {isFactory && isCurrent && !acked && (
                  <Button size="sm" onClick={() => handleAcknowledge(v.id)} disabled={isActing} className="w-full mt-2">
                    {isActing ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <CheckCircle className="mr-2 h-3 w-3" />}
                    Confirm — I'm working from this version
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
