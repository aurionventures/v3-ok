import { MATURITY_STRUCTURE, QUESTIONS } from '@/data/maturityData';
import { Question, MaturityResult, UserAnswers, MaturityDimension } from '@/types/maturity';

function _pontuar_questao(questao: Question, resposta: string | string[] | number | object | undefined): [number, number] {
  let pontuacao = 0;
  let pontuacao_maxima = 1;

  if (!resposta) return [0, pontuacao_maxima];

  if (questao.tipo === "multipla_escolha_unica") {
    // Assume que a primeira opção é geralmente negativa ("não", "nenhuma")
    if (typeof resposta === 'string' && 
        resposta.toLowerCase() !== questao.opcoes[0]?.toLowerCase() && 
        resposta.toLowerCase() !== "nenhuma das anteriores") {
      pontuacao = 1;
    }
  } else if (questao.tipo === "multipla_escolha_multipla") {
    const opcoes_positivas = questao.opcoes.filter(opt => 
      !opt.toLowerCase().includes("nenhuma")
    );
    pontuacao_maxima = opcoes_positivas.length;
    
    if (Array.isArray(resposta)) {
      if (resposta.some(r => r.toLowerCase().includes("nenhuma das anteriores"))) {
        pontuacao = 0;
      } else {
        pontuacao = resposta.filter(r => opcoes_positivas.includes(r)).length;
      }
    }
  } else {
    // Questões numéricas, de texto ou matriz não são pontuadas diretamente neste modelo
    pontuacao = 0;
    pontuacao_maxima = 0;
  }

  return [pontuacao, pontuacao_maxima];
}

