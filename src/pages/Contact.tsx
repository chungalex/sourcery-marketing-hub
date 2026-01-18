import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, CheckCircle, Search, ClipboardCheck, Rocket } from "lucide-react";

type FormType = "sourcing" | "factory" | "call" | "general" | "enterprise" | "consulting";

type ConsultingService = "factory-sourcing" | "supply-chain-audit" | "launch-strategy";

const consultingServices: Record<ConsultingService, { title: string; description: string; price: string; icon: typeof Search }> = {
  "factory-sourcing": {
    title: "Factory Sourcing",
    description: "Find, vet, and negotiate with factories matched to your needs",
    price: "From $2,500",
    icon: Search,
  },
  "supply-chain-audit": {
    title: "Supply Chain Audit",
    description: "Comprehensive review of current suppliers with improvement recommendations",
    price: "From $1,500",
    icon: ClipboardCheck,
  },
  "launch-strategy": {
    title: "Launch Strategy",
    description: "End-to-end production planning for new product launches",
    price: "From $3,500",
    icon: Rocket,
  },
};

const formConfigs: Record<FormType, { title: string; description: string }> = {
  sourcing: {
    title: "Request Sourcing",
    description: "Tell us about your product and we'll match you with vetted factories within 48 hours.",
  },
  factory: {
    title: "Factory Application",
    description: "Apply to join our vetted factory network and connect with quality-focused brands.",
  },
  call: {
    title: "Book a Call",
    description: "Schedule a consultation with our sourcing team to discuss your needs.",
  },
  enterprise: {
    title: "Enterprise Inquiry",
    description: "Let's discuss custom solutions for your high-volume manufacturing needs.",
  },
  consulting: {
    title: "Consulting Services",
    description: "Work directly with our sourcing experts on your specific manufacturing challenge.",
  },
  general: {
    title: "Contact Us",
    description: "Have a question? We'd love to hear from you. Send us a message and we'll respond within 24 hours.",
  },
};

const budgetRanges = [
  { value: "2500-5000", label: "$2,500 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000-25000", label: "$10,000 - $25,000" },
  { value: "25000+", label: "$25,000+" },
];

const timelines = [
  { value: "urgent", label: "Urgent (< 2 weeks)" },
  { value: "1-2-months", label: "1-2 months" },
  { value: "3-months", label: "3+ months" },
  { value: "flexible", label: "Flexible" },
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [formType, setFormType] = useState<FormType>("general");
  const [selectedService, setSelectedService] = useState<ConsultingService | "">("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const type = searchParams.get("type") as FormType;
    const service = searchParams.get("service") as ConsultingService;
    
    if (type && formConfigs[type]) {
      setFormType(type);
    }
    
    if (service && consultingServices[service]) {
      setSelectedService(service);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Message sent!",
      description: formType === "consulting" 
        ? "A consultant will reach out within 24 hours to discuss your project."
        : "We'll get back to you within 24 hours.",
    });
  };

  const config = formConfigs[formType];
  const selectedServiceData = selectedService ? consultingServices[selectedService] : null;

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {config.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {config.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a href="mailto:hello@sourcery.com" className="text-muted-foreground hover:text-primary transition-colors">
                      hello@sourcery.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a href="tel:+1-555-123-4567" className="text-muted-foreground hover:text-primary transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Headquarters</p>
                    <p className="text-muted-foreground">
                      123 Manufacturing Way<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Type Selector */}
              <div className="mt-10 pt-10 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Looking for something specific?</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(formConfigs) as FormType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFormType(type);
                        setIsSubmitted(false);
                        if (type !== "consulting") {
                          setSelectedService("");
                        }
                      }}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        formType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {formConfigs[type].title}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {isSubmitted ? (
                <div className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                    Thank You!
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    {formType === "consulting"
                      ? "A consultant will reach out within 24 hours to discuss your project."
                      : "We've received your message and will get back to you within 24 hours."}
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" required placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" required placeholder="Doe" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required placeholder="john@company.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="company">Company *</Label>
                    <Input id="company" name="company" required placeholder="Your Company" />
                  </div>

                  {/* Consulting-specific fields */}
                  {formType === "consulting" && (
                    <>
                      <div className="space-y-2 mt-6">
                        <Label htmlFor="service">Service Type *</Label>
                        <Select 
                          value={selectedService} 
                          onValueChange={(value) => setSelectedService(value as ConsultingService)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a consulting service" />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.entries(consultingServices) as [ConsultingService, typeof consultingServices[ConsultingService]][]).map(([key, service]) => {
                              const Icon = service.icon;
                              return (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-primary" />
                                    <span>{service.title}</span>
                                    <span className="text-muted-foreground text-xs ml-auto">{service.price}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        {selectedServiceData && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {selectedServiceData.description}
                          </p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="budget">Project Budget</Label>
                          <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              {budgetRanges.map((range) => (
                                <SelectItem key={range.value} value={range.value}>
                                  {range.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeline">Timeline *</Label>
                          <Select value={selectedTimeline} onValueChange={setSelectedTimeline} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              {timelines.map((timeline) => (
                                <SelectItem key={timeline.value} value={timeline.value}>
                                  {timeline.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {(formType === "sourcing" || formType === "enterprise") && (
                    <>
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="productCategory">Product Category *</Label>
                          <Input id="productCategory" name="productCategory" required placeholder="e.g., Apparel, Home Goods" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estimatedVolume">Estimated Annual Volume</Label>
                          <Input id="estimatedVolume" name="estimatedVolume" placeholder="e.g., 10,000 units" />
                        </div>
                      </div>
                      <div className="space-y-2 mt-6">
                        <Label htmlFor="targetPrice">Target Price Range</Label>
                        <Input id="targetPrice" name="targetPrice" placeholder="e.g., $5-10 per unit" />
                      </div>
                    </>
                  )}

                  {formType === "factory" && (
                    <>
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="factoryLocation">Factory Location *</Label>
                          <Input id="factoryLocation" name="factoryLocation" required placeholder="City, Country" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialization">Specialization *</Label>
                          <Input id="specialization" name="specialization" required placeholder="e.g., Knitwear, Furniture" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="capacity">Monthly Capacity</Label>
                          <Input id="capacity" name="capacity" placeholder="e.g., 50,000 units" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="certifications">Certifications</Label>
                          <Input id="certifications" name="certifications" placeholder="e.g., BSCI, SEDEX" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="message">
                      {formType === "factory" 
                        ? "Tell us about your factory *" 
                        : formType === "consulting"
                        ? "Describe your current situation and goals *"
                        : "Message *"}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder={
                        formType === "sourcing"
                          ? "Describe your product, requirements, timeline, and any specific factory preferences..."
                          : formType === "factory"
                          ? "Tell us about your factory's history, capabilities, key clients, and what makes you unique..."
                          : formType === "consulting"
                          ? "What's your current manufacturing challenge? What have you tried so far? What does success look like?"
                          : "How can we help you?"
                      }
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full mt-8" disabled={isSubmitting}>
                    {isSubmitting 
                      ? "Sending..." 
                      : formType === "consulting"
                      ? "Request Consultation"
                      : "Send Message"}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
