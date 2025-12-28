# Curated Factory Marketplace - Frontend Architecture

## Overview

A subscription-gated B2B marketplace connecting vetted factories with brands. This document defines all screens, components, user flows, and API specifications for headless frontend implementation.

---

## Navigation Structure

```
/ (Home)
├── /directory (Factory Marketplace)
│   └── /directory/:slug (Factory Profile)
├── /apply (Factory Application)
├── /pricing (Subscription Tiers)
├── /auth (Login/Signup)
├── /dashboard (Role-based Dashboard)
│   ├── Brand Dashboard
│   ├── Factory Dashboard
│   └── Admin Panel
├── /checkout/:tierId (Subscription Checkout)
└── /how-it-works, /about, /contact, /faq (Existing pages)
```

---

## 1. Factory Directory Page (`/directory`)

### Purpose
The main marketplace browsing experience for brands to discover vetted factories.

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (existing)                                           │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ HERO: "Discover Vetted Manufacturing Partners"         │ │
│ │ Search bar + Quick filters                              │ │
│ └─────────────────────────────────────────────────────────┘ │
├──────────────┬──────────────────────────────────────────────┤
│ SIDEBAR      │ MAIN CONTENT                                 │
│ Filters      │ ┌──────┐ ┌──────┐ ┌──────┐                  │
│ ─────────    │ │ Card │ │ Card │ │ Card │                  │
│ Factory Type │ └──────┘ └──────┘ └──────┘                  │
│ ☐ Mass Prod  │ ┌──────┐ ┌──────┐ ┌──────┐                  │
│ ☐ Boutique   │ │ Card │ │ Card │ │ Card │                  │
│ ☐ Artisan    │ └──────┘ └──────┘ └──────┘                  │
│              │                                              │
│ Categories   │ [Load More / Pagination]                     │
│ ☐ Apparel    │                                              │
│ ☐ Footwear   │                                              │
│ ☐ Accessories│                                              │
│              │                                              │
│ MOQ Range    │                                              │
│ [===●===]    │                                              │
│              │                                              │
│ Location     │                                              │
│ [Dropdown]   │                                              │
│              │                                              │
│ Certs        │                                              │
│ ☐ ISO 9001   │                                              │
│ ☐ BSCI       │                                              │
│ ☐ OEKO-TEX   │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Components

#### `DirectoryHero`
- Headline: "Discover Vetted Manufacturing Partners"
- Subheadline: "Browse our curated network of certified factories, boutique workshops, and artisan producers"
- Search input (debounced, 300ms)
- Quick filter pills: "All", "Mass Production", "Boutique", "Artisan"

#### `FilterSidebar`
| Filter | Type | Options |
|--------|------|---------|
| Factory Type | Checkbox group | mass_production, boutique, artisan |
| Categories | Checkbox group | Dynamic from API |
| MOQ Range | Range slider | 0 - 10,000+ |
| Lead Time | Range slider | 1 - 12+ weeks |
| Location | Multi-select dropdown | Countries |
| Certifications | Checkbox group | Dynamic from API |
| Verified Only | Toggle | true/false |

