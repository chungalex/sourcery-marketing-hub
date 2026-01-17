import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  SelectItem,
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
  Info
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { QCOptionSelector, QCOptionBadge, type QCOption } from "@/components/orders/QCOptionSelector";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { fetchFactories } from "@/lib/factories";
import type { Factory } from "@/types/database";

const INCOTERMS = [
  { value: "EXW", label: "EXW - Ex Works" },
  { value: "FOB", label: "FOB - Free on Board" },
  { value: "CIF", label: "CIF - Cost, Insurance & Freight" },
  { value: "DDP", label: "DDP - Delivered Duty Paid" },
  { value: "DAP", label: "DAP - Delivered at Place" },
];

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CNY", label: "CNY (¥)" },
];

const orderSchema = z.object({
  factory_id: z.string().min(1, "Please select a factory"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unit_price: z.coerce.number().min(0.01, "Unit price must be greater than 0"),
  currency: z.string().min(1, "Please select a currency"),
  incoterms: z.string().optional(),
  delivery_window_start: z.date().optional(),
  delivery_window_end: z.date().optional(),
  specifications: z.string().optional(),
  tech_pack_url: z.string().url().optional().or(z.literal("")),
  bom_url: z.string().url().optional().or(z.literal("")),
  qc_option: z.enum(["sourcery", "byoqc", "factory"]),
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
  { id: 1, title: "Factory & Product", icon: Building2 },
  { id: 2, title: "Pricing & Delivery", icon: DollarSign },
  { id: 3, title: "Quality Control", icon: Shield },
  { id: 4, title: "Review & Submit", icon: Check },
];

export default function CreateOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loadingFactories, setLoadingFactories] = useState(true);

  const preselectedFactoryId = searchParams.get("factory");

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      factory_id: preselectedFactoryId || "",
      quantity: 0,
      unit_price: 0,
      currency: "USD",
      incoterms: "FOB",
      specifications: "",
      tech_pack_url: "",
      bom_url: "",
      qc_option: "sourcery",
    },
  });

  const watchedValues = form.watch();
  const totalAmount = (watchedValues.quantity || 0) * (watchedValues.unit_price || 0);
  const selectedFactory = factories.find(f => f.id === watchedValues.factory_id);

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please sign in to create an order");
      navigate("/auth?redirect=/orders/create");
    }
  }, [user, authLoading, navigate]);

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

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!watchedValues.factory_id && watchedValues.quantity > 0;
      case 2:
        return watchedValues.unit_price > 0;
      case 3:
        return !!watchedValues.qc_option;
      default:
        return true;
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
        body: {
          action: "create_order",
          factory_id: values.factory_id,
          quantity: values.quantity,
          unit_price: values.unit_price,
          currency: values.currency,
          incoterms: values.incoterms,
          delivery_window_start: values.delivery_window_start?.toISOString(),
          delivery_window_end: values.delivery_window_end?.toISOString(),
          specifications: values.specifications ? { notes: values.specifications } : {},
          tech_pack_url: values.tech_pack_url || null,
          bom_url: values.bom_url || null,
          qc_option: values.qc_option,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to create order");
      }

      toast.success("Order created successfully!");
      navigate("/dashboard");
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
        title="Create Production Order | Sourcery"
        description="Create a new production order with your factory partner."
      />

      <section className="section-padding min-h-[80vh]">
        <div className="container max-w-4xl">
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
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  {/* Step 1: Factory & Product */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          Factory & Product Details
                        </h2>
                        <p className="text-muted-foreground">
                          Select your factory partner and specify product quantity.
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="factory_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Factory</FormLabel>
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
                                {factories.map((factory) => (
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
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity (units)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g. 1000" 
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              />
                            </FormControl>
                            <FormDescription>
                              Total number of units for this production order.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Specifications (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe product details, materials, colors, sizes..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="tech_pack_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tech Pack URL (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="url" 
                                  placeholder="https://..." 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bom_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>BOM URL (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="url" 
                                  placeholder="https://..." 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Pricing & Delivery */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          Pricing & Delivery
                        </h2>
                        <p className="text-muted-foreground">
                          Set pricing terms and delivery expectations.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="unit_price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Price</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="0.00" 
                                    className="pl-9"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CURRENCIES.map((currency) => (
                                    <SelectItem key={currency.value} value={currency.value}>
                                      {currency.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Total Amount Display */}
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Total Order Value</span>
                          <span className="text-2xl font-bold text-foreground">
                            {watchedValues.currency === "EUR" ? "€" : 
                             watchedValues.currency === "GBP" ? "£" : 
                             watchedValues.currency === "CNY" ? "¥" : "$"}
                            {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {watchedValues.quantity.toLocaleString()} units × {watchedValues.currency === "EUR" ? "€" : 
                             watchedValues.currency === "GBP" ? "£" : 
                             watchedValues.currency === "CNY" ? "¥" : "$"}{watchedValues.unit_price.toFixed(2)} per unit
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="incoterms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Incoterms</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select incoterms" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {INCOTERMS.map((term) => (
                                  <SelectItem key={term.value} value={term.value}>
                                    {term.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Defines shipping and delivery responsibilities.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="delivery_window_start"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Delivery Window Start</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
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
                              <FormLabel>Delivery Window End</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => 
                                      date < new Date() || 
                                      (watchedValues.delivery_window_start && date < watchedValues.delivery_window_start)
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Quality Control */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          Quality Control Preference
                        </h2>
                        <p className="text-muted-foreground">
                          Choose how you want quality inspections handled for this order.
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="qc_option"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <QCOptionSelector
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          Review Your Order
                        </h2>
                        <p className="text-muted-foreground">
                          Please review all details before submitting.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Factory */}
                        <div className="p-4 bg-secondary/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            <h4 className="font-medium text-foreground">Factory</h4>
                          </div>
                          <p className="text-foreground">
                            {selectedFactory?.name || "Not selected"}
                          </p>
                          {selectedFactory && (
                            <p className="text-sm text-muted-foreground">
                              {selectedFactory.city}, {selectedFactory.country}
                            </p>
                          )}
                        </div>

                        {/* Product */}
                        <div className="p-4 bg-secondary/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4 text-primary" />
                            <h4 className="font-medium text-foreground">Product Details</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Quantity:</span>
                              <span className="ml-2 text-foreground">{watchedValues.quantity.toLocaleString()} units</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Unit Price:</span>
                              <span className="ml-2 text-foreground">
                                {watchedValues.currency === "EUR" ? "€" : 
                                 watchedValues.currency === "GBP" ? "£" : 
                                 watchedValues.currency === "CNY" ? "¥" : "$"}
                                {watchedValues.unit_price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {watchedValues.specifications && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {watchedValues.specifications}
                            </p>
                          )}
                        </div>

                        {/* Pricing */}
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <h4 className="font-medium text-foreground">Total Order Value</h4>
                          </div>
                          <p className="text-2xl font-bold text-foreground">
                            {watchedValues.currency === "EUR" ? "€" : 
                             watchedValues.currency === "GBP" ? "£" : 
                             watchedValues.currency === "CNY" ? "¥" : "$"}
                            {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            {watchedValues.incoterms && (
                              <p>Incoterms: {watchedValues.incoterms}</p>
                            )}
                            {watchedValues.delivery_window_start && watchedValues.delivery_window_end && (
                              <p>
                                Delivery: {format(watchedValues.delivery_window_start, "MMM d, yyyy")} - {format(watchedValues.delivery_window_end, "MMM d, yyyy")}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* QC Option */}
                        <div className="p-4 bg-secondary/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="h-4 w-4 text-primary" />
                            <h4 className="font-medium text-foreground">Quality Control</h4>
                          </div>
                          <QCOptionBadge option={watchedValues.qc_option} />
                        </div>

                        {/* Info Box */}
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground">
                            This order will be created as a <strong>draft</strong>. You'll be able to upload documents and 
                            issue a formal PO from your dashboard. The factory will need to accept the PO before production begins.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
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
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!canProceed(currentStep)}
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
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
