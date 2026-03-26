import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string | null;
  modalidade: string;
  council_id: string;
  company_id: string;
}

interface ReminderConfig {
  remind_30d: boolean;
  remind_7d: boolean;
  remind_24h: boolean;
  remind_12h: boolean;
  remind_1h: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Starting governance reminders job...");

    // Get meetings in the next 30 days
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const { data: meetings, error: meetingsError } = await supabase
      .from("meetings")
      .select("*, councils(name)")
      .eq("status", "AGENDADA")
      .gte("date", now.toISOString().split("T")[0])
      .lte("date", futureDate.toISOString().split("T")[0]);

    if (meetingsError) throw meetingsError;

    console.log(`Found ${meetings?.length || 0} upcoming meetings`);

    for (const meeting of meetings || []) {
      // Calculate days until meeting
      const meetingDate = new Date(meeting.date);
      const daysUntil = Math.ceil((meetingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const hoursUntil = Math.ceil((meetingDate.getTime() - now.getTime()) / (1000 * 60 * 60));

      // Get reminder config for this council
      const { data: config } = await supabase
        .from("council_reminder_config")
        .select("*")
        .eq("council_id", meeting.council_id)
        .single();

      const reminderConfig: ReminderConfig = config || {
        remind_30d: true,
        remind_7d: true,
        remind_24h: true,
        remind_12h: false,
        remind_1h: false,
      };

      // Determine which reminder to send
      let shouldSendReminder = false;
      let reminderType = "";

      if (daysUntil === 30 && reminderConfig.remind_30d) {
        shouldSendReminder = true;
        reminderType = "30d";
      } else if (daysUntil === 7 && reminderConfig.remind_7d) {
        shouldSendReminder = true;
        reminderType = "7d";
      } else if (hoursUntil <= 24 && hoursUntil > 12 && reminderConfig.remind_24h) {
        shouldSendReminder = true;
        reminderType = "24h";
      } else if (hoursUntil <= 12 && hoursUntil > 1 && reminderConfig.remind_12h) {
        shouldSendReminder = true;
        reminderType = "12h";
      } else if (hoursUntil <= 1 && reminderConfig.remind_1h) {
        shouldSendReminder = true;
        reminderType = "1h";
      }

      if (!shouldSendReminder) continue;

      console.log(`Processing ${reminderType} reminder for meeting ${meeting.id}`);

      // Get meeting participants
      const { data: participants } = await supabase
        .from("meeting_participants")
        .select("user_id, external_email")
        .eq("meeting_id", meeting.id);

      for (const participant of participants || []) {
        // Check for duplicate notifications
        const { data: existing } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", participant.user_id)
          .eq("type", "LEMBRETE")
          .contains("context", { meeting_id: meeting.id, reminder_type: reminderType })
          .single();

        if (existing) {
          console.log(`Skipping duplicate reminder for user ${participant.user_id}`);
          continue;
        }

        // Get user preferences
        const { data: preferences } = await supabase
          .from("user_notification_preferences")
          .select("*")
          .eq("user_id", participant.user_id)
          .single();

        if (preferences && !preferences.notify_meeting_reminders) {
          console.log(`User ${participant.user_id} has disabled meeting reminders`);
          continue;
        }

        const context = {
          meeting_id: meeting.id,
          meeting_title: meeting.title,
          meeting_date: meeting.date,
          meeting_time: meeting.time,
          council_name: meeting.councils?.name,
          days_until: daysUntil,
          reminder_type: reminderType,
        };

        let title = "";
        let message = "";

        if (reminderType === "30d") {
          title = `Reunião em 30 dias: ${meeting.title}`;
          message = `A reunião "${meeting.title}" está agendada para ${new Date(meeting.date).toLocaleDateString("pt-BR")} às ${meeting.time}.`;
        } else if (reminderType === "7d") {
          title = `Reunião na próxima semana: ${meeting.title}`;
          message = `A reunião "${meeting.title}" acontece em uma semana, em ${new Date(meeting.date).toLocaleDateString("pt-BR")} às ${meeting.time}.`;
        } else if (reminderType === "24h") {
          title = `Reunião amanhã: ${meeting.title}`;
          message = `⏰ A reunião "${meeting.title}" acontece amanhã, ${new Date(meeting.date).toLocaleDateString("pt-BR")} às ${meeting.time}.`;
        } else if (reminderType === "12h") {
          title = `Reunião em 12 horas: ${meeting.title}`;
          message = `⏰ A reunião "${meeting.title}" acontece em 12 horas, às ${meeting.time}.`;
        } else if (reminderType === "1h") {
          title = `Reunião em 1 hora: ${meeting.title}`;
          message = `⏰ A reunião "${meeting.title}" começa em 1 hora, às ${meeting.time}!`;
        }

        const link = `/reunioes/${meeting.id}`;

        // Create notifications for enabled channels
        const channels = [];
        if (preferences?.email_enabled !== false) channels.push("EMAIL");
        if (preferences?.whatsapp_enabled) channels.push("WHATSAPP");
        if (preferences?.sms_enabled) channels.push("SMS");
        if (preferences?.in_app_enabled !== false) channels.push("IN_APP");

        for (const channel of channels) {
          const { error: notifError } = await supabase
            .from("notifications")
            .insert({
              user_id: participant.user_id,
              external_email: participant.external_email,
              type: "LEMBRETE",
              channel,
              title,
              message,
              link,
              context,
              scheduled_at: now.toISOString(),
            });

          if (notifError) {
            console.error(`Error creating notification: ${notifError.message}`);
          }
        }
      }
    }

    // Process pending notifications
    const { data: pendingNotifications } = await supabase
      .from("notifications")
      .select("*")
      .eq("status", "PENDENTE")
      .eq("channel", "EMAIL")
      .lte("scheduled_at", now.toISOString());

    console.log(`Processing ${pendingNotifications?.length || 0} pending email notifications`);

    // Here you would integrate with your email service (Resend, EmailJS, etc.)
    // For now, just mark as sent
    for (const notification of pendingNotifications || []) {
      await supabase
        .from("notifications")
        .update({ status: "ENVIADA", sent_at: now.toISOString() })
        .eq("id", notification.id);
    }

    console.log("Governance reminders job completed successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Reminders processed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in governance-reminders:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
