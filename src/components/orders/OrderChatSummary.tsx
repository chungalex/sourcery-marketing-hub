import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderChatSummaryProps {
  orderId: string;
  className?: string;
}

interface SummaryData {
  decisions: string[];
  action_items: string[];
  unresolved: string[];
  generated_at: string;
}

export function OrderChatSummary({ orderId, className }: OrderChatSummaryProps) {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch messages
      const { data: messages, error: msgErr } = await supabase
        .from("messages" as never)
        .select("sender_role, content, created_at")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });

      if (msgErr || !messages || (messages as any[]).length === 0) {
        setError("No messages found for this order.");
        setLoading(false);
        return;
      }

      const thread = (messages as any[])
        .map((m: any) => `[${m.sender_role.toUpperCase()}]: ${m.content}`)
        .join("\n");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are summarising a production order message thread between a brand and a factory. Be concise and specific. Return ONLY valid JSON with this exact structure:
{
  "decisions": ["list of key decisions that were made"],
  "action_items": ["list of open action items that still need to happen"],
  "unresolved": ["list of issues or questions that were raised but not resolved"]
}

Message thread:
${thread}

Return only the JSON object, no other text.`
          }]
        }),
      });

      const data = await response.json();
      const text = data?.content?.[0]?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setSummary({ ...parsed, generated_at: new Date().toISOString() });
    } catch (e) {
      setError("Could not generate summary. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className={cn("bg-card border border-border rounded-xl p-5", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">AI Chat Summary</h3>
        </div>
        <div className="flex items-center gap-2">
          {summary && (
            <button onClick={() => setExpanded(e => !e)} className="text-muted-foreground hover:text-foreground">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
          <Button size="sm" variant="outline" onClick={generateSummary} disabled={loading} className="text-xs h-7">
            {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
            {summary ? "Refresh" : "Summarise thread"}
          </Button>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {summary && expanded && (
        <div className="space-y-4 mt-3">
          {summary.decisions.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Decisions made</p>
              <ul className="space-y-1.5">
                {summary.decisions.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {summary.action_items.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Action items</p>
              <ul className="space-y-1.5">
                {summary.action_items.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {summary.unresolved.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Unresolved</p>
              <ul className="space-y-1.5">
                {summary.unresolved.map((u, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground">Generated {new Date(summary.generated_at).toLocaleTimeString()}</p>
        </div>
      )}

      {!summary && !loading && !error && (
        <p className="text-xs text-muted-foreground">Summarise the full message thread into key decisions, open action items, and unresolved issues.</p>
      )}
    </div>
  );
}
