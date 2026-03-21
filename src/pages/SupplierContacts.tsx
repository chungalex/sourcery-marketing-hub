import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, User, Phone, Mail, Building2, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  factory_name: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  notes: string;
  created_at: string;
}

export default function SupplierContacts() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ factory_name: "", name: "", role: "", email: "", phone: "", notes: "" });

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`contacts_${user.id}`);
    if (stored) setContacts(JSON.parse(stored));
  }, [user]);

  const save = () => {
    if (!form.name.trim() || !form.factory_name.trim()) { toast.error("Factory name and contact name required"); return; }
    setSaving(true);
    const contact: Contact = { ...form, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    const updated = [contact, ...contacts];
    setContacts(updated);
    localStorage.setItem(`contacts_${user!.id}`, JSON.stringify(updated));
    setForm({ factory_name: "", name: "", role: "", email: "", phone: "", notes: "" });
    setShowForm(false);
    toast.success("Contact saved");
    setSaving(false);
  };

  const remove = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    localStorage.setItem(`contacts_${user!.id}`, JSON.stringify(updated));
  };

  const grouped = contacts.reduce<Record<string, Contact[]>>((acc, c) => {
    if (!acc[c.factory_name]) acc[c.factory_name] = [];
    acc[c.factory_name].push(c);
    return acc;
  }, {});

  return (
    <Layout>
      <SEO title="Supplier Contacts — Sourcery" description="Store individual contacts at each factory." />
      <section className="section-padding">
        <div className="container-wide max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Supplier contacts</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Production manager, QC lead, shipping contact — all in one place</p>
              </div>
              <Button size="sm" onClick={() => setShowForm(s => !s)}><Plus className="h-4 w-4 mr-1.5" />Add contact</Button>
            </div>

            {showForm && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { key: "factory_name", label: "Factory name", placeholder: "HU LA Studios" },
                    { key: "name", label: "Contact name", placeholder: "Nguyen Van A" },
                    { key: "role", label: "Role", placeholder: "Production Manager" },
                    { key: "email", label: "Email", placeholder: "contact@factory.com" },
                    { key: "phone", label: "Phone / WhatsApp", placeholder: "+84 90 123 4567" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{f.label}</label>
                      <Input placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
                    <Input placeholder="Best contact for urgent issues, speaks English" value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}Save contact</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </motion.div>
            )}

            {Object.keys(grouped).length === 0 ? (
              <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
                <User className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-base font-semibold text-foreground mb-1">No contacts saved</p>
                <p className="text-sm text-muted-foreground">Store production managers, QC leads, and shipping contacts for each factory.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(grouped).map(([factory, ctcts]) => (
                  <div key={factory}>
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <h2 className="text-sm font-semibold text-foreground">{factory}</h2>
                    </div>
                    <div className="space-y-2">
                      {ctcts.map(c => (
                        <div key={c.id} className="flex items-start justify-between p-4 bg-card border border-border rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{c.name}</p>
                              {c.role && <p className="text-xs text-muted-foreground">{c.role}</p>}
                              <div className="flex flex-wrap gap-3 mt-1.5">
                                {c.email && <a href={`mailto:${c.email}`} className="text-xs text-primary hover:underline flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</a>}
                                {c.phone && <a href={`tel:${c.phone}`} className="text-xs text-primary hover:underline flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</a>}
                              </div>
                              {c.notes && <p className="text-xs text-muted-foreground mt-1 italic">{c.notes}</p>}
                            </div>
                          </div>
                          <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
