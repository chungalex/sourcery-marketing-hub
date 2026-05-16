# SOURCERY SESSION LOG
*Read this + SOURCERY_DOCTRINE.md at the start of every session.*
*Overwrite this file at the end of every session.*
*Last updated: 2026-05-16 — Session 12*

---

## WHAT JUST SHIPPED

### Session 11 — Positioning rewrite + accuracy audit
- Homepage: complete rewrite around "Everything your factory relationship needs"
- Three-situation framework live across homepage + onboarding
- Lifecycle strip (13 stages) on homepage
- Financial protection dark section on homepage
- All marketing pages updated to new positioning (9 files)
- Escrow language removed everywhere → "milestone-gated payments"
- "12 verified completed orders" stat removed (was fake)
- "Verified manufacturers" → "registered manufacturers" (9 files)
- "White-label PDF exports" → "branded document exports"
- /marketplace → /directory across 6 pages
- Analytics + Compliance added to app nav
- FAQ tier names updated: Builder→Growth, Pro→Scale
- Onboarding Step 2: "What's your factory situation?" + three situations
- SOURCERY_DOCTRINE.md created at repo root

### Session 12 — AI features + personalised dashboard
- PersonalisedDashboard.tsx — three distinct roadmaps by factory situation
- ProactiveGuidance.tsx — AI reads order state, speaks first without being asked
- MessageDrafter.tsx — generates English + Vietnamese factory messages simultaneously
- All wired into BrandDashboard and OrderDetail

---

## CURRENT PLATFORM STATE

### WORKING — real and functional:
- Core order loop: create → PO → accept → milestones → QC → close
- All 12 edge functions deployed
- Intelligence layer: countdown, order health, safety stock, OTIF, reorder
- AI toolkit: all wired to Anthropic API, no mock data
- Platform messaging with real translation
- Trade tools: tariff calculator, margin calculator, HTS codes, FTA guide
- PersonalisedDashboard: three roadmaps by situation
- ProactiveGuidance: AI watches order state, fires contextual alerts
- MessageDrafter: English + Vietnamese generation
- 22 SEO pages in sitemap

### NOT REAL YET — built but no data:
- Factory directory (code correct, database empty — needs HU LA Studios added)
- OTIF scores (no real orders to calculate from)
- Lead time benchmarks (no real order history)
- Intelligence features that need order history (safety stock, reorder)

### BLOCKING LAUNCH — must do before external users:
1. Set RESEND_API_KEY in Lovable secrets (all emails silent)
2. Set Stripe keys in Lovable secrets (no paid upgrades possible)
3. Run SQL_NEW_FEATURES.sql in Lovable SQL Editor
4. Sign up OKIO as real brand account
5. Sign up HU LA Studios as real factory
6. Run one complete OKIO order end to end
7. Submit sitemap to Google Search Console

---

## FULL BUILD QUEUE

### TIER 0 — Config blocking launch (Alex does these, not code)
- [ ] Set RESEND_API_KEY in Lovable secrets
- [ ] Set Stripe keys in Lovable secrets
- [ ] Run SQL_NEW_FEATURES.sql in Lovable SQL Editor
- [ ] Sign up OKIO as real brand
- [ ] Sign up HU LA Studios as real factory
- [ ] Run one complete OKIO order end to end
- [ ] Submit sitemap to Google Search Console
- [ ] Renew GitHub PAT (expires each container session)

### TIER 1 — Build this week (highest impact for first real users)
- [ ] 1.1 Status-based OrderDetail rendering (1-2 days)
      Show 4-6 components based on order status, not all 47 simultaneously
- [ ] 1.2 AI rule engine: 5 specific proactive triggers (2-3 days)
      Silent factory / delivery compression / payment gate / spec conflict / overdue stage
      Each with specific action + one-click message drafter pre-populated
- [ ] 1.3 Inline PO wizard guidance (1-2 days)
      Incoterms explainer / AQL explainer / milestone protection logic / Tet warning
- [ ] 1.4 Tech pack completeness checklist inline (1 day)
      Appears after upload in Step 2, flags missing fields with cost of skipping
- [ ] 1.5 First message template at PO issue (half day)
      Pre-populated professional message, editable, one click to use
- [ ] 1.6 Dashboard intelligence gating (1 day)
      Hide empty intelligence widgets for new users, show roadmap instead
- [ ] 1.7 Production Intelligence Workspace / AI Workspace (1 week)
      Full page at /intelligence or /workspace
      Left panel: what AI is watching (active orders, health, open issues)
      Right panel: conversation — AI opens first with specific current situation
      Context injection from Supabase on every conversation
      Not a chatbot — a thinking partner that knows the operation

