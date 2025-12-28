import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { mockCategories, mockCertifications, mockCountries, factoryTypeLabels, FactoryType } from "@/data/mockData";
import { cn } from "@/lib/utils";

export interface FilterState {
  types: FactoryType[];
  categories: string[];
  certifications: string[];
  countries: string[];
  moqRange: [number, number];
  leadTimeRange: [number, number];
  verifiedOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

const initialFilters: FilterState = {
  types: [],
  categories: [],
  certifications: [],
  countries: [],
  moqRange: [0, 10000],
  leadTimeRange: [1, 12],
  verifiedOnly: false,
};

export function FilterSidebar({ filters, onFiltersChange, onReset, className }: FilterSidebarProps) {
  const activeFilterCount = [
    filters.types.length,
    filters.categories.length,
    filters.certifications.length,
    filters.countries.length,
    filters.verifiedOnly ? 1 : 0,
    (filters.moqRange[0] !== 0 || filters.moqRange[1] !== 10000) ? 1 : 0,
    (filters.leadTimeRange[0] !== 1 || filters.leadTimeRange[1] !== 12) ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const content = (
    <div className="space-y-6">
      {/* Reset */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {activeFilterCount} filter{activeFilterCount !== 1 && 's'} active
          </span>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      )}

      {/* Factory Type */}
      <FilterSection title="Factory Type" defaultOpen>
        <div className="space-y-2">
          {(Object.keys(factoryTypeLabels) as FactoryType[]).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.types.includes(type)}
                onCheckedChange={(checked) => {
                  onFiltersChange({
                    ...filters,
                    types: checked
                      ? [...filters.types, type]
                      : filters.types.filter((t) => t !== type),
                  });
                }}
              />
              <span className="text-sm">{factoryTypeLabels[type].label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Categories">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {mockCategories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.categories.includes(cat.slug)}
                onCheckedChange={(checked) => {
                  onFiltersChange({
                    ...filters,
                    categories: checked
                      ? [...filters.categories, cat.slug]
                      : filters.categories.filter((c) => c !== cat.slug),
                  });
                }}
              />
              <span className="text-sm flex-1">{cat.name}</span>
              <span className="text-xs text-muted-foreground">({cat.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* MOQ Range */}
      <FilterSection title="Minimum Order Quantity">
        <div className="px-1">
          <Slider
            min={0}
            max={10000}
            step={100}
            value={filters.moqRange}
            onValueChange={(value) => {
              onFiltersChange({
                ...filters,
                moqRange: value as [number, number],
              });
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{filters.moqRange[0].toLocaleString()}</span>
            <span>{filters.moqRange[1] >= 10000 ? '10,000+' : filters.moqRange[1].toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      {/* Lead Time */}
      <FilterSection title="Lead Time (weeks)">
        <div className="px-1">
          <Slider
            min={1}
            max={12}
            step={1}
            value={filters.leadTimeRange}
            onValueChange={(value) => {
              onFiltersChange({
                ...filters,
                leadTimeRange: value as [number, number],
              });
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{filters.leadTimeRange[0]} week{filters.leadTimeRange[0] !== 1 && 's'}</span>
            <span>{filters.leadTimeRange[1]}+ weeks</span>
          </div>
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {mockCountries.map((country) => (
            <label key={country.code} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.countries.includes(country.code)}
                onCheckedChange={(checked) => {
                  onFiltersChange({
                    ...filters,
                    countries: checked
                      ? [...filters.countries, country.code]
                      : filters.countries.filter((c) => c !== country.code),
                  });
                }}
              />
              <span className="text-sm flex-1">{country.name}</span>
              <span className="text-xs text-muted-foreground">({country.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Certifications */}
      <FilterSection title="Certifications">
        <div className="space-y-2">
          {mockCertifications.map((cert) => (
            <label key={cert.slug} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.certifications.includes(cert.slug)}
                onCheckedChange={(checked) => {
                  onFiltersChange({
                    ...filters,
                    certifications: checked
                      ? [...filters.certifications, cert.slug]
                      : filters.certifications.filter((c) => c !== cert.slug),
                  });
                }}
              />
              <span className="text-sm">{cert.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Verified Only */}
      <div className="pt-2 border-t border-border">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={filters.verifiedOnly}
            onCheckedChange={(checked) => {
              onFiltersChange({
                ...filters,
                verifiedOnly: checked as boolean,
              });
            }}
          />
          <span className="text-sm font-medium">Verified factories only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn("hidden lg:block w-64 flex-shrink-0", className)}>
        <div className="sticky top-24 bg-card rounded-xl border border-border p-5">
          <h2 className="font-heading font-semibold text-foreground mb-4">Filters</h2>
          {content}
        </div>
      </aside>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              {content}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

function FilterSection({ 
  title, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
        {title}
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-2 pb-4"
        >
          {children}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { initialFilters };
