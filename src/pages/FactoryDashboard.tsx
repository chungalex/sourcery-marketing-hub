import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Building2, MessageSquare, BarChart3, Settings, Eye, Users,
  Clock, CheckCircle, Send, ExternalLink, Loader2, Package,
} from "lucide-react";
import { ProfileViewsChart, InquirySourcesChart, InquiryStatusChart } from "@/components/dashboard/AnalyticsCharts";
import { useAuth } from "@/hooks/useAuth";
import { useFactoryMembership } from "@/hooks/useFactoryMembership";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface FactoryProfile {
  id: string; name: string; slug: string; description: string | null;
  website: string | null; email: string | null; phone: string | null;
  moq_min: number | null; lead_time_weeks: number | null;
  total_employees: number | null; city: string | null; country: string;
}

interface RealInquiry {
  id: string; requester_name: string; requester_email: string;
  message: string | null; status: string; conversion_status: string;
  order_id: string | null; created_at: string | null;
}

function StatSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <Skeleton className="h-5 w-5 mb-4" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

function InquirySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div><Skeleton className="h-5 w-36 mb-2" /><Skeleton className="h-4 w-48" /></div>
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default function FactoryDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const { factoryIds, hasFactoryAccess, isLoading: membershipLoading } = useFactoryMembership(user?.id);
  const factoryId = factoryIds[0];

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["factory-profile", factoryId],
    enabled: !!factoryId,
    queryFn: async (): Promise<FactoryProfile | null> => {
      const { data, error } = await supabase
        .from("factories")
        .select("id, name, slug, description, website, email, phone, moq_min, lead_time_weeks, total_employees, city, country")
        .eq("id", factoryId)
        .single();
      if (error) throw error;
      return data as FactoryProfile;
    },
  });

  const { data: inquiries = [], isLoading: inquiriesLoading, refetch: refetchInquiries } = useQuery({
    queryKey: ["factory-inquiries", factoryId],
    enabled: !!factoryId,
    queryFn: async (): Promise<RealInquiry[]> => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("id, requester_name, requester_email, message, status, conversion_status, order_id, created_at")
        .eq("factory_id", factoryId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as RealInquiry[];
    },
  });

  const { data: orderStats, isLoading: statsLoading } = useQuery({
    queryKey: ["factory-order-stats", factoryId],
    enabled: !!factoryId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders").select("status").eq("factory_id", factoryId);
      if (error) throw error;
      const orders = data || [];
      const activeStatuses = ["po_issued","po_accepted","in_production","qc_scheduled","qc_uploaded","qc_pass","ready_to_ship","shipped"];
      return {
        total: orders.length,
        active: orders.filter((o) => activeStatuses.includes(o.status)).length,
        completed: orders.filter((o) => o.status === "closed").length,
      };
    },
  });

  const [profileForm, setProfileForm] = useState<Partial<FactoryProfile>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (profile) setProfileForm({ name: profile.name, description: profile.description ?? "", website: profile.website ?? "", email: profile.email ?? "", phone: profile.phone ?? "", moq_min: profile.moq_min ?? undefined, lead_time_weeks: profile.lead_time_weeks ?? undefined, total_employees: profile.total_employees ?? undefined });
  }, [profile]);

  useEffect(() => { if (!authLoading && !user) navigate("/auth?redirect=/dashboard/factory"); }, [authLoading, navigate, user]);
  useEffect(() => { if (!authLoading && user && !membershipLoading && !hasFactoryAccess) navigate("/dashboard"); }, [authLoading, hasFactoryAccess, membershipLoading, navigate, user]);

  const handleSaveProfile = async () => {
    if (!factoryId) return;
    setSavingProfile(true);
    const { error } = await supabase.from("factories").update({ name: profileForm.name, description: profileForm.description, website: profileForm.website, email: profileForm.email, phone: profileForm.phone, moq_min: profileForm.moq_min ?? null, lead_time_weeks: profileForm.lead_time_weeks ?? null, total_employees: profileForm.total_employees ?? null }).eq("id", factoryId);
    if (error) { toast.error("Failed to save profile"); console.error(error); }
    else { toast.success("Profile saved successfully"); qc.invalidateQueries({ queryKey: ["factory-profile", factoryId] }); }
    setSavingProfile(false);
  };

  const handleSendReply = async (inquiryId: string) => {
    setSendingReply(true);
    const { error } = await supabase.from("inquiries").update({ status: "replied" }).eq("id", inquiryId);
    if (error) { toast.error("Failed to update inquiry status"); }
    else { toast.success("Marked as replied — contact the brand directly at their email."); setReplyingTo(null); setReplyMessage(""); refetchInquiries(); }
    setSendingReply(false);
  };

  const newCount = inquiries.filter((i) => i.status === "new").length;

  if (authLoading || membershipLoading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-wide flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || !hasFactoryAccess) return null;

  return (
    <Layout>
      <SEO title="Factory Dashboard | Sourcery" description="Manage your factory profile, respond to inquiries, and track performance." />

      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {profileLoading ? <Skeleton className="h-9 w-48 inline-block" /> : (profile?.name || "Factory Dashboard")}
              </h1>
              <p className="text-muted-foreground">
                {profile?.city ? `${profile.city}, ${profile.country}` : "Manage your profile and connect with brands"}
              </p>
            </div>
            {profile?.slug && (
              <Button asChild>
                <Link to={`/directory/${profile.slug}`}><Eye className="mr-2 h-4 w-4" />View Public Profile</Link>
              </Button>
            )}
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {(statsLoading || inquiriesLoading) ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />) : (
              <>
                <div className="bg-card border border-border rounded-xl p-6">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mb-4" />
                  <div className="text-2xl font-bold text-foreground">{inquiries.length}</div>
                  <div className="text-sm text-muted-foreground">Total Inquiries</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    {newCount > 0 && <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{newCount} new</span>}
                  </div>
                  <div className="text-2xl font-bold text-foreground">{inquiries.filter(i => i.status === "replied").length}</div>
                  <div className="text-sm text-muted-foreground">Replied</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <Package className="h-5 w-5 text-muted-foreground mb-4" />
                  <div className="text-2xl font-bold text-foreground">{orderStats?.active ?? 0}</div>
                  <div className="text-sm text-muted-foreground">Active Orders</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <CheckCircle className="h-5 w-5 text-muted-foreground mb-4" />
                  <div className="text-2xl font-bold text-foreground">{orderStats?.completed ?? 0}</div>
                  <div className="text-sm text-muted-foreground">Completed Orders</div>
                </div>
              </>
            )}
          </div>

          <Tabs defaultValue="inquiries" className="space-y-6">
            <TabsList>
              <TabsTrigger value="inquiries" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />Inquiries
                {newCount > 0 && <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">{newCount}</span>}
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2"><Building2 className="h-4 w-4" />Edit Profile</TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2"><Settings className="h-4 w-4" />Settings</TabsTrigger>
            </TabsList>

            {/* Inquiries */}
            <TabsContent value="inquiries" className="space-y-4">
              {inquiriesLoading ? <InquirySkeleton /> : inquiries.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No inquiries yet</h3>
                  <p className="text-muted-foreground">Brands will contact you through your public profile.</p>
                </div>
              ) : inquiries.map((inquiry) => (
                <div key={inquiry.id} className={`bg-card border rounded-xl p-6 ${inquiry.status === "new" ? "border-primary/50 bg-primary/5" : "border-border"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{inquiry.requester_name}</div>
                        <div className="text-sm text-muted-foreground">{inquiry.requester_email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {inquiry.status === "new" ? <Badge>New</Badge> : inquiry.status === "replied" ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle className="h-3 w-3" />Replied</span>
                      ) : <Badge variant="outline" className="capitalize">{inquiry.status}</Badge>}
                      {inquiry.conversion_status === "converted" && <Badge variant="secondary" className="text-xs">Order Created</Badge>}
                      {inquiry.created_at && (
                        <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                          <Clock className="h-3 w-3" />{format(new Date(inquiry.created_at), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>

                  {inquiry.message && (
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-5">{inquiry.message}</p>
                    </div>
                  )}

                  {replyingTo === inquiry.id ? (
                    <div className="space-y-3">
                      <Textarea placeholder="Write your response..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} rows={4} />
                      <p className="text-xs text-muted-foreground">
                        This marks the inquiry as replied. Send your full response directly to{" "}
                        <a href={`mailto:${inquiry.requester_email}`} className="text-primary hover:underline">{inquiry.requester_email}</a>.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleSendReply(inquiry.id)} disabled={sendingReply}>
                          {sendingReply ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                          Mark as Replied
                        </Button>
                        <Button variant="outline" onClick={() => { setReplyingTo(null); setReplyMessage(""); }}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {inquiry.status === "new" && (
                        <Button onClick={() => setReplyingTo(inquiry.id)}><Send className="mr-2 h-4 w-4" />Reply</Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${inquiry.requester_email}`}><ExternalLink className="mr-2 h-3 w-3" />Email Brand</a>
                      </Button>
                      {inquiry.order_id && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/orders/${inquiry.order_id}`}><Package className="mr-2 h-3 w-3" />View Order</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            {/* Profile */}
            <TabsContent value="profile">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Edit Factory Profile</h3>
                  {profile?.slug && <Button variant="ghost" size="sm" asChild><Link to={`/directory/${profile.slug}`}><Eye className="mr-2 h-3 w-3" />Preview</Link></Button>}
                </div>
                {profileLoading ? (
                  <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Factory Name</Label><Input value={profileForm.name || ""} onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))} /></div>
                      <div className="space-y-2"><Label>Website</Label><Input value={profileForm.website || ""} placeholder="https://" onChange={(e) => setProfileForm(p => ({ ...p, website: e.target.value }))} /></div>
                    </div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={profileForm.description || ""} rows={4} placeholder="Describe your factory's capabilities..." onChange={(e) => setProfileForm(p => ({ ...p, description: e.target.value }))} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>Min MOQ (units)</Label><Input type="number" value={profileForm.moq_min ?? ""} onChange={(e) => setProfileForm(p => ({ ...p, moq_min: parseInt(e.target.value) || undefined }))} /></div>
                      <div className="space-y-2"><Label>Lead Time (weeks)</Label><Input type="number" value={profileForm.lead_time_weeks ?? ""} onChange={(e) => setProfileForm(p => ({ ...p, lead_time_weeks: parseInt(e.target.value) || undefined }))} /></div>
                      <div className="space-y-2"><Label>Total Employees</Label><Input type="number" value={profileForm.total_employees ?? ""} onChange={(e) => setProfileForm(p => ({ ...p, total_employees: parseInt(e.target.value) || undefined }))} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Contact Email</Label><Input type="email" value={profileForm.email || ""} onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))} /></div>
                      <div className="space-y-2"><Label>Contact Phone</Label><Input value={profileForm.phone || ""} onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))} /></div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={savingProfile}>
                        {savingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Performance Analytics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-muted/50 rounded-lg"><div className="text-2xl font-bold">{inquiries.length}</div><div className="text-xs text-muted-foreground">Total Inquiries</div></div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg"><div className="text-2xl font-bold">{inquiries.filter(i => i.conversion_status === "converted").length}</div><div className="text-xs text-muted-foreground">Converted to Orders</div></div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg"><div className="text-2xl font-bold">{orderStats?.total ?? 0}</div><div className="text-xs text-muted-foreground">Total Orders</div></div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{inquiries.length > 0 ? Math.round((inquiries.filter(i => i.conversion_status === "converted").length / inquiries.length) * 100) : 0}%</div>
                    <div className="text-xs text-muted-foreground">Conversion Rate</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4"><h4 className="font-medium text-foreground">Profile Views (Last 30 Days)</h4><ProfileViewsChart /></div>
                  <div className="space-y-4"><h4 className="font-medium text-foreground">Inquiry Sources</h4><InquirySourcesChart /></div>
                </div>
                <div className="mt-6 pt-6 border-t border-border"><h4 className="font-medium text-foreground mb-4">Inquiry Status Breakdown</h4><InquiryStatusChart /></div>
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Account Email</Label>
                    <Input type="email" value={user?.email || ""} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Contact support to change your login email.</p>
                  </div>
                  <div className="border-t border-border pt-6">
                    <h4 className="font-medium text-foreground mb-4">Notification Preferences</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="rounded" /><span className="text-sm text-foreground">Email me when I receive a new inquiry</span></label>
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="rounded" /><span className="text-sm text-foreground">Weekly analytics summary</span></label>
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="rounded" /><span className="text-sm text-foreground">Marketing and promotional emails</span></label>
                    </div>
                  </div>
                  <div className="flex justify-end"><Button>Save Changes</Button></div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
