import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Reason = "platform" | "factory" | "partnership" | "other";

const reasons: Record<Reason, string> = {
  platform: "Question about the platform",
  factory: "Factory application",
  partnership: "Partnership or integration",
  other: "Something else",
};

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<Reason>("platform");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from("contact_submissions").insert({
        name: name.trim() || "—",
        email: email.trim(),
        message: `[${reasons[reason]}]\n\n${message.trim()}`,
        type: reason,
      });
      setDone(true);
    } catch {
      toast.error("Something went wrong — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Contact — Sourcery"
        description="Questions about the platform, factory applications, or anything else — get in touch."
      />

      <section className="section-padding bg-[var(--hero-gradient)]">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Get in touch.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Questions about the platform, the factory network, or anything else — send us a message and we'll get back to you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {!done ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium mb-1.5 block">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-1.5 block">Email <span className="text-rose-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">What's this about?</Label>
                    <Select value={reason} onValueChange={v => setReason(v as Reason)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.entries(reasons) as [Reason, string][]).map(([val, label]) => (
                          <SelectItem key={val} value={val}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium mb-1.5 block">Message <span className="text-rose-500">*</span></Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us what's on your mind..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send message"}
                  </Button>
                </form>
              ) : (
                <div className="p-8 rounded-2xl bg-card border border-border text-center">
                  <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h2 className="font-heading text-xl font-bold text-foreground mb-2">Message sent.</h2>
                  <p className="text-muted-foreground">We'll get back to you as soon as we can.</p>
                </div>
              )}
            </motion.div>

            {/* Contact info */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-3">Common questions</h2>
                <div className="space-y-4">
                  {[
                    {
                      q: "I want to try the platform",
                      a: "Create a free account — no credit card, no time limit. Your first order is free. Full OS from day one.",
                      link: "/auth?mode=signup",
                      cta: "Get started free",
                    },
                    {
                      q: "I'm a factory — how do I join?",
                      a: "If a brand invited you, accept the invite and connect immediately. To apply to the network independently, use the factory application.",
                      link: "/apply",
                      cta: "Apply to the network",
                    },
                    {
                      q: "I want to see the pricing",
                      a: "Everything is on the pricing page — Free tier, Builder, and Pro. All tiers start with a free first order.",
                      link: "/pricing",
                      cta: "See pricing",
                    },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-card border border-border">
                      <p className="text-sm font-semibold text-foreground mb-1">{item.q}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.a}</p>
                      <a href={item.link} className="text-xs text-primary hover:underline font-medium">{item.cta} →</a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">hello@sourcery.so</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
