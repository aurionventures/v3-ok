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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          error_message: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backup_logs: {
        Row: {
          backup_location: string | null
          backup_size_bytes: number | null
          backup_type: string
          completed_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          started_at: string | null
          status: string
          tables_backed_up: string[] | null
        }
        Insert: {
          backup_location?: string | null
          backup_size_bytes?: number | null
          backup_type: string
          completed_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status: string
          tables_backed_up?: string[] | null
        }
        Update: {
          backup_location?: string | null
          backup_size_bytes?: number | null
          backup_type?: string
          completed_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string
          tables_backed_up?: string[] | null
        }
        Relationships: []
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
      council_reminder_config: {
        Row: {
          council_id: string
          created_at: string | null
          id: string
          remind_12h: boolean | null
          remind_1h: boolean | null
          remind_24h: boolean | null
          remind_30d: boolean | null
          remind_7d: boolean | null
          updated_at: string | null
        }
        Insert: {
          council_id: string
          created_at?: string | null
          id?: string
          remind_12h?: boolean | null
          remind_1h?: boolean | null
          remind_24h?: boolean | null
          remind_30d?: boolean | null
          remind_7d?: boolean | null
          updated_at?: string | null
        }
        Update: {
          council_id?: string
          created_at?: string | null
          id?: string
          remind_12h?: boolean | null
          remind_1h?: boolean | null
          remind_24h?: boolean | null
          remind_30d?: boolean | null
          remind_7d?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "council_reminder_config_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: true
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
      guest_tokens: {
        Row: {
          access_count: number | null
          can_upload: boolean | null
          can_view_materials: boolean | null
          created_at: string | null
          created_by: string | null
          expires_at: string
          id: string
          last_accessed_at: string | null
          meeting_participant_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          access_count?: number | null
          can_upload?: boolean | null
          can_view_materials?: boolean | null
          created_at?: string | null
          created_by?: string | null
          expires_at: string
          id?: string
          last_accessed_at?: string | null
          meeting_participant_id: string
          token?: string
          used_at?: string | null
        }
        Update: {
          access_count?: number | null
          can_upload?: boolean | null
          can_view_materials?: boolean | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string
          id?: string
          last_accessed_at?: string | null
          meeting_participant_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_tokens_meeting_participant_id_fkey"
            columns: ["meeting_participant_id"]
            isOneToOne: false
            referencedRelation: "meeting_participants"
            referencedColumns: ["id"]
          },
        ]
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
      meeting_documents: {
        Row: {
          created_at: string | null
          document_type: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          meeting_id: string
          meeting_item_id: string | null
          name: string
          tags: Json | null
          uploaded_by_guest_token: string | null
          uploaded_by_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          meeting_id: string
          meeting_item_id?: string | null
          name: string
          tags?: Json | null
          uploaded_by_guest_token?: string | null
          uploaded_by_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          meeting_id?: string
          meeting_item_id?: string | null
          name?: string
          tags?: Json | null
          uploaded_by_guest_token?: string | null
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_documents_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_documents_meeting_item_id_fkey"
            columns: ["meeting_item_id"]
            isOneToOne: false
            referencedRelation: "meeting_items"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_item_visibility: {
        Row: {
          can_comment: boolean | null
          can_view: boolean | null
          created_at: string | null
          id: string
          meeting_item_id: string
          meeting_participant_id: string
        }
        Insert: {
          can_comment?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          meeting_item_id: string
          meeting_participant_id: string
        }
        Update: {
          can_comment?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          meeting_item_id?: string
          meeting_participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_item_visibility_meeting_item_id_fkey"
            columns: ["meeting_item_id"]
            isOneToOne: false
            referencedRelation: "meeting_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_item_visibility_meeting_participant_id_fkey"
            columns: ["meeting_participant_id"]
            isOneToOne: false
            referencedRelation: "meeting_participants"
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
      meeting_participants: {
        Row: {
          can_upload: boolean | null
          can_view_materials: boolean | null
          created_at: string | null
          external_email: string | null
          external_name: string | null
          external_phone: string | null
          id: string
          invited_by: string | null
          meeting_id: string
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          can_upload?: boolean | null
          can_view_materials?: boolean | null
          created_at?: string | null
          external_email?: string | null
          external_name?: string | null
          external_phone?: string | null
          id?: string
          invited_by?: string | null
          meeting_id: string
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          can_upload?: boolean | null
          can_view_materials?: boolean | null
          created_at?: string | null
          external_email?: string | null
          external_name?: string | null
          external_phone?: string | null
          id?: string
          invited_by?: string | null
          meeting_id?: string
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_participants_meeting_id_fkey"
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
      notifications: {
        Row: {
          channel: string
          context: Json | null
          created_at: string | null
          error_message: string | null
          external_email: string | null
          id: string
          link: string | null
          message: string
          read_at: string | null
          retry_count: number | null
          scheduled_at: string
          sent_at: string | null
          status: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          channel: string
          context?: Json | null
          created_at?: string | null
          error_message?: string | null
          external_email?: string | null
          id?: string
          link?: string | null
          message: string
          read_at?: string | null
          retry_count?: number | null
          scheduled_at: string
          sent_at?: string | null
          status?: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          channel?: string
          context?: Json | null
          created_at?: string | null
          error_message?: string | null
          external_email?: string | null
          id?: string
          link?: string | null
          message?: string
          read_at?: string | null
          retry_count?: number | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          description: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          id: string
          in_app_enabled: boolean | null
          notify_meeting_reminders: boolean | null
          notify_overdue_actions: boolean | null
          notify_pending_actions: boolean | null
          sms_enabled: boolean | null
          sms_number: string | null
          updated_at: string | null
          user_id: string
          whatsapp_enabled: boolean | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          notify_meeting_reminders?: boolean | null
          notify_overdue_actions?: boolean | null
          notify_pending_actions?: boolean | null
          sms_enabled?: boolean | null
          sms_number?: string | null
          updated_at?: string | null
          user_id: string
          whatsapp_enabled?: boolean | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          notify_meeting_reminders?: boolean | null
          notify_overdue_actions?: boolean | null
          notify_pending_actions?: boolean | null
          sms_enabled?: boolean | null
          sms_number?: string | null
          updated_at?: string | null
          user_id?: string
          whatsapp_enabled?: boolean | null
          whatsapp_number?: string | null
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
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: string | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
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
      cleanup_expired_sessions: { Args: never; Returns: number }
      cleanup_old_audit_logs: {
        Args: { days_to_keep?: number }
        Returns: number
      }
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
