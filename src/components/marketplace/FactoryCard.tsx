import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Package, Clock, Heart, Handshake } from "lucide-react";
import { FactoryPreview } from "@/data/mockData";
import { FactoryTypeBadge } from "./FactoryTypeBadge";
import { VerifiedBadge } from "./VerifiedBadge";
import { CertificationList } from "./CertificationBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FactoryCardProps {
  factory: FactoryPreview;
  index?: number;
  className?: string;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export function FactoryCard({ 
  factory, 
  index = 0, 
  className,
  onSave,
  isSaved = false,
}: FactoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group bg-card rounded-xl border border-border overflow-hidden hover:shadow-card-lg transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={factory.coverImageUrl}
          alt={factory.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <FactoryTypeBadge type={factory.type} size="sm" />
          {factory.isVerified && (
            <span className="inline-flex items-center gap-1 bg-emerald-500/90 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              Verified
            </span>
          )}
          <span className="inline-flex items-center gap-1 bg-primary/90 text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
            <Handshake className="w-3 h-3" />
            Pre-Negotiated
          </span>
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onSave?.(factory.id);
          }}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-all",
            isSaved 
              ? "bg-primary text-primary-foreground" 
              : "bg-white/90 text-muted-foreground hover:bg-white hover:text-primary"
          )}
        >
          <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-heading font-semibold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
            {factory.name}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{factory.location.city}, {factory.location.country}</span>
          </div>
        </div>

        {/* Categories */}
        <p className="text-sm text-muted-foreground line-clamp-1">
          {factory.categories.join(' • ')}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Package className="w-3.5 h-3.5" />
            <span>MOQ: {factory.moqMin.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{factory.leadTimeWeeks} weeks</span>
          </div>
        </div>

        {/* Certifications */}
        <CertificationList certifications={factory.certifications} max={3} size="sm" />

        {/* CTA */}
        <Link to={`/directory/${factory.slug}`} className="block pt-2">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
