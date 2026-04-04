import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const TECH_PACK_CHECKLIST = [
  {
    section: "Technical drawings",
    items: [
      "Front and back flat sketch of the garment",
      "Close-up details of key construction points (pockets, closures, seams)",
      "Callouts for all measurements with arrows to correct points",
    ],
    required: true,
  },
  {
    section: "Measurement chart",
    items: [
      "All critical measurements per size (chest, waist, hip, length, sleeve)",
      "Graded across full size run",
      "Tolerance specified (typically ±1cm for most measurements)",
    ],
    required: true,
  },
  {
    section: "Fabric & materials",
    items: [
      "Fabric composition: e.g. 98% cotton, 2% elastane",
      "Fabric weight: e.g. 12oz or 280gsm",
      "Approved fabric swatch reference or Pantone code",
      "Construction spec: stitch type, seam allowance, SPI (stitches per inch)",
    ],
    required: true,
  },
  {
    section: "Trims & hardware",
    items: [
      "Button/snap/zipper style, size, and colour reference",
      "Label spec: main label, care label, size label positions",
      "Thread colour(s)",
      "Any branded hardware or custom trims",
    ],
    required: false,
  },
  {
    section: "Colourways",
    items: [
      "Each colourway named and referenced (Pantone, approved swatch, or reference image)",
      "Note any trim colour changes per colourway",
    ],
    required: false,
  },
  {
    section: "Care & compliance labels",
    items: [
      "Care instructions: wash temp, dry clean, tumble dry etc.",
      "Fibre content for your target market (required by law in EU/US)",
      "Country of origin format: e.g. 'Made in Vietnam'",
      "RN number for US market if applicable",
    ],
    required: false,
  },
];

interface TechPackGuidanceProps {
  className?: string;
  compact?: boolean;
}

export function TechPackGuidance({ className, compact = false }: TechPackGuidanceProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("rounded-xl border border-border bg-secondary/30", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">What a complete tech pack includes</p>
            {!open && <p className="text-xs text-muted-foreground">Orders without complete tech packs average 2–3 extra revision rounds</p>}
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                A factory needs these to produce your garment accurately. Missing sections are the most common cause of revision rounds and delays.
              </p>
              {TECH_PACK_CHECKLIST.map((section) => (
                <div key={section.section}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-semibold text-foreground">{section.section}</p>
                    {section.required && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-400/30 font-medium">Essential</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Don't have a tech pack yet?{" "}
                  <a href="/resources/tech-pack-guide" className="text-primary hover:underline">
                    Read our complete guide →
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
