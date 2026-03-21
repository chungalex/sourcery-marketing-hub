import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardCheck, 
  FileText, 
  Video, 
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type AuditType = "document" | "virtual" | "onsite";

interface AuditOption {
  type: AuditType;
  label: string;
  description: string;
  duration: string;
  price: string;
  icon: typeof FileText;
  includes: string[];
}

const auditOptions: AuditOption[] = [
  {
    type: "document",
    label: "Document Review",
    description: "Remote verification of business documents and certifications",
    duration: "Standard turnaround",
    price: "Free",
    icon: FileText,
    includes: [
      "Business registration verification",
      "Certification validation",
      "Insurance document review",
      "Compliance check"
    ]
  },
  {
    type: "virtual",
    label: "Virtual Tour",
    description: "Live video walkthrough of factory facilities",
    duration: "1-2 hours",
    price: "$150",
    icon: Video,
    includes: [
      "Live facility walkthrough",
      "Equipment inspection",
      "Q&A with management",
      "Recording provided",
      "Written summary report"
    ]
  },
  {
    type: "onsite",
    label: "On-Site Audit",
    description: "Comprehensive in-person factory audit by third-party inspector",
    duration: "1-2 days",
    price: "From $800",
    icon: MapPin,
    includes: [
      "Full facility inspection",
      "Production process review",
      "Quality systems audit",
      "Worker interviews",
      "Detailed audit report",
      "Corrective action plan",
      "Photo documentation"
    ]
  }
];

interface AuditRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factoryName?: string;
}

export function AuditRequestModal({ 
  open, 
  onOpenChange,
  factoryName = "Coastal Swim Manufacturing"
}: AuditRequestModalProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<AuditType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedOption = auditOptions.find(o => o.type === selectedType);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Audit request submitted!");
    }, 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setSelectedType(null);
      setSelectedDate("");
      setAdditionalNotes("");
      setIsSuccess(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            Request Factory Audit
          </DialogTitle>
          <DialogDescription>
            {factoryName}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                Request Submitted!
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                We'll coordinate with the factory and get back to you within 24 hours 
                to confirm the {selectedOption?.label.toLowerCase()}.
              </p>
              <Button onClick={handleClose}>Done</Button>
            </motion.div>
          ) : (
            <>
              {/* Step 1: Select Audit Type */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted-foreground">
                    Choose the type of audit you need:
                  </p>

                  <div className="space-y-3">
                    {auditOptions.map((option) => (
                      <div
                        key={option.type}
                        onClick={() => setSelectedType(option.type)}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all",
                          selectedType === option.type
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            selectedType === option.type
                              ? "bg-primary/20"
                              : "bg-muted"
                          )}>
                            <option.icon className={cn(
                              "w-5 h-5",
                              selectedType === option.type
                                ? "text-primary"
                                : "text-muted-foreground"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-foreground">
                                {option.label}
                              </h4>
                              <Badge variant={option.price === "Free" ? "secondary" : "outline"}>
                                {option.price}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {option.description}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {option.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => setStep(2)}
                      disabled={!selectedType}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Details */}
              {step === 2 && selectedOption && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Selected Option Summary */}
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <selectedOption.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{selectedOption.label}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {selectedOption.duration}
                          <span className="mx-1">•</span>
                          <DollarSign className="w-3.5 h-3.5" />
                          {selectedOption.price}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Includes:</p>
                      <ul className="space-y-1">
                        {selectedOption.includes.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Scheduling */}
                  {selectedType !== "document" && (
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 bg-muted rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  )}

                  {/* Additional Notes */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Additional Notes (optional)
                    </label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Any specific areas you'd like us to focus on..."
                      rows={3}
                      className="w-full p-3 bg-muted rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>

                  {/* Pricing Info */}
                  {selectedOption.price !== "Free" && (
                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Note:</strong> Payment will be collected after 
                        the audit is confirmed. You'll receive a detailed quote based on your specific requirements.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting || (selectedType !== "document" && !selectedDate)}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Request
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
