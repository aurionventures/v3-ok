import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Download, HelpCircle } from "lucide-react";

const MemberBriefing = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          30 min de leitura
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <p className="text-xs text-muted-foreground mb-1">Progresso de preparação</p>
            <Progress value={45} className="h-2" />
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <span className="text-sm font-medium">45%</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resumo Executivo</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              A reunião de Abril/2026 do Conselho de Administração terá foco em 5 temas estratégicos fundamentais para o próximo ciclo da empresa.
            </p>
            <p>
              <strong>Pauta gerada pela Inteligência Artificial</strong> com base em análise de dados internos, matriz de riscos, oportunidades de mercado e contexto regulatório ESG.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Análise de Performance ESG do Q1</li>
              <li>Estratégia de Transformação Digital 2026-2028</li>
              <li>Revisão de Riscos Corporativos</li>
              <li>Aprovação de Novos Conselheiros Independentes</li>
              <li>Aprovação da Ata Anterior</li>
            </ul>
            <p>
              O investimento previsto no plano de transformação digital e os riscos de cibersegurança serão discutidos em profundidade.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Perguntas Críticas para Você
          </h3>
          <ul className="space-y-3">
            {[
              "Qual o impacto do plano digital no headcount e custos de pessoal?",
              "Os riscos cibernéticos identificados afetam nossa certificação ISO 27001?",
              "O orçamento ESG está alinhado com as expectativas dos investidores institucionais?",
            ].map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {q}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberBriefing;
