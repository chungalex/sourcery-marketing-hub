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
          bank_account_id: string | null
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
          participation: Database["public"]["Enums"]["factory_participation"]
          phone: string | null
          slug: string
          total_employees: number | null
          updated_at: string | null
          website: string | null
          year_established: number | null
        }
        Insert: {
          bank_account_id?: string | null
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
          participation?: Database["public"]["Enums"]["factory_participation"]
          phone?: string | null
          slug: string
          total_employees?: number | null
          updated_at?: string | null
          website?: string | null
          year_established?: number | null
        }
        Update: {
          bank_account_id?: string | null
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
          participation?: Database["public"]["Enums"]["factory_participation"]
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
      factory_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          expires_at: string
          factory_id: string | null
          id: string
          invite_email: string
          invite_token: string
          invited_by: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          factory_id?: string | null
          id?: string
          invite_email: string
          invite_token: string
          invited_by: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          factory_id?: string | null
          id?: string
          invite_email?: string
          invite_token?: string
          invited_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_invites_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
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
      factory_users: {
        Row: {
          created_at: string
          factory_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          factory_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          factory_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_users_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
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
      order_disputes: {
        Row: {
          created_at: string
          id: string
          initiated_by: string | null
          order_id: string | null
          reason: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["dispute_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          initiated_by?: string | null
          order_id?: string | null
          reason: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
        }
        Update: {
          created_at?: string
          id?: string
          initiated_by?: string | null
          order_id?: string | null
          reason?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_evidence: {
        Row: {
          created_at: string
          file_name: string
          file_size_bytes: number | null
          file_type: string
          id: string
          order_id: string | null
          storage_key: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size_bytes?: number | null
          file_type: string
          id?: string
          order_id?: string | null
          storage_key: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size_bytes?: number | null
          file_type?: string
          id?: string
          order_id?: string | null
          storage_key?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_evidence_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_milestones: {
        Row: {
          amount: number
          created_at: string
          eligible_at: string | null
          id: string
          label: string
          order_id: string | null
          percentage: number
          release_condition: string | null
          released_at: string | null
          sequence_order: number
          status: Database["public"]["Enums"]["milestone_status"]
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          eligible_at?: string | null
          id?: string
          label: string
          order_id?: string | null
          percentage: number
          release_condition?: string | null
          released_at?: string | null
          sequence_order?: number
          status?: Database["public"]["Enums"]["milestone_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          eligible_at?: string | null
          id?: string
          label?: string
          order_id?: string | null
          percentage?: number
          release_condition?: string | null
          released_at?: string | null
          sequence_order?: number
          status?: Database["public"]["Enums"]["milestone_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_milestones_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_qc_assignments: {
        Row: {
          assigned_at: string
          order_id: string
          qc_partner_id: string
        }
        Insert: {
          assigned_at?: string
          order_id: string
          qc_partner_id: string
        }
        Update: {
          assigned_at?: string
          order_id?: string
          qc_partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_qc_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_qc_assignments_qc_partner_id_fkey"
            columns: ["qc_partner_id"]
            isOneToOne: false
            referencedRelation: "qc_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      order_qc_reports: {
        Row: {
          defect_percentage: number | null
          id: string
          notes: string | null
          order_id: string | null
          qc_partner_id: string | null
          report_storage_key: string | null
          result: Database["public"]["Enums"]["qc_result"]
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          defect_percentage?: number | null
          id?: string
          notes?: string | null
          order_id?: string | null
          qc_partner_id?: string | null
          report_storage_key?: string | null
          result: Database["public"]["Enums"]["qc_result"]
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          defect_percentage?: number | null
          id?: string
          notes?: string | null
          order_id?: string | null
          qc_partner_id?: string | null
          report_storage_key?: string | null
          result?: Database["public"]["Enums"]["qc_result"]
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_qc_reports_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_qc_reports_qc_partner_id_fkey"
            columns: ["qc_partner_id"]
            isOneToOne: false
            referencedRelation: "qc_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      order_state_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["order_status"] | null
          id: string
          metadata: Json | null
          order_id: string | null
          reason: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          reason?: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          reason?: string | null
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_state_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          bom_url: string | null
          buyer_id: string
          created_at: string
          currency: string
          delivery_window_end: string | null
          delivery_window_start: string | null
          factory_id: string
          id: string
          incoterms: string | null
          measurement_table: Json | null
          order_number: string
          po_accepted_at: string | null
          po_accepted_by: string | null
          po_document_url: string | null
          qc_standard: Json | null
          quantity: number
          specifications: Json | null
          status: Database["public"]["Enums"]["order_status"]
          tech_pack_url: string | null
          total_amount: number | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          bom_url?: string | null
          buyer_id: string
          created_at?: string
          currency?: string
          delivery_window_end?: string | null
          delivery_window_start?: string | null
          factory_id: string
          id?: string
          incoterms?: string | null
          measurement_table?: Json | null
          order_number?: string
          po_accepted_at?: string | null
          po_accepted_by?: string | null
          po_document_url?: string | null
          qc_standard?: Json | null
          quantity: number
          specifications?: Json | null
          status?: Database["public"]["Enums"]["order_status"]
          tech_pack_url?: string | null
          total_amount?: number | null
          unit_price: number
          updated_at?: string
        }
        Update: {
          bom_url?: string | null
          buyer_id?: string
          created_at?: string
          currency?: string
          delivery_window_end?: string | null
          delivery_window_start?: string | null
          factory_id?: string
          id?: string
          incoterms?: string | null
          measurement_table?: Json | null
          order_number?: string
          po_accepted_at?: string | null
          po_accepted_by?: string | null
          po_document_url?: string | null
          qc_standard?: Json | null
          quantity?: number
          specifications?: Json | null
          status?: Database["public"]["Enums"]["order_status"]
          tech_pack_url?: string | null
          total_amount?: number | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency: string
          id: string
          milestone_id: string | null
          order_id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          milestone_id?: string | null
          order_id: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          milestone_id?: string | null
          order_id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "order_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      qc_partner_users: {
        Row: {
          created_at: string
          qc_partner_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          qc_partner_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          qc_partner_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qc_partner_users_qc_partner_id_fkey"
            columns: ["qc_partner_id"]
            isOneToOne: false
            referencedRelation: "qc_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      qc_partners: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean
          location: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_verified?: boolean
          location?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean
          location?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
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
      get_order_actor_type: {
        Args: { p_actor_id: string; p_order_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      transition_order_status: {
        Args: {
          p_actor_id: string
          p_metadata?: Json
          p_new_status: Database["public"]["Enums"]["order_status"]
          p_order_id: string
          p_reason?: string
        }
        Returns: Json
      }
      user_has_factory_access: {
        Args: { _factory_id: string; _user_id: string }
        Returns: boolean
      }
      user_has_order_access: {
        Args: { _order_id: string; _user_id: string }
        Returns: boolean
      }
      user_has_qc_access: {
        Args: { _qc_partner_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      dispute_status: "open" | "escalated" | "resolved"
      factory_participation: "private" | "listed_unverified" | "listed_verified"
      milestone_status:
        | "pending"
        | "eligible"
        | "released"
        | "disputed"
        | "cancelled"
      order_status:
        | "draft"
        | "po_issued"
        | "po_accepted"
        | "in_production"
        | "qc_scheduled"
        | "qc_uploaded"
        | "qc_pass"
        | "qc_fail"
        | "ready_to_ship"
        | "shipped"
        | "closed"
        | "disputed"
        | "cancelled"
      org_role: "owner" | "admin" | "member"
      payment_status: "initiated" | "paid" | "failed" | "refunded"
      qc_result: "pass" | "conditional" | "fail"
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
      dispute_status: ["open", "escalated", "resolved"],
      factory_participation: [
        "private",
        "listed_unverified",
        "listed_verified",
      ],
      milestone_status: [
        "pending",
        "eligible",
        "released",
        "disputed",
        "cancelled",
      ],
      order_status: [
        "draft",
        "po_issued",
        "po_accepted",
        "in_production",
        "qc_scheduled",
        "qc_uploaded",
        "qc_pass",
        "qc_fail",
        "ready_to_ship",
        "shipped",
        "closed",
        "disputed",
        "cancelled",
      ],
      org_role: ["owner", "admin", "member"],
      payment_status: ["initiated", "paid", "failed", "refunded"],
      qc_result: ["pass", "conditional", "fail"],
    },
  },
} as const