#### `FactoryCard`
```
┌────────────────────────────────────┐
│ [Factory Image]                    │
│ ┌────────────────────────────────┐ │
│ │ 🏭 Mass Production  ✓ Verified │ │
│ │ Factory Name                   │ │
│ │ 📍 Guangzhou, China            │ │
│ │                                │ │
│ │ Categories: Apparel, Knitwear  │ │
│ │ MOQ: 500 units | Lead: 4 weeks │ │
│ │                                │ │
│ │ [ISO] [BSCI] [OEKO-TEX]        │ │
│ │                                │ │
│ │ [♡ Save]          [View →]     │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

### States

| State | UI |
|-------|-----|
| Loading | Skeleton grid (6-12 cards) |
| Empty (no results) | Illustration + "No factories match your filters" + Reset button |
| Empty (no data) | Illustration + "Factories coming soon" + CTA to apply |
| Error | Error banner + Retry button |
| Success | Factory card grid |
| Unauthenticated | Cards visible, "View" opens pricing gate modal |

### API Specification

#### `GET /api/factories`

**Query Parameters:**
```typescript
interface FactoryListParams {
  search?: string;           // Full-text search
  type?: string[];           // Factory types: mass_production | boutique | artisan
  categories?: string[];     // Category slugs
  certifications?: string[]; // Certification slugs
  countries?: string[];      // ISO country codes
  moq_min?: number;
  moq_max?: number;
  lead_time_min?: number;    // Weeks
  lead_time_max?: number;
  verified_only?: boolean;
  sort_by?: 'newest' | 'completeness' | 'response_time';
  page?: number;
  per_page?: number;         // Default: 12
}
```

**Response:**
```typescript
interface FactoryListResponse {
  data: FactoryPreview[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

interface FactoryPreview {
  id: string;
  slug: string;
  name: string;
  type: 'mass_production' | 'boutique' | 'artisan';
  location: {
    city: string;
    country: string;
    country_code: string;
  };
  cover_image_url: string;
  categories: string[];
  moq_min: number;
  lead_time_weeks: number;
  certifications: CertificationBadge[];
  is_verified: boolean;
  completeness_score: number; // 0-100
  created_at: string;
}

interface CertificationBadge {
  slug: string;
  name: string;
  icon_url?: string;
}
```

#### `GET /api/filters`

**Response:**
```typescript
interface FiltersResponse {
  categories: { slug: string; name: string; count: number }[];
  certifications: { slug: string; name: string; count: number }[];
  countries: { code: string; name: string; count: number }[];
  factory_types: { slug: string; name: string; count: number }[];
}
```

---

## 2. Factory Profile Page (`/directory/:slug`)

### Purpose
Detailed factory profile showcasing capabilities, team, media, and certifications.

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ HERO                                                    │ │
│ │ [Cover Image / Video]                                   │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Factory Name           ✓ Verified  🏭 Mass Prod    │ │ │
│ │ │ 📍 Guangzhou, China                                 │ │ │
│ │ │ [Save ♡] [Share] [Request Quote - CTA]              │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ TABS: Overview | Capabilities | Team | Gallery | Documents  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ TAB CONTENT (see below)                                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ STICKY FOOTER (mobile): [Request Quote]                     │
└─────────────────────────────────────────────────────────────┘
```

### Tab Content

#### Overview Tab
```
┌──────────────────────────┬──────────────────────────────────┐
│ ABOUT                    │ QUICK STATS                      │
│ Company story and        │ ┌────────────┬────────────┐      │
│ description text...      │ │ Founded    │ 2008       │      │
│                          │ │ Employees  │ 150+       │      │
│                          │ │ Facility   │ 5,000 sqm  │      │
│                          │ │ Response   │ < 24 hrs   │      │
│                          │ └────────────┴────────────┘      │
├──────────────────────────┼──────────────────────────────────┤
│ SPECIALIZATIONS          │ CERTIFICATIONS                   │
│ • Women's Apparel        │ [ISO 9001] [BSCI] [OEKO-TEX]     │
│ • Sustainable Fashion    │ Click to view certificate        │
│ • Technical Fabrics      │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

#### Capabilities Tab
```
┌─────────────────────────────────────────────────────────────┐
│ PRODUCTION CAPABILITIES                                     │
│ ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│ │ MOQ          │ Lead Time    │ Capacity     │ Sampling   │ │
│ │ 500 units    │ 4-6 weeks    │ 50,000/mo    │ 2-3 weeks  │ │
│ └──────────────┴──────────────┴──────────────┴────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ PRODUCT CATEGORIES                                          │
│ [Dresses] [Tops] [Outerwear] [Knitwear] [Activewear]        │
├─────────────────────────────────────────────────────────────┤
│ SERVICES OFFERED                                            │
│ ✓ Full Package (FPP)    ✓ CMT          ✓ Sampling          │
│ ✓ Pattern Making        ✓ Fabric Sourcing  ✓ Quality Control│
├─────────────────────────────────────────────────────────────┤
│ PAYMENT TERMS                                               │
│ 30% deposit, 70% before shipment | T/T, L/C accepted       │
├─────────────────────────────────────────────────────────────┤
│ PRICING TRANSPARENCY                                        │
│ Sample cost: $50-150 depending on complexity                │
│ Bulk pricing: Available upon request                        │
└─────────────────────────────────────────────────────────────┘
```

#### Team Tab
```
┌─────────────────────────────────────────────────────────────┐
│ MEET THE TEAM                                               │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │ [Photo]  │ │ [Photo]  │ │ [Photo]  │ │ [Photo]  │        │
│ │ Name     │ │ Name     │ │ Name     │ │ Name     │        │
│ │ Founder  │ │ Sales    │ │ QC Lead  │ │ Design   │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────────────────┘
```

#### Gallery Tab
```
┌─────────────────────────────────────────────────────────────┐
│ FACTORY MEDIA                                               │
│ [Filter: All | Photos | Videos]                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│ │      │ │      │ │ ▶️   │ │      │ │      │               │
│ │      │ │      │ │      │ │      │ │      │               │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘               │
│ ┌──────┐ ┌──────┐ ┌──────┐                                  │
│ │      │ │      │ │      │                                  │
│ └──────┘ └──────┘ └──────┘                                  │
│                                                             │
│ Click to open lightbox / video player                       │
└─────────────────────────────────────────────────────────────┘
```

#### Documents Tab
```
┌─────────────────────────────────────────────────────────────┐
│ CERTIFICATIONS & DOCUMENTS                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📄 ISO 9001:2015          Expires: Dec 2025  [View]     │ │
│ │ 📄 BSCI Audit Report      Audited: Mar 2024  [View]     │ │
│ │ 📄 OEKO-TEX Standard 100  Valid              [View]     │ │
│ │ 📄 Business License       Verified           [View]     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ⚠️ Document viewing requires active subscription            │
└─────────────────────────────────────────────────────────────┘
```

### Subscription Gating Logic

| User State | Access Level |
|------------|--------------|
| Not logged in | Overview only, blurred capabilities, "Subscribe to view" overlay |
| Logged in, no subscription | Overview + partial capabilities, upgrade CTA |
| Starter tier | Full profile, limited contact (3/month counter shown) |
| Growth tier | Full profile, unlimited contact, save factory |
| Enterprise tier | Everything + priority badge on inquiries |

### API Specification

#### `GET /api/factories/:slug`

**Response:**
```typescript
interface FactoryDetailResponse {
  id: string;
  slug: string;
  name: string;
  type: 'mass_production' | 'boutique' | 'artisan';
  status: 'approved' | 'pending' | 'rejected'; // Only show approved
  is_verified: boolean;
  completeness_score: number;
  
  // Location
  location: {
    address?: string;        // Gated
    city: string;
    region?: string;
    country: string;
    country_code: string;
  };
  
  // Company Info
  about: {
    description: string;
    story?: string;          // Gated
    founded_year?: number;
    employee_count?: string; // "50-100", "100-200", etc.
    facility_size?: string;  // "5,000 sqm"
    response_time?: string;  // "< 24 hours"
  };
  
  // Capabilities - Partially gated
  capabilities: {
    moq_min: number;
    moq_max?: number;
    lead_time_min: number;   // Weeks
    lead_time_max?: number;
    monthly_capacity?: number;
    sampling_time?: string;
    services: string[];      // Gated: full list
    payment_terms?: string;  // Gated
    sample_cost_range?: string; // Gated
  };
  
  // Categories
  categories: {
    slug: string;
    name: string;
  }[];
  
  // Specializations
  specializations: string[];
  
  // Team - Gated
  team: TeamMember[];
  
  // Media
  media: {
    cover_image_url: string;
    cover_video_url?: string;
    gallery: MediaItem[];    // Gated: full gallery
  };
  
  // Certifications
  certifications: Certification[];
  
  // Documents - Gated
  documents: Document[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url?: string;
  bio?: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  caption?: string;
  order: number;
}

interface Certification {
  slug: string;
  name: string;
  icon_url?: string;
  expires_at?: string;
  document_url?: string;    // Gated
}

interface Document {
  id: string;
  type: 'license' | 'certification' | 'audit_report' | 'other';
  name: string;
  url: string;              // Gated
  uploaded_at: string;
}
```

#### `POST /api/factories/:slug/save`

**Request:**
```typescript
// Requires authentication + subscription
interface SaveFactoryRequest {
  factory_id: string;
}
```

**Response:**
```typescript
interface SaveFactoryResponse {
  saved: boolean;
  saved_at: string;
}
```

---

## 3. Factory Application Page (`/apply`)

### Purpose
Multi-step form for factories to apply for marketplace listing.

### Layout - Multi-Step Wizard
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
├─────────────────────────────────────────────────────────────┤
│ Apply to Join Our Network                                   │
│ ───────────────────────────────────────────────────────────│
│ PROGRESS: ●───●───●───●───○───○                             │
│           1   2   3   4   5   6                             │
│         Basic Prod Team Media Docs Review                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ STEP CONTENT (see below)                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [← Back]                              [Save Draft] [Next →] │
└─────────────────────────────────────────────────────────────┘
```

### Steps

#### Step 1: Basic Information
```
Factory Name *              [________________________]
Factory Type *              (●) Mass Production
                            ( ) Boutique Workshop
                            ( ) Artisan/Local Craft

Location
  Country *                 [Dropdown_______________]
  City *                    [________________________]
  Full Address              [________________________]

About Your Factory *        [                        ]
                            [    Textarea 500 char   ]
                            [________________________]

Year Founded                [____]
Number of Employees         [Dropdown: 1-10, 10-50, ...]
Facility Size (sqm)         [________]

Website (optional)          [________________________]
```

#### Step 2: Production Capabilities
```
Product Categories *        ☐ Apparel - Womenswear
(Select all that apply)     ☐ Apparel - Menswear
                            ☐ Apparel - Childrenswear
                            ☐ Footwear
                            ☐ Accessories
                            ☐ Bags & Leather Goods
                            ☐ Swimwear
                            ☐ Activewear
                            ☐ Other: [__________]

Minimum Order Quantity *    [________] units

Lead Time *                 [____] to [____] weeks

Monthly Capacity            [________] units/month

Services Offered *          ☐ Full Package (FPP)
                            ☐ CMT (Cut-Make-Trim)
                            ☐ Sampling Only
                            ☐ Pattern Making
                            ☐ Fabric Sourcing
                            ☐ Quality Control
                            ☐ Packaging

Specializations             [Tags input: e.g., Sustainable, Technical...]
```

#### Step 3: Team Information
```
Add Your Team Members (at least 1 required)

┌─────────────────────────────────────────────────────────────┐
│ [+ Add Team Member]                                         │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐│
│ │ [📷 Upload Photo]  Name: [________________]              ││
│ │                    Role: [Dropdown: Owner, Sales, ...]   ││
│ │                    Bio:  [Short bio optional...]         ││
│ │                                              [🗑️ Remove] ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

#### Step 4: Media Upload
```
Cover Image * 
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     [Drag & drop or click to upload]                        │
│     Recommended: 1920x1080, max 5MB                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Factory Gallery (min 3 images recommended)
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐
│  📷  │ │  📷  │ │  📷  │ │  📷  │ │ + Add    │
│      │ │      │ │      │ │      │ │          │
└──────┘ └──────┘ └──────┘ └──────┘ └──────────┘

Video (optional)
┌─────────────────────────────────────────────────────────────┐
│ YouTube/Vimeo URL: [_____________________________________]  │
│ OR                                                          │
│ [Upload Video - max 100MB]                                  │
└─────────────────────────────────────────────────────────────┘
```

#### Step 5: Documents & Certifications
```
Business License *
┌─────────────────────────────────────────────────────────────┐
│ [📄 Upload PDF/Image]                                       │
└─────────────────────────────────────────────────────────────┘

Certifications (more = higher trust score!)
┌─────────────────────────────────────────────────────────────┐
│ Select certifications you have:                             │
│                                                             │
│ ☐ ISO 9001        [Upload]  Expiry: [Date picker]          │
│ ☐ ISO 14001       [Upload]  Expiry: [Date picker]          │
│ ☐ BSCI            [Upload]  Audit date: [Date picker]      │
│ ☐ SEDEX           [Upload]                                  │
│ ☐ OEKO-TEX        [Upload]                                  │
│ ☐ GOTS            [Upload]                                  │
│ ☐ WRAP            [Upload]                                  │
│ ☐ SA8000          [Upload]                                  │
│ ☐ Other: [______] [Upload]                                  │
└─────────────────────────────────────────────────────────────┘

Additional Documents (optional)
• Audit reports
• Factory floor plans
• Quality control procedures
[+ Add Document]

💡 Tip: The more documentation you provide, the higher your 
   trust score and chances of approval!
```

#### Step 6: Review & Submit
```
┌─────────────────────────────────────────────────────────────┐
│ COMPLETENESS SCORE: ████████████░░░░ 78%                    │
│                                                             │
│ ✓ Basic Information - Complete                              │
│ ✓ Production Capabilities - Complete                        │
│ ✓ Team (2 members added)                                    │
│ ⚠ Media (5 images, no video - add video for +5%)            │
│ ✓ Business License - Uploaded                               │
│ ⚠ Certifications (2 of 8 common ones)                       │
└─────────────────────────────────────────────────────────────┘

PREVIEW OF YOUR LISTING
[Collapsed preview card that expands]

Terms & Conditions
☐ I confirm all information is accurate and I am authorized 
  to represent this factory.
☐ I agree to the Terms of Service and Privacy Policy.

┌─────────────────────────────────────────────────────────────┐
│                    [Submit Application]                      │
└─────────────────────────────────────────────────────────────┘

After submission, our team will review your application within 
3-5 business days. You'll receive an email notification.
```

### States

| State | UI |
|-------|-----|
| Loading | Skeleton form |
| Draft saved | Toast: "Draft saved" + timestamp |
| Validation error | Inline errors + scroll to first error |
| Upload in progress | Progress bar on file |
| Upload failed | Error message + retry |
| Submit loading | Button loading state, form disabled |
| Submit success | Redirect to confirmation page |
| Submit error | Error banner + retry |

### API Specification

#### `POST /api/applications`

**Request (multipart/form-data for files):**
```typescript
interface FactoryApplicationRequest {
  // Step 1
  name: string;
  type: 'mass_production' | 'boutique' | 'artisan';
  country: string;
  city: string;
  address?: string;
  description: string;
  founded_year?: number;
  employee_count?: string;
  facility_size?: string;
  website?: string;
  
  // Step 2
  categories: string[];
  moq_min: number;
  moq_max?: number;
  lead_time_min: number;
  lead_time_max?: number;
  monthly_capacity?: number;
  services: string[];
  specializations?: string[];
  
  // Step 3
  team: {
    name: string;
    role: string;
    bio?: string;
    photo?: File;
  }[];
  
  // Step 4
  cover_image: File;
  gallery_images?: File[];
  video_url?: string;
  video_file?: File;
  
  // Step 5
  business_license: File;
  certifications?: {
    type: string;
    file: File;
    expiry_date?: string;
  }[];
  additional_documents?: {
    name: string;
    file: File;
  }[];
  
  // Step 6
  terms_accepted: boolean;
}
```

**Response:**
```typescript
interface ApplicationResponse {
  id: string;
  status: 'pending';
  completeness_score: number;
  submitted_at: string;
  estimated_review_date: string;
}
```

#### `PUT /api/applications/:id/draft`

Save partial progress (same shape, partial data allowed)

#### `GET /api/applications/:id`

Get saved draft or submitted application

---

## 4. Pricing Page (`/pricing`)

### Purpose
Display subscription tiers for brands to access the marketplace.

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│        Unlock Access to Vetted Manufacturing Partners       │
│     Choose the plan that fits your sourcing needs           │
│                                                             │
│  [Monthly ○]  [Annual ● Save 20%]                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────────┐ ┌─────────────┐        │
│ │ STARTER     │ │ GROWTH          │ │ ENTERPRISE  │        │
│ │             │ │ ★ Most Popular  │ │             │        │
│ │ $49/mo      │ │ $149/mo         │ │ Custom      │        │
│ │             │ │                 │ │             │        │
│ │ ✓ Browse    │ │ ✓ Everything in │ │ ✓ Everything│        │
│ │ ✓ 3 inquiries│ │   Starter      │ │   in Growth │        │
│ │ ✓ Basic     │ │ ✓ Unlimited     │ │ ✓ Dedicated │        │
│ │   profiles  │ │   inquiries    │ │   sourcing  │        │
│ │             │ │ ✓ Full profiles│ │ ✓ Priority  │        │
│ │             │ │ ✓ Save favorites│ │   support  │        │
│ │             │ │ ✓ Doc access   │ │ ✓ Custom    │        │
│ │             │ │                 │ │   integratn │        │
│ │ [Start]     │ │ [Start]         │ │ [Contact]   │        │
│ └─────────────┘ └─────────────────┘ └─────────────┘        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ FEATURE COMPARISON TABLE                                    │
│ ───────────────────────────────────────────────────────────│
│ Feature              │ Starter │ Growth │ Enterprise        │
│ ─────────────────────┼─────────┼────────┼──────────────────│
│ Browse directory     │ ✓       │ ✓      │ ✓                │
│ View basic profiles  │ ✓       │ ✓      │ ✓                │
│ Full factory profiles│ Limited │ ✓      │ ✓                │
│ Monthly inquiries    │ 3       │ ∞      │ ∞                │
│ Save factories       │ 5       │ ∞      │ ∞                │
│ View documents/certs │ ✗       │ ✓      │ ✓                │
│ Priority in responses│ ✗       │ ✗      │ ✓                │
│ Dedicated sourcing   │ ✗       │ ✗      │ ✓                │
│ API access           │ ✗       │ ✗      │ ✓                │
│ ─────────────────────┼─────────┼────────┼──────────────────│
├─────────────────────────────────────────────────────────────┤
│ FAQ ACCORDION                                               │
│ ▶ Can I upgrade or downgrade anytime?                       │
│ ▶ What payment methods do you accept?                       │
│ ▶ Is there a free trial?                                    │
│ ▶ Can I cancel anytime?                                     │
└─────────────────────────────────────────────────────────────┘
```

### API Specification

#### `GET /api/subscription-tiers`

**Response:**
```typescript
interface SubscriptionTiersResponse {
  tiers: SubscriptionTier[];
  billing_periods: {
    monthly: { discount: 0 };
    annual: { discount: 20 };
  };
}

interface SubscriptionTier {
  id: string;
  slug: 'starter' | 'growth' | 'enterprise';
  name: string;
  description: string;
  price_monthly: number;      // In cents
  price_annual: number;       // In cents (full year)
  is_popular: boolean;
  is_custom: boolean;         // Enterprise = contact us
  features: {
    browse_directory: boolean;
    basic_profiles: boolean;
    full_profiles: boolean | 'limited';
    monthly_inquiries: number | 'unlimited';
    saved_factories: number | 'unlimited';
    document_access: boolean;
    priority_responses: boolean;
    dedicated_sourcing: boolean;
    api_access: boolean;
  };
  cta_text: string;
  cta_url: string;
}
```

---

## 5. Subscription Checkout (`/checkout/:tierId`)

### Purpose
Stripe-powered checkout for subscription payment.

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (minimal)                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│ │ ORDER SUMMARY           │ │ PAYMENT                     │ │
│ │                         │ │                             │ │
│ │ Growth Plan             │ │ Email                       │ │
│ │ Billed annually         │ │ [_______________________]   │ │
│ │                         │ │                             │ │
│ │ Subtotal    $1,788/yr   │ │ Card Information            │ │
│ │ Discount    -$357 (20%) │ │ [Stripe Card Element    ]   │ │
│ │ ─────────────────────── │ │                             │ │
│ │ Total       $1,431/yr   │ │ Billing Address             │ │
│ │             ($119/mo)   │ │ [Country dropdown       ]   │ │
│ │                         │ │ [ZIP/Postal             ]   │ │
│ │ ✓ Cancel anytime        │ │                             │ │
│ │ ✓ 7-day money back      │ │                             │ │
│ │                         │ │ [Subscribe Now - $1,431/yr] │ │
│ │                         │ │                             │ │
│ │                         │ │ 🔒 Secured by Stripe        │ │
│ └─────────────────────────┘ └─────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### States

| State | UI |
|-------|-----|
| Loading tier | Skeleton |
| Invalid tier | Redirect to /pricing |
| Form validation | Inline errors |
| Processing payment | Button loading, form disabled |
| Payment success | Redirect to /dashboard with success toast |
| Payment failed | Error message (from Stripe) |
| 3D Secure | Stripe modal |

### API Specification

#### `POST /api/subscriptions/checkout`

**Request:**
```typescript
interface CheckoutRequest {
  tier_id: string;
  billing_period: 'monthly' | 'annual';
  payment_method_id: string;  // From Stripe.js
  email: string;
  billing_address: {
    country: string;
    postal_code: string;
  };
}
```

**Response:**
```typescript
interface CheckoutResponse {
  subscription_id: string;
  client_secret?: string;     // For 3D Secure if needed
  status: 'active' | 'requires_action' | 'failed';
  redirect_url?: string;
}
```

---

## 6. Authentication (`/auth`)

### Purpose
Login and signup for brands and factories.

### Layout - Login State
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Welcome Back                             │
│                                                             │
│           ┌─────────────────────────────────┐               │
│           │ Email                           │               │
│           │ [____________________________]  │               │
│           │                                 │               │
│           │ Password                        │               │
│           │ [____________________________]  │               │
│           │                                 │               │
│           │ [Forgot password?]              │               │
│           │                                 │               │
│           │ [        Sign In        ]       │               │
│           │                                 │               │
│           │ ──────── or ────────            │               │
│           │                                 │               │
│           │ [🔵 Continue with Google]       │               │
│           │ [⚫ Continue with LinkedIn]     │               │
│           │                                 │               │
│           │ Don't have an account?          │               │
│           │ [Sign up as Brand]              │               │
│           │ [Apply as Factory →]            │               │
│           └─────────────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Layout - Signup State
```
┌─────────────────────────────────────────────────────────────┐
│                    Create Your Account                      │
│                                                             │
│           I am a...                                         │
│           ┌─────────────┐  ┌─────────────┐                  │
│           │ 👔 Brand    │  │ 🏭 Factory  │                  │
│           │ Looking for │  │ Looking for │                  │
│           │ manufacturers│  │ clients    │                  │
│           └─────────────┘  └─────────────┘                  │
│                                                             │
│           ┌─────────────────────────────────┐               │
│           │ Full Name                       │               │
│           │ [____________________________]  │               │
│           │                                 │               │
│           │ Company Name                    │               │
│           │ [____________________________]  │               │
│           │                                 │               │
│           │ Work Email                      │               │
│           │ [____________________________]  │               │
│           │                                 │               │
│           │ Password                        │               │
│           │ [____________________________]  │               │
│           │                                 │               │
│           │ [       Create Account      ]   │               │
│           │                                 │               │
│           │ By signing up, you agree to our │               │
│           │ Terms and Privacy Policy        │               │
│           └─────────────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### API Specification

#### `POST /api/auth/login`

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'brand' | 'factory' | 'admin';
    company_name?: string;
    avatar_url?: string;
  };
  access_token: string;
  refresh_token: string;
  expires_at: number;
}
```

#### `POST /api/auth/signup`

**Request:**
```typescript
interface SignupRequest {
  name: string;
  email: string;
  password: string;
  company_name: string;
  role: 'brand' | 'factory';
}
```

#### `POST /api/auth/oauth/:provider`

Initiate OAuth flow (google, linkedin)

---

## 7. Brand Dashboard (`/dashboard`)

### Purpose
Dashboard for subscribed brands to manage their account and interactions.

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
├──────────────────┬──────────────────────────────────────────┤
│ SIDEBAR          │ MAIN CONTENT                             │
│                  │                                          │
│ 👤 Company Name  │ TABS: Overview | Saved | Inquiries | Settings │
│    Brand         │                                          │
│                  │ ┌─────────────────────────────────────┐  │
│ ─────────────    │ │ SUBSCRIPTION STATUS                 │  │
│ 📊 Overview      │ │ Growth Plan • Active                │  │
│ ♡ Saved (12)     │ │ Next billing: Jan 15, 2025          │  │
│ 📨 Inquiries (5) │ │ [Manage Subscription]               │  │
│ ⚙️ Settings      │ └─────────────────────────────────────┘  │
│                  │                                          │
│ ─────────────    │ ┌─────────────────────────────────────┐  │
│ [Browse          │ │ QUICK STATS                         │  │
│  Directory →]    │ │ Factories Viewed: 47                │  │
│                  │ │ Factories Saved: 12                 │  │
│                  │ │ Inquiries Sent: 5                   │  │
│                  │ │ Responses Received: 3               │  │
│                  │ └─────────────────────────────────────┘  │
│                  │                                          │
│                  │ ┌─────────────────────────────────────┐  │
│                  │ │ RECENT ACTIVITY                     │  │
│                  │ │ • You saved "ABC Factory"           │  │
│                  │ │ • Response from "XYZ Textiles"      │  │
│                  │ │ • Inquiry sent to "123 Apparel"     │  │
│                  │ └─────────────────────────────────────┘  │
└──────────────────┴──────────────────────────────────────────┘
```

### Saved Factories Tab
```
┌─────────────────────────────────────────────────────────────┐
│ SAVED FACTORIES (12)                     [Sort: Recently Saved] │
├─────────────────────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│ │ Card │ │ Card │ │ Card │ │ Card │                        │
│ └──────┘ └──────┘ └──────┘ └──────┘                        │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│ │ Card │ │ Card │ │ Card │ │ Card │                        │
│ └──────┘ └──────┘ └──────┘ └──────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Inquiries Tab
```
┌─────────────────────────────────────────────────────────────┐
│ MY INQUIRIES                          [Filter: All Statuses] │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🏭 ABC Textiles          Status: ● Responded            │ │
│ │ "Looking for knitwear production..."                    │ │
│ │ Sent: Dec 20, 2024       [View Conversation →]          │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🏭 XYZ Manufacturing     Status: ○ Pending              │ │
│ │ "Need 5000 units of cotton t-shirts..."                 │ │
│ │ Sent: Dec 18, 2024       [View Details →]               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### API Specification

#### `GET /api/dashboard/brand`

**Response:**
```typescript
interface BrandDashboardResponse {
  user: UserProfile;
  subscription: {
    tier: SubscriptionTier;
    status: 'active' | 'past_due' | 'cancelled';
    current_period_end: string;
    cancel_at_period_end: boolean;
  } | null;
  stats: {
    factories_viewed: number;
    factories_saved: number;
    inquiries_sent: number;
    responses_received: number;
  };
  recent_activity: ActivityItem[];
  usage: {
    inquiries_used: number;
    inquiries_limit: number | 'unlimited';
    saved_factories: number;
    saved_limit: number | 'unlimited';
  };
}
```

#### `GET /api/saved-factories`

**Response:**
```typescript
interface SavedFactoriesResponse {
  data: (FactoryPreview & { saved_at: string })[];
  meta: PaginationMeta;
}
```

#### `GET /api/inquiries`

**Response:**
```typescript
interface InquiriesResponse {
  data: Inquiry[];
  meta: PaginationMeta;
}

interface Inquiry {
  id: string;
  factory: {
    id: string;
    slug: string;
    name: string;
    cover_image_url: string;
  };
  status: 'pending' | 'responded' | 'closed';
  subject: string;
  message_preview: string;
  created_at: string;
  last_response_at?: string;
}
```

---

## 8. Factory Dashboard (`/dashboard`)

### Purpose
Dashboard for factories to manage their profile and inquiries.

### Layout - Approved Factory
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
├──────────────────┬──────────────────────────────────────────┤
│ SIDEBAR          │ MAIN CONTENT                             │
│                  │                                          │
│ 🏭 Factory Name  │ TABS: Overview | Profile | Inquiries | Analytics │
│    ✓ Verified    │                                          │
│                  │ ┌─────────────────────────────────────┐  │
│ ─────────────    │ │ PROFILE STATUS                      │  │
│ 📊 Overview      │ │ ✓ Approved • Public                 │  │
│ ✏️ Edit Profile  │ │ Completeness: 85%                   │  │
│ 📨 Inquiries (8) │ │ [View Public Profile →]             │  │
│ 📈 Analytics     │ └─────────────────────────────────────┘  │
│ ⚙️ Settings      │                                          │
│                  │ ┌─────────────────────────────────────┐  │
│                  │ │ THIS MONTH                          │  │
│                  │ │ Profile Views: 234                  │  │
│                  │ │ Times Saved: 12                     │  │
│                  │ │ Inquiries Received: 8               │  │
│                  │ │ Response Rate: 87%                  │  │
│                  │ └─────────────────────────────────────┘  │
│                  │                                          │
│                  │ ┌─────────────────────────────────────┐  │
│                  │ │ NEW INQUIRIES (3)                   │  │
│                  │ │ [Inquiry cards...]                  │  │
│                  │ └─────────────────────────────────────┘  │
└──────────────────┴──────────────────────────────────────────┘
```

### Layout - Pending Factory
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 🕐 APPLICATION UNDER REVIEW                         │   │
│   │                                                     │   │
│   │ Thank you for applying! Our team is reviewing       │   │
│   │ your application. You'll receive an email within    │   │
│   │ 3-5 business days.                                  │   │
│   │                                                     │   │
│   │ Completeness Score: 78%                             │   │
│   │ ████████████████░░░░                                │   │
│   │                                                     │   │
│   │ 💡 Tip: Adding more documents increases your        │   │
│   │    chances of approval.                             │   │
│   │                                                     │   │
│   │ [Edit Application]  [Add More Documents]            │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Profile Editor
Multi-section editor matching the application form, allowing updates to:
- Basic information
- Capabilities
- Team members (add/edit/remove)
- Media gallery (add/remove/reorder)
- Documents and certifications

### API Specification

#### `GET /api/dashboard/factory`

**Response:**
```typescript
interface FactoryDashboardResponse {
  factory: FactoryDetailResponse;
  application_status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  stats: {
    profile_views: number;
    times_saved: number;
    inquiries_received: number;
    response_rate: number;
  };
  new_inquiries: InquiryReceived[];
}
```

#### `PUT /api/factories/:id`

Update factory profile (same shape as application, partial allowed)

#### `GET /api/factories/:id/inquiries`

**Response:**
```typescript
interface FactoryInquiriesResponse {
  data: InquiryReceived[];
  meta: PaginationMeta;
}

interface InquiryReceived {
  id: string;
  brand: {
    id: string;
    name: string;
    company_name: string;
    avatar_url?: string;
  };
  subject: string;
  message: string;
  product_details?: string;
  quantity?: number;
  timeline?: string;
  attachments?: string[];
  status: 'pending' | 'responded' | 'closed';
  created_at: string;
  response?: {
    message: string;
    created_at: string;
  };
}
```

#### `POST /api/inquiries/:id/respond`

**Request:**
```typescript
interface InquiryResponseRequest {
  message: string;
  attachments?: File[];
}
```

---

## 9. Admin Panel (`/admin`)

### Purpose
Internal dashboard for your team to manage factory applications and platform.

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ADMIN HEADER                                                │
├──────────────────┬──────────────────────────────────────────┤
│ SIDEBAR          │ MAIN CONTENT                             │
│                  │                                          │
│ 📊 Dashboard     │ Depending on selected section...        │
│ 🏭 Applications  │                                          │
│    • Pending (7) │                                          │
│    • Approved    │                                          │
│    • Rejected    │                                          │
│ 👥 Users         │                                          │
│ 💳 Subscriptions │                                          │
│ 📁 Categories    │                                          │
│ 📜 Certifications│                                          │
│ ⚙️ Settings      │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

### Applications Review
```
┌─────────────────────────────────────────────────────────────┐
│ PENDING APPLICATIONS (7)                                    │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ABC Textiles Ltd.              Applied: Dec 15, 2024    │ │
│ │ 📍 Guangzhou, China           Type: Mass Production     │ │
│ │ Score: 85%  📄 12 docs  📸 8 images  👥 4 team members  │ │
│ │                                                         │ │
│ │ [View Full Application]  [✓ Approve] [✗ Reject]         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Application Detail View
```
┌─────────────────────────────────────────────────────────────┐
│ [← Back to Applications]                                    │
├─────────────────────────────────────────────────────────────┤
│ ABC Textiles Ltd.                     Score: 85%            │
│ Applied: Dec 15, 2024                                       │
├─────────────────────────────────────────────────────────────┤
│ TABS: Overview | Documents | Media | Team                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Tab content with all submitted information]                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ADMIN NOTES (internal)                                      │
│ [Add note...]                                               │
│                                                             │
│ - Dec 16: Verified business license ✓ - Admin1             │
│ - Dec 16: Called for video verification - Admin2           │
├─────────────────────────────────────────────────────────────┤
│ DECISION                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ( ) Approve - Factory will be listed immediately        │ │
│ │ ( ) Approve with note - Send approval with feedback     │ │
│ │ ( ) Reject - Provide reason (required)                  │ │
│ │                                                         │ │
│ │ Reason/Note: [________________________________]         │ │
│ │                                                         │ │
│ │                              [Cancel] [Submit Decision] │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### API Specification

#### `GET /api/admin/applications`

**Query Parameters:**
```typescript
interface AdminApplicationsParams {
  status?: 'pending' | 'approved' | 'rejected';
  search?: string;
  sort_by?: 'newest' | 'oldest' | 'completeness';
  page?: number;
}
```

**Response:**
```typescript
interface AdminApplicationsResponse {
  data: ApplicationSummary[];
  meta: PaginationMeta;
  counts: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

interface ApplicationSummary {
  id: string;
  factory_name: string;
  type: string;
  location: { city: string; country: string };
  completeness_score: number;
  document_count: number;
  image_count: number;
  team_count: number;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

#### `GET /api/admin/applications/:id`

Full application details

#### `POST /api/admin/applications/:id/decision`

**Request:**
```typescript
interface ApplicationDecisionRequest {
  decision: 'approve' | 'reject';
  note?: string;              // Required if reject
  internal_notes?: string;
}
```

---

## 10. Inquiry Flow (Modal/Page)

### Purpose
Allow brands to send RFQ to factories.

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Request Quote from ABC Textiles                      [✕]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Product Category *        [Dropdown_______________]         │
│                                                             │
│ Product Description *                                       │
│ [                                                    ]      │
│ [  Describe what you're looking to produce...        ]      │
│ [____________________________________________________]      │
│                                                             │
│ Estimated Quantity *      [________] units                  │
│                                                             │
│ Target Timeline           [Dropdown: ASAP, 1-2 months, ...] │
│                                                             │
│ Target Price (optional)   $[________] per unit              │
│                                                             │
│ Attachments (optional)                                      │
│ [📎 Upload tech pack, reference images...]                  │
│                                                             │
│ Additional Notes                                            │
│ [____________________________________________________]      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                           [Cancel]  [Send Inquiry]          │
└─────────────────────────────────────────────────────────────┘
```

### Subscription Gate Modal
If user is not subscribed:
```
┌─────────────────────────────────────────────────────────────┐
│                                                      [✕]    │
│                                                             │
│        🔒 Subscribe to Contact Factories                    │
│                                                             │
│   Unlock access to our vetted manufacturing network:        │
│                                                             │
│   ✓ Contact unlimited factories (Growth plan)               │
│   ✓ View full profiles and documents                        │
│   ✓ Save and compare your favorites                         │
│                                                             │
│   Starting at $49/month                                     │
│                                                             │
│   [View Plans →]                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### API Specification

#### `POST /api/inquiries`

**Request:**
```typescript
interface CreateInquiryRequest {
  factory_id: string;
  category: string;
  description: string;
  quantity: number;
  timeline?: string;
  target_price?: number;
  attachments?: File[];
  notes?: string;
}
```

**Response:**
```typescript
interface CreateInquiryResponse {
  id: string;
  status: 'pending';
  created_at: string;
}
```

---

## Component Library

### Shared Components

| Component | Description |
|-----------|-------------|
| `FactoryCard` | Preview card for directory listings |
| `FactoryTypeBadge` | Colored badge: Mass Production / Boutique / Artisan |
| `VerifiedBadge` | Green checkmark for verified factories |
| `CertificationBadge` | Small badge showing certification logo/name |
| `CompletenessScore` | Progress bar showing profile completeness |
| `PriceTag` | Formatted price display |
| `InquiryStatusBadge` | Status indicator: Pending / Responded / Closed |
| `SubscriptionBadge` | Current subscription tier indicator |
| `FileUpload` | Drag-and-drop file uploader with preview |
| `ImageGallery` | Grid gallery with lightbox |
| `VideoPlayer` | Embedded video player (YouTube/Vimeo/direct) |
| `TeamMemberCard` | Team member display with photo and bio |
| `FilterSidebar` | Reusable filter sidebar with various input types |
| `LoadingState` | Skeleton loaders for each content type |
| `EmptyState` | Illustrated empty states with CTAs |
| `ErrorState` | Error displays with retry actions |
| `SubscriptionGate` | Modal/overlay for gated content |
| `ProgressWizard` | Multi-step form progress indicator |

---

## State Management

### Global State (Context/Store)

```typescript
interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Subscription
  subscription: Subscription | null;
  hasAccess: (feature: string) => boolean;
  
  // UI
  isSubscriptionGateOpen: boolean;
  gatedAction: (() => void) | null;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'brand' | 'factory' | 'admin';
  company_name?: string;
  avatar_url?: string;
  factory_id?: string;  // If role is factory
}

interface Subscription {
  id: string;
  tier: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled';
  features: SubscriptionFeatures;
  usage: SubscriptionUsage;
}
```

### Feature Access Control

```typescript
const FEATURE_ACCESS = {
  'view_basic_profile': ['starter', 'growth', 'enterprise'],
  'view_full_profile': ['growth', 'enterprise'],
  'view_documents': ['growth', 'enterprise'],
  'contact_factory': ['starter', 'growth', 'enterprise'],
  'unlimited_contacts': ['growth', 'enterprise'],
  'save_factory': ['starter', 'growth', 'enterprise'],
  'unlimited_saves': ['growth', 'enterprise'],
  'priority_support': ['enterprise'],
};
```

---

## Error Handling

### API Error Response Format

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;  // Field-level errors
}

// Common error codes
type ErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SUBSCRIPTION_REQUIRED'
  | 'USAGE_LIMIT_EXCEEDED'
  | 'SERVER_ERROR';
```

### Error UI Patterns

| Error Type | UI Treatment |
|------------|--------------|
| Network error | Toast + retry button |
| 401 Unauthorized | Redirect to /auth |
| 403 Forbidden | Error page or modal |
| 404 Not Found | 404 page |
| Validation | Inline field errors |
| Subscription required | Gate modal |
| Usage limit | Usage limit modal with upgrade CTA |
| Server error | Error page with support contact |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, bottom nav, stacked cards |
| Tablet | 640-1024px | 2-column cards, collapsible sidebar |
| Desktop | > 1024px | 3-4 column cards, fixed sidebar |

---

## Performance Considerations

1. **Image Optimization**: All images should be served via CDN with responsive srcsets
2. **Lazy Loading**: Gallery images, below-fold content
3. **Infinite Scroll**: Directory listing with virtual scrolling for large result sets
4. **Debounced Search**: 300ms debounce on search input
5. **Optimistic Updates**: Save/unsave actions
6. **Cache Strategy**: Filter options, user profile, subscription status

---

## Security Notes

1. **API Authentication**: Bearer token in Authorization header
2. **CORS**: Configured for frontend domain only
3. **Rate Limiting**: Applied to all endpoints
4. **File Upload**: Validate file types, max sizes (images: 5MB, videos: 100MB, docs: 10MB)
5. **Input Sanitization**: All user inputs sanitized before display
6. **Subscription Verification**: Server-side check for all gated features

---

This document serves as the complete frontend specification for headless implementation. All data interactions assume external API endpoints following the shapes defined above.
