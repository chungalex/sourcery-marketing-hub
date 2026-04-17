import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Package,
  Clock,
  Users,
  Building2,
  Calendar,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  FileText,
  Play,
  ExternalLink,
  Lock,
  Star,
  ThumbsUp,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FactoryTypeBadge } from "@/components/marketplace/FactoryTypeBadge";
import { VerifiedBadge } from "@/components/marketplace/VerifiedBadge";
import { CertificationBadge } from "@/components/marketplace/CertificationBadge";
import { cn } from "@/lib/utils";
import { InquiryModal } from "@/components/modals/InquiryModal";
import { PricingGateModal } from "@/components/modals/PricingGateModal";
import { SampleRequestModal } from "@/components/modals/SampleRequestModal";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchFactoryBySlug, fetchFactoryPreviewBySlug } from "@/lib/factories";
import { supabase } from "@/integrations/supabase/client";
import type { Factory, FactoryPreview } from "@/types/database";
import type { FactoryType } from "@/data/mockData";

// Reviews come from real order data
const mockReviews: never[] = [];

export default function FactoryProfile() {
  const { slug } = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  
  const [factory, setFactory] = useState<Factory | null>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [preview, setPreview] = useState<FactoryPreview | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubscribed] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [pricingGateOpen, setPricingGateOpen] = useState(false);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [gatedFeature, setGatedFeature] = useState("");

  useEffect(() => {
    async function loadFactory() {
      if (authLoading || !slug) return;
      
      setIsLoadingData(true);
      try {
        if (isAuthenticated) {
          const data = await fetchFactoryBySlug(slug);
          if (data) {
            setFactory(data);
            // Fetch completed order count for social proof
            const { count } = await (supabase as any)
              .from("orders")
              .select("id", { count: "exact", head: true })
              .eq("factory_id", data.id)
              .eq("status", "closed");
            setOrderCount(count || 0);
          } else {
            setNotFound(true);
          }
        } else {
          // For logged out users, fetch preview only
          const data = await fetchFactoryPreviewBySlug(slug);
          if (data) {
            setPreview(data);
          } else {
            setNotFound(true);
          }
        }
      } catch (error) {
        console.error("Failed to load factory:", error);
        toast.error("Failed to load factory details");
        setNotFound(true);
      } finally {
        setIsLoadingData(false);
      }
    }
    
    loadFactory();
  }, [slug, isAuthenticated, authLoading]);

  const handleGatedAction = (feature: string) => {
    if (isSubscribed) {
      if (feature === "contact") {
        setInquiryModalOpen(true);
      } else if (feature === "sample") {
        setSampleModalOpen(true);
      }
    } else {
      setGatedFeature(feature);
      setPricingGateOpen(true);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Factory saved!");
  };

  // Loading state
  if (authLoading || isLoadingData) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  // Not found
  if (notFound) {
    return (
      <Layout>
        <div className="container-wide section-padding text-center">
          <h1 className="font-heading text-2xl font-bold">Factory not found</h1>
          <Link to="/directory">
            <Button variant="outline" className="mt-4">
              Back to Directory
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Logged out users see limited preview with login prompt
  if (!isAuthenticated && preview) {
    return (
      <Layout>
        <SEO
          title={`${preview.name} — ${preview.location?.city || preview.location?.country || "Factory"} | Sourcery`}
          description={`${preview.name} is a manufacturer in ${[preview.location?.city, preview.location?.country].filter(Boolean).join(", ")}. Categories: ${(preview.categories || []).slice(0,3).join(", ")}. View on Sourcery.`}
        />

        <section className="relative">
          <div className="h-64 md:h-80 relative overflow-hidden bg-gradient-to-r from-muted to-muted/50">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Sign in to view factory images</p>
              </div>
            </div>
          </div>

          <div className="container-wide">
            <div className="relative -mt-24 md:-mt-32 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-card-lg"
              >
                <Link
                  to="/directory"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Directory
                </Link>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <FactoryTypeBadge type={(preview.factory_type || 'artisan') as FactoryType} />
                      {preview.is_verified && <VerifiedBadge />}
                    </div>

                    <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                      {preview.name}
                    </h1>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{preview.city}, {preview.country}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to={`/auth?mode=signup&redirect=/directory/${slug}`}>
                      <Button variant="hero" size="lg">
                        <Lock className="w-4 h-4 mr-2" />
                        Sign in to View Full Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Preview Info */}
        <section className="container-wide pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 relative">
                <div className="blur-sm pointer-events-none">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                    About
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This factory is part of the Sourcery network. Full profile details available once connected.
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-xl">
                  <div className="text-center p-6">
                    <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <h4 className="font-heading font-semibold text-foreground mb-2">
                      Sign in to View Full Details
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a free account to access factory profiles, contact information, and more
                    </p>
                    <Link to={`/auth?mode=signup&redirect=/directory/${slug}`}>
                      <Button variant="hero" size="sm">
                        Create Free Account
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-heading font-semibold text-foreground mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <StatRow
                    icon={Package}
                    label="MOQ"
                    value={preview.moq_min ? `${preview.moq_min}+ units` : 'Contact for details'}
                  />
                  <StatRow
                    icon={Clock}
                    label="Lead Time"
                    value={preview.lead_time_weeks ? `${preview.lead_time_weeks} weeks` : 'Contact for details'}
                  />
                </div>
              </div>

              {preview.categories.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    Product Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {preview.categories.map((cat) => (
                      <Badge key={cat} variant="outline">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {preview.certifications.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {preview.certifications.map((cert) => (
                      <CertificationBadge key={cert} certification={{ slug: cert, name: cert }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Full factory view for authenticated users
  if (!factory) {
    return (
      <Layout>
        <div className="container-wide section-padding text-center">
          <h1 className="font-heading text-2xl font-bold">Factory not found</h1>
          <Link to="/directory">
            <Button variant="outline" className="mt-4">
              Back to Directory
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${factory.name} — ${factory.city || factory.country || "Factory"} | Sourcery`}
        description={factory.description
          ? factory.description.slice(0, 155)
          : `${factory.name} is a verified manufacturer in ${[factory.city, factory.country].filter(Boolean).join(", ")}. MOQ from ${factory.moq_min || "varies"} units. View profile on Sourcery.`}
      />
      {/* JSON-LD structured data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": factory.name,
        "description": factory.description || `Manufacturer in ${factory.country}`,
        "url": `https://sourcery.so/directory/${factory.slug}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": factory.city || "",
          "addressCountry": factory.country || "",
        },
        "foundingDate": factory.year_established?.toString(),
        "numberOfEmployees": factory.total_employees ? {
          "@type": "QuantitativeValue",
          "value": factory.total_employees,
        } : undefined,
        "sameAs": factory.website ? [factory.website] : [],
      })}} />

      {/* Hero */}
      <section className="relative">
        <div className="h-64 md:h-80 lg:h-96 relative overflow-hidden">
          <img
            src={factory.logo_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop'}
            alt={factory.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="container-wide">
          <div className="relative -mt-24 md:-mt-32 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-card-lg"
            >
              <Link
                to="/directory"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Directory
              </Link>

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <FactoryTypeBadge type={(factory.factory_type || 'artisan') as FactoryType} />
                    {factory.is_verified && <VerifiedBadge />}
                  </div>

                  <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    {factory.name}
                  </h1>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{factory.city}, {factory.country}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className={cn(isSaved && "bg-primary/10 border-primary text-primary")}
                  >
                    <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleGatedAction("sample")}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Request Sample
                  </Button>
                  <Button 
                    variant="hero" 
                    size="lg"
                    onClick={() => handleGatedAction("contact")}
                  >
                    Request Quote
                  </Button>
                  {user && (
                    <Link to={`/orders/create?factory=${factory?.id}`}>
                      <Button variant="outline" size="lg" className="gap-2">
                        <Package className="h-4 w-4" />
                        Create order
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs Content */}
      <section className="container-wide pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8 overflow-x-auto">
            {['overview', 'capabilities', 'gallery', 'reviews'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                {tab}
                {tab === 'reviews' && (
                  <span className="ml-1 text-xs text-muted-foreground">({mockReviews.length})</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                    About
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {factory.description || 'No description available.'}
                  </p>
                </div>

                {factory.categories.length > 0 && (
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {factory.categories.map((cat) => (
                        <Badge key={cat} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {factory.certifications.length > 0 && (
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {factory.certifications.map((cert) => (
                        <CertificationBadge key={cert} certification={{ slug: cert, name: cert }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    {factory.year_established && (
                      <StatRow
                        icon={Calendar}
                        label="Founded"
                        value={factory.year_established.toString()}
                      />
                    )}
                    {factory.total_employees && (
                      <StatRow
                        icon={Users}
                        label="Employees"
                        value={factory.total_employees.toString()}
                      />
                    )}
                    <StatRow
                      icon={Package}
                      label="MOQ"
                      value={factory.moq_min ? `${factory.moq_min}+ units` : 'Contact for details'}
                    />
                    <StatRow
                      icon={Clock}
                      label="Lead Time"
                      value={factory.lead_time_weeks ? `${factory.lead_time_weeks} weeks` : 'Contact for details'}
                    />
                    {orderCount > 0 && (
                      <StatRow
                        icon={CheckCircle}
                        label="Orders on Sourcery"
                        value={`${orderCount} completed`}
                      />
                    )}
                  </div>
                </div>

                {(factory.website || factory.email) && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="font-heading font-semibold text-foreground mb-4">
                      Contact
                    </h3>
                    <div className="space-y-2 text-sm">
                      {factory.website && (
                        <a 
                          href={factory.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Website
                        </a>
                      )}
                      {factory.email && (
                        <a 
                          href={`mailto:${factory.email}`}
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                          {factory.email}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities" className="mt-0">
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <CapabilityCard
                  icon={Package}
                  label="MOQ"
                  value={factory.moq_min && factory.moq_max 
                    ? `${factory.moq_min.toLocaleString()} - ${factory.moq_max.toLocaleString()}`
                    : factory.moq_min 
                      ? `${factory.moq_min.toLocaleString()}+`
                      : 'Contact for details'
                  }
                />
                <CapabilityCard
                  icon={Clock}
                  label="Lead Time"
                  value={factory.lead_time_weeks ? `${factory.lead_time_weeks} weeks` : 'Contact for details'}
                />
                <CapabilityCard
                  icon={Building2}
                  label="Employees"
                  value={factory.total_employees?.toLocaleString() || 'N/A'}
                />
                <CapabilityCard
                  icon={Calendar}
                  label="Established"
                  value={factory.year_established?.toString() || 'N/A'}
                />
              </div>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {factory.gallery_urls.length > 0 ? (
                factory.gallery_urls.map((url, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={url}
                      alt={`${factory.name} gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No gallery images available
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-0">
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground">4.7</div>
                    <div className="flex items-center justify-center gap-1 my-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {mockReviews.length} reviews
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = mockReviews.filter(r => r.rating === rating).length;
                      const percent = (count / mockReviews.length) * 100;
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground w-3">{rating}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-6">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {mockReviews.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No reviews yet. Reviews appear here after completed orders on Sourcery.</p>
                </div>
              ) : mockReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{review.author}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">{review.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-3 w-3",
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium text-foreground mb-2">{review.title}</h4>
                    <p className="text-muted-foreground text-sm">{review.content}</p>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Modals */}
      <InquiryModal
        open={inquiryModalOpen}
        onOpenChange={setInquiryModalOpen}
        factoryName={factory.name}
        factoryId={factory.id}
      />
      <PricingGateModal
        open={pricingGateOpen}
        onOpenChange={setPricingGateOpen}
        feature={gatedFeature}
      />
      <SampleRequestModal
        open={sampleModalOpen}
        onOpenChange={setSampleModalOpen}
        factoryName={factory.name}
        factoryId={factory.id}
      />

      {/* Sticky CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border lg:hidden z-40">
        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          onClick={() => handleGatedAction("contact")}
        >
          Request Quote
        </Button>
      </div>
    </Layout>
  );
}

function StatRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function CapabilityCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 text-center">
      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-heading font-semibold text-foreground">{value}</p>
    </div>
  );
}
