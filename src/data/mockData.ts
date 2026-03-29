// Mock data for the marketplace - simulating API responses

export type FactoryType = 'full_package' | 'specialist' | 'low_moq';
export type InquiryStatus = 'pending' | 'responded' | 'closed';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface CertificationBadge {
  slug: string;
  name: string;
  icon?: string;
}

export interface FactoryPreview {
  id: string;
  slug: string;
  name: string;
  type: FactoryType;
  location: {
    city: string;
    country: string;
    countryCode: string;
  };
  coverImageUrl: string;
  categories: string[];
  moqMin: number | null;
  leadTimeWeeks: number | null;
  certifications: CertificationBadge[];
  isVerified: boolean;
  completenessScore: number;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  bio?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
}

export interface FactoryDocument {
  id: string;
  type: 'license' | 'certification' | 'audit_report' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
}

export interface FactoryDetail extends FactoryPreview {
  about: {
    description: string;
    story?: string;
    foundedYear?: number;
    employeeCount?: string;
    facilitySize?: string;
    responseTime?: string;
  };
  capabilities: {
    moqMin: number;
    moqMax?: number;
    leadTimeMin: number;
    leadTimeMax?: number;
    monthlyCapacity?: number;
    samplingTime?: string;
    services: string[];
    paymentTerms?: string;
    sampleCostRange?: string;
  };
  specializations: string[];
  team: TeamMember[];
  media: {
    coverImageUrl: string;
    coverVideoUrl?: string;
    gallery: MediaItem[];
  };
  documents: FactoryDocument[];
}

export interface Category {
  slug: string;
  name: string;
  count?: number;
}

export interface SubscriptionTier {
  id: string;
  slug: 'starter' | 'growth' | 'enterprise';
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  isPopular: boolean;
  isCustom: boolean;
  features: {
    browseDirectory: boolean;
    basicProfiles: boolean;
    fullProfiles: boolean | 'limited';
    monthlyInquiries: number | 'unlimited';
    savedFactories: number | 'unlimited';
    documentAccess: boolean;
    priorityResponses: boolean;
    dedicatedSourcing: boolean;
    apiAccess: boolean;
  };
  ctaText: string;
}

// Mock Categories
export const mockCategories: Category[] = [
  { slug: 'apparel', name: 'Apparel' },


  { slug: 'footwear', name: 'Footwear' },
  { slug: 'accessories', name: 'Accessories' },
  { slug: 'bags-leather', name: 'Bags & Leather Goods' },
  { slug: 'swimwear', name: 'Swimwear' },
  { slug: 'activewear', name: 'Activewear' },
  { slug: 'knitwear', name: 'Knitwear' },
  { slug: 'denim', name: 'Denim' },
];

// Mock Certifications
export const mockCertifications: CertificationBadge[] = [
  { slug: 'iso-9001', name: 'ISO 9001' },
  { slug: 'iso-14001', name: 'ISO 14001' },
  { slug: 'bsci', name: 'BSCI' },
  { slug: 'sedex', name: 'SEDEX' },
  { slug: 'oeko-tex', name: 'OEKO-TEX' },
  { slug: 'gots', name: 'GOTS' },
  { slug: 'wrap', name: 'WRAP' },
  { slug: 'sa8000', name: 'SA8000' },
];

// Mock Countries
export const mockCountries = [
  { code: 'CN', name: 'China' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'IN', name: 'India' },
  { code: 'TR', name: 'Turkey' },
  { code: 'PT', name: 'Portugal' },
  { code: 'IT', name: 'Italy' },
  { code: 'ID', name: 'Indonesia' },
];

