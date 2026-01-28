import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TestimonialsProps {
  className?: string;
  limit?: number;
}

export function Testimonials({ className = "" }: TestimonialsProps) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center p-8 rounded-xl bg-card border border-border"
      >
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          Coming Soon
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
          We're currently onboarding our first cohort of brands. Check back soon to see what they're saying about Sourcery.
        </p>
      </motion.div>
    </div>
  );
}
