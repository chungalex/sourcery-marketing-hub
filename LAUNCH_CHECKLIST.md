# Sourcery Launch Checklist
> Run this end-to-end before any external brand touches the platform.
> Two accounts required: one brand (OKIO), one factory (HU LA Studios).

---

## 1. Infrastructure — do these first, nothing works without them

- [ ] Run all pending Supabase migrations in order:
  - `20260317_sampling.sql`
  - `20260318_revision_rounds.sql`
  - `20260318_tech_pack_versions.sql`
  - `20260318_defect_reports.sql`
  - `20260318_notifications.sql`
- [ ] Set `STRIPE_SECRET_KEY` in Supabase Edge Function secrets
- [ ] Set `STRIPE_WEBHOOK_SECRET` in Supabase Edge Function secrets
- [ ] Set `ANTHROPIC_API_KEY` in Supabase Edge Function secrets
- [ ] Set `RESEND_API_KEY` in Supabase Edge Function secrets (get from resend.com — free tier is 3,000 emails/month)
- [ ] Set `SITE_URL` in Supabase Edge Function secrets (e.g. https://sourcery.so) — used in email notification links
- [ ] Create Stripe account and configure webhook endpoint
- [ ] Seed at least 3 real factory records in the `factories` table
- [ ] Add DB status constraint (see SOURCERY_BUILD_STATE.md)

---

## 2. RLS security audit — verify data isolation

Run as brand user A, confirm you cannot see brand user B's data:
- [ ] `SELECT * FROM orders WHERE brand_user_id != auth.uid()` → 0 rows
- [ ] `SELECT * FROM sample_submissions` only returns submissions on own orders
- [ ] `SELECT * FROM tech_pack_versions` only returns versions on own orders
- [ ] `SELECT * FROM defect_reports` only returns reports on own orders
- [ ] `SELECT * FROM revision_rounds` only returns rounds on own orders
- [ ] `SELECT * FROM notifications WHERE user_id != auth.uid()` → 0 rows

Run as factory user, confirm you cannot see other factories' orders:
- [ ] `SELECT * FROM orders` only returns orders assigned to your factory
- [ ] Factory cannot read tech_pack_versions on orders not assigned to them

---

## 3. Full order lifecycle — run once with OKIO + HU LA

### Brand side
- [ ] Sign up as brand (OKIO)
- [ ] Invite HU LA Studios via BYOF invite flow
- [ ] Create order — verify HU LA appears under "Your Factories"
- [ ] Upload tech pack v1 — verify factory receives notification
- [ ] Issue PO — verify factory receives "New PO to review" notification

### Factory side  
- [ ] Accept factory invite via /invite/accept?token=xxx
- [ ] See order in FactoryDashboard → Orders tab
- [ ] Review and accept PO via /factory-accept/:orderId
- [ ] Confirm tech pack v1 (acknowledge)
- [ ] Submit sample round 1 with photos + measurements

### Brand side (continued)
- [ ] Receive "Sample ready for review" notification
- [ ] Request revision with specific notes
- [ ] Verify factory receives revision notification

### Factory side (continued)
- [ ] Acknowledge revision request
- [ ] Submit sample round 2

### Brand side (continued)
- [ ] Approve sample round 2
- [ ] Submit revision round (spec change during production)
- [ ] Upload tech pack v2 with change notes

### Factory side (continued)
- [ ] Confirm tech pack v2
- [ ] Acknowledge revision round

### Brand side (continued)
- [ ] Schedule QC
- [ ] File defect report (test minor + major)
- [ ] Verify factory receives defect notification

### Factory side (continued)
- [ ] Respond to defect reports

### Brand side (continued)
- [ ] Upload QC result (pass)
- [ ] Pay deposit milestone via Stripe Checkout
- [ ] Verify Stripe webhook fires and milestone marked released
- [ ] Pay final milestone
- [ ] Confirm shipped
- [ ] Leave factory review

---

## 4. Edge cases to manually verify

- [ ] Create order with no BYOF factories — verify invite prompt shows, not blank
- [ ] Try to access another user's order URL directly — should 404 or redirect
- [ ] Submit sample on an order in `draft` status — should fail gracefully
- [ ] Open AI factory matcher with empty factories table — should show empty state, not error
- [ ] Delete a message and verify it doesn't crash the messaging component
- [ ] Notification bell shows correct unread count after receiving notifications

---

## 5. Mobile checks (factory-facing is mobile-first)

- [ ] FactoryDashboard loads and is usable on mobile viewport (375px)
- [ ] SampleSubmitForm is thumb-friendly on mobile
- [ ] TechPackVersions acknowledge button is easily tappable
- [ ] DefectReports factory response form works on mobile
- [ ] Messaging interface is usable on mobile

---

## 6. Known issues to fix before launch

- [ ] BrandDashboard stats card still shows "Saved Factories" label — update to "Your Factories"
- [ ] Directory page — audit for any remaining mockData usage
- [ ] FactoryProfile page — audit for any remaining mockData usage
- [ ] Toolkit calculators — verify they are functional, not shells
- [ ] 404 page — confirm it catches all unmatched routes

---

## Sign-off

- [ ] Full order lifecycle completed without errors
- [ ] RLS audit passed
- [ ] All migrations run and confirmed
- [ ] Stripe test payment processed end-to-end
- [ ] Mobile factory flow verified

**Platform is launch-ready when all boxes are checked.**
