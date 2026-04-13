import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MilestoneBuilder, type Milestone } from "@/components/orders/MilestoneBuilder";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  ArrowLeft,
  ArrowRight,
  Building2,
  Package,
  DollarSign,
  CalendarIcon,
  FileText,
  Shield,
  Check,
  Loader2,
  Info,
  UserPlus,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { QCOptionSelector, QCOptionBadge, type QCOption } from "@/components/orders/QCOptionSelector";
import { TechPackGuidance } from "@/components/orders/TechPackGuidance";
import { getCategoryLeadTime, getGuidanceMode } from "@/components/onboarding/ExperienceQuiz";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { fetchFactories } from "@/lib/factories";
import { useOrders } from "@/hooks/useOrders";
import type { Factory } from "@/types/database";

const INCOTERMS = [
  {
    value: "EXW",
    label: "EXW - Ex Works",
    guidance: "Factory hands over goods at their premises. You arrange and pay for all shipping, insurance, and export. Maximum responsibility on the buyer — only use if you have a freight forwarder.",
  },
  {
    value: "FOB",
    label: "FOB - Free on Board",
    guidance: "Factory delivers goods to the named port and handles export clearance. You pay for ocean freight, insurance, and import. Most common for brands sourcing from Asia. Recommended starting point.",
  },
  {
    value: "CIF",
    label: "CIF - Cost, Insurance & Freight",
    guidance: "Factory pays for freight and insurance to the destination port. You handle import clearance and last-mile delivery. Less visibility into shipping costs — compare rates before agreeing.",
  },
  {
    value: "DDP",
    label: "DDP - Delivered Duty Paid",
    guidance: "Factory delivers to your door, handles everything including import duties. Highest cost but lowest complexity. Good for first orders where you want to minimise logistics management.",
  },
  {
    value: "DAP",
    label: "DAP - Delivered at Place",
    guidance: "Factory delivers to your named location but you handle import duties and taxes. Simpler than EXW, less expensive than DDP.",
  },
];

const AQL_STANDARDS = [
  {
    value: "1.0",
    label: "AQL 1.0 — Critical",
    guidance: "Strictest standard. Only 1% of sampled units can have defects. Use for high-value goods, medical-adjacent products, or any product where defects are unacceptable.",
  },
  {
    value: "2.5",
    label: "AQL 2.5 — Standard",
    guidance: "Industry standard for most apparel and consumer goods. 2.5% defect tolerance on a statistical sample. Recommended for most orders unless you have specific quality requirements.",
  },
  {
    value: "4.0",
    label: "AQL 4.0 — Relaxed",
    guidance: "More tolerant standard — 4% defect rate acceptable. Suitable for established factory relationships with strong track records, or lower-risk product categories.",
  },
];

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "EUR — Euro (€)", symbol: "€" },
  { value: "GBP", label: "GBP — British Pound (£)", symbol: "£" },
  { value: "CNY", label: "CNY — Chinese Yuan (¥)", symbol: "¥" },
  { value: "VND", label: "VND — Vietnamese Dong (₫)", symbol: "₫" },
  { value: "JPY", label: "JPY — Japanese Yen (¥)", symbol: "¥" },
  { value: "KRW", label: "KRW — Korean Won (₩)", symbol: "₩" },
  { value: "AUD", label: "AUD — Australian Dollar (A$)", symbol: "A$" },
  { value: "CAD", label: "CAD — Canadian Dollar (C$)", symbol: "C$" },
  { value: "SGD", label: "SGD — Singapore Dollar (S$)", symbol: "S$" },
  { value: "THB", label: "THB — Thai Baht (฿)", symbol: "฿" },
];

const getCurrencySymbol = (currency: string) => {
  return CURRENCIES.find(c => c.value === currency)?.symbol || "$";
};

