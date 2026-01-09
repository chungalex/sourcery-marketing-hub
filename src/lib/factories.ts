import { supabase } from "@/integrations/supabase/client";
import type { Factory, FactoryPreview } from "@/types/database";

// Fetch all factory previews (public - for logged out users)
export async function fetchFactoryPreviews(): Promise<FactoryPreview[]> {
  const { data, error } = await supabase
    .from("factory_previews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching factory previews:", error);
    throw error;
  }

  return data || [];
}

// Fetch all factories (authenticated users only)
export async function fetchFactories(): Promise<Factory[]> {
  const { data, error } = await supabase
    .from("factories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching factories:", error);
    throw error;
  }

  return data || [];
}

// Fetch single factory preview by slug (public)
export async function fetchFactoryPreviewBySlug(slug: string): Promise<FactoryPreview | null> {
  const { data, error } = await supabase
    .from("factory_previews")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching factory preview:", error);
    throw error;
  }

  return data;
}

// Fetch single factory by slug (authenticated)
export async function fetchFactoryBySlug(slug: string): Promise<Factory | null> {
  const { data, error } = await supabase
    .from("factories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching factory:", error);
    throw error;
  }

  return data;
}

// Generate unique slug from name
export function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  
  // Add random suffix for uniqueness
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${suffix}`;
}
