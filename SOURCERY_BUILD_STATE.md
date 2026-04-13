# SOURCERY BUILD STATE
> This file is the single source of truth for any AI coding session.
> Read this first. Always. Before touching any code.
> Update this at the end of every session before pushing.

---

## OPENING PROMPT FOR NEXT SESSION

```
Read SOURCERY_BUILD_STATE.md from the repo first — it has everything.
Repo: chungalex/sourcery-marketing-hub
Continue the build from current state below.
```

---

## WHAT SOURCERY IS

Manufacturing OS for physical product brands. Brands manage factory relationships — tech packs, sampling, milestone-gated payments, QC, full order lifecycle — from one place. Two modes: marketplace (discover factories) and OS (manage your own factories via BYOF).

**One-line pitch:** "Your production, documented. From first brief to final delivery."

**Unfair advantage:** Founding team runs HU LA Studios (factory in HCMC) and OKIO Denim (brand). Both sides of the table. Physical presence in Vietnam.

---

## TECH STACK

- Frontend: React + Vite + TypeScript + Tailwind + shadcn/ui
- Backend: Supabase (auth, DB, storage, edge functions)
- Email: Resend (RESEND_API_KEY in Supabase secrets)
- Hosting: Lovable (lovable.dev) — auto-syncs with GitHub
- Repo: github.com/chungalex/sourcery-marketing-hub
- Edge functions deployed via Lovable chat

---

## CURRENT BUILD STATE (April 2026)

### WHAT'S BUILT AND PUSHED

**Auth & Onboarding**
- Auth page: "Your production, documented." heading, brand/factory role split
- Onboarding: 3-step wizard (what are you making → journey stage → invite factory)
- Factory onboarding: multi-step with Zalo number field
- BYOF invite flow: factory-invite edge function, invite accept page

**Brand Dashboard**
- Orders tab with status-based filtering, needs-attention count
- Inquiries tab with inline messaging thread
- RFQs tab with full RFQ dashboard
- Factories tab (BYOF management)
- Tools tab: AI prompts, tech pack tools, production guides
- Settings tab
- Greeting uses brand_name from user metadata

**Create Order (4 steps)**
- Step 1: What are you making + who's producing it (order name, collection, factory)
- Step 2: The spec (style number, fabric, colourways, size range, construction notes, tech pack, BOM, category)
- Step 3: The deal (quantity, price, currency, FX lock, shipping destination, incoterms, delivery, milestones)
- Step 4: Quality & sign-off (QC method, AQL, samples, labels, packaging, message to factory)
- Smart prefill from last order
- Duplicate order from closed orders
- Delivery conflict warning

**Order Detail**
- Prominent Issue PO at top for drafts
- Order status guide (contextual guidance per status)
- Deadline backtrack calculator (production gates with on-track/overdue)
- SKU tracking (OrderSKUs component)
- Production photo log (ProductionPhotoLog component)  
- Timezone-aware approvals (TimezoneApproval component)
- Order timeline (OrderTimeline component)
- Shipment documents (ShipmentDocs component)
- Sample review panel, revision rounds, tech pack versions
- Defect reports, dispute filing
- Reorder intelligence
- PlatformMessaging (real-time, supports order/inquiry/rfq contexts)
- Collection/season tag in header

**Factory Dashboard**
- Active orders with sample submission, tech pack, defect response
- Inquiries with inline messaging thread + reply
- Profile editing
- Analytics tab
- OrderStatusGuide for each order status

**Factory Accept page** (/factory-accept/:orderId)
- Shows brand name and product name
- PO summary, milestones, accept/decline

**RFQ System**
- CreateRFQ: 2-step (product brief + factory selection)
- Off-network factory email (no Sourcery account needed to respond)
- RFQRespond: public page for factory quote submission
- RFQDashboard: quote comparison, Create PO button
- send-rfq edge function

**Managed Service**
- Studio page (/studio): who it's for, how it works, $2k/$3.5k pricing
- Added to main nav and homepage

**Other**
- GlobalSearch (Cmd+K): orders, factories, RFQs, inquiries
- NotificationBell with unread count
- ProductionCalendar with delivery dates
- TechPackGuidance (expandable checklist)
- TechPackVersions (PDF upload + URL)
- VA/ProductionAssistant (routes through production-assistant edge function)
- Resources hub (33 articles)
- Copy pass complete: founder-to-founder voice throughout

---

### SQL PENDING — RUN IN LOVABLE CLOUD → SQL EDITOR

See SQL_NEW_FEATURES.sql in repo root. Tables needed:
- order_skus
- production_photos  
- approval_requests
- shipment_docs
- brand_profiles
- messages columns: inquiry_id, rfq_id
- inquiries columns: factory_reply, replied_at

Also needed (may already be run):
- rfqs table
- rfq_recipients table

---

### EDGE FUNCTIONS NEEDED — DEPLOY IN LOVABLE CHAT

1. production-assistant (VA routing — critical for AI)
2. send-rfq (RFQ email sending)
3. send-notification (order event emails + Zalo)

All three exist in supabase/functions/ — paste code into Lovable chat to deploy.

---

### ENVIRONMENT VARIABLES NEEDED

In Lovable Cloud → Settings → Secrets:
- RESEND_API_KEY — for email notifications
- ZALO_OA_TOKEN — for Vietnam factory Zalo notifications (optional for now)
- SITE_URL — https://sourcery.so (or your Lovable preview URL)

---

### WHAT'S NOT DONE / KNOWN ISSUES

1. Core loop untested with real data — create order → issue PO → factory accepts → milestone released. This is the #1 priority to test.
2. Email delivery unconfirmed — RESEND_API_KEY must be set in secrets
3. Factory invite routing — after clicking invite link, factory should land on /onboarding/factory (coded, untested)
4. Demo factory "[DEMO] Factory Alpha" may still be in DB — delete it
5. Stripe not wired (checkout page exists but no keys set — correct, payments not needed yet)
6. Mobile optimization partial — create order improved, full mobile audit not done

---

### ARCHITECTURE DECISIONS MADE

- No transaction fees — pure SaaS subscription
- Pricing: Free (1 active order), $49/month Builder, $149/month Studio
- Factory listings not charged yet (wait for user base)
- Zalo integration built but token not configured — intentional
- brand_profiles table graceful fallback — saves to auth metadata if table missing
- Milestones: custom values now passed to order-action on submit (was using 30/70 default)
- Messages: single table supports order/inquiry/rfq via nullable FK columns

---

### NEXT PRIORITIES

1. Run pending SQL + deploy 3 edge functions
2. Test core loop with real OKIO order
3. Reach out to 3-5 brand founders for first managed/self-serve orders
4. Set RESEND_API_KEY in Lovable secrets to activate email
5. Build Zalo OA account when ready (oa.zalo.me)

