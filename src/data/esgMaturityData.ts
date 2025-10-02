// ESG Maturity Assessment Data
export interface ESGQuestion {
  id: string;
  text: string;
  pillar: 'environmental' | 'social' | 'governance' | 'strategy';
  subDimension: string;
  weight?: number;
}

export interface MaturityLevel {
  level: number;
  name: string;
  description: string;
  color: string;
  score: number;
}

export const maturityLevels: MaturityLevel[] = [
  {
    level: 1,
    name: "Inicial",
    description: "Ações pontuais e reativas, sem estratégia formal",
    color: "bg-red-500",
    score: 1
  },
  {
    level: 2,
    name: "Reativo",
    description: "Foco em conformidade e gestão de riscos básicos",
    color: "bg-orange-500",
    score: 2
  },
  {
    level: 3,
    name: "Estratégico",
    description: "ESG como oportunidade de negócio, com metas e indicadores",
    color: "bg-yellow-500",
    score: 3
  },
  {
    level: 4,
    name: "Inclusivo",
    description: "Visão sistêmica, com engajamento de stakeholders",
    color: "bg-blue-500",
    score: 4
  },
  {
    level: 5,
    name: "Integrado",
    description: "ESG como parte intrínseca do modelo de negócio",
    color: "bg-green-500",
    score: 5
  },
  {
    level: 6,
    name: "Regenerativo",
    description: "Empresa como agente de transformação, com impacto positivo líquido",
    color: "bg-purple-500",
    score: 6
  }
];

