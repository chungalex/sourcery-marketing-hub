import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSignature, Download, Copy, CheckCircle, ArrowRight, ArrowLeft, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContractData {
  contractType: string;
  buyerName: string;
  buyerCompany: string;
  supplierName: string;
  supplierCompany: string;
  productDescription: string;
  quantity: string;
  unitPrice: string;
  deliveryDate: string;
  paymentTerms: string;
  qualityStandards: string;
  clauses: string[];
}

const contractTypes = [
  { id: "purchase", label: "Purchase Order Agreement" },
  { id: "manufacturing", label: "Manufacturing Agreement" },
  { id: "nda", label: "Non-Disclosure Agreement" },
  { id: "quality", label: "Quality Assurance Agreement" },
];

const clauseOptions = [
  { id: "warranty", label: "Product Warranty (12 months)" },
  { id: "ip", label: "Intellectual Property Protection" },
  { id: "exclusivity", label: "Exclusivity Clause" },
  { id: "penalties", label: "Late Delivery Penalties" },
  { id: "inspection", label: "Third-Party Inspection Rights" },
  { id: "cancellation", label: "Order Cancellation Terms" },
];

const paymentOptions = [
  { id: "30_70", label: "30% Deposit, 70% Before Shipment" },
  { id: "50_50", label: "50% Deposit, 50% Before Shipment" },
  { id: "lc", label: "Letter of Credit" },
  { id: "net30", label: "Net 30 Days" },
  { id: "net60", label: "Net 60 Days" },
];

export function ContractGenerator({ className }: { className?: string }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContractData>({
    contractType: "",
    buyerName: "",
    buyerCompany: "",
    supplierName: "",
    supplierCompany: "",
    productDescription: "",
    quantity: "",
    unitPrice: "",
    deliveryDate: "",
    paymentTerms: "",
    qualityStandards: "",
    clauses: [],
  });

  const updateForm = (field: keyof ContractData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleClause = (clauseId: string) => {
    setFormData((prev) => ({
      ...prev,
      clauses: prev.clauses.includes(clauseId)
        ? prev.clauses.filter((c) => c !== clauseId)
        : [...prev.clauses, clauseId],
    }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const contractType = contractTypes.find((t) => t.id === formData.contractType)?.label || "Agreement";
      const selectedClauses = clauseOptions.filter((c) => formData.clauses.includes(c.id));
      
      setGeneratedContract(`
${contractType.toUpperCase()}

This Agreement is entered into as of ${new Date().toLocaleDateString()} between:

BUYER:
${formData.buyerName}
${formData.buyerCompany}

SUPPLIER:
${formData.supplierName}
${formData.supplierCompany}

1. PRODUCT DESCRIPTION
${formData.productDescription}

2. QUANTITY AND PRICING
Quantity: ${formData.quantity} units
Unit Price: $${formData.unitPrice}
Total Value: $${(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toLocaleString()}

3. DELIVERY
Expected Delivery Date: ${formData.deliveryDate}

4. PAYMENT TERMS
${paymentOptions.find((p) => p.id === formData.paymentTerms)?.label || formData.paymentTerms}

5. QUALITY STANDARDS
${formData.qualityStandards}

6. ADDITIONAL TERMS
${selectedClauses.map((c, i) => `${i + 1}. ${c.label}`).join("\n")}

7. GOVERNING LAW
This Agreement shall be governed by international trade law standards.

8. SIGNATURES

_______________________          _______________________
Buyer                            Supplier
Date: _______________           Date: _______________
      `);
      setIsGenerating(false);
      setStep(4);
    }, 2000);
  };

  const handleCopy = () => {
    if (generatedContract) {
      navigator.clipboard.writeText(generatedContract);
      toast({
        title: "Copied to clipboard",
        description: "Contract has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-primary" />
            Contract Builder
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate standardized supplier agreements
          </p>
        </CardHeader>
        <CardContent>
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s === step
                      ? "bg-primary text-primary-foreground"
                      : s < step
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-8 h-0.5 ${s < step ? "bg-green-500" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="font-semibold text-foreground">Parties Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Buyer Details</h4>
                    <div className="space-y-2">
                      <Label htmlFor="buyerName">Contact Name</Label>
                      <Input
                        id="buyerName"
                        value={formData.buyerName}
                        onChange={(e) => updateForm("buyerName", e.target.value)}
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyerCompany">Company Name</Label>
                      <Input
                        id="buyerCompany"
                        value={formData.buyerCompany}
                        onChange={(e) => updateForm("buyerCompany", e.target.value)}
                        placeholder="Acme Fashion Inc."
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Supplier Details</h4>
                    <div className="space-y-2">
                      <Label htmlFor="supplierName">Contact Name</Label>
                      <Input
                        id="supplierName"
                        value={formData.supplierName}
                        onChange={(e) => updateForm("supplierName", e.target.value)}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplierCompany">Factory Name</Label>
                      <Input
                        id="supplierCompany"
                        value={formData.supplierCompany}
                        onChange={(e) => updateForm("supplierCompany", e.target.value)}
                        placeholder="Sunrise Textiles"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="font-semibold text-foreground">Order Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractType">Contract Type</Label>
                    <Select
                      value={formData.contractType}
                      onValueChange={(v) => updateForm("contractType", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        {contractTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Product Description</Label>
                    <Textarea
                      id="productDescription"
                      value={formData.productDescription}
                      onChange={(e) => updateForm("productDescription", e.target.value)}
                      placeholder="Describe the products covered by this agreement..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => updateForm("quantity", e.target.value)}
                        placeholder="5000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice">Unit Price (USD)</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        value={formData.unitPrice}
                        onChange={(e) => updateForm("unitPrice", e.target.value)}
                        placeholder="12.50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryDate">Delivery Date</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => updateForm("deliveryDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms">Payment Terms</Label>
                      <Select
                        value={formData.paymentTerms}
                        onValueChange={(v) => updateForm("paymentTerms", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="font-semibold text-foreground">Terms & Clauses</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="qualityStandards">Quality Standards</Label>
                    <Textarea
                      id="qualityStandards"
                      value={formData.qualityStandards}
                      onChange={(e) => updateForm("qualityStandards", e.target.value)}
                      placeholder="Specify quality requirements, acceptable defect rates, testing requirements..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Additional Clauses</Label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {clauseOptions.map((clause) => (
                        <div
                          key={clause.id}
                          className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => toggleClause(clause.id)}
                        >
                          <Checkbox
                            checked={formData.clauses.includes(clause.id)}
                            onCheckedChange={() => toggleClause(clause.id)}
                          />
                          <label className="text-sm cursor-pointer">{clause.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {isGenerating ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Generating your contract...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Generated Contract</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-6 max-h-[400px] overflow-y-auto">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                        {generatedContract}
                      </pre>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep(1);
                        setGeneratedContract(null);
                      }}
                    >
                      Create Another Contract
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleGenerate}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Contract
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
