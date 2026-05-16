// ─── Factory Notes ────────────────────────────────────────────────────────────
// Living document per factory. Auto-generated from completed orders.
// Manually editable for context that doesn't come from data.
// The institutional memory that survives founder departures.
// Replaces: "oh I remember they always run late in July but I forgot to tell you"

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Edit3, Save, Plus, X, Clock, 
  Star, AlertTriangle, User, TrendingUp, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

interface FactoryNote {
  id: string;
  category: "quirk" | "contact" | "lesson" | "pattern" | "general";
  text: string;
  createdAt: Date;
}

interface FactoryStats {
  avgLeadWeeks: number | null;
  orderCount: number;
  avgDefectRate: number | null;
  avgRevisionRounds: number | null;
  lastOrderDate: Date | null;
}

interface FactoryNotesProps {
  factoryId: string;
  factoryName: string;
}

const CATEGORY_CONFIG = {
  quirk:   { label: "Factory quirk", icon: AlertTriangle, color: "text-amber-600 bg-amber-500/10" },
  contact: { label: "Key contact",   icon: User,          color: "text-blue-600 bg-blue-500/10" },
  lesson:  { label: "Lesson learned",icon: BookOpen,      color: "text-purple-600 bg-purple-500/10" },
  pattern: { label: "Pattern",       icon: TrendingUp,    color: "text-green-600 bg-green-500/10" },
  general: { label: "General note",  icon: Edit3,         color: "text-foreground bg-secondary" },
};

export function FactoryNotes({ factoryId, factoryName }: FactoryNotesProps) {
  const [notes, setNotes] = useState<FactoryNote[]>([]);
  const [stats, setStats] = useState<FactoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState<FactoryNote["category"]>("general");
  const [newText, setNewText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNotesAndStats();
  }, [factoryId]);

  async function loadNotesAndStats() {
    setLoading(true);
    try {
      // Load factory notes from factory profile metadata
      const { data: factory } = await (supabase as any)
        .from("factories")
        .select("notes_data, brand_notes")
        .eq("id", factoryId)
        .single();

      if (factory?.brand_notes) {
        try {
          setNotes(JSON.parse(factory.brand_notes));
        } catch {}
      }

      // Calculate stats from completed orders
      const { data: orders } = await (supabase as any)
        .from("orders")
        .select("created_at, updated_at, lead_time_weeks, defect_count, quantity, revision_count")
        .eq("factory_id", factoryId)
        .eq("status", "closed")
        .order("created_at", { ascending: false });

      if (orders && orders.length > 0) {
        const avgLead = orders.reduce((sum: number, o: any) => sum + (o.lead_time_weeks || 0), 0) / orders.length;
        const lastOrder = new Date(orders[0].created_at);
        setStats({
          avgLeadWeeks: Math.round(avgLead * 10) / 10 || null,
          orderCount: orders.length,
          avgDefectRate: null,
          avgRevisionRounds: null,
          lastOrderDate: lastOrder,
        });
      }
    } catch {}
    setLoading(false);
  }

  async function saveNote() {
    if (!newText.trim()) { toast.error("Add some text"); return; }
    setSaving(true);
    const note: FactoryNote = {
      id: Date.now().toString(),
      category: newCategory,
      text: newText,
      createdAt: new Date(),
    };
    const updated = [note, ...notes];
    setNotes(updated);
    
    try {
      await (supabase as any)
        .from("factories")
        .update({ brand_notes: JSON.stringify(updated) })
        .eq("id", factoryId);
      toast.success("Note saved");
    } catch {
      toast.error("Failed to save");
    }
    
    setNewText("");
    setAdding(false);
    setSaving(false);
  }

  async function deleteNote(id: string) {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    try {
      await (supabase as any)
        .from("factories")
        .update({ brand_notes: JSON.stringify(updated) })
        .eq("id", factoryId);
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Auto-generated stats from real orders */}
      {stats && stats.orderCount > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">From your order history</span>
            <span className="text-xs text-muted-foreground ml-auto">Auto-generated</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{stats.orderCount}</p>
              <p className="text-xs text-muted-foreground">Completed orders</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-lg font-bold text-foreground">
                {stats.avgLeadWeeks ? `${stats.avgLeadWeeks}w` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Avg lead time</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {stats.lastOrderDate ? format(stats.lastOrderDate, "MMM yy") : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Last order</p>
            </div>
          </div>
          {stats.avgLeadWeeks && stats.avgLeadWeeks > 0 && (
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
              Plan for {Math.ceil(stats.avgLeadWeeks)} weeks when placing orders with {factoryName}.
            </p>
          )}
        </div>
      )}

      {/* Manual notes */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Factory notes</span>
            {notes.length > 0 && (
              <span className="text-xs text-muted-foreground">({notes.length})</span>
            )}
          </div>
          {!adding && (
            <Button size="sm" variant="outline" onClick={() => setAdding(true)} className="gap-1 h-7 text-xs">
              <Plus className="h-3 w-3" /> Add note
            </Button>
          )}
        </div>

        {/* Add note form */}
        {adding && (
          <div className="p-4 space-y-3 border-b border-border bg-secondary/20">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(CATEGORY_CONFIG) as FactoryNote["category"][]).map(cat => {
                  const cfg = CATEGORY_CONFIG[cat];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-all",
                        newCategory === cat
                          ? "border-primary bg-primary/5 text-foreground font-medium"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <textarea
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder={
                newCategory === "quirk" ? "e.g. Always runs 5-7 days late on QC in July and August. Build this into your delivery window." :
                newCategory === "contact" ? "e.g. Ms. Linh is the main contact. WhatsApp: +84 90 xxx. Responds within 2 hours during business hours." :
                newCategory === "lesson" ? "e.g. Always confirm fabric receipt before accepting 'cutting started' update. They once cut before fabric arrived." :
                newCategory === "pattern" ? "e.g. Strong on denim. Weaker on jersey — higher defect rate on knit products historically." :
                "Add any note about working with this factory..."
              }
              className="w-full text-xs border border-border rounded-lg px-3 py-2.5 bg-background resize-none h-20 leading-relaxed"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveNote} disabled={saving || !newText.trim()} className="gap-1.5">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save note
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setAdding(false); setNewText(""); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes list */}
        {notes.length === 0 && !adding ? (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Notes you add here are only visible to you — not the factory. 
              Record quirks, key contacts, lessons learned, and patterns.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notes.map(note => {
              const cfg = CATEGORY_CONFIG[note.category];
              const Icon = cfg.icon;
              return (
                <div key={note.id} className="flex items-start gap-3 px-4 py-3 group">
                  <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", cfg.color)}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{note.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {cfg.label} · {format(new Date(note.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/50 hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
