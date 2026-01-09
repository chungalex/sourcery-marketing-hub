import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIFactoryMatcher } from "@/components/ai/AIFactoryMatcher";
import { AIQuoteAnalyzer } from "@/components/ai/AIQuoteAnalyzer";
import { AIRFQGenerator } from "@/components/ai/AIRFQGenerator";
import { AINegotiationCoach } from "@/components/ai/AINegotiationCoach";
import { CostCalculator } from "@/components/toolkit/CostCalculator";
import { SupplierScorecard } from "@/components/toolkit/SupplierScorecard";
import { OrderTracker } from "@/components/toolkit/OrderTracker";
import { ContractGenerator } from "@/components/toolkit/ContractGenerator";
import { ShippingCalculator } from "@/components/toolkit/ShippingCalculator";
import { ImportDutyCalculator } from "@/components/toolkit/ImportDutyCalculator";
import { QualityChecklistBuilder } from "@/components/toolkit/QualityChecklistBuilder";
import { LeadTimeCalculator } from "@/components/toolkit/LeadTimeCalculator";
import { Wrench, Search, TrendingUp, FileText, MessageSquare, Calculator, Star, Package, FileSignature, Ship, Receipt, ClipboardCheck, Calendar, Shield } from "lucide-react";

const tools = [
  { id: "matcher", label: "Factory Finder", icon: Search },
  { id: "quotes", label: "Quote Comparison", icon: TrendingUp },
  { id: "rfq", label: "RFQ Builder", icon: FileText },
  { id: "negotiate", label: "Deal Coach", icon: MessageSquare },
  { id: "calculator", label: "Cost Calculator", icon: Calculator },
  { id: "scorecard", label: "Supplier Scorecard", icon: Star },
  { id: "tracker", label: "Order Tracker", icon: Package },
  { id: "contract", label: "Contract Builder", icon: FileSignature },
  { id: "shipping", label: "Shipping Calculator", icon: Ship },
  { id: "duties", label: "Import Duties", icon: Receipt },
  { id: "checklist", label: "Quality Checklist", icon: ClipboardCheck },
  { id: "leadtime", label: "Lead Time", icon: Calendar },
];

export default function Toolkit() {
  return (
    <Layout>
      <SEO 
        title="Your Toolkit | Sourcery" 
        description="Powerful tools to help you find factories, compare quotes, track orders, and manage supplier relationships."
      />
      
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Wrench className="w-4 h-4" />
              Your Toolkit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Source Smarter
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              From finding the right factory to tracking your orders, our tools help you manage every step of your sourcing journey.
            </p>
            
            {/* Pre-Negotiated Value Prop */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-semibold text-foreground mb-1">
                    Pre-Negotiated Factory Partnerships
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every factory in our network has been personally vetted, audited, and negotiated with by our team. We've already done the hard work of securing competitive pricing and favorable terms — so you can skip the back-and-forth and source with confidence from day one.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="matcher" className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 p-1">
              {tools.map((tool) => (
                <TabsTrigger key={tool.id} value={tool.id} className="flex items-center gap-2">
                  <tool.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tool.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="matcher">
              <AIFactoryMatcher />
            </TabsContent>
            <TabsContent value="quotes">
              <AIQuoteAnalyzer />
            </TabsContent>
            <TabsContent value="rfq">
              <AIRFQGenerator />
            </TabsContent>
            <TabsContent value="negotiate">
              <AINegotiationCoach />
            </TabsContent>
            <TabsContent value="calculator">
              <CostCalculator />
            </TabsContent>
            <TabsContent value="scorecard">
              <SupplierScorecard />
            </TabsContent>
            <TabsContent value="tracker">
              <OrderTracker />
            </TabsContent>
            <TabsContent value="contract">
              <ContractGenerator />
            </TabsContent>
            <TabsContent value="shipping">
              <ShippingCalculator />
            </TabsContent>
            <TabsContent value="duties">
              <ImportDutyCalculator />
            </TabsContent>
            <TabsContent value="checklist">
              <QualityChecklistBuilder />
            </TabsContent>
            <TabsContent value="leadtime">
              <LeadTimeCalculator />
            </TabsContent>
          </Tabs>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Disclaimer:</strong> All tools, calculators, and estimates provided are for informational purposes only. Results should be independently verified before making business decisions. Actual costs, timelines, and duties may vary. See our{" "}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a> for full details.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
