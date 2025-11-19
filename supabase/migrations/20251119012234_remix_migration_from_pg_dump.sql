--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'parceiro',
    'cliente',
    'user'
);


--
-- Name: cleanup_expired_sessions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_expired_sessions() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_sessions
  WHERE expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;


--
-- Name: cleanup_old_audit_logs(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_old_audit_logs(days_to_keep integer DEFAULT 90) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM audit_logs
  WHERE created_at < now() - (days_to_keep || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;


--
-- Name: get_user_role(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_role(_user_id uuid) RETURNS public.app_role
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: log_audit_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_audit_event() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    metadata
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
    jsonb_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: set_meeting_actions_completed_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_meeting_actions_completed_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
BEGIN
  IF NEW.status = 'CONCLUIDA' AND OLD.status != 'CONCLUIDA' THEN
    NEW.completed_at = now();
  ELSIF NEW.status != 'CONCLUIDA' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: update_corporate_members_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_corporate_members_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_meeting_actions_overdue(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_meeting_actions_overdue() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
BEGIN
  IF NEW.due_date < CURRENT_DATE AND NEW.status != 'CONCLUIDA' THEN
    NEW.status = 'ATRASADA';
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: update_meetings_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_meetings_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: access_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.access_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    code text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_by_partner uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address text,
    user_agent text,
    success boolean DEFAULT true,
    error_message text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: backup_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    backup_type text NOT NULL,
    status text NOT NULL,
    tables_backed_up text[],
    backup_size_bytes bigint,
    backup_location text,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    error_message text,
    metadata jsonb,
    CONSTRAINT backup_logs_backup_type_check CHECK ((backup_type = ANY (ARRAY['FULL'::text, 'INCREMENTAL'::text, 'DIFFERENTIAL'::text]))),
    CONSTRAINT backup_logs_status_check CHECK ((status = ANY (ARRAY['PENDING'::text, 'IN_PROGRESS'::text, 'COMPLETED'::text, 'FAILED'::text])))
);


--
-- Name: corporate_structure_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.corporate_structure_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id text NOT NULL,
    user_id uuid,
    name text NOT NULL,
    document text,
    birth_date date,
    email text,
    phone text,
    governance_category text NOT NULL,
    governance_subcategory text,
    official_qualification_code text,
    specific_role text,
    shareholding_percentage numeric(5,2),
    shareholding_class text,
    investment_entry_date date,
    investment_type text,
    term_start_date date,
    term_end_date date,
    term_is_indefinite boolean DEFAULT false,
    committees text[],
    is_independent boolean DEFAULT false,
    is_family_member boolean DEFAULT false,
    generation text,
    status text DEFAULT 'Ativo'::text NOT NULL,
    status_reason text,
    priority integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: council_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.council_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    council_id uuid NOT NULL,
    user_id uuid,
    name text NOT NULL,
    role text NOT NULL,
    start_date date NOT NULL,
    end_date date,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: council_reminder_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.council_reminder_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    council_id uuid NOT NULL,
    remind_30d boolean DEFAULT true,
    remind_7d boolean DEFAULT true,
    remind_24h boolean DEFAULT true,
    remind_12h boolean DEFAULT false,
    remind_1h boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: councils; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.councils (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id text NOT NULL,
    name text NOT NULL,
    type text DEFAULT 'administrativo'::text NOT NULL,
    description text,
    quorum integer DEFAULT 1 NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    organ_type text DEFAULT 'conselho'::text,
    hierarchy_level integer DEFAULT 1,
    access_config jsonb DEFAULT '{"public_view": false, "guest_upload": false, "member_upload": true, "require_approval": false}'::jsonb,
    CONSTRAINT councils_organ_type_check CHECK ((organ_type = ANY (ARRAY['conselho'::text, 'comite'::text, 'comissao'::text])))
);


--
-- Name: guest_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guest_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meeting_participant_id uuid NOT NULL,
    token text DEFAULT (gen_random_uuid())::text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    last_accessed_at timestamp with time zone,
    access_count integer DEFAULT 0,
    can_upload boolean DEFAULT false,
    can_view_materials boolean DEFAULT true,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: interview_transcripts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interview_transcripts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    interview_id uuid NOT NULL,
    transcript_text text NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid
);


--
-- Name: interviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    company_id text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    email text,
    priority text DEFAULT 'medium'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    scheduled_date timestamp with time zone,
    interview_date timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT interviews_priority_check CHECK ((priority = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text]))),
    CONSTRAINT interviews_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'scheduled'::text, 'interviewed'::text])))
);


--
-- Name: meeting_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meeting_actions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meeting_id uuid NOT NULL,
    meeting_item_id uuid,
    responsible_id uuid,
    responsible_external_name text,
    responsible_external_email text,
    description text NOT NULL,
    due_date date NOT NULL,
    status text DEFAULT 'PENDENTE'::text NOT NULL,
    priority text DEFAULT 'MEDIA'::text NOT NULL,
    category text,
    notes text,
    completed_at timestamp with time zone,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT meeting_actions_priority_check CHECK ((priority = ANY (ARRAY['BAIXA'::text, 'MEDIA'::text, 'ALTA'::text]))),
    CONSTRAINT meeting_actions_status_check CHECK ((status = ANY (ARRAY['PENDENTE'::text, 'EM_ANDAMENTO'::text, 'CONCLUIDA'::text, 'ATRASADA'::text])))
);


