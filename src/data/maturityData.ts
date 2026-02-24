import { CompanyData, Question, MaturityStructure } from '@/types/maturity';

export const COMPANY_DATA: CompanyData[] = [
  {
    numero: "dados_1",
    texto: "Porte (Faturamento anual do ano anterior)",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "Pequena empresa (Até R$ 20 milhões)",
      "Média empresa (Acima de R$ 20 milhões até R$ 100 milhões)",
      "Média-grande empresa (Acima de R$ 100 milhões até R$ 400 milhões)",
      "Grande empresa (Acima de R$ 400 milhões)"
    ]
  },
  {
    numero: "dados_2",
    texto: "Número de colaboradores (em 31 de dezembro do ano anterior)",
    tipo: "numerico",
    opcoes: []
  },
  {
    numero: "dados_3",
    texto: "A empresa é associada ao IBGC?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"]
  },
  {
    numero: "dados_4",
    texto: "Qual o setor econômico da empresa?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "Primário (Agricultura, Pecuária, Extrativismo Mineral e Vegetal, Pesca, etc.)",
      "Secundário (Indústria)",
      "Terciário (Comércio e Serviços)"
    ]
  },
  {
    numero: "dados_5",
    texto: "Como a empresa se classifica?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "Empresa/sociedade operacional (sua atividade é destinada a operação de alguma atividade econômica)",
      "Holding pura (sua atividade é destinada exclusivamente a participação no capital de outras sociedades)",
      "Holding mista (além da participação no capital de outras sociedades, ela opera em alguma atividade econômica)"
    ]
  },
  {
    numero: "dados_6",
    texto: "Qual o principal ramo de atividade da empresa?",
    tipo: "texto",
    opcoes: []
  },
  {
    numero: "dados_7",
    texto: "Caracterização do tipo jurídico:",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "Sociedade limitada",
      "Sociedade anônima de capital fechado"
    ]
  },
  {
    numero: "dados_8",
    texto: "Caracterização do controle societário:",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "Estatal (governo concentra a maior parte do direito de controle)",
      "Familiar/multifamiliar (uma ou mais famílias que concentram a maior parte do direito de controle)",
      "Pulverizado (maior acionista com menos de 20% do capital total e um mínimo de 50 sócios)",
      "Subsidiária (direito de controle é exercido por outra empresa)",
      "Compartilhado (poucos sócios concentram a maior parte do direito de controle)"
    ]
  },
  {
    numero: "dados_9",
    texto: "O presidente do conselho de administração ou consultivo faz parte da família controladora?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "não",
      "sim",
      "não há conselho de administração ou consultivo"
    ]
  },
  {
    numero: "dados_10",
    texto: "Qual(is) geração(ões) da família está(ão) no conselho de administração ou consultivo?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "Não há conselho de administração ou consultivo",
      "1°",
      "2°",
      "3°",
      "4°",
      "Nenhuma",
      "Outra"
    ]
  },
  {
    numero: "dados_11",
    texto: "Qual(is) geração(ões) da família está(ão) na diretoria executiva da empresa?",
    tipo: "multipla_escolha_unica",
    opcoes: ["1°", "2°", "3°", "4°", "Nenhuma", "Outra"]
  },
  {
    numero: "dados_12",
    texto: "Qual(is) geração(ões) da família possui(em) participação societária no negócio?",
    tipo: "multipla_escolha_unica",
    opcoes: ["1°", "2°", "3°", "4°", "Nenhuma", "Outra"]
  },
  {
    numero: "dados_13",
    texto: "O fundador ainda atua na empresa?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "não",
      "sim, no conselho de administração ou consultivo",
      "sim, na diretoria",
      "sim, no conselho de administração ou consultivo e na diretoria"
    ]
  }
];

