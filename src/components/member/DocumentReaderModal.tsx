import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemberTracking } from "@/hooks/useMemberTracking";

interface MockDocument {
  name: string;
  type: string;
  content: string;
  pages: number;
  lastUpdated: string;
  category: string;
}

interface DocumentReaderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
}

// Mock document content based on document name
const mockDocuments: Record<string, MockDocument> = {
  "Plano Estratégico 2026-2028 - Draft v3": {
    name: "Plano Estratégico 2026-2028 - Draft v3",
    type: "pdf",
    content: `# Plano Estratégico 2026-2028

## Sumário Executivo

Este documento apresenta a visão estratégica da empresa para o triênio 2026-2028, com foco em crescimento sustentável, inovação tecnológica e expansão de mercado.

## 1. Análise de Cenário

### 1.1 Ambiente Macroeconômico
- PIB projetado: crescimento de 2.5% a.a.
- Taxa de juros: tendência de estabilização
- Inflação: dentro da meta de 3-4%

### 1.2 Análise Setorial
O setor apresenta perspectivas positivas com:
- Aumento da demanda por 15% ao ano
- Consolidação de players menores
- Entrada de novos competidores internacionais

## 2. Objetivos Estratégicos

### 2.1 Crescimento
- Aumentar receita em 40% até 2028
- Expandir para 3 novos mercados regionais
- Lançar 5 novos produtos/serviços

### 2.2 Eficiência Operacional
- Reduzir custos operacionais em 15%
- Implementar automação em processos-chave
- Otimizar cadeia de suprimentos

### 2.3 Sustentabilidade
- Atingir neutralidade de carbono até 2027
- Implementar programa ESG completo
- Certificações ambientais relevantes

## 3. Investimentos Planejados

| Área | 2026 | 2027 | 2028 |
|------|------|------|------|
| Tecnologia | R$ 15M | R$ 20M | R$ 25M |
| Marketing | R$ 8M | R$ 10M | R$ 12M |
| Operações | R$ 12M | R$ 15M | R$ 18M |
| P&D | R$ 5M | R$ 7M | R$ 10M |

## 4. Riscos e Mitigações

### 4.1 Riscos Identificados
1. Volatilidade cambial
2. Mudanças regulatórias
3. Disrupção tecnológica
4. Escassez de talentos

### 4.2 Planos de Mitigação
Cada risco possui um plano de contingência detalhado no Anexo A.

## 5. Governança e Monitoramento

O acompanhamento será realizado através de:
- Reuniões trimestrais do Conselho
- Dashboard de KPIs em tempo real
- Auditorias semestrais de progresso

---

**Documento Confidencial**
Versão 3.0 - Janeiro 2026
Para discussão na próxima reunião do Conselho de Administração`,
    pages: 45,
    lastUpdated: "2026-01-08",
    category: "Estratégia"
  },
  "Relatório Financeiro Q4 2025": {
    name: "Relatório Financeiro Q4 2025",
    type: "pdf",
    content: `# Relatório Financeiro Q4 2025

## Destaques do Trimestre

### Receita
- Receita Total: R$ 185.4M (+12% vs Q4 2024)
- Receita Recorrente: R$ 142.8M (+18% vs Q4 2024)

### Rentabilidade
- EBITDA: R$ 38.2M (Margem: 20.6%)
- Lucro Líquido: R$ 24.1M (Margem: 13.0%)

### Caixa
- Caixa e Equivalentes: R$ 89.5M
- Dívida Líquida/EBITDA: 0.8x

## Análise por Segmento

### Segmento A (65% da receita)
- Crescimento de 14% YoY
- Margem de contribuição: 45%

### Segmento B (25% da receita)
- Crescimento de 8% YoY
- Margem de contribuição: 38%

### Segmento C (10% da receita)
- Crescimento de 22% YoY
- Margem de contribuição: 52%

## Perspectivas 2026

Mantemos guidance de crescimento entre 15-18% para 2026, com expansão de margem de 100-150 bps.

---

**Documento para uso interno**
Preparado pelo Departamento Financeiro`,
    pages: 28,
    lastUpdated: "2026-01-05",
    category: "Financeiro"
  },
  "Análise de Riscos Corporativos": {
    name: "Análise de Riscos Corporativos",
    type: "pdf",
    content: `# Análise de Riscos Corporativos 2026

## Metodologia

Este relatório utiliza a metodologia COSO ERM para identificação, avaliação e tratamento de riscos.

## Mapa de Riscos

### Riscos Estratégicos
1. **Concentração de Clientes** (Alto)
   - Top 5 clientes: 42% da receita
   - Mitigação: Diversificação ativa

2. **Obsolescência Tecnológica** (Médio)
   - Ciclo de investimento: 3 anos
   - Mitigação: P&D contínuo

### Riscos Operacionais
1. **Dependência de Fornecedores-Chave** (Alto)
   - 3 fornecedores críticos
   - Mitigação: Homologação de alternativas

2. **Segurança Cibernética** (Médio-Alto)
   - Investimento em segurança: R$ 2.5M/ano
   - Mitigação: SOC 24/7, seguros

### Riscos Financeiros
1. **Exposição Cambial** (Médio)
   - 25% dos custos em USD
   - Mitigação: Hedge natural + derivativos

### Riscos de Compliance
1. **LGPD** (Baixo-Médio)
   - Programa de adequação: 95% completo
   - Mitigação: DPO dedicado, treinamentos

## Recomendações

O Comitê de Riscos recomenda:
1. Acelerar diversificação de clientes
2. Revisar apólice de seguros cyber
3. Atualizar política de hedge

---

**Classificação: Confidencial**
Comitê de Riscos - Janeiro 2026`,
    pages: 32,
    lastUpdated: "2026-01-06",
    category: "Gestão de Riscos"
  },
  "default": {
    name: "Documento",
    type: "pdf",
    content: `# Documento de Governança

Este documento contém informações relevantes para a próxima reunião do Conselho.

## Conteúdo

As informações detalhadas estão disponíveis nas seções subsequentes deste documento.

### Principais Pontos
- Item 1: Análise de desempenho
- Item 2: Projeções e metas
- Item 3: Planos de ação

### Conclusões
O documento apresenta as principais conclusões e recomendações para deliberação do Conselho.

---

**Para uso interno**`,
    pages: 15,
    lastUpdated: "2026-01-07",
    category: "Geral"
  }
};

