import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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
      ataConfig = null
    } = await req.json();

    console.log('📝 Generating ATA for meeting:', meetingId);

    // Validar dados de entrada
    if (!council || !date || !time) {
      return new Response(
        JSON.stringify({ error: 'Dados da reunião incompletos' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Construir prompt estruturado para a IA
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
    const buildStyleInstructions = (config: any) => {
      if (!config) {
        return {
          tone: 'Seja direto e focado em decisões e ações. Priorize clareza e objetividade.',
          person: 'Use terceira pessoa do singular',
          length: 200,
          custom: ''
        };
      }

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

      return {
        tone: toneMap[config.tone] || toneMap['executivo'],
        person: personMap[config.verbalPerson] || personMap['terceira'],
        length: config.summaryLength || 200,
        custom: config.customInstructions || ''
      };
    };

    const styleInstructions = buildStyleInstructions(ataConfig);

    const prompt = `Você é um secretário executivo experiente em governança corporativa brasileira. 
Gere uma ATA formal e profissional em português brasileiro baseada nos dados abaixo.

INSTRUÇÕES DE ESTILO:
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
1. Gere um resumo executivo narrativo de ${styleInstructions.length - 50}-${styleInstructions.length + 50} palavras que:
   - Contextualize a reunião e seu objetivo
   - Destaque os principais pontos discutidos na pauta
   - Mencione as tarefas atribuídas
   - Tenha tom formal e profissional
   - Use terceira pessoa do singular
   
2. Liste de 4 a 6 decisões principais tomadas durante a reunião, baseando-se nos resultados esperados da pauta

3. Use linguagem formal típica de ATAs corporativas brasileiras

4. Seja objetivo e preciso

FORMATO DE RESPOSTA (JSON):
{
  "summary": "texto do resumo executivo aqui",
  "decisions": ["decisão 1", "decisão 2", "decisão 3", ...]
}`;

    console.log('🤖 Calling Lovable AI...');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições atingido. Tente novamente em alguns instantes.' }), 
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Por favor, adicione créditos à sua conta.' }), 
          { 
            status: 402, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
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

    // Tentar extrair JSON da resposta
    let parsedResponse;
    try {
      // Tentar extrair JSON se estiver em markdown code block
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || 
                       aiContent.match(/```\n([\s\S]*?)\n```/) ||
                       [null, aiContent];
      
      parsedResponse = JSON.parse(jsonMatch[1] || aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response, using fallback:', parseError);
      
      // Fallback: criar estrutura básica
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

    // Montar ATA estruturada
    const ata = {
      id: `ata-${meetingId}`,
      summary: parsedResponse.summary || 'Resumo não disponível',
      decisions: Array.isArray(parsedResponse.decisions) 
        ? parsedResponse.decisions 
        : ['Decisões não detalhadas'],
      generatedAt: new Date().toISOString(),
      generatedBy: 'IA - Lovable Assistant'
    };

    console.log('📄 ATA generated successfully');

    return new Response(
      JSON.stringify(ata),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error in generate-meeting-ata:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar ATA' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
