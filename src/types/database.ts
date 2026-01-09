// Database types for Supabase tables

export type FactoryType = 'mass_production' | 'boutique' | 'artisan';

export interface Factory {
  id: string;
  slug: string;
  name: string;
  country: string;
  city: string | null;
  description: string | null;
  factory_type: string | null;
  categories: string[];
  moq_min: number | null;
  moq_max: number | null;
  lead_time_weeks: number | null;
  certifications: string[];
  website: string | null;
  email: string | null;
  phone: string | null;
  year_established: number | null;
  total_employees: number | null;
  is_verified: boolean;
  logo_url: string | null;
  gallery_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface FactoryPreview {
  id: string;
  slug: string;
  name: string;
  country: string;
  city: string | null;
  factory_type: string | null;
  categories: string[];
  certifications: string[];
  moq_min: number | null;
  lead_time_weeks: number | null;
  logo_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface FactoryApplication {
  id: string;
  payload: Record<string, unknown>;
  submitted_email: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_feedback: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
}

export interface Inquiry {
  id: string;
  factory_id: string | null;
  requester_name: string;
  requester_email: string;
  message: string | null;
  status: 'new' | 'open' | 'closed';
  created_at: string;
}

export interface RFQ {
  id: string;
  user_email: string;
  product_type: string | null;
  description: string | null;
  materials: string | null;
  quantity: string | null;
  target_price: string | null;
  timeline: string | null;
  certifications: string[];
  additional_requirements: string | null;
  generated_content: string | null;
  status: 'draft' | 'submitted' | 'matched';
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  rfq_id: string | null;
  factory_id: string | null;
  score: number | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}
