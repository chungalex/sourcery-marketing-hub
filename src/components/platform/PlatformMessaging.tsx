import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageSquare, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFactoryMembership } from "@/hooks/useFactoryMembership";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  order_id: string;
  sender_id: string;
  sender_role: "brand" | "factory" | "admin";
  content: string;
  created_at: string;
  read_at: string | null;
}

interface PlatformMessagingProps {
  orderId: string;
  className?: string;
}

export function PlatformMessaging({ orderId, className }: PlatformMessagingProps) {
  const { user } = useAuth();
  const { hasFactoryAccess } = useFactoryMembership(user?.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const senderRole: "brand" | "factory" | "admin" = hasFactoryAccess ? "factory" : "brand";

  // Fetch messages
  useEffect(() => {
    if (!orderId) return;

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages" as never)
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Messages fetch error:", error);
        setError("Could not load messages. Run the messages migration in Supabase first.");
      } else {
        setMessages((data as Message[]) || []);
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to realtime
    const channel = supabase
      .channel(`messages:${orderId}`)
      .on(
        "postgres_changes" as never,
        { event: "INSERT", schema: "public", table: "messages", filter: `order_id=eq.${orderId}` },
        (payload: { new: Message }) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !user || sending) return;
    setSending(true);
    setError(null);

    const { error } = await supabase
      .from("messages" as never)
      .insert({
        order_id: orderId,
        sender_id: user.id,
        sender_role: senderRole,
        content: draft.trim(),
      });

    if (error) {
      console.error("Send error:", error);
      setError("Failed to send message. Please try again.");
    } else {
      setDraft("");
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
  };

  if (loading) {
    return (
      <div className={cn("bg-card border border-border rounded-xl p-6", className)}>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Order Messages</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : ""}`}>
              <div className="h-12 w-64 bg-muted rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Order Messages</h3>
          {messages.length > 0 && (
            <Badge variant="secondary" className="text-xs">{messages.length}</Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          Encrypted & logged
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start the conversation with the {senderRole === "brand" ? "factory" : "brand"}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === user?.id;
              const showDate = i === 0 ||
                new Date(msg.created_at).toDateString() !==
                new Date(messages[i - 1].created_at).toDateString();

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="text-center my-2">
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {format(new Date(msg.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                  >
                    <div className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    )}>
                      {!isOwn && (
                        <div className={cn(
                          "text-xs font-medium mb-1 capitalize",
                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {msg.sender_role}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      <div className={cn(
                        "text-xs mt-1",
                        isOwn ? "text-primary-foreground/60 text-right" : "text-muted-foreground"
                      )}>
                        {format(new Date(msg.created_at), "h:mm a")}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-2 border-t border-border">
        <div className="flex gap-3 items-end">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message... (Cmd+Enter to send)"
            className="resize-none min-h-[80px]"
            rows={3}
          />
          <Button
            onClick={handleSend}
            disabled={!draft.trim() || sending}
            size="icon"
            className="h-10 w-10 shrink-0"
          >
            {sending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Send className="h-4 w-4" />
            }
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Messages are visible to both parties and Sourcery support.
        </p>
      </div>
    </div>
  );
}
