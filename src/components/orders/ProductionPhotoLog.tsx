import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Upload, ChevronDown, ChevronUp, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PRODUCTION_STAGES = [
  { value: "fabric_received", label: "Fabric received" },
  { value: "cutting", label: "Cutting" },
  { value: "sewing", label: "Sewing" },
  { value: "finishing", label: "Finishing" },
  { value: "packing", label: "Packing" },
  { value: "other", label: "Other" },
];

interface ProductionPhoto {
  id: string;
  order_id: string;
  stage: string;
  photo_url: string;
  caption: string | null;
  uploaded_by_role: string;
  created_at: string;
}

interface ProductionPhotoLogProps {
  orderId: string;
  isFactory?: boolean;
}

export function ProductionPhotoLog({ orderId, isFactory = false }: ProductionPhotoLogProps) {
  const [photos, setPhotos] = useState<ProductionPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState("cutting");
  const [caption, setCaption] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, [orderId]);

  async function load() {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("production_photos")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    setPhotos(data || []);
    setLoading(false);
  }

  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { toast.error("Photo must be under 10MB"); return; }
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("get-signed-upload-url", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { order_id: orderId, file_type: "evidence", file_name: file.name },
      });
      if (error || !data?.upload_url) throw new Error("Could not get upload URL");
      await fetch(data.upload_url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setPhotoUrl(data.storage_path || data.public_url || data.upload_url.split("?")[0]);
      toast.success("Photo ready — click Upload to attach");
    } catch (e: any) { toast.error(e.message || "Upload failed"); }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!photoUrl) { toast.error("Add a photo URL or upload a file"); return; }
    const { error } = await (supabase as any).from("production_photos").insert({
      order_id: orderId,
      stage,
      photo_url: photoUrl,
      caption: caption.trim() || null,
      uploaded_by_role: isFactory ? "factory" : "brand",
    });
    if (error) { toast.error("Failed to save photo"); return; }
    toast.success("Photo added to production log");
    setPhotoUrl(""); setCaption("");
    load();
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button type="button" onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-3">
          <Camera className="h-4 w-4 text-primary" />
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">
              Production photos
              {photos.length > 0 && <span className="ml-2 text-xs font-normal text-muted-foreground">{photos.length} update{photos.length !== 1 ? "s" : ""}</span>}
            </p>
            {photos.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">Last update: {format(new Date(photos[0].created_at), "MMM d, h:mm a")}</p>
            )}
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {loading ? (
            <div className="flex items-center justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              {photos.length === 0 && (
                <div className="px-5 py-4 text-center">
                  <p className="text-sm text-muted-foreground">No production photos yet.</p>
                  {isFactory && <p className="text-xs text-muted-foreground mt-1">Upload photos at key stages — fabric receipt, cutting, sewing, finishing — to keep the brand informed without back-and-forth messages.</p>}
                </div>
              )}

              {/* Photo grid */}
              {photos.length > 0 && (
                <div className="p-4 space-y-3">
                  {photos.map(photo => (
                    <div key={photo.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/30">
                      <a href={photo.photo_url} target="_blank" rel="noopener noreferrer"
                        className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-secondary border border-border">
                        <img src={photo.photo_url} alt={photo.stage} className="w-full h-full object-cover" onError={e => { (e.target as any).style.display = "none"; }} />
                      </a>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-foreground capitalize">{photo.stage.replace(/_/g, " ")}</span>
                          <span className={cn("text-xs px-1.5 py-0.5 rounded-full border",
                            photo.uploaded_by_role === "factory" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary text-muted-foreground border-border"
                          )}>
                            {photo.uploaded_by_role}
                          </span>
                        </div>
                        {photo.caption && <p className="text-xs text-muted-foreground leading-relaxed">{photo.caption}</p>}
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(photo.created_at), "MMM d, yyyy · h:mm a")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload section - factory only */}
              {isFactory && (
                <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                  <p className="text-xs font-semibold text-foreground">Add production update</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Stage</p>
                      <select value={stage} onChange={e => setStage(e.target.value)}
                        className="w-full text-xs border border-border rounded-lg px-2 py-1.5 bg-card text-foreground">
                        {PRODUCTION_STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Caption</p>
                      <input value={caption} onChange={e => setCaption(e.target.value)}
                        placeholder="e.g. 450 units cut, starting sewing"
                        className="w-full text-xs border border-border rounded-lg px-2 py-1.5 bg-card text-foreground placeholder:text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Photo</p>
                    <div className="flex gap-2">
                      <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)}
                        placeholder="Paste photo URL or upload below"
                        className="flex-1 text-xs border border-border rounded-lg px-2 py-1.5 bg-card text-foreground placeholder:text-muted-foreground" />
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 flex items-center gap-1">
                        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                    </div>
                  </div>
                  <Button size="sm" onClick={handleSubmit} disabled={!photoUrl} className="w-full gap-1.5">
                    <Camera className="h-3.5 w-3.5" /> Post production update
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
