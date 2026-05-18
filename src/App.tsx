import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Home from "./pages/Home";
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Brands = lazy(() => import("./pages/Brands"));
const Factories = lazy(() => import("./pages/Factories"));
const Pricing = lazy(() => import("./pages/Pricing"));
const WhyClewa = lazy(() => import("./pages/WhyClewa"));
const Notifications = lazy(() => import("./pages/Notifications"));
const FactoryCompare = lazy(() => import("./pages/FactoryCompare"));
const ProductionCalendar = lazy(() => import("./pages/ProductionCalendar"));
const SpecLibrary = lazy(() => import("./pages/SpecLibrary"));
const Analytics = lazy(() => import("./pages/Analytics"));
const SupplierContacts = lazy(() => import("./pages/SupplierContacts"));
const Features = lazy(() => import("./pages/Features"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Walkthrough = lazy(() => import("./pages/Walkthrough"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Resources = lazy(() => import("./pages/Resources"));
const ResourceArticle = lazy(() => import("./pages/ResourceArticle"));
const Forum = lazy(() => import("./pages/Forum"));
const Intelligence = lazy(() => import("./pages/Intelligence"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const Consulting = lazy(() => import("./pages/Consulting"));
const About = lazy(() => import("./pages/About"));
const Studio = lazy(() => import("./pages/Studio"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
import NotFound from "./pages/NotFound";
const Directory = lazy(() => import("./pages/Directory"));
const FactoryProfile = lazy(() => import("./pages/FactoryProfile"));
import Auth from "./pages/Auth";
const Apply = lazy(() => import("./pages/Apply"));
const BrandDashboard = lazy(() => import("./pages/BrandDashboard"));
const FactoryDashboard = lazy(() => import("./pages/FactoryDashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Toolkit = lazy(() => import("./pages/Toolkit"));
const CreateOrder = lazy(() => import("./pages/CreateOrder"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const FactoryAccept = lazy(() => import("./pages/FactoryAccept"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const CreateRFQ = lazy(() => import("./pages/CreateRFQ"));
const RFQRespond = lazy(() => import("./pages/RFQRespond"));
const FactoryOnboarding = lazy(() => import("./pages/FactoryOnboarding"));
const OrderRecord = lazy(() => import("./pages/OrderRecord"));
const VietnamManufacturing = lazy(() => import("./pages/VietnamManufacturing"));
const HowToFindFactory = lazy(() => import("./pages/HowToFindFactory"));
const Alternatives = lazy(() => import("./pages/Alternatives"));
const Compliance = lazy(() => import("./pages/Compliance"));
const ProductionIntelligencePage = lazy(() => import("./pages/ProductionIntelligence"));
const TradeTools = lazy(() => import("./pages/TradeTools"));


const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/factories" element={<Factories />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/why-clewa" element={<WhyClewa />} />
            <Route path="/consulting" element={<Consulting />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/directory/:slug" element={<FactoryProfile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/dashboard" element={<BrandDashboard />} />
            <Route path="/dashboard/factory" element={<FactoryDashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/toolkit" element={<Toolkit />} />
            <Route path="/orders/create" element={<CreateOrder />} />
        <Route path="/rfq/create" element={<CreateRFQ />} />
        <Route path="/rfq/respond" element={<RFQRespond />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/record/:id" element={<OrderRecord />} />
        <Route path="/vietnam-manufacturing" element={<VietnamManufacturing />} />
        <Route path="/how-to-find-a-factory" element={<HowToFindFactory />} />
        <Route path="/alternatives" element={<Alternatives />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/trade-tools" element={<TradeTools />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/factory-accept/:orderId" element={<FactoryAccept />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/onboarding/factory" element={<FactoryOnboarding />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/compare" element={<FactoryCompare />} />
            <Route path="/calendar" element={<ProductionCalendar />} />
            <Route path="/specs" element={<SpecLibrary />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/contacts" element={<SupplierContacts />} />
            <Route path="/features" element={<Features />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/walkthrough" element={<Walkthrough />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:slug" element={<ResourceArticle />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/intelligence" element={<ProductionIntelligencePage />} />
            <Route path="/market-intelligence" element={<Intelligence />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
