# SOURCERY BUILD STATE — Updated Pre-Launch

## PLATFORM STATUS: LAUNCH READY

### Repo
- github.com/chungalex/sourcery-marketing-hub
- Latest: d42e636 (OTIF scoring + full marketing overhaul)
- Stack: React/TypeScript/Vite + Supabase + Stripe + Anthropic API
- Hosting: Lovable Cloud

---

## WHAT ACTUALLY WORKS (verified in code)

### Core order loop
- Signup → onboarding → create order → issue PO → factory accepts → milestones → QC → close
- All 18 order components wired and rendering in OrderDetail
- Factory invite email fires via factory-invite edge function
- Milestone-gated payments via order-action edge function

### Intelligence layer (all real, all wired)
- ProductionCountdown — backward scheduling from delivery date, 6 gates
- SafetyStockCalculator — Amazon formula, real lead time history
- OrderHealthDashboard — traffic light scoring on dashboard
- ReorderIntelligence — bullwhip prevention, factory capacity signals
- PaymentCalendar — cash flow visibility across all active orders
- HolidayAlert — Tet + Golden Week warnings with active order check

### AI tools (all wired to production-assistant edge function, NOT mock)
- Production assistant — full order context
- AIQuoteAnalyzer — real API
- AIRFQGenerator — real API
- AINegotiationCoach — real API
- AIFactoryMatcher — real API
- Message translation — upgraded from mymemory to production-assistant

### Trade tools (/trade-tools)
- TariffCalculator — 5 countries, real 2025 duty rates
- MarginCalculator — landed cost → wholesale → retail
- HTS code table — 15 categories, US/UK/EU rates
- FTA guide — CPTPP, EVFTA, VKFTA, RCEP

### Factory scoring
- OTIFScore — on-time/in-full from real completed orders
- Wired into FactoryProfile (full) and Directory (badge)

### SEO (22 pages in sitemap)
- /vietnam-manufacturing — targets "apparel factory Vietnam"
- /how-to-find-a-factory — targets "find garment factory" (HowTo JSON-LD)
- /alternatives — targets "Anvyl alternative"
- /trade-tools — targets "import duty calculator apparel"
- /compliance — CSDDD/UFLPA documentation

### Export
- OrderExportPDF — full PO as browser print PDF (NEW)
- ComplianceExport — JSON supply chain report
- OrderRecord (/record/:id) — shareable production record

---

## FEATURES REMOVED FROM PRICING (never existed)
- AI Tech Pack Reviewer (no component)
- White-label PDF exports (replaced with OrderExportPDF)
- Bill of materials tracker (never built)
- Freight document checklist (never built)
- Shipment tracking (no API integration)
- FX rate alerts (never built)
- Multi-supplier coordination (never built)
- AI dispute summary + PDF (never built)
- Duplicate "Reorder timing alerts" (was listed twice)

---

## MARKETING POSITIONING (FINAL)

### The pitch (one sentence)
"The supply chain tools enterprise brands use — built for brands doing 300 units."

### Supporting proof
Nike: backward scheduling → ProductionCountdown
Amazon: safety stock formula → SafetyStockCalculator  
Apple: factory scorecards → OTIFScore
Walmart: OTIF tracking → OrderHealthDashboard + OTIFScore
Nike/Inditex: control tower → OrderHealthDashboard

### The differentiator
We run HU LA Studios (factory in HCMC) and OKIO Denim (brand sourcing from Vietnam).
We built this because we needed it. No competitor can say that.

### Header nav (current)
Features | Intelligence | How it works | Trade tools | Pricing | Studio

---

## ACTIONS REQUIRED FROM ALEX (blocks launch)

1. RESEND_API_KEY in Lovable → Settings → Secrets [CRITICAL]
2. STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY in Lovable secrets [CRITICAL]
3. Sign up as OKIO at /auth [5 min]
4. Sign up HU LA Studios at /onboarding/factory [10 min]
5. Create one real OKIO order → issue PO to HU LA → test the loop [30 min]
6. Submit sitemap: search.google.com/search-console → sourcery.so/sitemap.xml [5 min]
7. Write and post the Vietnam tariff content on LinkedIn [30 min]

---

## NEXT CODE PRIORITIES (post-launch)

1. Shopify integration — product sell-through → reorder intelligence
2. Onboarding email sequence (day 0/3/7)
3. Factory profile completeness score
4. A/B test homepage headline
5. Supply chain finance referrals (year 2)