--
-- Name: meeting_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meeting_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meeting_id uuid NOT NULL,
    meeting_item_id uuid,
    name text NOT NULL,
    file_url text NOT NULL,
    file_type text,
    file_size integer,
    uploaded_by_user_id uuid,
    uploaded_by_guest_token text,
    document_type text,
    tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT meeting_documents_document_type_check CHECK ((document_type = ANY (ARRAY['ATA'::text, 'RELATORIO'::text, 'PROPOSTA'::text, 'ANALISE'::text, 'APRESENTACAO'::text, 'OUTROS'::text])))
);


--
-- Name: meeting_item_visibility; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meeting_item_visibility (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meeting_item_id uuid NOT NULL,
    meeting_participant_id uuid NOT NULL,
    can_view boolean DEFAULT true,
    can_comment boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: meeting_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meeting_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meeting_id uuid NOT NULL,
    order_position integer DEFAULT 0 NOT NULL,
    title text NOT NULL,
    description text,
    presenter text,
    duration_minutes integer,
    type text DEFAULT 'Informativo'::text NOT NULL,
    is_sensitive boolean DEFAULT false NOT NULL,
    key_points jsonb DEFAULT '[]'::jsonb,
    detailed_script text,
    expected_outcome text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT meeting_items_type_check CHECK ((type = ANY (ARRAY['Deliberação'::text, 'Informativo'::text, 'Discussão'::text])))
);


--
-- Name: meeting_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meeting_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meeting_id uuid NOT NULL,
    user_id uuid,
    external_name text,
    external_email text,
    external_phone text,
    role text NOT NULL,
    can_upload boolean DEFAULT false,
    can_view_materials boolean DEFAULT true,
    invited_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    participant_type text DEFAULT 'member'::text,
    permissions jsonb DEFAULT '{"can_vote": false, "can_comment": false, "can_view_agenda": true, "can_upload_documents": false, "view_restricted_items": false}'::jsonb,
    CONSTRAINT meeting_participants_participant_type_check CHECK ((participant_type = ANY (ARRAY['member'::text, 'guest'::text, 'external'::text]))),
    CONSTRAINT meeting_participants_role_check CHECK ((role = ANY (ARRAY['MEMBRO'::text, 'CONVIDADO'::text, 'OBSERVADOR'::text]))),
    CONSTRAINT participant_identity_check CHECK ((((user_id IS NOT NULL) AND (external_name IS NULL) AND (external_email IS NULL)) OR ((user_id IS NULL) AND (external_name IS NOT NULL) AND (external_email IS NOT NULL))))
);


--
-- Name: meetings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meetings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id text NOT NULL,
    council_id uuid NOT NULL,
    date date NOT NULL,
    "time" text NOT NULL,
    title text NOT NULL,
    type text DEFAULT 'Ordinária'::text NOT NULL,
    status text DEFAULT 'AGENDADA'::text NOT NULL,
    location text,
    modalidade text DEFAULT 'Presencial'::text NOT NULL,
    attendees text[],
    minutes_full text,
    minutes_summary text,
    recording_url text,
    recording_type text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT meetings_modalidade_check CHECK ((modalidade = ANY (ARRAY['Presencial'::text, 'Online'::text, 'Híbrida'::text]))),
    CONSTRAINT meetings_status_check CHECK ((status = ANY (ARRAY['AGENDADA'::text, 'EM_ANDAMENTO'::text, 'CONCLUIDA'::text, 'CANCELADA'::text]))),
    CONSTRAINT meetings_type_check CHECK ((type = ANY (ARRAY['Ordinária'::text, 'Extraordinária'::text])))
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    external_email text,
    type text NOT NULL,
    context jsonb,
    channel text NOT NULL,
    status text DEFAULT 'PENDENTE'::text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    link text,
    scheduled_at timestamp with time zone NOT NULL,
    sent_at timestamp with time zone,
    read_at timestamp with time zone,
    error_message text,
    retry_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notifications_channel_check CHECK ((channel = ANY (ARRAY['EMAIL'::text, 'WHATSAPP'::text, 'SMS'::text, 'IN_APP'::text]))),
    CONSTRAINT notifications_status_check CHECK ((status = ANY (ARRAY['PENDENTE'::text, 'ENVIADA'::text, 'ERRO'::text, 'CANCELADA'::text]))),
    CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['REUNIAO'::text, 'PENDENCIA'::text, 'LEMBRETE'::text, 'CONVOCACAO'::text])))
);


