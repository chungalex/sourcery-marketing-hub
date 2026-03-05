import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Search, ArrowRight, Star, MapPin, Package,
  Clock, CheckCircle, Loader2, Lightbulb, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface MatchedFactory {
  id: string;
  name: string;
  slug: string;
  matchScore: number;
  location: string;
  categories: string[];
  moq: string;
  leadTime: string;
  reasons: string[];
  highlights: string[];
  is_verified: boolean;
}

const examplePrompts = [
  "Denim jeans manufacturer in Vietnam, 300 MOQ, $15-25/unit",
  "Sustainable organic cotton basics, GOTS certified, low MOQ for new brand",
  "Premium knitwear manufacturer, small batch, quick turnaround",
  "Athletic wear with recycled materials, under $12/unit",
];

interface AIFactoryMatcherProps {
  className?: string;
  onSelectFactory?: (factory: MatchedFactory) => void;
}

export function AIFactoryMatcher({ className, onSelectFactory }: AIFactoryMatcherProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matches, setMatches] = useState<MatchedFactory[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    setError(null);
    setMatches([]);

    const { data, error: fnError } = await supabase.functions.invoke("ai-factory-match", {
      body: { query },
    });

    if (fnError || data?.error) {
      setError(data?.error || "Something went wrong. Try again.");
      console.error("AI match error:", fnError || data);
    } else {
      setMatches(data?.matches || []);
    }

    setIsSearching(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSearch();
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
            <h3 className="font-heading font-semibold text-foreground">AI Factory Matcher</h3>
            <p className="text-sm text-muted-foreground">
              Describe what you need — we'll find the best match in our network
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input */}
        <div className="relative mb-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 'I need a Vietnamese denim manufacturer for 500 units of jeans, target price $18/unit, need quick turnaround'"
            className="w-full h-32 p-4 bg-muted rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
          />
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="absolute bottom-4 right-4"
            size="sm"
          >
            {isSearching ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Matching...</>
            ) : (
              <><Search className="w-4 h-4 mr-2" />Find Factories</>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Tip: Cmd+Enter to search</p>

        {/* Example prompts */}
        {!hasSearched && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Try these examples:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(prompt)}
                  className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  {prompt.slice(0, 45)}...
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h4 className="font-medium text-foreground mb-3">Analyzing your requirements...</h4>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                {["Parsing product requirements", "Scanning verified factory network", "Calculating compatibility scores", "Finding your best matches"].map((step, i) => (
                  <motion.p key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }}>
                    ✓ {step}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && !isSearching && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg text-sm mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {!isSearching && matches.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Best Matches for Your Requirements</h4>
                <Badge variant="secondary">{matches.length} found</Badge>
              </div>

              {matches.map((factory, index) => (
                <motion.div
                  key={factory.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-muted/30 rounded-lg border border-border p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-foreground">{factory.name}</h5>
                        {index === 0 && (
                          <Badge className="bg-primary/10 text-primary text-xs">
                            <Star className="w-3 h-3 mr-1 fill-current" />Best Match
                          </Badge>
                        )}
                        {factory.is_verified && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200">✓ Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />{factory.location}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-primary">{factory.matchScore}%</div>
                      <div className="text-xs text-muted-foreground">match</div>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Package className="w-4 h-4" />MOQ: {factory.moq}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />{factory.leadTime}
                    </div>
                  </div>

                  {factory.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {factory.categories.map((cat) => (
                        <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
                      ))}
                    </div>
                  )}

                  {/* AI reasoning */}
                  <div className="bg-background/50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Why we matched you</span>
                    </div>
                    <ul className="space-y-1">
                      {factory.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {factory.highlights.map((h) => (
                      <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button asChild className="flex-1">
                      <Link to={`/directory/${factory.slug}`}>
                        View Profile <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={() => onSelectFactory?.(factory)}>
                      Request Quote
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results */}
        {!isSearching && hasSearched && !error && matches.length === 0 && (
          <div className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h4 className="font-medium text-foreground mb-1">No matches found</h4>
            <p className="text-sm text-muted-foreground">
              Try broadening your requirements or contact us to find the right factory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
