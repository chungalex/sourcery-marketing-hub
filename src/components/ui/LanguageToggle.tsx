import { type Language } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

const labels: Record<Language, string> = {
  en: "EN",
  vi: "VI",
  zh: "中文",
};

interface LanguageToggleProps {
  lang: Language;
  onChange: (lang: Language) => void;
  className?: string;
}

export function LanguageToggle({ lang, onChange, className }: LanguageToggleProps) {
  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-lg bg-secondary border border-border", className)}>
      {(["en", "vi", "zh"] as Language[]).map(l => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
            lang === l
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
