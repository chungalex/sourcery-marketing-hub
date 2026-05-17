import { useState } from "react";
import { CheckCircle, Circle, ChevronDown, ChevronUp, ThumbsUp, AlertTriangle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DueDiligenceChecklistProps {
  factoryId: string;
  factoryName: string;
}

const QUESTIONS = [
  {
    id: "capacity",
    title: "Capacity and current load",
    ask: "What's your current monthly production capacity, and what percentage is already committed to other brands?",
    greenFlag: "Gives a specific number. Is honest about current load ('we're at 70% right now'). Offers a production window date.",
    redFlag: "Vague answer ('we can handle anything'). Unwilling to give numbers. Pushes to just 'start the order' without discussing capacity.",
    why: "A factory at 100% capacity will miss your delivery date. One that won't tell you their load is hiding something.",
  },
  {
    id: "references",
    title: "Brand references",
    ask: "Can you share 2–3 brand contacts we can speak with — ideally brands similar to us in size and category?",
    greenFlag: "Shares names and contacts immediately. References respond and give genuine feedback. Brands are real and verifiable.",
    redFlag: "Hesitates or declines. Offers only household brand names you can't actually contact. References don't respond or are suspiciously vague.",
    why: "The best factories want to show off their client list. Reluctance is a signal.",
  },
  {
    id: "qc",
    title: "Quality control process",
    ask: "Walk me through your QC process — at what stages do you inspect, who does the inspection, and what happens when something fails?",
    greenFlag: "Describes specific stages (inline during production, pre-shipment). Has internal QC team plus offers external audit option. Clear failure protocol.",
    redFlag: "'We check everything' with no specifics. No documented process. Defensive when asked what happens when QC fails.",
    why: "Factories without a real QC process aren't hiding it on purpose — they just don't have one. You need to know before production starts.",
  },
  {
    id: "certifications",
    title: "Certifications",
    ask: "What certifications does your facility hold — WRAP, BSCI, GOTS, ISO 9001, or equivalent? Can you send the documents today?",
    greenFlag: "Sends documents within 24 hours. Certifications are current (check the expiry date). Understands why you're asking.",
    redFlag: "'We're working on getting certified.' Sends documents that are expired. Long delay before sending anything.",
    why: "Certifications are table stakes for any brand selling into the EU or US. Self-reporting means nothing — you need the document.",
  },
  {
    id: "remedy",
    title: "Missed delivery policy",
    ask: "What's your standard remedy if you miss the agreed delivery date — and has that happened in the last 12 months?",
    greenFlag: "Has a clear policy (discount, expedited freight, partial credit). Is honest about past delays and explains what caused them.",
    redFlag: "'That won't happen.' No policy. Becomes defensive or dismissive. Can't explain past delays.",
    why: "Every factory misses a deadline eventually. The question isn't whether — it's what they do when they do.",
  },
];

const DOCUMENTS = [
  {
    id: "business_license",
    title: "Business registration / license",
    description: "Confirms they're a registered legal entity in their country. Ask for the official government document, not a summary.",
  },
  {
    id: "quality_cert",
    title: "Quality certification",
    description: "WRAP, BSCI, GOTS, ISO 9001, or market-relevant equivalent. Check the expiry date — anything over 3 years old may not be current.",
  },
  {
    id: "production_photos",
    title: "Recent production photos",
    description: "Photos from the last 30 days of active production. Confirms the factory is operational and shows real conditions.",
  },
];

export function DueDiligenceChecklist({ factoryId, factoryName }: DueDiligenceChecklistProps) {
  const storageKey = `clewa_dd_${factoryId}`;
  const [checked, setChecked] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(id: string) {
    const next = checked.includes(id) ? checked.filter(c => c !== id) : [...checked, id];
    setChecked(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const allIds = [...QUESTIONS.map(q => q.id), ...DOCUMENTS.map(d => d.id)];
  const doneCount = allIds.filter(id => checked.includes(id)).length;
  const totalCount = allIds.length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-foreground">Due Diligence Checklist</h2>
          <span className="text-sm text-muted-foreground">{doneCount}/{totalCount} verified</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Five questions and three documents. What professional buyers check before committing to a new factory. Tick each item as you verify it.
        </p>
        {doneCount > 0 && (
          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(doneCount / totalCount) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">5 Questions to ask</p>
        {QUESTIONS.map((q, i) => {
          const isDone = checked.includes(q.id);
          const isOpen = expanded === q.id;
          return (
            <div
              key={q.id}
              className={cn(
                "rounded-xl border transition-all",
                isDone ? "border-green-500/20 bg-green-500/5" : "border-border bg-card"
              )}
            >
              <div className="flex items-start gap-3 p-4">
                <button
                  type="button"
                  onClick={() => toggle(q.id)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {isDone
                    ? <CheckCircle className="h-4 w-4 text-green-600" />
                    : <Circle className="h-4 w-4 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground/50">{String(i + 1).padStart(2, "0")}</span>
                      <p className={cn("text-sm font-semibold", isDone ? "line-through text-muted-foreground" : "text-foreground")}>
                        {q.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : q.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                    >
                      {isOpen
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />
                      }
                    </button>
                  </div>

                  {!isDone && (
                    <p className="text-xs text-muted-foreground mt-1 italic">"{q.ask}"</p>
                  )}

                  {isOpen && !isDone && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                        <ThumbsUp className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-green-700 mb-0.5">Good answer</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{q.greenFlag}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-rose-700 mb-0.5">Watch for</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{q.redFlag}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground/70 italic px-1">Why it matters: {q.why}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Documents */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">3 Documents to request</p>
        {DOCUMENTS.map((doc) => {
          const isDone = checked.includes(doc.id);
          return (
            <div
              key={doc.id}
              className={cn(
                "rounded-xl border p-4 flex items-start gap-3 transition-all",
                isDone ? "border-green-500/20 bg-green-500/5" : "border-border bg-card"
              )}
            >
              <button
                type="button"
                onClick={() => toggle(doc.id)}
                className="mt-0.5 flex-shrink-0"
              >
                {isDone
                  ? <CheckCircle className="h-4 w-4 text-green-600" />
                  : <Circle className="h-4 w-4 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
                }
              </button>
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <FileText className={cn("h-4 w-4 flex-shrink-0 mt-0.5", isDone ? "text-green-600" : "text-muted-foreground")} />
                <div>
                  <p className={cn("text-sm font-semibold", isDone ? "line-through text-muted-foreground" : "text-foreground")}>
                    {doc.title}
                  </p>
                  {!isDone && (
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{doc.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion state */}
      {doneCount === totalCount && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/25">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-700">Due diligence complete for {factoryName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">You've verified all five questions and requested all three documents. You're ready to commit.</p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground/60 text-center">
        Your checklist progress is saved locally and only visible to you.
      </p>
    </div>
  );
}
