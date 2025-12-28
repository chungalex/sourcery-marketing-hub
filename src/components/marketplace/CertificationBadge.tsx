import { CertificationBadge as CertBadgeType } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CertificationBadgeProps {
  certification: CertBadgeType;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
  className?: string;
}

export function CertificationBadge({ 
  certification, 
  size = 'md', 
  showTooltip = true,
  className 
}: CertificationBadgeProps) {
  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1 bg-muted text-muted-foreground rounded font-medium",
        size === 'sm' ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
        className
      )}
    >
      <Shield className={size === 'sm' ? "w-2.5 h-2.5" : "w-3 h-3"} />
      {certification.name}
    </span>
  );

  if (!showTooltip) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{certification.name} Certified</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface CertificationListProps {
  certifications: CertBadgeType[];
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function CertificationList({ 
  certifications, 
  max = 3, 
  size = 'md',
  className 
}: CertificationListProps) {
  const displayed = certifications.slice(0, max);
  const remaining = certifications.length - max;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {displayed.map((cert) => (
        <CertificationBadge key={cert.slug} certification={cert} size={size} />
      ))}
      {remaining > 0 && (
        <span className={cn(
          "inline-flex items-center text-muted-foreground",
          size === 'sm' ? "text-[10px]" : "text-xs"
        )}>
          +{remaining} more
        </span>
      )}
    </div>
  );
}
