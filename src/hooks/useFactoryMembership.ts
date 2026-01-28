import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FactoryMembershipState {
  factoryIds: string[];
  hasFactoryAccess: boolean;
}

export function useFactoryMembership(userId?: string) {
  const query = useQuery({
    queryKey: ["factory-membership", userId],
    enabled: !!userId,
    queryFn: async (): Promise<FactoryMembershipState> => {
      const { data, error } = await supabase
        .from("factory_users")
        .select("factory_id")
        .eq("user_id", userId as string);

      if (error) throw error;

      const factoryIds = (data ?? []).map((r) => r.factory_id);
      return {
        factoryIds,
        hasFactoryAccess: factoryIds.length > 0,
      };
    },
  });

  return {
    ...query,
    factoryIds: query.data?.factoryIds ?? [],
    hasFactoryAccess: query.data?.hasFactoryAccess ?? false,
  };
}
