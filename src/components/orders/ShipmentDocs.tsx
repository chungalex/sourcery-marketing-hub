import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Upload, ExternalLink, Loader2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { format } from "date-fns";

const DOC_TYPES = [
  { value: "commercial_invoice", label: "Commercial invoice" },
  { value: "packing_list", label: "Packing list" },
  { value: "bill_of_lading", label: "Bill of lading" },
  { value: "customs_declaration", label: "Customs declaration" },
  { value: "certificate_of_origin", label: "Certificate of origin" },
  { value: "inspection_certificate", label: "Inspection certificate" },
  { value: "other", label: "Other" },
];

interface ShipmentDoc {
  id: string;
  order_id: string;
  doc_type: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

export function ShipmentDocs({ orderId }: { orderId: string }) {
  const [docs, setDocs] = useState<ShipmentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("commercial_invoice");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, [orderId]);

  async function load() {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("shipment_docs")
      .select("*")
      .eq("order_id", orderId)
      .order("uploaded_at", { ascending: false });
    setDocs(data || []);
    setLoading(false);
  }

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("get-signed-upload-url", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { order_id: orderId, file_type: "po_document", file_name: file.name },
      });
      if (error || !data?.upload_url) throw new Error("Could not get upload URL");
      await fetch(data.upload_url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setFileUrl(data.storage_path || data.public_url || data.upload_url.split("?")[0]);
      setFileName(file.name);
      toast.success("File ready");
    } catch (e: any) { toast.error(e.message || "Upload failed"); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!fileUrl) { toast.error("Add a file or URL"); return; }
    const { error } = await (supabase as any).from("shipment_docs").insert({
      order_id: orderId,
      doc_type: docType,
      file_url: fileUrl,
      file_name: fileName || fileUrl.split("/").pop() || docType,
    });
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Document saved");
    setFileUrl(""); setFileName(""); setShowAdd(false);
    load();
  };

  const docLabel = (type: string) => DOC_TYPES.find(d => d.value === type)?.label || type;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button type="button" onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">
            Shipment documents
            {docs.length > 0 && <span className="ml-2 text-xs font-normal text-muted-foreground">{docs.length} document{docs.length !== 1 ? "s" : ""}</span>}
          </p>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {loading ? (
            <div className="flex items-center justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              {docs.length === 0 && !showAdd && (
                <div className="px-5 py-4 text-center">
                  <p className="text-sm text-muted-foreground">No shipment documents yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">Store your commercial invoice, packing list, bill of lading, and customs docs here — all in one place, attached to the order.</p>
                </div>
              )}

              {docs.length > 0 && (
                <div className="divide-y divide-border">
                  {docs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{docLabel(doc.doc_type)}</p>
                        <p className="text-xs text-muted-foreground">{doc.file_name} · {format(new Date(doc.uploaded_at), "MMM d, yyyy")}</p>
                      </div>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline">
                        Open <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <div className="px-5 py-3 border-t border-border">
                {!showAdd ? (
                  <Button size="sm" variant="outline" onClick={() => setShowAdd(true)} className="gap-1.5 w-full">
                    <Plus className="h-3.5 w-3.5" /> Add document
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <select value={docType} onChange={e => setDocType(e.target.value)}
                      className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground">
                      {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <input type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)}
                        placeholder="Paste URL or upload file"
                        className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground placeholder:text-muted-foreground" />
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="px-3 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 flex items-center">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </button>
                      <input ref={fileRef} type="file" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave} disabled={!fileUrl}>Save document</Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
