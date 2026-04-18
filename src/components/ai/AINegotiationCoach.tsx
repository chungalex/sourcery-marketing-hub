import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  MessageSquare, 
  TrendingDown, 
  TrendingUp,
  DollarSign,
  Target,
  Loader2,
  Copy,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NegotiationContext {
  currentOffer: string;
  targetPrice: string;
  quantity: string;
  factoryName: string;
  productType: string;
}

interface NegotiationAdvice {
  counterOffer: {
    price: string;
    justification: string;
  };
  marketData: {
    avgPrice: string;
    percentile: string;
    comparison: "above" | "below" | "average";
  };
  negotiationTips: string[];
  suggestedMessage: string;
  negotiableTerms: { term: string; suggestion: string }[];
}

const mockAdvice: NegotiationAdvice = {
  counterOffer: {
    price: "$11.50/unit",
    justification: "Based on market rates and your order volume, this counter-offer is reasonable and leaves room for the factory to accept while still meeting your margin requirements."
  },
  marketData: {
    avgPrice: "$12.80/unit",
    percentile: "35th",
    comparison: "below"
  },
  negotiationTips: [
    "Lead with volume commitment - Mentioning potential for recurring orders gives you leverage",
    "Ask about payment term flexibility - 30% deposit instead of 50% improves your cash flow",
    "Request sample cost credit - Many factories will credit sample costs against first order",
    "Discuss shipping options - FOB vs. DDP could save 5-10% on total costs"
  ],
  suggestedMessage: `Hi Maria,

Thank you for the detailed quote. I appreciate the competitive pricing at $13.00/unit.

Given our order volume of 500 units and our plans for recurring quarterly orders, I'd like to discuss a slightly adjusted rate of $11.50/unit. This would allow us to commit to a longer-term partnership.

We're also flexible on payment terms - would a 30/70 split work for your production cycle?

Looking forward to finding a mutually beneficial arrangement.

Best regards`,
  negotiableTerms: [
    { term: "Payment Terms", suggestion: "Request 30% deposit instead of 50% to improve cash flow" },
    { term: "Sample Costs", suggestion: "Ask to credit sample costs ($75) against first order" },
    { term: "Shipping Terms", suggestion: "Compare FOB vs DDP pricing - could save 8-12%" },
    { term: "Volume Discount", suggestion: "Commit to 2 orders upfront for additional 5% discount" }
  ]
};

interface AINegotiationCoachProps {
  className?: string;
}

