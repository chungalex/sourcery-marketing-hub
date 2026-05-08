# SOURCERY DOCTRINE
## The single source of truth for every decision about this product.

*Read this at the start of every session before touching any code or copy.*
*Update it every time a major decision is made.*

---

## WHAT SOURCERY IS

**The factory relationship infrastructure for physical product brands.**

Every dimension of working with a manufacturer — finding one, vetting one, operating every order professionally, protecting every payment, documenting everything, knowing what to do at every step — in one platform.

**The one sentence:**
> "Sourcery is how serious brands work with factories."

**The infrastructure statement:**
> "The infrastructure the whole category was missing."

**What changed and why:**
- Phase 1 (original): "Marketplace + production OS" — led with marketplace, which was empty
- Phase 2: "Document your production" — accurate but passive, sounded like admin
- Phase 3: "Enterprise supply chain tools, built for yours" — comparison positioning, not distinctive
- Phase 4 (current): "Factory relationship infrastructure" — the complete category, not a feature set

---

## THE THREE-SITUATION FRAMEWORK

This is how every brand founder relates to the product. Every page, every CTA, every onboarding question routes through these three situations:

**Situation 1 — "I don't have a factory yet"**
We'll find you one. Registered manufacturers, real performance data from completed orders, AI matching from a plain-language brief, due diligence checklist, multi-factory RFQ.

**Situation 2 — "I have one but I'm not fully sure I can trust them"**
We give you the tools to be certain. Factory verification, audit request system, OTIF scoring from real orders, dispute filing if things go wrong, milestone-gated payments so your money is protected.

**Situation 3 — "I have one I trust"**
Invite them in 60 seconds. BYOF — full platform, full features, immediately. Structure every order, protect every payment, document everything, let the intelligence layer activate as your history builds.

---

## THE GUIDANCE LAYER

The platform is not just a system of record. It guides brands through the entire factory relationship — telling them what to do, in what order, before they know to ask.

At every decision point:
- Before choosing a factory: what questions to ask, what documents to request
- Before issuing a PO: is the tech pack complete, have you agreed AQL, does the window account for Tet
- During production: what this delay means, what to message the factory today
- At QC: what your options are, what each means for your leverage and relationship

This is the "sourcing director" concept — experienced guidance delivered contextually, not in help articles.

---

## WHAT WE DO AND DON'T DO

### Payments — the most important one

**WE DO:**
- Milestone-gated payment releases
- Structured payment milestones (deposit, sample gate, production, QC gate, final)
- Payment milestone tracking and documentation
- Gate enforcement — bulk cannot start until sample approved, final cannot release until QC passes
- Payment history permanently logged per order

**WE DO NOT:**
- Hold funds (escrow)
- Process payments directly
- Transfer money
- Act as a financial intermediary

**NEVER SAY:** escrow, escrow-style, hold funds, custody
**ALWAYS SAY:** milestone-gated payments, payment milestone releases, structured payment protection

### Factory verification

**WE DO:**
- `is_verified` boolean field in the factories database table
- VerifiedBadge component that shows when is_verified = true
- AuditRequestModal for brands to request factory audits
- Factory profile completeness (self-reported by factory)
- OTIF scores from verified completed order data (genuinely objective)

**WE DO NOT (YET):**
- Have a documented verification process with defined criteria
- Independently verify factory certifications
- Conduct audits ourselves
- Have third-party audit integration

**USE:** "registered manufacturers" until a real verification process exists
**DO NOT USE:** "verified manufacturers" as a blanket marketing claim
**EXCEPTION:** OTIF "never self-reported" — this IS genuinely verified, calculated from DB

### White-label exports

**CURRENT REALITY:** OrderExportPDF shows Sourcery branding. No brand logo swap is built.

**WHAT TO SAY:** "Branded document exports" (aspirational, accurate direction)
**DO NOT SAY:** "White-label PDF exports" until brand logo/name swap is built

### The directory

**CURRENT REALITY:** Directory calls real Supabase via lib/factories.ts — the code is correct. The database is empty because no real factories have been registered yet. HU LA Studios needs to be added as the first real factory.

**DO NOT SAY:** "Browse hundreds of factories" or any volume claim until real factories exist

### Statistics

**REAL STATS (use these):**
- 94% OTIF — HU LA Studios, specific factory, labeled as such ✓
- 14.2 weeks lead time — HU LA Studios historical, labeled as such ✓
- AQL 2.5 — OKIO Denim's standard ✓
- 300-500 units — OKIO order size ✓

**DEMO/ASPIRATIONAL STATS (do not present as live platform data):**
- "12 verified completed orders" — NOT REAL, removed from homepage
- Any aggregate platform stats until real orders exist

**RULE:** If it's specific to OKIO/HU LA, label it as such. If it's a platform aggregate, it must be real.

---

## TIER NAMING AND WHAT'S IN EACH

### Starter (Free)
For brands starting out — guided first orders, factory directory access, basic documentation.
- 1 active order at a time
- Factory directory
- Structured PO creation
- Milestone-gated payments
- Platform messaging + translation
- Basic documentation
- Trade tools (always free regardless of tier)