### TIER 2 — Weeks 2-3
- [ ] 2.1 Order Room — each order as living workspace (1 week)
      Tabbed navigation: Overview / Timeline / Messages / Documents / QC / Payments / Shipping
      Only active tabs for current status. Reorganises existing components.
- [ ] 2.2 Factory Notes — living document per factory (3-4 days)
      Auto-updated when order closes: actual lead time, defects, revision rounds
      Manually editable: quirks, contacts, lessons learned
- [ ] 2.3 WhatsApp ingestion (3-4 weeks)
      Forward thread to Sourcery email → AI extracts decisions → confirm as change orders
      Biggest factory adoption barrier removed
- [ ] 2.4 Due diligence checklist in factory selection (1-2 days)
      Inline prompt when viewing factory profile or typing BYOF invite
      5 questions, why each matters, what answers to watch for
- [ ] 2.5 Collection planning board (1 week)
      Seasonal kanban above order list: SS26 / FW26 columns
      Style cards link to production orders
- [ ] 2.6 Shopify CSV import (2 days)
      Upload Shopify export → parse sales velocity → auto-populate safety stock

### TIER 3 — Months 2-3 (requires real order data first)
- [ ] 3.1 Shopify full OAuth integration (3-4 weeks)
      After: 10+ brands using CSV import and asking for automatic sync
- [ ] 3.2 Public factory trust badge (1 week)
      Embeddable badge for factory websites: OTIF score + completed orders
      After: 5+ factories with 5+ completed orders each
- [ ] 3.3 Auto-generated factory knowledge base (1 week)
      Closes automatically from real order data. After: first 5 real orders
- [ ] 3.4 Post-order debrief and learning summary (3-4 days)
      AI debrief when order closes: actual vs projected, what to do differently
- [ ] 3.5 Level 2 AI pattern-based alerts (2-3 weeks)
      Factory-specific historical patterns in alerts. After: 5+ orders per factory

### TIER 4 — Future (confirmed direction, timing TBD)
- [ ] Shopify App Store submission (after 20+ brands using full OAuth)
- [ ] Supply chain financing referrals (after 200+ brands with payment history)
- [ ] Factory performance data product (after 500+ completed orders)
- [ ] GMV-based Protected Order fee (after payment partner confirmed + volume)
- [ ] Factory-side paid features (after factories actively using + asking for premium)
- [ ] Digital Product Passport export (after EU requirements firm up)

---

## REQUIRES YOUR ACTION (Alex only)

**This week — nothing else matters:**
1. Call 5 warm brand founder contacts personally — not email, call
2. Complete all Tier 0 config items above
3. Post one Vietnam/tariff LinkedIn article (specific, operational, no product pitch)

**This month:**
4. Register Sourcery trademark USPTO ~$350
5. Incorporate Sourcery as separate legal entity (Delaware LLC minimum)
6. Set up Zalo OA Token for Vietnam factory notifications
7. Sign up for Shopify Partner account (needed for App Store later)

---

## DECISIONS MADE — CONFIRMED BY ALEX

**Confirmed YES:**
- Three-situation framework as core positioning
- Starter / Growth / Scale tier names and pricing ($0 / $49 / $149)
- BYOF as primary positioning over marketplace
- Notion/Huly features inside manufacturing workflow only — Order Room concept
- Shopify integration on roadmap — CSV import first, OAuth second
- AI workspace as a full dedicated page, not a widget
- Collection planning board — Huly-style seasonal kanban
- WhatsApp ingestion — highest-leverage adoption feature
- Factory Notes — auto-generated from real orders

**Confirmed NO:**
- No escrow / no holding funds / never say "escrow"
- No QC coordination as a service — not hands-on
- No competitor names on website — generic descriptions only
- No fake stats — no aggregate platform data until real orders exist
- No "verified manufacturers" — say "registered" until verification process exists
- No "white-label PDF exports" — say "branded document exports" until built

**Still open — not yet decided:**
- Exact Protected Order fee model (flat fee vs GMV % vs included in subscription)
- Factory-side monetisation timing and model
- Whether to lead with AI workspace in marketing or keep it as platform depth
- TAM numbers for investor conversations (need tight sourcing before using)
- Digital Product Passport timeline claims (avoid specific dates until confirmed)

---

## THE ONE METRIC THAT MATTERS
**Orders tracked on the platform.**
Zero orders = zero of everything else.
100 completed orders = flywheel started.
500 completed orders = data product is real.
The entire build plan serves one purpose: making real brands run real orders.

