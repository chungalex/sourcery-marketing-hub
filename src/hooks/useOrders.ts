import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OrderMilestone {
  id: string;
  label: string;
  status: string;
  percentage: number;
  sequence_order: number;
}

export interface OrderWithDetails {
  id: string;
  order_number: string;
  status: string;
  quantity: number;
  unit_price: number;
  total_amount: number | null;
  currency: string;
  created_at: string;
  specifications: Record<string, unknown> | null;
  delivery_window_end: string | null;
  factories: {
    id: string;
    name: string;
    slug: string;
  } | null;
  order_milestones: OrderMilestone[];
}

export function useOrders() {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async (): Promise<OrderWithDetails[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, order_number, status, quantity, unit_price,
          total_amount, currency, created_at,
          factories (id, name, slug),
          order_milestones (id, label, status, percentage, sequence_order)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as OrderWithDetails[];
    },
    enabled: !!user
  });
  
  return {
    orders: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}