export const QUESTIONS: Question[] = [
  {
    numero: "1",
    dimensao: "Sócios",
    indicador: "Assembleia geral/reunião de Sócios",
    texto: "Com relação às ações ou cotas da empresa, assinale todas as alternativas que se apliquem:",
    tipo: "multipla_escolha_multipla",
    opcoes: [
      "todas as ações têm direito a voto",
      "todas as ações têm direito a voto ao menos nas matérias relevantes",
      "todas as ações garantem participação proporcional nos resultados econômicos",
      "há previsão de tratamento equitativo para todos os acionistas em caso de transferência de controle (tag along)",
      "nenhuma das anteriores"
    ],
    referencia: "Código IBGC – 6ª edição: 2.1, 2.2, 2.6"
  },
  {
    numero: "2",
    dimensao: "Sócios",
    indicador: "Assembleia geral/reunião de Sócios",
    texto: "Com relação às assembleias/reuniões de sócios, assinale todas as alternativas que se apliquem:",
    tipo: "multipla_escolha_multipla",
    opcoes: [
      "a convocação ocorre com, no mínimo, 30 dias de antecedência à assembleia/reunião de sócios",
      "em conjunto com a convocação para a assembleia/reunião de sócios, são encaminhados a pauta e os documentos necessários para as deliberações",
      "disponibilizam-se meios para o voto não presencial (procuração ou votação a distância)",
      "o presidente do conselho participa das assembleias/reuniões de sócios",
      "os demais conselheiros participam das assembleias/reuniões de sócios",
      "o diretor-presidente participa das assembleias/reuniões de sócios",
      "os demais diretores participam das assembleias/reuniões de sócios",
      "nenhuma das anteriores"
    ],
    referencia: "Código IBGC – 6ª edição: 2.5 / Orientação jurídica para conselheiros de administração e diretores de sociedades empresárias: 4.1.3; 5.1.1"
  },
  {
    numero: "3",
    dimensao: "Sócios",
    indicador: "Formalização da Governança Corporativa",
    texto: "O estatuto/contrato social contempla (assinale todas as alternativas que se apliquem):",
    tipo: "multipla_escolha_multipla",
    opcoes: [
      "mecanismos para o tratamento de situações de conflito de interesses nas assembleias/reuniões de sócios",
      "mecanismos para resolução de conflitos por meio de mediação",
      "mecanismos para resolução de conflitos por meio de arbitragem",
      "mecanismo formais para coibir o uso indevido dos ativos ou recursos da empresa pelos sócios e/ou administradores",
      "critérios para a destinação dos lucros/pagamento de dividendos",
      "quórum qualificado para a tomada de decisões relevantes pelos sócios",
      "metodologia de avaliação e da forma de pagamento aos sócios em caso de venda de participação ou saída (do sócio)",
      "previsão de direito de preferência em caso de transferência de controle",
      "nenhuma das anteriores"
    ],
    referencia: "Código IBGC – 6ª edição: 2.2, 2.3, 2.5, 2.6"
  },
  {
    numero: "4",
    dimensao: "Sócios",
    indicador: "Formalização da Governança Corporativa",
    texto: "Sua empresa possui acordo entre sócios/acionistas?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 2.4"
  },
  {
    numero: "4.1",
    dimensao: "Sócios",
    indicador: "Formalização da Governança Corporativa",
    texto: "Com relação ao acordo, assinale todas as alternativas que se apliquem:",
    tipo: "multipla_escolha_multipla",
    opcoes: [
      "não prevê que os sócios signatários do acordo definam previamente à reunião de conselho como os conselheiros indicados por eles deverão votar (ou empresa não possui conselho de administração)",
      "este acordo é de conhecimento de todos os sócios (mesmo os minoritários)",
      "todos os sócios são signatários do acordo",
      "nenhuma das anteriores"
    ],
    referencia: "Código IBGC – 6ª edição: 2.4"
  },
  {
    numero: "5",
    dimensao: "Sócios",
    indicador: "Formalização da Governança Corporativa",
    texto: "O estatuto/contrato social e/ou o acordo entre sócios preveem a indicação de algum diretor ou do diretor presidente diretamente pelos sócios?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "não",
      "sim",
      "sim, pois não há conselho de administração"
    ],
    referencia: "Código IBGC – 6ª edição: 2.2, 2.4, 4.2"
  },
  {
    numero: "6",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Estrutura do conselho de administração",
    texto: "A empresa possui:",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "conselho de administração estatutário",
      "conselho consultivo ou conselho de administração não estatutário",
      "nenhuma das anteriores"
    ],
    referencia: "Código IBGC – 6ª edição: 3.1, 3.20 / A importância do conselho consultivo em empresas de capital fechado: 1"
  },
  {
    numero: "7",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Estrutura do conselho de administração",
    texto: "Considerando os membros efetivos do conselho, indique nos campos abaixo: a) quantidade total de membros efetivos do conselho b) quantidade total de mulheres no conselho",
    tipo: "numerico_multiplo",
    opcoes: [],
    referencia: "Código IBGC - 6ª edição: 3.2"
  },
  {
    numero: "46",
    dimensao: "Empresas familiares",
    indicador: null,
    texto: "Existem regras claras para a contratação de familiares na empresa?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Caderno 15: 6.2, 6.5 / O papel do protocolo familiar na longevidade da empresa: 2.3"
  },
  {
    numero: "47",
    dimensao: "Empresas familiares",
    indicador: null,
    texto: "A família possui conselho de família ou outro fórum familiar?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "não",
      "sim, conselho de família",
      "outro"
    ],
    referencia: "Caderno 15: 5.2 / Caderno 12: 4.13"
  },
  {
    numero: "48",
    dimensao: "Empresas familiares",
    indicador: null,
    texto: "A família possui protocolo ou constituição familiar?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Caderno 15: 5.2, 6.5 / Caderno 12: 4.13 / O papel do protocolo familiar na longevidade da empresa: 1"
  },
  {
    numero: "49",
    dimensao: "Empresas familiares",
    indicador: null,
    texto: "A empresa e/ou a família possuem documento que discipline a relação família e negócios?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "não",
      "sim, acordo de sócios e/ou protocolo ou constituição familiar",
      "sim, outro documento"
    ],
    referencia: "Caderno 15: 5.2, 6.5 / Caderno 12: 4.9 / O papel do protocolo familiar na longevidade da empresa: 1"
  },
  {
    numero: "50",
    dimensao: "Empresas familiares",
    indicador: null,
    texto: "A família possui comitê de sócios ou outro fórum de proprietários com a função de direcionar a participação dos sócios familiares nas assembleias/reuniões de sócios?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "não",
      "sim, comitê de sócios",
      "sim, outro fórum"
    ],
    referencia: "Caderno 15: 5.4 / O papel do protocolo familiar na longevidade da empresa: 2.2"
  },
  {
    numero: "51",
    dimensao: "Empresas familiares",
    indicador: null,
    texto: "Há plano de sucessão para os familiares que ocupam cargos-chave na gestão?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "não",
      "sim, para todos",
      "sim, para alguns"
    ],
    referencia: "Caderno 15: 4.8 / Sucessão em empresas familiares: 4"
  }
];

