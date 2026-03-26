import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
}

// FAQs específicas por página para LLM discoverability
export const indexFAQs: FAQItem[] = [
  {
    question: "O que é o Legacy OS e como ele ajuda minha empresa?",
    answer: "O Legacy OS é uma plataforma completa de governança corporativa que integra gestão de conselhos, comitês, reuniões e processos decisórios. Com 13 módulos core e 14 agentes de IA especializados, automatizamos até 70% das tarefas operacionais, permitindo que líderes foquem em decisões estratégicas."
  },
  {
    question: "Como a Inteligência Artificial da plataforma funciona?",
    answer: "Nossa AI Engine conta com 14 agentes especializados que analisam documentos, geram atas automáticas, criam briefings personalizados, identificam riscos e oportunidades de mercado, e fornecem insights preditivos baseados em dados históricos e tendências do setor."
  },
  {
    question: "Quanto custa implementar o Legacy OS na minha empresa?",
    answer: "Os planos são personalizados de acordo com o porte e complexidade da sua estrutura de governança. Oferecemos desde o plano Essencial para empresas em fase inicial até o Enterprise para grupos com múltiplas empresas. Use nossa calculadora interativa para descobrir o investimento ideal."
  },
  {
    question: "Quais tipos de empresas utilizam a plataforma?",
    answer: "Atendemos empresas familiares, holdings, grupos empresariais, associações, ONGs, instituições financeiras, healthcare, educação superior, tecnologia e startups. Nossa plataforma se adapta a qualquer estrutura de governança."
  },
  {
    question: "O Legacy OS é seguro para dados confidenciais do conselho?",
    answer: "Sim. Utilizamos criptografia de ponta a ponta, controle granular de acesso, auditoria completa de ações, e estamos em conformidade com LGPD. Todos os dados são armazenados em servidores seguros com backup automático."
  }
];

export const plataformaFAQs: FAQItem[] = [
  {
    question: "Quais são os 13 módulos core incluídos na plataforma?",
    answer: "Os módulos incluem: Agenda Builder, Pauta Inteligente, Minutas Automáticas, Gestão de Decisões, Analytics de Reuniões, Dashboard Executivo, Biblioteca de Documentos, Assinaturas Eletrônicas, Gestão de Conselhos & Comitês, Gestão de Membros, Avaliação de Desempenho, Compliance & Auditoria, e Mensageiro Seguro."
  },
  {
    question: "Como funciona o ciclo completo de reuniões?",
    answer: "O ciclo abrange desde a criação da pauta com sugestões de IA, convocação automática de participantes, distribuição de materiais, realização da reunião com anotações em tempo real, geração automática de ata, registro de decisões e deliberações, até o acompanhamento de pendências."
  },
  {
    question: "Posso integrar o Legacy OS com outras ferramentas?",
    answer: "Sim. Oferecemos integrações com Microsoft 365, Google Workspace, sistemas de videoconferência (Zoom, Teams), além de APIs para integração com ERPs e sistemas internos da empresa."
  },
  {
    question: "É possível acessar a plataforma pelo celular?",
    answer: "Sim. A plataforma é totalmente responsiva e pode ser acessada via navegador em qualquer dispositivo. Conselheiros podem revisar materiais, aprovar documentos e acompanhar pendências diretamente pelo smartphone."
  },
  {
    question: "Como funciona o sistema de assinaturas eletrônicas?",
    answer: "Nosso sistema permite assinaturas eletrônicas com validade jurídica para atas, contratos e documentos. Os membros recebem notificação, assinam digitalmente e o documento fica arquivado com trilha de auditoria completa."
  }
];

