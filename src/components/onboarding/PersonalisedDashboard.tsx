import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight, Search, Shield, Zap, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Roadmap steps per situation ───────────────────────────────────────────────
const ROADMAPS = {
  no_factory: {
    headline: "Let's find your factory.",
    sub: "You're in the right place. Here's the exact sequence — every step explained, nothing skipped.",
    icon: Search,
    color: "border-blue-400/30 bg-blue-500/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    primaryCta: { label: "Browse registered factories", href: "/directory" },
    secondaryCta: { label: "Try AI factory matching", href: "/dashboard?tab=tools" },
    steps: [
      {
        id: "write_brief",
        title: "Write your product brief",
        body: "Before you contact any factory, write down exactly what you're making — fabric, construction, quantity, delivery date, quality standard. Factories take brands seriously when they arrive prepared. The AI brief generator helps you write it.",
        action: { label: "Open AI brief generator", href: "/dashboard?tab=tools" },
        why: "A clear brief gets you accurate quotes. Vague briefs get ignored or wildly overpriced.",
      },
      {
        id: "find_factory",
        title: "Find and shortlist factories",
        body: "Browse the directory or use AI matching. Look at their OTIF score (on-time/in-full from real orders), their categories, their MOQ, and their lead time. Shortlist 2-3 options.",
        action: { label: "Browse factories", href: "/directory" },
        why: "Never commit to one factory without comparing at least two. Price is not the only variable.",
      },
      {
        id: "run_rfq",
        title: "Send your RFQ to multiple factories",
        body: "One brief, multiple factories, simultaneous. Compare their quotes side by side — unit price, lead time, payment terms. This is how professional brands source.",
        action: { label: "Create your first RFQ", href: "/rfq/create" },
        why: "Sending to multiple factories simultaneously saves weeks and gives you real market data on pricing.",
      },
      {
        id: "due_diligence",
        title: "Run due diligence before committing",
        body: "For any factory you're seriously considering: request their certifications, ask about their QC process, and check their order capacity. The due diligence checklist tells you exactly what to ask.",
        action: { label: "Open due diligence checklist", href: "/dashboard?tab=tools" },
        why: "The factory's behaviour before you commit tells you everything about how they'll behave after.",
      },
      {
        id: "first_order",
        title: "Create your first structured order",
        body: "Guided 4-step process. Every field explained, every decision contextualised. Milestone-gated payments protect you at every stage — no payment releases until the condition is met.",
        action: { label: "Create first order", href: "/orders/create" },
        why: "A structured order is the professional way to work with a factory. It protects you and earns their respect.",
      },
    ],
  },
  not_sure: {
    headline: "Let's make sure you can trust them.",
    sub: "You don't need to walk away. You need the right information and the right protection. Here's how to get both.",
    icon: Shield,
    color: "border-amber-400/30 bg-amber-500/5",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
    primaryCta: { label: "Invite your factory to Clewa", href: "/dashboard?action=invite" },
    secondaryCta: { label: "Open due diligence checklist", href: "/dashboard?tab=tools" },
    steps: [
      {
        id: "due_diligence",
        title: "Run the due diligence checklist now",
        body: "Five specific questions, three specific documents, and what the answers should look like versus what should concern you. This is what professional buyers do before every new factory relationship.",
        action: { label: "Open checklist", href: "/dashboard?tab=tools" },
        why: "Most factory problems are predictable from the first meeting. The checklist catches the signals.",
      },
      {
        id: "invite_factory",
        title: "Invite them to Clewa",
        body: "One link, they join free. Once they're on the platform, every communication is documented, every spec change is tracked, and their performance builds into an OTIF score over time.",
        action: { label: "Invite your factory", href: "/dashboard?action=invite" },
        why: "A factory that agrees to work on a structured platform signals professionalism. One that refuses tells you something too.",
      },
      {
        id: "request_audit",
        title: "Request their certifications",
        body: "Through the platform: request WRAP, BSCI, GOTS, or any certification relevant to your market. Documented request, documented response. If they can't provide it, you know before you've committed.",
        action: { label: "Send audit request", href: "/dashboard?tab=tools" },
        why: "Self-reported certifications mean nothing. A formal request creates accountability.",
      },
      {
        id: "structure_payment",
        title: "Structure your next order with milestone gates",
        body: "Deposit on PO issue. Next payment only after sample approved. Final payment only after QC passes. Your money is protected at every stage — the factory can't receive the next payment without meeting the condition.",
        action: { label: "Create a protected order", href: "/orders/create" },
        why: "Milestone gates give you leverage without damaging the relationship. Professional — not adversarial.",
      },
      {
        id: "track_otif",
        title: "Start tracking their OTIF score",
        body: "From the moment their first order closes on Clewa, their on-time/in-full rate starts building. After 5 orders you have real, verified data on whether they deliver what they promise.",
        action: null,
        why: "OTIF replaces gut feel with evidence. After 5 orders you'll know exactly who you're working with.",
      },
    ],
  },
  have_factory: {
    headline: "Invite your factory. Start in 60 seconds.",
    sub: "They join free, get the full platform immediately, and you can have your first structured order running today.",
    icon: Zap,
    color: "border-primary/30 bg-secondary/60",
    iconBg: "bg-secondary",
    iconColor: "text-primary",
    primaryCta: { label: "Invite your factory now", href: "/dashboard?action=invite" },
    secondaryCta: { label: "Create first order", href: "/orders/create" },
    steps: [
      {
        id: "invite",
        title: "Invite your factory",
        body: "One email, they get a branded invite, they create a free account. From that moment they can see your orders, submit samples, upload photos, and request approvals — all documented.",
        action: { label: "Send factory invite", href: "/dashboard?action=invite" },
        why: "Getting them on the platform is the foundation. Every feature works better when both sides are here.",
      },
      {
        id: "document_relationship",
        title: "Document your existing relationship",
        body: "On their factory profile: your typical lead time, your usual payment terms, the QC standard you work to. This seeds the intelligence layer — the safety stock calculator starts using your real numbers.",
        action: { label: "View factory profiles", href: "/directory" },
        why: "The intelligence features use your actual data, not industry averages. The more you document, the smarter they get.",
      },
      {
        id: "first_order",
        title: "Create your first structured order",
        body: "Guided 4-step process. Every field explained. Milestone-gated payments — deposit, sample gate, QC gate. The full production record starts building from the moment the PO is issued.",
        action: { label: "Create your first order", href: "/orders/create" },
        why: "The first order is where the whole platform activates. Production countdown, order health, OTIF tracking — all of it starts here.",
      },
      {
        id: "issue_po",
        title: "Issue the PO and release the first milestone",
        body: "When the order is ready, issue the PO. Your factory receives a notification, reviews, and accepts. Deposit milestone releases on your confirmation. The record is permanent from this point.",
        action: null,
        why: "Issuing the PO is the professional equivalent of a handshake. Both parties are now committed on documented terms.",
      },
      {
        id: "watch_intelligence",
        title: "Watch the intelligence layer activate",
        body: "From the moment production starts: the countdown tracks every gate, order health monitors the status, and when the order closes — your first real lead time data point is recorded.",
        action: null,
        why: "Every completed order makes the platform smarter about your specific factory. By order 5, the recommendations are genuinely accurate.",
      },
    ],
  },
};

