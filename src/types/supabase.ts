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
      councils: {
        Row: {
          id: string
          company_id: string
          name: string
          type: string
          description: string | null
          quorum: number | null
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          type?: string
          description?: string | null
          quorum?: number | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          type?: string
          description?: string | null
          quorum?: number | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      council_members: {
        Row: {
          id: string
          council_id: string
          user_id: string | null
          name: string
          role: string
          start_date: string
          end_date: string | null
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          council_id: string
          user_id?: string | null
          name: string
          role: string
          start_date: string
          end_date?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          council_id?: string
          user_id?: string | null
          name?: string
          role?: string
          start_date?: string
          end_date?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "council_members_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "councils"
            referencedColumns: ["id"]
          }
        ]
      }
      corporate_structure_members: {
        Row: {
          id: string
          company_id: string
          name: string
          birth_date: string | null
          age: number | null
          category: string
          role: string
          involvement: string | null
          status: string
          email: string | null
          phone: string | null
          document: string | null
          address: Json | null
          is_family_member: boolean
          is_external: boolean
          priority_order: number
          shareholding: string | null
          created_by: string | null
          updated_by: string | null
          user_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          birth_date?: string | null
          age?: number | null
          category: string
          role: string
          involvement?: string | null
          status?: string
          email?: string | null
          phone?: string | null
          document?: string | null
          address?: Json | null
          is_family_member?: boolean
          is_external?: boolean
          priority_order?: number
          shareholding?: string | null
          created_by?: string | null
          updated_by?: string | null
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          birth_date?: string | null
          age?: number | null
          category?: string
          role?: string
          involvement?: string | null
          status?: string
          email?: string | null
          phone?: string | null
          document?: string | null
          address?: Json | null
          is_family_member?: boolean
          is_external?: boolean
          priority_order?: number
          shareholding?: string | null
          created_by?: string | null
          updated_by?: string | null
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      meetings: {
        Row: {
          id: string
          council_id: string
          company_id: string | null
          title: string
          description: string | null
          date: string
          time: string | null
          type: string | null
          agenda: string | null
          scheduled_date: string | null
          start_time: string | null
          end_time: string | null
          location: string | null
          status: string
          meeting_type: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          council_id: string
          company_id?: string | null
          title: string
          description?: string | null
          date?: string
          time?: string | null
          type?: string | null
          agenda?: string | null
          scheduled_date?: string | null
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          status?: string
          meeting_type?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          council_id?: string
          company_id?: string | null
          title?: string
          description?: string | null
          date?: string
          time?: string | null
          type?: string | null
          agenda?: string | null
          scheduled_date?: string | null
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          status?: string
          meeting_type?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "councils"
            referencedColumns: ["id"]
          }
        ]
      }
      voting_projects: {
        Row: {
          id: string
          council_id: string
          title: string
          description: string | null
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          council_id: string
          title: string
          description?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          council_id?: string
          title?: string
          description?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voting_projects_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "councils"
            referencedColumns: ["id"]
          }
        ]
      }
      votes: {
        Row: {
          id: string
          project_id: string
          member_id: string
          vote: string
          comment: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          member_id: string
          vote: string
          comment?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          member_id?: string
          vote?: string
          comment?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "voting_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "council_members"
            referencedColumns: ["id"]
          }
        ]
      }
      council_documents: {
        Row: {
          id: string
          council_id: string
          company_id: string
          name: string
          type: string
          file_url: string
          file_size: string | null
          mime_type: string | null
          version: string | null
          uploaded_by: string | null
          tags: string[] | null
          description: string | null
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          council_id: string
          company_id: string
          name: string
          type: string
          file_url: string
          file_size?: string | null
          mime_type?: string | null
          version?: string | null
          uploaded_by?: string | null
          tags?: string[] | null
          description?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          council_id?: string
          company_id?: string
          name?: string
          type?: string
          file_url?: string
          file_size?: string | null
          mime_type?: string | null
          version?: string | null
          uploaded_by?: string | null
          tags?: string[] | null
          description?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "council_documents_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "councils"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by_partner: string | null
          email: string
          id: string
          name: string | null
          role: string | null
          sector: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by_partner?: string | null
          email: string
          id?: string
          name?: string | null
          role?: string | null
          sector?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by_partner?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string | null
          sector?: string | null
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
      sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const