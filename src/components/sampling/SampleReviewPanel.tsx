import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface SampleSubmission {
  id: string;
  round: number;
  notes: string | null;
  measurements: Record<string, string> | null;
  photo_urls: string[];
  status: "pending" | "approved" | "revision_requested";
  submitted_at: string;
  reviewed_at: string | null;
}

interface SampleRevision {
  id: string;
  round: number;
  revision_notes: string;
  acknowledged_at: string | null;
  created_at: string;
}

interface SampleReviewPanelProps {
  orderId: string;
  orderStatus: string;
  isFactory?: boolean;
  onActionComplete: () => void;
}

export function SampleReviewPanel({
  orderId,
  orderStatus,
  isFactory = false,
  onActionComplete,
}: SampleReviewPanelProps) {
  const [submissions, setSubmissions] = useState<SampleSubmission[]>([]);
  const [revisions, setRevisions] = useState<SampleRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [isActing, setIsActing] = useState(false);
  const [expandedRound, setExpandedRound] = useState<string | null>(null);

  const latestSubmission = submissions[0] ?? null;
  const latestRevision = revisions.find(r => !r.acknowledged_at) ?? null;

  useEffect(() => {
    loadSamples();
  }, [orderId]);

  async function loadSamples() {
    setLoading(true);
    try {
      const [subRes, revRes] = await Promise.all([
        (supabase as any)
          .from("sample_submissions")
          .select("*")
          .eq("order_id", orderId)
          .order("round", { ascending: false }),
        (supabase as any)
          .from("sample_revisions")
          .select("*")
          .eq("order_id", orderId)
          .order("round", { ascending: false }),
      ]);
      setSubmissions((subRes.data as SampleSubmission[]) || []);
      setRevisions((revRes.data as SampleRevision[]) || []);
      if (subRes.data?.length) setExpandedRound(subRes.data[0].id);
    } catch (err) {
      console.error("Failed to load samples", err);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async () => {
    if (!latestSubmission) return;
    setIsActing(true);
    try {
      // Get session for auth
      const { data: { session: _sess } } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke("order-action", {
        headers: { Authorization: `Bearer ${_sess?.access_token}` },
        body: {
          action: "approve_sample",
          order_id: orderId,
          sample_submission_id: latestSubmission.id,
        },
      });
      if (error) throw new Error(error.message);
      toast.success("Sample approved. Production can now begin.");
      onActionComplete();
    } catch (err: any) {
      toast.error(err.message || "Failed to approve sample.");
    } finally {
      setIsActing(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!latestSubmission || !revisionNotes.trim()) {
      toast.error("Describe what needs to change.");
      return;
    }
    setIsActing(true);
    try {
      // Get session for auth
      const { data: { session: _sess } } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke("order-action", {
        headers: { Authorization: `Bearer ${_sess?.access_token}` },
        body: {
          action: "request_sample_revision",
          order_id: orderId,
          sample_submission_id: latestSubmission.id,
          revision_notes: revisionNotes.trim(),
        },
      });
      if (error) throw new Error(error.message);
      toast.success("Revision requested. Factory has been notified.");
      setRevisionNotes("");
      onActionComplete();
    } catch (err: any) {
      toast.error(err.message || "Failed to request revision.");
    } finally {
      setIsActing(false);
    }
  };

  const handleAcknowledgeRevision = async () => {
    if (!latestSubmission) return;
    setIsActing(true);
    try {
      // Get session for auth
      const { data: { session: _sess } } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke("order-action", {
        headers: { Authorization: `Bearer ${_sess?.access_token}` },
        body: {
          action: "acknowledge_revision",
          order_id: orderId,
          sample_submission_id: latestSubmission.id,
        },
      });
      if (error) throw new Error(error.message);
      toast.success("Revision acknowledged. Submit your updated sample when ready.");
      onActionComplete();
    } catch (err: any) {
      toast.error(err.message || "Failed to acknowledge.");
    } finally {
      setIsActing(false);
    }
  };

  const statusBadge = (status: SampleSubmission["status"]) => {
    const map = {
      pending: { label: "Awaiting Review", class: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
      approved: { label: "Approved", class: "bg-green-500/10 text-green-600 border-green-500/20" },
      revision_requested: { label: "Revision Requested", class: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
    };
    const s = map[status];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${s.class}`}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="py-8 text-center">
        <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-foreground font-medium">Waiting for sample</p>
        <p className="text-xs text-muted-foreground mt-1">
          The factory hasn't submitted a sample yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Submission history */}
      {submissions.map(sub => (
        <div
          key={sub.id}
          className="border border-border rounded-lg overflow-hidden"
        >
          {/* Header */}
          <button
            type="button"
            onClick={() => setExpandedRound(expandedRound === sub.id ? null : sub.id)}
            className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                {sub.round}
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Round {sub.round}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {format(new Date(sub.submitted_at), "MMM d, yyyy")}
                </span>
              </div>
              {statusBadge(sub.status)}
            </div>
            {expandedRound === sub.id ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {/* Expanded content */}
          {expandedRound === sub.id && (
            <div className="p-4 space-y-4">
              {/* Photos */}
              {sub.photo_urls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Photos</p>
                  <div className="flex flex-wrap gap-2">
                    {sub.photo_urls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline border border-primary/20 rounded px-2 py-1 bg-primary/5"
                      >
                        Photo {i + 1}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Measurements */}
              {sub.measurements && Object.keys(sub.measurements).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Measurements</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(sub.measurements).map(([k, v]) => (
                      <div key={k} className="bg-secondary/50 rounded p-2 text-xs">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="ml-1 font-medium text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {sub.notes && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Factory Notes</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{sub.notes}</p>
                </div>
              )}

              {/* Revision notes for this round */}
              {revisions.filter(r => r.round === sub.round).map(rev => (
                <div key={rev.id} className="flex items-start gap-3 p-3 rounded-lg border border-rose-500/20 bg-rose-500/5">
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-foreground">Revision requested</p>
                      {rev.acknowledged_at && (
                        <span className="text-xs text-muted-foreground">Acknowledged</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{rev.revision_notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Brand actions — only on latest pending submission */}
      {!isFactory && latestSubmission?.status === "pending" && (
        <div className="space-y-3 pt-2 border-t border-border">
          <p className="text-sm font-medium text-foreground">Your decision</p>

          {/* Approve */}
          <Button
            onClick={handleApprove}
            disabled={isActing}
            className="w-full"
          >
            {isActing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Approve Sample — Start Production
          </Button>

          {/* Request revision */}
          <div className="space-y-2">
            <Label className="text-sm">Request revision</Label>
            <Textarea
              placeholder="Be specific — what needs to change and why. This becomes part of the permanent order record."
              value={revisionNotes}
              onChange={e => setRevisionNotes(e.target.value)}
              className="min-h-[80px] text-sm resize-none"
            />
            <Button
              variant="outline"
              onClick={handleRequestRevision}
              disabled={isActing || !revisionNotes.trim()}
              className="w-full"
            >
              {isActing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AlertCircle className="mr-2 h-4 w-4" />
              )}
              Request Revision
            </Button>
          </div>
        </div>
      )}

      {/* Factory — acknowledge revision */}
      {isFactory && latestRevision && !latestRevision.acknowledged_at && (
        <div className="pt-2 border-t border-border">
          <Button
            variant="outline"
            onClick={handleAcknowledgeRevision}
            disabled={isActing}
            className="w-full"
          >
            {isActing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Acknowledge Revision Request
          </Button>
        </div>
      )}

      {/* Approved state */}
      {latestSubmission?.status === "approved" && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
          <p className="text-sm text-foreground">
            Sample approved{latestSubmission.reviewed_at && ` on ${format(new Date(latestSubmission.reviewed_at), "MMM d, yyyy")}`}. Production can begin.
          </p>
        </div>
      )}
    </div>
  );
}
