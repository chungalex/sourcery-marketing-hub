import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Send, 
  Package, 
  Calendar, 
  DollarSign,
  Check,
  Building2,
  LogIn
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface InquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factoryName?: string;
  factoryId?: string;
  factorySlug?: string;
}

const productCategories = [
  "Apparel & Textiles",
  "Footwear",
  "Accessories",
  "Home Goods",
  "Electronics",
  "Packaging",
  "Other"
];

const orderQuantities = [
  "100-500 units",
  "500-1,000 units",
  "1,000-5,000 units",
  "5,000-10,000 units",
  "10,000+ units"
];

const timelines = [
  "ASAP (Rush)",
  "1-2 months",
  "2-3 months",
  "3-6 months",
  "6+ months"
];

interface InquiryDraft {
  productType: string;
  productDescription: string;
  quantity: string;
  timeline: string;
  budget: string;
  name: string;
  email: string;
  company: string;
  message: string;
}

export function InquiryModal({ 
  open, 
  onOpenChange, 
  factoryName = "this factory",
  factoryId,
  factorySlug 
}: InquiryModalProps) {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [productType, setProductType] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [techPackUrl, setTechPackUrl] = useState("");

  const draftKey = factoryId ? `sourcery_inquiry_draft_${factoryId}` : null;

  // Restore draft from localStorage on open
  useEffect(() => {
    if (open && draftKey) {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        try {
          const draft: InquiryDraft = JSON.parse(saved);
          setProductType(draft.productType || "");
          setProductDescription(draft.productDescription || "");
          setQuantity(draft.quantity || "");
          setTimeline(draft.timeline || "");
          setBudget(draft.budget || "");
          setName(draft.name || "");
          setEmail(draft.email || "");
          setCompany(draft.company || "");
          setMessage(draft.message || "");
          localStorage.removeItem(draftKey); // Clear after restore
        } catch (e) {
          console.error("Failed to restore draft:", e);
        }
      }
    }
  }, [open, draftKey]);

  // Autofill email from authenticated user
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const resetForm = () => {
    setStep(1);
    setIsSuccess(false);
    setProductType("");
    setProductDescription("");
    setQuantity("");
    setTimeline("");
    setBudget("");
    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetForm, 300);
  };

  const saveDraftAndRedirect = () => {
    if (draftKey) {
      const draft: InquiryDraft = {
        productType,
        productDescription,
        quantity,
        timeline,
        budget,
        name,
        email,
        company,
        message
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }
    
    const redirectPath = factorySlug ? `/directory/${factorySlug}` : '/directory';
    navigate(`/auth?mode=login&redirect=${encodeURIComponent(redirectPath)}`);
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    // Check authentication
    if (!user) {
      saveDraftAndRedirect();
      return;
    }

    if (!factoryId) {
      toast.error("Factory information is missing");
      return;
    }

    setIsSubmitting(true);

    // Format message consistently for future parsing
    const formattedMessage = `Product Type: ${productType}
Description: ${productDescription || "Not specified"}
Quantity: ${quantity}
Timeline: ${timeline}
Budget: ${budget || "Not specified"}
Tech pack: ${techPackUrl || "Not provided"}
Additional Notes: ${message || "None"}`;

    const { error } = await supabase
      .from('inquiries')
      .insert({
        factory_id: factoryId,
        buyer_id: user.id,
        requester_name: name,
        requester_email: email,
        message: formattedMessage,
        // Let DB defaults handle: status='new', conversion_status='new'
      });

    setIsSubmitting(false);

    if (error) {
      console.error("Inquiry insert error:", error);
      toast.error("Failed to send inquiry. Please try again.");
      return;
    }

    // Clear draft on success
    if (draftKey) {
      localStorage.removeItem(draftKey);
    }

    setIsSuccess(true);
    toast.success("Inquiry sent successfully!");
  };

  const canProceedStep1 = productType && quantity && timeline;
  const canProceedStep2 = name && email && company;

  // Show login prompt if not authenticated and on step 2
  const showLoginPrompt = !authLoading && !user && step === 2;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Contact {factoryName}
          </DialogTitle>
          <DialogDescription>
            Send an inquiry to discuss your production needs
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-8 text-center"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Inquiry Sent!
              </h3>
              <p className="text-muted-foreground mb-6">
                {factoryName} will review your inquiry and respond within 24-48 hours.
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild>
                  <a href="/dashboard?tab=inquiries">Track in Dashboard</a>
                </Button>
                <Button variant="outline" onClick={handleClose}>Close</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      Product Category
                    </Label>
                    <Select value={productType} onValueChange={setProductType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Description</Label>
                    <Textarea
                      placeholder="Describe your product in detail..."
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tech pack or reference link</Label>
                    <Input
                      placeholder="Google Drive, Dropbox, or any shared link"
                      value={techPackUrl}
                      onChange={(e) => setTechPackUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Sharing your tech pack upfront gets you a more accurate quote.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        Order Quantity
                      </Label>
                      <Select value={quantity} onValueChange={setQuantity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {orderQuantities.map((qty) => (
                            <SelectItem key={qty} value={qty}>
                              {qty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Timeline
                      </Label>
                      <Select value={timeline} onValueChange={setTimeline}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {timelines.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Budget Range (optional)
                    </Label>
                    <Input
                      placeholder="e.g., $5,000 - $10,000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {showLoginPrompt && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <LogIn className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                            Sign in to send your inquiry
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            Your inquiry details will be saved while you sign in.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inquiry-name">Your Name</Label>
                      <Input
                        id="inquiry-name"
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiry-company">Company</Label>
                      <Input
                        id="inquiry-company"
                        placeholder="Acme Inc"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiry-email">Email</Label>
                    <Input
                      id="inquiry-email"
                      type="email"
                      placeholder="john@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={!!user?.email}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiry-message">Additional Message (optional)</Label>
                    <Textarea
                      id="inquiry-message"
                      placeholder="Any specific requirements or questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    {showLoginPrompt ? (
                      <Button onClick={saveDraftAndRedirect}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In to Send
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmit}
                        disabled={!canProceedStep2 || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Inquiry
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
