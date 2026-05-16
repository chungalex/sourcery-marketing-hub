import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, Copy, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MessageDrafterProps {
  orderId: string;
  orderStatus: string;
  factoryName?: string;
  onUseDraft?: (text: string) => void;
}

const SITUATIONS = [
  { value: "qc_issue", label: "QC defects — need rework" },
  { value: "delay", label: "Production is running behind" },
  { value: "spec_change", label: "I need to change a spec" },
  { value: "sample_feedback", label: "Sample feedback and revision request" },
  { value: "payment_release", label: "Confirming payment release" },
  { value: "status_update", label: "Requesting a production update" },
  { value: "cargo_cutoff", label: "Urgently need shipping confirmation" },
  { value: "negotiate_price", label: "Negotiating price for next order" },
  { value: "custom", label: "Something else..." },
];

export function MessageDrafter({ orderId, orderStatus, factoryName, onUseDraft }: MessageDrafterProps) {
  const [open, setOpen] = useState(false);
  const [situation, setSituation] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<"firm" | "diplomatic" | "urgent">("diplomatic");
  const [draft, setDraft] = useState("");
  const [draftVN, setDraftVN] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVN, setShowVN] = useState(false);

  async function generateDraft() {
    if (!situation) { toast.error("Select the situation first"); return; }
    setLoading(true);
    setDraft("");
    setDraftVN("");

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const toneGuide = {
        firm: "firm and clear — leave no room for ambiguity, but remain professional",
        diplomatic: "professional and relationship-preserving — clear on what you need but respectful",
        urgent: "urgent and direct — time-sensitive, make clear this needs immediate attention",
      }[tone];

      const situationLabels: Record<string, string> = {
        qc_issue: "addressing quality control defects that need to be reworked",
        delay: "addressing a production delay and understanding the impact on delivery",
        spec_change: "communicating a specification change mid-production",
        sample_feedback: "providing sample feedback and requesting specific revisions",
        payment_release: "confirming a milestone payment has been released",
        status_update: "requesting a production status update with specific information needed",
        cargo_cutoff: "urgently confirming shipping arrangements before cargo cutoff",
        negotiate_price: "negotiating pricing for the next production order",
        custom: context || "general communication",
      };

      const prompt = `Write a professional factory communication message for the following situation:

Factory: ${factoryName || "the factory"}
Situation: ${situationLabels[situation]}
Order status: ${orderStatus}
Additional context: ${context || "none provided"}
Tone: ${toneGuide}

Write two versions:
1. English version — professional, clear, production-specific language
2. Vietnamese version — same message, translated with appropriate manufacturing terminology and professional Vietnamese business register

Return ONLY a JSON object:
{
  "english": "the full message in English",
  "vietnamese": "the full message in Vietnamese"
}

The message should:
- Get to the point immediately
- State what you need clearly
- Give a specific timeframe if relevant
- Be something a sourcing director would actually send`;

      const { data, error } = await (supabase as any).functions.invoke("production-assistant", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
        body: {
          system: "You are a production communication specialist. Write clear, professional factory messages. Return only valid JSON.",
          messages: [{ role: "user", content: prompt }],
        },
      });

      if (!error && data?.content?.[0]?.text) {
        const text = data.content[0].text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(text);
        setDraft(parsed.english || "");
        setDraftVN(parsed.vietnamese || "");
      } else {
        toast.error("Failed to generate — try again");
      }
    } catch (e) {
      toast.error("Generation failed");
    }
    setLoading(false);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Draft a factory message</span>
          <span className="text-xs text-muted-foreground">— English + Vietnamese</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-border p-4 space-y-3">
          {/* Situation selector */}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">What do you need to communicate?</label>
            <div className="grid grid-cols-2 gap-1.5">
              {SITUATIONS.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSituation(s.value)}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg border text-xs transition-all",
                    situation === s.value
                      ? "border-primary bg-primary/5 text-foreground font-medium"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Context */}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Specific details (optional)
            </label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. 14 defects in size M, stitching at left seam — need rework within 3 days or delivery window is at risk"
              className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground resize-none h-16 leading-relaxed"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Tone</label>
            <div className="flex gap-2">
              {(["diplomatic", "firm", "urgent"] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs capitalize transition-all",
                    tone === t
                      ? "border-primary bg-primary/5 text-foreground font-medium"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button
            size="sm"
            onClick={generateDraft}
            disabled={loading || !situation}
            className="gap-1.5 w-full"
          >
            {loading
              ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Writing your message...</>
              : <><Sparkles className="h-3.5 w-3.5" /> Generate message</>
            }
          </Button>

          {/* Draft output */}
          {draft && (
            <div className="space-y-3 pt-1">
              {/* English */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-foreground">English</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(draft)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                    {onUseDraft && (
                      <button
                        type="button"
                        onClick={() => onUseDraft(draft)}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" /> Use in message
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg-secondary/40 rounded-lg px-3 py-2.5 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {draft}
                </div>
              </div>

              {/* Vietnamese */}
              {draftVN && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-foreground">Tiếng Việt</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(draftVN)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>
                  <div className="bg-secondary/40 rounded-lg px-3 py-2.5 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {draftVN}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={generateDraft}
                disabled={loading}
                className="gap-1.5 w-full"
              >
                <Sparkles className="h-3.5 w-3.5" /> Regenerate
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
