import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FactoryTypeBadge } from "@/components/marketplace/FactoryTypeBadge";
import { VerifiedBadge } from "@/components/marketplace/VerifiedBadge";
import { CertificationBadge } from "@/components/marketplace/CertificationBadge";
import { mockFactoryDetail, mockFactories } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function FactoryProfile() {
  const { slug } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubscribed] = useState(false); // Mock - would come from auth context

  // In real app, fetch factory by slug
  const factory = mockFactoryDetail;

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
        title={`${factory.name} | Factory Profile`}
        description={factory.about.description}
      />

      {/* Hero */}
      <section className="relative">
        {/* Cover Image */}
        <div className="h-64 md:h-80 lg:h-96 relative overflow-hidden">
          <img
            src={factory.media.coverImageUrl}
            alt={factory.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Factory Info Overlay */}
        <div className="container-wide">
          <div className="relative -mt-24 md:-mt-32 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-card-lg"
            >
              {/* Back link */}
              <Link
                to="/directory"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Directory
              </Link>

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <FactoryTypeBadge type={factory.type} />
                    {factory.isVerified && <VerifiedBadge />}
                  </div>

                  {/* Name */}
                  <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    {factory.name}
                  </h1>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{factory.location.city}, {factory.location.country}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSaved(!isSaved)}
                    className={cn(isSaved && "bg-primary/10 border-primary text-primary")}
                  >
                    <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="hero" size="lg">
                    Request Quote
                  </Button>
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
            {['overview', 'capabilities', 'team', 'gallery', 'documents'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* About */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                    About
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {factory.about.description}
                  </p>
                  {factory.about.story && (
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      {factory.about.story}
                    </p>
                  )}
                </div>

                {/* Specializations */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {factory.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {factory.certifications.map((cert) => (
                      <CertificationBadge key={cert.slug} certification={cert} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <StatRow
                      icon={Calendar}
                      label="Founded"
                      value={factory.about.foundedYear?.toString() || 'N/A'}
                    />
                    <StatRow
                      icon={Users}
                      label="Employees"
                      value={factory.about.employeeCount || 'N/A'}
                    />
                    <StatRow
                      icon={Building2}
                      label="Facility"
                      value={factory.about.facilitySize || 'N/A'}
                    />
                    <StatRow
                      icon={Clock}
                      label="Response Time"
                      value={factory.about.responseTime || 'N/A'}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    Product Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {factory.categories.map((cat) => (
                      <Badge key={cat} variant="outline">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities" className="mt-0">
            <div className="space-y-8">
              {/* Production Capabilities */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <CapabilityCard
                  icon={Package}
                  label="MOQ"
                  value={`${factory.capabilities.moqMin.toLocaleString()} - ${factory.capabilities.moqMax?.toLocaleString() || '∞'}`}
                />
                <CapabilityCard
                  icon={Clock}
                  label="Lead Time"
                  value={`${factory.capabilities.leadTimeMin}-${factory.capabilities.leadTimeMax || factory.capabilities.leadTimeMin} weeks`}
                />
                <CapabilityCard
                  icon={Building2}
                  label="Monthly Capacity"
                  value={factory.capabilities.monthlyCapacity?.toLocaleString() + ' units' || 'On request'}
                />
                <CapabilityCard
                  icon={Calendar}
                  label="Sampling"
                  value={factory.capabilities.samplingTime || 'On request'}
                />
              </div>

              {/* Services */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                  Services Offered
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {factory.capabilities.services.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Terms - Gated */}
              <GatedSection title="Pricing & Terms" isSubscribed={isSubscribed}>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">Payment Terms</h4>
                    <p className="text-muted-foreground">{factory.capabilities.paymentTerms}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">Sample Cost</h4>
                    <p className="text-muted-foreground">{factory.capabilities.sampleCostRange}</p>
                  </div>
                </div>
              </GatedSection>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="mt-0">
            <GatedSection title="Meet the Team" isSubscribed={isSubscribed} fullWidth>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {factory.team.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-muted">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-heading font-bold text-muted-foreground">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.bio && (
                      <p className="text-xs text-muted-foreground mt-1">{member.bio}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </GatedSection>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full">All</Button>
                <Button variant="ghost" size="sm" className="rounded-full">Photos</Button>
                <Button variant="ghost" size="sm" className="rounded-full">Videos</Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {factory.media.gallery.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={item.type === 'video' ? item.thumbnailUrl : item.url}
                      alt={item.caption || 'Factory media'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-foreground ml-1" />
                        </div>
                      </div>
                    )}
                    {item.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white text-xs">{item.caption}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-0">
            <GatedSection title="Certifications & Documents" isSubscribed={isSubscribed} fullWidth>
              <div className="space-y-3">
                {factory.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </GatedSection>
          </TabsContent>
        </Tabs>
      </section>

      {/* Sticky CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border lg:hidden z-40">
        <Button variant="hero" size="lg" className="w-full">
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

function GatedSection({
  title,
  children,
  isSubscribed,
  fullWidth = false,
}: {
  title: string;
  children: React.ReactNode;
  isSubscribed: boolean;
  fullWidth?: boolean;
}) {
  if (isSubscribed) {
    return (
      <div className={fullWidth ? '' : 'max-w-2xl'}>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
          {title}
        </h3>
        {children}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={cn("blur-sm pointer-events-none", fullWidth ? '' : 'max-w-2xl')}>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
          {title}
        </h3>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-card border border-border rounded-xl p-6 text-center shadow-lg max-w-sm">
          <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-heading font-semibold text-foreground mb-2">
            Subscribe to View
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Unlock full profiles, documents, and contact information
          </p>
          <Link to="/pricing">
            <Button variant="hero" size="sm">
              View Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
