import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  Check, 
  Sparkles,
  Building2,
  MessageSquare,
  FileText,
  Shield
} from "lucide-react";

interface PricingGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
  returnUrl?: string;
}

const features = [
  {
    icon: Building2,
    title: "Unlimited Factory Access",
    description: "View complete profiles and certifications"
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Contact factories directly through our platform"
  },
  {
    icon: FileText,
    title: "Sample Requests",
    description: "Request and manage product samples"
  },
  {
    icon: Shield,
    title: "Verified Partners",
    description: "Work only with vetted manufacturers"
  }
];

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    highlight: false
  },
  {
    name: "Growth",
    price: "$149",
    period: "/month",
    highlight: true,
    badge: "Most Popular"
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "/month",
    highlight: false
  }
];

export function PricingGateModal({ 
  open, 
  onOpenChange, 
  feature = "this feature",
  returnUrl 
}: PricingGateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="text-center pb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
          >
            <Lock className="h-7 w-7 text-primary" />
          </motion.div>
          <DialogTitle className="text-xl">
            Upgrade to Access {feature}
          </DialogTitle>
          <DialogDescription>
            Join thousands of brands connecting with verified manufacturers
          </DialogDescription>
        </DialogHeader>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <feat.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {feat.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {feat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing Options */}
        <div className="space-y-3 mb-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link
                to={`/checkout?plan=${plan.name.toLowerCase()}`}
                className={`block p-4 rounded-lg border-2 transition-all ${
                  plan.highlight
                    ? "border-primary bg-primary/5 hover:bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      plan.highlight ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {plan.highlight && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        {plan.name}
                      </span>
                      {plan.badge && (
                        <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link to="/checkout?plan=growth">
            <Button className="w-full" size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started with Growth
            </Button>
          </Link>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              7-day free trial
            </span>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-border mt-4">
          <Link 
            to="/pricing" 
            className="text-sm text-primary hover:underline"
          >
            Compare all plans →
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
