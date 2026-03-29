import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Clock, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface RevisionRound {
  id: string;
  round_number: number;
  description: string;
  impact_timeline: string | null;
  impact_cost: string | null;
  status: "pending" | "acknowledged" | "disputed" | "resolved";
  factory_acknowledged_at: string | null;
  dispute_reason: string | null;
  resolution: string | null;
  resolved_at: string | null;
  created_at: string;
}

interface RevisionRoundsProps {
  orderId: string;
  isFactory?: boolean;
  onActionComplete: () => void;
}

export function RevisionRounds({ orderId, isFactory = false, onActionComplete }: RevisionRoundsProps) {
  const [rounds, setRounds] = useState<RevisionRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);

  // Brand — submit new revision
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [impactTimeline, setImpactTimeline] = useState("");
  const [impactCost, setImpactCost] = useState("");

  // Factory — dispute
  const [disputingId, setDisputingId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");

  useEffect(() => { loadRounds(); }, [orderId]);

  async function loadRounds() {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("revision_rounds")
      .select("*")
      .eq("order_id", orderId)
      .order("round_number", { ascending: false });
    setRounds((data as RevisionRound[]) || []);
    if (data?.length) setExpanded((data as any[])[0].id);
    setLoading(false);
  }

  const handleSubmit = async () => {
    if (!description.trim()) { toast.error("Describe what needs to change."); return; }
    setIsActing(true);
    try {
      const { error } = await supabase.functions.invoke("order-action", {
        body: {
          action: "submit_revision_round",
          order_id: orderId,
          revision_description: description.trim(),
          impact_timeline: impactTimeline.trim() || undefined,
          impact_cost: impactCost.trim() || undefined,
        },
      });
      if (error) throw new Error(error.message);
      toast.success("Revision submitted. Factory must acknowledge before production continues.");
      setDescription(""); setImpactTimeline(""); setImpactCost(""); setShowForm(false);
      loadRounds(); onActionComplete();
    } catch (e: any) { toast.error(e.message || "Failed to submit revision."); }
    finally { setIsActing(false); }
  };

  const handleAcknowledge = async (roundId: string) => {
    setIsActing(true);
    try {
      const { error } = await supabase.functions.invoke("order-action", {
        body: { action: "acknowledge_revision_round", order_id: orderId, revision_round_id: roundId },
      });
      if (error) throw new Error(error.message);
      toast.success("Revision acknowledged.");
      loadRounds(); onActionComplete();
    } catch (e: any) { toast.error(e.message || "Failed to acknowledge."); }
    finally { setIsActing(false); }
  };

  const handleDispute = async (roundId: string) => {
    if (!disputeReason.trim()) { toast.error("Explain why you're disputing."); return; }
    setIsActing(true);
    try {
      const { error } = await supabase.functions.invoke("order-action", {
        body: { action: "dispute_revision_round", order_id: orderId, revision_round_id: roundId, dispute_reason: disputeReason.trim() },
      });
      if (error) throw new Error(error.message);
      toast.success("Revision disputed. Escalated to admin.");
      setDisputingId(null); setDisputeReason("");
      loadRounds(); onActionComplete();
    } catch (e: any) { toast.error(e.message || "Failed to dispute."); }
    finally { setIsActing(false); }
  };

  const statusConfig = {
    pending: { label: "Awaiting acknowledgement", cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock },
    acknowledged: { label: "Acknowledged", cls: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle },
    disputed: { label: "Disputed — admin review", cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", icon: AlertCircle },
    resolved: { label: "Resolved", cls: "bg-secondary text-muted-foreground border-border", icon: CheckCircle },
  };

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      {/* Brand — submit new revision button */}
      {!isFactory && !showForm && (
        <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="w-full">
          + Submit Revision Request
        </Button>
      )}

      {/* New revision form */}
      {!isFactory && showForm && (
        <div className="border border-border rounded-lg p-4 space-y-3 bg-secondary/20">
          <p className="text-sm font-medium text-foreground">New revision request</p>
          <p className="text-xs text-muted-foreground">Be specific. This becomes a permanent part of the order record and the factory must formally acknowledge it before production continues.</p>
          <div className="space-y-1">
            <Label className="text-xs">What needs to change <span className="text-rose-500">*</span></Label>
            <Textarea
              placeholder="e.g. Change collar rib from 2x2 to 1x1. Reduce sleeve length by 1.5cm. Update colorway from navy to midnight (Pantone 289 C)."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="min-h-[80px] text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Timeline impact (optional)</Label>
              <Input placeholder="e.g. +3 days" value={impactTimeline} onChange={e => setImpactTimeline(e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Cost impact (optional)</Label>
              <Input placeholder="e.g. +$0.40/unit" value={impactCost} onChange={e => setImpactCost(e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button onClick={handleSubmit} disabled={isActing || !description.trim()} size="sm">
              {isActing && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              Submit Revision
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setDescription(""); }}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Round history */}
      {rounds.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No revision rounds yet.</p>
          {!isFactory && <p className="text-xs text-muted-foreground mt-1">Use the button above to log a spec change.</p>}
        </div>
      )}

      {rounds.map(r => {
        const cfg = statusConfig[r.status];
        const Icon = cfg.icon;
        const isOpen = expanded === r.id;
        const pendingAck = isFactory && r.status === "pending";

        return (
          <div key={r.id} className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
              onClick={() => setExpanded(isOpen ? null : r.id)}
            >
              <div className="flex items-center gap-3">
                {pendingAck && <div className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />}
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{r.round_number}</div>
                <div>
                  <span className="text-sm font-medium text-foreground">Round {r.round_number}</span>
                  <span className="text-xs text-muted-foreground ml-2">{format(new Date(r.created_at), "MMM d, yyyy")}</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
                  <Icon className="h-3 w-3" />{cfg.label}
                </span>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {isOpen && (
              <div className="p-4 space-y-4 border-t border-border">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">What changed</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{r.description}</p>
                </div>

                {(r.impact_timeline || r.impact_cost) && (
                  <div className="flex gap-4">
                    {r.impact_timeline && (
                      <div className="text-xs"><span className="text-muted-foreground">Timeline impact: </span><span className="text-foreground font-medium">{r.impact_timeline}</span></div>
                    )}
                    {r.impact_cost && (
                      <div className="text-xs"><span className="text-muted-foreground">Cost impact: </span><span className="text-foreground font-medium">{r.impact_cost}</span></div>
                    )}
                  </div>
                )}

                {r.factory_acknowledged_at && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Acknowledged {format(new Date(r.factory_acknowledged_at), "MMM d, yyyy 'at' HH:mm")}
                  </div>
                )}

                {r.dispute_reason && (
                  <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5">
                    <p className="text-xs font-medium text-foreground mb-1">Dispute reason</p>
                    <p className="text-sm text-muted-foreground">{r.dispute_reason}</p>
                  </div>
                )}

                {r.resolution && (
                  <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                    <p className="text-xs font-medium text-foreground mb-1">Resolution</p>
                    <p className="text-sm text-muted-foreground">{r.resolution}</p>
                  </div>
                )}

                {/* Factory actions on pending */}
                {pendingAck && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <Button onClick={() => handleAcknowledge(r.id)} disabled={isActing} className="w-full" size="sm">
                      {isActing ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <CheckCircle className="mr-2 h-3 w-3" />}
                      Acknowledge — I'll update production accordingly
                    </Button>
                    {disputingId === r.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Explain why you're disputing this revision..."
                          value={disputeReason}
                          onChange={e => setDisputeReason(e.target.value)}
                          className="min-h-[70px] text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDispute(r.id)} disabled={isActing || !disputeReason.trim()}>
                            Submit Dispute
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setDisputingId(null); setDisputeReason(""); }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => setDisputingId(r.id)}>
                        Dispute this revision
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
