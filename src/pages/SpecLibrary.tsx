import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, FileText, Trash2, Copy, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Spec {
  id: string;
  name: string;
  category: string;
  content: Record<string, string>;
  created_at: string;
}

export default function SpecLibrary() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newContent, setNewContent] = useState([{ key: "", value: "" }]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    loadSpecs();
  }, [user]);

  async function loadSpecs() {
    setLoading(true);
    // Use localStorage as simple persistent storage until DB table is added
    const stored = localStorage.getItem(`specs_${user!.id}`);
    if (stored) setSpecs(JSON.parse(stored));
    setLoading(false);
  }

  async function saveSpec() {
    if (!newName.trim()) { toast.error("Spec name required"); return; }
    setCreating(true);
    const spec: Spec = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      category: newCategory.trim(),
      content: Object.fromEntries(newContent.filter(r => r.key.trim()).map(r => [r.key.trim(), r.value.trim()])),
      created_at: new Date().toISOString(),
    };
    const updated = [spec, ...specs];
    setSpecs(updated);
    localStorage.setItem(`specs_${user!.id}`, JSON.stringify(updated));
    setNewName(""); setNewCategory(""); setNewContent([{ key: "", value: "" }]); setShowForm(false);
    toast.success("Spec saved to library");
    setCreating(false);
  }

  function deleteSpec(id: string) {
    const updated = specs.filter(s => s.id !== id);
    setSpecs(updated);
    localStorage.setItem(`specs_${user!.id}`, JSON.stringify(updated));
    toast.success("Spec removed");
  }

  function copySpec(spec: Spec) {
    const text = Object.entries(spec.content).map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Spec copied to clipboard");
  }

  return (
    <Layout>
      <SEO title="Spec Library — Sourcery" description="Save and reuse product specs across orders." />
      <section className="section-padding">
        <div className="container-wide max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Spec library</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Save product specs, measurements, and materials for reuse across orders</p>
              </div>
              <Button size="sm" onClick={() => setShowForm(s => !s)}>
                <Plus className="h-4 w-4 mr-1.5" /> New spec
              </Button>
            </div>

            {/* Create form */}
            {showForm && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Spec name</label>
                    <Input placeholder="e.g. Premium Denim Jacket — v2" value={newName} onChange={e => setNewName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                    <Input placeholder="e.g. Outerwear, Denim, Accessories" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Spec details</label>
                  <div className="space-y-2">
                    {newContent.map((row, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2">
                        <Input placeholder="Field (e.g. Fabric)" value={row.key} onChange={e => { const u = [...newContent]; u[i].key = e.target.value; setNewContent(u); }} />
                        <Input placeholder="Value (e.g. 12oz selvedge denim)" value={row.value} onChange={e => { const u = [...newContent]; u[i].value = e.target.value; setNewContent(u); }} />
                      </div>
                    ))}
                    <Button type="button" variant="ghost" size="sm" onClick={() => setNewContent(c => [...c, { key: "", value: "" }])} className="text-xs text-muted-foreground">
                      + Add field
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveSpec} disabled={creating}>
                    {creating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Save spec
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </motion.div>
            )}

            {/* Spec list */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
              </div>
            ) : specs.length === 0 ? (
              <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-base font-semibold text-foreground mb-1">No specs saved yet</p>
                <p className="text-sm text-muted-foreground">Save product specs, measurements, and materials here to reuse across orders.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {specs.map(spec => (
                  <motion.div key={spec.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{spec.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {spec.category && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{spec.category}</span>}
                          <span className="text-xs text-muted-foreground">{format(new Date(spec.created_at), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => copySpec(spec)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => deleteSpec(spec.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {Object.keys(spec.content).length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(spec.content).slice(0, 6).map(([k, v]) => (
                          <div key={k} className="bg-secondary/50 rounded-lg px-2.5 py-1.5">
                            <p className="text-[10px] text-muted-foreground">{k}</p>
                            <p className="text-xs font-medium text-foreground truncate">{v}</p>
                          </div>
                        ))}
                        {Object.keys(spec.content).length > 6 && (
                          <div className="bg-secondary/50 rounded-lg px-2.5 py-1.5 flex items-center justify-center">
                            <p className="text-xs text-muted-foreground">+{Object.keys(spec.content).length - 6} more</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