--
-- Name: security_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.security_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_type text NOT NULL,
    severity text NOT NULL,
    user_id uuid,
    ip_address text,
    user_agent text,
    description text NOT NULL,
    metadata jsonb,
    resolved boolean DEFAULT false,
    resolved_by uuid,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT security_events_event_type_check CHECK ((event_type = ANY (ARRAY['FAILED_LOGIN'::text, 'SUSPICIOUS_ACTIVITY'::text, 'UNAUTHORIZED_ACCESS'::text, 'RATE_LIMIT_EXCEEDED'::text, 'DATA_EXPORT'::text, 'PRIVILEGE_ESCALATION_ATTEMPT'::text, 'SQL_INJECTION_ATTEMPT'::text, 'XSS_ATTEMPT'::text]))),
    CONSTRAINT security_events_severity_check CHECK ((severity = ANY (ARRAY['LOW'::text, 'MEDIUM'::text, 'HIGH'::text, 'CRITICAL'::text])))
);


--
-- Name: user_notification_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_notification_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    email_enabled boolean DEFAULT true,
    whatsapp_enabled boolean DEFAULT false,
    whatsapp_number text,
    sms_enabled boolean DEFAULT false,
    sms_number text,
    in_app_enabled boolean DEFAULT true,
    notify_meeting_reminders boolean DEFAULT true,
    notify_pending_actions boolean DEFAULT true,
    notify_overdue_actions boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL
);


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    session_token text NOT NULL,
    ip_address text,
    user_agent text,
    last_activity timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    name text,
    company text,
    sector text,
    phone text,
    created_by_partner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: access_codes access_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_codes
    ADD CONSTRAINT access_codes_code_key UNIQUE (code);


--
-- Name: access_codes access_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_codes
    ADD CONSTRAINT access_codes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: backup_logs backup_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_logs
    ADD CONSTRAINT backup_logs_pkey PRIMARY KEY (id);


--
-- Name: corporate_structure_members corporate_structure_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.corporate_structure_members
    ADD CONSTRAINT corporate_structure_members_pkey PRIMARY KEY (id);


--
-- Name: council_members council_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.council_members
    ADD CONSTRAINT council_members_pkey PRIMARY KEY (id);


--
-- Name: council_reminder_config council_reminder_config_council_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.council_reminder_config
    ADD CONSTRAINT council_reminder_config_council_id_key UNIQUE (council_id);


--
-- Name: council_reminder_config council_reminder_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.council_reminder_config
    ADD CONSTRAINT council_reminder_config_pkey PRIMARY KEY (id);


--
-- Name: councils councils_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.councils
    ADD CONSTRAINT councils_pkey PRIMARY KEY (id);


--
-- Name: guest_tokens guest_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_tokens
    ADD CONSTRAINT guest_tokens_pkey PRIMARY KEY (id);


--
-- Name: guest_tokens guest_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_tokens
    ADD CONSTRAINT guest_tokens_token_key UNIQUE (token);


--
-- Name: interview_transcripts interview_transcripts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_transcripts
    ADD CONSTRAINT interview_transcripts_pkey PRIMARY KEY (id);


--
-- Name: interviews interviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_pkey PRIMARY KEY (id);


--
-- Name: meeting_actions meeting_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_actions
    ADD CONSTRAINT meeting_actions_pkey PRIMARY KEY (id);


--
-- Name: meeting_documents meeting_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_documents
    ADD CONSTRAINT meeting_documents_pkey PRIMARY KEY (id);


--
-- Name: meeting_item_visibility meeting_item_visibility_meeting_item_id_meeting_participant_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_item_visibility
    ADD CONSTRAINT meeting_item_visibility_meeting_item_id_meeting_participant_key UNIQUE (meeting_item_id, meeting_participant_id);


--
-- Name: meeting_item_visibility meeting_item_visibility_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_item_visibility
    ADD CONSTRAINT meeting_item_visibility_pkey PRIMARY KEY (id);


--
-- Name: meeting_items meeting_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_items
    ADD CONSTRAINT meeting_items_pkey PRIMARY KEY (id);


--
-- Name: meeting_participants meeting_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_participants
    ADD CONSTRAINT meeting_participants_pkey PRIMARY KEY (id);


--
-- Name: meetings meetings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: security_events security_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_events
    ADD CONSTRAINT security_events_pkey PRIMARY KEY (id);


--
-- Name: user_notification_preferences user_notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notification_preferences
    ADD CONSTRAINT user_notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_notification_preferences user_notification_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notification_preferences
    ADD CONSTRAINT user_notification_preferences_user_id_key UNIQUE (user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_session_token_key UNIQUE (session_token);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_access_codes_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_access_codes_code ON public.access_codes USING btree (code);


--
-- Name: idx_access_codes_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_access_codes_email ON public.access_codes USING btree (email);


--
-- Name: idx_audit_logs_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_action ON public.audit_logs USING btree (action, created_at DESC);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at DESC);


--
-- Name: idx_audit_logs_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (entity_type, entity_id, created_at DESC);


--
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id, created_at DESC);


--
-- Name: idx_backup_logs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_backup_logs_status ON public.backup_logs USING btree (status, started_at DESC);