export const governancaFAQs: FAQItem[] = [
  {
    question: "O que é governança integrada e como ela beneficia minha empresa?",
    answer: "Governança integrada significa ter todos os órgãos de governança (conselho, comitês, assembleia) conectados em uma única plataforma, com fluxos de trabalho automatizados, visibilidade total de decisões e compliance centralizado."
  },
  {
    question: "Como funcionam as votações e aprovações na plataforma?",
    answer: "As votações podem ser realizadas de forma presencial, remota ou assíncrona. O sistema registra votos, calcula quóruns automaticamente, gera relatórios de deliberação e mantém histórico completo para auditoria."
  },
  {
    question: "Quais frameworks de governança a plataforma suporta?",
    answer: "Suportamos os principais frameworks incluindo IBGC, CVM, B3, SOX, além de práticas específicas para empresas familiares, holdings e organizações do terceiro setor."
  },
  {
    question: "Como a plataforma ajuda na avaliação de desempenho do conselho?",
    answer: "Oferecemos avaliação 360° de conselheiros, com critérios personalizáveis, relatórios de competências, identificação de gaps e sugestões de desenvolvimento profissional geradas por IA."
  },
  {
    question: "É possível gerenciar múltiplas empresas em uma única plataforma?",
    answer: "Sim. O Legacy OS foi projetado para holdings e grupos empresariais, permitindo gestão consolidada de múltiplas empresas, conselhos e comitês com visão unificada de governança."
  }
];

export const aiEngineFAQs: FAQItem[] = [
  {
    question: "Quantos agentes de IA estão disponíveis e o que cada um faz?",
    answer: "São 14 agentes especializados: Análise de Documentos, Análise de Sentimento, Briefings Personalizados, Busca Semântica, Classificação Automática, Extração de Entidades, Geração de ATAs, Geração de PDI, Identificação de GAPs, Insights Preditivos, Inteligência de Mercado, OCR, Sugestões de Pauta e Monitoramento de Riscos."
  },
  {
    question: "Como funciona o monitoramento de riscos com IA?",
    answer: "O agente de riscos analisa dados internos e externos, identifica ameaças potenciais, monitora indicadores-chave e gera alertas proativos para o conselho tomar ações preventivas."
  },
  {
    question: "A IA da plataforma é segura para dados confidenciais?",
    answer: "Absolutamente. Nossos modelos de IA são executados em ambiente isolado, não compartilham dados entre clientes, e todo processamento segue rigorosos protocolos de segurança e privacidade."
  },
  {
    question: "Como os briefings personalizados são gerados?",
    answer: "O agente de briefings analisa o perfil de cada membro, os materiais da reunião, histórico de participação e contexto estratégico para criar resumos executivos personalizados antes de cada reunião."
  },
  {
    question: "É possível treinar a IA com dados específicos da minha empresa?",
    answer: "Sim. No plano Enterprise, oferecemos customização da IA com dados históricos da empresa, terminologia específica do setor e preferências de formato e estilo de relatórios."
  }
];

export const pricingFAQs: FAQItem[] = [
  {
    question: "Qual plano é ideal para minha empresa?",
    answer: "O plano ideal depende do porte da empresa, número de órgãos de governança e nível de maturidade. Use nossa calculadora interativa para receber uma recomendação personalizada baseada no seu perfil."
  },
  {
    question: "Os planos cobram por usuário?",
    answer: "Não! Todos os planos incluem usuários ilimitados. O preço é baseado na complexidade da estrutura de governança (número de empresas, conselhos, comitês) e não no número de usuários."
  },
  {
    question: "Posso fazer upgrade do meu plano posteriormente?",
    answer: "Sim. Você pode fazer upgrade a qualquer momento. O valor é calculado proporcionalmente ao período restante do seu contrato atual."
  },
  {
    question: "Existe período de teste gratuito?",
    answer: "Oferecemos demonstração personalizada gratuita onde você pode explorar todas as funcionalidades. Entre em contato com nossa equipe para agendar."
  },
  {
    question: "Como funcionam os módulos add-on?",
    answer: "Os add-ons são módulos premium opcionais que podem ser adicionados a qualquer plano. Incluem Gestão de Riscos, ESG & Sustentabilidade, e Inteligência de Mercado com funcionalidades avançadas."
  }
];

