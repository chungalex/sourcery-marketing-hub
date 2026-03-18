# SOURCERY BUILD STATE
> This file is the single source of truth for any AI coding session.
> Read this first. Always. Before touching any code.
> Update this at the end of every session before pushing.

---

## OPENING PROMPT FOR NEXT SESSION

Paste this exactly to start any new session:

```
Read SOURCERY_BUILD_STATE.md from the repo first — it has everything.
Repo: chungalex/sourcery-marketing-hub
PAT: [get from Alex — do not store in repo]
Clone it, read the state file, confirm understanding, then continue the build.
Current priority: BYOF (Bring Your Own Factory) — see state file for exact spec.
Push every completed piece. Do not leave anything unpushed at end of session.
```

---

## WHAT SOURCERY IS

Manufacturing OS for physical product brands. Two modes that coexist:

- **Marketplace Mode** — brands discover vetted factories in the Sourcery network
- **OS Mode** — brands manage every order regardless of where the factory came from (BYOF)

The OS is the more important half. Together they form a flywheel: brands get value day one with their own factories, discover the network over time, never leave because all production history lives on Sourcery.

**One-line pitch:** "The manufacturing OS built by people who actually make things — starting with Vietnam."

**Unfair advantage:** Founding team operates HU LA Studios (factory in HCMC) and OKIO Denim (brand). Both sides of the table. Physical presence in Vietnamese manufacturing. Cannot be replicated remotely.

---

## WHO IT'S FOR

**Brands:** Emerging to mid-size apparel/physical product brands, 1–5 years in, 300–10,000 units per style. Currently managing production over WhatsApp and email. Have been burned before.

**Factories:** Vetted manufacturers in Vietnam, Cambodia, Indonesia, Bangladesh, Turkey, Portugal. BYOF factories invited by brands — not in curated network but get full OS functionality.

---

## NON-NEGOTIABLE ENGINEERING RULES

1. **No mock data ever rendered to real users.** `mockData.ts` is dev scaffolding only. Empty states instead.
2. **AI edge functions use real Supabase data only.** Never hallucinate factories. If DB is empty, return empty state.
3. **Order lifecycle is a state machine with hard gates:**
   - Sampling must be approved before bulk production can be funded
   - QC must pass before final milestone releases
   - Revision rounds must be acknowledged before next production milestone
   - These gates cannot be bypassed — not even by admin — without a logged exception in `order_state_history`
4. **BYOF is first-class.** Appears in onboarding wizard, brand dashboard empty state, and create order flow. Not a secondary option.
5. **Brand voice in all copy.** Minimal. Direct. Founder-to-founder. No "seamless," "powerful," "enterprise-grade," "robust," "game-changing." Empty states, prompts, errors — all read like someone who has been on a factory floor.
6. **Mobile-first for all factory-facing UI.** Factory dashboard, messaging, QC upload, production photo log — designed mobile-first, not desktop-first made responsive.
7. **Performance scoring runs on real data only.** Never display scores from mock or placeholder data.
8. **Every feature designed with data collection in mind.** Timestamps on every action. Actor logged for every state change. Defect types structured not free-text.
9. **The Vietnam narrative belongs in the product.** Origin story appears in onboarding, about page, empty states where appropriate.
10. **Push after every major piece.** Never leave work unpushed at end of session.

---

## TECH STACK

- **Frontend:** React + TypeScript + Vite, hosted on Lovable
- **Backend:** Supabase (Postgres + Auth + Realtime + Storage + Edge Functions)
- **Payments:** Stripe (milestone escrow)
- **AI:** Claude API (Haiku for factory matching)
- **Repo:** github.com/chungalex/sourcery-marketing-hub

---

## FULL ORDER LIFECYCLE (STATE MACHINE)

```
draft → po_issued → po_accepted → sample_sent → sample_approved / sample_revision
→ in_production → qc_scheduled → qc_uploaded → qc_pass / qc_fail
→ ready_to_ship → shipped → closed
Branches: disputed, cancelled
```

---

## WHAT IS BUILT AND CONFIRMED IN REPO

