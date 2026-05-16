# SOURCERY SESSION BRIEF
## Single source of current build state — updated every session

*This file is overwritten at the end of every session.*
*Read this + SOURCERY_DOCTRINE.md at the start of every session before touching any code.*
*Last updated: 2026-05-16*

---

## 1. WHAT WAS BUILT — RECENT SESSIONS

### Session: Positioning rewrite + accuracy audit
**Homepage** — complete rewrite around new positioning
- Before: "Enterprise supply chain tools built for yours" + feature grid
- After: "Everything your factory relationship needs" + three-situation framework + lifecycle strip + guidance layer section + financial protection dark section
- Three situations: Don't have a factory / Have one not sure / Have one I trust

**All marketing pages** — new positioning applied
- WhySourcery, Features, About, HowItWorks, Factories, CaseStudies, Brands, Intelligence, Alternatives, Auth, Footer — all updated
- Old: supply chain tools / enterprise tools / manufacturing OS
- New: factory relationship infrastructure / the category was missing

**Accuracy fixes**
- Removed: "escrow" language everywhere → "milestone-gated payments"
- Removed: "12 verified completed orders" stat (fake — zero real orders exist)
- Changed: "verified manufacturers" → "registered manufacturers" (9 files)
- Changed: "white-label PDF exports" → "branded document exports"

**Navigation fixes**
- /marketplace → /directory across 6 pages
- Analytics + Compliance added to app nav
- FAQ tier names: Builder→Growth, Pro→Scale

**Onboarding Step 2**
- Before: "Where are you in your journey?" + 4 generic options
- After: "What's your factory situation?" + 3 situations with sub-descriptions

**SOURCERY_DOCTRINE.md** — created at repo root
- Complete positioning history and why each phase changed
- What we do/don't do (payments, verification, exports)
- Tier features and pricing
- Voice and tone
- Key decisions and reasoning
- Current platform status

### Session: AI features + personalised dashboard
**PersonalisedDashboard.tsx** — new component
- Before: Every new user sees same generic "How Sourcery works" card
- After: Three distinct roadmaps based on factory situation from onboarding
  - no_factory: 5-step find-a-factory roadmap
  - not_sure: 5-step verify-and-protect roadmap  
  - have_factory: 5-step invite-and-run roadmap
- Checkable steps, progress dots, localStorage persistence, disappears when complete
- Wired into BrandDashboard empty state

**ProactiveGuidance.tsx** — new component
- Before: AI only answers when asked — passive chatbot
- After: Platform reads order data and generates contextual alert automatically
- Types: warning (amber) / action (primary) / info (neutral)
- Urgency levels with pulse animation for high urgency
- Dismissable per order+status combo
- Wired into OrderDetail above production countdown

**MessageDrafter.tsx** — new component
- Before: Brands write factory messages from scratch
- After: AI drafts English + Vietnamese simultaneously
- 8 situation presets, 3 tone options, specific context field
- Copy + use-in-message integration
- Wired into OrderDetail right column above messaging thread

---

## 2. CURRENT PLATFORM STATE

### What is working:
- Core order loop: create → PO → accept → milestones → QC → close ✓
- All 12 edge functions deployed ✓
- Intelligence layer: countdown, health, safety stock, OTIF, reorder ✓
- AI toolkit: all wired to Anthropic API, no mock data ✓
- Platform messaging with real translation ✓
- Trade tools: all interactive, real data ✓
- Directory: code correct ✓
- PersonalisedDashboard: three situations, checkable roadmaps ✓
- ProactiveGuidance: contextual AI alerts on order pages ✓
- MessageDrafter: English + Vietnamese drafting ✓
- Homepage: new positioning, three situations, guidance layer ✓
- All marketing pages: new positioning ✓
- SOURCERY_DOCTRINE.md: created ✓

### What is NOT working / not real yet:
- Factory directory: empty (needs HU LA Studios added) ✗
- OTIF scores: no real orders to calculate from ✗
- Lead time benchmarks: no real order history ✗
- Stripe payments: keys not confirmed set ✗
- Email notifications: RESEND_API_KEY not set ✗
- OrderDetail: renders 47+ components simultaneously regardless of status ✗
- AI guidance: generates generically, not rule-based triggers ✗
- Intelligence widgets: show empty states to new users ✗

### Blocking launch (Alex must do):
1. Set RESEND_API_KEY in Lovable secrets
2. Set Stripe keys in Lovable secrets
3. Run SQL_NEW_FEATURES.sql in Lovable SQL Editor
4. Sign up OKIO as brand + HU LA Studios as factory
5. Run one complete OKIO order end to end
6. Renew GitHub PAT (token: ghp_REDACTED — may expire)
7. Submit sitemap to Google Search Console

