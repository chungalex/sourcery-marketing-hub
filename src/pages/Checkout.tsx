import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Lock, 
  Check, 
  ArrowLeft,
  Building2,
  Shield,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const plans = {
  starter: {
    name: "Starter",
    price: 49,
    interval: "month",
    features: [
      "Up to 5 factory contacts/month",
      "Basic factory profiles",
      "Email support",
      "Standard matching"
    ]
  },
  growth: {
    name: "Growth",
    price: 149,
    interval: "month",
    features: [
      "Up to 25 factory contacts/month",
      "Full factory profiles & certifications",
      "Priority email & chat support",
      "Advanced matching algorithm",
      "Sample request management"
    ]
  },
  enterprise: {
    name: "Enterprise",
    price: 499,
    interval: "month",
    features: [
      "Unlimited factory contacts",
      "Dedicated account manager",
      "Custom integrations",
      "White-glove onboarding",
      "Supplier audit reports",
      "API access"
    ]
  }
};

type PlanKey = keyof typeof plans;

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planParam = searchParams.get("plan") as PlanKey | null;
  const selectedPlan = planParam && plans[planParam] ? plans[planParam] : plans.growth;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const yearlyDiscount = 0.2; // 20% off
  const price = billingCycle === "yearly" 
    ? Math.round(selectedPlan.price * 12 * (1 - yearlyDiscount))
    : selectedPlan.price;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }, 2000);
  };

  return (
    <Layout>
      <SEO 
        title={`Subscribe to ${selectedPlan.name} | Manufactory`}
        description="Complete your subscription to connect with verified manufacturers worldwide."
      />

      <section className="section-padding min-h-[80vh]">
        <div className="container-tight">
          <Link 
            to="/pricing" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to pricing
          </Link>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 order-2 lg:order-1"
            >
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {selectedPlan.name} Plan
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {billingCycle === "yearly" ? "Annual billing" : "Monthly billing"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg mb-6">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      billingCycle === "monthly"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("yearly")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors relative ${
                      billingCycle === "yearly"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Yearly
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                      -20%
                    </span>
                  </button>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {selectedPlan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      ${billingCycle === "yearly" ? selectedPlan.price * 12 : selectedPlan.price}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <div className="flex items-center justify-between mb-2 text-primary">
                      <span>Annual discount (20%)</span>
                      <span>-${Math.round(selectedPlan.price * 12 * yearlyDiscount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">
                      ${price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{billingCycle === "yearly" ? "year" : "month"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      SSL Secured
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      Instant Access
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3 order-1 lg:order-2"
            >
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-semibold text-foreground">
                    Secure Checkout
                  </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Account Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
                      Account Information
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Smith"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          type="text"
                          placeholder="Acme Inc"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
                      Payment Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          className="pl-10"
                          maxLength={19}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          type="text"
                          placeholder="123"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay ${price}/{billingCycle === "yearly" ? "year" : "month"}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By subscribing, you agree to our{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    . You can cancel anytime.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