export const sobreFAQs: FAQItem[] = [
  {
    question: "Quem está por trás do Legacy OS?",
    answer: "O Legacy OS foi criado por especialistas em governança corporativa, tecnologia e inteligência artificial, com experiência em empresas familiares, holdings e conselhos de administração."
  },
  {
    question: "Qual é a missão da empresa?",
    answer: "Nossa missão é democratizar a governança corporativa de excelência, tornando práticas antes exclusivas de grandes corporações acessíveis para empresas de todos os portes."
  },
  {
    question: "Onde fica a sede da empresa?",
    answer: "Nossa sede está localizada na Av. Brigadeiro Faria Lima, 1811, Jardim Paulistano, São Paulo - SP, no coração financeiro do Brasil."
  },
  {
    question: "O Legacy OS atende empresas fora do Brasil?",
    answer: "Atualmente focamos no mercado brasileiro, mas nossa plataforma suporta múltiplos idiomas e estamos expandindo para outros países da América Latina."
  },
  {
    question: "Como posso me tornar parceiro do Legacy OS?",
    answer: "Temos programas de parceria para consultorias de governança, escritórios de advocacia e contabilidade. Entre em contato através da página de parceiros ou fale com nossa equipe comercial."
  }
];

export const contatoFAQs: FAQItem[] = [
  {
    question: "Como posso entrar em contato com o suporte?",
    answer: "Você pode nos contatar via WhatsApp, e-mail, telefone ou através do formulário de contato. Clientes com planos Business e Enterprise têm acesso a suporte prioritário 24/7."
  },
  {
    question: "Qual o tempo médio de resposta do suporte?",
    answer: "Para clientes ativos, nosso tempo médio de primeira resposta é de 2 horas em dias úteis. Casos críticos são tratados imediatamente via canal dedicado."
  },
  {
    question: "Vocês oferecem demonstração da plataforma?",
    answer: "Sim! Oferecemos demonstrações personalizadas gratuitas onde mostramos as funcionalidades mais relevantes para o seu caso de uso. Agende através do formulário de contato."
  },
  {
    question: "É possível agendar uma reunião com um especialista em governança?",
    answer: "Sim. Nossa equipe inclui especialistas em governança corporativa que podem avaliar sua estrutura atual e recomendar as melhores práticas e funcionalidades da plataforma."
  },
  {
    question: "Qual o horário de atendimento?",
    answer: "Nosso atendimento comercial funciona de segunda a sexta, das 9h às 18h (horário de Brasília). Suporte técnico para clientes Enterprise está disponível 24/7."
  }
];

export const blogFAQs: FAQItem[] = [
  {
    question: "Como funcionam os artigos do blog?",
    answer: "Nosso blog publica semanalmente artigos sobre governança corporativa, tendências de mercado, melhores práticas e casos de sucesso. Todo conteúdo é produzido por especialistas da área."
  },
  {
    question: "Posso contribuir com artigos para o blog?",
    answer: "Sim! Aceitamos contribuições de especialistas em governança, conselheiros e profissionais do mercado. Entre em contato com nossa equipe editorial para propor pautas."
  },
  {
    question: "Como receber novidades e artigos por e-mail?",
    answer: "Inscreva-se em nossa newsletter no rodapé do site para receber os melhores artigos, insights de mercado e novidades da plataforma diretamente no seu e-mail."
  },
  {
    question: "Os artigos estão disponíveis em outros idiomas?",
    answer: "Atualmente nosso conteúdo é produzido em português. Estamos trabalhando para disponibilizar versões em espanhol e inglês em breve."
  },
  {
    question: "Vocês oferecem materiais educativos além do blog?",
    answer: "Sim! Produzimos e-books, webinars, infográficos e guias práticos sobre governança corporativa. Acesse nossa área de recursos ou inscreva-se na newsletter para receber esses materiais."
  }
];

export function FAQSection({ title = "Perguntas Frequentes", subtitle, faqs }: FAQSectionProps) {
  return (
    <section className="py-20 bg-corporate-mid">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-accent" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-medium px-6 py-4 hover:no-underline text-white hover:text-accent transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 leading-relaxed px-6 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