const orderSchema = z.object({
  product_name: z.string().min(1, "Give your order a name — e.g. 'SS26 Denim Jacket'"),
  product_category: z.string().min(1, "Select a product category"),
  factory_id: z.string().min(1, "Please select a factory"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").max(1000000, "Quantity seems too high — check your entry"),
  unit_price: z.coerce.number().min(0.01, "Unit price must be greater than 0").max(100000, "Unit price seems too high — check your entry"),
  currency: z.string().min(1, "Please select a currency"),
  incoterms: z.string().optional(),
  delivery_window_start: z.date().optional(),
  delivery_window_end: z.date().optional(),
  specifications: z.string().optional(),
  tech_pack_url: z.string().url().optional().or(z.literal("")),
  bom_url: z.string().url().optional().or(z.literal("")),
  qc_option: z.enum(["sourcery", "byoqc", "factory"]),
  aql_standard: z.enum(["1.0", "2.5", "4.0"]).default("2.5"),
  po_message: z.string().optional(),
  fx_rate_locked: z.string().optional(),
  collection: z.string().optional(),
  colourway_count: z.coerce.number().min(1).max(50).optional(),
  size_range: z.string().optional(),
  shipping_destination: z.string().optional(),
  style_number: z.string().optional(),
  fabric_composition: z.string().optional(),
  fabric_weight: z.string().optional(),
  sample_quantity: z.coerce.number().min(1).max(20).optional(),
  certifications_required: z.string().optional(),
  sample_date: z.string().optional(),
  label_requirements: z.string().optional(),
  packaging_notes: z.string().optional(),
}).refine((data) => {
  if (data.delivery_window_start && data.delivery_window_end) {
    return data.delivery_window_end >= data.delivery_window_start;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["delivery_window_end"],
});

type OrderFormValues = z.infer<typeof orderSchema>;

const steps = [
  { id: 1, title: "The basics", icon: Building2 },
  { id: 2, title: "The spec", icon: FileText },
  { id: 3, title: "The deal", icon: DollarSign },
  { id: 4, title: "Quality & sign-off", icon: Shield },
];

export default function CreateOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { orders } = useOrders();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loadingFactories, setLoadingFactories] = useState(true);

  const preselectedFactoryId = searchParams.get("factory");
  const [prefillDismissed, setPrefillDismissed] = useState(false);
  const guidanceMode = getGuidanceMode(user?.user_metadata || {});
  const userCategory = user?.user_metadata?.primary_category || "";
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "1", label: "Deposit", percentage: 50, release_condition: "On PO acceptance — factory confirms they can produce your order" },
    { id: "2", label: "Final release", percentage: 50, release_condition: "After QC pass — goods meet the agreed standard before final payment" },
  ]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      product_name: "",
      product_category: "",
      factory_id: preselectedFactoryId || "",
      quantity: '' as unknown as number,
      unit_price: '' as unknown as number,
      currency: "USD",
      incoterms: "FOB",
      specifications: "",
      tech_pack_url: "",
      bom_url: "",
      qc_option: "byoqc",
      aql_standard: "2.5",
      po_message: "",
      fx_rate_locked: "",
      collection: "",
      colourway_count: undefined,
      sample_date: undefined,
      packaging_notes: "",
      label_requirements: "",
      size_range: "",
      shipping_destination: "",
    },
  });

  const watchedValues = form.watch();
  const totalAmount = (watchedValues.quantity || 0) * (watchedValues.unit_price || 0);
  const selectedFactory = factories.find(f => f.id === watchedValues.factory_id);

  // Group factories: BYOF (brand's own) vs Sourcery Network
  const byofFactories = factories.filter(f => f.is_byof);
  const networkFactories = factories.filter(f => !f.is_byof);

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please sign in to create an order");
      navigate("/auth?redirect=/orders/create");
    }
  }, [user, authLoading, navigate]);

  const duplicateOrderId = searchParams.get("duplicate");

  // Load factories
  useEffect(() => {
    async function loadFactories() {
      try {
        const data = await fetchFactories();
        setFactories(data);
      } catch (error) {
        console.error("Failed to load factories:", error);
        toast.error("Failed to load factories");
      } finally {
        setLoadingFactories(false);
      }
    }
    if (user) {
      loadFactories();
    }
  }, [user]);

  // Prefill from duplicate order
  useEffect(() => {
    if (!duplicateOrderId || !user) return;
    supabase
      .from("orders")
      .select("*, factories(id, name)")
      .eq("id", duplicateOrderId)
      .single()
      .then(({ data }: any) => {
        if (!data) return;
        const specs = data.specifications as any;
        if (specs?.product_name) form.setValue("product_name", specs.product_name + " (copy)");
        if (specs?.product_category) form.setValue("product_category", specs.product_category);
        if (data.factory_id) form.setValue("factory_id", data.factory_id);
        if (data.unit_price) form.setValue("unit_price", data.unit_price);
        if (data.currency) form.setValue("currency", data.currency);
        if (data.incoterms) form.setValue("incoterms", data.incoterms);
        if (data.quantity) form.setValue("quantity", data.quantity);
        if (specs?.notes) form.setValue("specifications", specs.notes);
        toast.success("Order details prefilled from previous order — update as needed.");
      });
  }, [duplicateOrderId, user]);

  // Prefill from RFQ quote conversion
  useEffect(() => {
    const rfqTitle = searchParams.get("rfq_title");
    const rfqCategory = searchParams.get("rfq_category");
    const prefillPrice = searchParams.get("prefill_price");
    const prefillCurrency = searchParams.get("prefill_currency");

    if (rfqTitle) {
      form.setValue("product_name", rfqTitle);
      toast.success("Order prefilled from RFQ quote — review and update as needed.");
    }
    if (rfqCategory) form.setValue("product_category", rfqCategory);
    if (prefillPrice) form.setValue("unit_price", parseFloat(prefillPrice));
    if (prefillCurrency) form.setValue("currency", prefillCurrency);
  }, []);

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1: return !!watchedValues.product_name?.trim() && !!watchedValues.factory_id;
      case 2: return true; // specs all optional
      case 3: return watchedValues.quantity > 0 && watchedValues.unit_price > 0;
      case 4: return !!watchedValues.qc_option;
      default: return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && canProceed(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = async (values: OrderFormValues) => {
    if (!user) {
      toast.error("Please sign in to create an order");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No session found");
      }

      const response = await supabase.functions.invoke("order-action", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          action: "create_order",
          factory_id: values.factory_id,
          quantity: values.quantity,
          unit_price: values.unit_price,
          currency: values.currency,
          incoterms: values.incoterms,
          delivery_window_start: values.delivery_window_start?.toISOString(),
          delivery_window_end: values.delivery_window_end?.toISOString(),
          specifications: {
            product_name: values.product_name,
            collection: values.collection || null,
            product_category: values.product_category || null,
            style_number: values.style_number || null,
            fabric_composition: values.fabric_composition || null,
            fabric_weight: values.fabric_weight || null,
            colourway_count: values.colourway_count || null,
            size_range: values.size_range || null,
            shipping_destination: values.shipping_destination || null,
            sample_quantity: values.sample_quantity || null,
            label_requirements: values.label_requirements || null,
            packaging_notes: values.packaging_notes || null,
            notes: values.specifications || "",
          },
          tech_pack_url: values.tech_pack_url || null,
          bom_url: values.bom_url || null,
          po_message: values.po_message || null,
          fx_rate_locked: values.currency !== "USD" ? `1 ${values.currency} = ${
            values.currency === "VND" ? "0.000040" :
            values.currency === "CNY" ? "0.138" :
            values.currency === "EUR" ? "1.08" :
            values.currency === "GBP" ? "1.27" : "1.00"
          } USD (locked at order creation)` : null,
          sample_date: values.sample_date || null,
          packaging_notes: values.packaging_notes || null,
          label_requirements: values.label_requirements || null,
          qc_option: values.qc_option,
          milestones: milestones.map(m => ({
            label: m.label,
            percentage: m.percentage,
            amount: m.amount || (totalAmount * m.percentage / 100),
            release_condition: m.release_condition || null,
          })),
          qc_standard: {
            aql: values.aql_standard,
            defect_threshold_percent: parseFloat(values.aql_standard),
            tolerance_ranges: {},
            allowed_remedies: ["rework", "remake", "discount"],
          },
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to create order");
      }

      const orderId = response.data?.order_id;
      toast.success("Order created. Review and issue the PO when ready.");
      navigate(orderId ? `/orders/${orderId}` : "/dashboard");
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error(error.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="New order — Sourcery"
        description="Start a new order. Spec, factory, milestones, QC — all in one place."
      />

      <section className="section-padding min-h-[80vh]">
        <div className="container max-w-4xl px-4 sm:px-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => isComplete && setCurrentStep(step.id)}
                      disabled={!isComplete}
                      className={cn(
                        "flex flex-col items-center gap-2 transition-all",
                        isComplete && "cursor-pointer",
                        !isComplete && "cursor-default"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all",
                        isActive && "border-primary bg-primary text-primary-foreground",
                        isComplete && "border-primary bg-primary/10 text-primary",
                        !isActive && !isComplete && "border-muted bg-muted text-muted-foreground"
                      )}>
                        {isComplete ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span className={cn(
                        "text-xs font-medium hidden sm:block",
                        isActive && "text-foreground",
                        !isActive && "text-muted-foreground"
                      )}>
                        {step.title}
                      </span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "h-0.5 w-8 sm:w-16 lg:w-24 mx-2 transition-colors",
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8">
                  {/* Step 1: Product & Factory */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">What are you making, and who's producing it?</h2>
                        <p className="text-muted-foreground text-sm">
                          This becomes the record both you and your factory work from.
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {[
                            { n: "2", label: "Specs & tech pack" },
                            { n: "3", label: "Pricing & delivery" },
                            { n: "4", label: "QC & compliance" },
                          ].map(s => (
                            <span key={s.n} className="text-xs px-2.5 py-1 rounded-full border border-border bg-secondary/50 text-muted-foreground">
                              <span className="font-semibold text-foreground mr-1">{s.n}</span>{s.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Product name */}
                      <FormField
                        control={form.control}
                        name="product_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What's this order called?</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. SS26 Denim Jacket, FW25 Hoodie — 300 units"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">You'll recognise it in 6 months. Your factory sees this too.</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Collection / season */}
                      <FormField
                        control={form.control}
                        name="collection"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Collection / season</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. SS26, FW25, Holiday 2026" {...field} />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">Groups this order on your dashboard. Visible to the factory.</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                                            <FormField
                        control={form.control}
                        name="factory_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Factory <span className="text-rose-500">*</span></FormLabel>
                            {/* BYOF invite prompt — shown when brand has no own factories yet */}
                            {/* Smart prefill from previous orders */}
                            {!prefillDismissed && watchedValues.factory_id && (() => {
                              const lastOrder = orders
                                .filter(o => o.factories?.id === watchedValues.factory_id && ["closed", "shipped"].includes(o.status))
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                              if (!lastOrder) return null;
                              const specs = lastOrder as any;
                              return (
                                <div className="mb-3 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-primary mb-0.5">Prefill from last order</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      Your last completed order with {lastOrder.factories?.name} was {lastOrder.currency} {lastOrder.unit_price}/unit, {lastOrder.quantity.toLocaleString()} units.
                                    </p>
                                    <button
                                      type="button"
                                      className="text-xs text-primary hover:underline font-medium mt-1"
                                      onClick={() => {
                                        form.setValue("unit_price", lastOrder.unit_price);
                                        form.setValue("currency", lastOrder.currency);
                                        setPrefillDismissed(true);
                                      }}
                                    >
                                      Apply pricing from last order →
                                    </button>
                                  </div>
                                  <button type="button" onClick={() => setPrefillDismissed(true)} className="text-muted-foreground hover:text-foreground text-xs flex-shrink-0">✕</button>
                                </div>
                              );
                            })()}

                            {!loadingFactories && byofFactories.length === 0 && (
                              <div className="flex items-start gap-3 p-3 rounded-lg border border-dashed border-border bg-muted/30 mb-3">
                                <UserPlus className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-foreground">No factories on your account yet.</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Invite yours in 30 seconds, or pick one from our network below.
                                  </p>
                                  <Link
                                    to="/dashboard"
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5 font-medium"
                                  >
                                    <UserPlus className="h-3 w-3" />
                                    Invite a factory
                                  </Link>
                                </div>
                              </div>
                            )}
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={loadingFactories}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={loadingFactories ? "Loading factories..." : "Select a factory"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* Your Factories — BYOF */}
                                {byofFactories.length > 0 && (
                                  <SelectGroup>
                                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                      Your Factories
                                    </SelectLabel>
                                    {byofFactories.map((factory) => (
                                      <SelectItem key={factory.id} value={factory.id}>
                                        <div className="flex items-center gap-2">
                                          <Building2 className="h-4 w-4 text-primary" />
                                          <span>{factory.name}</span>
                                          <span className="text-muted-foreground">
                                            — {factory.city}, {factory.country}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                )}

                                {/* Separator between groups if both have entries */}
                                {byofFactories.length > 0 && networkFactories.length > 0 && (
                                  <SelectSeparator />
                                )}

                                {/* Sourcery Network */}
                                {networkFactories.length > 0 && (
                                  <SelectGroup>
                                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                      Sourcery Network
                                    </SelectLabel>
                                    {networkFactories.map((factory) => (
                                      <SelectItem key={factory.id} value={factory.id}>
                                        <div className="flex items-center gap-2">
                                          <Building2 className="h-4 w-4 text-muted-foreground" />
                                          <span>{factory.name}</span>
                                          <span className="text-muted-foreground">
                                            — {factory.city}, {factory.country}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                )}

                                {/* Empty state if no factories at all */}
                                {!loadingFactories && factories.length === 0 && (
                                  <div className="py-6 text-center text-sm text-muted-foreground">
                                    No factories available yet.
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                            {selectedFactory && (
                              <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2 sm:gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Building2 className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-foreground">{selectedFactory.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {selectedFactory.city ? `${selectedFactory.city}, ` : ""}{selectedFactory.country}
                                    {selectedFactory.moq_min ? ` · MOQ ${selectedFactory.moq_min.toLocaleString()} units` : ""}
                                    {selectedFactory.lead_time_weeks ? ` · ${selectedFactory.lead_time_weeks} week lead time` : ""}
                                  </p>
                                  {selectedFactory.is_byof && (
                                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mt-1 font-medium">Your factory</span>
                                  )}
                                </div>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                                          </div>
                  )}

                  {/* Step 2: Specifications */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">The spec</h2>
                        <p className="text-muted-foreground text-sm">
                          Everything your factory needs to make it right. The more precise this is, the less back-and-forth later.
                        </p>
                      </div>

                      {/* Style number */}
                      <FormField
                        control={form.control}
                        name="style_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Style / reference number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. OKS26-001 — used on all documents, labels, and packaging" {...field} />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">The factory will reference this number on their production records. Use your own system.</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Fabric */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fabric_composition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fabric composition</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 98% cotton, 2% elastane" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fabric_weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fabric weight</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 12oz, 280gsm, 180g/m²" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Colourways and size run */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="colourway_count"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Colourways</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  placeholder="e.g. 3"
                                  {...field}
                                  value={field.value || ""}
                                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">Each colourway may require a separate dye lot minimum.</p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="size_range"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Size range</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger><SelectValue placeholder="Select size range" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[
                                    { value: "one_size", label: "One size" },
                                    { value: "xs_xl", label: "XS – XL (5 sizes)" },
                                    { value: "xs_xxl", label: "XS – XXL (6 sizes)" },
                                    { value: "s_xl", label: "S – XL (4 sizes)" },
                                    { value: "s_xxl", label: "S – XXL (5 sizes)" },
                                    { value: "numeric_28_38", label: "Numeric 28–38 (trousers/denim)" },
                                    { value: "custom", label: "Custom sizing" },
                                  ].map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Construction notes */}
                      <FormField
                        control={form.control}
                        name="specifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Construction notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={"Construction: e.g. 5-pocket, chain stitch hem, bar tack at stress points\nTrims: e.g. YKK zipper, corozo buttons, branded label\nFinishes: e.g. garment washed, enzyme treated, embroidery placement\nAny deviations from tech pack or previous season notes."}
                                className="min-h-[120px] text-sm"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">Add anything not covered in your tech pack, or flag differences from a previous order.</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Tech pack and BOM */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="tech_pack_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tech pack</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder="Google Drive, Dropbox, or Notion link" {...field} />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">Paste a shared link. To upload a PDF, do this from the order detail after creating.</p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bom_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bill of materials</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder="Link to BOM — materials, trims, components" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Tech pack guidance */}
                      <TechPackGuidance />

                      {/* Category — optional, last */}
                      <FormField
                        control={form.control}
                        name="product_category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[
                                  { group: "Tops & outerwear", items: [
                                    { value: "tops", label: "Tops — T-shirts, shirts, blouses" },
                                    { value: "hoodies_sweats", label: "Hoodies & sweatshirts" },
                                    { value: "outerwear", label: "Outerwear — jackets, coats" },
                                    { value: "knitwear", label: "Knitwear & sweaters" },
                                    { value: "tailoring", label: "Tailoring & suiting" },
                                  ]},
                                  { group: "Bottoms", items: [
                                    { value: "denim", label: "Denim — jeans, jackets, shorts" },
                                    { value: "trousers", label: "Trousers & shorts" },
                                    { value: "skirts", label: "Skirts & dresses" },
                                  ]},
                                  { group: "Specialist", items: [
                                    { value: "activewear", label: "Activewear & sportswear" },
                                    { value: "swimwear", label: "Swimwear & beachwear" },
                                    { value: "underwear", label: "Underwear & intimates" },
                                    { value: "childrenswear", label: "Childrenswear" },
                                    { value: "workwear", label: "Technical & workwear" },
                                  ]},
                                  { group: "Accessories", items: [
                                    { value: "footwear", label: "Footwear" },
                                    { value: "bags", label: "Bags & leather goods" },
                                    { value: "accessories", label: "Accessories — hats, belts, scarves" },
                                  ]},
                                  { group: "Other", items: [
                                    { value: "home", label: "Home & soft goods" },
                                    { value: "other", label: "Other" },
                                  ]},
                                ].flatMap(group => [
                                  <SelectItem key={group.group} value={`__group_${group.group}`} disabled className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-3 pb-1">{group.group}</SelectItem>,
                                  ...group.items.map(cat => (
                                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                  ))
                                ])}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Commercial Terms */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">Terms</h2>
                        <p className="text-muted-foreground text-sm">
                          Agreed pricing, quantity, and delivery terms. This becomes the formal record both sides confirm.
                        </p>
                      </div>

                      {/* Quantity */}
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 300"
                                {...field}
                                value={field.value || ""}
                                onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">Total units across all sizes and colourways.</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Pricing */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="unit_price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit price <span className="text-xs font-normal text-muted-foreground">— from your factory quote</span></FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 28.00"
                                    className="pl-9"
                                    {...field}
                                    value={field.value || ""}
                                    onFocus={e => { if (!field.value) field.onChange(""); }}
                                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CURRENCIES.map(c => (
                                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Order value */}
                      {totalAmount > 0 && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Order value</span>
                            <span className="text-2xl font-bold text-foreground">
                              {getCurrencySymbol(watchedValues.currency)}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(watchedValues.quantity || 0).toLocaleString()} units × {getCurrencySymbol(watchedValues.currency)}{(watchedValues.unit_price || 0).toFixed(2)} per unit
                          </p>
                        </div>
                      )}

                      {/* Shipping destination */}
                      <FormField
                        control={form.control}
                        name="shipping_destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping destination</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Where are the goods shipping to?" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[
                                  { value: "us", label: "United States" },
                                  { value: "uk", label: "United Kingdom" },
                                  { value: "eu", label: "European Union" },
                                  { value: "au", label: "Australia" },
                                  { value: "ca", label: "Canada" },
                                  { value: "jp", label: "Japan" },
                                  { value: "sg", label: "Singapore" },
                                  { value: "hk", label: "Hong Kong" },
                                  { value: "cn", label: "China" },
                                  { value: "vn", label: "Vietnam" },
                                  { value: "other", label: "Other" },
                                ].map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Affects incoterm guidance and landed cost estimation.</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Incoterms */}
                      <TooltipProvider>
                        <FormField
                          control={form.control}
                          name="incoterms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Incoterms  <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-xs">
                                    <p className="text-xs">Incoterms define who pays for shipping and who is responsible if goods are lost or damaged in transit. FOB is the most common starting point for brands sourcing from Asia.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </FormLabel>
                              {(() => {
                                const selected = INCOTERMS.find(t => t.value === field.value);
                                const [expanded, setExpanded] = React.useState(false);
                                return (
                                  <div className="space-y-2">
                                    {selected && !expanded && (
                                      <div className="p-3 rounded-lg border border-primary bg-primary/5 flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-foreground">{selected.label}</p>
                                          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{selected.guidance}</p>
                                        </div>
                                        <button type="button" onClick={() => setExpanded(true)} className="text-xs text-primary hover:underline flex-shrink-0 font-medium">Change</button>
                                      </div>
                                    )}
                                    {(!selected || expanded) && INCOTERMS.map(term => (
                                      <button
                                        key={term.value}
                                        type="button"
                                        onClick={() => { field.onChange(term.value); setExpanded(false); }}
                                        className={cn("w-full text-left p-3 rounded-lg border transition-all",
                                          field.value === term.value ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                                        )}
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-sm font-medium text-foreground">{term.label}</span>
                                          {field.value === term.value && <span className="text-xs text-primary font-medium">Selected</span>}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{term.guidance}</p>
                                      </button>
                                    ))}
                                  </div>
                                );
                              })()}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TooltipProvider>

                      {/* Delivery window */}
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-400/30">
                          <p className="text-xs font-semibold text-amber-700 mb-1">Lead time guidance</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {(() => {
                              const lt = getCategoryLeadTime(watchedValues.product_category || userCategory);
                              return `${watchedValues.product_category ? (watchedValues.product_category as string).replace(/_/g, " ") : "Standard"} lead time: ${lt.min}–${lt.max} weeks from approved tech pack. ${lt.note}`;
                            })()}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {[12, 16, 20, 24].map(weeks => {
                              const start = new Date(); start.setDate(start.getDate() + weeks * 7 - 14);
                              const end = new Date(); end.setDate(end.getDate() + weeks * 7);
                              return (
                                <button key={weeks} type="button"
                                  onClick={() => { form.setValue("delivery_window_start", start); form.setValue("delivery_window_end", end); }}
                                  className="text-xs px-2.5 py-1 rounded-full border border-border bg-background hover:border-primary/50 hover:text-primary transition-colors"
                                >
                                  {weeks}w from now
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="delivery_window_start"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Delivery from</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date < new Date()} initialFocus />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="delivery_window_end"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Delivery by</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                                      disabled={date => date < new Date() || (watchedValues.delivery_window_start && date < watchedValues.delivery_window_start)}
                                      initialFocus />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Delivery conflict warning */}
                        {watchedValues.delivery_window_end && selectedFactory?.lead_time_weeks && (() => {
                          const weeksUntil = Math.floor((new Date(watchedValues.delivery_window_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7));
                          const lt = selectedFactory.lead_time_weeks;
                          if (weeksUntil < lt) return (
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-400/30">
                              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-amber-700">Timeline may not be achievable</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{selectedFactory.name} typically needs {lt} weeks. Your window is {weeksUntil} weeks away. Confirm availability before issuing the PO.</p>
                              </div>
                            </div>
                          );
                          return null;
                        })()}
                      </div>

                      {/* Payment milestones */}
                      <div className="border-t border-border pt-6">
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-foreground mb-1">Payment milestones</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Define when each payment releases. For first orders or low MOQ, 50/50 is standard. For established relationships at higher volumes, 30/40/30 is common. Nothing releases automatically — each milestone requires your manual approval.
                          </p>
                        </div>
                        <MilestoneBuilder
                          value={milestones}
                          onChange={setMilestones}
                          isPro={false}
                          orderTotal={totalAmount}
                          currency={watchedValues.currency}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Quality, Compliance & Review */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">Quality & sign-off</h2>
                        <p className="text-muted-foreground text-sm">
                          Set the inspection standard and compliance requirements. Then review and send.
                        </p>
                      </div>

                      {/* QC method */}
                      <QCOptionSelector
                        value={watchedValues.qc_option}
                        onChange={val => form.setValue("qc_option", val)}
                      />

                      {/* AQL */}
                      <TooltipProvider>
                        <FormField
                          control={form.control}
                          name="aql_standard"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                AQL quality standard             <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-xs">
                                    <p className="text-xs">AQL (Acceptable Quality Level) defines how many defective units are acceptable in a statistical sample. AQL 2.5 is the industry standard for most apparel.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </FormLabel>
                              <div className="grid grid-cols-3 gap-3 mt-2">
                                {AQL_STANDARDS.map(std => (
                                  <button key={std.value} type="button" onClick={() => field.onChange(std.value)}
                                    className={cn("text-left p-3 rounded-lg border transition-all",
                                      field.value === std.value ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                                    )}
                                  >
                                    <div className="text-sm font-semibold text-foreground mb-1">
                                      AQL {std.value}
                                      {std.value === "2.5" && <span className="ml-2 text-xs text-primary font-normal">Recommended</span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{std.guidance}</p>
                                  </button>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TooltipProvider>

                      {/* Sample requirements */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="sample_date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Target sample date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                      {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={d => field.onChange(d?.toISOString())}
                                    disabled={date => date < new Date()} initialFocus />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="sample_quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Samples required</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} max={20} placeholder="e.g. 3"
                                  {...field}
                                  value={field.value || ""}
                                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">Typically 1–3. Each revision round uses one sample. Budget for 2 if this is a new style.</p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Label & compliance */}
                      <FormField
                        control={form.control}
                        name="label_requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label & compliance requirements</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={"Care labels: e.g. required in English + French for Canada\nCountry of origin: e.g. Made in Vietnam\nCompliance: e.g. CPSC for US, REACH for EU\nCertifications: e.g. GOTS, OEKO-TEX, BSCI"}
                                className="min-h-[100px] text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Packaging */}
                      <FormField
                        control={form.control}
                        name="packaging_notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Packaging requirements</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={"Folding: e.g. flat fold, rolled\nPolybag: e.g. individual polybag, size sticker\nHangtag: e.g. attach hangtag with loop pin\nCarton: e.g. 12 units per carton, double-wall"}
                                className="min-h-[100px] text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Divider */}
                      <div className="border-t border-border pt-4">
                        <p className="text-sm font-semibold text-foreground mb-4">Order summary</p>
                        <div className="space-y-3">
                          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-lg font-bold text-foreground">{watchedValues.product_name || "Unnamed order"}</p>
                            <p className="text-xs text-muted-foreground capitalize mt-0.5">
                              {selectedFactory?.name}{watchedValues.product_category ? ` · ${watchedValues.product_category.replace(/_/g, " ")}` : ""}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-0.5">Quantity</p>
                              <p className="font-semibold text-foreground">{(watchedValues.quantity || 0).toLocaleString()} units</p>
                            </div>
                            <div className="p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-0.5">Order value</p>
                              <p className="font-semibold text-foreground">
                                {getCurrencySymbol(watchedValues.currency)}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </p>
                            </div>
                            <div className="p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-0.5">Incoterms</p>
                              <p className="font-semibold text-foreground">{watchedValues.incoterms || "—"}</p>
                            </div>
                            <div className="p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-0.5">Deliver by</p>
                              <p className="font-semibold text-foreground">{watchedValues.delivery_window_end ? format(watchedValues.delivery_window_end, "MMM d, yyyy") : "—"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message to factory */}
                      <FormField
                        control={form.control}
                        name="po_message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message to factory</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any context or instructions to accompany this PO — construction confirmations, scheduling requests, or questions before they accept."
                                className="min-h-[80px] text-sm"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">Included with the PO. Visible to your factory when they review it.</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* What happens next */}
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">What happens next</p>
                        <div className="space-y-2">
                          {[
                            { n: "1", t: "Order saved as draft — you land on the order page to review everything" },
                            { n: "2", t: "Issue the PO when ready — sends it to your factory for formal acceptance" },
                            { n: "3", t: "Factory accepts and you release the deposit milestone" },
                            { n: "4", t: "Sampling, revisions, QC, and final payment all follow this same record" },
                          ].map(s => (
                            <div key={s.n} className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.n}</span>
                              <span className="text-xs text-muted-foreground leading-relaxed">{s.t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    {currentStep < 4 ? (
                      <div className="flex flex-col items-end gap-1">
                        {!canProceed(currentStep) && currentStep === 1 && (
                          <p className="text-xs text-muted-foreground">
                            {!watchedValues.product_name?.trim() ? "Enter an order name to continue" :
                             !watchedValues.factory_id ? "Select a factory" : ""}
                          </p>
                        )}
                        {!canProceed(currentStep) && currentStep === 3 && (
                          <p className="text-xs text-muted-foreground">
                            {!(watchedValues.quantity > 0) ? "Enter a quantity to continue" : "Enter a unit price to continue"}
                          </p>
                        )}
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={!canProceed(currentStep)}
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="min-w-[140px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Create Order
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </form>
          </Form>
        </div>
      </section>
    </Layout>
  );
}
