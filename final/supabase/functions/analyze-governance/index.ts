import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  company_id: string;
  documents?: Array<{
    id: string;
    name: string;
    content: string;
    category: string;
  }>;
  transcripts?: Array<{
    id: string;
    interviewee_name: string;
    interviewee_role: string;
    transcript_text: string;
  }>;
  company_context?: string;
}

interface PromptConfig {
  id: string;
  name: string;
  system_prompt: string;
  user_prompt_template: string;
  model: string;
  temperature: number;
  max_tokens: number;
}

async function getPromptConfig(supabase: any, category: string): Promise<PromptConfig | null> {
  const { data, error } = await supabase
    .from('ai_prompt_library')
    .select('id, name, system_prompt, user_prompt_template, model, temperature, max_tokens')
    .eq('category', category)
    .eq('is_default', true)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    console.log(`No prompt found for category ${category}, using fallback`);
    return null;
  }

  return data;
}

async function callLovableAI(
  prompt: PromptConfig,
  userContent: string,
  variables: Record<string, string>
): Promise<any> {
  // Replace template variables
  let systemPrompt = prompt.system_prompt;
  let userPrompt = prompt.user_prompt_template || userContent;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    systemPrompt = systemPrompt.replace(new RegExp(placeholder, 'g'), value);
    userPrompt = userPrompt.replace(new RegExp(placeholder, 'g'), value);
  }

  const response = await fetch("https://api.lovable.dev/api/v1/ai/gateway", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
    },
    body: JSON.stringify({
      model: prompt.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: prompt.temperature,
      max_tokens: prompt.max_tokens,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  try {
    return JSON.parse(result.choices[0].message.content);
  } catch {
    return result.choices[0].message.content;
  }
}

// Fallback prompts in case database is empty
const FALLBACK_PROMPTS: Record<string, PromptConfig> = {
  agent_e_doc_analyzer: {
    id: 'fallback-doc-analyzer',
    name: 'Document Analyzer (Fallback)',
    system_prompt: `Você é um especialista em análise de documentos de governança corporativa.

Analise o documento fornecido e extraia:
1. Tipo de documento e data
2. Entidades mencionadas (pessoas, empresas, cargos)
3. Decisões ou deliberações
4. Prazos e responsáveis
5. Riscos identificados
6. Gaps ou ausências
7. Sentimento geral (-1 a 1)

Retorne um JSON estruturado com esses campos.`,
    user_prompt_template: 'Analise o seguinte documento:\n\n{{document_text}}',
    model: 'google/gemini-3-flash-preview',
    temperature: 0.5,
    max_tokens: 6000
  },
  agent_e_interview_analyzer: {
    id: 'fallback-interview-analyzer',
    name: 'Interview Analyzer (Fallback)',
    system_prompt: `Você é um especialista em análise de entrevistas de stakeholders.

Analise a transcrição fornecida e extraia:
1. Dados do entrevistado
2. Temas principais discutidos
3. Visão sobre governança
4. Expectativas e preocupações
5. Conflitos potenciais
6. Score de alinhamento (0-100)
7. Citações-chave

Retorne um JSON estruturado com esses campos.`,
    user_prompt_template: 'Analise a seguinte transcrição:\n\n{{transcript_text}}',
    model: 'google/gemini-3-flash-preview',
    temperature: 0.6,
    max_tokens: 6000
  },
  agent_e_incongruence_detector: {
    id: 'fallback-incongruence-detector',
    name: 'Incongruence Detector (Fallback)',
    system_prompt: `Você é um especialista em detectar incongruências em análises de governança.

Compare as análises de documentos e entrevistas e identifique:
1. Incongruências documento-entrevista
2. Incongruências documento-documento
3. Incongruências entrevista-entrevista
4. Gaps expectativa-realidade

Para cada incongruência, indique severidade (critical/high/medium/low) e recomendação.

Retorne um JSON estruturado.`,
    user_prompt_template: 'Análises de documentos:\n{{doc_analyses}}\n\nAnálises de entrevistas:\n{{interview_analyses}}',
    model: 'google/gemini-3-flash-preview',
    temperature: 0.4,
    max_tokens: 8000
  },
  agent_e_action_planner: {
    id: 'fallback-action-planner',
    name: 'Action Planner (Fallback)',
    system_prompt: `Você é um especialista em planejamento de ações de governança.

Com base nas análises e incongruências, gere um plano de ação:
1. Ações priorizadas por urgência e impacto
2. Categorias: estrutura, documentação, alinhamento, compliance, sucessão
3. Timeline realista
4. Responsáveis sugeridos
5. Métricas de sucesso
6. Governance health score (0-100)

Retorne um JSON estruturado.`,
    user_prompt_template: 'Análises:\n{{analyses}}\n\nIncongruências:\n{{incongruences}}\n\nGaps:\n{{gaps}}',
    model: 'google/gemini-3-flash-preview',
    temperature: 0.6,
    max_tokens: 8000
  }
};

async function updatePromptMetrics(supabase: any, promptId: string, latencyMs: number, tokensUsed: number) {
  try {
    // Get current metrics
    const { data: current } = await supabase
      .from('ai_prompt_library')
      .select('total_executions, avg_latency_ms, avg_tokens_used')
      .eq('id', promptId)
      .single();

    if (current) {
      const newTotal = (current.total_executions || 0) + 1;
      const newAvgLatency = ((current.avg_latency_ms || 0) * (newTotal - 1) + latencyMs) / newTotal;
      const newAvgTokens = ((current.avg_tokens_used || 0) * (newTotal - 1) + tokensUsed) / newTotal;

      await supabase
        .from('ai_prompt_library')
        .update({
          total_executions: newTotal,
          avg_latency_ms: newAvgLatency,
          avg_tokens_used: newAvgTokens
        })
        .eq('id', promptId);
    }
  } catch (error) {
    console.error('Error updating prompt metrics:', error);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData: AnalysisRequest = await req.json();
    const { company_id, documents = [], transcripts = [], company_context = '' } = requestData;

    console.log(`Starting governance analysis for company: ${company_id}`);
    console.log(`Documents: ${documents.length}, Transcripts: ${transcripts.length}`);

    const results: any = {
      document_analyses: [],
      interview_analyses: [],
      incongruences: null,
      action_plan: null,
      metadata: {
        company_id,
        analyzed_at: new Date().toISOString(),
        documents_count: documents.length,
        transcripts_count: transcripts.length
      }
    };

    // Step 1: Analyze Documents
    const docAnalyzerPrompt = await getPromptConfig(supabase, 'agent_e_doc_analyzer') 
      || FALLBACK_PROMPTS.agent_e_doc_analyzer;

    for (const doc of documents) {
      const startTime = Date.now();
      try {
        const analysis = await callLovableAI(docAnalyzerPrompt, '', {
          document_text: doc.content,
          company_context
        });
        
        const latency = Date.now() - startTime;
        if (docAnalyzerPrompt.id !== 'fallback-doc-analyzer') {
          await updatePromptMetrics(supabase, docAnalyzerPrompt.id, latency, 3000);
        }

        results.document_analyses.push({
          document_id: doc.id,
          document_name: doc.name,
          category: doc.category,
          analysis,
          latency_ms: latency
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Error analyzing document ${doc.id}:`, err);
        results.document_analyses.push({
          document_id: doc.id,
          document_name: doc.name,
          error: errorMessage
        });
      }
    }

    // Step 2: Analyze Interviews
    const interviewAnalyzerPrompt = await getPromptConfig(supabase, 'agent_e_interview_analyzer')
      || FALLBACK_PROMPTS.agent_e_interview_analyzer;

    for (const transcript of transcripts) {
      const startTime = Date.now();
      try {
        const analysis = await callLovableAI(interviewAnalyzerPrompt, '', {
          transcript_text: transcript.transcript_text,
          interviewee_name: transcript.interviewee_name,
          interviewee_role: transcript.interviewee_role,
          company_context
        });

        const latency = Date.now() - startTime;
        if (interviewAnalyzerPrompt.id !== 'fallback-interview-analyzer') {
          await updatePromptMetrics(supabase, interviewAnalyzerPrompt.id, latency, 3000);
        }

        results.interview_analyses.push({
          transcript_id: transcript.id,
          interviewee_name: transcript.interviewee_name,
          interviewee_role: transcript.interviewee_role,
          analysis,
          latency_ms: latency
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Error analyzing transcript ${transcript.id}:`, err);
        results.interview_analyses.push({
          transcript_id: transcript.id,
          error: errorMessage
        });
      }
    }

    // Step 3: Detect Incongruences (only if we have data)
    if (results.document_analyses.length > 0 || results.interview_analyses.length > 0) {
      const incongruencePrompt = await getPromptConfig(supabase, 'agent_e_incongruence_detector')
        || FALLBACK_PROMPTS.agent_e_incongruence_detector;

      const startTime = Date.now();
      try {
        results.incongruences = await callLovableAI(incongruencePrompt, '', {
          doc_analyses: JSON.stringify(results.document_analyses.map((d: any) => d.analysis).filter(Boolean)),
          interview_analyses: JSON.stringify(results.interview_analyses.map((i: any) => i.analysis).filter(Boolean)),
          company_context
        });

        const latency = Date.now() - startTime;
        if (incongruencePrompt.id !== 'fallback-incongruence-detector') {
          await updatePromptMetrics(supabase, incongruencePrompt.id, latency, 4000);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error detecting incongruences:', err);
        results.incongruences = { error: errorMessage };
      }
    }

    // Step 4: Generate Action Plan
    if (results.document_analyses.length > 0 || results.interview_analyses.length > 0) {
      const actionPlannerPrompt = await getPromptConfig(supabase, 'agent_e_action_planner')
        || FALLBACK_PROMPTS.agent_e_action_planner;

      const startTime = Date.now();
      try {
        // Collect gaps from document analyses
        const gaps = results.document_analyses
          .filter((d: any) => d.analysis?.gaps)
          .flatMap((d: any) => d.analysis.gaps);

        results.action_plan = await callLovableAI(actionPlannerPrompt, '', {
          analyses: JSON.stringify({
            documents: results.document_analyses.map((d: any) => d.analysis).filter(Boolean),
            interviews: results.interview_analyses.map((i: any) => i.analysis).filter(Boolean)
          }),
          incongruences: JSON.stringify(results.incongruences?.incongruences || []),
          gaps: JSON.stringify(gaps),
          company_context
        });

        const latency = Date.now() - startTime;
        if (actionPlannerPrompt.id !== 'fallback-action-planner') {
          await updatePromptMetrics(supabase, actionPlannerPrompt.id, latency, 5000);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error generating action plan:', err);
        results.action_plan = { error: errorMessage };
      }
    }

    console.log('Governance analysis completed successfully');

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error in analyze-governance:', err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
