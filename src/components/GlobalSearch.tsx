import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Search, Package, Building2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: "order" | "factory";
  title: string;
  subtitle: string;
  href: string;
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50); }
    else { setQuery(""); setResults([]); setActiveIndex(0); }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (!user || q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    const [ordersRes, factoriesRes, rfqsRes] = await Promise.all([
      supabase.from("orders").select("id, order_number, status, specifications, factories(name)").eq("buyer_id", user.id).limit(20),
      supabase.from("factories").select("id, name, slug, country").or(`name.ilike.%${q}%,country.ilike.%${q}%`).limit(5),
      (supabase as any).from("rfqs").select("id, title, status").eq("brand_id", user.id).ilike("title", `%${q}%`).limit(3),
    ]);

    // Filter orders by order number OR product name in specs
    const filteredOrders = (ordersRes.data || []).filter(o => {
      const specs = o.specifications as any;
      const productName = specs?.product_name?.toLowerCase() || "";
      const collection = specs?.collection?.toLowerCase() || "";
      const q2 = q.toLowerCase();
      return o.order_number.toLowerCase().includes(q2) || productName.includes(q2) || collection.includes(q2);
    });

    const orderResults: SearchResult[] = filteredOrders.slice(0, 5).map(o => {
      const specs = o.specifications as any;
      return {
        id: o.id, type: "order" as const,
        title: specs?.product_name || o.order_number,
        subtitle: `${o.order_number} · ${(o.factories as any)?.name || "Factory"} · ${o.status.replace(/_/g, " ")}`,
        href: `/orders/${o.id}`,
      };
    });

    const factoryResults: SearchResult[] = (factoriesRes.data || []).map(f => ({
      id: f.id, type: "factory" as const,
      title: f.name,
      subtitle: f.country,
      href: `/directory/${f.slug}`,
    }));

    const rfqResults: SearchResult[] = (rfqsRes.data || []).map((r: any) => ({
      id: r.id, type: "order" as const,
      title: r.title,
      subtitle: `RFQ · ${r.status}`,
      href: `/dashboard?tab=rfq`,
    }));

    setResults([...orderResults, ...factoryResults, ...rfqResults]);
    setActiveIndex(0);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    const t = setTimeout(() => search(query), 200);
    return () => clearTimeout(t);
  }, [query, search]);

  const select = (result: SearchResult) => {
    navigate(result.href);
    setOpen(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && results[activeIndex]) select(results[activeIndex]);
  };

  if (!user) return null;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground text-sm"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline text-xs bg-background border border-border rounded px-1 py-0.5">⌘K</kbd>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              {loading ? <Loader2 className="h-4 w-4 text-muted-foreground animate-spin flex-shrink-0" /> : <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search orders, factories..."
                className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Results */}
            {results.length > 0 ? (
              <div className="py-2 max-h-80 overflow-y-auto">
                {results.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => select(r)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      i === activeIndex ? "bg-secondary" : "hover:bg-secondary/50"
                    )}
                  >
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", i === activeIndex ? "bg-primary/15" : "bg-secondary")}>
                      {r.type === "order" ? <Package className="h-3.5 w-3.5 text-primary" /> : <Building2 className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                    </div>
                    <span className="text-xs text-muted-foreground/60 flex-shrink-0 ml-auto capitalize">{r.type}</span>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 && !loading ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No results for "{query}"
              </div>
            ) : query.length < 2 ? (
              <div className="py-6 px-4">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-medium">Quick actions</p>
                {[
                  { label: "Go to dashboard", href: "/dashboard", icon: Package },
                  { label: "Create an order", href: "/orders/create", icon: Package },
                  { label: "Browse factory network", href: "/directory", icon: Building2 },
                ].map(a => (
                  <button
                    key={a.href}
                    onClick={() => { navigate(a.href); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    <a.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{a.label}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {/* Footer */}
            <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span><kbd className="bg-secondary border border-border rounded px-1">↑↓</kbd> navigate</span>
              <span><kbd className="bg-secondary border border-border rounded px-1">↵</kbd> open</span>
              <span><kbd className="bg-secondary border border-border rounded px-1">esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
