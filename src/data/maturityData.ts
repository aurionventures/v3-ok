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
    numero: "8",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Estrutura do conselho de administração",
    texto: "O conselho possui maioria de membros independentes (não executivos e sem conflitos de interesses)?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não aplicável (não há conselho estatutário)"],
    referencia: "Código IBGC – 6ª edição: 3.2, 3.3"
  },
  {
    numero: "9",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "O conselho se reúne com que frequência, em média?",
    tipo: "multipla_escolha_unica",
    opcoes: [
      "menos de 2 vezes ao ano",
      "semestralmente (2 vezes ao ano)",
      "trimestralmente (4 vezes ao ano)",
      "mensalmente ou mais"
    ],
    referencia: "Código IBGC – 6ª edição: 3.7"
  },
  {
    numero: "10",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "O conselho possui regimento interno ou documento equivalente?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.6"
  },
  {
    numero: "10.1",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "O regimento interno do conselho contempla (assinale todas que se apliquem):",
    tipo: "multipla_escolha_multipla",
    opcoes: [
      "atribuições e responsabilidades do conselho",
      "regras para reuniões e deliberações",
      "definição de quórum e maioria",
      "competências exclusivas do conselho",
      "nenhuma das anteriores"
    ],
    referencia: "Código IBGC – 6ª edição: 3.6"
  },
  {
    numero: "11",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "A empresa possui política de seleção e indicação de conselheiros?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.2"
  },
  {
    numero: "12",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "Existe processo formal de onboarding de novos conselheiros?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.5"
  },
  {
    numero: "13",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "O conselho recebe informações com antecedência mínima para as reuniões?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim, menos de 3 dias", "sim, entre 3 e 7 dias", "sim, mais de 7 dias"],
    referencia: "Código IBGC – 6ª edição: 3.7"
  },
  {
    numero: "14",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "O conselho define estratégia e acompanha a execução?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "parcialmente", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.8"
  },
  {
    numero: "14.1",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "O conselho acompanha indicadores de desempenho (KPIs)?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.8"
  },
  {
    numero: "14.2",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "O conselho avalia a Diretoria formalmente?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.9"
  },
  {
    numero: "15",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "Há reuniões periódicas entre o conselho e os auditores independentes (quando aplicável)?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não aplicável"],
    referencia: "Código IBGC – 6ª edição: 3.11"
  },
  {
    numero: "16",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "O conselho possui sessões executivas (sem a presença da Diretoria)?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.7"
  },
  {
    numero: "17",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Dinâmica e atribuições",
    texto: "O conselho possui política de conflito de interesses para seus membros?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.1"
  },
  {
    numero: "18",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Avaliação e remuneração",
    texto: "O conselho realiza avaliação de desempenho de seus membros?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.13"
  },
  {
    numero: "18.1",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Avaliação e remuneração",
    texto: "A avaliação do conselho é documentada e periódica?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.13"
  },
  {
    numero: "18.2",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Avaliação e remuneração",
    texto: "Existe política de remuneração para os conselheiros?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.14"
  },
  {
    numero: "19",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Avaliação e remuneração",
    texto: "O conselho possui comitê de remuneração ou equivalente?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.16"
  },
  {
    numero: "19.1",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Avaliação e remuneração",
    texto: "O comitê de remuneração é composto majoritariamente por conselheiros independentes?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há comitê"],
    referencia: "Código IBGC – 6ª edição: 3.16"
  },
  {
    numero: "19.2",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Avaliação e remuneração",
    texto: "A remuneração da Diretoria é aprovada pelo conselho ou comitê?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 4.4"
  },
  {
    numero: "20",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Comitês",
    texto: "O conselho possui comitê de auditoria (ou equivalente)?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.17"
  },
  {
    numero: "20.1",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Comitês",
    texto: "O comitê de auditoria é presidido por conselheiro independente?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há comitê de auditoria"],
    referencia: "Código IBGC – 6ª edição: 3.17"
  },
  {
    numero: "20.2",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Comitês",
    texto: "O comitê de auditoria se reúne com os auditores independentes?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há comitê"],
    referencia: "Código IBGC – 6ª edição: 3.17"
  },
  {
    numero: "21",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Comitês",
    texto: "O conselho possui comitê de riscos (ou equivalente)?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.18"
  },
  {
    numero: "22",
    dimensao: "Conselho de administração/consultivo",
    indicador: "Comitês",
    texto: "Os comitês do conselho prestam contas ao plenário?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há comitês"],
    referencia: "Código IBGC – 6ª edição: 3.17"
  },
  {
    numero: "23",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "A Diretoria possui descrição clara de atribuições e responsabilidades?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 4.1"
  },
  {
    numero: "23.1",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "Existe separação entre as funções de presidente do conselho e diretor-presidente?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não aplicável"],
    referencia: "Código IBGC – 6ª edição: 3.4, 4.2"
  },
  {
    numero: "23.2",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "A Diretoria presta contas formalmente ao conselho?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 4.3"
  },
  {
    numero: "24",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "Existe plano estratégico ou de negócios aprovado pelo conselho?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 4.3"
  },
  {
    numero: "25",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "A empresa possui política de sucessão para cargos da Diretoria?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 4.5"
  },
  {
    numero: "25.1",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "O plano de sucessão é revisado periodicamente?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há plano"],
    referencia: "Código IBGC – 6ª edição: 4.5"
  },
  {
    numero: "26",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "A Diretoria comunica informações relevantes ao conselho de forma tempestiva?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "parcialmente", "sim"],
    referencia: "Código IBGC – 6ª edição: 4.3"
  },
  {
    numero: "27",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "Os diretores possuem política de conflito de interesses?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.1"
  },
  {
    numero: "27.1",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "Existe processo para declaração de conflitos de interesses?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.2"
  },
  {
    numero: "27.2",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "Em caso de conflito, o diretor se abstém da deliberação?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.2"
  },
  {
    numero: "27.3",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "As abstenções por conflito são registradas em ata?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.2"
  },
  {
    numero: "28",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "A Diretoria mantém canais abertos com o conselho entre reuniões?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 3.7"
  },
  {
    numero: "29",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "Existe avaliação formal de desempenho da Diretoria?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 4.4"
  },
  {
    numero: "29.1",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "A avaliação considera objetivos e metas previamente definidos?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há avaliação"],
    referencia: "Código IBGC – 6ª edição: 4.4"
  },
  {
    numero: "29.2",
    dimensao: "Diretoria",
    indicador: "Dinâmica e atribuições",
    texto: "A remuneração da Diretoria está vinculada ao desempenho?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "parcialmente", "sim"],
    referencia: "Código IBGC – 6ª edição: 4.4"
  },
  {
    numero: "30",
    dimensao: "Diretoria",
    indicador: "Transparência",
    texto: "A empresa divulga informações aos sócios/acionistas de forma regular?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "parcialmente", "sim"],
    referencia: "Código IBGC – 6ª edição: 6.1"
  },
  {
    numero: "30.1",
    dimensao: "Diretoria",
    indicador: "Transparência",
    texto: "Existe política de comunicação com investidores e demais stakeholders?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 6.2"
  },
  {
    numero: "31",
    dimensao: "Órgãos de fiscalização e controle",
    indicador: "Auditoria independente",
    texto: "A empresa possui auditoria independente das demonstrações financeiras?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 7.1"
  },
  {
    numero: "31.1",
    dimensao: "Órgãos de fiscalização e controle",
    indicador: "Auditoria independente",
    texto: "A empresa realiza rodízio de auditorias a cada 5 anos (ou equivalente)?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há auditoria"],
    referencia: "Código IBGC – 6ª edição: 7.2"
  },
  {
    numero: "32",
    dimensao: "Órgãos de fiscalização e controle",
    indicador: "Auditoria independente",
    texto: "O conselho analisa o relatório do auditor independente?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há auditoria"],
    referencia: "Código IBGC – 6ª edição: 7.3"
  },
  {
    numero: "33",
    dimensao: "Órgãos de fiscalização e controle",
    indicador: "Auditoria independente",
    texto: "O auditor participa de reuniões do conselho quando convocado?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há auditoria"],
    referencia: "Código IBGC – 6ª edição: 7.3"
  },
  {
    numero: "34",
    dimensao: "Órgãos de fiscalização e controle",
    indicador: "Conselho fiscal",
    texto: "A empresa possui conselho fiscal?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 7.4"
  },
  {
    numero: "34.1",
    dimensao: "Órgãos de fiscalização e controle",
    indicador: "Conselho fiscal",
    texto: "O conselho fiscal atua de forma independente em relação à Diretoria?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há conselho fiscal"],
    referencia: "Código IBGC – 6ª edição: 7.4"
  },
  {
    numero: "35",
    dimensao: "Órgãos de fiscalização e controle",
    indicador: "Riscos, controles e compliance",
    texto: "A empresa possui área ou função de gestão de riscos?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 7.5"
  },
  {
    numero: "36",
    dimensao: "Órgãos de fiscalização e controle",
    indicador: "Riscos, controles e compliance",
    texto: "Existe política de gestão de riscos aprovada pelo conselho?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 7.5"
  },
  {
    numero: "37",
    dimensao: "Órgãos de fiscalização e controle",
    indicador: "Riscos, controles e compliance",
    texto: "A empresa possui canal de denúncias/ouvidoria?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 7.6"
  },
  {
    numero: "38",
    dimensao: "Órgãos de fiscalização e controle",
    indicador: "Riscos, controles e compliance",
    texto: "Existe área ou comitê de compliance?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 7.6"
  },
  {
    numero: "39",
    dimensao: "Conduta e conflitos de interesses",
    indicador: "Código de conduta",
    texto: "A empresa possui código de conduta ou de ética?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.3"
  },
  {
    numero: "40",
    dimensao: "Conduta e conflitos de interesses",
    indicador: "Código de conduta",
    texto: "O código de conduta é comunicado e treinamento é oferecido aos colaboradores?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.3"
  },
  {
    numero: "41",
    dimensao: "Conduta e conflitos de interesses",
    indicador: "Código de conduta",
    texto: "Existe política de conflito de interesses para administradores e colaboradores?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.1"
  },
  {
    numero: "41.1",
    dimensao: "Conduta e conflitos de interesses",
    indicador: "Código de conduta",
    texto: "A política de conflitos exige declaração anual dos interesses?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há política"],
    referencia: "Código IBGC – 6ª edição: 5.2"
  },
  {
    numero: "42",
    dimensao: "Conduta e conflitos de interesses",
    indicador: "Formalização da governança",
    texto: "A empresa possui política de transações com partes relacionadas?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.4"
  },
  {
    numero: "43",
    dimensao: "Conduta e conflitos de interesses",
    indicador: "Formalização da governança",
    texto: "Transações com partes relacionadas são submetidas ao conselho para aprovação?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim", "não há transações"],
    referencia: "Código IBGC – 6ª edição: 5.4"
  },
  {
    numero: "44",
    dimensao: "Conduta e conflitos de interesses",
    indicador: "Transações entre partes relacionadas",
    texto: "As transações com partes relacionadas são divulgadas aos sócios?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "parcialmente", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.4"
  },
  {
    numero: "45",
    dimensao: "Conduta e conflitos de interesses",
    indicador: "Transações entre partes relacionadas",
    texto: "Existe procedimento para tratamento de transações com partes relacionadas (análise, aprovação, divulgação)?",
    tipo: "multipla_escolha_unica",
    opcoes: ["não", "sim"],
    referencia: "Código IBGC – 6ª edição: 5.4"
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