### Pages (src/pages/)
- `Home.tsx` — marketing homepage
- `Auth.tsx` — login/signup
- `Apply.tsx` — factory application
- `Directory.tsx` — factory directory (audit: may still use mockData)
- `FactoryProfile.tsx` — individual factory profile page
- `BrandDashboard.tsx` — brand dashboard (⚠️ FactoryCard still uses mockFactories — needs fix)
- `FactoryDashboard.tsx` — factory dashboard with real Supabase data
- `Admin.tsx` — admin panel
- `CreateOrder.tsx` — order creation flow (⚠️ factory selector needs BYOF grouping)
- `OrderDetail.tsx` — order detail with milestones, messaging, reviews, Stripe pay
- `FactoryAccept.tsx` — factory reviews and accepts/declines incoming PO → route: `/factory-accept/:orderId`
- `Checkout.tsx`, `Toolkit.tsx`, `Pricing.tsx`, `HowItWorks.tsx`, `Brands.tsx`, `Factories.tsx`, `CaseStudies.tsx`, `Consulting.tsx`, `About.tsx`, `FAQ.tsx`, `Contact.tsx`, `Privacy.tsx`, `Terms.tsx`, `NotFound.tsx`

### Components (src/components/)
- `ErrorBoundary.tsx` — wraps entire app
- `platform/PlatformMessaging.tsx` — real-time Supabase messaging per order
- `trust/FactoryReview.tsx` — star ratings (overall, quality, comms, delivery), wired into OrderDetail
- `ai/AIFactoryMatcher.tsx` — wired to `ai-factory-match` edge function with real factory data
- `dashboard/AnalyticsCharts.tsx` — analytics charts for factory dashboard

### Edge Functions (supabase/functions/)
- `order-action` — all order status transitions (create, issue_po, accept_po, start_production, schedule_qc, upload_qc, set_qc_result, mark_ready_to_ship, mark_shipped, close_order, open_dispute, resolve_dispute, assign_qc_partner, add_evidence, cancel_order)
- `ai-factory-match` — Claude Haiku: natural language → real factory rows → ranked matches with reasoning
- `convert-inquiry-to-order` — converts inquiry to draft order with milestones
- `stripe-checkout` — creates Stripe Checkout session per milestone
- `stripe-webhook` — marks milestone 'released' on payment success
- `get-signed-upload-url` / `get-signed-download-url` — secure document access

### Hooks
- `useAuth.ts` — real Supabase auth
- `useFactoryMembership.ts` — links user to factory

### Routes (App.tsx)
```
/ → Home
/auth → Auth
/apply → Apply
/dashboard → BrandDashboard
/dashboard/factory → FactoryDashboard
/admin → Admin
/directory → Directory
/directory/:slug → FactoryProfile
/orders/create → CreateOrder
/orders/:id → OrderDetail
/factory-accept/:orderId → FactoryAccept
/checkout → Checkout
/toolkit → Toolkit
+ standard marketing pages
```

### Migrations (supabase/migrations/)
- Full schema including: orders, order_milestones, order_state_history, order_evidence, order_qc_reports, order_qc_assignments, order_disputes, messages, factory_reviews, payments, factories, factory_memberships, inquiries, user_roles
- `20260305_messages.sql` — messages + factory_reviews tables with RLS + realtime

---

## WHAT IS NOT BUILT YET (PRIORITY ORDER)

### 🔴 IMMEDIATE — BYOF (Bring Your Own Factory)
This is the highest priority. Solves cold-start. First-class entry point.

**1. `factory_invites` migration**
Table: `inviter_id`, `factory_email`, `factory_name`, `country`, `category`, `token` (UUID), `status` (pending/accepted/expired), `expires_at`, `created_at`
RLS: brand can insert/read their own invites. Factory can read invite by token.
Also needs: `is_byof boolean` column on `factories` table, `invited_by uuid` FK to users.