export const MATURITY_STRUCTURE: MaturityStructure = {
  dimensoes: {
    "1": { nome: "Sócios", peso: 0.25 },
    "2": { nome: "Conselho", peso: 0.30 },
    "3": { nome: "Diretoria", peso: 0.25 },
    "4": { nome: "Órgãos de fiscalização e controle", peso: 0.10 },
    "5": { nome: "Conduta e conflitos de interesses", peso: 0.10 }
  },
  indicadores: {
    "1": { dimensao: "1", nome: "Assembleia / Reunião de sócios", peso: 0.4, questoes: ["1", "2"] },
    "2": { dimensao: "1", nome: "Formalização da governança", peso: 0.6, questoes: ["3", "4", "4.1", "5"] },
    "3": { dimensao: "2", nome: "Estrutura", peso: 0.1, questoes: ["6", "7", "8"] },
    "4": { dimensao: "2", nome: "Dinâmica e atribuições", peso: 0.7, questoes: ["9", "10", "10.1", "11", "12", "13", "14", "14.1", "14.2", "15", "16", "17"] },
    "5": { dimensao: "2", nome: "Avaliação e remuneração", peso: 0.1, questoes: ["18", "18.1", "18.2", "19", "19.1", "19.2"] },
    "6": { dimensao: "2", nome: "Comitês", peso: 0.1, questoes: ["20", "20.1", "20.2", "21", "22"] },
    "7": { dimensao: "3", nome: "Dinâmica e atribuições", peso: 0.5, questoes: ["23", "23.1", "23.2", "24", "25", "25.1", "26", "27", "27.1", "27.2", "27.3", "28", "29", "29.1", "29.2"] },
    "8": { dimensao: "3", nome: "Avaliação e remuneração", peso: 0.35, questoes: [] },
    "9": { dimensao: "3", nome: "Transparência", peso: 0.15, questoes: ["30", "30.1"] },
    "10": { dimensao: "4", nome: "Auditoria independente", peso: 0.45, questoes: ["31", "31.1", "32", "33"] },
    "11": { dimensao: "4", nome: "Conselho fiscal", peso: 0.05, questoes: ["34", "34.1"] },
    "12": { dimensao: "4", nome: "Riscos, controles e compliance", peso: 0.5, questoes: ["35", "36", "37", "38"] },
    "13": { dimensao: "5", nome: "Código de conduta", peso: 0.4, questoes: ["39", "40", "41", "41.1"] },
    "14": { dimensao: "5", nome: "Formalização da governança", peso: 0.2, questoes: ["42", "43"] },
    "15": { dimensao: "5", nome: "Transações entre partes relacionadas", peso: 0.4, questoes: ["44", "45"] }
  },
  empresas_familiares: {
    "46": { tema: "Regras para contratação", peso: 0.2 },
    "47": { tema: "Conselho de família", peso: 0.1 },
    "48": { tema: "Protocolo de família", peso: 0.1 },
    "49": { tema: "Acordo de sócios", peso: 0.2 },
    "50": { tema: "Comitê de sócios", peso: 0.1 },
    "51": { tema: "Plano de sucessão", peso: 0.3 }
  }
};