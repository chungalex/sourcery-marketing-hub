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
import { Wrench, Search, TrendingUp, FileText, MessageSquare, Calculator, Star, Package, FileSignature } from "lucide-react";

const tools = [
  { id: "matcher", label: "Factory Finder", icon: Search },
  { id: "quotes", label: "Quote Comparison", icon: TrendingUp },
  { id: "rfq", label: "RFQ Builder", icon: FileText },
  { id: "negotiate", label: "Deal Coach", icon: MessageSquare },
  { id: "calculator", label: "Cost Calculator", icon: Calculator },
  { id: "scorecard", label: "Supplier Scorecard", icon: Star },
  { id: "tracker", label: "Order Tracker", icon: Package },
  { id: "contract", label: "Contract Builder", icon: FileSignature },
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
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From finding the right factory to tracking your orders, our tools help you manage every step of your sourcing journey.
            </p>
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
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
