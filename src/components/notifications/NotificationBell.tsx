import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
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

function renderBody(body: string): string {
  try {
    const ctx = JSON.parse(body);
    return Object.values(ctx).filter(Boolean).join(" · ");
  } catch {
    return body;
  }
}

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter(n => !n.read_at).length;

  useEffect(() => {
    if (!user) return;
    load();
    const channel = supabase
      .channel("user-notifications")
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "notifications",
        filter: `user_id=eq.${user.id}`,
      }, payload => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function load() {
    const { data } = await (supabase as any)
      .from("notifications").select("*")
      .order("created_at", { ascending: false }).limit(30);
    setNotifications((data as Notification[]) || []);
  }

  async function markRead(ids: string[]) {
    await (supabase as any).from("notifications")
      .update({ read_at: new Date().toISOString() })
      .in("id", ids).is("read_at", null);
    setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, read_at: new Date().toISOString() } : n));
  }

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="sm" onClick={() => setOpen(o => !o)}
        className="relative p-2 h-9 w-9" aria-label="Notifications">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-medium">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">Notifications</span>
            {unread > 0 && (
              <button onClick={() => markRead(notifications.filter(n => !n.read_at).map(n => n.id))}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet.</p>
              </div>
            ) : notifications.map(n => {
              const isUnread = !n.read_at;
              const inner = (
                <div onClick={() => { if (isUnread) markRead([n.id]); setOpen(false); }}
                  className={cn("flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors cursor-pointer", isUnread && "bg-primary/5")}>
                  <div className={cn("h-2 w-2 rounded-full flex-shrink-0 mt-1.5", isUnread ? "bg-primary" : "bg-transparent")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{renderBody(n.body)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
              return n.order_id
                ? <Link key={n.id} to={`/orders/${n.order_id}`} className="block">{inner}</Link>
                : <div key={n.id}>{inner}</div>;
            })}</div>
          <div className="border-t border-border p-2">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-xs text-primary hover:text-primary/80 py-2 rounded-lg hover:bg-secondary/50 transition-colors font-medium"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
