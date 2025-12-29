import { Grid3X3, List, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = 'grid' | 'table' | 'map';

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

const views: { mode: ViewMode; icon: typeof Grid3X3; label: string }[] = [
  { mode: 'grid', icon: Grid3X3, label: 'Grid' },
  { mode: 'table', icon: List, label: 'Table' },
  { mode: 'map', icon: Map, label: 'Map' },
];

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("inline-flex rounded-lg border border-border p-1 bg-muted/30", className)}>
      {views.map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          variant="ghost"
          size="sm"
          onClick={() => onChange(mode)}
          className={cn(
            "h-8 px-3 gap-1.5 rounded-md transition-all",
            value === mode 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-transparent"
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">{label}</span>
        </Button>
      ))}
    </div>
  );
}
