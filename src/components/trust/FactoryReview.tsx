import { useState } from "react";
import { Star, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FactoryReviewProps {
  orderId: string;
  factoryId: string;
  factoryName: string;
  orderStatus: string;
  onReviewSubmitted?: () => void;
}

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="space-y-1">
      <Label className="text-sm">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                star <= (hover || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const reviewableStatuses = ["closed", "shipped", "qc_pass", "ready_to_ship"];

export function FactoryReview({ orderId, factoryId, factoryName, orderStatus, onReviewSubmitted }: FactoryReviewProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [commRating, setCommRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [wouldReorder, setWouldReorder] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canReview = reviewableStatuses.includes(orderStatus);

  if (!canReview) return null;
  if (submitted) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
        <h3 className="font-semibold text-foreground mb-1">Review Submitted</h3>
        <p className="text-sm text-muted-foreground">Thank you for helping the community.</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!user || rating === 0) {
      toast.error("Please select an overall rating");
      return;
    }
    setSubmitting(true);

    const { error } = await (supabase as any)
      .from("factory_reviews")
      .insert({
        factory_id: factoryId,
        order_id: orderId,
        reviewer_id: user.id,
        rating,
        quality_rating: qualityRating || null,
        communication_rating: commRating || null,
        delivery_rating: deliveryRating || null,
        review_text: reviewText.trim() || null,
        would_reorder: wouldReorder,
      });

    if (error) {
      if (error.code === "23505") {
        toast.error("You've already reviewed this order");
      } else {
        toast.error("Failed to submit review");
        console.error("Review error:", error);
      }
    } else {
      toast.success("Review submitted — thanks for the feedback!");
      setSubmitted(true);
      onReviewSubmitted?.();
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Rate Your Experience</h3>
        <p className="text-sm text-muted-foreground">
          How was working with <strong>{factoryName}</strong>?
        </p>
      </div>

      <StarRating value={rating} onChange={setRating} label="Overall Rating *" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StarRating value={qualityRating} onChange={setQualityRating} label="Product Quality" />
        <StarRating value={commRating} onChange={setCommRating} label="Communication" />
        <StarRating value={deliveryRating} onChange={setDeliveryRating} label="On-Time Delivery" />
      </div>

      <div className="space-y-2">
        <Label>Review (optional)</Label>
        <Textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share details about quality, communication, delivery, and anything brands should know..."
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground text-right">{reviewText.length}/1000</p>
      </div>

      <div className="space-y-2">
        <Label>Would you reorder from this factory?</Label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setWouldReorder(true)}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
              wouldReorder === true
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary"
            )}
          >
            Yes, definitely
          </button>
          <button
            type="button"
            onClick={() => setWouldReorder(false)}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
              wouldReorder === false
                ? "bg-destructive/10 text-destructive border-destructive/30"
                : "border-border text-muted-foreground hover:border-destructive/30"
            )}
          >
            Probably not
          </button>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={submitting || rating === 0} className="w-full sm:w-auto">
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Review
      </Button>
    </div>
  );
}
