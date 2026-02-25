# Legacy OS

## O que é a Legacy OS

A **Legacy OS** é um **Sistema Operacional de Governança Corporativa** voltado a conselhos de administração, comitês, secretariado e famílias empresárias. Não é um board portal tradicional nem uma ferramenta apenas operacional: é infraestrutura decisória que combina gestão de governança com agentes de IA especializados para antecipar cenários, priorizar decisões e dar clareza estratégica.

**Legacy OS é:**
- Infraestrutura decisória para conselhos
- Sistema Operacional de Governança Corporativa
- IA que antecipa cenários e prioriza decisões
- Clareza estratégica em mundo complexo

**Legacy OS não é:**
- Ferramenta operacional ou board portal tradicional
- Software de produtividade apenas para secretariado
- Automação isolada de tarefas administrativas
- Mais uma ferramenta isolada no mercado

---

## Principais funções e módulos

### Núcleo (parametrização e estruturação)
- **Estrutura Familiar** – Cadastro da família, organograma e estrutura societária
- **Checklist de Documentos** – Gestão documental e protocolo familiar
- **Cap Table** – Estrutura acionária e participações
- **Maturidade de Governança** – Diagnóstico e evolução do nível de maturidade
- **Entrevistas** – Coleta de evidências para diagnóstico (entrevistas com stakeholders)
- **Config. de Governança** – Criação e gestão de conselhos, comitês e órgãos
- **Rituais** – Agendamento e organização de reuniões e rituais
- **Análise e Ações** – Acompanhamento de deliberações e ações
- **Agenda** – Agenda anual e pautas de reuniões
- **Secretariado** – Painel com indicadores, busca conversacional em ATAs e aprovação de documentos de convidados

### Add-ons e funcionalidades avançadas
- **Submeter Projetos** – Submissão e acompanhamento de projetos (Activities)
- **Desempenho do Conselho** – Métricas e avaliação do conselho
- **Riscos** – Riscos sistêmicos e planos de mitigação
- **Desenvolvimento e PDI** – Planos de desenvolvimento individual (módulo premium)
- **Maturidade ESG** – Avaliação e evolução ESG (módulo premium)
- **Inteligência de Mercado** – Sinais e tendências (módulo premium)
- **Benchmarking Global** – Comparativo com melhores práticas (módulo premium)
- **Agentes de IA** – Configuração e uso de agentes especializados (módulo premium)
- **Simulador de Cenários** – Cenários para planejamento (módulo premium)

### IA e copiloto
- **Copiloto de Governança** – Assistente conversacional para pautas, briefings e decisões
- **Agentes de IA** – Conciliação de sócios, estratégia de conselho, análise de tarefas, entre outros
- **Configuração de agentes** – Definição de prompts e integrações (admin e usuário)

### Área do membro (portal do conselheiro)
- Dashboard, maturidade, riscos, reuniões, pautas, atas pendentes, pendências, desempenho e configurações

### Administração
- Dashboard admin, empresas, finanças, configurações e configuração de agentes de IA

---

## Agentes de IA

Os agentes são módulos especializados que consomem prompts centralizados (`src/prompts-agentes/prompts.ts`) e processam entradas para produzir saídas estruturadas (atas, diagnósticos, briefings, etc.). Cada agente tem um identificador e uma função clara.

| Agente | ID | Função |
|--------|-----|--------|
| **Agente genérico** | `agente` | Ponto de extensão e orquestração; base para novos agentes |
| **ATA de reunião** | `agente-ata` | Gera ata formal a partir de transcrição ou notas (cabeçalho, deliberações, encaminhamentos) |
| **ATAs reuniões** | `agente-atas-reunioes` | Focado na produção do documento formal de ata |
| **Diagnóstico de governança** | `agente-diagnostico-governanca` | Analisa documentos e entrevistas; produz nível de maturidade, lacunas, pontos fortes e recomendações |
| **Sinais de mercado** | `agente-sinais-mercado` | Analisa ambiente externo (regulatório, setorial, ESG); impacto e recomendações |
| **Insights estratégicos** | `agente-insights-estrategicos` | Identifica riscos, ameaças e oportunidades a partir de indicadores e atas |
| **Processamento de documentos** | `agente-processamento-documentos` | Extrai texto, metadados e estrutura de documentos |
| **PDI Conselho** | `agente-pdi-conselho` | Elabora plano de desenvolvimento individual para conselheiros |
| **Histórico e padrões** | `agente-historico-padroes` | Analisa histórico de eventos; identifica padrões, tendências e alertas |
| **Prioridade de agenda** | `agente-prioridade-agenda` | Calcula prioridade de temas para agenda (urgência, impacto, alinhamento) |
| **Sugestões de pautas** | `agente-pautas-sugestoes` | Sugere pautas relevantes por tipo de reunião e conselho |
| **Briefing de pautas** | `agente-briefing-pautas` | Prepara briefings por pauta (contexto, pontos-chave, recomendações) |

Páginas de agentes específicos na aplicação (ex.: Conciliação de Sócios, Estratégia do Conselho, Análise de Tarefas) utilizam ou podem ser estendidas para usar esses agentes e os prompts correspondentes.

---

## Prompts centralizados

