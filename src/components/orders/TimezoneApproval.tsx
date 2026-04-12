import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Moon, Sun } from "lucide-react";
import { format, differenceInHours, differenceInMinutes } from "date-fns";
import { cn } from "@/lib/utils";

interface TimezoneApprovalProps {
  orderId: string;
  factoryTimezone?: string; // e.g. "Asia/Ho_Chi_Minh"
  brandTimezone?: string;   // e.g. "America/New_York"
  isFactory?: boolean;
  deliveryDate?: string;
}

function getLocalTime(timezone: string) {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function isBusinessHours(timezone: string) {
  const hour = parseInt(new Date().toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  }));
  return hour >= 8 && hour < 18;
}

function getTimezoneLabel(tz: string) {
  const labels: Record<string, string> = {
    "Asia/Ho_Chi_Minh": "Vietnam (ICT)",
    "Asia/Shanghai": "China (CST)",
    "Asia/Dhaka": "Bangladesh (BST)",
    "America/New_York": "US East (EST)",
    "America/Los_Angeles": "US West (PST)",
    "Europe/London": "London (GMT)",
    "Europe/Paris": "Europe (CET)",
    "Australia/Sydney": "Sydney (AEDT)",
  };
  return labels[tz] || tz;
}

export function TimezoneApproval({
  orderId,
  factoryTimezone = "Asia/Ho_Chi_Minh",
  brandTimezone = "America/New_York",
  isFactory = false,
  deliveryDate,
}: TimezoneApprovalProps) {
  const [expanded, setExpanded] = useState(false);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { load(); }, [orderId]);

  async function load() {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("approval_requests")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    setApprovals(data || []);
    setLoading(false);
  }

  const handleApprove = async (approvalId: string) => {
    await (supabase as any).from("approval_requests").update({
      status: "approved",
      responded_at: new Date().toISOString(),
    }).eq("id", approvalId);
    toast.success("Approved");
    load();
  };

  const handleRequest = async (subject: string) => {
    await (supabase as any).from("approval_requests").insert({
      order_id: orderId,
      subject,
      requested_by_role: isFactory ? "factory" : "brand",
      status: "pending",
      brand_timezone: brandTimezone,
      factory_timezone: factoryTimezone,
    });
    toast.success("Approval request sent");
    load();
  };

  const recipientTz = isFactory ? brandTimezone : factoryTimezone;
  const recipientLocal = getLocalTime(recipientTz);
  const recipientBusiness = isBusinessHours(recipientTz);
  const myLocal = getLocalTime(isFactory ? factoryTimezone : brandTimezone);

  const pendingApprovals = approvals.filter(a => a.status === "pending" && a.requested_by_role !== (isFactory ? "factory" : "brand"));

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button type="button" onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-primary" />
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              Timezone & approvals
              {pendingApprovals.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-400/30 font-medium">
                  {pendingApprovals.length} awaiting your response
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isFactory ? "Brand" : "Factory"} is currently {recipientBusiness ? "in business hours" : "outside business hours"} — {recipientLocal}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Timezone comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className={cn("p-3 rounded-xl border", isBusinessHours(isFactory ? factoryTimezone : brandTimezone)
              ? "bg-green-500/5 border-green-500/20" : "bg-secondary/50 border-border")}>
              <div className="flex items-center gap-1.5 mb-1">
                {isBusinessHours(isFactory ? factoryTimezone : brandTimezone)
                  ? <Sun className="h-3.5 w-3.5 text-amber-500" />
                  : <Moon className="h-3.5 w-3.5 text-muted-foreground" />}
                <p className="text-xs font-semibold text-foreground">You</p>
              </div>
              <p className="text-lg font-bold text-foreground">{myLocal}</p>
              <p className="text-xs text-muted-foreground">{getTimezoneLabel(isFactory ? factoryTimezone : brandTimezone)}</p>
            </div>
            <div className={cn("p-3 rounded-xl border", recipientBusiness
              ? "bg-green-500/5 border-green-500/20" : "bg-secondary/50 border-border")}>
              <div className="flex items-center gap-1.5 mb-1">
                {recipientBusiness
                  ? <Sun className="h-3.5 w-3.5 text-amber-500" />
                  : <Moon className="h-3.5 w-3.5 text-muted-foreground" />}
                <p className="text-xs font-semibold text-foreground">{isFactory ? "Brand" : "Factory"}</p>
              </div>
              <p className="text-lg font-bold text-foreground">{recipientLocal}</p>
              <p className="text-xs text-muted-foreground">{getTimezoneLabel(recipientTz)}</p>
              {!recipientBusiness && (
                <p className="text-xs text-amber-600 mt-1">Outside business hours — expect a delay</p>
              )}
            </div>
          </div>

          {/* Pending approvals */}
          {pendingApprovals.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground">Awaiting your approval</p>
              {pendingApprovals.map(a => {
                const waitingHours = differenceInHours(now, new Date(a.created_at));
                const waitingMins = differenceInMinutes(now, new Date(a.created_at)) % 60;
                return (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-amber-400/30 bg-amber-500/5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Waiting {waitingHours > 0 ? `${waitingHours}h ${waitingMins}m` : `${waitingMins}m`}
                        {waitingHours >= 24 && <span className="text-rose-600 ml-1">— urgent</span>}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => handleApprove(a.id)} className="gap-1.5 flex-shrink-0">
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Request approval */}
          {isFactory && (
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-semibold text-foreground">Request brand approval</p>
              <div className="flex flex-col gap-1.5">
                {[
                  "Fabric swatch approval",
                  "Sample approval",
                  "Bulk cut approval",
                  "Packing approval",
                ].map(subject => (
                  <button key={subject} type="button" onClick={() => handleRequest(subject)}
                    className="text-left text-xs px-3 py-2 rounded-lg border border-border bg-secondary/30 hover:border-primary/40 transition-colors text-foreground">
                    + {subject}
                  </button>
                ))}
              </div>
              {!recipientBusiness && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-400/30">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    It's currently {recipientLocal} for the brand. Expect a response within their business hours (9am–6pm {getTimezoneLabel(brandTimezone)}).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* All past approvals */}
          {approvals.filter(a => a.status !== "pending").length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">History</p>
              {approvals.filter(a => a.status !== "pending").map(a => (
                <div key={a.id} className="flex items-center justify-between text-xs py-1">
                  <span className="text-muted-foreground">{a.subject}</span>
                  <span className={cn("font-medium", a.status === "approved" ? "text-green-600" : "text-rose-600")}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
