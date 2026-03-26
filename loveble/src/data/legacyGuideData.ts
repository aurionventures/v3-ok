export interface GuideEntry {
  id: string;
  module: string;
  category: 'inicio' | 'parametrizacao' | 'preparacao' | 'estruturacao' | 'desenvolvimento' | 'monitoramento' | 'inteligencia' | 'esg' | 'member';
  title: string;
  keywords: string[];
  shortDescription: string;
  howTo: string[];
  tips: string[];
  relatedModules: string[];
  route: string;
  icon: string;
}

export const legacyGuideData: GuideEntry[] = [
  // ==================== INÍCIO ====================
  {
    id: 'dashboard-overview',
    module: 'Dashboard Executivo',
    category: 'inicio',
    title: 'Entendendo o Dashboard Executivo',
    keywords: ['dashboard', 'início', 'home', 'principal', 'kpi', 'métricas', 'indicadores', 'visão geral'],
    shortDescription: 'O Dashboard Executivo é sua central de comando, exibindo KPIs de governança, tarefas pendentes, riscos e maturidade em uma única tela.',
    howTo: [
      'Acesse o Dashboard pelo menu lateral em "Início"',
      'Visualize os 4 KPIs principais no topo: Maturidade, ESG, Riscos e Tarefas',
      'Acompanhe a Taxa de Resolução de tarefas e ATAs pendentes',
      'Use os botões "Ver Detalhes" para acessar módulos específicos'
    ],
    tips: [
      'O Dashboard atualiza em tempo real conforme você realiza ações na plataforma',
      'Clique em "Ver Painel de Secretariado" para gestão detalhada de tarefas'
    ],
    relatedModules: ['Painel de Secretariado', 'Gestão de Riscos'],
    route: '/dashboard',
    icon: 'LayoutDashboard'
  },
  {
    id: 'first-steps',
    module: 'Primeiros Passos',
    category: 'inicio',
    title: 'Por onde começar na Legacy',
    keywords: ['começar', 'início', 'primeiro', 'novo', 'tutorial', 'guia', 'introdução'],
    shortDescription: 'Guia inicial para novos usuários configurarem a plataforma e começarem a usar os recursos de governança corporativa.',
    howTo: [
      'Configure seus órgãos de governança em "Configuração de Governança"',
      'Adicione os membros de cada conselho, comitê ou comissão',
      'Crie sua primeira reunião na "Agenda Anual"',
      'Faça upload dos documentos societários no "Checklist de Documentos"',
      'Realize a avaliação de "Maturidade de Governança"'
    ],
    tips: [
      'Comece configurando os órgãos antes de criar reuniões',
      'A avaliação de maturidade ajuda a identificar gaps na governança'
    ],
    relatedModules: ['Configuração de Governança', 'Agenda Anual', 'Maturidade de Governança'],
    route: '/dashboard',
    icon: 'Rocket'
  },
  {
    id: 'navigation-overview',
    module: 'Navegação',
    category: 'inicio',
    title: 'Navegando pela plataforma',
    keywords: ['menu', 'navegação', 'sidebar', 'lateral', 'acessar', 'encontrar', 'onde'],
    shortDescription: 'A navegação da Legacy é organizada em seções: Início, Parametrização, Preparação, Estruturação, Desenvolvimento, Monitoramento, Inteligência e ESG.',
    howTo: [
      'Use o menu lateral esquerdo para navegar entre módulos',
      'Clique nas seções para expandir os submódulos',
      'O breadcrumb no topo mostra sua localização atual',
      'Use o Guia Legacy (este assistente) para ajuda contextual'
    ],
    tips: [
      'O menu pode ser recolhido clicando no ícone de hambúrguer',
      'Módulos premium como Inteligência de Mercado e ESG têm cores diferenciadas'
    ],
    relatedModules: ['Dashboard Executivo'],
    route: '/dashboard',
    icon: 'Navigation'
  },
  {
    id: 'quick-actions',
    module: 'Ações Rápidas',
    category: 'inicio',
    title: 'Usando ações rápidas no Dashboard',
    keywords: ['ação', 'rápida', 'atalho', 'botão', 'acesso rápido'],
    shortDescription: 'O Dashboard oferece ações rápidas para as tarefas mais comuns como criar reuniões, gerar relatórios e acessar tarefas pendentes.',
    howTo: [
      'No card "Gestão de Tarefas", clique em "Ver Painel de Secretariado"',
      'Use os cards de métricas para navegação direta aos módulos',
      'Acesse "ATAs Pendentes" para ver aprovações e assinaturas necessárias'
    ],
    tips: [
      'Os badges coloridos indicam urgência: vermelho para atrasadas, amarelo para próximas do prazo'
    ],
    relatedModules: ['Painel de Secretariado', 'Agenda Anual'],
    route: '/dashboard',
    icon: 'Zap'
  },
  {
    id: 'notifications',
    module: 'Notificações',
    category: 'inicio',
    title: 'Gerenciando notificações',
    keywords: ['notificação', 'alerta', 'aviso', 'lembrete', 'email', 'whatsapp'],
    shortDescription: 'Configure como e quando receber notificações sobre reuniões, tarefas e prazos importantes.',
    howTo: [
      'Acesse "Configurações" no menu lateral',
      'Vá para a aba "Notificações"',
      'Ative ou desative canais: Email, WhatsApp, In-App',
      'Configure tipos: Lembretes de reunião, Tarefas pendentes, Alertas de atraso'
    ],
    tips: [
      'Lembretes de reunião podem ser configurados para 24h, 12h ou 1h antes',
      'Notificações de tarefas atrasadas são enviadas automaticamente aos responsáveis'
    ],
    relatedModules: ['Configurações', 'Painel de Secretariado'],
    route: '/notification-settings',
    icon: 'Bell'
  },

  // ==================== PARAMETRIZAÇÃO ====================
  {
    id: 'governance-config-create',
    module: 'Configuração de Governança',
    category: 'parametrizacao',
    title: 'Como criar órgãos de governança',
    keywords: ['criar', 'órgão', 'conselho', 'comitê', 'comissão', 'governança', 'configurar', 'novo'],
    shortDescription: 'Crie e configure conselhos, comitês e comissões que compõem a estrutura de governança da sua empresa.',
    howTo: [
      'Acesse "Configuração de Governança" no menu Parametrização',
      'Clique em "Novo Órgão" no canto superior direito',
      'Selecione o tipo: Conselho, Comitê ou Comissão',
      'Preencha nome, descrição e quórum mínimo',
      'Defina o nível hierárquico (1 = mais alto)',
      'Salve para criar o órgão'
    ],
    tips: [
      'O Conselho de Administração geralmente é nível 1',
      'Comitês reportam a conselhos, então têm nível 2 ou 3',
      'O quórum define o mínimo de membros para deliberações válidas'
    ],
    relatedModules: ['Adicionar Membros', 'Agenda Anual'],
    route: '/governance-config',
    icon: 'Building2'
  },
  {
    id: 'governance-config-members',
    module: 'Membros de Órgãos',
    category: 'parametrizacao',
    title: 'Como adicionar membros aos órgãos',
    keywords: ['membro', 'adicionar', 'conselheiro', 'participante', 'pessoa', 'incluir'],
    shortDescription: 'Adicione conselheiros, diretores e outros membros aos órgãos de governança configurados.',
    howTo: [
      'Acesse "Configuração de Governança"',
      'Localize o órgão desejado',
      'Clique no botão de membros ou acesse a seção "Membros"',
      'Clique em "Adicionar Membro"',
      'Preencha nome, cargo, email e período do mandato',
      'Defina se é membro independente (quando aplicável)',
      'Salve o membro'
    ],
    tips: [
      'Membros independentes são importantes para compliance e boas práticas',
      'O período de mandato ajuda no controle de renovações',
      'Emails são usados para envio de convocações e materiais'
    ],
    relatedModules: ['Configuração de Governança', 'Gestão de Pessoas'],
    route: '/governance-config',
    icon: 'Users'
  },
  {
    id: 'governance-documents',
    module: 'Documentos do Órgão',
    category: 'parametrizacao',
    title: 'Upload de documentos dos órgãos',
    keywords: ['documento', 'upload', 'arquivo', 'regimento', 'estatuto', 'ata', 'órgão'],
    shortDescription: 'Faça upload de regimentos internos, estatutos e outros documentos específicos de cada órgão de governança.',
    howTo: [
      'Acesse "Configuração de Governança"',
      'Localize o órgão desejado',
      'Na seção "Documentos do Órgão", clique em "Upload"',
      'Selecione o tipo de documento: ATA, Regimento, Contrato, etc.',
      'Escolha o arquivo e faça o upload',
      'O documento ficará vinculado ao órgão'
    ],
    tips: [
      'Organize documentos por tipo para facilitar a busca',
      'Regimentos e estatutos devem estar sempre atualizados',
      'ATAs são geradas automaticamente após as reuniões'
    ],
    relatedModules: ['Checklist de Documentos', 'Biblioteca'],
    route: '/governance-config',
    icon: 'FileUp'
  },
  {
    id: 'maturity-assessment',
    module: 'Maturidade de Governança',
    category: 'parametrizacao',
    title: 'Como fazer avaliação de maturidade',
    keywords: ['maturidade', 'avaliação', 'assessment', 'questionário', 'diagnóstico', 'nível'],
    shortDescription: 'Realize a avaliação de maturidade de governança para identificar o nível atual e gaps a serem trabalhados.',
    howTo: [
      'Acesse "Maturidade de Governança" no menu Parametrização',
      'Clique na aba "Nova Avaliação"',
      'Responda às perguntas de cada dimensão',
      'O sistema calcula automaticamente o nível de maturidade',
      'Visualize os resultados no gráfico radar e timeline'
    ],
    tips: [
      'Faça avaliações periódicas (anual ou semestral) para acompanhar evolução',
      'Compare com benchmarks do setor na aba de resultados',
      'Use os insights gerados para criar planos de ação'
    ],
    relatedModules: ['Dashboard Executivo', 'Relatório Inicial'],
    route: '/maturity',
    icon: 'Target'
  },
  {
    id: 'maturity-history',
    module: 'Histórico de Maturidade',
    category: 'parametrizacao',
    title: 'Acompanhando evolução da maturidade',
    keywords: ['histórico', 'evolução', 'progresso', 'timeline', 'comparativo'],
    shortDescription: 'Visualize a evolução da maturidade de governança ao longo do tempo com gráficos e comparativos.',
    howTo: [
      'Acesse "Maturidade de Governança"',
      'Na aba "Maturidade e Histórico", veja o gráfico radar atual',
      'Role para ver o "Gráfico de Evolução" com a linha do tempo',
      'A tabela histórica mostra todas as avaliações realizadas',
      'Compare dimensões entre diferentes períodos'
    ],
    tips: [
      'O gráfico de evolução mostra tendências de melhoria ou regressão',
      'Exporte relatórios para apresentações ao conselho'
    ],
    relatedModules: ['Maturidade de Governança', 'Benchmarking'],
    route: '/maturity',
    icon: 'TrendingUp'
  },
  {
    id: 'governance-quorum',
    module: 'Quórum e Níveis',
    category: 'parametrizacao',
    title: 'Configurando quórum e hierarquia',
    keywords: ['quórum', 'nível', 'hierarquia', 'votação', 'deliberação', 'mínimo'],
    shortDescription: 'Defina o quórum mínimo para deliberações e a hierarquia entre os órgãos de governança.',
    howTo: [
      'Acesse "Configuração de Governança"',
      'Edite o órgão desejado',
      'Defina o quórum mínimo (número de membros)',
      'Defina o nível hierárquico (1 = mais alto)',
      'Salve as alterações'
    ],
    tips: [
      'Quórum insuficiente invalida deliberações',
      'A hierarquia define fluxo de aprovações e escalações',
      'Órgãos de nível 1 geralmente são deliberativos'
    ],
    relatedModules: ['Configuração de Governança', 'Agenda Anual'],
    route: '/governance-config',
    icon: 'Settings'
  },

  // ==================== PREPARAÇÃO ====================
  {
    id: 'checklist-overview',
    module: 'Checklist de Documentos',
    category: 'preparacao',
    title: 'Usando o checklist de documentos',
    keywords: ['checklist', 'documento', 'lista', 'verificação', 'conformidade', 'obrigatório'],
    shortDescription: 'O checklist de documentos ajuda a verificar se todos os documentos societários obrigatórios estão em conformidade.',
    howTo: [
      'Acesse "Checklist de Documentos" no menu Preparação',
      'Visualize as categorias: Societário, Governança, Compliance, etc.',
      'Para cada documento, marque o status: Conforme, Pendente ou Divergente',
      'Use os cards de progresso para acompanhar a completude',
      'A IA sugere ações para documentos divergentes'
    ],
    tips: [
      'Documentos divergentes aparecem destacados em vermelho',
      'O card "Sugestões IA" oferece recomendações automáticas',
      'Exporte o relatório de conformidade para auditorias'
    ],
    relatedModules: ['Biblioteca', 'Relatório Inicial'],
    route: '/document-checklist',
    icon: 'CheckSquare'
  },
  {
    id: 'library-upload',
    module: 'Biblioteca de Documentos',
    category: 'preparacao',
    title: 'Upload de documentos na biblioteca',
    keywords: ['biblioteca', 'upload', 'arquivo', 'armazenar', 'guardar', 'pdf'],
    shortDescription: 'Faça upload e organize todos os documentos corporativos na biblioteca centralizada.',
    howTo: [
      'Acesse "Checklist de Documentos"',
      'Clique na aba "Biblioteca"',
      'Use "Upload por Categoria" para enviar novos documentos',
      'Selecione a categoria apropriada',
      'Arraste o arquivo ou clique para selecionar',
      'O documento será analisado automaticamente pela IA'
    ],
    tips: [
      'Documentos personalizados vão para a categoria "Documentos Personalizados"',
      'A análise de IA verifica conformidade e extrai informações chave',
      'Formatos suportados: PDF, DOCX, XLSX, PPTX'
    ],
    relatedModules: ['Checklist de Documentos', 'Análise de Documentos'],
    route: '/document-checklist?tab=biblioteca',
    icon: 'FolderOpen'
  },
  {
    id: 'document-analysis',
    module: 'Análise de Documentos',
    category: 'preparacao',
    title: 'Analisando conformidade de documentos',
    keywords: ['análise', 'conformidade', 'revisar', 'verificar', 'ia', 'automática'],
    shortDescription: 'A IA analisa automaticamente os documentos enviados, identificando problemas e sugerindo correções.',
    howTo: [
      'Acesse "Checklist de Documentos"',
      'Vá para aba "Biblioteca" > "Análises"',
      'Visualize os cards de resumo: Conformes, Aguardando, Requerem Atenção',
      'Clique em "Ver Análise" em qualquer documento',
      'O modal exibe resumo, problemas identificados e recomendações'
    ],
    tips: [
      'Documentos com problemas críticos aparecem destacados',
      'A análise considera requisitos legais e boas práticas',
      'Revise e atualize documentos divergentes regularmente'
    ],
    relatedModules: ['Checklist de Documentos', 'Biblioteca'],
    route: '/document-checklist?tab=biblioteca',
    icon: 'FileSearch'
  },
  {
    id: 'custom-upload',
    module: 'Documentos Personalizados',
    category: 'preparacao',
    title: 'Enviando documentos fora do checklist',
    keywords: ['personalizado', 'custom', 'extra', 'adicional', 'outro documento'],
    shortDescription: 'Envie documentos que não estão no checklist padrão, como contratos específicos ou políticas internas.',
    howTo: [
      'Acesse "Checklist de Documentos"',
      'Na aba "Biblioteca", clique em "Upload Documento Personalizado"',
      'Preencha o nome e selecione uma categoria',
      'Faça o upload do arquivo',
      'O documento será adicionado à biblioteca e analisado'
    ],
    tips: [
      'Documentos personalizados são registrados no log de auditoria',
      'Use para políticas específicas da empresa não previstas no checklist'
    ],
    relatedModules: ['Biblioteca', 'Checklist de Documentos'],
    route: '/document-checklist?tab=biblioteca',
    icon: 'FilePlus'
  },

  // ==================== ESTRUTURAÇÃO ====================
  {
    id: 'annual-agenda-create',
    module: 'Agenda Anual',
    category: 'estruturacao',
    title: 'Como criar uma reunião',
    keywords: ['reunião', 'criar', 'agendar', 'nova', 'marcar', 'calendário', 'meeting'],
    shortDescription: 'Crie reuniões para conselhos, comitês e comissões com data, participantes e pautas definidas.',
    howTo: [
      'Acesse "Agenda Anual" no menu Estruturação',
      'Clique em "Nova Reunião" no canto superior direito',
      'Selecione o órgão de governança (Conselho, Comitê, etc.)',
      'Defina data, horário e local/link',
      'Adicione participantes da lista do órgão',
      'Defina as pautas da reunião',
      'Salve para criar a reunião'
    ],
    tips: [
      'Participantes recebem convocação automática por email',
      'Use a opção "Híbrida" para reuniões presenciais com participação remota',
      'Pautas podem ser reordenadas arrastando'
    ],
    relatedModules: ['Configuração de Governança', 'Painel de Secretariado'],
    route: '/annual-agenda',
    icon: 'CalendarPlus'
  },
  {
    id: 'annual-agenda-items',
    module: 'Pautas de Reunião',
    category: 'estruturacao',
    title: 'Como definir pautas da reunião',
    keywords: ['pauta', 'agenda', 'item', 'assunto', 'tópico', 'discussão'],
    shortDescription: 'Defina os itens de pauta que serão discutidos na reunião, com tempo estimado e apresentador.',
    howTo: [
      'Ao criar ou editar uma reunião, acesse a seção "Pautas"',
      'Clique em "Adicionar Pauta"',
      'Preencha: Título, Descrição, Tempo estimado, Apresentador',
      'Defina o tipo: Informativo, Deliberativo ou Aprovação',
      'Marque como "Sensível" se for item confidencial',
      'Reordene as pautas arrastando se necessário'
    ],
    tips: [
      'Pautas sensíveis são visíveis apenas para membros autorizados',
      'O tempo total estimado ajuda no planejamento da reunião',
      'Itens deliberativos exigem quórum para votação'
    ],
    relatedModules: ['Agenda Anual', 'Materiais de Reunião'],
    route: '/annual-agenda',
    icon: 'ListOrdered'
  },
  {
    id: 'annual-agenda-participants',
    module: 'Participantes',
    category: 'estruturacao',
    title: 'Convidando participantes para reunião',
    keywords: ['participante', 'convidar', 'convidado', 'externo', 'convocação'],
    shortDescription: 'Adicione membros do órgão e convidados externos às reuniões com permissões específicas.',
    howTo: [
      'Na criação/edição da reunião, acesse "Participantes"',
      'Membros do órgão aparecem automaticamente',
      'Para convidados externos, clique em "Adicionar Convidado"',
      'Preencha nome, email e cargo',
      'Defina permissões: visualizar materiais, fazer upload, comentar',
      'Convidados recebem link de acesso por email'
    ],
    tips: [
      'Convidados externos precisam aceitar termo de confidencialidade',
      'Permissões podem ser diferentes por item de pauta',
      'O sistema registra quem visualizou cada documento'
    ],
    relatedModules: ['Agenda Anual', 'Acesso de Convidados'],
    route: '/annual-agenda',
    icon: 'UserPlus'
  },
  {
    id: 'annual-agenda-filter',
    module: 'Filtros de Agenda',
    category: 'estruturacao',
    title: 'Filtrando reuniões por status',
    keywords: ['filtro', 'status', 'pendente', 'aprovação', 'assinatura', 'buscar'],
    shortDescription: 'Use filtros para visualizar reuniões por status: agendadas, pendentes de ATA, aguardando aprovação ou assinatura.',
    howTo: [
      'Na Agenda Anual, localize os filtros acima do calendário',
      'Selecione o status desejado: Agendada, Realizada, etc.',
      'Use "Aguardando Aprovação" para ver ATAs pendentes de aprovação',
      'Use "Aguardando Assinatura" para ATAs prontas para assinar',
      'O calendário atualiza mostrando apenas as reuniões filtradas'
    ],
    tips: [
      'Badges coloridos indicam o status visual no calendário',
      'Combine filtros com seleção de órgão específico',
      'O Dashboard tem atalhos diretos para filtros comuns'
    ],
    relatedModules: ['Agenda Anual', 'Painel de Secretariado'],
    route: '/annual-agenda',
    icon: 'Filter'
  },
  {
    id: 'initial-report',
    module: 'Relatório Inicial',
    category: 'estruturacao',
    title: 'Gerando o relatório inicial',
    keywords: ['relatório', 'inicial', 'diagnóstico', 'resumo', 'executivo', 'overview'],
    shortDescription: 'O Relatório Inicial consolida o diagnóstico de governança com base em documentos, entrevistas e avaliações.',
    howTo: [
      'Acesse "Relatório Inicial" no menu Estruturação',
      'Visualize o Resumo Executivo com percentuais de completude',
      'Veja o status do checklist de documentos',
      'Acompanhe as entrevistas realizadas e alinhamento',
      'Exporte o relatório em PDF para apresentação'
    ],
    tips: [
      'O relatório é atualizado automaticamente conforme você completa etapas',
      'Use como base para reunião de kick-off com o conselho'
    ],
    relatedModules: ['Checklist de Documentos', 'Maturidade de Governança'],
    route: '/initial-report',
    icon: 'FileText'
  },

  // ==================== DESENVOLVIMENTO ====================
  {
    id: 'people-management',
    module: 'Gestão de Pessoas',
    category: 'desenvolvimento',
    title: 'Gerenciando pessoas na governança',
    keywords: ['pessoa', 'gestão', 'colaborador', 'cargo', 'função', 'rh'],
    shortDescription: 'Gerencie todas as pessoas envolvidas na governança: conselheiros, diretores, sucessores e key positions.',
    howTo: [
      'Acesse "Gestão de Pessoas" no menu Desenvolvimento',
      'Visualize o cadastro geral de pessoas',
      'Filtre por tipo: Conselheiro, Diretor, Herdeiro, etc.',
      'Clique em uma pessoa para ver detalhes e histórico',
      'Adicione novas pessoas com "Novo Cadastro"'
    ],
    tips: [
      'Pessoas cadastradas podem ser alocadas em múltiplos órgãos',
      'O histórico mostra participação em reuniões e mandatos'
    ],
    relatedModules: ['PDI', 'Configuração de Governança'],
    route: '/people-management',
    icon: 'Users'
  },
  {
    id: 'pdi-management',
    module: 'PDI - Plano de Desenvolvimento',
    category: 'desenvolvimento',
    title: 'Criando planos de desenvolvimento',
    keywords: ['pdi', 'desenvolvimento', 'plano', 'capacitação', 'treinamento', 'competência'],
    shortDescription: 'Crie e acompanhe Planos de Desenvolvimento Individual para membros de governança.',
    howTo: [
      'Acesse "PDI" no menu Desenvolvimento',
      'Selecione a pessoa para criar o PDI',
      'Defina competências a desenvolver',
      'Estabeleça metas e prazos',
      'Adicione ações de desenvolvimento (cursos, mentorias, etc.)',
      'Acompanhe o progresso periodicamente'
    ],
    tips: [
      'PDIs são importantes para sucessão de lideranças',
      'Vincule competências às necessidades do órgão de governança'
    ],
    relatedModules: ['Gestão de Pessoas', 'Sucessão'],
    route: '/pdi',
    icon: 'GraduationCap'
  },
  {
    id: 'corporate-structure',
    module: 'Estrutura Societária',
    category: 'desenvolvimento',
    title: 'Visualizando estrutura societária',
    keywords: ['estrutura', 'societária', 'organograma', 'empresa', 'holding', 'subsidiária'],
    shortDescription: 'Visualize e gerencie a estrutura societária com holdings, subsidiárias e participações.',
    howTo: [
      'Acesse "Estrutura Societária" no menu Desenvolvimento',
      'Visualize o organograma hierárquico',
      'Clique em cada entidade para ver detalhes',
      'Veja participações acionárias e vínculos',
      'Edite informações de cada empresa do grupo'
    ],
    tips: [
      'A estrutura é importante para entender fluxo de decisões',
      'Mantenha atualizada para compliance e due diligence'
    ],
    relatedModules: ['Cap Table', 'Configuração de Governança'],
    route: '/shareholder-structure',
    icon: 'Network'
  },
  {
    id: 'cap-table',
    module: 'Cap Table',
    category: 'desenvolvimento',
    title: 'Gerenciando Cap Table',
    keywords: ['cap table', 'acionista', 'participação', 'equity', 'sócio', 'quotas'],
    shortDescription: 'Gerencie a tabela de capitalização com todos os acionistas, classes de ações e participações.',
    howTo: [
      'Acesse "Cap Table" no menu Desenvolvimento',
      'Visualize a distribuição acionária atual',
      'Veja detalhes por classe de ação',
      'Adicione novos acionistas ou altere participações',
      'Acompanhe histórico de alterações'
    ],
    tips: [
      'Mantenha o Cap Table atualizado para rounds de investimento',
      'Use para simular cenários de diluição'
    ],
    relatedModules: ['Estrutura Societária', 'Investidores'],
    route: '/cap-table',
    icon: 'PieChart'
  },
  {
    id: 'legacy-rituals',
    module: 'Legado e Rituais',
    category: 'desenvolvimento',
    title: 'Documentando legado e rituais',
    keywords: ['legado', 'ritual', 'tradição', 'família', 'história', 'valores'],
    shortDescription: 'Documente o legado familiar, valores, rituais e tradições que devem ser preservados na governança.',
    howTo: [
      'Acesse "Legado e Rituais" no menu Desenvolvimento',
      'Documente a história da família empresária',
      'Registre valores e princípios fundamentais',
      'Adicione rituais e tradições importantes',
      'Vincule ao protocolo familiar se existir'
    ],
    tips: [
      'O legado ajuda na coesão familiar em empresas familiares',
      'Rituais bem documentados facilitam a sucessão'
    ],
    relatedModules: ['Sucessão', 'Herdeiros'],
    route: '/legacy',
    icon: 'History'
  },

  // ==================== MONITORAMENTO ====================
  {
    id: 'secretariat-overview',
    module: 'Painel de Secretariado',
    category: 'monitoramento',
    title: 'Usando o painel de secretariado',
    keywords: ['secretariado', 'painel', 'tarefas', 'pendências', 'gestão', 'operacional'],
    shortDescription: 'O Painel de Secretariado é sua central operacional para gerenciar tarefas, ATAs e pendências de reuniões.',
    howTo: [
      'Acesse "Painel de Secretariado" no menu Monitoramento',
      'Visualize KPIs: Tarefas criadas, resolvidas, pendentes, taxa de resolução',
      'Use os gráficos para análise: Status por tipo, Tarefas por órgão',
      'Filtre tarefas por status, órgão, prioridade ou data',
      'Clique em uma tarefa para ver detalhes e enviar alertas'
    ],
    tips: [
      'A Visão Gerencial mostra KPIs executivos',
      'A Visão Estratégica traz análises e tendências',
      'A Visão Operacional é para gestão do dia a dia'
    ],
    relatedModules: ['Agenda Anual', 'Gestão de Tarefas'],
    route: '/secretariat',
    icon: 'Briefcase'
  },
  {
    id: 'task-management',
    module: 'Gestão de Tarefas',
    category: 'monitoramento',
    title: 'Gerenciando tarefas pendentes',
    keywords: ['tarefa', 'pendente', 'pendência', 'ação', 'responsável', 'prazo'],
    shortDescription: 'Gerencie todas as tarefas geradas em reuniões, atribua responsáveis e acompanhe prazos.',
    howTo: [
      'No Painel de Secretariado, veja a lista de tarefas',
      'Filtre por status: Pendentes, Em andamento, Atrasadas, Resolvidas',
      'Clique em uma tarefa para abrir detalhes',
      'Atribua ou altere o responsável',
      'Envie alertas por email ou WhatsApp',
      'Marque como concluída quando finalizada'
    ],
    tips: [
      'Tarefas atrasadas aparecem em vermelho',
      'O responsável recebe um link mágico para atualizar a tarefa',
      'Use relatórios para apresentar status ao conselho'
    ],
    relatedModules: ['Painel de Secretariado', 'Alertas'],
    route: '/secretariat',
    icon: 'ListTodo'
  },
  {
    id: 'ata-generation',
    module: 'Geração de ATA',
    category: 'monitoramento',
    title: 'Como gerar ATA após reunião',
    keywords: ['ata', 'gerar', 'minuta', 'reunião', 'deliberação', 'registro'],
    shortDescription: 'Gere a ATA (ata de reunião) após a realização da reunião com registro de deliberações e encaminhamentos.',
    howTo: [
      'Após a reunião, acesse-a na Agenda Anual',
      'Clique em "Gerar ATA"',
      'A IA preenche automaticamente com base nas pautas',
      'Revise e edite o conteúdo se necessário',
      'Adicione deliberações e votos',
      'Salve a ATA para enviar à aprovação'
    ],
    tips: [
      'A ATA pode ser gerada a partir de transcrição de áudio',
      'Deliberações devem registrar quem votou e como',
      'Após aprovação, a ATA vai para assinatura eletrônica'
    ],
    relatedModules: ['Agenda Anual', 'Aprovação de ATA'],
    route: '/annual-agenda',
    icon: 'FileSignature'
  },
  {
    id: 'ata-approval',
    module: 'Aprovação de ATA',
    category: 'monitoramento',
    title: 'Fluxo de aprovação de ATAs',
    keywords: ['aprovação', 'ata', 'aprovar', 'revisar', 'rejeitar', 'membro'],
    shortDescription: 'Envie ATAs para aprovação dos membros participantes da reunião antes da assinatura eletrônica.',
    howTo: [
      'Após gerar a ATA, clique em "Enviar para Aprovação"',
      'Todos os participantes recebem link por email',
      'Cada membro pode: Aprovar, Solicitar revisão ou Rejeitar',
      'Acompanhe o status de cada aprovação',
      'Com todas as aprovações, a ATA vai para assinatura'
    ],
    tips: [
      'Membros podem adicionar comentários na aprovação',
      'Solicitações de revisão voltam para o secretário',
      'O prazo padrão de aprovação é configurável'
    ],
    relatedModules: ['Geração de ATA', 'Assinatura Eletrônica'],
    route: '/ata-approval',
    icon: 'CheckCircle'
  },
  {
    id: 'electronic-signature',
    module: 'Assinatura Eletrônica',
    category: 'monitoramento',
    title: 'Assinando ATAs eletronicamente',
    keywords: ['assinatura', 'eletrônica', 'digital', 'assinar', 'certificado'],
    shortDescription: 'Após aprovação, membros assinam eletronicamente a ATA, finalizando o documento oficial.',
    howTo: [
      'Após todas as aprovações, a ATA vai para assinatura',
      'Membros recebem link para assinar',
      'Ao clicar, visualizam a ATA completa',
      'Confirmam a assinatura eletrônica',
      'O sistema registra: timestamp, IP, user agent',
      'Com todas as assinaturas, a ATA é finalizada'
    ],
    tips: [
      'A assinatura tem validade jurídica',
      'O PDF final inclui página de assinaturas',
      'ATAs finalizadas são arquivadas automaticamente'
    ],
    relatedModules: ['Aprovação de ATA', 'Biblioteca de ATAs'],
    route: '/ata-approval',
    icon: 'PenTool'
  },
  {
    id: 'task-alerts',
    module: 'Alertas de Tarefas',
    category: 'monitoramento',
    title: 'Enviando alertas aos responsáveis',
    keywords: ['alerta', 'email', 'whatsapp', 'notificar', 'lembrete', 'cobrança'],
    shortDescription: 'Envie alertas por email ou WhatsApp para responsáveis por tarefas pendentes ou atrasadas.',
    howTo: [
      'No Painel de Secretariado, clique em uma tarefa',
      'No modal de detalhes, veja os botões de alerta',
      'Clique em "Enviar Alerta por Email" ou "Enviar Alerta por WhatsApp"',
      'O responsável recebe a notificação com link de acesso',
      'Pelo link, ele pode ver a tarefa e marcar como concluída'
    ],
    tips: [
      'Alertas são registrados no log de auditoria',
      'Tarefas muito atrasadas podem ter alertas automáticos configurados',
      'O responsável não precisa ter login na plataforma'
    ],
    relatedModules: ['Gestão de Tarefas', 'Notificações'],
    route: '/secretariat',
    icon: 'Send'
  },
  {
    id: 'task-reports',
    module: 'Relatórios de Tarefas',
    category: 'monitoramento',
    title: 'Gerando relatórios de tarefas',
    keywords: ['relatório', 'report', 'pdf', 'exportar', 'imprimir', 'conselho'],
    shortDescription: 'Gere relatórios em PDF com o status das tarefas para apresentação em reuniões.',
    howTo: [
      'No Painel de Secretariado, clique em "Relatórios"',
      'Escolha o tipo: Todas Tarefas, por Conselho, Comitê, etc.',
      'Defina filtros se necessário (período, status)',
      'Visualize a prévia do relatório',
      'Clique em "Gerar PDF" para baixar',
      'Ou "Enviar para Responsáveis" para distribuir por email'
    ],
    tips: [
      'Relatórios são úteis para reuniões de follow-up',
      'O envio por email agrupa tarefas por responsável'
    ],
    relatedModules: ['Gestão de Tarefas', 'Painel de Secretariado'],
    route: '/secretariat',
    icon: 'FileBarChart'
  },
  {
    id: 'risk-management',
    module: 'Gestão de Riscos',
    category: 'monitoramento',
    title: 'Gerenciando riscos corporativos',
    keywords: ['risco', 'gestão', 'matriz', 'mitigação', 'crítico', 'probabilidade'],
    shortDescription: 'Identifique, avalie e mitigue riscos corporativos com matriz de probabilidade vs. impacto.',
    howTo: [
      'Acesse "Riscos" no menu Monitoramento',
      'Visualize a matriz de riscos (probabilidade x impacto)',
      'Adicione novos riscos identificados',
      'Classifique: probabilidade, impacto, categoria',
      'Defina planos de mitigação',
      'Acompanhe status e responsáveis'
    ],
    tips: [
      'Riscos críticos (alta probabilidade + alto impacto) exigem ação imediata',
      'Revise a matriz periodicamente com o conselho',
      'Vincule riscos a itens de pauta de reuniões'
    ],
    relatedModules: ['Inteligência de Mercado', 'Dashboard'],
    route: '/risks',
    icon: 'Shield'
  },

  // ==================== INTELIGÊNCIA DE MERCADO ====================
  {
    id: 'market-intelligence',
    module: 'Inteligência de Mercado',
    category: 'inteligencia',
    title: 'Usando inteligência de mercado',
    keywords: ['inteligência', 'mercado', 'análise', 'setor', 'tendência', 'oportunidade', 'ameaça'],
    shortDescription: 'Análise de mercado com identificação de ameaças, oportunidades, concorrentes e tendências do setor.',
    howTo: [
      'Acesse "Inteligência de Mercado" no menu lateral',
      'Configure o contexto: setor, segmento, concorrentes',
      'Clique em "Analisar Mercado"',
      'Visualize a matriz de ameaças vs. oportunidades',
      'Explore cards de concorrentes e tendências',
      'Crie pautas de reunião a partir dos insights'
    ],
    tips: [
      'Setores com dados de demonstração têm badge "Demo"',
      'Use os insights para pautas estratégicas no conselho',
      'A análise considera o contexto específico da empresa'
    ],
    relatedModules: ['Gestão de Riscos', 'Benchmarking'],
    route: '/market-intelligence',
    icon: 'TrendingUp'
  },
  {
    id: 'threat-opportunity',
    module: 'Matriz Ameaças/Oportunidades',
    category: 'inteligencia',
    title: 'Analisando ameaças e oportunidades',
    keywords: ['ameaça', 'oportunidade', 'swot', 'matriz', 'estratégia'],
    shortDescription: 'Visualize ameaças e oportunidades do mercado em matriz interativa com priorização.',
    howTo: [
      'Na Inteligência de Mercado, veja a matriz 2x2',
      'Ameaças aparecem à esquerda, oportunidades à direita',
      'Clique em cada item para ver detalhes',
      'Priorize com base em urgência e impacto',
      'Crie pauta de reunião diretamente do insight'
    ],
    tips: [
      'Ameaças de alta urgência devem ir ao conselho imediatamente',
      'Oportunidades têm janela de tempo indicada'
    ],
    relatedModules: ['Inteligência de Mercado', 'Agenda Anual'],
    route: '/market-intelligence',
    icon: 'Target'
  },
  {
    id: 'competitor-analysis',
    module: 'Análise de Concorrentes',
    category: 'inteligencia',
    title: 'Monitorando concorrentes',
    keywords: ['concorrente', 'competidor', 'análise', 'mercado', 'comparativo'],
    shortDescription: 'Monitore os principais concorrentes com análise de ameaças e posicionamento.',
    howTo: [
      'Na Inteligência de Mercado, veja a seção "Concorrentes"',
      'Cada card mostra um concorrente com nível de ameaça',
      'Veja pontos fortes e fracos de cada um',
      'Compare com a posição da sua empresa',
      'Use para definir estratégias competitivas'
    ],
    tips: [
      'Concorrentes com ameaça "Alta" merecem atenção especial',
      'Atualize a lista de concorrentes periodicamente'
    ],
    relatedModules: ['Inteligência de Mercado', 'Tendências do Setor'],
    route: '/market-intelligence',
    icon: 'Users'
  },
  {
    id: 'benchmarking',
    module: 'Benchmarking Global',
    category: 'inteligencia',
    title: 'Comparando com benchmarks do setor',
    keywords: ['benchmark', 'comparativo', 'setor', 'ranking', 'posição'],
    shortDescription: 'Compare a maturidade de governança da sua empresa com benchmarks do setor.',
    howTo: [
      'Acesse "Benchmarking Global" no menu Inteligência',
      'Visualize o indicador global de maturidade',
      'Compare sua posição no ranking do setor',
      'Veja dimensões acima e abaixo da média',
      'Identifique gaps para planos de melhoria'
    ],
    tips: [
      'O benchmark considera empresas do mesmo porte e setor',
      'Use os gaps identificados para priorizar ações'
    ],
    relatedModules: ['Maturidade de Governança', 'Inteligência de Mercado'],
    route: '/benchmarking',
    icon: 'BarChart3'
  },

  // ==================== ESG ====================
  {
    id: 'esg-assessment',
    module: 'Avaliação ESG',
    category: 'esg',
    title: 'Realizando avaliação de maturidade ESG',
    keywords: ['esg', 'avaliação', 'sustentabilidade', 'ambiental', 'social', 'governança'],
    shortDescription: 'Avalie a maturidade ESG da empresa nos pilares Ambiental, Social e Governança.',
    howTo: [
      'Acesse "Maturidade ESG" no menu ESG',
      'Clique na aba "Nova Avaliação"',
      'Responda as 90 perguntas nos 3 pilares',
      'O sistema calcula scores por pilar e geral',
      'Visualize resultados no dashboard ESG'
    ],
    tips: [
      'A avaliação ESG é importante para investidores e stakeholders',
      'Faça avaliações anuais para acompanhar evolução',
      'Exporte relatórios para reports de sustentabilidade'
    ],
    relatedModules: ['Dashboard ESG', 'Indicadores ESG'],
    route: '/esg?tab=new-assessment',
    icon: 'Leaf'
  },
  {
    id: 'esg-dashboard',
    module: 'Dashboard ESG',
    category: 'esg',
    title: 'Entendendo o dashboard ESG',
    keywords: ['dashboard', 'esg', 'indicador', 'pilar', 'score', 'resultado'],
    shortDescription: 'Visualize scores ESG, evolução histórica e comparativos em dashboard consolidado.',
    howTo: [
      'Acesse "Maturidade ESG" no menu ESG',
      'O dashboard mostra scores dos 3 pilares',
      'Veja gráficos de evolução temporal',
      'Compare com benchmarks do setor',
      'Navegue pelas abas: Indicadores, Políticas, Benchmark, Relatórios'
    ],
    tips: [
      'Scores baixos indicam áreas prioritárias para melhoria',
      'O pilar com menor score deve receber mais atenção'
    ],
    relatedModules: ['Avaliação ESG', 'Relatórios ESG'],
    route: '/esg',
    icon: 'BarChart'
  },
  {
    id: 'esg-indicators',
    module: 'Indicadores ESG',
    category: 'esg',
    title: 'Gerenciando indicadores ESG',
    keywords: ['indicador', 'métrica', 'kpi', 'esg', 'mensurar', 'acompanhar'],
    shortDescription: 'Defina e acompanhe indicadores ESG específicos como emissões, diversidade, compliance.',
    howTo: [
      'No dashboard ESG, acesse a aba "Indicadores"',
      'Visualize indicadores por pilar: E, S, G',
      'Clique em cada indicador para ver histórico',
      'Adicione novos indicadores personalizados',
      'Defina metas e acompanhe progresso'
    ],
    tips: [
      'Indicadores devem ser mensuráveis e com fontes definidas',
      'Atualize periodicamente para relatórios precisos'
    ],
    relatedModules: ['Dashboard ESG', 'Políticas ESG'],
    route: '/esg',
    icon: 'Activity'
  },
  {
    id: 'esg-reports',
    module: 'Relatórios ESG',
    category: 'esg',
    title: 'Gerando relatórios ESG',
    keywords: ['relatório', 'esg', 'sustentabilidade', 'gri', 'sasb', 'exportar'],
    shortDescription: 'Gere relatórios ESG nos padrões GRI, SASB ou formato customizado para stakeholders.',
    howTo: [
      'No dashboard ESG, acesse a aba "Relatórios"',
      'Selecione o formato: GRI, SASB ou Customizado',
      'Defina o período do relatório',
      'O sistema consolida dados automaticamente',
      'Revise e exporte em PDF ou Word'
    ],
    tips: [
      'Relatórios GRI são padrão internacional de sustentabilidade',
      'SASB é focado em materialidade por setor',
      'Use para comunicação com investidores e mercado'
    ],
    relatedModules: ['Dashboard ESG', 'Indicadores ESG'],
    route: '/esg',
    icon: 'FileSpreadsheet'
  },

  // ==================== PORTAL DO MEMBRO ====================
  {
    id: 'member-dashboard',
    module: 'Portal do Membro',
    category: 'member',
    title: 'Dashboard do Membro',
    keywords: ['membro', 'conselheiro', 'portal', 'dashboard', 'member', 'painel'],
    shortDescription: 'O Dashboard do Membro é sua central pessoal de governança, mostrando reuniões, ATAs pendentes, tarefas e órgãos.',
    howTo: [
      'Acesse o Portal do Membro após o login como membro/conselheiro',
      'Visualize os 4 cards principais: Reuniões, ATAs, Pendências e Órgãos',
      'Clique em qualquer card para acessar detalhes',
      'Use o menu lateral para navegar entre seções'
    ],
    tips: [
      'Cards com badges vermelhos indicam itens urgentes',
      'O sino de notificações no topo mostra alertas importantes'
    ],
    relatedModules: ['Maturidade do Membro', 'Reuniões do Membro'],
    route: '/member-portal',
    icon: 'LayoutDashboard'
  },
  {
    id: 'member-maturity',
    module: 'Maturidade do Membro',
    category: 'member',
    title: 'Visualizando Maturidade de Governança',
    keywords: ['maturidade', 'membro', 'governança', 'riscos', 'indicadores', 'pilares'],
    shortDescription: 'Visualize os indicadores de maturidade de governança e gestão de riscos da sua empresa.',
    howTo: [
      'Acesse "Maturidade" no menu lateral do Portal do Membro',
      'Visualize os KPIs de Gestão de Riscos no card superior',
      'Acompanhe as barras de progresso dos 5 pilares IBGC',
      'Clique em "Ver Detalhes" para análise completa'
    ],
    tips: [
      'Os pilares IBGC são: Sócios, Conselho, Diretoria, Fiscalização e Conduta',
      'Riscos críticos aparecem destacados em vermelho'
    ],
    relatedModules: ['Portal do Membro', 'Reuniões do Membro'],
    route: '/member-portal/maturidade',
    icon: 'BarChart3'
  },
  {
    id: 'member-meetings',
    module: 'Reuniões do Membro',
    category: 'member',
    title: 'Próximas Reuniões',
    keywords: ['reunião', 'membro', 'próxima', 'agenda', 'convocação', 'pauta'],
    shortDescription: 'Visualize suas próximas reuniões, pautas e materiais de apoio.',
    howTo: [
      'Acesse "Próximas Reuniões" no menu lateral',
      'Veja a lista de reuniões agendadas para seus órgãos',
      'Clique em "Ver Pauta" para ver os itens da reunião',
      'Acesse "Materiais" para baixar documentos de apoio'
    ],
    tips: [
      'Confirme presença nas reuniões clicando no botão apropriado',
      'Materiais são disponibilizados com antecedência'
    ],
    relatedModules: ['Portal do Membro', 'ATAs do Membro'],
    route: '/member-portal/reunioes',
    icon: 'CalendarDays'
  },
  {
    id: 'member-atas',
    module: 'ATAs do Membro',
    category: 'member',
    title: 'ATAs Pendentes de Ação',
    keywords: ['ata', 'membro', 'aprovação', 'assinatura', 'pendente', 'minuta'],
    shortDescription: 'Visualize e aprove ATAs das reuniões, assine eletronicamente documentos pendentes.',
    howTo: [
      'Acesse "ATAs Pendentes" no menu lateral',
      'Visualize ATAs aguardando sua aprovação ou assinatura',
      'Clique em "Visualizar ATA" para ler o conteúdo completo',
      'Use os botões para aprovar, solicitar revisão ou assinar'
    ],
    tips: [
      'ATAs urgentes aparecem com badge em destaque',
      'A assinatura eletrônica tem validade jurídica'
    ],
    relatedModules: ['Reuniões do Membro', 'Portal do Membro'],
    route: '/member-portal/atas',
    icon: 'FileText'
  },
  {
    id: 'member-tasks',
    module: 'Pendências do Membro',
    category: 'member',
    title: 'Minhas Pendências',
    keywords: ['pendência', 'tarefa', 'membro', 'responsável', 'prazo', 'ação'],
    shortDescription: 'Visualize e gerencie tarefas atribuídas a você originadas das reuniões de governança.',
    howTo: [
      'Acesse "Minhas Pendências" no menu lateral',
      'Veja tarefas ordenadas por urgência (atrasadas primeiro)',
      'Clique em uma tarefa para ver detalhes completos',
      'Marque como resolvida quando concluir'
    ],
    tips: [
      'Tarefas atrasadas aparecem em vermelho',
      'Tarefas próximas do prazo aparecem em amarelo'
    ],
    relatedModules: ['Portal do Membro', 'Reuniões do Membro'],
    route: '/member-portal/pendencias',
    icon: 'AlertTriangle'
  },
  {
    id: 'member-organs',
    module: 'Órgãos do Membro',
    category: 'member',
    title: 'Meus Órgãos de Governança',
    keywords: ['órgão', 'conselho', 'comitê', 'comissão', 'membro', 'participação'],
    shortDescription: 'Visualize os órgãos de governança dos quais você participa como membro.',
    howTo: [
      'Acesse "Meus Órgãos" no menu lateral',
      'Veja a lista de conselhos, comitês e comissões',
      'Visualize seu papel e mandato em cada órgão',
      'Acesse informações de outros membros do órgão'
    ],
    tips: [
      'O período de mandato é exibido para cada participação',
      'Você pode ter diferentes papéis em diferentes órgãos'
    ],
    relatedModules: ['Portal do Membro', 'Reuniões do Membro'],
    route: '/member-portal/orgaos',
    icon: 'Building2'
  }
];

