import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Upload, Camera, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface SampleSubmitFormProps {
  orderId: string;
  orderNumber: string;
  currentRound: number;
  revisionNotes?: string | null;
  onSubmitted: () => void;
}

export function SampleSubmitForm({
  orderId,
  orderNumber,
  currentRound,
  revisionNotes,
  onSubmitted,
}: SampleSubmitFormProps) {
  const [notes, setNotes] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([""]);
  const [measurements, setMeasurements] = useState([{ key: "", value: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPhotoUrl = () => setPhotoUrls(prev => [...prev, ""]);
  const updatePhotoUrl = (i: number, val: string) =>
    setPhotoUrls(prev => prev.map((u, idx) => (idx === i ? val : u)));
  const removePhotoUrl = (i: number) =>
    setPhotoUrls(prev => prev.filter((_, idx) => idx !== i));

  const addMeasurement = () => setMeasurements(prev => [...prev, { key: "", value: "" }]);
  const updateMeasurement = (i: number, field: "key" | "value", val: string) =>
    setMeasurements(prev => prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)));
  const removeMeasurement = (i: number) =>
    setMeasurements(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!notes.trim() && photoUrls.filter(u => u.trim()).length === 0) {
      toast.error("Add photos or notes before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const validPhotos = photoUrls.filter(u => u.trim());
      const validMeasurements = measurements.filter(m => m.key.trim() && m.value.trim());
      const measurementsObj = validMeasurements.length > 0
        ? Object.fromEntries(validMeasurements.map(m => [m.key.trim(), m.value.trim()]))
        : undefined;

      const { error } = await supabase.functions.invoke("order-action", {
        body: {
          action: "submit_sample",
          order_id: orderId,
          sample: {
            notes: notes.trim() || undefined,
            photo_urls: validPhotos,
            measurements: measurementsObj,
          },
        },
      });

      if (error) throw new Error(error.message);

      toast.success(`Sample round ${currentRound} submitted.`);
      onSubmitted();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit sample.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Revision notes from brand — shown when factory is responding to a revision request */}
      {revisionNotes && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Brand requested changes
            </p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{revisionNotes}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
          {currentRound}
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Round {currentRound} sample submission — Order {orderNumber}
        </p>
      </div>

      {/* Photo URLs */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Camera className="h-4 w-4" />
          Sample Photos
        </Label>
        <p className="text-xs text-muted-foreground">
          Paste URLs to your sample photos (Google Drive, Dropbox, WeTransfer, etc.)
        </p>
        {photoUrls.map((url, i) => (
          <div key={i} className="flex gap-2">
            <Input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={e => updatePhotoUrl(i, e.target.value)}
              className="flex-1 text-sm"
            />
            {photoUrls.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePhotoUrl(i)}
                className="text-muted-foreground hover:text-destructive px-2"
              >
                ×
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPhotoUrl}
          className="w-full text-xs"
        >
          + Add another photo
        </Button>
      </div>

      {/* Measurements */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Measurements (Optional)</Label>
        <p className="text-xs text-muted-foreground">
          e.g. Chest: 52cm, Length: 74cm
        </p>
        {measurements.map((m, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="Point (e.g. Chest)"
              value={m.key}
              onChange={e => updateMeasurement(i, "key", e.target.value)}
              className="flex-1 text-sm"
            />
            <Input
              placeholder="Value (e.g. 52cm)"
              value={m.value}
              onChange={e => updateMeasurement(i, "value", e.target.value)}
              className="flex-1 text-sm"
            />
            {measurements.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeMeasurement(i)}
                className="text-muted-foreground hover:text-destructive px-2"
              >
                ×
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMeasurement}
          className="w-full text-xs"
        >
          + Add measurement
        </Button>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Notes</Label>
        <Textarea
          placeholder="Anything the brand should know — fabric hand feel, color accuracy, fit observations, deviations from tech pack..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="min-h-[100px] text-sm resize-none"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Submit Sample for Review
          </>
        )}
      </Button>
    </div>
  );
}
