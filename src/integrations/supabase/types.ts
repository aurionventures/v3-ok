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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by_partner: string | null
          email: string
          expires_at: string
          id: string
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by_partner?: string | null
          email: string
          expires_at: string
          id?: string
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by_partner?: string | null
          email?: string
          expires_at?: string
          id?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_codes_created_by_partner_fkey"
            columns: ["created_by_partner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_structure_members: {
        Row: {
          birth_date: string | null
          committees: string[] | null
          company_id: string
          created_at: string | null
          document: string | null
          email: string | null
          generation: string | null
          governance_category: string
          governance_subcategory: string | null
          id: string
          investment_entry_date: string | null
          investment_type: string | null
          is_family_member: boolean | null
          is_independent: boolean | null
          name: string
          official_qualification_code: string | null
          phone: string | null
          priority: number | null
          shareholding_class: string | null
          shareholding_percentage: number | null
          specific_role: string | null
          status: string
          status_reason: string | null
          term_end_date: string | null
          term_is_indefinite: boolean | null
          term_start_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          birth_date?: string | null
          committees?: string[] | null
          company_id: string
          created_at?: string | null
          document?: string | null
          email?: string | null
          generation?: string | null
          governance_category: string
          governance_subcategory?: string | null
          id?: string
          investment_entry_date?: string | null
          investment_type?: string | null
          is_family_member?: boolean | null
          is_independent?: boolean | null
          name: string
          official_qualification_code?: string | null
          phone?: string | null
          priority?: number | null
          shareholding_class?: string | null
          shareholding_percentage?: number | null
          specific_role?: string | null
          status?: string
          status_reason?: string | null
          term_end_date?: string | null
          term_is_indefinite?: boolean | null
          term_start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          birth_date?: string | null
          committees?: string[] | null
          company_id?: string
          created_at?: string | null
          document?: string | null
          email?: string | null
          generation?: string | null
          governance_category?: string
          governance_subcategory?: string | null
          id?: string
          investment_entry_date?: string | null
          investment_type?: string | null
          is_family_member?: boolean | null
          is_independent?: boolean | null
          name?: string
          official_qualification_code?: string | null
          phone?: string | null
          priority?: number | null
          shareholding_class?: string | null
          shareholding_percentage?: number | null
          specific_role?: string | null
          status?: string
          status_reason?: string | null
          term_end_date?: string | null
          term_is_indefinite?: boolean | null
          term_start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      council_members: {
        Row: {
          council_id: string
          created_at: string
          end_date: string | null
          id: string
          name: string
          role: string
          start_date: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          council_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          role: string
          start_date: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          council_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          role?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "council_members_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "councils"
            referencedColumns: ["id"]
          },
        ]
      }
      councils: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          quorum: number
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          quorum?: number
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          quorum?: number
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      interview_transcripts: {
        Row: {
          created_by: string | null
          id: string
          interview_id: string
          transcript_text: string
          uploaded_at: string
        }
        Insert: {
          created_by?: string | null
          id?: string
          interview_id: string
          transcript_text: string
          uploaded_at?: string
        }
        Update: {
          created_by?: string | null
          id?: string
          interview_id?: string
          transcript_text?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_transcripts_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          id: string
          interview_date: string | null
          name: string
          notes: string | null
          priority: string
          role: string
          scheduled_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          interview_date?: string | null
          name: string
          notes?: string | null
          priority?: string
          role: string
          scheduled_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          interview_date?: string | null
          name?: string
          notes?: string | null
          priority?: string
          role?: string
          scheduled_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meeting_actions: {
        Row: {
          category: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string
          due_date: string
          id: string
          meeting_id: string
          meeting_item_id: string | null
          notes: string | null
          priority: string
          responsible_external_email: string | null
          responsible_external_name: string | null
          responsible_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          due_date: string
          id?: string
          meeting_id: string
          meeting_item_id?: string | null
          notes?: string | null
          priority?: string
          responsible_external_email?: string | null
          responsible_external_name?: string | null
          responsible_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          due_date?: string
          id?: string
          meeting_id?: string
          meeting_item_id?: string | null
          notes?: string | null
          priority?: string
          responsible_external_email?: string | null
          responsible_external_name?: string | null
          responsible_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_actions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_actions_meeting_item_id_fkey"
            columns: ["meeting_item_id"]
            isOneToOne: false
            referencedRelation: "meeting_items"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_items: {
        Row: {
          created_at: string
          description: string | null
          detailed_script: string | null
          duration_minutes: number | null
          expected_outcome: string | null
          id: string
          is_sensitive: boolean
          key_points: Json | null
          meeting_id: string
          order_position: number
          presenter: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          detailed_script?: string | null
          duration_minutes?: number | null
          expected_outcome?: string | null
          id?: string
          is_sensitive?: boolean
          key_points?: Json | null
          meeting_id: string
          order_position?: number
          presenter?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          detailed_script?: string | null
          duration_minutes?: number | null
          expected_outcome?: string | null
          id?: string
          is_sensitive?: boolean
          key_points?: Json | null
          meeting_id?: string
          order_position?: number
          presenter?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          attendees: string[] | null
          company_id: string
          council_id: string
          created_at: string
          created_by: string | null
          date: string
          id: string
          location: string | null
          minutes_full: string | null
          minutes_summary: string | null
          modalidade: string
          recording_type: string | null
          recording_url: string | null
          status: string
          time: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          attendees?: string[] | null
          company_id: string
          council_id: string
          created_at?: string
          created_by?: string | null
          date: string
          id?: string
          location?: string | null
          minutes_full?: string | null
          minutes_summary?: string | null
          modalidade?: string
          recording_type?: string | null
          recording_url?: string | null
          status?: string
          time: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          attendees?: string[] | null
          company_id?: string
          council_id?: string
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          location?: string | null
          minutes_full?: string | null
          minutes_summary?: string | null
          modalidade?: string
          recording_type?: string | null
          recording_url?: string | null
          status?: string
          time?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "councils"
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
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          company: string | null
          created_at: string | null
          created_by_partner: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          sector: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          created_by_partner?: string | null
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          sector?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          created_by_partner?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          sector?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_created_by_partner_fkey"
            columns: ["created_by_partner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "parceiro" | "cliente" | "user"
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
      app_role: ["admin", "parceiro", "cliente", "user"],
    },
  },
} as const