--
-- Name: idx_corporate_members_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_corporate_members_category ON public.corporate_structure_members USING btree (governance_category);


--
-- Name: idx_corporate_members_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_corporate_members_company ON public.corporate_structure_members USING btree (company_id);


--
-- Name: idx_corporate_members_qualification; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_corporate_members_qualification ON public.corporate_structure_members USING btree (official_qualification_code);


--
-- Name: idx_corporate_members_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_corporate_members_status ON public.corporate_structure_members USING btree (status);


--
-- Name: idx_councils_company_organ_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_councils_company_organ_type ON public.councils USING btree (company_id, organ_type);


--
-- Name: idx_councils_organ_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_councils_organ_type ON public.councils USING btree (organ_type);


--
-- Name: idx_guest_tokens_participant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_guest_tokens_participant ON public.guest_tokens USING btree (meeting_participant_id);


--
-- Name: idx_guest_tokens_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_guest_tokens_token ON public.guest_tokens USING btree (token);


--
-- Name: idx_meeting_actions_due_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_actions_due_date ON public.meeting_actions USING btree (due_date);


--
-- Name: idx_meeting_actions_meeting; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_actions_meeting ON public.meeting_actions USING btree (meeting_id);


--
-- Name: idx_meeting_actions_responsible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_actions_responsible ON public.meeting_actions USING btree (responsible_id);


--
-- Name: idx_meeting_actions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_actions_status ON public.meeting_actions USING btree (status);


--
-- Name: idx_meeting_documents_meeting; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_documents_meeting ON public.meeting_documents USING btree (meeting_id);


--
-- Name: idx_meeting_item_visibility_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_item_visibility_item ON public.meeting_item_visibility USING btree (meeting_item_id);


--
-- Name: idx_meeting_items_meeting; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_items_meeting ON public.meeting_items USING btree (meeting_id);


--
-- Name: idx_meeting_items_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_items_order ON public.meeting_items USING btree (meeting_id, order_position);


--
-- Name: idx_meeting_participants_meeting; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_participants_meeting ON public.meeting_participants USING btree (meeting_id);


--
-- Name: idx_meeting_participants_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_participants_type ON public.meeting_participants USING btree (participant_type);


--
-- Name: idx_meeting_participants_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_participants_user ON public.meeting_participants USING btree (user_id);


--
-- Name: idx_meetings_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meetings_company ON public.meetings USING btree (company_id);


--
-- Name: idx_meetings_council; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meetings_council ON public.meetings USING btree (council_id);


--
-- Name: idx_meetings_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meetings_date ON public.meetings USING btree (date);


--
-- Name: idx_meetings_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meetings_status ON public.meetings USING btree (status);


--
-- Name: idx_notifications_scheduled; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_scheduled ON public.notifications USING btree (scheduled_at) WHERE (status = 'PENDENTE'::text);


--
-- Name: idx_notifications_user_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_status ON public.notifications USING btree (user_id, status, scheduled_at);


--
-- Name: idx_notifications_user_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_unread ON public.notifications USING btree (user_id, read_at) WHERE (read_at IS NULL);


--
-- Name: idx_security_events_resolved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_events_resolved ON public.security_events USING btree (resolved, created_at DESC);


--
-- Name: idx_security_events_severity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_events_severity ON public.security_events USING btree (severity, created_at DESC);


--
-- Name: idx_security_events_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_events_user ON public.security_events USING btree (user_id, created_at DESC);


--
-- Name: idx_user_roles_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_role ON public.user_roles USING btree (role);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: idx_user_sessions_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sessions_expires ON public.user_sessions USING btree (expires_at);


--
-- Name: idx_user_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions USING btree (user_id, last_activity DESC);


--
-- Name: idx_users_created_by_partner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_created_by_partner ON public.users USING btree (created_by_partner);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: corporate_structure_members audit_corporate_members_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_corporate_members_changes AFTER INSERT OR DELETE OR UPDATE ON public.corporate_structure_members FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();


--
-- Name: councils audit_councils_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_councils_changes AFTER INSERT OR DELETE OR UPDATE ON public.councils FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();


--
-- Name: meeting_actions audit_meeting_actions_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_meeting_actions_changes AFTER INSERT OR DELETE OR UPDATE ON public.meeting_actions FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();


--
-- Name: meetings audit_meetings_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_meetings_changes AFTER INSERT OR DELETE OR UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();


--
-- Name: users audit_users_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_users_changes AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();


--
-- Name: meeting_actions check_meeting_actions_overdue; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_meeting_actions_overdue BEFORE INSERT OR UPDATE ON public.meeting_actions FOR EACH ROW EXECUTE FUNCTION public.update_meeting_actions_overdue();


--
-- Name: corporate_structure_members corporate_members_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER corporate_members_updated_at BEFORE UPDATE ON public.corporate_structure_members FOR EACH ROW EXECUTE FUNCTION public.update_corporate_members_updated_at();


--
-- Name: meeting_actions set_meeting_actions_completed; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_meeting_actions_completed BEFORE UPDATE ON public.meeting_actions FOR EACH ROW EXECUTE FUNCTION public.set_meeting_actions_completed_at();


