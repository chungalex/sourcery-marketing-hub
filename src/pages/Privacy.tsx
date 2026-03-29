import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <Layout>
      <SEO
        title="Privacy — Sourcery"
        description="How Sourcery handles your data. Plain language — not legal boilerplate."
        canonical="/privacy"
      />

      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-10">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Privacy
              </h1>
              <p className="text-muted-foreground text-sm">Last updated: March 2026</p>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                Sourcery handles commercially sensitive information — factory names, order pricing, product specifications, delivery windows. This page explains what we do with that information in plain language.
              </p>

              <div className="space-y-10">

                {/* Order data */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-3">Who can see your order data</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Every order on Sourcery is visible only to the brand and the factory on that specific order. This is enforced at the database level — row-level security means other users cannot access your orders, regardless of permissions. No other brand sees your orders, specs, pricing, or factory relationships.
                  </p>
                </div>

                {/* Pricing */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-3">Your pricing and factory relationships</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Order pricing and factory relationships are visible only to the parties on that order. We do not aggregate pricing data across brands or cross-reference what one brand pays against another. This is how the platform is built today — and any future feature that involved order data in a new way would require explicit opt-in from the brands and factories involved.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Factories you invite through BYOF (Bring Your Own Factory) are connected privately to your account. They are not listed in the marketplace, not discoverable by other brands, and cannot appear in the marketplace without submitting their own independent application — which is evaluated separately from your account.
                  </p>
                </div>

                {/* Data you provide */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-3">What we collect and why</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We collect what you give us: account information, brand or factory profile details, order data you create, messages you send, and files you upload. We use this to operate the platform — to display your orders, connect you with the right factory, power the production assistant, and build factory performance records.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell your data. We do not share it with third parties for marketing purposes.
                  </p>
                </div>

                {/* Disputes */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-3">Disputes</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If there is a dispute between a brand and a factory, Sourcery provides the documented record — every message, spec version, revision, and milestone — as a neutral reference. We do not take sides, rule on outcomes, or share the record with parties outside the dispute. We give both parties access to the same documented history.
                  </p>
                </div>

                {/* Your data when you leave */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-3">Your data if you cancel</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your order history is exportable as PDF at any time from any closed order. If you cancel your subscription, your account and data remain accessible until you choose to delete them. We do not automatically delete your records when a subscription ends. You can request deletion at any time by contacting us.
                  </p>
                </div>

                {/* AI */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-3">AI and your data</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The production assistant uses your order context — factory, specs, milestones, message thread — to answer questions about your active orders. This context is specific to your order and is not used to answer questions for other brands. Conversations with the assistant are saved to the order record and are visible to you and the factory on that order.
                  </p>
                </div>

                {/* Cookies */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-3">Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies for authentication and to keep you logged in. We do not use third-party advertising cookies. You can clear cookies through your browser at any time, though this will log you out.
                  </p>
                </div>

                {/* Your rights */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-3">Your rights</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You can access, correct, or request deletion of your personal information at any time. To make a request, contact us directly. We will respond within 30 days.
                  </p>
                </div>

                {/* Contact */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-2">Questions</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    If you have questions about how your data is handled, reach out directly. We respond to everything.
                  </p>
                  <Link to="/contact" className="text-primary hover:underline text-sm font-medium">
                    Contact us →
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
