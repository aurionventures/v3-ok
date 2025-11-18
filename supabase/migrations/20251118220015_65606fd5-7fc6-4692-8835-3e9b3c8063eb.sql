-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  external_email TEXT,
  type TEXT NOT NULL CHECK (type IN ('REUNIAO', 'PENDENCIA', 'LEMBRETE', 'CONVOCACAO')),
  context JSONB,
  channel TEXT NOT NULL CHECK (channel IN ('EMAIL', 'WHATSAPP', 'SMS', 'IN_APP')),
  status TEXT NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'ENVIADA', 'ERRO', 'CANCELADA')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_status ON notifications(user_id, status, scheduled_at);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_at) WHERE status = 'PENDENTE';
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications"
  ON notifications FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create user_notification_preferences table
CREATE TABLE user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  whatsapp_enabled BOOLEAN DEFAULT false,
  whatsapp_number TEXT,
  sms_enabled BOOLEAN DEFAULT false,
  sms_number TEXT,
  in_app_enabled BOOLEAN DEFAULT true,
  notify_meeting_reminders BOOLEAN DEFAULT true,
  notify_pending_actions BOOLEAN DEFAULT true,
  notify_overdue_actions BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_notification_preferences
CREATE POLICY "Users can view their own preferences"
  ON user_notification_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own preferences"
  ON user_notification_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences"
  ON user_notification_preferences FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all preferences"
  ON user_notification_preferences FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_user_notification_preferences_updated_at
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create council_reminder_config table
CREATE TABLE council_reminder_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  council_id UUID REFERENCES councils(id) ON DELETE CASCADE UNIQUE NOT NULL,
  remind_30d BOOLEAN DEFAULT true,
  remind_7d BOOLEAN DEFAULT true,
  remind_24h BOOLEAN DEFAULT true,
  remind_12h BOOLEAN DEFAULT false,
  remind_1h BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE council_reminder_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for council_reminder_config
CREATE POLICY "Users can view configs from their company councils"
  ON council_reminder_config FOR SELECT
  USING (
    council_id IN (
      SELECT id FROM councils 
      WHERE company_id IN (
        SELECT company FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert configs for their company councils"
  ON council_reminder_config FOR INSERT
  WITH CHECK (
    council_id IN (
      SELECT id FROM councils 
      WHERE company_id IN (
        SELECT company FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update configs from their company councils"
  ON council_reminder_config FOR UPDATE
  USING (
    council_id IN (
      SELECT id FROM councils 
      WHERE company_id IN (
        SELECT company FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all configs"
  ON council_reminder_config FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_council_reminder_config_updated_at
  BEFORE UPDATE ON council_reminder_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;