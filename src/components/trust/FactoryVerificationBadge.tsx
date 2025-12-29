import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  ShieldCheck, 
  CheckCircle, 
  Clock,
  FileText,
  Video,
  MapPin,
  Star,
  HelpCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type VerificationTier = "basic" | "professional" | "premium";

interface VerificationData {
  tier: VerificationTier;
  verifiedDate?: string;
  trustScore: number;
  responseTime: string;
  completionRate: number;
  reviewCount: number;
  avgRating: number;
  verifications: {
    label: string;
    verified: boolean;
    date?: string;
  }[];
}

const tierConfig = {
  basic: {
    label: "Verified",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Shield,
    description: "Email and business registration verified"
  },
  professional: {
    label: "Pro Verified",
    color: "bg-primary/10 text-primary border-primary/20",
    icon: ShieldCheck,
    description: "Documents and certifications verified"
  },
  premium: {
    label: "Premium Partner",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: ShieldCheck,
    description: "On-site audited and fully verified"
  }
};

interface FactoryVerificationBadgeProps {
  data?: VerificationData;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  className?: string;
}

const mockData: VerificationData = {
  tier: "professional",
  verifiedDate: "January 2024",
  trustScore: 94,
  responseTime: "< 4 hours",
  completionRate: 98,
  reviewCount: 47,
  avgRating: 4.8,
  verifications: [
    { label: "Email Verified", verified: true, date: "Dec 2023" },
    { label: "Business Registration", verified: true, date: "Dec 2023" },
    { label: "Certifications Verified", verified: true, date: "Jan 2024" },
    { label: "Factory Photos Verified", verified: true, date: "Jan 2024" },
    { label: "Virtual Tour Completed", verified: true, date: "Jan 2024" },
    { label: "On-Site Audit", verified: false }
  ]
};

export function FactoryVerificationBadge({ 
  data = mockData,
  size = "md",
  showDetails = true,
  className 
}: FactoryVerificationBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = tierConfig[data.tier];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <>
      <Badge
        variant="outline"
        className={cn(
          "cursor-pointer transition-all hover:shadow-sm",
          config.color,
          sizeClasses[size],
          className
        )}
        onClick={() => showDetails && setIsOpen(true)}
      >
        <Icon className={cn(iconSizes[size], "mr-1")} />
        {config.label}
        {showDetails && (
          <HelpCircle className={cn(iconSizes[size], "ml-1 opacity-50")} />
        )}
      </Badge>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-primary" />
              Verification Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Verification Tier */}
            <div className="text-center py-4 bg-muted/30 rounded-lg">
              <Badge className={cn("text-base px-4 py-2 mb-2", config.color)}>
                <Icon className="w-5 h-5 mr-2" />
                {config.label}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                {config.description}
              </p>
              {data.verifiedDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Verified since {data.verifiedDate}
                </p>
              )}
            </div>

            {/* Trust Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Trust Score</span>
                <span className="text-2xl font-bold text-primary">{data.trustScore}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.trustScore}%` }}
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-sm font-semibold text-foreground">{data.responseTime}</div>
                <div className="text-xs text-muted-foreground">Response</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <CheckCircle className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-sm font-semibold text-foreground">{data.completionRate}%</div>
                <div className="text-xs text-muted-foreground">Completion</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Star className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-sm font-semibold text-foreground">{data.avgRating}</div>
                <div className="text-xs text-muted-foreground">{data.reviewCount} reviews</div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Verification Checklist</h4>
              <div className="space-y-2">
                {data.verifications.map((item, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg",
                      item.verified ? "bg-emerald-500/5" : "bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.verified ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className={cn(
                        "text-sm",
                        item.verified ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {item.label}
                      </span>
                    </div>
                    {item.date && (
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* How We Verify */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">How We Verify</h4>
              <p className="text-xs text-muted-foreground">
                Our verification process includes document review, certification validation, 
                and for Premium partners, on-site audits by third-party inspectors. 
                All verifications are renewed annually.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Compact version for use in cards/lists
export function FactoryTrustScore({ 
  score = 94,
  className 
}: { 
  score?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5 text-primary" />
        <span className="font-medium text-foreground">{score}</span>
        <span>Trust Score</span>
      </div>
    </div>
  );
}
