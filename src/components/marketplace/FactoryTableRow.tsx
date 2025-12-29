import { Link } from "react-router-dom";
import { MapPin, Package, Clock, Heart, ExternalLink } from "lucide-react";
import { FactoryPreview } from "@/data/mockData";
import { FactoryTypeBadge } from "./FactoryTypeBadge";
import { CertificationList } from "./CertificationBadge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface FactoryTableRowProps {
  factory: FactoryPreview;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export function FactoryTableRow({ 
  factory, 
  onSave,
  isSaved = false,
}: FactoryTableRowProps) {
  return (
    <TableRow className="group hover:bg-muted/50">
      {/* Factory Name & Image */}
      <TableCell>
        <div className="flex items-center gap-3">
          <img
            src={factory.coverImageUrl}
            alt={factory.name}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <Link 
              to={`/directory/${factory.slug}`}
              className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {factory.name}
            </Link>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{factory.location.city}, {factory.location.country}</span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Type */}
      <TableCell>
        <FactoryTypeBadge type={factory.type} size="sm" />
      </TableCell>

      {/* Categories */}
      <TableCell className="max-w-[200px]">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {factory.categories.join(', ')}
        </p>
      </TableCell>

      {/* MOQ */}
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <Package className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{factory.moqMin.toLocaleString()}</span>
        </div>
      </TableCell>

      {/* Lead Time */}
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{factory.leadTimeWeeks}w</span>
        </div>
      </TableCell>

      {/* Certifications */}
      <TableCell>
        <CertificationList certifications={factory.certifications} max={2} size="sm" />
      </TableCell>

      {/* Verified */}
      <TableCell>
        {factory.isVerified && (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Verified
          </span>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onSave?.(factory.id);
            }}
            className={cn(
              "p-1.5 rounded-full transition-all",
              isSaved 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-primary hover:bg-muted"
            )}
          >
            <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
          </button>
          <Link to={`/directory/${factory.slug}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              View
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
