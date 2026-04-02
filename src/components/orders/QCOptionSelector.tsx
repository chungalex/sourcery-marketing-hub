import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, UserCheck, Building2, Check, Info, ChevronDown,
  ChevronUp, AlertTriangle, ExternalLink, CheckCircle, Eye,
  Camera, Ruler, FileText, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export type QCOption = "sourcery" | "byoqc" | "factory";

// ─── Self-inspection guide ───────────────────────────────────────────────────

const selfInspectionGuide = {
  intro: "A thorough self-inspection takes 45–90 minutes for a typical apparel order. You don't need specialist training — you need the right checklist and enough time to go through it methodically.",
  steps: [
    {
      number: "01",
      title: "Count and verify cartons",
      detail: "Count every carton before opening anything. Verify total count matches your packing list exactly. Note any cartons with visible damage.",
      checkFor: ["Total carton count matches PO", "No crushed or water-damaged cartons", "Correct labelling on outer cartons"],
    },
    {
      number: "02",
      title: "Random sample — pull your inspection units",
      detail: "For AQL 2.5 on 500 units, inspect 80 randomly selected pieces. Don't let anyone pre-select which pieces to show you — pull from different cartons yourself.",
      checkFor: ["Pull from at least 5 different cartons", "Mix of sizes and colorways", "Include pieces from top, middle, and bottom of cartons"],
    },
    {
      number: "03",
      title: "Measurements",
      detail: "Measure every critical point on at least 10 pieces. Compare against your approved spec sheet. A deviation of more than 1cm on any critical measurement is a major defect.",
      checkFor: ["Chest width at armhole", "Body length from HPS", "Sleeve length", "Waist/hip measurements", "Inseam (for trousers)", "All measurements match spec ±1cm"],
    },
    {
      number: "04",
      title: "Construction and stitching",
      detail: "Examine stitching quality across the entire garment — including interior seams, waistbands, and pocket bags. Most factories QC the visible exterior only.",
      checkFor: ["Consistent stitch density throughout", "No skipped stitches or thread breaks", "Seam allowances clean and even", "Bartacks at stress points (pockets, belt loops)", "Topstitching straight and consistent", "No raw/fraying edges inside"],
    },
    {
      number: "05",
      title: "Fabric and colour",
      detail: "Check fabric against your approved bulk fabric swatch. Hold pieces up to natural light to compare colour across the batch — a 1% dye lot variation can be visible on rack.",
      checkFor: ["Fabric weight and hand feel matches swatch", "No shading or colour variation within batch", "No holes, snags, or pulls in fabric", "Print/embroidery placement matches approved position", "Colour fastness — rub firmly with damp white cloth"],
    },
    {
      number: "06",
      title: "Trims and hardware",
      detail: "Check every button, zip, snap, and label against your approved trim card. Pull buttons firmly — if they come off with moderate force, they'll come off in the wash.",
      checkFor: ["All buttons, zips, snaps are correct style and colour", "Buttons secure — pull test each one", "Zip runs smoothly, no snags", "Labels correctly positioned and legible", "Care labels complete and accurate for your market", "Hangtags attached correctly"],
    },
    {
      number: "07",
      title: "Defect classification",
      detail: "Sort your inspected pieces into three piles: Pass, Minor defect (would discount but not reject), Major defect (would reject). Only major defects count toward your AQL threshold.",
      checkFor: ["Count total major defects only", "Compare against your AQL threshold", "Photograph every major defect clearly", "Note defect type and quantity on your report"],
    },
    {
      number: "08",
      title: "Final count and packing list check",
      detail: "Once inspection is complete, verify the total quantity shipped matches your PO. Count by size and colour if relevant. Shorts and overages both need to be documented.",
      checkFor: ["Total quantity matches PO exactly", "Size/colour breakdown matches order", "Packing matches specification (fold, tissue, bags)", "Any extras or shorts documented in writing"],
    },
  ],
};

// ─── Third-party agency profiles ─────────────────────────────────────────────

