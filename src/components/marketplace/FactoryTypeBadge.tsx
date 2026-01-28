import { FactoryType, factoryTypeLabels } from "@/data/mockData";
import { Factory, Palette, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FactoryTypeBadgeProps {
  type: FactoryType;
  size?: 'sm' | 'md';
  className?: string;
}

const typeIcons = {
  mass_production: Factory,
  boutique: Palette,
  artisan: Sparkles,
};

export function FactoryTypeBadge({ type, size = 'md', className }: FactoryTypeBadgeProps) {
  // Fallback to mass_production if type is unknown/undefined
  const safeType = type && factoryTypeLabels[type] ? type : 'mass_production';
  const { label, color } = factoryTypeLabels[safeType];
  const Icon = typeIcons[safeType];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        color,
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
    >
      <Icon className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} />
      {label}
    </span>
  );
}
