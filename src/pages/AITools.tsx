import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIFactoryMatcher } from "@/components/ai/AIFactoryMatcher";
import { AIQuoteAnalyzer } from "@/components/ai/AIQuoteAnalyzer";
import { AIRFQGenerator } from "@/components/ai/AIRFQGenerator";
import { AINegotiationCoach } from "@/components/ai/AINegotiationCoach";
import { Sparkles, Search, FileText, MessageSquare, TrendingUp } from "lucide-react";

const tools = [
  { id: "matcher", label: "Factory Matcher", icon: Search },
  { id: "quotes", label: "Quote Analyzer", icon: TrendingUp },
  { id: "rfq", label: "RFQ Generator", icon: FileText },
  { id: "negotiate", label: "Negotiation Coach", icon: MessageSquare },
];

export default function AITools() {
  return (
    <Layout>
      <SEO 
        title="AI Tools | Sourcery" 
        description="AI-powered tools to help you find factories, analyze quotes, and negotiate better deals."
      />
      
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Tools
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Work Smarter, Not Harder
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI tools help you find the right factories, analyze quotes, create professional RFQs, and negotiate better deals.
            </p>
          </motion.div>

          <Tabs defaultValue="matcher" className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto">
              {tools.map((tool) => (
                <TabsTrigger key={tool.id} value={tool.id} className="flex items-center gap-2">
                  <tool.icon className="w-4 h-4" />
                  {tool.label}
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
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
