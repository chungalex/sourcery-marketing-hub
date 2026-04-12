import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { FileText, MessageSquare, CreditCard, Camera, CheckCircle, AlertTriangle, Package, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: "status_change" | "message" | "milestone" | "photo" | "document" | "approval";
  title: string;
  description?: string;
  actor?: string;
  created_at: string;
}

const EVENT_ICONS: Record<string, any> = {
  status_change: Package,
  message: MessageSquare,
  milestone: CreditCard,
  photo: Camera,
  document: FileText,
  approval: CheckCircle,
  default: AlertTriangle,
};

interface OrderTimelineProps {
  orderId: string;
  orderCreatedAt: string;
  events?: TimelineEvent[];
}

export function OrderTimeline({ orderId, orderCreatedAt, events: propEvents }: OrderTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (propEvents) { setEvents(propEvents); setLoading(false); return; }
    load();
  }, [orderId]);

  async function load() {
    setLoading(true);
    // Fetch messages as timeline events
    const [messagesRes, milestonesRes] = await Promise.all([
      (supabase as any).from("messages").select("id, content, sender_role, created_at").eq("order_id", orderId).order("created_at", { ascending: true }),
      (supabase as any).from("order_milestones").select("id, label, status, sequence_order, created_at").eq("order_id", orderId).order("sequence_order"),
    ]);

    const timelineEvents: TimelineEvent[] = [
      {
        id: "order_created",
        type: "status_change",
        title: "Order created",
        description: "Order saved as draft",
        actor: "brand",
        created_at: orderCreatedAt,
      },
    ];

    // Add messages
    (messagesRes.data || []).forEach((msg: any) => {
      timelineEvents.push({
        id: `msg_${msg.id}`,
        type: "message",
        title: `Message from ${msg.sender_role}`,
        description: msg.content?.slice(0, 80) + (msg.content?.length > 80 ? "..." : ""),
        actor: msg.sender_role,
        created_at: msg.created_at,
      });
    });

    // Add milestone releases
    (milestonesRes.data || []).filter((m: any) => m.status === "released").forEach((m: any) => {
      timelineEvents.push({
        id: `milestone_${m.id}`,
        type: "milestone",
        title: `${m.label} released`,
        actor: "brand",
        created_at: m.created_at,
      });
    });

    // Sort by date
    timelineEvents.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    setEvents(timelineEvents);
    setLoading(false);
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button type="button" onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">
            Order timeline
            {events.length > 0 && <span className="ml-2 text-xs font-normal text-muted-foreground">{events.length} events</span>}
          </p>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No events recorded yet.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {events.map((event, i) => {
                  const Icon = EVENT_ICONS[event.type] || EVENT_ICONS.default;
                  const isLast = i === events.length - 1;
                  return (
                    <div key={event.id} className="flex items-start gap-3 relative">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 border",
                        event.type === "milestone" ? "bg-green-500/10 border-green-500/20" :
                        event.type === "approval" ? "bg-blue-500/10 border-blue-400/30" :
                        event.type === "message" ? "bg-primary/10 border-primary/20" :
                        "bg-secondary border-border"
                      )}>
                        <Icon className={cn("h-3.5 w-3.5",
                          event.type === "milestone" ? "text-green-600" :
                          event.type === "approval" ? "text-blue-600" :
                          event.type === "message" ? "text-primary" :
                          "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {format(new Date(event.created_at), "MMM d, h:mm a")}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{event.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
