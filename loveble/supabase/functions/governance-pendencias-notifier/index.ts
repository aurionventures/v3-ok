import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Starting pendencias notifier job...");

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get all pending or in-progress actions
    const { data: actions, error: actionsError } = await supabase
      .from("meeting_actions")
      .select("*, meetings(title, councils(name))")
      .in("status", ["PENDENTE", "EM_ANDAMENTO", "ATRASADA"])
      .not("due_date", "is", null);

    if (actionsError) throw actionsError;

    console.log(`Found ${actions?.length || 0} pending actions`);

    for (const action of actions || []) {
      const dueDate = new Date(action.due_date);
      const daysUntil = Math.ceil((dueDate.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

      // Determine urgency level and if we should notify
      let shouldNotify = false;
      let urgencyLevel = "";

      if (daysUntil === 7) {
        shouldNotify = true;
        urgencyLevel = "7d";
      } else if (daysUntil === 3) {
        shouldNotify = true;
        urgencyLevel = "3d";
      } else if (daysUntil === 1) {
        shouldNotify = true;
        urgencyLevel = "1d";
      } else if (daysUntil === 0) {
        shouldNotify = true;
        urgencyLevel = "today";
      } else if (daysUntil < 0) {
        shouldNotify = true;
        urgencyLevel = "overdue";
      }

      if (!shouldNotify) continue;

      console.log(`Processing ${urgencyLevel} notification for action ${action.id}`);

      // Check for duplicate notifications
      if (urgencyLevel !== "overdue") {
        const { data: existing } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", action.responsible_id)
          .eq("type", "PENDENCIA")
          .contains("context", { action_id: action.id, urgency_level: urgencyLevel })
          .single();

        if (existing) {
          console.log(`Skipping duplicate notification for action ${action.id}`);
          continue;
        }
      } else {
        // For overdue, check if we already notified today
        const todayStr = todayStart.toISOString().split("T")[0];
        const { data: existing } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", action.responsible_id)
          .eq("type", "PENDENCIA")
          .contains("context", { action_id: action.id, urgency_level: "overdue" })
          .gte("created_at", todayStr)
          .single();

        if (existing) {
          console.log(`Already notified today about overdue action ${action.id}`);
          continue;
        }
      }

      // Get user preferences
      const { data: preferences } = await supabase
        .from("user_notification_preferences")
        .select("*")
        .eq("user_id", action.responsible_id)
        .single();

      const shouldNotifyPending = preferences?.notify_pending_actions !== false;
      const shouldNotifyOverdue = preferences?.notify_overdue_actions !== false;

      if (urgencyLevel === "overdue" && !shouldNotifyOverdue) {
        console.log(`User ${action.responsible_id} has disabled overdue notifications`);
        continue;
      }

      if (urgencyLevel !== "overdue" && !shouldNotifyPending) {
        console.log(`User ${action.responsible_id} has disabled pending notifications`);
        continue;
      }

      const context = {
        action_id: action.id,
        action_description: action.description,
        due_date: action.due_date,
        meeting_title: action.meetings?.title,
        council_name: action.meetings?.councils?.name,
        priority: action.priority,
        days_until: daysUntil,
        urgency_level: urgencyLevel,
      };

      let title = "";
      let message = "";

      if (urgencyLevel === "7d") {
        title = `Pendência vence em 7 dias`;
        message = `📌 "${action.description}" vence em ${new Date(action.due_date).toLocaleDateString("pt-BR")}. Prioridade: ${action.priority}`;
      } else if (urgencyLevel === "3d") {
        title = `Pendência vence em 3 dias`;
        message = `⚠️ "${action.description}" vence em ${new Date(action.due_date).toLocaleDateString("pt-BR")}. Prioridade: ${action.priority}`;
      } else if (urgencyLevel === "1d") {
        title = `Pendência vence amanhã`;
        message = `🔴 "${action.description}" vence amanhã, ${new Date(action.due_date).toLocaleDateString("pt-BR")}. Prioridade: ${action.priority}`;
      } else if (urgencyLevel === "today") {
        title = `Pendência vence hoje`;
        message = `🔴🔴 "${action.description}" vence HOJE! Prioridade: ${action.priority}`;
      } else if (urgencyLevel === "overdue") {
        const daysOverdue = Math.abs(daysUntil);
        title = `Pendência atrasada há ${daysOverdue} ${daysOverdue === 1 ? "dia" : "dias"}`;
        message = `⚠️⚠️ "${action.description}" está ATRASADA há ${daysOverdue} ${daysOverdue === 1 ? "dia" : "dias"}! Prazo era ${new Date(action.due_date).toLocaleDateString("pt-BR")}.`;
      }

      const link = `/reunioes/${action.meeting_id}?tab=pendencias&action=${action.id}`;

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
            user_id: action.responsible_id,
            external_email: action.responsible_external_email,
            type: "PENDENCIA",
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

    console.log("Pendencias notifier job completed successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Notifications processed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in governance-pendencias-notifier:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
