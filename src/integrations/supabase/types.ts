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
      bookings: {
        Row: {
          babybauch_kombi: boolean
          booking_date: string | null
          booking_time: string | null
          city: string
          created_at: string
          duration: string
          duration_price: number
          email: string
          first_name: string
          id: string
          last_name: string
          notes: string | null
          package_price: number
          participants: Json
          phone: string
          photo_package: string
          service: string
          status: string
          street: string
          total_price: number
          updated_at: string
          user_id: string | null
          zip: string
        }
        Insert: {
          babybauch_kombi?: boolean
          booking_date?: string | null
          booking_time?: string | null
          city?: string
          created_at?: string
          duration: string
          duration_price?: number
          email: string
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          package_price?: number
          participants?: Json
          phone?: string
          photo_package: string
          service: string
          status?: string
          street?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
          zip?: string
        }
        Update: {
          babybauch_kombi?: boolean
          booking_date?: string | null
          booking_time?: string | null
          city?: string
          created_at?: string
          duration?: string
          duration_price?: number
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          package_price?: number
          participants?: Json
          phone?: string
          photo_package?: string
          service?: string
          status?: string
          street?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
          zip?: string
        }
        Relationships: []
      }
      customer_photos: {
        Row: {
          booking_id: string | null
          created_at: string
          file_name: string
          file_url: string
          id: string
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          file_name?: string
          file_url: string
          id?: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          file_name?: string
          file_url?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_photos_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          discount_amount: number | null
          discount_percent: number | null
          id: string
          is_active: boolean
          target_user_id: string | null
          title: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean
          target_user_id?: string | null
          title: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean
          target_user_id?: string | null
          title?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          street: string | null
          updated_at: string
          user_id: string
          zip: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          street?: string | null
          updated_at?: string
          user_id: string
          zip?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          street?: string | null
          updated_at?: string
          user_id?: string
          zip?: string | null
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
