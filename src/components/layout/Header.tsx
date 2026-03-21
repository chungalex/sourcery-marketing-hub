import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useFactoryMembership } from "@/hooks/useFactoryMembership";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { GlobalSearch } from "@/components/GlobalSearch";

const navItems = [
  { label: "For brands", href: "/brands" },
  { label: "For factories", href: "/factories" },
  { label: "Features", href: "/features" },
  { label: "Why Sourcery", href: "/why-sourcery" },
  { label: "Pricing", href: "/pricing" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, signOut, isLoading: authLoading, isAdmin } = useAuth();
  const { hasFactoryAccess, isLoading: membershipLoading } = useFactoryMembership(user?.id);

  const dashboardHref = useMemo(() => {
    if (!user) return "/dashboard";
    if (hasFactoryAccess) return "/dashboard/factory";
    return "/dashboard";
  }, [hasFactoryAccess, user]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message || "Failed to sign out");
      return;
    }
    toast.success("Signed out");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-lg">S</span>
              </div>
              <span className="font-heading font-semibold text-xl text-foreground">
                Sourcery
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/apply">
                <Button variant="ghost" size="sm">
                  Apply as Factory
                </Button>
              </Link>
              {!authLoading && user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to={dashboardHref} aria-disabled={membershipLoading}>
                    <Button size="sm" disabled={membershipLoading}>
                      Dashboard
                    </Button>
                  </Link>
                  <GlobalSearch />
                  <NotificationBell />
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button size="sm">Dashboard</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 bg-background border-b border-border lg:hidden"
          >
            <nav className="container-wide py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Link to="/apply">
                  <Button variant="ghost" className="w-full">
                    Apply as Factory
                  </Button>
                </Link>
                 {!authLoading && user ? (
                   <>
                     {isAdmin && (
                       <Link to="/admin">
                         <Button variant="outline" className="w-full">
                           Admin
                         </Button>
                       </Link>
                     )}
                     <Link to={dashboardHref} aria-disabled={membershipLoading}>
                       <Button className="w-full" disabled={membershipLoading}>
                         Dashboard
                       </Button>
                     </Link>
                     <Button variant="outline" className="w-full" onClick={handleSignOut}>
                       Sign Out
                     </Button>
                   </>
                 ) : (
                   <>
                     <Link to="/auth">
                       <Button variant="outline" className="w-full">
                         Sign In
                       </Button>
                     </Link>
                     <Link to="/dashboard">
                       <Button className="w-full">Dashboard</Button>
                     </Link>
                   </>
                 )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
