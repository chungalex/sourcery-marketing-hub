# SOURCERY DOCTRINE
## The single source of truth for every decision about this product.

*Read this at the start of every session before touching any code or copy.*
*Update it every time a major decision is made.*

---

## WHAT SOURCERY IS

**The factory relationship infrastructure for physical product brands.**

Every dimension of working with a manufacturer — finding one, vetting one, operating every order professionally, protecting every payment, documenting everything, knowing what to do at every step — in one platform.

**The one sentence:**
> "Clewa is how serious brands work with factories."

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

**CURRENT REALITY:** OrderExportPDF shows Clewa branding. No brand logo swap is built.

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

### Clewa Managed (not a subscription tier)
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
Why: Supply chain tools positions Clewa against enterprise software (irrelevant comparison for most users). Factory relationship infrastructure names a new category that Clewa owns entirely.

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

- **Repo:** github.com/chungalex/clewa-marketing-hub
- **Stack:** React + TypeScript + Vite + Supabase + Stripe + Anthropic API
- **Hosting:** Lovable Cloud → clewa.io
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

---

## SESSION MANAGEMENT

**How every session should start:**
1. Read SESSION_BRIEF.md — current build state, what was done, what is next
2. Read CLEWA_DOCTRINE.md — confirmed decisions and positioning
3. Start with the first action listed in SESSION_BRIEF
4. Update both files at end of every session

**SESSION_BRIEF.md** lives at repo root. Gets overwritten every session with current state.
**CLEWA_DOCTRINE.md** gets appended — never overwritten. New decisions added at bottom.

---

## CONFIRMED DECISIONS — SESSION 2026-05-16

**Revenue model confirmed:**
- Line 1: SaaS subscriptions (Starter free / Growth $49 / Scale $149)
- Line 2: Clewa Managed ($2,000-3,500/run, limited slots, not hands-on ops)
- Line 3 (future): GMV-based fee when payment partner exists
- Line 4 (future): Factory performance data product at 500+ completed orders
- Line 5 (future): Financing referrals when brand payment history exists
- NOT a revenue line: QC coordination, per-order Protected fee on top of subscription

**AI layer confirmed:**
- Proactive guidance is Tier 1 — builds for beginners specifically
- Production Intelligence workspace — full page at /workspace or /ai
- Not a chatbot widget. A full thinking partner with order context injected.
- Level 1: rule-based triggers (buildable now)
- Level 2: pattern-based (needs 5-10 orders per factory)
- Level 3: predictive (needs 50+ orders)
- Five specific triggers to build first:
  1. Silent factory (PO issued, no response in 3 days)
  2. Delivery window compression (days vs stage mismatch)
  3. Payment gate checklist (documents missing before release)
  4. Spec conflict (PO vs tech pack mismatch)
  5. Overdue stage (longer in status than typical)

**Order Room confirmed:**
- Notion/Huly features ONLY inside manufacturing workflow
- Each order = tabbed workspace: Overview, Timeline, Messages, Documents, QC, Payments, Shipping
- Not blank docs, not generic kanban, not general wiki
- The product organizes the production relationship — not the user

**Features to add back for beginners:**
- Due diligence checklist inline at factory selection
- Tech pack completeness checklist inline at order creation Step 2
- Incoterms explainer inline at PO deal step
- AQL explainer inline at quality step
- Milestone structure explainer inline at deal step
- Tet/Golden Week warning at delivery date selection
- First message template pre-populated at PO issue
- WhatsApp ingestion (Tier 2 build)

**Marketing strategy confirmed:**
- Market the transformation not the features
- Personal LinkedIn content from Alex — specific, operational, Vietnam-native
- Three-situation framework as conversion architecture
- AI alert stories as primary social proof (once real users exist)
- Trade tools as top-of-funnel SEO
- Rewrite features page around problem moments not feature categories
- Pricing page around what each tier prevents not what it includes
- One LinkedIn post per week minimum, first-person, specific, no SaaS language

**Session Brief system confirmed:**
- SESSION_BRIEF.md created at repo root
- Overwritten every session with current state
- Contains: what was built, platform state, master build list, decisions, next action
- Read at start of every session alongside doctrine
---

## SESSION SYSTEM

Two files live at repo root and get updated every session:

**CLEWA_DOCTRINE.md** — what Clewa is, strategic decisions, voice, what we do/don't do. Changes rarely.

**SESSION_LOG.md** — current build state, full queue, what requires Alex's action. Overwritten every session.

Read both at the start of every session before touching any code or copy.

---

## ADDITIONAL CONFIRMED DECISIONS

**Decision: Order Room concept over generic workspace**
Why: Notion/Huly features are valuable only inside the manufacturing workflow. Each order becomes a structured workspace with tabbed navigation. Not a general productivity tool — a manufacturing-specific command centre.

**Decision: AI Workspace as full dedicated page**
Why: Not a corner widget or floating button. A full page where brands think through manufacturing decisions with an AI that knows their operation. Left panel shows what AI is watching. Right panel is conversation. AI speaks first — not "how can I help" but "here is what is happening in your operation right now."

**Decision: WhatsApp ingestion as priority build**
Why: Biggest factory adoption barrier is losing conversation history. Brand forwards thread → AI extracts decisions → confirms as change orders. Factory never has to change behaviour.

**Decision: Collection planning board**
Why: Brands think in seasons, not individual orders. Seasonal kanban above order list gives brands visibility into the full season production plan.

**Decision: Shopify CSV import before OAuth**
Why: CSV import proves the data loop works in 2 days. OAuth requires Shopify Partner account, app review, demonstrated real usage. Validate demand first.

**Decision: Factory Notes auto-generated from real orders**
Why: Platform should build institutional knowledge automatically, not ask brands to write it. When order closes, factory profile updates with real data.

**Decision: Marketing leads with transformation not features**
Why: Features are what the platform does. Transformation is what the brand experiences. "We told a brand their season was at risk 3 weeks before they would have noticed" converts better than "backward scheduling from delivery date."

**Decision: Alex posts operational LinkedIn content personally**
Why: Personal authority on LinkedIn outperforms brand authority for early-stage B2B. Specific Vietnam manufacturing knowledge from someone who runs a factory there. One post per week minimum.

---

## WHAT SOURCERY IS NOT (updated)

- Not an escrow service — never say escrow
- Not a payment processor
- Not a logistics company  
- Not a QC coordination service — not hands-on
- Not a sourcing agent
- Not a factory directory only
- Not enterprise software at a lower price
- Not a WhatsApp replacement — we solve more than communication
- Not just for new brands — the problem exists at every stage
- Not just for Vietnam — though Vietnam-native is a key advantage
- Not a general workspace/productivity tool — features only inside manufacturing workflow