export function calcularPontuacao(respostas_usuario: UserAnswers, eh_empresa_familiar: boolean = false): MaturityResult {
  const questoes_map = Object.fromEntries(
    QUESTIONS.map(q => [q.numero, q])
  );
  
  const pontuacao_indicadores: Record<string, { pontos: number; max_pontos: number; percentual: number }> = {};
  
  // Inicializar indicadores
  Object.keys(MATURITY_STRUCTURE.indicadores).forEach(id => {
    pontuacao_indicadores[id] = { pontos: 0, max_pontos: 0, percentual: 0 };
  });

  // Calcular pontuação de cada indicador
  // Fórmula IBGC: Indicador = (Σ pontos alternativas assinaladas / pontuação máxima do indicador)
  Object.entries(MATURITY_STRUCTURE.indicadores).forEach(([id_indicador, info_indicador]) => {
    info_indicador.questoes.forEach(num_questao => {
      if (questoes_map[num_questao]) {
        const questao = questoes_map[num_questao];
        const resposta = respostas_usuario.questions[num_questao];
        const [pontos, max_pontos] = _pontuar_questao(questao, resposta);
        
        pontuacao_indicadores[id_indicador].pontos += pontos;
        pontuacao_indicadores[id_indicador].max_pontos += max_pontos;
      }
    });
    
    // Calcular percentual do indicador (0-1)
    if (pontuacao_indicadores[id_indicador].max_pontos > 0) {
      pontuacao_indicadores[id_indicador].percentual = 
        pontuacao_indicadores[id_indicador].pontos / pontuacao_indicadores[id_indicador].max_pontos;
    }
  });

  // Calcular pontuação de cada dimensão
  // Fórmula IBGC: Dimensão = Σ (peso_indicador * percentual_indicador)
  // Exemplo: Dimensão 1 = (0.4 * Indicador 1 + 0.6 * Indicador 2)
  const pontuacao_dimensoes: Record<string, { percentual: number }> = {};
  Object.keys(MATURITY_STRUCTURE.dimensoes).forEach(id_dim => {
    pontuacao_dimensoes[id_dim] = { percentual: 0 };
    
    let soma_ponderada = 0;
    Object.entries(MATURITY_STRUCTURE.indicadores).forEach(([id_indicador, info_indicador]) => {
      if (info_indicador.dimensao === id_dim) {
        soma_ponderada += info_indicador.peso * pontuacao_indicadores[id_indicador].percentual;
      }
    });
    pontuacao_dimensoes[id_dim].percentual = soma_ponderada;
  });

  // Calcular pontuação total
  // Fórmula IBGC: TOTAL = (0.25 * Dimensão 1 + 0.3 * Dimensão 2 + 0.25 * Dimensão 3 + 0.1 * Dimensão 4 + 0.1 * Dimensão 5)
  // Resultado: valor entre 0 e 1 (percentual)
  let pontuacao_total = 0;
  Object.entries(MATURITY_STRUCTURE.dimensoes).forEach(([id_dim, info_dim]) => {
    pontuacao_total += info_dim.peso * pontuacao_dimensoes[id_dim].percentual;
  });

  // Calcular estágio de evolução baseado em PERCENTUAL (0-100%) conforme Manual IBGC - Tabela 2
  // O cálculo interno é em percentual (0-1), mas os estágios são definidos por faixas percentuais
  const pontuacao_percentual = pontuacao_total * 100; // Converter para 0-100%
  let estagio = "Embrionário";
  if (pontuacao_percentual <= 20) estagio = "Embrionário";
  else if (pontuacao_percentual <= 40) estagio = "Inicial";
  else if (pontuacao_percentual <= 60) estagio = "Básico";
  else if (pontuacao_percentual <= 80) estagio = "Sólido";
  else estagio = "Avançado";

  // Calcular dimensão de Empresas Familiares
  let pontuacao_familiar: { percentual: number } | undefined;
  if (eh_empresa_familiar) {
    pontuacao_familiar = { percentual: 0 };
    let soma_ponderada_familiar = 0;
    
    Object.entries(MATURITY_STRUCTURE.empresas_controle_concentrado).forEach(([num_questao, info_questao]) => {
      if (questoes_map[num_questao]) {
        const questao = questoes_map[num_questao];
        const resposta = respostas_usuario.questions[num_questao];
        const [pontos, max_pontos] = _pontuar_questao(questao, resposta);
        
        if (max_pontos > 0) {
          soma_ponderada_familiar += info_questao.peso * (pontos / max_pontos);
        }
      }
    });
    pontuacao_familiar.percentual = soma_ponderada_familiar;
  }

  // Converter para pontos (escala 0-5) apenas para exibição na interface
  // O cálculo interno permanece em percentual (0-1) conforme manual IBGC
  // Conversão: pontos = percentual * 5 (exemplo: 0.73 * 5 = 3.65 pontos)
  const pontuacao_total_pontos = pontuacao_total * 5;
  
  return {
    pontuacao_total: pontuacao_total_pontos, // Retornar em pontos (0-5) para exibição
    pontuacao_total_percentual: pontuacao_total * 100, // Percentual (0-100%) para referência
    estagio, // Calculado baseado em percentual conforme Tabela 2 do manual IBGC
    pontuacao_dimensoes: Object.fromEntries(
      Object.entries(MATURITY_STRUCTURE.dimensoes).map(([id, info]) => [
        info.nome, 
        pontuacao_dimensoes[id].percentual * 5 // Converter para pontos (0-5) para exibição
      ])
    ),
    pontuacao_dimensoes_percentual: Object.fromEntries(
      Object.entries(MATURITY_STRUCTURE.dimensoes).map(([id, info]) => [
        info.nome, 
        pontuacao_dimensoes[id].percentual * 100 // Percentual (0-100%) para referência
      ])
    ),
    pontuacao_indicadores: Object.fromEntries(
      Object.entries(MATURITY_STRUCTURE.indicadores).map(([id, info]) => [
        info.nome,
        pontuacao_indicadores[id].percentual * 5 // Converter para pontos (0-5) para exibição
      ])
    ),
    pontuacao_indicadores_percentual: Object.fromEntries(
      Object.entries(MATURITY_STRUCTURE.indicadores).map(([id, info]) => [
        info.nome,
        pontuacao_indicadores[id].percentual * 100 // Percentual (0-100%) para referência
      ])
    ),
    pontuacao_indicadores_detalhada: Object.fromEntries(
      Object.entries(MATURITY_STRUCTURE.indicadores).map(([id, info]) => [
        info.nome,
        {
          pontos: pontuacao_indicadores[id].pontos,
          max_pontos: pontuacao_indicadores[id].max_pontos,
          pontuacao: pontuacao_indicadores[id].percentual * 5, // Pontos (0-5) para exibição
          percentual: pontuacao_indicadores[id].percentual * 100 // Percentual (0-100%) para referência
        }
      ])
    ),
    pontuacao_empresas_controle_concentrado: pontuacao_familiar ? {
      percentual: pontuacao_familiar.percentual * 100, // Percentual (0-100%)
      pontos: pontuacao_familiar.percentual * 5 // Pontos (0-5) para exibição
    } : undefined
  };
}

export function convertToRadarData(result: MaturityResult): MaturityDimension[] {
  return Object.entries(result.pontuacao_dimensoes).map(([name, score]) => ({
    name,
    score: score, // Já está em pontos (0-5)
    sectorAverage: getSectorBenchmark(name),
    fullMark: 5
  }));
}

function getSectorBenchmark(dimensionName: string): number {
  const benchmarks: Record<string, number> = {
    "Sócios": 3.2,
    "Conselho": 2.8,
    "Diretoria": 3.0,
    "Órgãos de fiscalização e controle": 2.5,
    "Conduta e conflitos de interesses": 2.7
  };
  
  return benchmarks[dimensionName] || 3.0;
}

export function detectFamilyBusiness(companyData: Record<string, any>): boolean {
  // Detectar se é empresa familiar baseado nos dados da empresa
  const controleData = companyData.dados_8;
  const conselheirosData = companyData.dados_9;
  
  return controleData?.includes("Familiar") || 
         controleData?.includes("familiar") ||
         conselheirosData === "sim";
}