import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function VerifiedBadge({ size = 'md', showLabel = true, className }: VerifiedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400",
        size === 'sm' ? "text-xs" : "text-sm",
        className
      )}
    >
      <BadgeCheck className={cn(
        "flex-shrink-0",
        size === 'sm' ? "w-3.5 h-3.5" : "w-4 h-4"
      )} />
      {showLabel && <span className="font-medium">Verified</span>}
    </span>
  );
}