Os prompts ficam em **`src/prompts-agentes/prompts.ts`** e são usados por todos os agentes. Eles definem o papel do modelo (redator, consultor, analista, etc.), o formato da saída e as regras (linguagem formal, não inventar dados, citar evidências). Resumo por categoria:

### Atas e reuniões
- **ATA_REUNIAO** – Redação de ata formal (cabeçalho, resumo, deliberações, encaminhamentos)
- **ATA_RESUMIDA** – Versão resumida da ata (decisões em tópicos, uma página)
- **RESUMO_EXECUTIVO** – Resumo executivo de documento ou reunião
- **SINTESE_DOCUMENTOS** – Síntese unificada de múltiplos documentos

### Governança e diagnóstico
- **DIAGNOSTICO_GOVERNANCA** – Diagnóstico de maturidade, lacunas, pontos fortes e recomendações
- **BENCHMARKING_GOVERNANCA** – Comparativo com melhores práticas (IBGC, OECD, etc.)
- **MATURIDADE_ESG** – Maturidade por dimensão E, S e G e priorização de ações
- **ANALISE_COMPLIANCE** – Conformidade e lacunas com severidade e prazos

### Pautas e agenda
- **PRIORIDADE_AGENDA** – Score de prioridade dos temas para a reunião
- **SUGESTOES_PAUTAS** – Sugestão de pautas com fundamentação e tempo estimado
- **BRIEFING_PAUTAS** – Briefing por pauta (contexto, pontos-chave, recomendações)
- **AGENDA_PERSONALIZADA** – Agenda personalizada por perfil do membro
- **PERGUNTAS_REUNIAO** – Perguntas sugeridas por pauta (esclarecimento, aprofundamento, decisão)

### Análise e estratégia
- **SINAIS_MERCADO** – Análise de sinais externos (regulatório, setorial, ESG)
- **INSIGHTS_ESTRATEGICOS** – Riscos, ameaças e oportunidades com mitigação
- **HISTORICO_PADROES** – Padrões, tendências e alertas a partir do histórico
- **RELATORIO_CONSELHO** – Relatório para conselho (sumário, indicadores, riscos, recomendações)
- **CENARIOS_SIMULACAO** – Cenários (base, otimista, pessimista) e impactos

### Documentos e conteúdo
- **PROCESSAMENTO_DOCUMENTOS** – Extração de texto, metadados e estrutura
- **PDI_CONSELHO** – PDI para conselheiros (objetivos, ações, metas)
- **AVALIACAO_SUCESSAO** – Avaliação de prontidão e plano de sucessão
- **APROVACAO_CONVIDADOS** – Avaliação de convidados (pertinência, conflitos, recomendação)
- **BUSCA_CONVERSACIONAL_ATAS** – Respostas e trechos relevantes a partir de perguntas sobre atas
- **GLOSSARIO_GOVERNANCA** – Definições e contexto de termos de governança

---

## Stack e estrutura do projeto

- **Frontend:** React 18, TypeScript, Vite
- **UI:** Radix UI, Tailwind CSS, shadcn/ui
- **Roteamento:** React Router
- **Estado e dados:** TanStack Query (React Query)
- **Gráficos:** Recharts

Estrutura relevante:
- `src/pages/` – Páginas da aplicação (Dashboard, Secretariado, Copiloto, Agentes, etc.)
- `src/components/` – Componentes reutilizáveis e por domínio (landing, secretariado, planos, etc.)
- `src/agente-*/` – Implementações dos agentes (ata, diagnóstico, briefing, pautas, etc.)
- `src/agente/index.ts` – Agente genérico e tipos de orquestração
- `src/prompts-agentes/prompts.ts` – Prompts únicos utilizados por todos os agentes
- `src/hooks/useGovernanceProgress.ts` – Progresso por módulo (maturidade, próximas ações)
- `src/layouts/` – Layouts (ex.: área do membro)
- `src/lib/` – Utilitários e auth

---

## Como rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

---

## Próximos passos para colocação em produção

Este frontend está funcional com dados mock e autenticação simulada. Para colocar no ar com dados reais:

1. **Backend e banco** – Implementar API (REST ou GraphQL) e banco de dados; expor endpoints para empresas, usuários, contratos, parceiros, agentes, etc.
2. **Autenticação real** – Substituir o login atual (credenciais em `src/pages/Login.tsx` e tipo de usuário em `src/lib/auth.ts`) por fluxo real (ex.: JWT/OAuth) e validar permissões no backend.
3. **Substituir mocks por HTTP** – Trocar os dados em `src/data/*` (ex.: `partnersData.ts`, `contractsData.ts`) e demais mocks por chamadas à API; manter as mesmas interfaces/types onde possível.
4. **Variáveis de ambiente** – Criar `.env` (e `.env.example`) com URL da API e demais configs; usar no front (ex.: `import.meta.env.VITE_API_URL`); **remover credenciais do código**.

---

## Resumo

A Legacy OS reúne, em uma única plataforma, a gestão de estrutura familiar e societária, conselhos, documentos, agenda, secretariado e riscos, com agentes de IA que cobrem desde a redação de atas e briefings até diagnóstico de governança, sinais de mercado, insights estratégicos e busca conversacional em ATAs. Os prompts centralizados garantem consistência e controle de qualidade nas saídas geradas por IA, e a arquitetura de agentes permite estender ou integrar novos fluxos sem duplicar lógica.