export const esgQuestions: ESGQuestion[] = [
  // AMBIENTAL (25 perguntas)
  // Mudanças Climáticas (7 perguntas)
  {
    id: "env_climate_1",
    text: "A empresa possui um inventário de emissões de gases de efeito estufa (GEE) e metas para sua redução?",
    pillar: "environmental",
    subDimension: "Mudanças Climáticas"
  },
  {
    id: "env_climate_2",
    text: "Existem iniciativas para a transição para fontes de energia renovável?",
    pillar: "environmental",
    subDimension: "Mudanças Climáticas"
  },
  {
    id: "env_climate_3",
    text: "A empresa avalia os riscos e oportunidades financeiras relacionadas ao clima, conforme as recomendações da TCFD?",
    pillar: "environmental",
    subDimension: "Mudanças Climáticas"
  },
  {
    id: "env_climate_4",
    text: "A empresa investe em tecnologias de baixo carbono e eficiência energética?",
    pillar: "environmental",
    subDimension: "Mudanças Climáticas"
  },
  {
    id: "env_climate_5",
    text: "Os riscos climáticos são integrados à estratégia de negócios e ao planejamento financeiro?",
    pillar: "environmental",
    subDimension: "Mudanças Climáticas"
  },
  {
    id: "env_climate_6",
    text: "A empresa promove o engajamento de seus stakeholders sobre a importância do combate às mudanças climáticas?",
    pillar: "environmental",
    subDimension: "Mudanças Climáticas"
  },
  {
    id: "env_climate_7",
    text: "A empresa compensa suas emissões de GEE por meio de projetos de carbono?",
    pillar: "environmental",
    subDimension: "Mudanças Climáticas"
  },
  
  // Gestão de Recursos Naturais (6 perguntas)
  {
    id: "env_resources_1",
    text: "A empresa monitora e gerencia o consumo de água em suas operações?",
    pillar: "environmental",
    subDimension: "Gestão de Recursos Naturais"
  },
  {
    id: "env_resources_2",
    text: "Existem metas para a redução do consumo de água e para o aumento da reutilização?",
    pillar: "environmental",
    subDimension: "Gestão de Recursos Naturais"
  },
  {
    id: "env_resources_3",
    text: "A empresa utiliza matérias-primas de fontes sustentáveis e certificadas?",
    pillar: "environmental",
    subDimension: "Gestão de Recursos Naturais"
  },
  {
    id: "env_resources_4",
    text: "A empresa adota práticas de produção que minimizam o desperdício de recursos naturais?",
    pillar: "environmental",
    subDimension: "Gestão de Recursos Naturais"
  },
  {
    id: "env_resources_5",
    text: "A empresa avalia o impacto de suas operações na disponibilidade de recursos hídricos locais?",
    pillar: "environmental",
    subDimension: "Gestão de Recursos Naturais"
  },
  {
    id: "env_resources_6",
    text: "A empresa investe em projetos de conservação e recuperação de recursos naturais?",
    pillar: "environmental",
    subDimension: "Gestão de Recursos Naturais"
  },
  
  // Biodiversidade e Ecossistemas (6 perguntas)
  {
    id: "env_biodiversity_1",
    text: "A empresa possui uma política de proteção à biodiversidade e aos ecossistemas?",
    pillar: "environmental",
    subDimension: "Biodiversidade e Ecossistemas"
  },
  {
    id: "env_biodiversity_2",
    text: "A empresa realiza estudos de impacto ambiental para seus projetos e operações?",
    pillar: "environmental",
    subDimension: "Biodiversidade e Ecossistemas"
  },
  {
    id: "env_biodiversity_3",
    text: "A empresa investe em projetos de restauração de ecossistemas e conservação da biodiversidade?",
    pillar: "environmental",
    subDimension: "Biodiversidade e Ecossistemas"
  },
  {
    id: "env_biodiversity_4",
    text: "A empresa evita o desmatamento e a degradação de habitats naturais em sua cadeia de valor?",
    pillar: "environmental",
    subDimension: "Biodiversidade e Ecossistemas"
  },
  {
    id: "env_biodiversity_5",
    text: "A empresa promove a conscientização sobre a importância da biodiversidade entre seus colaboradores e stakeholders?",
    pillar: "environmental",
    subDimension: "Biodiversidade e Ecossistemas"
  },
  {
    id: "env_biodiversity_6",
    text: "A empresa apoia iniciativas de conservação de espécies ameaçadas de extinção?",
    pillar: "environmental",
    subDimension: "Biodiversidade e Ecossistemas"
  },
  
  // Gestão de Resíduos e Poluição (6 perguntas)
  {
    id: "env_waste_1",
    text: "A empresa possui um programa de gerenciamento de resíduos sólidos, incluindo a coleta seletiva e a reciclagem?",
    pillar: "environmental",
    subDimension: "Gestão de Resíduos e Poluição"
  },
  {
    id: "env_waste_2",
    text: "Existem metas para a redução da geração de resíduos e para o aumento da reciclagem?",
    pillar: "environmental",
    subDimension: "Gestão de Resíduos e Poluição"
  },
  {
    id: "env_waste_3",
    text: "A empresa trata adequadamente seus efluentes e emissões atmosféricas?",
    pillar: "environmental",
    subDimension: "Gestão de Resíduos e Poluição"
  },
  {
    id: "env_waste_4",
    text: "A empresa utiliza materiais reciclados e recicláveis em seus produtos e embalagens?",
    pillar: "environmental",
    subDimension: "Gestão de Resíduos e Poluição"
  },
  {
    id: "env_waste_5",
    text: "A empresa promove a economia circular em sua cadeia de valor?",
    pillar: "environmental",
    subDimension: "Gestão de Resíduos e Poluição"
  },
  {
    id: "env_waste_6",
    text: "A empresa investe em tecnologias limpas para reduzir a poluição do ar, da água e do solo?",
    pillar: "environmental",
    subDimension: "Gestão de Resíduos e Poluição"
  },

  // SOCIAL (25 perguntas)
  // Capital Humano (8 perguntas)
  {
    id: "soc_human_1",
    text: "A empresa promove a diversidade e a inclusão em seu quadro de funcionários?",
    pillar: "social",
    subDimension: "Capital Humano"
  },
  {
    id: "soc_human_2",
    text: "A empresa oferece um ambiente de trabalho seguro e saudável para seus colaboradores?",
    pillar: "social",
    subDimension: "Capital Humano"
  },
  {
    id: "soc_human_3",
    text: "A empresa investe no desenvolvimento profissional e na capacitação de seus funcionários?",
    pillar: "social",
    subDimension: "Capital Humano"
  },
  {
    id: "soc_human_4",
    text: "A empresa possui uma política de remuneração justa e equitativa?",
    pillar: "social",
    subDimension: "Capital Humano"
  },
  {
    id: "soc_human_5",
    text: "A empresa respeita a liberdade de associação e o direito à negociação coletiva?",
    pillar: "social",
    subDimension: "Capital Humano"
  },
  {
    id: "soc_human_6",
    text: "A empresa combate o assédio moral e sexual no ambiente de trabalho?",
    pillar: "social",
    subDimension: "Capital Humano"
  },
  {
    id: "soc_human_7",
    text: "A empresa promove o equilíbrio entre a vida pessoal e profissional de seus colaboradores?",
    pillar: "social",
    subDimension: "Capital Humano"
  },
  {
    id: "soc_human_8",
    text: "A empresa realiza pesquisas de clima organizacional para avaliar a satisfação de seus funcionários?",
    pillar: "social",
    subDimension: "Capital Humano"
  },
  
  // Relações com a Comunidade (6 perguntas)
  {
    id: "soc_community_1",
    text: "A empresa mantém um diálogo aberto e transparente com as comunidades onde atua?",
    pillar: "social",
    subDimension: "Relações com a Comunidade"
  },
  {
    id: "soc_community_2",
    text: "A empresa investe em projetos sociais que beneficiam as comunidades locais?",
    pillar: "social",
    subDimension: "Relações com a Comunidade"
  },
  {
    id: "soc_community_3",
    text: "A empresa respeita a cultura e os costumes das comunidades locais?",
    pillar: "social",
    subDimension: "Relações com a Comunidade"
  },
  {
    id: "soc_community_4",
    text: "A empresa contribui para o desenvolvimento econômico e social das comunidades onde atua?",
    pillar: "social",
    subDimension: "Relações com a Comunidade"
  },
  {
    id: "soc_community_5",
    text: "A empresa realiza consultas prévias às comunidades locais antes de iniciar novos projetos?",
    pillar: "social",
    subDimension: "Relações com a Comunidade"
  },
  {
    id: "soc_community_6",
    text: "A empresa possui um canal de comunicação para receber e responder às demandas das comunidades locais?",
    pillar: "social",
    subDimension: "Relações com a Comunidade"
  },
  
  // Direitos Humanos (6 perguntas)
  {
    id: "soc_rights_1",
    text: "A empresa possui uma política de respeito aos direitos humanos em suas operações e em sua cadeia de valor?",
    pillar: "social",
    subDimension: "Direitos Humanos"
  },
  {
    id: "soc_rights_2",
    text: "A empresa realiza a devida diligência em direitos humanos para identificar e mitigar os riscos de violações?",
    pillar: "social",
    subDimension: "Direitos Humanos"
  },
  {
    id: "soc_rights_3",
    text: "A empresa combate o trabalho infantil e o trabalho forçado em sua cadeia de valor?",
    pillar: "social",
    subDimension: "Direitos Humanos"
  },
  {
    id: "soc_rights_4",
    text: "A empresa respeita os direitos dos povos indígenas e das comunidades tradicionais?",
    pillar: "social",
    subDimension: "Direitos Humanos"
  },
  {
    id: "soc_rights_5",
    text: "A empresa oferece treinamento sobre direitos humanos para seus colaboradores e fornecedores?",
    pillar: "social",
    subDimension: "Direitos Humanos"
  },
  {
    id: "soc_rights_6",
    text: "A empresa possui um mecanismo de denúncias para relatar violações de direitos humanos?",
    pillar: "social",
    subDimension: "Direitos Humanos"
  },
  
  // Responsabilidade com o Cliente (5 perguntas)
  {
    id: "soc_customer_1",
    text: "A empresa garante a qualidade e a segurança de seus produtos e serviços?",
    pillar: "social",
    subDimension: "Responsabilidade com o Cliente"
  },
  {
    id: "soc_customer_2",
    text: "A empresa fornece informações claras e precisas sobre seus produtos e serviços?",
    pillar: "social",
    subDimension: "Responsabilidade com o Cliente"
  },
  {
    id: "soc_customer_3",
    text: "A empresa protege a privacidade e os dados pessoais de seus clientes?",
    pillar: "social",
    subDimension: "Responsabilidade com o Cliente"
  },
  {
    id: "soc_customer_4",
    text: "A empresa possui um canal de atendimento para receber e responder às reclamações dos clientes?",
    pillar: "social",
    subDimension: "Responsabilidade com o Cliente"
  },
  {
    id: "soc_customer_5",
    text: "A empresa promove o consumo consciente e sustentável entre seus clientes?",
    pillar: "social",
    subDimension: "Responsabilidade com o Cliente"
  },

  // GOVERNANÇA (20 perguntas)
  // Estrutura de Governança ESG (6 perguntas)
  {
    id: "gov_structure_1",
    text: "A empresa possui um comitê de sustentabilidade ou um conselheiro responsável pela agenda ESG?",
    pillar: "governance",
    subDimension: "Estrutura de Governança ESG"
  },
  {
    id: "gov_structure_2",
    text: "A remuneração dos executivos está atrelada ao desempenho ESG da empresa?",
    pillar: "governance",
    subDimension: "Estrutura de Governança ESG"
  },
  {
    id: "gov_structure_3",
    text: "A empresa possui uma matriz de materialidade para identificar os temas ESG mais relevantes para o seu negócio?",
    pillar: "governance",
    subDimension: "Estrutura de Governança ESG"
  },
  {
    id: "gov_structure_4",
    text: "A empresa realiza a gestão de riscos e oportunidades ESG de forma integrada à gestão de riscos corporativos?",
    pillar: "governance",
    subDimension: "Estrutura de Governança ESG"
  },
  {
    id: "gov_structure_5",
    text: "A empresa possui um código de conduta e ética que orienta as decisões e o comportamento de seus colaboradores?",
    pillar: "governance",
    subDimension: "Estrutura de Governança ESG"
  },
  {
    id: "gov_structure_6",
    text: "A empresa promove a transparência e a prestação de contas em relação ao seu desempenho ESG?",
    pillar: "governance",
    subDimension: "Estrutura de Governança ESG"
  },
  
  // Ética e Conduta Empresarial (5 perguntas)
  {
    id: "gov_ethics_1",
    text: "A empresa possui uma política de combate à corrupção e ao suborno?",
    pillar: "governance",
    subDimension: "Ética e Conduta Empresarial"
  },
  {
    id: "gov_ethics_2",
    text: "A empresa realiza treinamentos sobre ética e compliance para seus colaboradores?",
    pillar: "governance",
    subDimension: "Ética e Conduta Empresarial"
  },
  {
    id: "gov_ethics_3",
    text: "A empresa possui um canal de denúncias para relatar casos de corrupção e outras irregularidades?",
    pillar: "governance",
    subDimension: "Ética e Conduta Empresarial"
  },
  {
    id: "gov_ethics_4",
    text: "A empresa realiza a devida diligência de seus parceiros de negócios para prevenir a corrupção?",
    pillar: "governance",
    subDimension: "Ética e Conduta Empresarial"
  },
  {
    id: "gov_ethics_5",
    text: "A empresa se engaja em práticas de lobby e advocacy de forma ética e transparente?",
    pillar: "governance",
    subDimension: "Ética e Conduta Empresarial"
  },
  
  // Gestão de Riscos ESG (5 perguntas)
  {
    id: "gov_risk_1",
    text: "A empresa identifica, avalia e gerencia os riscos ESG que podem afetar o seu negócio?",
    pillar: "governance",
    subDimension: "Gestão de Riscos ESG"
  },
  {
    id: "gov_risk_2",
    text: "Os riscos ESG são integrados ao planejamento estratégico e financeiro da empresa?",
    pillar: "governance",
    subDimension: "Gestão de Riscos ESG"
  },
  {
    id: "gov_risk_3",
    text: "A empresa possui planos de contingência para lidar com os riscos ESG?",
    pillar: "governance",
    subDimension: "Gestão de Riscos ESG"
  },
  {
    id: "gov_risk_4",
    text: "A empresa monitora e reporta os riscos ESG para a alta administração e para o conselho de administração?",
    pillar: "governance",
    subDimension: "Gestão de Riscos ESG"
  },
  {
    id: "gov_risk_5",
    text: "A empresa utiliza cenários e testes de estresse para avaliar a sua resiliência aos riscos ESG?",
    pillar: "governance",
    subDimension: "Gestão de Riscos ESG"
  },
  
  // Transparência e Relato (4 perguntas)
  {
    id: "gov_transparency_1",
    text: "A empresa divulga um relatório de sustentabilidade ou um relatório integrado que segue as diretrizes da GRI?",
    pillar: "governance",
    subDimension: "Transparência e Relato"
  },
  {
    id: "gov_transparency_2",
    text: "O relatório de sustentabilidade é verificado por uma auditoria externa independente?",
    pillar: "governance",
    subDimension: "Transparência e Relato"
  },
  {
    id: "gov_transparency_3",
    text: "A empresa divulga informações sobre o seu desempenho ESG em seu site e em outros canais de comunicação?",
    pillar: "governance",
    subDimension: "Transparência e Relato"
  },
  {
    id: "gov_transparency_4",
    text: "A empresa responde a questionários e a avaliações de agências de rating ESG?",
    pillar: "governance",
    subDimension: "Transparência e Relato"
  },

  // ESTRATÉGIA E GESTÃO (20 perguntas)
  // Integração Estratégica (6 perguntas)
  {
    id: "str_integration_1",
    text: "A estratégia de negócios da empresa está alinhada aos Objetivos de Desenvolvimento Sustentável (ODS) da ONU?",
    pillar: "strategy",
    subDimension: "Integração Estratégica"
  },
  {
    id: "str_integration_2",
    text: "A empresa possui metas e indicadores de desempenho ESG que são monitorados e reportados periodicamente?",
    pillar: "strategy",
    subDimension: "Integração Estratégica"
  },
  {
    id: "str_integration_3",
    text: "A empresa realiza a análise do ciclo de vida de seus produtos para identificar e mitigar os impactos socioambientais?",
    pillar: "strategy",
    subDimension: "Integração Estratégica"
  },
  {
    id: "str_integration_4",
    text: "A empresa utiliza a inovação e a tecnologia para desenvolver soluções sustentáveis?",
    pillar: "strategy",
    subDimension: "Integração Estratégica"
  },
  {
    id: "str_integration_5",
    text: "A empresa busca parcerias e alianças para promover a sustentabilidade em seu setor e em sua cadeia de valor?",
    pillar: "strategy",
    subDimension: "Integração Estratégica"
  },
  {
    id: "str_integration_6",
    text: "A empresa participa de iniciativas e fóruns sobre sustentabilidade para compartilhar as melhores práticas e aprender com outras empresas?",
    pillar: "strategy",
    subDimension: "Integração Estratégica"
  },
  
  // Inovação e Desempenho (5 perguntas)
  {
    id: "str_innovation_1",
    text: "A empresa investe em pesquisa e desenvolvimento (P&D) para criar produtos e serviços mais sustentáveis?",
    pillar: "strategy",
    subDimension: "Inovação e Desempenho"
  },
  {
    id: "str_innovation_2",
    text: "A empresa utiliza a análise de dados e a inteligência artificial para otimizar o seu desempenho ESG?",
    pillar: "strategy",
    subDimension: "Inovação e Desempenho"
  },
  {
    id: "str_innovation_3",
    text: "A empresa adota modelos de negócios inovadores que geram valor social e ambiental?",
    pillar: "strategy",
    subDimension: "Inovação e Desempenho"
  },
  {
    id: "str_innovation_4",
    text: "A empresa mede e monetiza os benefícios econômicos, sociais e ambientais de suas iniciativas ESG?",
    pillar: "strategy",
    subDimension: "Inovação e Desempenho"
  },
  {
    id: "str_innovation_5",
    text: "A empresa é reconhecida como líder em sustentabilidade em seu setor?",
    pillar: "strategy",
    subDimension: "Inovação e Desempenho"
  },
  
  // Cultura e Engajamento (5 perguntas)
  {
    id: "str_culture_1",
    text: "A sustentabilidade faz parte da cultura e dos valores da empresa?",
    pillar: "strategy",
    subDimension: "Cultura e Engajamento"
  },
  {
    id: "str_culture_2",
    text: "A empresa promove o engajamento dos colaboradores na agenda ESG por meio de programas de voluntariado e de conscientização?",
    pillar: "strategy",
    subDimension: "Cultura e Engajamento"
  },
  {
    id: "str_culture_3",
    text: "A empresa reconhece e recompensa os colaboradores que contribuem para o desempenho ESG da empresa?",
    pillar: "strategy",
    subDimension: "Cultura e Engajamento"
  },
  {
    id: "str_culture_4",
    text: "A empresa comunica de forma clara e transparente o seu propósito e o seu compromisso com a sustentabilidade?",
    pillar: "strategy",
    subDimension: "Cultura e Engajamento"
  },
  {
    id: "str_culture_5",
    text: "A empresa inspira e mobiliza seus stakeholders para a construção de um futuro mais sustentável?",
    pillar: "strategy",
    subDimension: "Cultura e Engajamento"
  },
  
  // Cadeia de Valor Sustentável (4 perguntas)
  {
    id: "str_supply_1",
    text: "A empresa possui uma política de compras sustentáveis que prioriza fornecedores com bom desempenho ESG?",
    pillar: "strategy",
    subDimension: "Cadeia de Valor Sustentável"
  },
  {
    id: "str_supply_2",
    text: "A empresa realiza a avaliação e o monitoramento do desempenho ESG de seus fornecedores?",
    pillar: "strategy",
    subDimension: "Cadeia de Valor Sustentável"
  },
  {
    id: "str_supply_3",
    text: "A empresa promove o desenvolvimento de seus fornecedores para que eles melhorem o seu desempenho ESG?",
    pillar: "strategy",
    subDimension: "Cadeia de Valor Sustentável"
  },
  {
    id: "str_supply_4",
    text: "A empresa colabora com seus fornecedores para desenvolver soluções inovadoras e sustentáveis?",
    pillar: "strategy",
    subDimension: "Cadeia de Valor Sustentável"
  }
];

export const pillarInfo = {
  environmental: {
    title: "Ambiental",
    description: "Impactos ambientais e sustentabilidade",
    color: "bg-green-500",
    icon: "Leaf",
    questionCount: 25,
    weight: 0.278
  },
  social: {
    title: "Social",
    description: "Relações sociais e responsabilidade",
    color: "bg-blue-500",
    icon: "Users",
    questionCount: 25,
    weight: 0.278
  },
  governance: {
    title: "Governança",
    description: "Estrutura de governança e ética",
    color: "bg-purple-500",
    icon: "Scale",
    questionCount: 20,
    weight: 0.222
  },
  strategy: {
    title: "Estratégia e Gestão",
    description: "Estratégia ESG e gestão integrada",
    color: "bg-orange-500",
    icon: "Target",
    questionCount: 20,
    weight: 0.222
  }
};