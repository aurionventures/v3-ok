import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { loadPromptConfig, updatePromptMetrics, type PromptConfig } from "../_shared/prompt-loader.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface para configuração do cliente
interface ClientPromptConfig {
  custom_prompt: string | null;
  uses_default: boolean;
  tone: string;
  verbal_person: string;
  summary_length: number;
  custom_instructions: string | null;
  advanced_mode: boolean;
}

// Função para carregar configuração do cliente do banco
async function loadClientPromptConfig(
  organizationId: string | null,
  agentCategory: string
): Promise<ClientPromptConfig | null> {
  if (!organizationId) return null;

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('[client-config] Supabase não configurado');
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("client_prompt_configs")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("agent_category", agentCategory)
      .maybeSingle();

    if (error) {
      console.error('[client-config] Erro ao carregar:', error);
      return null;
    }

    if (data) {
      console.log(`[client-config] Configuração do cliente carregada para org ${organizationId}`);
    }

    return data;
  } catch (error) {
    console.error('[client-config] Erro:', error);
    return null;
  }
}

// Fallback prompt caso não encontre no banco
const FALLBACK_PROMPT: PromptConfig = {
  id: 'fallback-ata-generator',
  name: 'ATA Generator (Fallback)',
  category: 'agent_g_ata_generator',
  version: '1.0.0',
  system_prompt: `Você é um secretário executivo experiente em governança corporativa brasileira. 
Gere uma ATA formal e profissional em português brasileiro baseada nos dados fornecidos.

FORMATO DE RESPOSTA (JSON):
{
  "summary": "texto do resumo executivo aqui",
  "decisions": ["decisão 1", "decisão 2", "decisão 3", ...]
}

DIRETRIZES:
1. Gere um resumo executivo narrativo que contextualize a reunião
2. Liste de 4 a 6 decisões principais tomadas
3. Use linguagem formal típica de ATAs corporativas brasileiras
4. Seja objetivo e preciso`,
  user_prompt_template: null,
  model: 'google/gemini-3-flash-preview',
  temperature: 0.7,
  max_tokens: 4000,
  top_p: 1.0,
  frequency_penalty: 0,
  presence_penalty: 0,
  functions: null,
  tool_choice: 'auto',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { 
      meetingId,
      council, 
      date, 
      time, 
      type, 
      modalidade,
      agenda = [],
      participants = [],
      meeting_tasks = [],
      nextMeetingTopics = [],
      ataConfig = null,
      organizationId = null  // ID da organização do cliente
    } = await req.json();

    console.log('📝 Generating ATA for meeting:', meetingId);
    console.log('📋 Organization ID:', organizationId);

    if (!council || !date || !time) {
      return new Response(
        JSON.stringify({ error: 'Dados da reunião incompletos' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Carregar prompt base do banco de dados (definido pelo Super Admin)
    const promptConfig = await loadPromptConfig('agent_g_ata_generator', FALLBACK_PROMPT);

    // Carregar configuração específica do cliente do banco (se existir)
    const clientConfig = await loadClientPromptConfig(organizationId, 'agent_g_ata_generator');
    
    // Log para auditoria
    if (clientConfig) {
      console.log(`🔧 Cliente tem configuração customizada: uses_default=${clientConfig.uses_default}, advanced_mode=${clientConfig.advanced_mode}`);
    } else {
      console.log('🔧 Usando configuração padrão (sem customização do cliente)');
    }

    const confirmedParticipants = participants.filter((p: any) => p.confirmed);
    const participantsList = confirmedParticipants.map((p: any) => 
      `- ${p.external_name || 'Membro'} (${p.role})`
    ).join('\n');

    const agendaDetails = agenda.map((item: any, idx: number) => 
      `${idx + 1}. ${item.title}
   Descrição: ${item.description}
   Apresentador: ${item.presenter}
   Tipo: ${item.type}
   Resultado Esperado: ${item.expectedOutcome || 'A definir'}`
    ).join('\n\n');

    const tasksDetails = meeting_tasks.map((task: any) => 
      `- ${task.title} (Responsável: ${task.responsible}, Prazo: ${new Date(task.deadline).toLocaleDateString('pt-BR')})`
    ).join('\n');

    // Build dynamic prompt based on config
    // Prioridade: 1. clientConfig do banco, 2. ataConfig enviado pelo frontend, 3. padrão
    const buildStyleInstructions = (clientCfg: ClientPromptConfig | null, frontendCfg: any) => {
      const toneMap: Record<string, string> = {
        'formal': 'Use linguagem jurídica formal e cerimonial. Utilize vocabulário jurídico-corporativo com referências a deliberações formais.',
        'semi-formal': 'Use linguagem profissional mas acessível. Mantenha o tom corporativo sem excesso de formalidades.',
        'executivo': 'Seja direto e focado em decisões e ações. Priorize clareza e objetividade.',
        'tecnico': 'Use linguagem técnica com bullet points e listas. Inclua métricas e dados quando disponíveis.'
      };

      const personMap: Record<string, string> = {
        'terceira': 'Use terceira pessoa do singular (Ex: "O Conselho deliberou...", "Foi aprovado...")',
        'primeira_plural': 'Use primeira pessoa do plural (Ex: "Deliberamos...", "Aprovamos...")'
      };

      // Se cliente tem configuração no banco e não usa o padrão
      if (clientCfg && !clientCfg.uses_default) {
        return {
          tone: toneMap[clientCfg.tone] || toneMap['executivo'],
          person: personMap[clientCfg.verbal_person] || personMap['terceira'],
          length: clientCfg.summary_length || 200,
          custom: clientCfg.custom_instructions || '',
          customPrompt: clientCfg.advanced_mode ? clientCfg.custom_prompt : null
        };
      }

      // Se tem config do frontend
      if (frontendCfg) {
        return {
          tone: toneMap[frontendCfg.tone] || toneMap['executivo'],
          person: personMap[frontendCfg.verbalPerson] || personMap['terceira'],
          length: frontendCfg.summaryLength || 200,
          custom: frontendCfg.customInstructions || '',
          customPrompt: frontendCfg.advancedMode ? frontendCfg.fullPrompt : null
        };
      }

      // Padrão
      return {
        tone: 'Seja direto e focado em decisões e ações. Priorize clareza e objetividade.',
        person: 'Use terceira pessoa do singular',
        length: 200,
        custom: '',
        customPrompt: null
      };
    };

    const styleInstructions = buildStyleInstructions(clientConfig, ataConfig);

    // Determinar o system prompt final
    // Se o cliente tem um prompt customizado, usar ele; senão usar o do Super Admin
    const finalSystemPrompt = styleInstructions.customPrompt || promptConfig.system_prompt;

    const userPrompt = `INSTRUÇÕES DE ESTILO:
- ${styleInstructions.tone}
- ${styleInstructions.person}
${styleInstructions.custom ? `\nINSTRUÇÕES ESPECÍFICAS DO CLIENTE:\n${styleInstructions.custom}\n` : ''}

INFORMAÇÕES DA REUNIÃO:
- Órgão: ${council}
- Tipo: ${type}
- Data: ${new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
- Horário: ${time}
- Modalidade: ${modalidade}

PARTICIPANTES PRESENTES:
${participantsList || 'Não informado'}

PAUTA DISCUTIDA:
${agendaDetails || 'Pauta não detalhada'}

TAREFAS ATRIBUÍDAS:
${tasksDetails || 'Nenhuma tarefa específica atribuída'}

PRÓXIMOS ASSUNTOS:
${nextMeetingTopics.map((t: string) => `- ${t}`).join('\n') || 'Não definidos'}

INSTRUÇÕES:
1. Gere um resumo executivo narrativo de ${styleInstructions.length - 50}-${styleInstructions.length + 50} palavras
2. Liste de 4 a 6 decisões principais tomadas durante a reunião`;

    console.log('🤖 Calling Lovable AI...');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    console.log('🤖 Using system prompt:', styleInstructions.customPrompt ? 'CLIENT_CUSTOM' : 'SUPER_ADMIN_DEFAULT');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: promptConfig.model,
        temperature: promptConfig.temperature,
        max_tokens: promptConfig.max_tokens,
        messages: [
          { role: 'system', content: finalSystemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições atingido. Tente novamente em alguns instantes.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Por favor, adicione créditos à sua conta.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      throw new Error('Erro ao gerar ATA com IA');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('Resposta vazia da IA');
    }

    console.log('✅ AI response received');

    let parsedResponse;
    try {
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || 
                       aiContent.match(/```\n([\s\S]*?)\n```/) ||
                       [null, aiContent];
      
      parsedResponse = JSON.parse(jsonMatch[1] || aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response, using fallback:', parseError);
      
      parsedResponse = {
        summary: aiContent.substring(0, 500),
        decisions: [
          "Aprovação da pauta apresentada",
          "Discussão dos temas propostos",
          "Atribuição de tarefas aos responsáveis",
          "Definição de próximos passos"
        ]
      };
    }

    const ata = {
      id: `ata-${meetingId}`,
      summary: parsedResponse.summary || 'Resumo não disponível',
      decisions: Array.isArray(parsedResponse.decisions) 
        ? parsedResponse.decisions 
        : ['Decisões não detalhadas'],
      generatedAt: new Date().toISOString(),
      generatedBy: 'IA - Lovable Assistant'
    };

    const executionTime = Date.now() - startTime;
    console.log(`📄 ATA generated successfully in ${executionTime}ms`);

    // Atualizar métricas do prompt
    await updatePromptMetrics(promptConfig.id, {
      execution_time_ms: executionTime,
      tokens_used: aiData.usage?.total_tokens || 2000,
      success: true
    });

    return new Response(
      JSON.stringify(ata),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in generate-meeting-ata:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar ATA' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