// ── Situation picker ──────────────────────────────────────────────────────────
const SITUATIONS = [
  {
    id: "no_factory",
    icon: Search,
    headline: "I don't have a factory yet",
    body: "I'm looking for a manufacturer for my product.",
    color: "border-blue-400/40 hover:border-blue-400 hover:bg-blue-500/5",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-500/10",
  },
  {
    id: "not_sure",
    icon: Shield,
    headline: "I have one but I'm not fully sure I can trust them",
    body: "I'm working with a factory but want more protection and visibility.",
    color: "border-amber-400/40 hover:border-amber-400 hover:bg-amber-500/5",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-500/10",
  },
  {
    id: "have_factory",
    icon: Zap,
    headline: "I have a factory I trust",
    body: "I want to bring them onto the platform and run structured orders.",
    color: "border-primary/40 hover:border-primary hover:bg-secondary/60",
    iconColor: "text-primary",
    iconBg: "bg-secondary",
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────
interface PersonalisedDashboardProps {
  userId: string;
}

export function PersonalisedDashboard({ userId }: PersonalisedDashboardProps) {
  const [stage, setStage] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: profile } = await (supabase as any)
        .from("brand_profiles")
        .select("stage")
        .eq("user_id", userId)
        .single();

      if (profile?.stage) setStage(profile.stage);

      const saved = localStorage.getItem(`clewa_roadmap_${userId}`);
      if (saved) setCompleted(JSON.parse(saved));
      setLoading(false);
    }
    load();
  }, [userId]);

  async function handleSelectSituation(situationId: string) {
    setSaving(true);
    const { error } = await (supabase as any)
      .from("brand_profiles")
      .upsert({ user_id: userId, stage: situationId }, { onConflict: "user_id" });

    if (!error) {
      setStage(situationId);
    }
    setSaving(false);
  }

  function toggleStep(id: string) {
    const next = completed.includes(id)
      ? completed.filter(c => c !== id)
      : [...completed, id];
    setCompleted(next);
    localStorage.setItem(`clewa_roadmap_${userId}`, JSON.stringify(next));
  }

  if (loading) return null;

  // ── No stage set: show situation picker ──────────────────────────────────
  if (!stage) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground mb-1">What's your factory situation right now?</h2>
          <p className="text-sm text-muted-foreground">Your answer shapes everything — your roadmap, your first action, what the platform prioritises for you.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {SITUATIONS.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSituation(s.id)}
                disabled={saving}
                className={cn(
                  "text-left p-4 rounded-xl border-2 transition-all cursor-pointer group",
                  s.color,
                  saving && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", s.iconBg)}>
                  {saving ? (
                    <Loader2 className={cn("h-4 w-4 animate-spin", s.iconColor)} />
                  ) : (
                    <Icon className={cn("h-4 w-4", s.iconColor)} />
                  )}
                </div>
                <p className="text-sm font-semibold text-foreground mb-1 leading-snug">{s.headline}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Stage set but not in our map: don't render ────────────────────────────
  if (!ROADMAPS[stage as keyof typeof ROADMAPS]) return null;

  const roadmap = ROADMAPS[stage as keyof typeof ROADMAPS];
  const Icon = roadmap.icon;
  const doneCount = roadmap.steps.filter(s => completed.includes(s.id)).length;
  const allDone = doneCount === roadmap.steps.length;

  if (allDone) return null;

  // ── Roadmap ───────────────────────────────────────────────────────────────
  return (
    <div className={cn("rounded-2xl border mb-5 overflow-hidden", roadmap.color)}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-background/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", roadmap.iconBg)}>
            <Icon className={cn("h-4 w-4", roadmap.iconColor)} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{roadmap.headline}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {doneCount}/{roadmap.steps.length} steps complete
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex gap-1">
            {roadmap.steps.map(s => (
              <div
                key={s.id}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  completed.includes(s.id) ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Steps */}
      {expanded && (
        <div className="border-t border-border/50">
          <div className="px-5 pt-4 pb-3">
            <p className="text-xs text-muted-foreground leading-relaxed">{roadmap.sub}</p>
          </div>

          <div className="divide-y divide-border/30">
            {roadmap.steps.map((step, i) => {
              const isDone = completed.includes(step.id);
              return (
                <div key={step.id} className={cn("px-5 py-3 transition-colors", isDone && "opacity-60")}>
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {isDone
                        ? <CheckCircle className="h-4 w-4 text-primary" />
                        : <Circle className="h-4 w-4 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
                        <p className={cn("text-sm font-semibold", isDone ? "line-through text-muted-foreground" : "text-foreground")}>
                          {step.title}
                        </p>
                      </div>
                      {!isDone && (
                        <>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{step.body}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {step.action && (
                              <Link
                                to={step.action.href}
                                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                              >
                                {step.action.label} <ArrowRight className="h-3 w-3" />
                              </Link>
                            )}
                            {step.why && (
                              <span className="text-xs text-muted-foreground/70 italic">
                                — {step.why}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTAs */}
          <div className="px-5 py-4 border-t border-border/30 flex flex-wrap gap-2">
            <Button asChild size="sm" className="gap-1.5">
              <Link to={roadmap.primaryCta.href}>
                {roadmap.primaryCta.label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={roadmap.secondaryCta.href}>{roadmap.secondaryCta.label}</Link>
            </Button>
            <button
              type="button"
              onClick={() => handleSelectSituation("")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              Change situation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
