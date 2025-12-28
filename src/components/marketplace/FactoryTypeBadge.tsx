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
  const { label, color } = factoryTypeLabels[type];
  const Icon = typeIcons[type];

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
