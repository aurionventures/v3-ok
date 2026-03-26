import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProcessDocumentRequest {
  documentId: string;
}

interface ExtractedEntities {
  people: string[];
  organizations: string[];
  dates: string[];
  monetary_values: string[];
  locations: string[];
}

interface GovernanceRecord {
  company_id: string;
  record_type: string;
  title: string;
  description: string;
  date: string;
  decision_outcome?: string;
  decision_rationale?: string;
  risk_category?: string;
  risk_severity?: string;
  source: string;
  source_document_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId }: ProcessDocumentRequest = await req.json();

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: "documentId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Fetch document record
    const { data: doc, error: docError } = await supabase
      .from("document_library")
      .select("*")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      return new Response(
        JSON.stringify({ error: "Document not found", details: docError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Update status to processing
    await supabase
      .from("document_library")
      .update({ processing_status: "processing" })
      .eq("id", documentId);

    // 3. Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("documents")
      .download(doc.file_path);

    if (downloadError || !fileData) {
      await supabase
        .from("document_library")
        .update({ processing_status: "failed" })
        .eq("id", documentId);

      return new Response(
        JSON.stringify({ error: "Failed to download file", details: downloadError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Extract text based on file type
    let extractedText = "";
    const fileType = doc.file_type?.toLowerCase();

    if (fileType === "pdf") {
      extractedText = await extractTextFromPDF(fileData);
    } else if (fileType === "docx" || fileType === "doc") {
      extractedText = await extractTextFromDOCX(fileData);
    } else if (fileType === "txt") {
      extractedText = await fileData.text();
    } else {
      // For unsupported file types, mark as completed with empty text
      extractedText = "[Tipo de arquivo nao suportado para extracao de texto]";
    }

    // 5. Generate embedding using OpenAI
    let embedding: number[] | null = null;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (openaiApiKey && extractedText.length > 10) {
      embedding = await generateEmbedding(extractedText, openaiApiKey);
    }

    // 6. Extract entities using OpenAI
    let entities: ExtractedEntities | null = null;
    let topics: string[] = [];
    let sentimentScore: number | null = null;

    if (openaiApiKey && extractedText.length > 50) {
      const analysisResult = await analyzeDocument(extractedText, openaiApiKey);
      entities = analysisResult.entities;
      topics = analysisResult.topics;
      sentimentScore = analysisResult.sentiment;
    }

    // 7. Extract governance history if it's a minutes document
    let governanceRecords: GovernanceRecord[] = [];
    if (doc.category === "minutes" && openaiApiKey && extractedText.length > 100) {
      governanceRecords = await extractGovernanceHistory(
        extractedText,
        doc.company_id,
        documentId,
        openaiApiKey
      );
    }

    // 8. Update document with extracted data
    const updateData: Record<string, unknown> = {
      processing_status: "completed",
      processed_at: new Date().toISOString(),
      extracted_text: extractedText.substring(0, 50000), // Limit text size
      entities_detected: entities,
      topics: topics,
      sentiment_score: sentimentScore,
      is_indexed: true,
      index_last_updated: new Date().toISOString()
    };

    // Add embedding if available
    if (embedding) {
      updateData.text_embedding = embedding;
    }

    // Set relevance flags based on category
    updateData.relevant_for_agent_a = doc.category === "strategic" || doc.category === "financial";
    updateData.relevant_for_agent_b = true; // Always relevant for memory
    updateData.relevant_for_agent_c = doc.category === "strategic" || doc.category === "governance";
    updateData.relevant_for_agent_d = doc.category === "minutes" || doc.category === "governance";

    await supabase
      .from("document_library")
      .update(updateData)
      .eq("id", documentId);

    // 9. Insert governance history records
    if (governanceRecords.length > 0) {
      await supabase
        .from("governance_history_seed")
        .insert(governanceRecords);
    }

    // 10. Update onboarding progress
    await updateOnboardingProgress(supabase, doc.company_id);

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        textLength: extractedText.length,
        entitiesFound: entities ? Object.values(entities).flat().length : 0,
        topicsFound: topics.length,
        governanceRecordsExtracted: governanceRecords.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing document:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper: Extract text from PDF
async function extractTextFromPDF(fileData: Blob): Promise<string> {
  // In a production environment, you would use a proper PDF parsing library
  // For now, we'll return a placeholder indicating the file was received
  // You could integrate with pdf-parse or a cloud OCR service
  try {
    const arrayBuffer = await fileData.arrayBuffer();
    // Basic text extraction from PDF (simplified)
    // In production, use a proper PDF library or external service
    const text = new TextDecoder("utf-8").decode(arrayBuffer);
    
    // Extract readable text (very simplified)
    const cleanText = text
      .replace(/[\x00-\x1F\x7F-\x9F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    
    if (cleanText.length > 100) {
      return cleanText;
    }
    
    return "[PDF recebido - texto extraido via OCR seria necessario para melhor analise]";
  } catch {
    return "[Erro ao processar PDF]";
  }
}

// Helper: Extract text from DOCX
async function extractTextFromDOCX(fileData: Blob): Promise<string> {
  // In production, use mammoth.js or similar library
  try {
    const arrayBuffer = await fileData.arrayBuffer();
    const text = new TextDecoder("utf-8").decode(arrayBuffer);
    
    // Simple XML text extraction
    const matches = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
    const extractedText = matches
      .map(match => match.replace(/<\/?w:t[^>]*>/g, ""))
      .join(" ");
    
    return extractedText || "[DOCX processado]";
  } catch {
    return "[Erro ao processar DOCX]";
  }
}

// Helper: Generate embedding using OpenAI
async function generateEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text.substring(0, 8000) // Limit tokens
      })
    });

    if (!response.ok) {
      console.error("OpenAI embedding error:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.data?.[0]?.embedding || null;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}

// Helper: Analyze document using OpenAI
async function analyzeDocument(
  text: string,
  apiKey: string
): Promise<{
  entities: ExtractedEntities;
  topics: string[];
  sentiment: number;
}> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Voce e um assistente especializado em analise de documentos corporativos.
            Extraia as seguintes informacoes do texto:
            1. Entidades nomeadas: pessoas, organizacoes, datas, valores monetarios, localizacoes
            2. Topicos principais discutidos (maximo 5)
            3. Sentimento geral do documento (-1 a 1, onde -1 e negativo, 0 e neutro, 1 e positivo)
            
            Retorne em formato JSON com a estrutura:
            {
              "entities": {
                "people": [],
                "organizations": [],
                "dates": [],
                "monetary_values": [],
                "locations": []
              },
              "topics": [],
              "sentiment": 0
            }`
          },
          {
            role: "user",
            content: text.substring(0, 4000)
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      console.error("OpenAI analysis error:", await response.text());
      return {
        entities: { people: [], organizations: [], dates: [], monetary_values: [], locations: [] },
        topics: [],
        sentiment: 0
      };
    }

    const data = await response.json();
    const content = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    return {
      entities: content.entities || { people: [], organizations: [], dates: [], monetary_values: [], locations: [] },
      topics: content.topics || [],
      sentiment: content.sentiment || 0
    };
  } catch (error) {
    console.error("Error analyzing document:", error);
    return {
      entities: { people: [], organizations: [], dates: [], monetary_values: [], locations: [] },
      topics: [],
      sentiment: 0
    };
  }
}

// Helper: Extract governance history from meeting minutes
async function extractGovernanceHistory(
  text: string,
  companyId: string,
  documentId: string,
  apiKey: string
): Promise<GovernanceRecord[]> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Voce e um especialista em governanca corporativa. Extraia historico de governanca desta ata de reuniao.

            Para cada item encontrado, extraia:
            - record_type: 'decision', 'risk', 'task', 'policy'
            - title: titulo breve do item
            - description: descricao do item
            - date: data no formato YYYY-MM-DD (use a data do documento se nao especificada)
            - decision_outcome: se for decisao (Aprovado, Rejeitado, Adiado)
            - decision_rationale: justificativa da decisao
            - risk_category: se for risco (Operacional, Financeiro, Regulatorio, etc)
            - risk_severity: se for risco (low, medium, high, critical)
            
            Retorne um JSON com { "records": [...] }`
          },
          {
            role: "user",
            content: text.substring(0, 6000)
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      console.error("OpenAI governance extraction error:", await response.text());
      return [];
    }

    const data = await response.json();
    const content = JSON.parse(data.choices?.[0]?.message?.content || '{"records":[]}');
    const records = content.records || [];

    return records.map((record: Record<string, unknown>) => ({
      company_id: companyId,
      record_type: record.record_type || "decision",
      title: record.title || "Item sem titulo",
      description: record.description || "",
      date: record.date || new Date().toISOString().split("T")[0],
      decision_outcome: record.decision_outcome,
      decision_rationale: record.decision_rationale,
      risk_category: record.risk_category,
      risk_severity: record.risk_severity,
      source: "uploaded_minutes",
      source_document_id: documentId
    }));
  } catch (error) {
    console.error("Error extracting governance history:", error);
    return [];
  }
}

// Helper: Update onboarding progress
async function updateOnboardingProgress(
  supabase: ReturnType<typeof createClient>,
  companyId: string
): Promise<void> {
  try {
    // Count processed documents
    const { count } = await supabase
      .from("document_library")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .eq("processing_status", "completed");

    const processedCount = count || 0;

    // Update progress
    await supabase
      .from("onboarding_progress")
      .update({
        documents_processed: processedCount,
        document_upload_score: Math.min(processedCount * 10, 100)
      })
      .eq("company_id", companyId);

    // Recalculate overall score
    await supabase.rpc("calculate_knowledge_base_score", { p_company_id: companyId });
  } catch (error) {
    console.error("Error updating onboarding progress:", error);
  }
}