--
-- Name: council_members update_council_members_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_council_members_updated_at BEFORE UPDATE ON public.council_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: council_reminder_config update_council_reminder_config_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_council_reminder_config_updated_at BEFORE UPDATE ON public.council_reminder_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: councils update_councils_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_councils_updated_at BEFORE UPDATE ON public.councils FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: interviews update_interviews_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON public.interviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: meeting_actions update_meeting_actions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_meeting_actions_updated_at BEFORE UPDATE ON public.meeting_actions FOR EACH ROW EXECUTE FUNCTION public.update_meetings_updated_at();


--
-- Name: meeting_items update_meeting_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_meeting_items_updated_at BEFORE UPDATE ON public.meeting_items FOR EACH ROW EXECUTE FUNCTION public.update_meetings_updated_at();


--
-- Name: meeting_participants update_meeting_participants_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_meeting_participants_updated_at BEFORE UPDATE ON public.meeting_participants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: meetings update_meetings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.update_meetings_updated_at();


--
-- Name: user_notification_preferences update_user_notification_preferences_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_notification_preferences_updated_at BEFORE UPDATE ON public.user_notification_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: access_codes access_codes_created_by_partner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_codes
    ADD CONSTRAINT access_codes_created_by_partner_fkey FOREIGN KEY (created_by_partner) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: corporate_structure_members corporate_structure_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.corporate_structure_members
    ADD CONSTRAINT corporate_structure_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: council_members council_members_council_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.council_members
    ADD CONSTRAINT council_members_council_id_fkey FOREIGN KEY (council_id) REFERENCES public.councils(id) ON DELETE CASCADE;


--
-- Name: council_reminder_config council_reminder_config_council_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.council_reminder_config
    ADD CONSTRAINT council_reminder_config_council_id_fkey FOREIGN KEY (council_id) REFERENCES public.councils(id) ON DELETE CASCADE;


--
-- Name: guest_tokens guest_tokens_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_tokens
    ADD CONSTRAINT guest_tokens_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: guest_tokens guest_tokens_meeting_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_tokens
    ADD CONSTRAINT guest_tokens_meeting_participant_id_fkey FOREIGN KEY (meeting_participant_id) REFERENCES public.meeting_participants(id) ON DELETE CASCADE;


--
-- Name: interview_transcripts interview_transcripts_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_transcripts
    ADD CONSTRAINT interview_transcripts_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: interview_transcripts interview_transcripts_interview_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_transcripts
    ADD CONSTRAINT interview_transcripts_interview_id_fkey FOREIGN KEY (interview_id) REFERENCES public.interviews(id) ON DELETE CASCADE;


--
-- Name: interviews interviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: meeting_actions meeting_actions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_actions
    ADD CONSTRAINT meeting_actions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: meeting_actions meeting_actions_meeting_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_actions
    ADD CONSTRAINT meeting_actions_meeting_id_fkey FOREIGN KEY (meeting_id) REFERENCES public.meetings(id) ON DELETE CASCADE;


--
-- Name: meeting_actions meeting_actions_meeting_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_actions
    ADD CONSTRAINT meeting_actions_meeting_item_id_fkey FOREIGN KEY (meeting_item_id) REFERENCES public.meeting_items(id) ON DELETE SET NULL;


