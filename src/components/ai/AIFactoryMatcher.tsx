import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Star,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  Loader2,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
}

const examplePrompts = [
  "Sustainable swimwear, $10-15/unit, 300 MOQ, recycled materials",
  "Luxury cashmere knitwear, low MOQ for new brand, Europe production",
  "Athletic wear manufacturer with quick turnaround, USA or Mexico",
  "Organic cotton basics, GOTS certified, under $8/unit"
];

const mockMatches: MatchedFactory[] = [
  {
    id: "1",
    name: "Coastal Swim Manufacturing",
    slug: "coastal-swim",
    matchScore: 97,
    location: "Bali, Indonesia",
    categories: ["Swimwear", "Activewear"],
    moq: "200 units",
    leadTime: "4-6 weeks",
    reasons: [
      "Specializes in sustainable swimwear production",
      "Works with ECONYL® recycled nylon - matches your material preference",
      "MOQ of 200 fits your 300 unit requirement"
    ],
    highlights: ["Sustainability Focus", "Flexible MOQ", "Quick Response"]
  },
  {
    id: "2",
    name: "EcoFashion Manufacturing",
    slug: "ecofashion-manufacturing",
    matchScore: 89,
    location: "Ho Chi Minh City, Vietnam",
    categories: ["Swimwear", "Athleisure", "Sustainable Fashion"],
    moq: "300 units",
    leadTime: "5-7 weeks",
    reasons: [
      "Strong experience with recycled polyester",
      "Competitive pricing in your target range",
      "GOTS and OEKO-TEX certified"
    ],
    highlights: ["Certified Factory", "Competitive Pricing", "Experienced Team"]
  },
  {
    id: "3",
    name: "Green Thread Co.",
    slug: "green-thread-co",
    matchScore: 82,
    location: "Porto, Portugal",
    categories: ["Sustainable Fashion", "Swimwear"],
    moq: "250 units",
    leadTime: "6-8 weeks",
    reasons: [
      "European production with lower carbon footprint",
      "Premium quality focus",
      "Strong sustainability practices"
    ],
    highlights: ["European Made", "Premium Quality", "Eco-Certified"]
  }
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

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate AI matching delay
    setTimeout(() => {
      setMatches(mockMatches);
      setIsSearching(false);
    }, 2500);
  };

  const handleExampleClick = (prompt: string) => {
    setQuery(prompt);
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
              AI Factory Matcher
            </h3>
            <p className="text-sm text-muted-foreground">
              Describe what you're looking for in natural language
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-6">
        <div className="relative mb-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your ideal factory... e.g., 'I need a sustainable swimwear manufacturer with low MOQ, preferably in Asia, $10-15 per unit range'"
            className="w-full h-32 p-4 bg-muted rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
          />
          <Button 
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="absolute bottom-4 right-4"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding matches...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find Factories
              </>
            )}
          </Button>
        </div>

        {/* Example Prompts */}
        {!hasSearched && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Try these examples:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(prompt)}
                  className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  {prompt.slice(0, 40)}...
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h4 className="font-heading font-medium text-foreground mb-2">
                Analyzing your requirements...
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  ✓ Parsing product requirements
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  ✓ Matching against 500+ verified factories
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  ✓ Calculating compatibility scores
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="text-primary"
                >
                  Finding your perfect matches...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {!isSearching && matches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-medium text-foreground">
                  Top Matches for Your Requirements
                </h4>
                <Badge variant="secondary">
                  {matches.length} factories found
                </Badge>
              </div>

              {matches.map((factory, index) => (
                <motion.div
                  key={factory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-muted/30 rounded-lg border border-border p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-heading font-semibold text-foreground">
                          {factory.name}
                        </h5>
                        {index === 0 && (
                          <Badge className="bg-primary/10 text-primary">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Best Match
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {factory.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {factory.matchScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">match score</div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Package className="w-4 h-4" />
                      MOQ: {factory.moq}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {factory.leadTime}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {factory.categories.map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  {/* AI Reasoning */}
                  <div className="bg-background/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Why we matched you
                      </span>
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

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {factory.highlights.map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button asChild className="flex-1">
                      <Link to={`/directory/${factory.slug}`}>
                        View Profile
                        <ArrowRight className="w-4 h-4 ml-2" />
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

        {/* Empty State */}
        {!isSearching && hasSearched && matches.length === 0 && (
          <div className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h4 className="font-heading font-medium text-foreground mb-1">
              No matches found
            </h4>
            <p className="text-sm text-muted-foreground">
              Try adjusting your requirements or broadening your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