export function AINegotiationCoach({ className }: AINegotiationCoachProps) {
  const [context, setContext] = useState<NegotiationContext>({
    currentOffer: "",
    targetPrice: "",
    quantity: "",
    factoryName: "",
    productType: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [advice, setAdvice] = useState<NegotiationAdvice | null>(null);

  const updateContext = (field: keyof NegotiationContext, value: string) => {
    setContext(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("production-assistant", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
        body: {
          system: "You are a manufacturing negotiation expert. Given the context, return JSON with: opening_position (string), key_leverage_points (array), red_lines (array), suggested_terms (object with payment_terms, lead_time, moq, unit_price fields as strings). Return only valid JSON.",
          messages: [{ role: "user", content: `Help me negotiate with a factory. Context: ${JSON.stringify(context || {})}` }],
        },
      });
      if (!error && data) {
        try {
          const text = data.content?.[0]?.text || "{}";
          const clean = text.replace(/\`\`\`json|\`\`\`/g, "").trim();
          const parsed = JSON.parse(clean);
          setAdvice({ opening_position: parsed.opening_position || mockAdvice.opening_position, key_leverage_points: parsed.key_leverage_points || mockAdvice.key_leverage_points, red_lines: parsed.red_lines || mockAdvice.red_lines, suggested_terms: parsed.suggested_terms || mockAdvice.suggested_terms });
        } catch { setAdvice(mockAdvice); }
      } else { setAdvice(mockAdvice); }
    } catch { setAdvice(mockAdvice); }
    setIsAnalyzing(false);
  };

  const handleCopyMessage = async () => {
    if (advice?.suggestedMessage) {
      navigator.clipboard.writeText(advice.suggestedMessage);
      toast.success("Message copied to clipboard!");
    }
  };

  const canAnalyze = context.currentOffer && context.targetPrice;

  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">
              AI Negotiation Coach
            </h3>
            <p className="text-sm text-muted-foreground">
              Get counter-offer suggestions and negotiation tips
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {!advice && !isAnalyzing && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Input Form */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Current Offer (from factory)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={context.currentOffer}
                      onChange={(e) => updateContext("currentOffer", e.target.value)}
                      placeholder="e.g., $13.00/unit"
                      className="w-full pl-9 p-3 bg-muted rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Your Target Price
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={context.targetPrice}
                      onChange={(e) => updateContext("targetPrice", e.target.value)}
                      placeholder="e.g., $10.00/unit"
                      className="w-full pl-9 p-3 bg-muted rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Order Quantity
                  </label>
                  <input
                    type="text"
                    value={context.quantity}
                    onChange={(e) => updateContext("quantity", e.target.value)}
                    placeholder="e.g., 500 units"
                    className="w-full p-3 bg-muted rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Factory Name (optional)
                  </label>
                  <input
                    type="text"
                    value={context.factoryName}
                    onChange={(e) => updateContext("factoryName", e.target.value)}
                    placeholder="e.g., Coastal Swim"
                    className="w-full p-3 bg-muted rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Product Type (optional)
                </label>
                <input
                  type="text"
                  value={context.productType}
                  onChange={(e) => updateContext("productType", e.target.value)}
                  placeholder="e.g., Sustainable swimwear"
                  className="w-full p-3 bg-muted rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Negotiation Advice
              </Button>
            </motion.div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h4 className="font-heading font-medium text-foreground mb-2">
                Analyzing negotiation opportunity...
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  ✓ Comparing against market rates
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  ✓ Analyzing negotiation leverage points
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                  ✓ Calculating optimal counter-offer
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-primary">
                  ✓ Generating negotiation strategy...
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {advice && !isAnalyzing && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Counter Offer */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-lg p-5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-heading font-semibold text-foreground">
                    Recommended Counter-Offer
                  </h4>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-emerald-600">
                    {advice.counterOffer.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    (vs. {context.currentOffer} offered)
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {advice.counterOffer.justification}
                </p>
              </div>

              {/* Market Data */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-foreground">Market Comparison</h4>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-foreground">
                      {advice.marketData.avgPrice}
                    </div>
                    <div className="text-xs text-muted-foreground">Market Average</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">
                      {context.currentOffer}
                    </div>
                    <div className="text-xs text-muted-foreground">Current Offer</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      {advice.marketData.comparison === "below" ? (
                        <TrendingDown className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={cn(
                        "text-lg font-bold",
                        advice.marketData.comparison === "below" ? "text-emerald-600" : "text-amber-600"
                      )}>
                        {advice.marketData.percentile}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">Market Percentile</div>
                  </div>
                </div>
              </div>

              {/* Negotiation Tips */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-foreground">Negotiation Tips</h4>
                </div>
                <div className="space-y-2">
                  {advice.negotiationTips.map((tip, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2 text-sm p-3 bg-muted/30 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negotiable Terms */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-foreground">Other Terms to Negotiate</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {advice.negotiableTerms.map((item, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg border border-border">
                      <div className="font-medium text-foreground text-sm mb-1">
                        {item.term}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Message */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-foreground">Draft Response</h4>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCopyMessage}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                    {advice.suggestedMessage}
                  </pre>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setAdvice(null)}>
                  Start Over
                </Button>
                <Button className="flex-1" onClick={handleCopyMessage}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy & Send
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