export function DocumentReaderModal({ open, onOpenChange, documentName }: DocumentReaderModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { trackEvent } = useMemberTracking();
  
  const doc = mockDocuments[documentName] || {
    ...mockDocuments.default,
    name: documentName
  };

  const handleDownload = () => {
    trackEvent('document_download', { 
      document_name: documentName,
      document_type: doc.type 
    });
    
    // Simulate download
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${documentName.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    window.document.body?.appendChild(link);
    link.click();
    window.document.body?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Track document read when modal opens
  if (open && documentName) {
    trackEvent('document_read', { 
      document_name: documentName,
      document_type: doc.type 
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">{doc.name}</DialogTitle>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {doc.lastUpdated}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {doc.pages} páginas
                  </span>
                  <Badge variant="secondary">{doc.category}</Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] px-6 py-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {doc.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.replace('# ', '')}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-semibold mt-5 mb-3">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-medium mt-4 mb-2">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
              }
              if (line.startsWith('|')) {
                return <code key={i} className="block bg-muted p-1 text-sm font-mono">{line}</code>;
              }
              if (line.startsWith('---')) {
                return <hr key={i} className="my-6" />;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-semibold text-sm text-muted-foreground">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              return <p key={i} className="mb-2">{line}</p>;
            })}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between p-4 border-t bg-muted/30">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-3">
              Página {currentPage} de {doc.pages}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(Math.min(doc.pages, currentPage + 1))}
              disabled={currentPage === doc.pages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentReaderModal;
