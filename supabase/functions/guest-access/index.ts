import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GuestToken {
  id: string;
  meeting_participant_id: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  last_accessed_at: string | null;
  access_count: number;
  can_upload: boolean;
  can_view_materials: boolean;
  created_at: string;
}

interface MeetingParticipant {
  id: string;
  meeting_id: string;
  external_name: string;
  external_email: string;
  role: string;
  can_upload: boolean;
  can_view_materials: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const action = pathParts[pathParts.length - 1];

    console.log('Guest Access - Action:', action);

    // POST /validate - Validate token
    if (req.method === 'POST' && action === 'validate') {
      const { token } = await req.json();

      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Token é obrigatório' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Fetch token with participant and meeting data
      const { data: tokenData, error: tokenError } = await supabase
        .from('guest_tokens')
        .select(`
          *,
          meeting_participant:meeting_participants!inner(
            id,
            meeting_id,
            external_name,
            external_email,
            role,
            can_upload,
            can_view_materials,
            meeting:meetings!inner(
              id,
              title,
              date,
              time,
              location,
              company_id,
              council:councils!inner(
                id,
                name
              )
            )
          )
        `)
        .eq('token', token)
        .single();

      if (tokenError || !tokenData) {
        console.error('Token not found:', tokenError);
        return new Response(
          JSON.stringify({ valid: false, error: 'Token inválido' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if token is expired
      const expiresAt = new Date(tokenData.expires_at);
      if (expiresAt < new Date()) {
        return new Response(
          JSON.stringify({ valid: false, error: 'Token expirado' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update access stats
      await supabase
        .from('guest_tokens')
        .update({
          last_accessed_at: new Date().toISOString(),
          access_count: (tokenData.access_count || 0) + 1,
          used_at: tokenData.used_at || new Date().toISOString()
        })
        .eq('id', tokenData.id);

      // Fetch visible items for this participant
      const { data: visibleItems } = await supabase
        .from('meeting_item_visibility')
        .select(`
          meeting_item_id,
          can_view,
          can_comment,
          meeting_item:meeting_items(
            id,
            title,
            description,
            order_position,
            type,
            presenter,
            duration_minutes
          )
        `)
        .eq('meeting_participant_id', tokenData.meeting_participant_id)
        .eq('can_view', true);

      return new Response(
        JSON.stringify({
          valid: true,
          participant: tokenData.meeting_participant,
          token: {
            can_upload: tokenData.can_upload,
            can_view_materials: tokenData.can_view_materials,
            access_count: tokenData.access_count + 1
          },
          visible_items: visibleItems || []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /meeting/:token - Get meeting data for guest
    if (req.method === 'GET' && action !== 'validate') {
      const token = action;

      // Validate token first
      const { data: tokenData, error: tokenError } = await supabase
        .from('guest_tokens')
        .select(`
          *,
          meeting_participant:meeting_participants!inner(
            id,
            meeting_id,
            external_name,
            external_email,
            role,
            can_upload,
            can_view_materials,
            meeting:meetings!inner(
              id,
              title,
              date,
              time,
              location,
              status,
              modalidade,
              company_id,
              council:councils!inner(
                id,
                name,
                type
              )
            )
          )
        `)
        .eq('token', token)
        .single();

      if (tokenError || !tokenData) {
        return new Response(
          JSON.stringify({ error: 'Token inválido' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check expiration
      if (new Date(tokenData.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Token expirado' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update access stats
      await supabase
        .from('guest_tokens')
        .update({
          last_accessed_at: new Date().toISOString(),
          access_count: (tokenData.access_count || 0) + 1
        })
        .eq('id', tokenData.id);

      // Fetch visible items
      const { data: visibleItems } = await supabase
        .from('meeting_item_visibility')
        .select(`
          meeting_item_id,
          can_view,
          can_comment,
          meeting_item:meeting_items(
            id,
            title,
            description,
            order_position,
            type,
            presenter,
            duration_minutes,
            key_points,
            expected_outcome
          )
        `)
        .eq('meeting_participant_id', tokenData.meeting_participant_id)
        .eq('can_view', true)
        .order('meeting_item.order_position', { ascending: true });

      // Fetch documents if allowed
      let documents = [];
      if (tokenData.can_view_materials) {
        const itemIds = visibleItems?.map(vi => vi.meeting_item_id) || [];
        const { data: docs } = await supabase
          .from('meeting_documents')
          .select('*')
          .eq('meeting_id', tokenData.meeting_participant.meeting.id)
          .or(`meeting_item_id.in.(${itemIds.join(',')}),meeting_item_id.is.null`);
        
        documents = docs || [];
      }

      return new Response(
        JSON.stringify({
          participant: {
            name: tokenData.meeting_participant.external_name,
            email: tokenData.meeting_participant.external_email,
            role: tokenData.meeting_participant.role
          },
          meeting: tokenData.meeting_participant.meeting,
          permissions: {
            can_upload: tokenData.can_upload,
            can_view_materials: tokenData.can_view_materials
          },
          visible_items: visibleItems?.map(vi => vi.meeting_item) || [],
          documents
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /upload/:token - Upload document
    if (req.method === 'POST' && pathParts[pathParts.length - 2] === 'upload') {
      const token = action;
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const meetingItemId = formData.get('meeting_item_id') as string;
      const documentType = formData.get('document_type') as string;

      if (!file) {
        return new Response(
          JSON.stringify({ error: 'Arquivo é obrigatório' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate token and check upload permission
      const { data: tokenData, error: tokenError } = await supabase
        .from('guest_tokens')
        .select('*, meeting_participant:meeting_participants!inner(meeting_id)')
        .eq('token', token)
        .single();

      if (tokenError || !tokenData || !tokenData.can_upload) {
        return new Response(
          JSON.stringify({ error: 'Sem permissão para upload' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check expiration
      if (new Date(tokenData.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Token expirado' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Upload to storage
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${tokenData.meeting_participant.meeting_id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('meeting-documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return new Response(
          JSON.stringify({ error: 'Erro ao fazer upload do arquivo' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('meeting-documents')
        .getPublicUrl(filePath);

      // Create document record
      const { data: document, error: docError } = await supabase
        .from('meeting_documents')
        .insert({
          meeting_id: tokenData.meeting_participant.meeting_id,
          meeting_item_id: meetingItemId || null,
          name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_by_guest_token: token,
          document_type: documentType || 'OUTROS'
        })
        .select()
        .single();

      if (docError) {
        console.error('Document record error:', docError);
        return new Response(
          JSON.stringify({ error: 'Erro ao salvar informações do documento' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, document }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint não encontrado' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in guest-access:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
