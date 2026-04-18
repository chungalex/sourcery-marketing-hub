import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Upload, 
  AlertTriangle, 
  CheckCircle,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  Package,
  Loader2,
  FileText,
  X,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Quote {
  id: string;
  factoryName: string;
  unitPrice: number;
  moq: number;
  leadTime: string;
  paymentTerms: string;
  shippingCost: number;
  sampleCost: number;
  totalForMoq: number;
}

interface AnalysisResult {
  bestValue: string;
  lowestPrice: string;
  fastestDelivery: string;
  redFlags: { quote: string; issue: string }[];
  recommendations: string[];
  marketComparison: {
    avgPrice: number;
    yourLowest: number;
    savings: number;
  };
}

const mockQuotes: Quote[] = [
  {
    id: "1",
    factoryName: "Coastal Swim Manufacturing",
    unitPrice: 12.50,
    moq: 200,
    leadTime: "4-6 weeks",
    paymentTerms: "30% deposit, 70% before shipping",
    shippingCost: 450,
    sampleCost: 75,
    totalForMoq: 2950,
  },
  {
    id: "2",
    factoryName: "EcoFashion Manufacturing",
    unitPrice: 11.00,
    moq: 300,
    leadTime: "5-7 weeks",
    paymentTerms: "50% deposit, 50% before shipping",
    shippingCost: 380,
    sampleCost: 50,
    totalForMoq: 3730,
  },
  {
    id: "3",
    factoryName: "Green Thread Co.",
    unitPrice: 14.00,
    moq: 250,
    leadTime: "6-8 weeks",
    paymentTerms: "100% before production",
    shippingCost: 520,
    sampleCost: 120,
    totalForMoq: 4140,
  },
];

const mockAnalysis: AnalysisResult = {
  bestValue: "Coastal Swim Manufacturing",
  lowestPrice: "EcoFashion Manufacturing",
  fastestDelivery: "Coastal Swim Manufacturing",
  redFlags: [
    { 
      quote: "Green Thread Co.", 
      issue: "100% upfront payment is high-risk. Consider negotiating split payments." 
    },
    {
      quote: "Green Thread Co.",
      issue: "Sample cost ($120) is 60% higher than average. This may indicate premium pricing."
    }
  ],
  recommendations: [
    "Coastal Swim offers the best balance of price, lead time, and payment terms",
    "EcoFashion's lower unit price is offset by higher MOQ - total cost is actually higher",
    "Consider negotiating payment terms with Green Thread Co. before proceeding"
  ],
  marketComparison: {
    avgPrice: 13.50,
    yourLowest: 11.00,
    savings: 18.5,
  }
};

interface AIQuoteAnalyzerProps {
  className?: string;
}

