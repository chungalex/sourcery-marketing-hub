export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      factories: {
        Row: {
          categories: string[] | null
          certifications: string[] | null
          city: string | null
          country: string
          created_at: string | null
          description: string | null
          email: string | null
          factory_type: string | null
          gallery_urls: string[] | null
          id: string
          is_verified: boolean | null
          lead_time_weeks: number | null
          logo_url: string | null
          moq_max: number | null
          moq_min: number | null
          name: string
          phone: string | null
          slug: string
          total_employees: number | null
          updated_at: string | null
          website: string | null
          year_established: number | null
        }
        Insert: {
          categories?: string[] | null
          certifications?: string[] | null
          city?: string | null
          country: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          factory_type?: string | null
          gallery_urls?: string[] | null
          id?: string
          is_verified?: boolean | null
          lead_time_weeks?: number | null
          logo_url?: string | null
          moq_max?: number | null
          moq_min?: number | null
          name: string
          phone?: string | null
          slug: string
          total_employees?: number | null
          updated_at?: string | null
          website?: string | null
          year_established?: number | null
        }
        Update: {
          categories?: string[] | null
          certifications?: string[] | null
          city?: string | null
          country?: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          factory_type?: string | null
          gallery_urls?: string[] | null
          id?: string
          is_verified?: boolean | null
          lead_time_weeks?: number | null
          logo_url?: string | null
          moq_max?: number | null
          moq_min?: number | null
          name?: string
          phone?: string | null
          slug?: string
          total_employees?: number | null
          updated_at?: string | null
          website?: string | null
          year_established?: number | null
        }
        Relationships: []
      }
      factory_applications: {
        Row: {
          admin_feedback: string | null
          created_at: string | null
          id: string
          payload: Json
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_email: string
        }
        Insert: {
          admin_feedback?: string | null
          created_at?: string | null
          id?: string
          payload: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_email: string
        }
        Update: {
          admin_feedback?: string | null
          created_at?: string | null
          id?: string
          payload?: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_email?: string
        }
        Relationships: []
      }
      factory_previews: {
        Row: {
          categories: string[] | null
          certifications: string[] | null
          city: string | null
          country: string
          created_at: string | null
          factory_type: string | null
          id: string
          is_verified: boolean | null
          lead_time_weeks: number | null
          logo_url: string | null
          moq_min: number | null
          name: string
          slug: string
        }
        Insert: {
          categories?: string[] | null
          certifications?: string[] | null
          city?: string | null
          country: string
          created_at?: string | null
          factory_type?: string | null
          id: string
          is_verified?: boolean | null
          lead_time_weeks?: number | null
          logo_url?: string | null
          moq_min?: number | null
          name: string
          slug: string
        }
        Update: {
          categories?: string[] | null
          certifications?: string[] | null
          city?: string | null
          country?: string
          created_at?: string | null
          factory_type?: string | null
          id?: string
          is_verified?: boolean | null
          lead_time_weeks?: number | null
          logo_url?: string | null
          moq_min?: number | null
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_previews_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          created_at: string | null
          factory_id: string | null
          id: string
          message: string | null
          requester_email: string
          requester_name: string
          status: string
        }
        Insert: {
          created_at?: string | null
          factory_id?: string | null
          id?: string
          message?: string | null
          requester_email: string
          requester_name: string
          status?: string
        }
        Update: {
          created_at?: string | null
          factory_id?: string | null
          id?: string
          message?: string | null
          requester_email?: string
          requester_name?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          factory_id: string | null
          id: string
          rfq_id: string | null
          score: number | null
          status: string
        }
        Insert: {
          created_at?: string | null
          factory_id?: string | null
          id?: string
          rfq_id?: string | null
          score?: number | null
          status?: string
        }
        Update: {
          created_at?: string | null
          factory_id?: string | null
          id?: string
          rfq_id?: string | null
          score?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          additional_requirements: string | null
          certifications: string[] | null
          created_at: string | null
          description: string | null
          generated_content: string | null
          id: string
          materials: string | null
          product_type: string | null
          quantity: string | null
          status: string
          target_price: string | null
          timeline: string | null
          updated_at: string | null
          user_email: string
        }
        Insert: {
          additional_requirements?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          generated_content?: string | null
          id?: string
          materials?: string | null
          product_type?: string | null
          quantity?: string | null
          status?: string
          target_price?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_email: string
        }
        Update: {
          additional_requirements?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          generated_content?: string | null
          id?: string
          materials?: string | null
          product_type?: string | null
          quantity?: string | null
          status?: string
          target_price?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_email?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
