import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterState } from "./FilterSidebar";
import { mockCategories, mockCertifications, mockCountries, factoryTypeLabels, FactoryType } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ActiveFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

interface FilterTag {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilters({ filters, onFiltersChange, onReset, className }: ActiveFiltersProps) {
  const tags: FilterTag[] = [];

  // Types
  filters.types.forEach((type) => {
    tags.push({
      key: `type-${type}`,
      label: factoryTypeLabels[type].label,
      onRemove: () => {
        onFiltersChange({
          ...filters,
          types: filters.types.filter((t) => t !== type),
        });
      },
    });
  });

  // Categories
  filters.categories.forEach((slug) => {
    const cat = mockCategories.find((c) => c.slug === slug);
    tags.push({
      key: `cat-${slug}`,
      label: cat?.name || slug,
      onRemove: () => {
        onFiltersChange({
          ...filters,
          categories: filters.categories.filter((c) => c !== slug),
        });
      },
    });
  });

  // Countries
  filters.countries.forEach((code) => {
    const country = mockCountries.find((c) => c.code === code);
    tags.push({
      key: `country-${code}`,
      label: country?.name || code,
      onRemove: () => {
        onFiltersChange({
          ...filters,
          countries: filters.countries.filter((c) => c !== code),
        });
      },
    });
  });

  // Certifications
  filters.certifications.forEach((slug) => {
    const cert = mockCertifications.find((c) => c.slug === slug);
    tags.push({
      key: `cert-${slug}`,
      label: cert?.name || slug,
      onRemove: () => {
        onFiltersChange({
          ...filters,
          certifications: filters.certifications.filter((c) => c !== slug),
        });
      },
    });
  });

  // MOQ Range (if not default)
  if (filters.moqRange[0] !== 0 || filters.moqRange[1] !== 10000) {
    tags.push({
      key: 'moq',
      label: `MOQ: ${filters.moqRange[0].toLocaleString()} - ${filters.moqRange[1] >= 10000 ? '10,000+' : filters.moqRange[1].toLocaleString()}`,
      onRemove: () => {
        onFiltersChange({
          ...filters,
          moqRange: [0, 10000],
        });
      },
    });
  }

  // Lead Time (if not default)
  if (filters.leadTimeRange[0] !== 1 || filters.leadTimeRange[1] !== 12) {
    tags.push({
      key: 'leadtime',
      label: `Lead: ${filters.leadTimeRange[0]}-${filters.leadTimeRange[1]} weeks`,
      onRemove: () => {
        onFiltersChange({
          ...filters,
          leadTimeRange: [1, 12],
        });
      },
    });
  }

  // Verified only
  if (filters.verifiedOnly) {
    tags.push({
      key: 'verified',
      label: 'Verified only',
      onRemove: () => {
        onFiltersChange({
          ...filters,
          verifiedOnly: false,
        });
      },
    });
  }

  if (tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {tags.map((tag) => (
        <span
          key={tag.key}
          className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-2.5 py-1 rounded-full"
        >
          {tag.label}
          <button
            onClick={tag.onRemove}
            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-muted-foreground hover:text-foreground h-7 px-2"
      >
        Clear all
      </Button>
    </div>
  );
}
