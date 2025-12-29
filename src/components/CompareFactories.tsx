import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Scale, 
  MapPin, 
  Package, 
  Clock, 
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { FactoryPreview, factoryTypeLabels } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface CompareFactoriesProps {
  factories: FactoryPreview[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function CompareFactories({ factories, onRemove, onClear }: CompareFactoriesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (factories.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg"
    >
      {/* Collapsed bar */}
      <div className="container-wide py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                Compare ({factories.length}/4)
              </span>
            </div>
            
            {/* Factory thumbnails */}
            <div className="flex items-center gap-2">
              {factories.map((factory) => (
                <div
                  key={factory.id}
                  className="relative group"
                >
                  <img
                    src={factory.coverImageUrl}
                    alt={factory.name}
                    className="w-10 h-10 rounded-lg object-cover border border-border"
                  />
                  <button
                    onClick={() => onRemove(factory.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Expand Comparison
                </>
              )}
            </Button>
            {factories.length >= 2 && (
              <Link to={`/compare?ids=${factories.map(f => f.id).join(',')}`}>
                <Button size="sm">
                  <Scale className="mr-2 h-4 w-4" />
                  Full Comparison
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Expanded comparison table */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="container-wide py-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground w-40">
                        Attribute
                      </th>
                      {factories.map((factory) => (
                        <th key={factory.id} className="text-left py-2 px-4 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <img
                              src={factory.coverImageUrl}
                              alt={factory.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-semibold text-foreground text-sm">
                                {factory.name}
                              </div>
                              <Badge
                                variant="secondary"
                                className={cn("text-xs", factoryTypeLabels[factory.type].color)}
                              >
                                {factoryTypeLabels[factory.type].label}
                              </Badge>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <CompareRow
                      label="Location"
                      icon={MapPin}
                      values={factories.map(f => `${f.location.city}, ${f.location.country}`)}
                    />
                    <CompareRow
                      label="Min. MOQ"
                      icon={Package}
                      values={factories.map(f => `${f.moqMin.toLocaleString()} units`)}
                      highlight="lowest"
                      numericValues={factories.map(f => f.moqMin)}
                    />
                    <CompareRow
                      label="Lead Time"
                      icon={Clock}
                      values={factories.map(f => `${f.leadTimeWeeks} weeks`)}
                      highlight="lowest"
                      numericValues={factories.map(f => f.leadTimeWeeks)}
                    />
                    <CompareRow
                      label="Verified"
                      icon={CheckCircle}
                      values={factories.map(f => f.isVerified)}
                      type="boolean"
                    />
                    <CompareRow
                      label="Certifications"
                      values={factories.map(f => f.certifications.map(c => c.name).join(", ") || "None")}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CompareRow({
  label,
  icon: Icon,
  values,
  type = "text",
  highlight,
  numericValues,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  values: (string | boolean)[];
  type?: "text" | "boolean";
  highlight?: "lowest" | "highest";
  numericValues?: number[];
}) {
  const getBestIndex = () => {
    if (!numericValues || !highlight) return -1;
    if (highlight === "lowest") {
      return numericValues.indexOf(Math.min(...numericValues));
    }
    return numericValues.indexOf(Math.max(...numericValues));
  };

  const bestIndex = getBestIndex();

  return (
    <tr>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </div>
      </td>
      {values.map((value, i) => (
        <td key={i} className="py-3 px-4">
          {type === "boolean" ? (
            value ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground" />
            )
          ) : (
            <span
              className={cn(
                "text-sm",
                bestIndex === i
                  ? "font-semibold text-primary"
                  : "text-foreground"
              )}
            >
              {value as string}
            </span>
          )}
        </td>
      ))}
    </tr>
  );
}

// Compare bar trigger component for factory cards
export function CompareButton({
  factory,
  isInCompare,
  onToggle,
  disabled,
}: {
  factory: FactoryPreview;
  isInCompare: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant={isInCompare ? "default" : "outline"}
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled && !isInCompare}
      className="text-xs"
    >
      <Scale className="mr-1 h-3 w-3" />
      {isInCompare ? "Remove" : "Compare"}
    </Button>
  );
}
