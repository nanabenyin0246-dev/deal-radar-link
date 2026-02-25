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
      audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      commissions: {
        Row: {
          commission_amount: number
          commission_rate: number
          created_at: string
          currency: string
          gross_amount: number
          id: string
          order_id: string
          settled_at: string | null
          status: string
          vat_amount: number | null
          vat_rate: number | null
          vendor_id: string
          vendor_payout: number
        }
        Insert: {
          commission_amount: number
          commission_rate?: number
          created_at?: string
          currency?: string
          gross_amount: number
          id?: string
          order_id: string
          settled_at?: string | null
          status?: string
          vat_amount?: number | null
          vat_rate?: number | null
          vendor_id: string
          vendor_payout: number
        }
        Update: {
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          currency?: string
          gross_amount?: number
          id?: string
          order_id?: string
          settled_at?: string | null
          status?: string
          vat_amount?: number | null
          vat_rate?: number | null
          vendor_id?: string
          vendor_payout?: number
        }
        Relationships: [
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          admin_decision: string | null
          created_at: string
          description: string | null
          id: string
          opened_by: string
          order_id: string
          reason: string
          resolution_amount: number | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          updated_at: string
          vendor_response: string | null
        }
        Insert: {
          admin_decision?: string | null
          created_at?: string
          description?: string | null
          id?: string
          opened_by: string
          order_id: string
          reason: string
          resolution_amount?: number | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
          vendor_response?: string | null
        }
        Update: {
          admin_decision?: string | null
          created_at?: string
          description?: string | null
          id?: string
          opened_by?: string
          order_id?: string
          reason?: string
          resolution_amount?: number | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
          vendor_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          commission_amount: number
          commission_rate: number
          completed_at: string | null
          created_at: string
          currency: string
          delivered_at: string | null
          id: string
          payment_method: string | null
          payment_phone_hash: string | null
          payment_reference: string | null
          product_id: string
          quantity: number
          shipping_address: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_price: number
          tracking_number: string | null
          unit_price: number
          updated_at: string
          vendor_id: string
          vendor_offer_id: string
        }
        Insert: {
          buyer_id: string
          commission_amount?: number
          commission_rate?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          id?: string
          payment_method?: string | null
          payment_phone_hash?: string | null
          payment_reference?: string | null
          product_id: string
          quantity?: number
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_price: number
          tracking_number?: string | null
          unit_price: number
          updated_at?: string
          vendor_id: string
          vendor_offer_id: string
        }
        Update: {
          buyer_id?: string
          commission_amount?: number
          commission_rate?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          id?: string
          payment_method?: string | null
          payment_phone_hash?: string | null
          payment_reference?: string | null
          product_id?: string
          quantity?: number
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_price?: number
          tracking_number?: string | null
          unit_price?: number
          updated_at?: string
          vendor_id?: string
          vendor_offer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_offer_id_fkey"
            columns: ["vendor_offer_id"]
            isOneToOne: false
            referencedRelation: "vendor_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_providers: {
        Row: {
          config: Json
          created_at: string
          display_name: string
          id: string
          is_active: boolean
          name: string
          priority: number
          provider_type: string
          supported_countries: string[]
          supported_currencies: string[]
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          provider_type?: string
          supported_countries?: string[]
          supported_currencies?: string[]
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          provider_type?: string
          supported_countries?: string[]
          supported_currencies?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          currency: string
          id: string
          price: number
          recorded_at: string
          vendor_offer_id: string
        }
        Insert: {
          currency: string
          id?: string
          price: number
          recorded_at?: string
          vendor_offer_id: string
        }
        Update: {
          currency?: string
          id?: string
          price?: number
          recorded_at?: string
          vendor_offer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_history_vendor_offer_id_fkey"
            columns: ["vendor_offer_id"]
            isOneToOne: false
            referencedRelation: "vendor_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          approved: boolean | null
          auto_translated: boolean | null
          created_at: string
          description: string | null
          id: string
          language_code: string
          name: string
          product_id: string
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          auto_translated?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          language_code?: string
          name: string
          product_id: string
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          auto_translated?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          language_code?: string
          name?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean | null
          name: string
          rating: number | null
          review_count: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          name: string
          rating?: number | null
          review_count?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          name?: string
          rating?: number | null
          review_count?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          display_name: string | null
          id: string
          preferred_currency: string | null
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_currency?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_currency?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prohibited_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
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
      vendor_agreements: {
        Row: {
          accepted_at: string
          agreement_version: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
          vendor_id: string
        }
        Insert: {
          accepted_at?: string
          agreement_version?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
          vendor_id: string
        }
        Update: {
          accepted_at?: string
          agreement_version?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_agreements_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_offers: {
        Row: {
          clicks: number | null
          created_at: string
          currency: string
          id: string
          in_stock: boolean | null
          is_visible: boolean | null
          payment_link: string | null
          price: number
          product_id: string
          shipping_days: number | null
          updated_at: string
          variant_info: Json | null
          vendor_id: string
          views: number | null
          whatsapp_message: string | null
        }
        Insert: {
          clicks?: number | null
          created_at?: string
          currency?: string
          id?: string
          in_stock?: boolean | null
          is_visible?: boolean | null
          payment_link?: string | null
          price: number
          product_id: string
          shipping_days?: number | null
          updated_at?: string
          variant_info?: Json | null
          vendor_id: string
          views?: number | null
          whatsapp_message?: string | null
        }
        Update: {
          clicks?: number | null
          created_at?: string
          currency?: string
          id?: string
          in_stock?: boolean | null
          is_visible?: boolean | null
          payment_link?: string | null
          price?: number
          product_id?: string
          shipping_days?: number | null
          updated_at?: string
          variant_info?: Json | null
          vendor_id?: string
          views?: number | null
          whatsapp_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_offers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          business_name: string
          city: string | null
          country: string
          created_at: string
          description: string | null
          email: string | null
          fraud_flagged: boolean | null
          id: string
          logo_url: string | null
          status: Database["public"]["Enums"]["vendor_status"] | null
          suspended_at: string | null
          suspension_reason: string | null
          total_clicks: number | null
          total_views: number | null
          trust_score: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
          website: string | null
          whatsapp_number: string
        }
        Insert: {
          business_name: string
          city?: string | null
          country?: string
          created_at?: string
          description?: string | null
          email?: string | null
          fraud_flagged?: boolean | null
          id?: string
          logo_url?: string | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          suspended_at?: string | null
          suspension_reason?: string | null
          total_clicks?: number | null
          total_views?: number | null
          trust_score?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          website?: string | null
          whatsapp_number: string
        }
        Update: {
          business_name?: string
          city?: string | null
          country?: string
          created_at?: string
          description?: string | null
          email?: string | null
          fraud_flagged?: boolean | null
          id?: string
          logo_url?: string | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          suspended_at?: string | null
          suspension_reason?: string | null
          total_clicks?: number | null
          total_views?: number | null
          trust_score?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          website?: string | null
          whatsapp_number?: string
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
      app_role: "admin" | "moderator" | "user" | "vendor"
      dispute_status:
        | "open"
        | "vendor_responded"
        | "admin_review"
        | "resolved_buyer"
        | "resolved_vendor"
        | "resolved_split"
        | "closed"
      order_status:
        | "pending"
        | "paid"
        | "shipped"
        | "delivered"
        | "completed"
        | "disputed"
        | "refunded"
        | "cancelled"
      vendor_status: "pending" | "approved" | "suspended"
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
      app_role: ["admin", "moderator", "user", "vendor"],
      dispute_status: [
        "open",
        "vendor_responded",
        "admin_review",
        "resolved_buyer",
        "resolved_vendor",
        "resolved_split",
        "closed",
      ],
      order_status: [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "completed",
        "disputed",
        "refunded",
        "cancelled",
      ],
      vendor_status: ["pending", "approved", "suspended"],
    },
  },
} as const
