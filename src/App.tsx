import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Brands from "./pages/Brands";
import Factories from "./pages/Factories";
import Pricing from "./pages/Pricing";
import CaseStudies from "./pages/CaseStudies";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Directory from "./pages/Directory";
import FactoryProfile from "./pages/FactoryProfile";
import Auth from "./pages/Auth";
import Apply from "./pages/Apply";
import BrandDashboard from "./pages/BrandDashboard";
import FactoryDashboard from "./pages/FactoryDashboard";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/factories" element={<Factories />} />
            <Route path="/pricing" element={<Pricing />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
