import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MetricsRequest {
  member_id: string;
  council_id: string;
  company_id: string;
  period_start?: string;
  period_end?: string;
}

interface CalculatedMetrics {
  meetings_scheduled: number;
  meetings_attended: number;
  attendance_rate: number;
  items_presented: number;
  suggestions_made: number;
  contribution_score: number;
  actions_assigned: number;
  actions_completed: number;
  actions_on_time: number;
  delivery_rate: number;
  approvals_requested: number;
  approvals_responded: number;
  avg_response_time_hours: number;
  engagement_score: number;
  automatic_score: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { member_id, council_id, company_id, period_start, period_end }: MetricsRequest = await req.json();

    if (!member_id || !council_id || !company_id) {
      return new Response(
        JSON.stringify({ error: "member_id, council_id and company_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Default period: last 6 months if not specified
    const endDate = period_end || new Date().toISOString().split('T')[0];
    const startDate = period_start || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // 1. Get meetings data for the council in the period
    const { data: meetings, error: meetingsError } = await supabase
      .from('meetings')
      .select('id, date, status')
      .eq('council_id', council_id)
      .gte('date', startDate)
      .lte('date', endDate);

    if (meetingsError) {
      console.error("Error fetching meetings:", meetingsError);
    }

    const meetingsScheduled = meetings?.length || 0;

    // 2. Get participation data
    const meetingIds = meetings?.map(m => m.id) || [];
    let meetingsAttended = 0;

    if (meetingIds.length > 0) {
      const { data: participants } = await supabase
        .from('meeting_participants')
        .select('meeting_id')
        .in('meeting_id', meetingIds)
        .eq('user_id', member_id);

      meetingsAttended = participants?.length || 0;
    }

    const attendanceRate = meetingsScheduled > 0 
      ? Math.round((meetingsAttended / meetingsScheduled) * 100 * 100) / 100 
      : 0;

    // 3. Get actions data
    let actionsAssigned = 0;
    let actionsCompleted = 0;
    let actionsOnTime = 0;

    if (meetingIds.length > 0) {
      const { data: actions } = await supabase
        .from('meeting_actions')
        .select('id, status, due_date, completed_at')
        .in('meeting_id', meetingIds)
        .eq('responsible_id', member_id);

      actionsAssigned = actions?.length || 0;
      actionsCompleted = actions?.filter(a => a.status === 'CONCLUIDA')?.length || 0;
      actionsOnTime = actions?.filter(a => {
        if (a.status !== 'CONCLUIDA' || !a.completed_at || !a.due_date) return false;
        return new Date(a.completed_at) <= new Date(a.due_date);
      })?.length || 0;
    }

    const deliveryRate = actionsAssigned > 0 
      ? Math.round((actionsCompleted / actionsAssigned) * 100 * 100) / 100 
      : 0;

    // 4. Get items presented (from meeting_items where presenter matches)
    let itemsPresented = 0;
    if (meetingIds.length > 0) {
      // Get member name for matching presenter
      const { data: memberData } = await supabase
        .from('council_members')
        .select('name')
        .eq('id', member_id)
        .single();

      if (memberData?.name) {
        const { data: items } = await supabase
          .from('meeting_items')
          .select('id')
          .in('meeting_id', meetingIds)
          .ilike('presenter', `%${memberData.name}%`);

        itemsPresented = items?.length || 0;
      }
    }

    // 5. Calculate scores based on weights
    // Presence: 25%, Contribution: 20%, Delivery: 30%, Engagement: 25%
    const presenceScore = attendanceRate;
    const contributionScore = Math.min(100, itemsPresented * 15); // Each item = 15 points, max 100
    const engagementScore = presenceScore * 0.8 + (actionsAssigned > 0 ? 20 : 0); // Simplified

    const automaticScore = 
      presenceScore * 0.25 + 
      contributionScore * 0.20 + 
      deliveryRate * 0.30 + 
      engagementScore * 0.25;

    const metrics: CalculatedMetrics = {
      meetings_scheduled: meetingsScheduled,
      meetings_attended: meetingsAttended,
      attendance_rate: attendanceRate,
      items_presented: itemsPresented,
      suggestions_made: 0, // Not tracked yet
      contribution_score: contributionScore,
      actions_assigned: actionsAssigned,
      actions_completed: actionsCompleted,
      actions_on_time: actionsOnTime,
      delivery_rate: deliveryRate,
      approvals_requested: 0, // Not tracked yet
      approvals_responded: 0, // Not tracked yet
      avg_response_time_hours: 0, // Not tracked yet
      engagement_score: engagementScore,
      automatic_score: Math.round(automaticScore * 100) / 100,
    };

    return new Response(
      JSON.stringify({ 
        success: true,
        member_id,
        council_id,
        period: { start: startDate, end: endDate },
        metrics 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("calculate-member-metrics error:", error);
    return new Response(
      JSON.stringify({ 
        error: "internal_error",
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
