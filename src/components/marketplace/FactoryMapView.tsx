import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, Package, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { FactoryPreview, mockCountries } from "@/data/mockData";
import { FactoryTypeBadge } from "./FactoryTypeBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FactoryMapViewProps {
  factories: FactoryPreview[];
  onSave?: (id: string) => void;
  savedFactories?: string[];
}

// Approximate coordinates for countries (for visual placement)
const countryCoordinates: Record<string, { x: number; y: number }> = {
  CN: { x: 75, y: 35 },  // China
  VN: { x: 72, y: 45 },  // Vietnam
  BD: { x: 65, y: 40 },  // Bangladesh
  IN: { x: 58, y: 42 },  // India
  TR: { x: 42, y: 32 },  // Turkey
  PT: { x: 18, y: 33 },  // Portugal
  IT: { x: 35, y: 30 },  // Italy
  ID: { x: 78, y: 55 },  // Indonesia
};

export function FactoryMapView({ factories, onSave, savedFactories = [] }: FactoryMapViewProps) {
  // Group factories by country
  const factoriesByCountry = useMemo(() => {
    const grouped: Record<string, FactoryPreview[]> = {};
    factories.forEach((factory) => {
      const code = factory.location.countryCode;
      if (!grouped[code]) {
        grouped[code] = [];
      }
      grouped[code].push(factory);
    });
    return grouped;
  }, [factories]);

  const countries = Object.keys(factoriesByCountry);

  return (
    <div className="relative w-full bg-card rounded-xl border border-border overflow-hidden">
      {/* Map Container */}
      <div className="relative aspect-[16/9] min-h-[400px] bg-gradient-to-br from-muted/30 to-muted/60">
        {/* Grid overlay for visual effect */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Country markers */}
        {countries.map((countryCode, index) => {
          const coords = countryCoordinates[countryCode];
          if (!coords) return null;

          const countryFactories = factoriesByCountry[countryCode];
          const country = mockCountries.find(c => c.code === countryCode);

          return (
            <motion.div
              key={countryCode}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              className="absolute group"
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Marker */}
              <div className="relative">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all",
                  "bg-primary text-primary-foreground shadow-lg",
                  "hover:scale-110 hover:shadow-xl"
                )}>
                  <span className="text-sm font-bold">{countryFactories.length}</span>
                </div>

                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />

                {/* Tooltip */}
                <div className={cn(
                  "absolute left-1/2 -translate-x-1/2 bottom-full mb-2",
                  "opacity-0 group-hover:opacity-100 transition-opacity z-10",
                  "pointer-events-none group-hover:pointer-events-auto"
                )}>
                  <div className="bg-popover text-popover-foreground rounded-lg shadow-lg border border-border p-3 min-w-[200px] max-w-[280px]">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{country?.name || countryCode}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {countryFactories.length} {countryFactories.length === 1 ? 'factory' : 'factories'}
                      </span>
                    </div>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {countryFactories.slice(0, 5).map((factory) => (
                        <Link
                          key={factory.id}
                          to={`/directory/${factory.slug}`}
                          className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <img
                            src={factory.coverImageUrl}
                            alt={factory.name}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium line-clamp-1">{factory.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-0.5">
                                <Package className="w-3 h-3" />
                                {factory.moqMin ?? '—'}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {factory.leadTimeWeeks !== null ? `${factory.leadTimeWeeks}w` : '—'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {countryFactories.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center py-1">
                          +{countryFactories.length - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Empty state */}
        {countries.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground">No factories match your filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-muted-foreground font-medium">Regions:</span>
          {countries.map((countryCode) => {
            const country = mockCountries.find(c => c.code === countryCode);
            return (
              <div key={countryCode} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>{country?.name || countryCode}</span>
                <span className="text-muted-foreground">({factoriesByCountry[countryCode].length})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
