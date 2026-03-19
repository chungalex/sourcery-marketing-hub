import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FactoryCard } from "@/components/marketplace/FactoryCard";
import { FactoryTableRow } from "@/components/marketplace/FactoryTableRow";
import { FactoryMapView } from "@/components/marketplace/FactoryMapView";
import { FilterSidebar, FilterState, initialFilters } from "@/components/marketplace/FilterSidebar";
import { ActiveFilters } from "@/components/marketplace/ActiveFilters";
import { RecentlyViewed } from "@/components/marketplace/RecentlyViewed";
import { ViewToggle, ViewMode } from "@/components/marketplace/ViewToggle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { fetchFactories, fetchFactoryPreviews } from "@/lib/factories";
import { toast } from "sonner";
import type { Factory, FactoryPreview } from "@/types/database";
import type { FactoryPreview as MockFactoryPreview, FactoryType } from "@/data/mockData";

const quickFilters: { label: string; type: FactoryType | 'all' }[] = [
  { label: 'All', type: 'all' },
  { label: 'Mass Production', type: 'mass_production' },
  { label: 'Boutique', type: 'boutique' },
  { label: 'Artisan', type: 'artisan' },
];

type SortOption = 'newest' | 'completeness' | 'moq_low' | 'moq_high' | 'lead_time';

const RECENTLY_VIEWED_KEY = 'sourcery_recently_viewed';

// Transform DB factory to display format
// Note: null values for moqMin/leadTimeWeeks are preserved as null for proper filter handling
function transformFactory(f: Factory): MockFactoryPreview {
  return {
    id: f.id,
    slug: f.slug,
    name: f.name,
    type: (f.factory_type as FactoryType) || 'mass_production',
    location: {
      city: f.city || '',
      country: f.country,
      countryCode: f.country.substring(0, 2).toUpperCase(),
    },
    coverImageUrl: f.logo_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    categories: f.categories || [],
    moqMin: f.moq_min ?? null,
    leadTimeWeeks: f.lead_time_weeks ?? null,
    certifications: (f.certifications || []).map(c => ({ slug: c, name: c })),
    isVerified: f.is_verified,
    completenessScore: 80,
    createdAt: f.created_at,
  };
}

// Transform DB preview to display format
// Note: null values for moqMin/leadTimeWeeks are preserved as null for proper filter handling
function transformPreview(f: FactoryPreview): MockFactoryPreview {
  return {
    id: f.id,
    slug: f.slug,
    name: f.name,
    type: (f.factory_type as FactoryType) || 'mass_production',
    location: {
      city: f.city || '',
      country: f.country,
      countryCode: f.country.substring(0, 2).toUpperCase(),
    },
    coverImageUrl: f.logo_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    categories: f.categories || [],
    moqMin: f.moq_min ?? null,
    leadTimeWeeks: f.lead_time_weeks ?? null,
    certifications: (f.certifications || []).map(c => ({ slug: c, name: c })),
    isVerified: f.is_verified,
    completenessScore: 80,
    createdAt: f.created_at,
  };
}

