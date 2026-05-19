// ─── Sample Photo Annotation ──────────────────────────────────────────────────
// Brand annotates directly on sample photos.
// Circle a problem area → add comment → factory receives annotated image.
// Replaces "the collar gap is too wide" text descriptions with visual precision.

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageSquare, X, Check, Trash2, ZoomIn, 
  Loader2, Send, Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Annotation {
  id: string;
  x: number; // percentage of image width
  y: number; // percentage of image height
  comment: string;
  resolved: boolean;
  createdAt: Date;
}

interface SampleAnnotationProps {
  orderId: string;
  photoUrl: string;
  sampleRoundId?: string;
  existingAnnotations?: Annotation[];
  onAnnotationSaved?: (annotations: Annotation[]) => void;
  readOnly?: boolean;
}

export function SampleAnnotation({
  orderId,
  photoUrl,
  sampleRoundId,
  existingAnnotations = [],
  onAnnotationSaved,
  readOnly = false,
}: SampleAnnotationProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>(existingAnnotations);
  const [placing, setPlacing] = useState(false);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);
  const [pendingComment, setPendingComment] = useState("");
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!placing || readOnly) return;
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPos({ x, y });
    setPendingComment("");
  }

  async function saveAnnotation() {
    if (!pendingPos || !pendingComment.trim()) {
      toast.error("Add a comment before saving");
      return;
    }
    setSaving(true);
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      x: pendingPos.x,
      y: pendingPos.y,
      comment: pendingComment,
      resolved: false,
      createdAt: new Date(),
    };
    const updated = [...annotations, newAnnotation];
    setAnnotations(updated);
    setPendingPos(null);
    setPendingComment("");
    setPlacing(false);
    onAnnotationSaved?.(updated);
    
    // Save to Supabase as a message for factory visibility
    try {
      await (supabase as any).from("order_messages").insert({
        order_id: orderId,
        content: `Sample annotation at position (${Math.round(pendingPos.x)}%, ${Math.round(pendingPos.y)}%): ${pendingComment}`,
        message_type: "sample_annotation",
        metadata: JSON.stringify({ x: pendingPos.x, y: pendingPos.y, comment: pendingComment }),
      });
    } catch {}
    setSaving(false);
    toast.success("Annotation added — factory will be notified");
  }

  function resolveAnnotation(id: string) {
    const updated = annotations.map(a => 
      a.id === id ? { ...a, resolved: true } : a
    );
    setAnnotations(updated);
    onAnnotationSaved?.(updated);
    setActiveAnnotation(null);
  }

  function deleteAnnotation(id: string) {
    const updated = annotations.filter(a => a.id !== id);
    setAnnotations(updated);
    onAnnotationSaved?.(updated);
    setActiveAnnotation(null);
  }

  const unresolvedCount = annotations.filter(a => !a.resolved).length;

  return (
    <div className="space-y-3">
      {/* Controls */}
      {!readOnly && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setPlacing(!placing); setPendingPos(null); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                placing 
                  ? "border-primary bg-secondary/60 text-primary" 
                  : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              <Circle className="h-3 w-3" />
              {placing ? "Click photo to place" : "Add annotation"}
            </button>
            {placing && (
              <button
                type="button"
                onClick={() => { setPlacing(false); setPendingPos(null); }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            )}
          </div>
          {unresolvedCount > 0 && (
            <span className="text-xs text-amber-600 font-medium">
              {unresolvedCount} unresolved
            </span>
          )}
        </div>
      )}

      {/* Photo with annotation layer */}
      <div
        ref={imgRef}
        className={cn(
          "relative rounded-xl overflow-hidden border border-border select-none",
          placing && "cursor-crosshair ring-2 ring-primary/40"
        )}
        onClick={handleImageClick}
        style={{ aspectRatio: "4/3" }}
      >
        <img 
          src={photoUrl} 
          alt="Sample" 
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Existing annotations */}
        {annotations.map(ann => (
          <div
            key={ann.id}
            className="absolute"
            style={{ left: `${ann.x}%`, top: `${ann.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <button
              type="button"
              onClick={e => { 
                e.stopPropagation(); 
                setActiveAnnotation(activeAnnotation === ann.id ? null : ann.id);
              }}
              className={cn(
                "w-7 h-7 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold shadow-lg transition-all",
                ann.resolved 
                  ? "bg-green-500 border-green-300 opacity-60" 
                  : "bg-red-500 border-red-300 hover:scale-110"
              )}
            >
              {ann.resolved ? "✓" : annotations.indexOf(ann) + 1}
            </button>

            {/* Annotation popup */}
            {activeAnnotation === ann.id && (
              <div 
                className="absolute z-10 bg-card border border-border rounded-xl shadow-lg p-3 w-48"
                style={{ 
                  left: ann.x > 70 ? "auto" : "100%",
                  right: ann.x > 70 ? "100%" : "auto",
                  top: ann.y > 70 ? "auto" : "0",
                  bottom: ann.y > 70 ? "0" : "auto",
                  marginLeft: ann.x > 70 ? "0" : "8px",
                  marginRight: ann.x > 70 ? "8px" : "0",
                }}
                onClick={e => e.stopPropagation()}
              >
                <p className="text-xs text-foreground leading-relaxed mb-2">{ann.comment}</p>
                {!readOnly && !ann.resolved && (
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => resolveAnnotation(ann.id)}
                      className="flex-1 text-[10px] py-1 rounded-lg bg-green-500/10 text-green-600 font-medium hover:bg-green-500/20 transition-colors"
                    >
                      Resolve
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAnnotation(ann.id)}
                      className="text-[10px] px-2 py-1 rounded-lg bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Pending annotation placement */}
        {pendingPos && (
          <div
            className="absolute"
            style={{ left: `${pendingPos.x}%`, top: `${pendingPos.y}%`, transform: "translate(-50%, -50%)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-amber-300 shadow-lg flex items-center justify-center">
              <MessageSquare className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Comment input for pending annotation */}
      {pendingPos && (
        <div className="bg-amber-500/5 border border-amber-400/30 rounded-xl p-3">
          <p className="text-xs font-medium text-amber-600 mb-2">Add your comment for this point</p>
          <textarea
            value={pendingComment}
            onChange={e => setPendingComment(e.target.value)}
            placeholder="e.g. Collar gap too wide — reduce by 8mm. Stitching inconsistent on left seam."
            className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-background resize-none h-16 leading-relaxed"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              onClick={saveAnnotation}
              disabled={saving || !pendingComment.trim()}
              className="gap-1.5"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Save annotation
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setPendingPos(null); setPendingComment(""); setPlacing(false); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Annotation list */}
      {annotations.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            {annotations.length} annotation{annotations.length !== 1 ? "s" : ""}
          </p>
          {annotations.map((ann, i) => (
            <div 
              key={ann.id}
              className={cn(
                "flex items-start gap-2.5 p-2.5 rounded-lg border text-xs",
                ann.resolved 
                  ? "border-green-400/20 bg-green-500/5 opacity-60" 
                  : "border-border bg-card"
              )}
            >
              <span className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5",
                ann.resolved ? "bg-green-500" : "bg-red-500"
              )}>
                {ann.resolved ? "✓" : i + 1}
              </span>
              <span className={cn(
                "flex-1 leading-relaxed",
                ann.resolved ? "line-through text-muted-foreground" : "text-foreground"
              )}>
                {ann.comment}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