--
-- Name: meeting_actions meeting_actions_responsible_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_actions
    ADD CONSTRAINT meeting_actions_responsible_id_fkey FOREIGN KEY (responsible_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: meeting_documents meeting_documents_meeting_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_documents
    ADD CONSTRAINT meeting_documents_meeting_id_fkey FOREIGN KEY (meeting_id) REFERENCES public.meetings(id) ON DELETE CASCADE;


--
-- Name: meeting_documents meeting_documents_meeting_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_documents
    ADD CONSTRAINT meeting_documents_meeting_item_id_fkey FOREIGN KEY (meeting_item_id) REFERENCES public.meeting_items(id) ON DELETE SET NULL;


--
-- Name: meeting_documents meeting_documents_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_documents
    ADD CONSTRAINT meeting_documents_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES auth.users(id);


--
-- Name: meeting_item_visibility meeting_item_visibility_meeting_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_item_visibility
    ADD CONSTRAINT meeting_item_visibility_meeting_item_id_fkey FOREIGN KEY (meeting_item_id) REFERENCES public.meeting_items(id) ON DELETE CASCADE;


--
-- Name: meeting_item_visibility meeting_item_visibility_meeting_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_item_visibility
    ADD CONSTRAINT meeting_item_visibility_meeting_participant_id_fkey FOREIGN KEY (meeting_participant_id) REFERENCES public.meeting_participants(id) ON DELETE CASCADE;


--
-- Name: meeting_items meeting_items_meeting_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_items
    ADD CONSTRAINT meeting_items_meeting_id_fkey FOREIGN KEY (meeting_id) REFERENCES public.meetings(id) ON DELETE CASCADE;


--
-- Name: meeting_participants meeting_participants_invited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_participants
    ADD CONSTRAINT meeting_participants_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES auth.users(id);


--
-- Name: meeting_participants meeting_participants_meeting_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_participants
    ADD CONSTRAINT meeting_participants_meeting_id_fkey FOREIGN KEY (meeting_id) REFERENCES public.meetings(id) ON DELETE CASCADE;


--
-- Name: meeting_participants meeting_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_participants
    ADD CONSTRAINT meeting_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: meetings meetings_council_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_council_id_fkey FOREIGN KEY (council_id) REFERENCES public.councils(id) ON DELETE CASCADE;


--
-- Name: meetings meetings_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: security_events security_events_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_events
    ADD CONSTRAINT security_events_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES auth.users(id);


--
-- Name: security_events security_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_events
    ADD CONSTRAINT security_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: user_notification_preferences user_notification_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notification_preferences
    ADD CONSTRAINT user_notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: users users_created_by_partner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_created_by_partner_fkey FOREIGN KEY (created_by_partner) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: access_codes Admins can manage all access codes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all access codes" ON public.access_codes USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: council_reminder_config Admins can manage all configs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all configs" ON public.council_reminder_config USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: council_members Admins can manage all council members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all council members" ON public.council_members USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: councils Admins can manage all councils; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all councils" ON public.councils USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: guest_tokens Admins can manage all guest tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all guest tokens" ON public.guest_tokens USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: interviews Admins can manage all interviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all interviews" ON public.interviews USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: meeting_item_visibility Admins can manage all item visibility; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all item visibility" ON public.meeting_item_visibility USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: meeting_actions Admins can manage all meeting actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all meeting actions" ON public.meeting_actions TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: meeting_documents Admins can manage all meeting documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all meeting documents" ON public.meeting_documents USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: meeting_items Admins can manage all meeting items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all meeting items" ON public.meeting_items TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: meeting_participants Admins can manage all meeting participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all meeting participants" ON public.meeting_participants USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: meetings Admins can manage all meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all meetings" ON public.meetings TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: corporate_structure_members Admins can manage all members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all members" ON public.corporate_structure_members USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: notifications Admins can manage all notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all notifications" ON public.notifications USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_notification_preferences Admins can manage all preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all preferences" ON public.user_notification_preferences USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: interview_transcripts Admins can manage all transcripts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all transcripts" ON public.interview_transcripts USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: users Admins can manage all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all users" ON public.users USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: security_events Admins can update security events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update security events" ON public.security_events FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: access_codes Admins can view all access codes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all access codes" ON public.access_codes FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: audit_logs Admins can view all audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: security_events Admins can view all security events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all security events" ON public.security_events FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_sessions Admins can view all sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all sessions" ON public.user_sessions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: users Admins can view all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: backup_logs Admins can view backup logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view backup logs" ON public.backup_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: access_codes Partners can create access codes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Partners can create access codes" ON public.access_codes FOR INSERT WITH CHECK ((created_by_partner = auth.uid()));


--
-- Name: users Partners can create clients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Partners can create clients" ON public.users FOR INSERT WITH CHECK ((public.has_role(auth.uid(), 'parceiro'::public.app_role) AND (created_by_partner = auth.uid())));


--
-- Name: users Partners can update their clients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Partners can update their clients" ON public.users FOR UPDATE USING ((public.has_role(auth.uid(), 'parceiro'::public.app_role) AND (created_by_partner = auth.uid())));


--
-- Name: user_roles Partners can view client roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Partners can view client roles" ON public.user_roles FOR SELECT USING ((public.has_role(auth.uid(), 'parceiro'::public.app_role) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = user_roles.user_id) AND (users.created_by_partner = auth.uid()))))));


--
-- Name: access_codes Partners can view their access codes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Partners can view their access codes" ON public.access_codes FOR SELECT USING ((created_by_partner = auth.uid()));


--
-- Name: users Partners can view their clients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Partners can view their clients" ON public.users FOR SELECT USING ((public.has_role(auth.uid(), 'parceiro'::public.app_role) AND ((id = auth.uid()) OR (created_by_partner = auth.uid()))));


--
-- Name: meeting_actions Responsible users can view their own actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Responsible users can view their own actions" ON public.meeting_actions FOR SELECT TO authenticated USING ((responsible_id = auth.uid()));


--
-- Name: audit_logs System can insert audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);


--
-- Name: security_events System can insert security events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert security events" ON public.security_events FOR INSERT WITH CHECK (true);


--
-- Name: backup_logs System can manage backup logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage backup logs" ON public.backup_logs USING (true);


--
-- Name: user_sessions System can manage sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage sessions" ON public.user_sessions USING (true);


