import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone,
  Users,
  Factory,
  Award,
  Upload,
  FileText,
  Check,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

/**
 * Factory Application Page
 * 
 * API Endpoints:
 * - POST /api/applications
 *   Request: FormData (multipart)
 *   Response: { applicationId: string, status: "submitted" }
 * 
 * - PUT /api/applications/:id/draft
 *   Request: Partial<ApplicationData>
 *   Response: { success: boolean }
 * 
 * - GET /api/applications/:id
 *   Response: ApplicationData
 */

const steps = [
  { id: 1, title: "Basic Info", icon: Building2 },
  { id: 2, title: "Capabilities", icon: Factory },
  { id: 3, title: "Team", icon: Users },
  { id: 4, title: "Media", icon: Upload },
  { id: 5, title: "Documents", icon: FileText },
  { id: 6, title: "Review", icon: Check },
];

const categories = [
  "Apparel", "Footwear", "Accessories", "Leather Goods", 
  "Textiles", "Knitwear", "Denim", "Activewear"
];

const certifications = [
  "GOTS", "OEKO-TEX", "BSCI", "WRAP", "ISO 9001", 
  "ISO 14001", "Fair Trade", "GRS", "SEDEX"
];

export default function Apply() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    factoryName: "",
    country: "",
    city: "",
    website: "",
    email: "",
    phone: "",
    yearEstablished: "",
    
    // Step 2: Capabilities
    factoryType: "",
    selectedCategories: [] as string[],
    moqMin: "",
    moqMax: "",
    leadTimeWeeks: "",
    description: "",
    
    // Step 3: Team
    totalEmployees: "",
    productionCapacity: "",
    keyContactName: "",
    keyContactRole: "",
    keyContactEmail: "",
    
    // Step 4: Media
    logoFile: null as File | null,
    galleryFiles: [] as File[],
    
    // Step 5: Documents
    selectedCertifications: [] as string[],
    certificationFiles: [] as File[],
    companyProfile: null as File | null,
    
    // Terms
    agreedToTerms: false,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  };

  const toggleCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCertifications: prev.selectedCertifications.includes(cert)
        ? prev.selectedCertifications.filter(c => c !== cert)
        : [...prev.selectedCertifications, cert]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // API Call: POST /api/applications
    // Request: FormData with all form fields and files
    // Application submitted
    
    setTimeout(() => {
      setIsSubmitting(false);
      // On success: show confirmation or redirect
    }, 2000);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <Layout>
      <SEO 
        title="Apply as a Factory | Sourcery" 
        description="Apply to join the Sourcery factory network. Connect with brands managing production on the platform."
      />
      
      <section className="section-padding">
        <div className="container-tight">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join Our Factory Network
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete your application to showcase your manufacturing capabilities 
              to brands managing production through Sourcery.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        currentStep >= step.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs mt-2 text-muted-foreground hidden sm:block">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-2 transition-colors ${
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-foreground">
                      Basic Information
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="factoryName">Factory Name *</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="factoryName"
                            value={formData.factoryName}
                            onChange={(e) => updateFormData("factoryName", e.target.value)}
                            placeholder="Premium Textiles Manufacturing"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="country"
                              value={formData.country}
                              onChange={(e) => updateFormData("country", e.target.value)}
                              placeholder="Portugal"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => updateFormData("city", e.target.value)}
                            placeholder="Porto"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => updateFormData("website", e.target.value)}
                            placeholder="https://yourfactory.com"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Contact Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => updateFormData("email", e.target.value)}
                              placeholder="contact@factory.com"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => updateFormData("phone", e.target.value)}
                              placeholder="+351 123 456 789"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearEstablished">Year Established</Label>
                        <Input
                          id="yearEstablished"
                          value={formData.yearEstablished}
                          onChange={(e) => updateFormData("yearEstablished", e.target.value)}
                          placeholder="1998"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Capabilities */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-foreground">
                      Production Capabilities
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Factory Type *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {["OEM", "ODM", "CMT", "Full Package"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => updateFormData("factoryType", type)}
                              className={`p-3 rounded-lg border-2 transition-all text-sm ${
                                formData.factoryType === type
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Product Categories *</Label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => toggleCategory(category)}
                              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                formData.selectedCategories.includes(category)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="moqMin">Minimum MOQ *</Label>
                          <Input
                            id="moqMin"
                            type="number"
                            value={formData.moqMin}
                            onChange={(e) => updateFormData("moqMin", e.target.value)}
                            placeholder="100"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="moqMax">Maximum MOQ</Label>
                          <Input
                            id="moqMax"
                            type="number"
                            value={formData.moqMax}
                            onChange={(e) => updateFormData("moqMax", e.target.value)}
                            placeholder="10000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="leadTime">Lead Time (weeks) *</Label>
                        <Input
                          id="leadTime"
                          type="number"
                          value={formData.leadTimeWeeks}
                          onChange={(e) => updateFormData("leadTimeWeeks", e.target.value)}
                          placeholder="4"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Factory Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => updateFormData("description", e.target.value)}
                          placeholder="Tell brands about your factory, specializations, and what makes you unique..."
                          rows={4}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Team */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-foreground">
                      Team & Capacity
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="employees">Total Employees *</Label>
                          <Input
                            id="employees"
                            type="number"
                            value={formData.totalEmployees}
                            onChange={(e) => updateFormData("totalEmployees", e.target.value)}
                            placeholder="150"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="capacity">Monthly Capacity (units)</Label>
                          <Input
                            id="capacity"
                            type="number"
                            value={formData.productionCapacity}
                            onChange={(e) => updateFormData("productionCapacity", e.target.value)}
                            placeholder="50000"
                          />
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <h3 className="font-medium text-foreground mb-4">Key Contact Person</h3>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="contactName">Name *</Label>
                              <Input
                                id="contactName"
                                value={formData.keyContactName}
                                onChange={(e) => updateFormData("keyContactName", e.target.value)}
                                placeholder="Maria Silva"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contactRole">Role *</Label>
                              <Input
                                id="contactRole"
                                value={formData.keyContactRole}
                                onChange={(e) => updateFormData("keyContactRole", e.target.value)}
                                placeholder="Sales Director"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactEmail">Email *</Label>
                            <Input
                              id="contactEmail"
                              type="email"
                              value={formData.keyContactEmail}
                              onChange={(e) => updateFormData("keyContactEmail", e.target.value)}
                              placeholder="maria@factory.com"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Media */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-foreground">
                      Media & Gallery
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Factory Logo *</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 2MB
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Factory Gallery</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload photos of your facility, production lines, and sample products
                        </p>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload multiple images
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 5MB each (max 10 images)
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Documents */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-foreground">
                      Certifications & Documents
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Certifications</Label>
                        <div className="flex flex-wrap gap-2">
                          {certifications.map((cert) => (
                            <button
                              key={cert}
                              type="button"
                              onClick={() => toggleCertification(cert)}
                              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all ${
                                formData.selectedCertifications.includes(cert)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              <Award className="h-3 w-3" />
                              {cert}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Upload Certification Documents</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Upload certification PDFs
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF up to 10MB each
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Company Profile / Capability Deck</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Upload your company profile
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF up to 20MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Review */}
                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-foreground">
                      Review & Submit
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-medium text-foreground mb-2">Basic Info</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Factory Name:</div>
                          <div className="text-foreground">{formData.factoryName || "—"}</div>
                          <div className="text-muted-foreground">Location:</div>
                          <div className="text-foreground">{formData.city}, {formData.country || "—"}</div>
                          <div className="text-muted-foreground">Email:</div>
                          <div className="text-foreground">{formData.email || "—"}</div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-medium text-foreground mb-2">Capabilities</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Factory Type:</div>
                          <div className="text-foreground">{formData.factoryType || "—"}</div>
                          <div className="text-muted-foreground">Categories:</div>
                          <div className="text-foreground">
                            {formData.selectedCategories.join(", ") || "—"}
                          </div>
                          <div className="text-muted-foreground">MOQ Range:</div>
                          <div className="text-foreground">
                            {formData.moqMin ? `${formData.moqMin} - ${formData.moqMax || "∞"}` : "—"}
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-medium text-foreground mb-2">Certifications</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.selectedCertifications.length > 0 ? (
                            formData.selectedCertifications.map((cert) => (
                              <span
                                key={cert}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                              >
                                {cert}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">None selected</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 pt-4">
                        <Checkbox
                          id="terms"
                          checked={formData.agreedToTerms}
                          onCheckedChange={(checked) => 
                            updateFormData("agreedToTerms", checked)
                          }
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm text-muted-foreground leading-tight"
                        >
                          I agree to the Terms of Service and confirm that all 
                          information provided is accurate and up to date.
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                
                {currentStep < 6 ? (
                  <Button onClick={nextStep}>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!formData.agreedToTerms || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                    <Check className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
