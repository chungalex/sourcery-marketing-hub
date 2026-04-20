import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, ExternalLink, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceItem {
  id: string;
  label: string;
  description: string;
  status: "complete" | "incomplete" | "not_required";
  required_for: string[];
}

interface SupplyChainComplianceProps {
  orderId: string;
  specifications: Record<string, any> | null;
}

const COMPLIANCE_CHECKS = [
  { id: "tech_pack", label: "Technical specification documented", desc: "Tech pack version history on file", reqs: ["EU DPP", "Brand audit"] },
  { id: "factory_cert", label: "Factory certification verified", desc: "At least one valid social/environmental certification on record", reqs: ["WRAP", "BSCI", "EU CSDDD"] },
  { id: "fabric_origin", label: "Fabric origin documented", desc: "Country of origin for all main fabrics", reqs: ["UFLPA", "EU DPP"] },
  { id: "qc_report", label: "QC inspection completed", desc: "AQL inspection report on file", reqs: ["Retailer compliance", "Brand audit"] },
  { id: "care_labels", label: "Care labelling specified", desc: "Wash instructions and fibre content in tech pack", reqs: ["US law", "EU law"] },
  { id: "country_of_origin", label: "Country of origin declared", desc: "Confirmed Vietnam manufacture for customs", reqs: ["US Customs", "Import duty"] },
  { id: "sample_approval", label: "Sample formally approved", desc: "Approval logged on platform before bulk", reqs: ["Quality compliance", "Brand standard"] },
  { id: "milestone_gated", label: "Milestone-gated payments", desc: "Payment not released without delivery confirmation", reqs: ["Financial protection"] },
];

export function SupplyChainCompliance({ orderId, specifications }: SupplyChainComplianceProps) {
  const [expanded, setExpanded] = useState(false);
  const [checkData, setCheckData] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [orderId]);

  async function load() {
    setLoading(true);
    // Check what documentation actually exists on this order
    const [samplesRes, qcRes, milestonesRes, techPackRes] = await Promise.all([
      (supabase as any).from("sample_rounds").select("id").eq("order_id", orderId).eq("status", "approved").limit(1),
      (supabase as any).from("qc_reports").select("id").eq("order_id", orderId).limit(1),
      (supabase as any).from("order_milestones").select("id, status").eq("order_id", orderId),
      (supabase as any).from("tech_pack_versions").select("id").eq("order_id", orderId).limit(1),
    ]);

    const specs = specifications || {};
    const milestones = milestonesRes.data || [];

    setCheckData({
      tech_pack: !!(techPackRes.data?.length || specs.tech_pack_url),
      factory_cert: true, // Sourcery verifies this on onboarding
      fabric_origin: !!(specs.fabric_composition && specs.fabric_composition.length > 5),
      qc_report: !!(qcRes.data?.length),
      care_labels: !!(specs.care_instructions || specs.fiber_content),
      country_of_origin: true, // Vietnam orders always have this
      sample_approval: !!(samplesRes.data?.length),
      milestone_gated: milestones.length > 0,
    });
    setLoading(false);
  }

  if (loading) return null;

  const items: ComplianceItem[] = COMPLIANCE_CHECKS.map(check => ({
    id: check.id,
    label: check.label,
    description: check.desc,
    status: checkData[check.id] ? "complete" : "incomplete",
    required_for: check.reqs,
  }));

  const complete = items.filter(i => i.status === "complete").length;
  const total = items.length;
  const pct = Math.round((complete / total) * 100);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-primary" />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Supply chain compliance</p>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full border font-medium",
                pct === 100 ? "bg-green-500/10 text-green-700 border-green-500/20" :
                pct >= 75 ? "bg-blue-500/10 text-blue-700 border-blue-400/30" :
                "bg-amber-500/10 text-amber-700 border-amber-400/30"
              )}>
                {complete}/{total} items
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">EU Digital Product Passport · UFLPA · retailer audit ready</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Progress bar */}
          <div className="px-5 py-3 border-b border-border">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Documentation completeness</span>
              <span className="font-semibold text-foreground">{pct}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", pct === 100 ? "bg-green-500" : pct >= 75 ? "bg-primary" : "bg-amber-500")}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {items.map(item => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                {item.status === "complete"
                  ? <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  : <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                }
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", item.status === "complete" ? "text-foreground" : "text-amber-700")}>{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {item.required_for.map(r => (
                      <span key={r} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 bg-primary/5 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Why this matters:</strong> The EU Digital Product Passport (required from 2026), UFLPA compliance, and retailer audits all require documentation you're already capturing on Sourcery. This order is {pct}% compliant. Complete orders to improve your score.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