**2. `factory-invite` edge function**
Actions: `send` (creates invite row, sends branded email with tokenized link), `accept` (validates token, creates factory account + membership, marks invite accepted), `list` (returns brand's sent invites with status)
Accept URL format: `/invite/accept?token=xxx`

**3. `BYOFInviteModal` component** (`src/components/byof/BYOFInviteModal.tsx`)
Form fields: factory name, contact email, country, category, optional personal note
On submit: calls `factory-invite` edge function with `send` action
Shows shareable accept link after send
Success state: "Invite sent to [email] — they'll get a link to join Sourcery and connect with you"

**4. BrandDashboard updates**
- Replace "Saved Factories" tab with "Your Factories" tab
- Tab shows: BYOF-invited factories with invite status (pending/accepted), "Invite a Factory" button
- Empty state (no factories, no invites): "You haven't invited any factories yet. Bring your existing factory relationships onto Sourcery." + primary CTA button
- Remove all mock data from FactoryCard — show empty state if no real data
- Stats card: replace "Saved Factories" count with "Your Factories" count (accepted BYOF invites)

**5. CreateOrder factory selector update**
- Group factories into two sections: "Your Factories" (BYOF) and "Sourcery Network"
- Both sections show identical functionality — no distinction in what you can do
- If brand has no factories yet: show BYOF invite prompt as primary CTA before marketplace browse
- Factory selector queries both network factories and brand's accepted BYOF factories

**6. `/invite/accept?token=xxx` — InviteAccept page** (`src/pages/InviteAccept.tsx`)
- Reads token from URL query param
- Calls `factory-invite` edge function with `accept` action
- If token valid: shows factory profile setup form (name pre-filled from invite)
- If already accepted: shows "already connected" state
- If expired: shows expiry message with "request a new invite" option
- On complete: redirects to `/dashboard/factory`
- Route: `/invite/accept` in App.tsx

**7. FactoryDashboard — Review PO link**
- In the orders/inquiries section, for any order with status `po_issued`, show a "Review PO" button
- Links to `/factory-accept/:orderId`
- Mobile-friendly — this is a factory-facing UI

### ✅ DONE — Sampling Stage
Hard gate between `po_accepted` and `in_production`. Fully built.

- `supabase/migrations/20260317_sampling.sql` — `sample_submissions` + `sample_revisions` tables with RLS
- `order-action` edge function — 4 new actions: `submit_sample`, `approve_sample`, `request_sample_revision`, `acknowledge_revision`
- `src/components/sampling/SampleSubmitForm.tsx` — factory-facing, mobile-first, photo URLs + measurements + notes + revision context
- `src/components/sampling/SampleReviewPanel.tsx` — brand-facing, full round history, approve/revision request UI, factory acknowledge
- `OrderDetail.tsx` — SampleReviewPanel injected for statuses: po_accepted, sample_sent, sample_approved, sample_revision
- `FactoryDashboard.tsx` — new Orders tab with PO review CTA, SampleSubmitForm for po_accepted/sample_revision, SampleReviewPanel for history

### ✅ DONE — Revision Rounds
- `supabase/migrations/20260318_revision_rounds.sql` — revision_rounds table with RLS, round_number, dispute/resolution fields
- order-action: submit_revision_round, acknowledge_revision_round, dispute_revision_round, resolve_revision_round
- `src/components/orders/RevisionRounds.tsx` — brand submits with description + timeline/cost impact; factory acknowledges or disputes; full round history
- OrderDetail.tsx — RevisionRounds injected for sample_approved → qc_uploaded
- BrandDashboard.tsx — mock data fully removed, replaced with real BYOF factories query (Your Factories tab)

### ✅ DONE — Tech Pack Versioning
- `supabase/migrations/20260318_tech_pack_versions.sql` — tech_pack_versions table with RLS
- order-action: upload_tech_pack_version, acknowledge_tech_pack_version
- `src/components/orders/TechPackVersions.tsx` — brand uploads URL + notes; factory sees alert + must confirm current version; full version history
- OrderDetail.tsx — TechPackVersions panel injected for all non-draft orders
- FactoryDashboard.tsx — TechPackVersions injected in Orders tab expanded section
- AI tech pack risk flagging deferred to future (needs ai-tech-pack-reviewer edge function)

### ✅ DONE — Defect Reporting
- `supabase/migrations/20260318_defect_reports.sql` — defect_reports table with RLS
- order-action: file_defect_report, respond_to_defect
- `src/components/orders/DefectReports.tsx` — severity selector (minor/major/critical), type, quantity + auto % calc, photo URLs, factory response; summary bar; full report history
- OrderDetail.tsx — DefectReports panel injected for qc_scheduled onwards
- FactoryDashboard.tsx — DefectReports injected in Orders tab, factory responds inline

### ✅ DONE — Reorder Flow
- `src/components/orders/ReorderButton.tsx` — pre-fills quantity/price/currency/incoterms/tech pack from parent order, editable before submit, reorder_of link stored in specifications
- OrderDetail.tsx — ReorderButton injected for closed orders only

### ✅ DONE — Brand Onboarding Wizard
-  — 5-step wizard: welcome (Vietnam narrative), brand profile (name/category/volume), BYOF trigger (yes/no branch), factory invite form, first order CTA
-  — /onboarding route added
-  — new signups redirect to /onboarding instead of dashboard
- Brand profile saved to Supabase user metadata on completion

### ✅ DONE — Notification System
- `supabase/migrations/20260318_notifications.sql` — notifications table with RLS + realtime indexes
- `supabase/functions/send-notification/index.ts` — all 25 bible §15 triggers defined (brand, factory, admin)
- order-action: notify wired into accept_po, submit_sample, approve_sample, submit_revision_round, file_defect_report, upload_tech_pack_version
- `src/components/notifications/NotificationBell.tsx` — realtime badge, dropdown, mark read, links to order
- Header.tsx — NotificationBell injected into desktop nav

### 🔵 FUTURE
- Email notifications (Resend/SendGrid integration into send-notification function)
- Factory performance scoring (calculated from real order data)
- Order timeline view (visual, exportable as PDF)
- Production photo log
- Tech pack AI risk flagging (`ai-tech-pack-reviewer` edge function)
- AI RFQ Generator (`ai-rfq-generator` edge function)
- AI Quote Analyzer (`ai-quote-analyzer` edge function)
- Shipping/logistics tracking
- Currency FX lock at order creation
- Order duplication
- Factory response SLA tracking
- Side-by-side factory comparison
- Profile completeness scores (brand + factory)
- Referral system

---

## BUSINESS MODEL

**Primary:** Transaction fee (%) on every order — BYOF and network alike. Aligns incentives.
**Future Phase 2:** SaaS subscription tier for advanced AI features, priority matching, enhanced analytics.
**White-glove tier:** Project fee ($1,500–5,000) + transaction fee. Fully managed sourcing. HU LA Studios can be the manufacturing partner (disclosed clearly).

---

## GO-TO-MARKET

- **Brand Zero:** OKIO Denim — every feature validated against real production workflow
- **Factory Zero:** HU LA Studios' existing Vietnam factory partners — founding supply, pre-vetted
- **First 5 brands:** Vietnam-adjacent DTC founders in LA/NYC/London, USC network, cold outreach to Shopify brands <$5M with SEA manufacturer tags
- **Best sales tool:** Live demo of OKIO order on platform vs. current WhatsApp/email/WeTransfer workflow

---

## LAST UPDATED

Session: March 17, 2026
Built this session:
- `CreateOrder.tsx` — grouped factory selector: "Your Factories" (BYOF, is_byof=true) + "Sourcery Network" with SelectGroup/SelectLabel/SelectSeparator
- Added BYOF invite prompt in selector when brand has no own factories yet (links to dashboard)
- Added "Your Factory" badge on selected factory in Step 4 review card
- Added `is_byof` + `invited_by` fields to `Factory` type in `database.ts`
- BYOF is now 100% complete — all 7 items done

Next session starts with: Sampling Stage — `sample_submissions` + `sample_revisions` DB tables, new order states (sample_sent/sample_approved/sample_revision), factory sample upload form (mobile-first), brand sample review panel in OrderDetail

Session: March 17, 2026
Built this session:
- CreateOrder.tsx grouped factory selector (BYOF + Network)
- Sampling Stage — full build: migration, edge function actions, SampleSubmitForm, SampleReviewPanel, OrderDetail injection, FactoryDashboard Orders tab
Next session starts with: Revision Rounds — `revision_rounds` table, brand submits revision request, factory acknowledges or disputes
