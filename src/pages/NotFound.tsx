import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <SEO
        title="Page Not Found | Sourcery"
        description="The page you're looking for doesn't exist. Navigate back to our homepage or explore our services."
        noIndex={true}
      />
      
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 md:py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Search className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="font-heading text-6xl md:text-8xl font-bold text-foreground mb-4">
              404
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">
              Page not found
            </p>
            
            <p className="text-muted-foreground mb-10 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg">
                  <Home className="w-4 h-4" />
                  Go to Homepage
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>
            
            <div className="mt-16 pt-10 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Looking for something specific?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/how-it-works" className="text-sm text-primary hover:underline">
                  How it Works
                </Link>
                <Link to="/brands" className="text-sm text-primary hover:underline">
                  For Brands
                </Link>
                <Link to="/factories" className="text-sm text-primary hover:underline">
                  For Factories
                </Link>
                <Link to="/contact" className="text-sm text-primary hover:underline">
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