export default function Directory() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [savedFactories, setSavedFactories] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  
  const [factories, setFactories] = useState<MockFactoryPreview[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const isAuthenticated = !!user;

  const toggleCompare = (id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  // Load factories - start with previews immediately, upgrade to full data when auth resolves
  useEffect(() => {
    let cancelled = false;
    
    async function loadFactories() {
      setIsLoadingData(true);
      try {
        // If auth is still loading or user is not authenticated, fetch previews.
        // If authenticated fetch returns empty or errors (RLS/transient issues), fall back to previews.
        if (authLoading || !isAuthenticated) {
          const previews = await fetchFactoryPreviews();
          if (!cancelled) setFactories(previews.map(transformPreview));
          return;
        }

        try {
          const full = await fetchFactories();
          if (!cancelled) {
            if (full.length > 0) {
              setFactories(full.map(transformFactory));
            } else {
              const previews = await fetchFactoryPreviews();
              setFactories(previews.map(transformPreview));
            }
          }
        } catch (err) {
          console.warn("Directory: fetchFactories failed, falling back to previews", err);
          const previews = await fetchFactoryPreviews();
          if (!cancelled) setFactories(previews.map(transformPreview));
        }
      } catch (error) {
        console.error("Failed to load factories:", error);
        if (!cancelled) {
          toast.error("Failed to load factories. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingData(false);
        }
      }
    }
    
    loadFactories();
    
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading]);

  // Load recently viewed from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch {
        localStorage.removeItem(RECENTLY_VIEWED_KEY);
      }
    }
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.types.length > 0 ||
      filters.categories.length > 0 ||
      filters.countries.length > 0 ||
      filters.certifications.length > 0 ||
      filters.verifiedOnly ||
      filters.moqRange[0] !== 0 ||
      filters.moqRange[1] !== 10000 ||
      filters.leadTimeRange[0] !== 1 ||
      filters.leadTimeRange[1] !== 12
    );
  }, [filters]);

  // Filter and sort factories
  const filteredFactories = useMemo(() => {
    let result = [...factories];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(searchLower) ||
          f.categories.some((c) => c.toLowerCase().includes(searchLower)) ||
          f.location.city.toLowerCase().includes(searchLower) ||
          f.location.country.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (filters.types.length > 0) {
      result = result.filter((f) => filters.types.includes(f.type));
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((f) =>
        f.categories.some((c) =>
          filters.categories.some((fc) => c.toLowerCase().includes(fc.replace(/-/g, ' ')))
        )
      );
    }

    // Country filter
    if (filters.countries.length > 0) {
      result = result.filter((f) => filters.countries.includes(f.location.countryCode));
    }

    // Certification filter
    if (filters.certifications.length > 0) {
      result = result.filter((f) =>
        f.certifications.some((c) => filters.certifications.includes(c.slug))
      );
    }

    // MOQ filter - NULL values pass through (incomplete profiles not excluded)
    result = result.filter(
      (f) => f.moqMin === null || (f.moqMin >= filters.moqRange[0] && f.moqMin <= filters.moqRange[1])
    );

    // Lead time filter - NULL values pass through (incomplete profiles not excluded)
    result = result.filter(
      (f) => f.leadTimeWeeks === null || (f.leadTimeWeeks >= filters.leadTimeRange[0] && f.leadTimeWeeks <= filters.leadTimeRange[1])
    );

    // Verified only
    if (filters.verifiedOnly) {
      result = result.filter((f) => f.isVerified);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'completeness':
        result.sort((a, b) => b.completenessScore - a.completenessScore);
        break;
      case 'moq_low':
        result.sort((a, b) => a.moqMin - b.moqMin);
        break;
      case 'moq_high':
        result.sort((a, b) => b.moqMin - a.moqMin);
        break;
      case 'lead_time':
        result.sort((a, b) => a.leadTimeWeeks - b.leadTimeWeeks);
        break;
    }

    return result;
  }, [search, filters, sortBy, factories]);

  const handleQuickFilter = (type: FactoryType | 'all') => {
    if (type === 'all') {
      setFilters({ ...filters, types: [] });
    } else {
      setFilters({ ...filters, types: [type] });
    }
  };

  const handleSave = (id: string) => {
    setSavedFactories((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleClearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  };

  const isLoading = isLoadingData;

  return (
    <Layout>
      <SEO
        title="Factory Directory | Discover Vetted Manufacturing Partners"
        description="Browse our curated network of certified factories, boutique workshops, and artisan producers. Find the perfect manufacturing partner for your brand."
      />

      {/* Hero */}
      <section className="bg-[var(--hero-gradient)] pt-8 pb-12">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Discover Vetted Manufacturing Partners
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our curated network of certified factories, boutique workshops, and artisan producers
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, category, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 text-base bg-background"
              />
            </div>
          </motion.div>

          {/* Quick Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
          >
            {quickFilters.map((qf) => (
              <Button
                key={qf.type}
                variant={
                  (qf.type === 'all' && filters.types.length === 0) ||
                  (qf.type !== 'all' && filters.types.length === 1 && filters.types[0] === qf.type)
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                onClick={() => handleQuickFilter(qf.type)}
                className="rounded-full"
              >
                {qf.label}
              </Button>
            ))}
          </motion.div>

          {/* Auth prompt for logged out users */}
          {!isAuthenticated && !authLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm">
                <Lock className="w-4 h-4" />
                <span>
                  <Link to="/auth?mode=signup&redirect=/directory" className="font-medium hover:underline">
                    Sign up
                  </Link>
                  {" "}to view full factory profiles
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Directory */}
      <section className="section-padding">
        <div className="container-wide">
          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <RecentlyViewed
              factoryIds={recentlyViewed}
              allFactories={factories}
              onClear={handleClearRecentlyViewed}
              className="mb-6"
            />
          )}

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setFilters(initialFilters)}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="lg:hidden">
                      <FilterSidebar
                        filters={filters}
                        onFiltersChange={setFilters}
                        onReset={() => setFilters(initialFilters)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{filteredFactories.length}</span>
                      {' '}of{' '}
                      <span className="font-medium">{factories.length}</span>
                      {' '}factories
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <ViewToggle value={viewMode} onChange={setViewMode} />

                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                      <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="completeness">Best Match</SelectItem>
                          <SelectItem value="moq_low">MOQ: Low to High</SelectItem>
                          <SelectItem value="moq_high">MOQ: High to Low</SelectItem>
                          <SelectItem value="lead_time">Lead Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {hasActiveFilters && (
                  <ActiveFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onReset={() => setFilters(initialFilters)}
                  />
                )}
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}

              {/* Compare bar */}
              {compareList.length >= 2 && (
                <div className="sticky top-4 z-30 flex items-center justify-between gap-4 p-3 rounded-xl bg-background border border-primary/30 shadow-sm mb-4">
                  <p className="text-sm text-foreground font-medium">
                    {compareList.length} factories selected
                    <span className="text-muted-foreground font-normal ml-1">— up to 3</span>
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setCompareList([])} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
                    <button
                      onClick={() => navigate(`/compare?ids=${compareList.join(",")}`)}
                      className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium hover:bg-primary/90"
                    >
                      Compare →
                    </button>
                  </div>
                </div>
              )}

              {/* Results */}
              {!isLoading && filteredFactories.length > 0 && (
                <>
                  {viewMode === 'grid' && (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredFactories.map((factory, index) => (
                        <div key={factory.id} className="relative group">
                          <FactoryCard
                            factory={factory}
                            index={index}
                            onSave={handleSave}
                            isSaved={savedFactories.includes(factory.id)}
                          />
                          <button
                            onClick={() => toggleCompare(factory.id)}
                            className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-md font-medium transition-all border ${
                              compareList.includes(factory.id)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background/90 text-muted-foreground border-border opacity-0 group-hover:opacity-100"
                            } ${compareList.length >= 3 && !compareList.includes(factory.id) ? "opacity-30 cursor-not-allowed" : ""}`}
                            disabled={compareList.length >= 3 && !compareList.includes(factory.id)}
                          >
                            {compareList.includes(factory.id) ? "✓ Compare" : "+ Compare"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {viewMode === 'table' && (
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Factory</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Categories</TableHead>
                            <TableHead>MOQ</TableHead>
                            <TableHead>Lead Time</TableHead>
                            <TableHead>Certifications</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredFactories.map((factory) => (
                            <FactoryTableRow
                              key={factory.id}
                              factory={factory}
                              onSave={handleSave}
                              isSaved={savedFactories.includes(factory.id)}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {viewMode === 'map' && (
                    <FactoryMapView
                      factories={filteredFactories}
                      onSave={handleSave}
                      savedFactories={savedFactories}
                    />
                  )}
                </>
              )}

              {/* Empty State */}
              {!isLoading && filteredFactories.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    No factories found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {factories.length === 0 
                      ? "No factories have been added yet. Check back soon!"
                      : "Try adjusting your filters or search terms"
                    }
                  </p>
                  {factories.length > 0 && (
                    <Button variant="outline" onClick={() => {
                      setSearch("");
                      setFilters(initialFilters);
                    }}>
                      Reset Filters
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Load More */}
              {!isLoading && filteredFactories.length > 0 && viewMode !== 'map' && (
                <div className="text-center mt-10">
                  <Button variant="outline" size="lg">
                    Load More Factories
                  </Button>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-12 p-4 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  <strong>Important:</strong> While we carefully vet all factories in our network, you are responsible for conducting your own due diligence before entering any manufacturing agreement. We recommend requesting samples, verifying certifications, and starting with smaller orders. See our{" "}
                  <a href="/terms" className="text-primary hover:underline">Terms of Service</a> for full details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
