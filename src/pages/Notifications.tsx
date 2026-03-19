import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday, isYesterday } from "date-fns";
import { Bell, Package, CheckCircle, AlertCircle, MessageSquare, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  order_id: string | null;
  read_at: string | null;
  created_at: string;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  sample_submitted: FileText,
  sample_approved: CheckCircle,
  revision_requested: AlertCircle,
  revision_acknowledged: CheckCircle,
  defect_filed: AlertCircle,
  defect_responded: MessageSquare,
  qc_pass: CheckCircle,
  qc_fail: AlertCircle,
  po_issued: Package,
  po_accepted: CheckCircle,
  message: MessageSquare,
};

function groupByDate(notifications: Notification[]) {
  const groups: Record<string, Notification[]> = {};
  for (const n of notifications) {
    const d = new Date(n.created_at);
    const key = isToday(d) ? "Today" : isYesterday(d) ? "Yesterday" : format(d, "MMMM d, yyyy");
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  }
  return groups;
}

export default function Notifications() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/notifications");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(100);
      setNotifications(data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  const markAllRead = async () => {
    setMarkingAll(true);
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", user!.id)
      .is("read_at", null);
    setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
    setMarkingAll(false);
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  };

  const filtered = filter === "unread" ? notifications.filter(n => !n.read_at) : notifications;
  const unreadCount = notifications.filter(n => !n.read_at).length;
  const grouped = groupByDate(filtered);

  if (authLoading) return null;

  return (
    <Layout>
      <SEO title="Notifications — Sourcery" description="Your notification history." />
      <section className="section-padding">
        <div className="container-wide max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex rounded-lg border border-border overflow-hidden">
                  {(["all", "unread"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium transition-colors",
                        filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                {unreadCount > 0 && (
                  <Button size="sm" variant="outline" onClick={markAllRead} disabled={markingAll}>
                    {markingAll ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Mark all read
                  </Button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
                <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-base font-semibold text-foreground mb-1">
                  {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {filter === "unread" ? "You're all caught up." : "Notifications appear here when orders need your attention."}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(grouped).map(([date, notifs]) => (
                  <div key={date}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">{date}</p>
                    <div className="space-y-2">
                      {notifs.map(n => {
                        const Icon = TYPE_ICONS[n.type] || Bell;
                        const isUnread = !n.read_at;
                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (isUnread) markRead(n.id);
                              if (n.order_id) navigate(`/orders/${n.order_id}`);
                            }}
                            className={cn(
                              "flex items-start gap-4 p-4 rounded-xl border transition-colors",
                              n.order_id ? "cursor-pointer hover:border-primary/40" : "",
                              isUnread ? "bg-primary/3 border-primary/20" : "bg-card border-border"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                              isUnread ? "bg-primary/15" : "bg-secondary"
                            )}>
                              <Icon className={cn("h-4 w-4", isUnread ? "text-primary" : "text-muted-foreground")} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm font-medium mb-0.5", isUnread ? "text-foreground" : "text-foreground/80")}>
                                {n.title}
                              </p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                              <p className="text-xs text-muted-foreground/60 mt-1">
                                {format(new Date(n.created_at), "h:mm a")}
                              </p>
                            </div>
                            {isUnread && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
