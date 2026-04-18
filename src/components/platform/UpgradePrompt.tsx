import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, X } from "lucide-react";

interface UpgradePromptProps {
  open: boolean;
  onClose: () => void;
  reason?: "second_order" | "rfq" | "ai_tools";
}

const REASONS = {
  second_order: {
    title: "Start a second order",
    body: "Your free account includes one active order at a time. Upgrade to Builder to run unlimited orders simultaneously.",
    highlight: "You already have an active order — upgrade to start another.",
  },
  rfq: {
    title: "Send an RFQ",
    body: "The RFQ system — send one brief to multiple factories and compare quotes — is included in Builder.",
    highlight: "Get competing quotes before you commit to any factory.",
  },
  ai_tools: {
    title: "AI production tools",
    body: "The full AI toolkit — quote analyser, RFQ generator, negotiation coach — requires Builder.",
    highlight: "Built on real production data, not generic advice.",
  },
};

export function UpgradePrompt({ open, onClose, reason = "second_order" }: UpgradePromptProps) {
  const r = REASONS[reason];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Builder — $49/month</p>
                  <h2 className="text-lg font-bold text-foreground">{r.title}</h2>
                </div>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{r.body}</p>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 mb-5">
                <p className="text-sm font-medium text-foreground">{r.highlight}</p>
              </div>

              <div className="space-y-2 mb-5">
                {[
                  "Unlimited active orders",
                  "RFQ system — compare quotes from multiple factories",
                  "Full AI toolkit",
                  "Message translation",
                  "Order templates",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1 gap-2">
                  <Link to="/pricing">Upgrade to Builder <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button variant="ghost" onClick={onClose}>Later</Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-3">
                $49/month · Cancel anytime · Your data is always yours
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