--
-- Name: guest_tokens Users can create guest tokens for their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create guest tokens for their company meetings" ON public.guest_tokens FOR INSERT WITH CHECK ((meeting_participant_id IN ( SELECT mp.id
   FROM (public.meeting_participants mp
     JOIN public.meetings m ON ((mp.meeting_id = m.id)))
  WHERE (m.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: interviews Users can create interviews for their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create interviews for their company" ON public.interviews FOR INSERT WITH CHECK (((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (user_id = auth.uid())));


--
-- Name: interview_transcripts Users can create transcripts for their company interviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create transcripts for their company interviews" ON public.interview_transcripts FOR INSERT WITH CHECK (((interview_id IN ( SELECT interviews.id
   FROM public.interviews
  WHERE (interviews.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))) AND (created_by = auth.uid())));


--
-- Name: meeting_actions Users can delete actions from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete actions from their company meetings" ON public.meeting_actions FOR DELETE TO authenticated USING ((meeting_id IN ( SELECT meetings.id
   FROM public.meetings
  WHERE (meetings.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: councils Users can delete councils from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete councils from their company" ON public.councils FOR DELETE USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: interviews Users can delete interviews from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete interviews from their company" ON public.interviews FOR DELETE USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: meeting_items Users can delete items from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete items from their company meetings" ON public.meeting_items FOR DELETE TO authenticated USING ((meeting_id IN ( SELECT meetings.id
   FROM public.meetings
  WHERE (meetings.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meetings Users can delete meetings from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete meetings from their company" ON public.meetings FOR DELETE TO authenticated USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: corporate_structure_members Users can delete members from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete members from their company" ON public.corporate_structure_members FOR DELETE USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: council_members Users can delete members from their company councils; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete members from their company councils" ON public.council_members FOR DELETE USING ((council_id IN ( SELECT councils.id
   FROM public.councils
  WHERE (councils.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meeting_participants Users can delete participants from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete participants from their company meetings" ON public.meeting_participants FOR DELETE USING ((meeting_id IN ( SELECT m.id
   FROM public.meetings m
  WHERE (m.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meeting_actions Users can insert actions to their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert actions to their company meetings" ON public.meeting_actions FOR INSERT TO authenticated WITH CHECK ((meeting_id IN ( SELECT meetings.id
   FROM public.meetings
  WHERE (meetings.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: council_reminder_config Users can insert configs for their company councils; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert configs for their company councils" ON public.council_reminder_config FOR INSERT WITH CHECK ((council_id IN ( SELECT councils.id
   FROM public.councils
  WHERE (councils.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: councils Users can insert councils for their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert councils for their company" ON public.councils FOR INSERT WITH CHECK ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: meeting_items Users can insert items to their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert items to their company meetings" ON public.meeting_items FOR INSERT TO authenticated WITH CHECK ((meeting_id IN ( SELECT meetings.id
   FROM public.meetings
  WHERE (meetings.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meetings Users can insert meetings for their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert meetings for their company" ON public.meetings FOR INSERT TO authenticated WITH CHECK (((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (created_by = auth.uid())));


--
-- Name: corporate_structure_members Users can insert members to their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert members to their company" ON public.corporate_structure_members FOR INSERT WITH CHECK ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: council_members Users can insert members to their company councils; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert members to their company councils" ON public.council_members FOR INSERT WITH CHECK ((council_id IN ( SELECT councils.id
   FROM public.councils
  WHERE (councils.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meeting_participants Users can insert participants to their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert participants to their company meetings" ON public.meeting_participants FOR INSERT WITH CHECK ((meeting_id IN ( SELECT m.id
   FROM public.meetings m
  WHERE (m.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: user_notification_preferences Users can insert their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own preferences" ON public.user_notification_preferences FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: meeting_item_visibility Users can manage item visibility for their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage item visibility for their company meetings" ON public.meeting_item_visibility USING ((meeting_item_id IN ( SELECT mi.id
   FROM (public.meeting_items mi
     JOIN public.meetings m ON ((mi.meeting_id = m.id)))
  WHERE (m.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meeting_actions Users can update actions from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update actions from their company meetings" ON public.meeting_actions FOR UPDATE TO authenticated USING (((meeting_id IN ( SELECT meetings.id
   FROM public.meetings
  WHERE (meetings.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))) OR (responsible_id = auth.uid())));


--
-- Name: council_reminder_config Users can update configs from their company councils; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update configs from their company councils" ON public.council_reminder_config FOR UPDATE USING ((council_id IN ( SELECT councils.id
   FROM public.councils
  WHERE (councils.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: councils Users can update councils from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update councils from their company" ON public.councils FOR UPDATE USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: interviews Users can update interviews from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update interviews from their company" ON public.interviews FOR UPDATE USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: meeting_items Users can update items from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update items from their company meetings" ON public.meeting_items FOR UPDATE TO authenticated USING ((meeting_id IN ( SELECT meetings.id
   FROM public.meetings
  WHERE (meetings.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meetings Users can update meetings from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update meetings from their company" ON public.meetings FOR UPDATE TO authenticated USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: corporate_structure_members Users can update members from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update members from their company" ON public.corporate_structure_members FOR UPDATE USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: council_members Users can update members from their company councils; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update members from their company councils" ON public.council_members FOR UPDATE USING ((council_id IN ( SELECT councils.id
   FROM public.councils
  WHERE (councils.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meeting_participants Users can update participants from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update participants from their company meetings" ON public.meeting_participants FOR UPDATE USING ((meeting_id IN ( SELECT m.id
   FROM public.meetings m
  WHERE (m.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: notifications Users can update their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: user_notification_preferences Users can update their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own preferences" ON public.user_notification_preferences FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: interview_transcripts Users can update transcripts from their company interviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update transcripts from their company interviews" ON public.interview_transcripts FOR UPDATE USING ((interview_id IN ( SELECT interviews.id
   FROM public.interviews
  WHERE (interviews.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meeting_documents Users can upload documents to their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can upload documents to their company meetings" ON public.meeting_documents FOR INSERT WITH CHECK ((meeting_id IN ( SELECT m.id
   FROM public.meetings m
  WHERE (m.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meeting_actions Users can view actions from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view actions from their company meetings" ON public.meeting_actions FOR SELECT TO authenticated USING ((meeting_id IN ( SELECT meetings.id
   FROM public.meetings
  WHERE (meetings.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: council_reminder_config Users can view configs from their company councils; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view configs from their company councils" ON public.council_reminder_config FOR SELECT USING ((council_id IN ( SELECT councils.id
   FROM public.councils
  WHERE (councils.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: councils Users can view councils from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view councils from their company" ON public.councils FOR SELECT USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: meeting_documents Users can view documents from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view documents from their company meetings" ON public.meeting_documents FOR SELECT USING ((meeting_id IN ( SELECT m.id
   FROM public.meetings m
  WHERE (m.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: guest_tokens Users can view guest tokens from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view guest tokens from their company meetings" ON public.guest_tokens FOR SELECT USING ((meeting_participant_id IN ( SELECT mp.id
   FROM (public.meeting_participants mp
     JOIN public.meetings m ON ((mp.meeting_id = m.id)))
  WHERE (m.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: interviews Users can view interviews from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view interviews from their company" ON public.interviews FOR SELECT USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: meeting_item_visibility Users can view item visibility from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view item visibility from their company meetings" ON public.meeting_item_visibility FOR SELECT USING ((meeting_item_id IN ( SELECT mi.id
   FROM (public.meeting_items mi
     JOIN public.meetings m ON ((mi.meeting_id = m.id)))
  WHERE (m.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meeting_items Users can view items from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view items from their company meetings" ON public.meeting_items FOR SELECT TO authenticated USING ((meeting_id IN ( SELECT meetings.id
   FROM public.meetings
  WHERE (meetings.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: meetings Users can view meetings from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view meetings from their company" ON public.meetings FOR SELECT TO authenticated USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: corporate_structure_members Users can view members from their company; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view members from their company" ON public.corporate_structure_members FOR SELECT USING ((company_id IN ( SELECT users.company
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: council_members Users can view members from their company councils; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view members from their company councils" ON public.council_members FOR SELECT USING ((council_id IN ( SELECT councils.id
   FROM public.councils
  WHERE (councils.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: user_roles Users can view own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: meeting_participants Users can view participants from their company meetings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view participants from their company meetings" ON public.meeting_participants FOR SELECT USING ((meeting_id IN ( SELECT m.id
   FROM public.meetings m
  WHERE (m.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: audit_logs Users can view their own audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own audit logs" ON public.audit_logs FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: user_notification_preferences Users can view their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own preferences" ON public.user_notification_preferences FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: user_sessions Users can view their own sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own sessions" ON public.user_sessions FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: users Users can view themselves; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view themselves" ON public.users FOR SELECT USING ((id = auth.uid()));


--
-- Name: interview_transcripts Users can view transcripts from their company interviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view transcripts from their company interviews" ON public.interview_transcripts FOR SELECT USING ((interview_id IN ( SELECT interviews.id
   FROM public.interviews
  WHERE (interviews.company_id IN ( SELECT users.company
           FROM public.users
          WHERE (users.id = auth.uid()))))));


--
-- Name: access_codes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: backup_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: corporate_structure_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.corporate_structure_members ENABLE ROW LEVEL SECURITY;

--
-- Name: council_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.council_members ENABLE ROW LEVEL SECURITY;

--
-- Name: council_reminder_config; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.council_reminder_config ENABLE ROW LEVEL SECURITY;

--
-- Name: councils; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.councils ENABLE ROW LEVEL SECURITY;

--
-- Name: guest_tokens; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.guest_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: interview_transcripts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.interview_transcripts ENABLE ROW LEVEL SECURITY;

--
-- Name: interviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

--
-- Name: meeting_actions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.meeting_actions ENABLE ROW LEVEL SECURITY;

--
-- Name: meeting_documents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.meeting_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: meeting_item_visibility; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.meeting_item_visibility ENABLE ROW LEVEL SECURITY;

--
-- Name: meeting_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.meeting_items ENABLE ROW LEVEL SECURITY;

--
-- Name: meeting_participants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;

--
-- Name: meetings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: security_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

--
-- Name: user_notification_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


