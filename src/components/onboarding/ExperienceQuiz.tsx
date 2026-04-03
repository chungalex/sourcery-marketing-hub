import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BrandProfile {
  experience: "first_order" | "some_experience" | "experienced";
  moq_range: "under_200" | "200_1000" | "1000_5000" | "over_5000";
  has_tech_pack: "none" | "basic" | "full";
  factory_situation: "byof" | "sourcing";
  primary_category: string;
}

const questions = [
  {
    id: "experience",
    question: "How many production runs have you placed before?",
    sub: "This helps us set the right level of guidance for you.",
    options: [
      { value: "first_order", label: "This is my first", sub: "I'm new to production" },
      { value: "some_experience", label: "A few (1–10 orders)", sub: "I know the basics" },
      { value: "experienced", label: "Many (10+)", sub: "I know what I'm doing" },
    ],
  },
  {
    id: "moq_range",
    question: "How many units are you typically ordering per style?",
    sub: "This affects payment structure recommendations.",
    options: [
      { value: "under_200", label: "Under 200 units", sub: "Small run or sampling" },
      { value: "200_1000", label: "200–1,000 units", sub: "Growing brand" },
      { value: "1000_5000", label: "1,000–5,000 units", sub: "Established brand" },
      { value: "over_5000", label: "5,000+ units", sub: "Scaling operation" },
    ],
  },
  {
    id: "has_tech_pack",
    question: "Do you have tech packs for your products?",
    sub: "A tech pack is a technical document that tells the factory exactly what to make.",
    options: [
      { value: "none", label: "No — I'll describe it", sub: "We'll guide you through what to include" },
      { value: "basic", label: "Basic sketches or references", sub: "Enough to get started" },
      { value: "full", label: "Full technical specifications", sub: "CAD files, measurement sheets" },
    ],
  },
  {
    id: "factory_situation",
    question: "Do you already have a factory you work with?",
    sub: "This determines whether you're bringing your own or sourcing from the network.",
    options: [
      { value: "byof", label: "Yes — I have a manufacturer", sub: "I'll invite them to Sourcery" },
      { value: "sourcing", label: "No — I'm still sourcing", sub: "I'll find one in the marketplace" },
    ],
  },
  {
    id: "primary_category",
    question: "What are you primarily producing?",
    sub: "This tailors lead time guidance, QC checklists, and factory recommendations.",
    options: [
      { value: "apparel_casual", label: "Casual apparel", sub: "T-shirts, hoodies, basics" },
      { value: "denim", label: "Denim", sub: "Jeans, jackets, skirts" },
      { value: "outerwear", label: "Outerwear & tailoring", sub: "Jackets, coats, blazers" },
      { value: "knitwear", label: "Knitwear", sub: "Knit tops, sweaters, cardigans" },
      { value: "footwear", label: "Footwear", sub: "Shoes, boots, sandals" },
      { value: "accessories", label: "Accessories & bags", sub: "Bags, belts, hats, small leather" },
      { value: "home", label: "Home goods", sub: "Textiles, soft furnishings" },
      { value: "other", label: "Other", sub: "Hard goods, packaging, etc." },
    ],
  },
];

interface ExperienceQuizProps {
  onComplete: (profile: BrandProfile) => void;
  onSkip: () => void;
}

export function ExperienceQuiz({ onComplete, onSkip }: ExperienceQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Partial<BrandProfile>>({});

  const question = questions[currentQ];
  const selected = answers[question.id as keyof BrandProfile];
  const isLast = currentQ === questions.length - 1;

  const select = (value: string) => {
    const updated = { ...answers, [question.id]: value };
    setAnswers(updated);
    if (isLast) {
      onComplete(updated as BrandProfile);
    } else {
      setTimeout(() => setCurrentQ(q => q + 1), 200);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {questions.map((_, i) => (
          <div key={i} className={cn(
            "h-1 flex-1 rounded-full transition-all duration-300",
            i < currentQ ? "bg-primary" : i === currentQ ? "bg-primary/50" : "bg-muted"
          )} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mb-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
              {currentQ + 1} of {questions.length}
            </p>
            <h3 className="text-lg font-semibold text-foreground mb-1">{question.question}</h3>
            <p className="text-sm text-muted-foreground">{question.sub}</p>
          </div>

          <div className="space-y-2">
            {question.options.map((option) => {
              const isSelected = selected === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => select(option.value)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40 hover:bg-secondary/30"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{option.sub}</p>
                    </div>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={currentQ === 0 ? onSkip : () => setCurrentQ(q => q - 1)}
          className="text-muted-foreground"
        >
          {currentQ === 0 ? "Skip for now" : (
            <><ArrowLeft className="h-3.5 w-3.5 mr-1" />Back</>
          )}
        </Button>
        {selected && !isLast && (
          <Button type="button" size="sm" onClick={() => setCurrentQ(q => q + 1)}>
            Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Helper to derive guidance mode from profile
export function getGuidanceMode(userMeta: Record<string, any>): "guided" | "standard" | "power" {
  const exp = userMeta?.experience;
  if (!exp || exp === "first_order") return "guided";
  if (exp === "some_experience") return "standard";
  return "power";
}

// Helper to get lead time range based on category
export function getCategoryLeadTime(category: string): { min: number; max: number; note: string } {
  const map: Record<string, { min: number; max: number; note: string }> = {
    denim: { min: 14, max: 18, note: "Denim typically runs faster than general apparel due to simpler construction." },
    outerwear: { min: 16, max: 22, note: "Outerwear lead times vary significantly with complexity — quilted or technical fabrics add 2–4 weeks." },
    knitwear: { min: 16, max: 24, note: "Knitwear lead times depend heavily on yarn sourcing. Specialty yarns can add 4–6 weeks." },
    footwear: { min: 18, max: 26, note: "Footwear has the longest lead times due to mould production and material sourcing." },
    accessories: { min: 12, max: 18, note: "Accessories and bags generally have shorter lead times than apparel." },
    home: { min: 12, max: 20, note: "Home goods lead times vary widely by material and construction complexity." },
  };
  const base = map[category] || { min: 14, max: 20, note: "Standard apparel lead times from approved tech pack to delivered goods." };
  return base;
}