### Growth ($49/month or $399/year)
For brands running production who need intelligence and professional tools.
- 10 simultaneous orders
- Full intelligence suite (production countdown, order health, safety stock, OTIF, reorder)
- AI toolkit (production assistant, quote analyser, RFQ generator, negotiation coach, tech pack reviewer)
- Multi-factory RFQ system
- Contract generation
- Dispute filing
- BOM tracker, shipment tracker, freight checklist
- Timezone approvals

### Scale ($149/month or $1,440/year)
For brands with teams and compliance requirements.
- Unlimited orders
- 3 team seats
- Compliance export (CSDDD, UFLPA, Modern Slavery Act)
- Branded document exports
- Spec library
- Advanced analytics
- Supplier audit system

### Sourcery Managed (not a subscription tier)
A separate service — we handle the entire production run.
From $2,000 per run. 3-5 slots per season. Apply at /studio.

---

## VOICE AND TONE

**The voice:** Direct. Grounded. Experienced. Slightly impatient with how poorly the industry manages this.

**The frame:** The person who has been on a factory floor and knows what actually goes wrong.

**Qualities:**
- Specific over generic ("AQL 2.5" not "quality standards")
- Problem-first over feature-first ("find out in week 4, not week 12" not "backward scheduling")
- Honest about what we do and don't do
- Never condescending but never soft either
- Confident without overclaiming

**Never:**
- Jargon without explanation on first use
- Enterprise comparison as primary pitch
- SaaS clichés ("seamless", "powerful", "robust", "cutting-edge")
- Fake urgency
- Stats we can't verify

---

## WHAT SOURCERY IS NOT

- Not an escrow service
- Not a payment processor
- Not a logistics company
- Not a sourcing agent
- Not a factory directory only
- Not enterprise software at a lower price
- Not a WhatsApp replacement (we solve more than communication)
- Not just for new brands (the problem exists at every stage)
- Not just for Vietnam (though Vietnam-native is a key advantage)

---

## KEY DECISIONS MADE AND WHY

**Decision: BYOF as primary positioning over marketplace**
Why: The directory is currently empty. BYOF works with zero factories in the database. Leading with marketplace when the marketplace is empty destroys trust. BYOF builds the network over time as brands bring their factories.

**Decision: Three situations not three tiers**
Why: Tiers are about price. Situations are about the customer. A brand reads a situation and immediately sees themselves. They read a tier and start comparing features. The situation frame converts better and is more honest.

**Decision: "Factory relationship infrastructure" not "supply chain tools"**
Why: Supply chain tools positions Sourcery against enterprise software (irrelevant comparison for most users). Factory relationship infrastructure names a new category that Sourcery owns entirely.

**Decision: Remove escrow language**
Why: We do not hold funds. Describing our payment tracking as "escrow" is legally and factually wrong. We enforce payment gates and track payment history. That's milestone-gated payment protection, not escrow.

**Decision: "Registered" not "verified" for factories**
Why: is_verified is a boolean we can set. We have no documented verification process. Until we do, "verified" is a claim we can't back up. "Registered" is accurate.

**Decision: Remove "12 verified completed orders" stat**
Why: It's demo data. There are zero real completed orders in production. Publishing fake statistics destroys trust permanently when discovered.

**Decision: Shopify integration — build CSV import first**
Why: Full OAuth integration requires Shopify Partner account, app review, billing integration — 2-4 weeks and requires demonstrated real usage. CSV import solves the data problem in 2 days. Validate demand first, then build the full integration.

**Decision: No competitor names on website**
Why: Naming competitors gives them SEO value and anchors you as their alternative rather than your own category. Use "enterprise platforms" and "network platforms" generically.

---

## CURRENT PLATFORM STATUS

- **Repo:** github.com/chungalex/sourcery-marketing-hub
- **Stack:** React + TypeScript + Vite + Supabase + Stripe + Anthropic API
- **Hosting:** Lovable Cloud → sourcery.so
- **Token for git push:** Set per session — expires with container

### Blocking launch (must do before external users):
1. Set RESEND_API_KEY in Lovable secrets (email notifications silent without it)
2. Set Stripe keys in Lovable secrets (no paid upgrades possible)
3. Run SQL_NEW_FEATURES.sql in Lovable SQL Editor
4. Sign up OKIO as brand + HU LA Studios as factory
5. Run one real OKIO order end to end
6. Submit sitemap to Google Search Console

### What's real and working:
- Core order loop (create → PO → accept → milestones → QC → close)
- All 12 edge functions deployed
- Intelligence layer (production countdown, order health, safety stock, OTIF, reorder)
- AI toolkit (all wired to Anthropic API, no mock data)
- Platform messaging with real translation
- Trade tools (all interactive, real data)
- Directory (code correct, database empty)

### What's NOT real yet:
- Factory directory (empty — needs HU LA Studios added)
- OTIF scores (no real orders to calculate from)
- Lead time benchmarks (no real order history)
- Stripe payments (keys not confirmed set)
- Email notifications (RESEND_API_KEY not set)

---

*Last updated: 2026-05*
*Update this document every session when strategic decisions are made.*
