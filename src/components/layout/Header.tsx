import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Plus, Package, Search, BookOpen, ChevronDown, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useFactoryMembership } from "@/hooks/useFactoryMembership";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { GlobalSearch } from "@/components/GlobalSearch";
import { cn } from "@/lib/utils";

// Marketing nav — shown to logged-out users
const marketingNav = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Trade tools", href: "/trade-tools" },
  { label: "Studio", href: "/studio" },
];

// Secondary nav items accessible via mobile menu
const marketingNavSecondary = [
  { label: "Intelligence", href: "/intelligence" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Why Sourcery", href: "/why-sourcery" },
  { label: "Case studies", href: "/case-studies" },
  { label: "FAQ", href: "/faq" },
];

// App nav — shown to logged-in brands
const brandAppNav = [
  { label: "Orders", href: "/dashboard", icon: Package },
  { label: "Network", href: "/directory", icon: Search },
  { label: "Resources", href: "/resources", icon: BookOpen },
];

// App nav — shown to logged-in factories
const factoryAppNav = [
  { label: "Orders", href: "/dashboard/factory", icon: Package },
  { label: "Resources", href: "/resources", icon: BookOpen },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, signOut, isLoading: authLoading, isAdmin } = useAuth();
  const { hasFactoryAccess, isLoading: membershipLoading } = useFactoryMembership(user?.id);

  const isLoggedIn = !!user && !authLoading;
  const isFactory = isLoggedIn && hasFactoryAccess;
  const isBrand = isLoggedIn && !hasFactoryAccess;

  // Determine which nav to show
  const appNav = isFactory ? factoryAppNav : brandAppNav;

  const dashboardHref = useMemo(() => {
    if (!user) return "/dashboard";
    if (hasFactoryAccess) return "/dashboard/factory";
    return "/dashboard";
  }, [hasFactoryAccess, user]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) { toast.error(error.message || "Failed to sign out"); return; }
    toast.success("Signed out");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  const isActive = (href: string) =>
    href === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(href);

  return (
    <>
      <header className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-background border-b border-border"
      )}>
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to={isLoggedIn ? dashboardHref : "/"} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-base">S</span>
              </div>
              <span className="font-heading font-semibold text-lg text-foreground">Sourcery</span>
              {isBrand && (
                <span className="hidden sm:block text-xs text-muted-foreground font-normal ml-1">/ Brand</span>
              )}
              {isFactory && (
                <span className="hidden sm:block text-xs text-muted-foreground font-normal ml-1">/ Factory</span>
              )}
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {isLoggedIn ? (
                // App navigation
                appNav.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive(item.href)
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                ))
              ) : (
                // Marketing navigation
                marketingNav.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      location.pathname === item.href
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.label}
                  </Link>
                ))
              )}
            </nav>

            {/* Desktop right side */}
            <div className="hidden lg:flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  {isBrand && (
                    <>
                    <Link to="/rfq/create">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Send className="h-3.5 w-3.5" />
                        New RFQ
                      </Button>
                    </Link>
                    <Link to="/orders/create">
                      <Button size="sm" className="gap-1.5">
                        <Plus className="h-3.5 w-3.5" />
                        New order
                      </Button>
                    </Link>
                    </>
                  )}
                  <GlobalSearch />
                  <NotificationBell />
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">Admin</Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground">
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm">Sign in</Button>
                  </Link>
                  <Link to="/auth?mode=signup">
                    <Button size="sm">Get started free</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 bg-background border-b border-border lg:hidden shadow-lg"
          >
            <nav className="container-wide py-4 flex flex-col gap-1">
              {isLoggedIn ? (
                <>
                  {appNav.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        isActive(item.href) ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                    {isBrand && (
                      <Link to="/orders/create">
                        <Button className="w-full gap-2">
                          <Plus className="h-4 w-4" />
                          New order
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline" className="w-full" onClick={handleSignOut}>
                      Sign out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {[...marketingNav, ...marketingNavSecondary].map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        location.pathname === item.href ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                    <Link to="/factories">
                      <Button variant="ghost" className="w-full">For factories</Button>
                    </Link>
                    <Link to="/auth">
                      <Button variant="outline" className="w-full">Sign in</Button>
                    </Link>
                    <Link to="/auth?mode=signup">
                      <Button className="w-full">Get started free</Button>
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
