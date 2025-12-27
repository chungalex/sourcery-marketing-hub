import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Sourcery transformed our supply chain. We went from struggling to find reliable factories to having a vetted network at our fingertips. Production time cut by 40%.",
    author: "Sarah Chen",
    role: "Head of Operations",
    company: "Modern Apparel Co.",
  },
  {
    quote: "The QC process alone is worth it. Catching defects before shipping has saved us thousands in returns and protected our brand reputation.",
    author: "Marcus Williams",
    role: "Founder",
    company: "Urban Essentials",
  },
  {
    quote: "Finally, a sourcing partner that understands what modern brands need. The production tracking dashboard keeps my entire team aligned.",
    author: "Emma Rodriguez",
    role: "Supply Chain Director",
    company: "Heritage Goods",
  },
];

interface TestimonialsProps {
  className?: string;
  limit?: number;
}

export function Testimonials({ className = "", limit }: TestimonialsProps) {
  const displayedTestimonials = limit ? testimonials.slice(0, limit) : testimonials;

  return (
    <div className={className}>
      <div className="grid md:grid-cols-3 gap-6">
        {displayedTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative p-6 rounded-xl bg-card border border-border group hover:shadow-card-lg transition-shadow"
          >
            <Quote className="w-8 h-8 text-primary/20 mb-4" />
            <p className="text-muted-foreground leading-relaxed mb-6">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-heading font-semibold text-primary">
                  {testimonial.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
