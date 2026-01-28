import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface InquiryWithFactory {
  id: string;
  factory_id: string | null;
  requester_name: string;
  requester_email: string;
  message: string | null;
  status: string;
  conversion_status: 'new' | 'replied' | 'converted' | 'declined';
  order_id: string | null;
  created_at: string;
  factories: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  } | null;
}

export function useInquiries() {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['inquiries', user?.id],
    queryFn: async (): Promise<InquiryWithFactory[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          id, factory_id, requester_name, requester_email,
          message, status, conversion_status, order_id, created_at,
          factories (id, name, slug, logo_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as InquiryWithFactory[];
    },
    enabled: !!user
  });
  
  return {
    inquiries: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}
