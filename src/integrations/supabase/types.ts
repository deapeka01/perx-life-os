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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          bank_name: string
          beneficiary_name: string
          created_at: string
          currency: string
          iban: string
          id: string
          is_default: boolean
          label: string | null
          owner_user_id: string
          swift: string | null
          updated_at: string
        }
        Insert: {
          bank_name: string
          beneficiary_name: string
          created_at?: string
          currency?: string
          iban: string
          id?: string
          is_default?: boolean
          label?: string | null
          owner_user_id: string
          swift?: string | null
          updated_at?: string
        }
        Update: {
          bank_name?: string
          beneficiary_name?: string
          created_at?: string
          currency?: string
          iban?: string
          id?: string
          is_default?: boolean
          label?: string | null
          owner_user_id?: string
          swift?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      benefit_dna: {
        Row: {
          archetypes: Json
          created_at: string
          goals: Json
          interests: Json
          primary_archetype: string
          raw: Json
          recommended_categories: Json
          secondary_archetype: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archetypes?: Json
          created_at?: string
          goals?: Json
          interests?: Json
          primary_archetype: string
          raw?: Json
          recommended_categories?: Json
          secondary_archetype?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          archetypes?: Json
          created_at?: string
          goals?: Json
          interests?: Json
          primary_archetype?: string
          raw?: Json
          recommended_categories?: Json
          secondary_archetype?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      benefit_requests: {
        Row: {
          ai_note: string | null
          amount_all: number
          company_id: string | null
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          employee_message: string | null
          employee_user_id: string
          fulfilled_at: string | null
          id: string
          metadata: Json
          offer_id: string | null
          provider_id: string | null
          status: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at: string
        }
        Insert: {
          ai_note?: string | null
          amount_all: number
          company_id?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          employee_message?: string | null
          employee_user_id: string
          fulfilled_at?: string | null
          id?: string
          metadata?: Json
          offer_id?: string | null
          provider_id?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at?: string
        }
        Update: {
          ai_note?: string | null
          amount_all?: number
          company_id?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          employee_message?: string | null
          employee_user_id?: string
          fulfilled_at?: string | null
          id?: string
          metadata?: Json
          offer_id?: string | null
          provider_id?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "benefit_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "benefit_requests_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "benefit_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          monthly_budget_all: number
          name: string
          owner_user_id: string | null
          registration_number: string | null
          tax_number: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          monthly_budget_all?: number
          name: string
          owner_user_id?: string | null
          registration_number?: string | null
          tax_number?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          monthly_budget_all?: number
          name?: string
          owner_user_id?: string | null
          registration_number?: string | null
          tax_number?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      demand_insights: {
        Row: {
          category: string
          employees_interested: number
          generated_at: string
          headline: string | null
          id: string
          provider_id: string | null
          recommendation: string | null
          segment: string
          trend: string | null
        }
        Insert: {
          category: string
          employees_interested?: number
          generated_at?: string
          headline?: string | null
          id?: string
          provider_id?: string | null
          recommendation?: string | null
          segment: string
          trend?: string | null
        }
        Update: {
          category?: string
          employees_interested?: number
          generated_at?: string
          headline?: string | null
          id?: string
          provider_id?: string | null
          recommendation?: string | null
          segment?: string
          trend?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demand_insights_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_codes: {
        Row: {
          code: string
          company_id: string
          created_at: string
          role: Database["public"]["Enums"]["app_role"]
          uses_left: number
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          uses_left?: number
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          uses_left?: number
        }
        Relationships: [
          {
            foreignKeyName: "invitation_codes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_all: number
          bank_snapshot: Json
          created_at: string
          description: string
          due_date: string | null
          id: string
          kind: Database["public"]["Enums"]["invoice_kind"]
          metadata: Json
          number: string
          paid_at: string | null
          payee_label: string
          payee_user_id: string | null
          payer_label: string | null
          payer_user_id: string | null
          reference_code: string
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
        }
        Insert: {
          amount_all: number
          bank_snapshot: Json
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          kind: Database["public"]["Enums"]["invoice_kind"]
          metadata?: Json
          number: string
          paid_at?: string | null
          payee_label: string
          payee_user_id?: string | null
          payer_label?: string | null
          payer_user_id?: string | null
          reference_code: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Update: {
          amount_all?: number
          bank_snapshot?: Json
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["invoice_kind"]
          metadata?: Json
          number?: string
          paid_at?: string | null
          payee_label?: string
          payee_user_id?: string | null
          payer_label?: string | null
          payer_user_id?: string | null
          reference_code?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          analytics: Json
          channel: Database["public"]["Enums"]["campaign_channel"]
          content: string
          created_at: string
          id: string
          image_url: string | null
          provider_id: string
          scheduled_for: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          title: string
          updated_at: string
        }
        Insert: {
          analytics?: Json
          channel: Database["public"]["Enums"]["campaign_channel"]
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          provider_id: string
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          title: string
          updated_at?: string
        }
        Update: {
          analytics?: Json
          channel?: Database["public"]["Enums"]["campaign_channel"]
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          provider_id?: string
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string | null
          created_at: string
          id: string
          kind: string
          metadata: Json
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          metadata?: Json
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          metadata?: Json
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      offer_likes: {
        Row: {
          created_at: string
          id: string
          offer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          offer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          offer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offer_likes_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          bookings: number
          capacity: number | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          kind: Database["public"]["Enums"]["offer_kind"]
          metadata: Json
          price_all: number
          provider_id: string
          status: Database["public"]["Enums"]["offer_status"]
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          bookings?: number
          capacity?: number | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          kind?: Database["public"]["Enums"]["offer_kind"]
          metadata?: Json
          price_all: number
          provider_id: string
          status?: Database["public"]["Enums"]["offer_status"]
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          bookings?: number
          capacity?: number | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          kind?: Database["public"]["Enums"]["offer_kind"]
          metadata?: Json
          price_all?: number
          provider_id?: string
          status?: Database["public"]["Enums"]["offer_status"]
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_responses: {
        Row: {
          created_at: string
          id: string
          payload: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          language: string | null
          onboarded: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          onboarded?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          onboarded?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          brand: Json
          category: string
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          owner_user_id: string | null
          registration_number: string | null
          social: Json
          tax_number: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          brand?: Json
          category: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_user_id?: string | null
          registration_number?: string | null
          social?: Json
          tax_number?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          brand?: Json
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_user_id?: string | null
          registration_number?: string | null
          social?: Json
          tax_number?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      quest_progress: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string
          id: string
          progress: number
          quest_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          quest_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          quest_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          active: boolean
          badge_emoji: string | null
          category: string | null
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          reward_all: number
          scope: Database["public"]["Enums"]["quest_scope"]
          target_progress: number
          title: string
        }
        Insert: {
          active?: boolean
          badge_emoji?: string | null
          category?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reward_all?: number
          scope?: Database["public"]["Enums"]["quest_scope"]
          target_progress?: number
          title: string
        }
        Update: {
          active?: boolean
          badge_emoji?: string | null
          category?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reward_all?: number
          scope?: Database["public"]["Enums"]["quest_scope"]
          target_progress?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_reports: {
        Row: {
          company_id: string
          generated_at: string
          id: string
          insights: Json
          kind: string
          summary: string | null
          title: string
        }
        Insert: {
          company_id: string
          generated_at?: string
          id?: string
          insights?: Json
          kind: string
          summary?: string | null
          title: string
        }
        Update: {
          company_id?: string
          generated_at?: string
          id?: string
          insights?: Json
          kind?: string
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount_all: number
          balance_after: number
          created_at: string
          description: string
          id: string
          kind: Database["public"]["Enums"]["txn_kind"]
          metadata: Json
          related_request_id: string | null
          wallet_id: string
        }
        Insert: {
          amount_all: number
          balance_after: number
          created_at?: string
          description: string
          id?: string
          kind: Database["public"]["Enums"]["txn_kind"]
          metadata?: Json
          related_request_id?: string | null
          wallet_id: string
        }
        Update: {
          amount_all?: number
          balance_after?: number
          created_at?: string
          description?: string
          id?: string
          kind?: Database["public"]["Enums"]["txn_kind"]
          metadata?: Json
          related_request_id?: string | null
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance_all: number
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["wallet_kind"]
          monthly_allowance_all: number
          owner_user_id: string
          updated_at: string
        }
        Insert: {
          balance_all?: number
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["wallet_kind"]
          monthly_allowance_all?: number
          owner_user_id: string
          updated_at?: string
        }
        Update: {
          balance_all?: number
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["wallet_kind"]
          monthly_allowance_all?: number
          owner_user_id?: string
          updated_at?: string
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
      next_invoice_number: { Args: never; Returns: string }
      redeem_invitation_code: { Args: { _code: string }; Returns: Json }
    }
    Enums: {
      app_role: "employee" | "company" | "provider" | "admin"
      campaign_channel: "instagram" | "facebook" | "linkedin" | "tiktok"
      campaign_status: "draft" | "scheduled" | "published"
      invoice_kind: "wallet_topup" | "perk_claim" | "provider_payout"
      invoice_status: "pending" | "sent" | "paid" | "cancelled"
      offer_kind: "single" | "package" | "bundle"
      offer_status: "draft" | "active" | "archived"
      quest_scope: "global" | "company"
      request_status:
        | "pending"
        | "approved"
        | "rejected"
        | "fulfilled"
        | "cancelled"
      txn_kind:
        | "topup"
        | "allocation"
        | "spend"
        | "refund"
        | "payout"
        | "reward"
        | "adjustment"
      verification_status: "pending" | "verified" | "rejected"
      wallet_kind: "employee" | "company" | "provider"
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
      app_role: ["employee", "company", "provider", "admin"],
      campaign_channel: ["instagram", "facebook", "linkedin", "tiktok"],
      campaign_status: ["draft", "scheduled", "published"],
      invoice_kind: ["wallet_topup", "perk_claim", "provider_payout"],
      invoice_status: ["pending", "sent", "paid", "cancelled"],
      offer_kind: ["single", "package", "bundle"],
      offer_status: ["draft", "active", "archived"],
      quest_scope: ["global", "company"],
      request_status: [
        "pending",
        "approved",
        "rejected",
        "fulfilled",
        "cancelled",
      ],
      txn_kind: [
        "topup",
        "allocation",
        "spend",
        "refund",
        "payout",
        "reward",
        "adjustment",
      ],
      verification_status: ["pending", "verified", "rejected"],
      wallet_kind: ["employee", "company", "provider"],
    },
  },
} as const