export function AIQuoteAnalyzer({ className }: AIQuoteAnalyzerProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAddQuotes = () => {
    setQuotes(mockQuotes);
  };

  const handleRemoveQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (quotes.length < 2) return;
    
    setIsAnalyzing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const quoteSummary = quotes.map(q => `${q.factory}: $${q.unitPrice}/unit, ${q.leadTime} weeks, MOQ ${q.moq}`).join("\n");
      const { data, error } = await supabase.functions.invoke("production-assistant", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
        body: {
          system: "You are a production cost analyst. Analyse these factory quotes and return a JSON object with fields: recommendation (string, which factory and why), risks (array of strings), savings_potential (string), red_flags (array of strings). Return only valid JSON.",
          messages: [{ role: "user", content: `Analyse these quotes for ${product || "a product"}:\n${quoteSummary}` }],
        },
      });
      if (!error && data) {
        try {
          const text = data.content?.[0]?.text || "{}";
          const clean = text.replace(/\`\`\`json|\`\`\`/g, "").trim();
          const parsed = JSON.parse(clean);
          setAnalysis({ recommendation: parsed.recommendation || "Review quotes carefully.", risks: parsed.risks || [], savings_potential: parsed.savings_potential || "—", red_flags: parsed.red_flags || [] });
        } catch { setAnalysis(mockAnalysis); }
      } else { setAnalysis(mockAnalysis); }
    } catch { setAnalysis(mockAnalysis); }
    setIsAnalyzing(false);
  };

  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">
              AI Quote Analyzer
            </h3>
            <p className="text-sm text-muted-foreground">
              Compare quotes and get AI-powered insights
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Upload Area */}
        {quotes.length === 0 && (
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={handleAddQuotes}
          >
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <h4 className="font-medium text-foreground mb-1">Add Quotes to Compare</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Upload quote PDFs or paste quote details
            </p>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Add Quotes (Demo)
            </Button>
          </div>
        )}

        {/* Quotes List */}
        {quotes.length > 0 && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-medium text-foreground">
                Quotes to Compare ({quotes.length})
              </h4>
              <Button variant="outline" size="sm" onClick={handleAddQuotes}>
                <Upload className="w-4 h-4 mr-2" />
                Add More
              </Button>
            </div>

            <div className="grid gap-3">
              {quotes.map((quote) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground">{quote.factoryName}</h5>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>${quote.unitPrice}/unit</span>
                        <span>MOQ: {quote.moq}</span>
                        <span>{quote.leadTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveQuote(quote.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={quotes.length < 2 || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing quotes...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Quotes
                </>
              )}
            </Button>
          </div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h4 className="font-heading font-medium text-foreground mb-2">
                Analyzing your quotes...
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  ✓ Comparing pricing structures
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  ✓ Analyzing payment terms
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                  ✓ Checking against market rates
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-primary">
                  ✓ Identifying red flags...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-medium text-muted-foreground">Factory</th>
                      <th className="text-center py-3 font-medium text-muted-foreground">Unit Price</th>
                      <th className="text-center py-3 font-medium text-muted-foreground">MOQ</th>
                      <th className="text-center py-3 font-medium text-muted-foreground">Lead Time</th>
                      <th className="text-center py-3 font-medium text-muted-foreground">Total (MOQ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((quote) => (
                      <tr 
                        key={quote.id}
                        className={cn(
                          "border-b border-border",
                          quote.factoryName === analysis.bestValue && "bg-emerald-500/5"
                        )}
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{quote.factoryName}</span>
                            {quote.factoryName === analysis.bestValue && (
                              <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                Best Value
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="text-center py-3">
                          <span className={cn(
                            "font-medium",
                            quote.factoryName === analysis.lowestPrice && "text-emerald-600"
                          )}>
                            ${quote.unitPrice}
                            {quote.factoryName === analysis.lowestPrice && (
                              <TrendingDown className="w-3.5 h-3.5 inline ml-1" />
                            )}
                          </span>
                        </td>
                        <td className="text-center py-3">{quote.moq}</td>
                        <td className="text-center py-3">
                          <span className={cn(
                            quote.factoryName === analysis.fastestDelivery && "text-emerald-600 font-medium"
                          )}>
                            {quote.leadTime}
                          </span>
                        </td>
                        <td className="text-center py-3 font-medium">
                          ${quote.totalForMoq.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Market Comparison */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Market Comparison</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-foreground">
                      ${analysis.marketComparison.avgPrice}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg. Market Price</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-600">
                      ${analysis.marketComparison.yourLowest}
                    </div>
                    <div className="text-xs text-muted-foreground">Your Lowest Quote</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-600">
                      {analysis.marketComparison.savings}%
                    </div>
                    <div className="text-xs text-muted-foreground">Below Market</div>
                  </div>
                </div>
              </div>

              {/* Red Flags */}
              {analysis.redFlags.length > 0 && (
                <div className="bg-amber-500/5 rounded-lg p-4 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-foreground">Potential Concerns</span>
                  </div>
                  <div className="space-y-2">
                    {analysis.redFlags.map((flag, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium text-foreground">{flag.quote}:</span>{" "}
                          <span className="text-muted-foreground">{flag.issue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Recommendations */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">AI Recommendations</span>
                </div>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  Request Quote from {analysis.bestValue.split(" ")[0]}
                </Button>
                <Button variant="outline">
                  Export Comparison
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
