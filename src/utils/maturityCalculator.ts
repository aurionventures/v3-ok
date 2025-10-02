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
    
    if (pontuacao_indicadores[id_indicador].max_pontos > 0) {
      pontuacao_indicadores[id_indicador].percentual = 
        pontuacao_indicadores[id_indicador].pontos / pontuacao_indicadores[id_indicador].max_pontos;
    }
  });

  // Calcular pontuação de cada dimensão
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
  let pontuacao_total = 0;
  Object.entries(MATURITY_STRUCTURE.dimensoes).forEach(([id_dim, info_dim]) => {
    pontuacao_total += info_dim.peso * pontuacao_dimensoes[id_dim].percentual;
  });

  // Calcular estágio de evolução baseado em percentual
  const percentual = pontuacao_total * 100;
  let estagio = "Embrionário";
  if (percentual <= 20) estagio = "Embrionário";
  else if (percentual <= 40) estagio = "Inicial";
  else if (percentual <= 60) estagio = "Básico";
  else if (percentual <= 80) estagio = "Sólido";
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

  return {
    pontuacao_total,
    estagio,
    pontuacao_dimensoes: Object.fromEntries(
      Object.entries(MATURITY_STRUCTURE.dimensoes).map(([id, info]) => [
        info.nome, 
        pontuacao_dimensoes[id].percentual
      ])
    ),
    pontuacao_indicadores: Object.fromEntries(
      Object.entries(MATURITY_STRUCTURE.indicadores).map(([id, info]) => [
        info.nome,
        pontuacao_indicadores[id].percentual
      ])
    ),
    pontuacao_empresas_controle_concentrado: pontuacao_familiar
  };
}

export function convertToRadarData(result: MaturityResult): MaturityDimension[] {
  return Object.entries(result.pontuacao_dimensoes).map(([name, score]) => ({
    name,
    score: score * 5, // Converter para escala 0-5
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