// Função de busca inteligente
export function searchGuides(query: string): GuideEntry[] {
  if (!query.trim()) return [];
  
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  const scored = legacyGuideData.map(entry => {
    let score = 0;
    
    // Título exato
    if (entry.title.toLowerCase().includes(queryLower)) score += 50;
    
    // Módulo exato
    if (entry.module.toLowerCase().includes(queryLower)) score += 40;
    
    // Keywords
    entry.keywords.forEach(keyword => {
      if (queryLower.includes(keyword.toLowerCase())) score += 30;
      queryWords.forEach(word => {
        if (keyword.toLowerCase().includes(word)) score += 15;
      });
    });
    
    // Descrição
    if (entry.shortDescription.toLowerCase().includes(queryLower)) score += 20;
    queryWords.forEach(word => {
      if (entry.shortDescription.toLowerCase().includes(word)) score += 5;
    });
    
    return { ...entry, score };
  });
  
  return scored
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// Categorias para exibição
export const categoryLabels: Record<string, string> = {
  inicio: 'Início',
  parametrizacao: 'Parametrização',
  preparacao: 'Preparação',
  estruturacao: 'Estruturação',
  desenvolvimento: 'Desenvolvimento',
  monitoramento: 'Monitoramento',
  inteligencia: 'Inteligência de Mercado',
  esg: 'ESG',
  member: 'Portal do Membro'
};

// Quick actions padrão
export const quickActions = [
  { label: 'Por onde começar?', query: 'primeiros passos começar' },
  { label: 'Como criar uma reunião?', query: 'criar reunião agendar' },
  { label: 'Como gerar uma ATA?', query: 'gerar ata reunião' },
  { label: 'Como usar o Dashboard?', query: 'dashboard kpi métricas' },
  { label: 'Como configurar órgãos?', query: 'criar órgão conselho governança' }
];