const agencies = [
  {
    name: "QIMA",
    description: "Strong coverage across Vietnam, China, and Bangladesh. Online booking with 48-hour scheduling. Clear pricing and digital reports.",
    typicalCost: "$200–$350 per inspection day",
    bookingTime: "48–72 hours",
    bestFor: "Apparel, footwear, accessories",
    website: "https://www.qima.com",
    strengths: ["Online booking platform", "Digital reports with photos", "Fast scheduling in Vietnam"],
  },
  {
    name: "Bureau Veritas",
    description: "Global coverage, strong on technical and compliance testing. Good for brands with certification requirements (GOTS, OEKO-TEX).",
    typicalCost: "$250–$450 per inspection day",
    bookingTime: "3–5 business days",
    bestFor: "Technical products, certified materials",
    website: "https://www.bureauveritas.com",
    strengths: ["Compliance testing", "Strong certification track record", "Detailed reporting"],
  },
  {
    name: "SGS",
    description: "Largest global network. Reliable for standard inspections. Good option if you need multi-country coverage.",
    typicalCost: "$250–$400 per inspection day",
    bookingTime: "3–5 business days",
    bestFor: "Standard garment inspection, multi-country",
    website: "https://www.sgs.com",
    strengths: ["Widest global network", "Established reporting format", "Insurance recognised"],
  },
];

// ─── What factory needs to upload ────────────────────────────────────────────

const factoryUploadRequirements = [
  { item: "Overall photos", detail: "Minimum 8 photos of finished goods — full garment front and back, close-ups of construction details, labels, and any custom trims" },
  { item: "Measurement table", detail: "Completed measurement sheet comparing actual measurements against your spec on minimum 3 pieces per size" },
  { item: "Defect count", detail: "Number of units inspected, defects found by type (critical/major/minor), pass/fail against AQL standard" },
  { item: "Packing photos", detail: "Photos of packed cartons, packing list, and outer carton labels" },
];

// ─── Main component ───────────────────────────────────────────────────────────

interface QCOptionSelectorProps {
  value?: QCOption;
  onChange: (option: QCOption) => void;
  disabled?: boolean;
  className?: string;
}