// Mock Factories
export const mockFactories: FactoryPreview[] = [
  {
    id: '1',
    slug: 'summit-textiles',
    name: 'Summit Textiles Co.',
    type: 'full_package',
    location: { city: 'Guangzhou', country: 'China', countryCode: 'CN' },
    coverImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    categories: ['Apparel - Womenswear', 'Knitwear', 'Activewear'],
    moqMin: 500,
    leadTimeWeeks: 4,
    certifications: [
      { slug: 'iso-9001', name: 'ISO 9001' },
      { slug: 'bsci', name: 'BSCI' },
      { slug: 'oeko-tex', name: 'OEKO-TEX' },
    ],
    isVerified: true,
    completenessScore: 92,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    slug: 'artisan-leather-works',
    name: 'Artisan Leather Works',
    type: 'specialist',
    location: { city: 'Florence', country: 'Italy', countryCode: 'IT' },
    coverImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
    categories: ['Bags & Leather Goods', 'Accessories'],
    moqMin: 50,
    leadTimeWeeks: 6,
    certifications: [
      { slug: 'iso-9001', name: 'ISO 9001' },
    ],
    isVerified: true,
    completenessScore: 88,
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    slug: 'eco-threads-vietnam',
    name: 'Eco Threads Vietnam',
    type: 'full_package',
    location: { city: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN' },
    coverImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    categories: ['Apparel - Womenswear', 'Apparel - Menswear', 'Denim'],
    moqMin: 1000,
    leadTimeWeeks: 5,
    certifications: [
      { slug: 'gots', name: 'GOTS' },
      { slug: 'oeko-tex', name: 'OEKO-TEX' },
      { slug: 'bsci', name: 'BSCI' },
    ],
    isVerified: true,
    completenessScore: 95,
    createdAt: '2024-03-01',
  },
  {
    id: '4',
    slug: 'heritage-crafts',
    name: 'Heritage Crafts Collective',
    type: 'low_moq',
    location: { city: 'Jaipur', country: 'India', countryCode: 'IN' },
    coverImageUrl: 'https://images.unsplash.com/photo-1604937455095-ef2fe3d46f4d?w=800&h=600&fit=crop',
    categories: ['Accessories', 'Apparel - Womenswear'],
    moqMin: 25,
    leadTimeWeeks: 8,
    certifications: [
      { slug: 'sa8000', name: 'SA8000' },
    ],
    isVerified: false,
    completenessScore: 72,
    createdAt: '2024-04-10',
  },
  {
    id: '5',
    slug: 'precision-footwear',
    name: 'Precision Footwear Ltd.',
    type: 'full_package',
    location: { city: 'Dongguan', country: 'China', countryCode: 'CN' },
    coverImageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop',
    categories: ['Footwear', 'Activewear'],
    moqMin: 300,
    leadTimeWeeks: 6,
    certifications: [
      { slug: 'iso-9001', name: 'ISO 9001' },
      { slug: 'iso-14001', name: 'ISO 14001' },
      { slug: 'bsci', name: 'BSCI' },
    ],
    isVerified: true,
    completenessScore: 89,
    createdAt: '2024-02-28',
  },
  {
    id: '6',
    slug: 'coastal-swim',
    name: 'Coastal Swim Manufacturing',
    type: 'specialist',
    location: { city: 'Bali', country: 'Indonesia', countryCode: 'ID' },
    coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    categories: ['Swimwear', 'Activewear'],
    moqMin: 100,
    leadTimeWeeks: 4,
    certifications: [
      { slug: 'oeko-tex', name: 'OEKO-TEX' },
    ],
    isVerified: true,
    completenessScore: 81,
    createdAt: '2024-05-15',
  },
  {
    id: '7',
    slug: 'nova-denim',
    name: 'Nova Denim Factory',
    type: 'full_package',
    location: { city: 'Istanbul', country: 'Turkey', countryCode: 'TR' },
    coverImageUrl: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&h=600&fit=crop',
    categories: ['Denim', 'Apparel - Menswear', 'Apparel - Womenswear'],
    moqMin: 500,
    leadTimeWeeks: 5,
    certifications: [
      { slug: 'iso-9001', name: 'ISO 9001' },
      { slug: 'bsci', name: 'BSCI' },
      { slug: 'sedex', name: 'SEDEX' },
    ],
    isVerified: true,
    completenessScore: 94,
    createdAt: '2024-01-20',
  },
  {
    id: '8',
    slug: 'alpine-knitwear',
    name: 'Alpine Knitwear Studio',
    type: 'specialist',
    location: { city: 'Porto', country: 'Portugal', countryCode: 'PT' },
    coverImageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=600&fit=crop',
    categories: ['Knitwear', 'Apparel - Womenswear'],
    moqMin: 80,
    leadTimeWeeks: 6,
    certifications: [
      { slug: 'oeko-tex', name: 'OEKO-TEX' },
      { slug: 'gots', name: 'GOTS' },
    ],
    isVerified: true,
    completenessScore: 86,
    createdAt: '2024-03-22',
  },
];

// Mock Factory Detail
export const mockFactoryDetail: FactoryDetail = {
  ...mockFactories[0],
  about: {
    description: 'Summit Textiles Co. is a leading garment manufacturer specializing in high-quality womenswear, knitwear, and activewear. With over 15 years of experience, we have built lasting partnerships with global fashion brands.',
    story: 'Founded in 2008 by textile industry veterans, Summit Textiles began as a small workshop with a vision to bridge the gap between quality craftsmanship and modern manufacturing efficiency. Today, we operate a state-of-the-art facility serving clients across Europe, North America, and Australia.',
    foundedYear: 2008,
    employeeCount: '150-200',
    facilitySize: '5,000 sqm',
    responseTime: '< 24 hours',
  },
  capabilities: {
    moqMin: 500,
    moqMax: 50000,
    leadTimeMin: 4,
    leadTimeMax: 8,
    monthlyCapacity: 50000,
    samplingTime: '2-3 weeks',
    services: [
      'Full Package (FPP)',
      'CMT (Cut-Make-Trim)',
      'Sampling',
      'Pattern Making',
      'Fabric Sourcing',
      'Quality Control',
      'Packaging',
    ],
    paymentTerms: '30% deposit, 70% before shipment',
    sampleCostRange: '$50-150 depending on complexity',
  },
  specializations: [
    'Sustainable Fashion',
    'Technical Fabrics',
    'Seamless Knitting',
    'Performance Wear',
  ],
  team: [
    {
      id: 't1',
      name: 'Wei Chen',
      role: 'Founder & CEO',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      bio: '20+ years in textile manufacturing',
    },
    {
      id: 't2',
      name: 'Li Mei',
      role: 'Head of Sales',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      bio: 'Your dedicated point of contact',
    },
    {
      id: 't3',
      name: 'Zhang Wei',
      role: 'QC Manager',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      bio: 'Ensuring every piece meets standards',
    },
    {
      id: 't4',
      name: 'Sarah Johnson',
      role: 'Design Consultant',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      bio: 'Bridging design and production',
    },
  ],
  media: {
    coverImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
    coverVideoUrl: undefined,
    gallery: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', caption: 'Main production floor' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop', caption: 'Quality control area' },
      { id: 'm3', type: 'image', url: 'https://images.unsplash.com/photo-1604937455095-ef2fe3d46f4d?w=800&h=600&fit=crop', caption: 'Fabric storage' },
      { id: 'm4', type: 'image', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=600&fit=crop', caption: 'Cutting section' },
      { id: 'm5', type: 'image', url: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&h=600&fit=crop', caption: 'Sample room' },
      { id: 'm6', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', caption: 'Factory tour' },
    ],
  },
  documents: [
    { id: 'd1', type: 'license', name: 'Business License', url: '#', uploadedAt: '2024-01-01' },
    { id: 'd2', type: 'certification', name: 'ISO 9001:2015', url: '#', uploadedAt: '2024-01-15' },
    { id: 'd3', type: 'certification', name: 'BSCI Certificate', url: '#', uploadedAt: '2024-02-01' },
    { id: 'd4', type: 'certification', name: 'OEKO-TEX Standard 100', url: '#', uploadedAt: '2024-03-01' },
    { id: 'd5', type: 'audit_report', name: 'Social Audit Report 2024', url: '#', uploadedAt: '2024-06-01' },
  ],
};

// Mock Subscription Tiers
export const mockSubscriptionTiers: SubscriptionTier[] = [
  {
    id: 'tier-starter',
    slug: 'starter',
    name: 'Starter',
    description: 'Perfect for brands exploring new manufacturing partners',
    priceMonthly: 4900, // $49
    priceAnnual: 47000, // $470/year ($39/mo)
    isPopular: false,
    isCustom: false,
    features: {
      browseDirectory: true,
      basicProfiles: true,
      fullProfiles: 'limited',
      monthlyInquiries: 3,
      savedFactories: 5,
      documentAccess: false,
      priorityResponses: false,
      dedicatedSourcing: false,
      apiAccess: false,
    },
    ctaText: 'Start Free Trial',
  },
  {
    id: 'tier-growth',
    slug: 'growth',
    name: 'Growth',
    description: 'For scaling brands with active sourcing needs',
    priceMonthly: 14900, // $149
    priceAnnual: 143000, // $1430/year ($119/mo)
    isPopular: true,
    isCustom: false,
    features: {
      browseDirectory: true,
      basicProfiles: true,
      fullProfiles: true,
      monthlyInquiries: 'unlimited',
      savedFactories: 'unlimited',
      documentAccess: true,
      priorityResponses: false,
      dedicatedSourcing: false,
      apiAccess: false,
    },
    ctaText: 'Start Free Trial',
  },
  {
    id: 'tier-enterprise',
    slug: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for high-volume brands',
    priceMonthly: 0,
    priceAnnual: 0,
    isPopular: false,
    isCustom: true,
    features: {
      browseDirectory: true,
      basicProfiles: true,
      fullProfiles: true,
      monthlyInquiries: 'unlimited',
      savedFactories: 'unlimited',
      documentAccess: true,
      priorityResponses: true,
      dedicatedSourcing: true,
      apiAccess: true,
    },
    ctaText: 'Contact Sales',
  },
];

// Factory type labels
export const factoryTypeLabels: Record<FactoryType, { label: string; color: string; desc: string }> = {
  full_package: { label: 'Full Package', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', desc: '500+ units, end-to-end production' },
  specialist: { label: 'Specialist', color: 'bg-primary/10 text-primary border border-primary/20', desc: 'Deep category expertise, premium quality' },
  low_moq: { label: 'Low MOQ', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', desc: '100–300 unit runs, suited to early-stage brands' },
};