---

## 3. MASTER BUILD LIST

### TIER 0 — Blocking launch (Alex only, no code)
- [ ] Set RESEND_API_KEY in Lovable secrets
- [ ] Set Stripe keys in Lovable secrets
- [ ] Run SQL_NEW_FEATURES.sql in Lovable SQL Editor
- [ ] Sign up OKIO as brand + HU LA Studios as factory
- [ ] Run one complete OKIO order end to end
- [ ] Submit sitemap to Google Search Console

### TIER 1 — Building now (this session)
- [ ] 1.1 Status-based OrderDetail rendering — show 4-6 components per status, not 47
- [ ] 1.2 AI rule engine — 5 specific proactive triggers (silent factory, delivery compression, payment gate, spec conflict, overdue stage)
- [ ] 1.3 Inline PO wizard guidance — incoterms, AQL, milestone explainers, Tet warning
- [ ] 1.4 Tech pack completeness checklist inline during order creation
- [ ] 1.5 First message template at PO issue
- [ ] 1.6 Dashboard intelligence gating — hide empty widgets from new users
- [ ] 1.7 Production Intelligence workspace — full AI workspace with context injection
- [x] PersonalisedDashboard — three-situation roadmaps ✓ DONE
- [x] ProactiveGuidance — contextual AI alerts ✓ DONE
- [x] MessageDrafter — English + Vietnamese drafting ✓ DONE

### TIER 2 — Next (weeks 2-3)
- [ ] 2.1 Order Room — each order as tabbed living workspace
- [ ] 2.2 Factory Notes — auto-generated living document per factory
- [ ] 2.3 WhatsApp ingestion — forward thread, AI extracts decisions
- [ ] 2.4 Due diligence checklist in factory selection flow
- [ ] 2.5 Collection planning board — seasonal kanban above order list
- [ ] 2.6 Shopify CSV import — parse sales data, auto-populate safety stock

### TIER 3 — Months 2-3 (needs order history)
- [ ] 3.1 Shopify full OAuth integration
- [ ] 3.2 Public factory trust badge — embeddable OTIF score
- [ ] 3.3 Auto-generated factory knowledge base from real orders
- [ ] 3.4 Post-order debrief and learning summary
- [ ] 3.5 Level 2 AI pattern-based alerts using factory history

### TIER 4 — Future (confirmed direction, timing TBD)
- [ ] 4.1 Shopify App Store submission
- [ ] 4.2 Supply chain financing referrals
- [ ] 4.3 Factory performance data product
- [ ] 4.4 GMV-based fee model (requires payment partner)
- [ ] 4.5 Factory-side paid features
- [ ] 4.6 Digital Product Passport export

### NEVER BUILD — confirmed decisions
- ✗ Escrow / payment processing
- ✗ QC coordination as a service
- ✗ Hands-on managed operations beyond Sourcery Managed
- ✗ Competitor names on website
- ✗ Aggregate platform stats before real orders exist
- ✗ General workspace unconnected to manufacturing workflow

### MARKETING BUILD LIST
- [ ] Write first LinkedIn post — "What I see brands get wrong on their first Vietnam order"
- [ ] Post weekly operational content from Alex's personal account
- [ ] Document OKIO case study with real numbers
- [ ] Set up Zalo OA for factory notifications (ZALO_OA_TOKEN)
- [ ] Register Sourcery trademark USPTO ~$350
- [ ] Incorporate Sourcery as separate legal entity
- [ ] Rewrite features page around problem moments not feature categories
- [ ] Add specific AI story to homepage (what it caught, what it prevented)
- [ ] Sharpen pricing page around what each tier prevents, not what it includes

---

## 4. CONFIRMED DECISIONS THIS SESSION

- Revenue model: SaaS + Sourcery Managed + future GMV fee + future data product
- No QC coordination service (not hands-on)
- No escrow / milestone-gated payments only
- Three situations as core navigation framework
- Order Room as the Notion/Huly implementation — manufacturing-specific only
- AI workspace = Production Intelligence workspace, full page not widget
- SESSION_BRIEF.md created — overwritten every session
- Doctrine is only confirmed decisions — not recommendations or suggestions

---

## 5. FIRST ACTION NEXT SESSION

Read SESSION_BRIEF.md and SOURCERY_DOCTRINE.md first.
Then start with: **1.1 Status-based OrderDetail rendering** — highest UX impact, unblocks everything else.
Token for push: ghp_REDACTED

---

## 6. THE ONE NUMBER THAT MATTERS

**Completed orders on the platform: 0**

Everything changes when this is 10.
