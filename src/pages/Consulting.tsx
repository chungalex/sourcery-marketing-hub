import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Consulting() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from("contact_submissions").insert({
        email: email.trim(),
        name: "—",
        message: "Consulting waitlist",
        type: "consulting_waitlist",
      });
      setDone(true);
      setEmail("");
    } catch {
      toast.error("Something went wrong — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Consulting — Sourcery"
        description="Guided onboarding, factory sourcing support, and supply chain consulting. Join the waitlist."
      />
      <section className="section-padding min-h-[70vh] flex items-center">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-6">
              Consulting support — coming soon.
            </h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-10">
              <p>
                Some brands want more than a platform — they want a partner who can help them find the right factory, review their current supplier setup, or guide them through a first overseas production run.
              </p>
              <p>
                We're building a consulting offering around exactly that. Leave your email and we'll reach out when it's available — or sooner if your situation is urgent.
              </p>
            </div>

            {!done ? (
              <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join waitlist"}
                </Button>
              </form>
            ) : (
              <div className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="font-medium">You're on the list. We'll be in touch.</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
