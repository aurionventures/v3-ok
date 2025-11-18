-- ============================================
-- SPRINT 5: AUDITORIA E HARDENING
-- ============================================

-- 1. TABELA DE LOGS DE AUDITORIA
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc
  entity_type TEXT NOT NULL, -- meetings, councils, users, etc
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance de consultas de auditoria
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 2. TABELA DE EVENTOS DE SEGURANÇA
CREATE TABLE security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'FAILED_LOGIN',
    'SUSPICIOUS_ACTIVITY',
    'UNAUTHORIZED_ACCESS',
    'RATE_LIMIT_EXCEEDED',
    'DATA_EXPORT',
    'PRIVILEGE_ESCALATION_ATTEMPT',
    'SQL_INJECTION_ATTEMPT',
    'XSS_ATTEMPT'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  user_agent TEXT,
  description TEXT NOT NULL,
  metadata JSONB,
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para eventos de segurança
CREATE INDEX idx_security_events_severity ON security_events(severity, created_at DESC);
CREATE INDEX idx_security_events_resolved ON security_events(resolved, created_at DESC);
CREATE INDEX idx_security_events_user ON security_events(user_id, created_at DESC);

-- 3. TABELA DE SESSÕES ATIVAS (para monitoramento)
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  last_activity TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id, last_activity DESC);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- 4. TABELA DE BACKUP LOGS
CREATE TABLE backup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT NOT NULL CHECK (backup_type IN ('FULL', 'INCREMENTAL', 'DIFFERENTIAL')),
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED')),
  tables_backed_up TEXT[],
  backup_size_bytes BIGINT,
  backup_location TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB
);

CREATE INDEX idx_backup_logs_status ON backup_logs(status, started_at DESC);

-- 5. RLS POLICIES PARA AUDIT_LOGS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs"
ON audit_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own audit logs"
ON audit_logs FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can insert audit logs"
ON audit_logs FOR INSERT
WITH CHECK (true);

-- 6. RLS POLICIES PARA SECURITY_EVENTS
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all security events"
ON security_events FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update security events"
ON security_events FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert security events"
ON security_events FOR INSERT
WITH CHECK (true);

-- 7. RLS POLICIES PARA USER_SESSIONS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all sessions"
ON user_sessions FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own sessions"
ON user_sessions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can manage sessions"
ON user_sessions FOR ALL
USING (true);

-- 8. RLS POLICIES PARA BACKUP_LOGS
ALTER TABLE backup_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view backup logs"
ON backup_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage backup logs"
ON backup_logs FOR ALL
USING (true);

-- 9. FUNÇÃO AUXILIAR PARA LOGGING AUTOMÁTICO
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
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
$$ LANGUAGE plpgsql;

-- 10. TRIGGERS DE AUDITORIA PARA TABELAS CRÍTICAS
CREATE TRIGGER audit_meetings_changes
AFTER INSERT OR UPDATE OR DELETE ON meetings
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_councils_changes
AFTER INSERT OR UPDATE OR DELETE ON councils
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_users_changes
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_meeting_actions_changes
AFTER INSERT OR UPDATE OR DELETE ON meeting_actions
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_corporate_members_changes
AFTER INSERT OR UPDATE OR DELETE ON corporate_structure_members
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- 11. FUNÇÃO PARA LIMPAR LOGS ANTIGOS
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM audit_logs
  WHERE created_at < now() - (days_to_keep || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 12. FUNÇÃO PARA LIMPAR SESSÕES EXPIRADAS
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_sessions
  WHERE expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 13. HABILITAR REALTIME PARA MONITORAMENTO
ALTER PUBLICATION supabase_realtime ADD TABLE security_events;
ALTER PUBLICATION supabase_realtime ADD TABLE user_sessions;