export function QCOptionSelector({ value, onChange, disabled = false, className }: QCOptionSelectorProps) {
  const [expandedGuide, setExpandedGuide] = useState(false);
  const [expandedAgencies, setExpandedAgencies] = useState(false);
  const [expandedFactory, setExpandedFactory] = useState(false);

  return (
    <div className={cn("space-y-5", className)}>

      {/* What is QC context */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">About quality control</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              QC is the gate between production and your final payment. Before you release the last milestone, you need to verify the goods match your spec. Sourcery provides the framework — the gate, the record, and the tools. How the inspection happens is your choice.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-medium text-foreground">Sourcery does not conduct inspections.</span>{" "}
              We ensure the result is documented and the final payment is gated on your approval.{" "}
              <a href="/resources/what-is-aql" className="text-primary hover:underline">Read about AQL standards →</a>
            </p>
          </div>
        </div>
      </div>

      {/* Three options */}
      <div className="space-y-3">

        {/* Option 1 — Self-inspection */}
        <div className={cn(
          "rounded-xl border-2 overflow-hidden transition-all",
          value === "sourcery" ? "border-primary" : "border-border"
        )}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("sourcery")}
            className={cn(
              "w-full text-left p-4 transition-colors",
              value === "sourcery" ? "bg-primary/5" : "bg-card hover:bg-secondary/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
                value === "sourcery" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                <Eye className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-foreground text-sm">Inspect yourself</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 border border-green-500/20 font-medium">No extra cost</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Guided</span>
                </div>
                <p className="text-xs text-muted-foreground">Sourcery walks you through a step-by-step inspection checklist when your goods arrive. No experience required.</p>
              </div>
              {value === "sourcery" && (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>

          {/* Self-inspection guide — always accessible, expands when option selected or manually opened */}
          <div className="border-t border-border">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setExpandedGuide(!expandedGuide); }}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/20"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                View the full inspection guide — 8 steps, 45–90 minutes
              </span>
              {expandedGuide ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            <AnimatePresence>
              {expandedGuide && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-5 bg-background">
                    <p className="text-xs text-muted-foreground leading-relaxed py-3 border-b border-border mb-4">
                      {selfInspectionGuide.intro}
                    </p>
                    <div className="space-y-4">
                      {selfInspectionGuide.steps.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="font-mono text-xs font-bold text-primary/50 flex-shrink-0 mt-0.5 w-6">{step.number}</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground mb-1">{step.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-2">{step.detail}</p>
                            <div className="space-y-1">
                              {step.checkFor.map((check, j) => (
                                <div key={j} className="flex items-start gap-1.5">
                                  <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-xs text-muted-foreground">{check}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-400/30">
                      <p className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        When self-inspection isn't enough
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        For first orders with a new factory, technical products, or orders over $20,000, a third-party inspector is worth the cost. An independent report also carries significantly more weight in any dispute.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Option 2 — Third-party inspector */}
        <div className={cn(
          "rounded-xl border-2 overflow-hidden transition-all",
          value === "byoqc" ? "border-primary" : "border-border"
        )}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("byoqc")}
            className={cn(
              "w-full text-left p-4 transition-colors",
              value === "byoqc" ? "bg-primary/5" : "bg-card hover:bg-secondary/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
                value === "byoqc" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                <UserCheck className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-foreground text-sm">Third-party inspector</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-400/30 font-medium">Strongest protection</span>
                </div>
                <p className="text-xs text-muted-foreground">You book SGS, QIMA, Bureau Veritas, or your own inspector. They attend the factory before goods ship. Best for new factories and higher-value orders.</p>
              </div>
              {value === "byoqc" && (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>

          <div className="border-t border-border">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setExpandedAgencies(!expandedAgencies); }}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/20"
            >
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Recommended agencies — pricing and how to book
              </span>
              {expandedAgencies ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            <AnimatePresence>
              {expandedAgencies && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-5 bg-background">
                    <p className="text-xs text-muted-foreground leading-relaxed py-3 border-b border-border mb-4">
                      All three agencies have Vietnam and China coverage. Typical inspection day covers up to 200–300 units. Book directly — Sourcery is not affiliated with any agency.
                    </p>
                    <div className="space-y-3">
                      {agencies.map((agency, i) => (
                        <div key={i} className="p-4 rounded-xl border border-border bg-card">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="font-semibold text-foreground text-sm">{agency.name}</p>
                              <p className="text-xs text-muted-foreground">{agency.typicalCost} · {agency.bookingTime} to schedule</p>
                            </div>
                            <a
                              href={agency.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Book <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{agency.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {agency.strengths.map((s, j) => (
                              <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{s}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-secondary/50 border border-border">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <span className="font-medium text-foreground">How it works:</span> Book the inspection directly with the agency. Give them your factory address and delivery date. They attend the factory, conduct the inspection against your AQL standard, and send you a digital report — typically within 24 hours. Upload the report here to unlock your final payment milestone.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Option 3 — Factory self-report */}
        <div className={cn(
          "rounded-xl border-2 overflow-hidden transition-all",
          value === "factory" ? "border-primary" : "border-border"
        )}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("factory")}
            className={cn(
              "w-full text-left p-4 transition-colors",
              value === "factory" ? "bg-primary/5" : "bg-card hover:bg-secondary/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
                value === "factory" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                <Camera className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-foreground text-sm">Factory self-report</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-400/30 font-medium">For trusted factories only</span>
                </div>
                <p className="text-xs text-muted-foreground">The factory uploads structured photo evidence and a defect count. You review before approving the final milestone. Suitable for established relationships only.</p>
              </div>
              {value === "factory" && (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>

          <div className="border-t border-border">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setExpandedFactory(!expandedFactory); }}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/20"
            >
              <span className="flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5" />
                What the factory needs to upload
              </span>
              {expandedFactory ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            <AnimatePresence>
              {expandedFactory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-5 bg-background">
                    <p className="text-xs text-muted-foreground leading-relaxed py-3 border-b border-border mb-4">
                      When you select factory self-report, the factory receives specific upload requirements. You review the evidence before the final milestone unlocks.
                    </p>
                    <div className="space-y-3">
                      {factoryUploadRequirements.map((req, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-0.5">{req.item}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{req.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-400/30">
                      <p className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Important
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Factory self-report relies on the factory's own evidence. It provides a documented record but limited dispute protection if the evidence later proves inaccurate. Only use this option with factories you have a proven track record with.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Badge for order summaries
interface QCOptionBadgeProps {
  option: QCOption;
  className?: string;
}

export function QCOptionBadge({ option, className }: QCOptionBadgeProps) {
  const config = {
    sourcery: { label: "Self-inspection", icon: Eye, color: "text-green-700 bg-green-500/10 border-green-500/20" },
    byoqc: { label: "Third-party inspector", icon: UserCheck, color: "text-blue-700 bg-blue-500/10 border-blue-400/30" },
    factory: { label: "Factory self-report", icon: Camera, color: "text-amber-700 bg-amber-500/10 border-amber-400/30" },
  }[option];

  if (!config) return null;
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border", config.color, className)}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
}

export function getQCOptionConfig(option: QCOption) {
  return { sourcery: "Self-inspection", byoqc: "Third-party inspector", factory: "Factory self-report" }[option];
}
