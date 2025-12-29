import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FactoryPreview } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecentlyViewedProps {
  factoryIds: string[];
  allFactories: FactoryPreview[];
  onClear: () => void;
  className?: string;
}

export function RecentlyViewed({ factoryIds, allFactories, onClear, className }: RecentlyViewedProps) {
  const recentFactories = useMemo(() => {
    return factoryIds
      .map(id => allFactories.find(f => f.id === id))
      .filter((f): f is FactoryPreview => f !== undefined)
      .slice(0, 5);
  }, [factoryIds, allFactories]);

  if (recentFactories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card rounded-xl border border-border p-4",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">Recently Viewed</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
        >
          <X className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {recentFactories.map((factory, index) => (
          <Link
            key={factory.id}
            to={`/directory/${factory.slug}`}
            className="flex-shrink-0 group"
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative w-24 h-24 rounded-lg overflow-hidden"
            >
              <img
                src={factory.coverImageUrl}
                alt={factory.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
                  {factory.name}
                </p>
              </div>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
            </motion.div>
          </Link>
        ))}

        {factoryIds.length > 5 && (
          <div className="flex-shrink-0 w-24 h-24 rounded-lg border border-dashed border-border flex items-center justify-center">
            <span className="text-xs text-muted-foreground text-center px-2">
              +{factoryIds.length - 5} more
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
