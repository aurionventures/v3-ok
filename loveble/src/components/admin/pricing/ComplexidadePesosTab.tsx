import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateComplexityScore, getComplexityLevel, recommendPlan, revealPricing } from "@/data/pricingData";
import { Calculator, TrendingUp, Target, Info, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ComplexidadePDF } from "./ComplexidadePDF";

export function ComplexidadePesosTab() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { 
      style: "currency", 
      currency: "BRL", 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Exemplos práticos
  const exemplos = [
    {
      nome: "Startup/PE",
      empresas: 1,
      conselhos: 1,
      comites: 0,
      reunioes: 12,
    },
    {
      nome: "Empresa Familiar Média",
      empresas: 2,
      conselhos: 1,
      comites: 2,
      reunioes: 36,
    },
    {
      nome: "Corporação Média",
      empresas: 4,
      conselhos: 2,
      comites: 4,
      reunioes: 180,
    },
    {
      nome: "Grande Corporação",
      empresas: 6,
      conselhos: 3,
      comites: 6,
      reunioes: 400,
    },
  ];

  const calcularExemplo = (exemplo: typeof exemplos[0]) => {
    const score = calculateComplexityScore({
      numEmpresas: exemplo.empresas,
      numConselhos: exemplo.conselhos,
      numComites: exemplo.comites,
      reunioesAno: exemplo.reunioes,
    });
    const level = getComplexityLevel(score);
    return { score, level };
  };

  return (
    <div className="space-y-6">
      {/* Botão Gerar PDF */}
      <div className="flex justify-end">
        <ComplexidadePDF />
      </div>

      {/* Fórmula e Pesos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Fórmula de Cálculo do Complexity Score
          </CardTitle>
          <CardDescription>
            Sistema de scoring baseado em fatores estruturais da organização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fórmula */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="font-mono text-lg font-semibold text-center mb-4">
              Complexity Score = (Empresas × 1) + (Conselhos × 3) + (Comitês × 2) + (Reuniões ÷ 10)
            </div>
          </div>

          {/* Tabela de Pesos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Matriz de Pesos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fator</TableHead>
                  <TableHead className="text-center">Peso</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-center">Impacto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Empresas</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">×1</Badge>
                  </TableCell>
                  <TableCell>Cada empresa no grupo adiciona 1 ponto</TableCell>
                  <TableCell className="text-center text-green-600">Baixo</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Conselhos</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">×3</Badge>
                  </TableCell>
                  <TableCell>Cada conselho de administração adiciona 3 pontos</TableCell>
                  <TableCell className="text-center text-orange-600">Alto</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Comitês</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">×2</Badge>
                  </TableCell>
                  <TableCell>Cada comitê formal (auditoria, riscos, etc.) adiciona 2 pontos</TableCell>
                  <TableCell className="text-center text-yellow-600">Médio</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Reuniões/Ano</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">÷10</Badge>
                  </TableCell>
                  <TableCell>Volume anual de reuniões dividido por 10</TableCell>
                  <TableCell className="text-center text-blue-600">Variável</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Níveis de Complexidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Níveis de Complexidade
          </CardTitle>
          <CardDescription>
            Classificação baseada no Complexity Score calculado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Baixa</h4>
                <Badge className="bg-green-600">≤ 10</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Estrutura enxuta, ideal para começar
              </p>
              <div className="text-xs space-y-1">
                <p>• Empresa única ou grupo pequeno</p>
                <p>• 1 conselho ou menos</p>
                <p>• Poucos comitês formais</p>
                <p>• &lt; 50 reuniões/ano</p>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-green-700 dark:text-green-400">
                  Plano Recomendado: Essencial ou Profissional
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Moderada</h4>
                <Badge className="bg-yellow-600">11-30</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Complexidade típica de empresas em crescimento
              </p>
              <div className="text-xs space-y-1">
                <p>• Grupo pequeno/médio (2-3 empresas)</p>
                <p>• 1-2 conselhos</p>
                <p>• Alguns comitês (1-2)</p>
                <p>• 50-150 reuniões/ano</p>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                  Plano Recomendado: Profissional ou Business
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-950/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Alta</h4>
                <Badge className="bg-orange-600">31-60</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Estrutura robusta requer governança avançada
              </p>
              <div className="text-xs space-y-1">
                <p>• Grupo médio/grande (3-5 empresas)</p>
                <p>• Múltiplos conselhos (2-3)</p>
                <p>• Vários comitês (3-5)</p>
                <p>• 150-300 reuniões/ano</p>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-orange-700 dark:text-orange-400">
                  Plano Recomendado: Business ou Enterprise
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Muito Alta</h4>
                <Badge className="bg-red-600">&gt; 60</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Complexidade de grande corporação
              </p>
              <div className="text-xs space-y-1">
                <p>• Grande grupo (5+ empresas)</p>
                <p>• Múltiplos conselhos (3+)</p>
                <p>• Muitos comitês (5+)</p>
                <p>• 300+ reuniões/ano</p>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-red-700 dark:text-red-400">
                  Plano Recomendado: Enterprise
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemplos Práticos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Exemplos Práticos de Cálculo
          </CardTitle>
          <CardDescription>
            Veja como diferentes estruturas organizacionais resultam em diferentes níveis de complexidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perfil</TableHead>
                <TableHead className="text-center">Empresas</TableHead>
                <TableHead className="text-center">Conselhos</TableHead>
                <TableHead className="text-center">Comitês</TableHead>
                <TableHead className="text-center">Reuniões/Ano</TableHead>
                <TableHead className="text-center">Cálculo</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Nível</TableHead>
                <TableHead className="text-center">Plano Recomendado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exemplos.map((exemplo) => {
                const { score, level } = calcularExemplo(exemplo);
                const calculo = `${exemplo.empresas}×1 + ${exemplo.conselhos}×3 + ${exemplo.comites}×2 + ${exemplo.reunioes}÷10`;
                const planoRecomendado = recommendPlan(score, '50-300m');
                const pricing = revealPricing(planoRecomendado, 'smb');
                const planoLabels: Record<string, string> = {
                  'essencial': 'Essencial',
                  'profissional': 'Profissional',
                  'business': 'Business',
                  'enterprise': 'Enterprise'
                };
                return (
                  <TableRow key={exemplo.nome}>
                    <TableCell className="font-medium">{exemplo.nome}</TableCell>
                    <TableCell className="text-center">{exemplo.empresas}</TableCell>
                    <TableCell className="text-center">{exemplo.conselhos}</TableCell>
                    <TableCell className="text-center">{exemplo.comites}</TableCell>
                    <TableCell className="text-center">{exemplo.reunioes}</TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {calculo}
                    </TableCell>
                    <TableCell className="text-center font-semibold">{score}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={
                          level.level === 'Baixa' ? 'bg-green-600' :
                          level.level === 'Moderada' ? 'bg-yellow-600' :
                          level.level === 'Alta' ? 'bg-orange-600' :
                          'bg-red-600'
                        }
                      >
                        {level.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">{planoLabels[planoRecomendado] || planoRecomendado}</span>
                        {pricing.mensal && (
                          <span className="text-xs text-muted-foreground">
                            {formatPrice(pricing.mensal)}/mês
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Relação Complexidade vs Preços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Relação Complexidade vs Preços
          </CardTitle>
          <CardDescription>
            Como o nível de complexidade influencia a recomendação de planos e preços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lógica de Recomendação</AlertTitle>
            <AlertDescription>
              O Complexity Score é usado em conjunto com o <strong>faturamento anual</strong> para determinar o plano ideal. 
              Empresas com maior complexidade podem precisar de planos mais completos, mesmo com faturamento menor.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-semibold">Fatores Adicionais Considerados:</h4>
            <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
              <li><strong>Faturamento Anual:</strong> Define o plano base (SMB, SMB+, Mid-Market, Large, Enterprise)</li>
              <li><strong>Conselho Funcionando:</strong> +1 ponto de complexidade adicional</li>
              <li><strong>Sucessão Formal:</strong> +1 ponto de complexidade adicional</li>
              <li><strong>Avaliação Riscos/ESG Recorrente:</strong> +1 ponto de complexidade adicional</li>
              <li><strong>Colaboradores &gt;500:</strong> +1 ponto de complexidade adicional</li>
              <li><strong>Score ISCA/GovMetrix ≥60:</strong> +1 ponto | ≥80: +2 pontos</li>
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-3">Thresholds de Score para Recomendação de Planos</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complexity Score</TableHead>
                  <TableHead>Nível de Complexidade</TableHead>
                  <TableHead>Plano Recomendado</TableHead>
                  <TableHead className="text-center">Exemplo (SMB)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">≤ 10</TableCell>
                  <TableCell><Badge className="bg-green-600">Baixa</Badge></TableCell>
                  <TableCell className="font-semibold">Essencial</TableCell>
                  <TableCell className="text-center">R$ 3.997,00/mês</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">11 - 20</TableCell>
                  <TableCell><Badge className="bg-yellow-600">Moderada</Badge></TableCell>
                  <TableCell className="font-semibold">Profissional</TableCell>
                  <TableCell className="text-center">R$ 4.997,00/mês</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">21 - 40</TableCell>
                  <TableCell><Badge className="bg-orange-600">Alta</Badge></TableCell>
                  <TableCell className="font-semibold">Business</TableCell>
                  <TableCell className="text-center">R$ 7.997,00/mês</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">&gt; 40</TableCell>
                  <TableCell><Badge className="bg-red-600">Muito Alta</Badge></TableCell>
                  <TableCell className="font-semibold">Enterprise</TableCell>
                  <TableCell className="text-center">R$ 14.997,00/mês</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Lógica de Upgrade:</h4>
            <p className="text-sm">
              Com <strong>3+ pontos de complexidade adicional</strong>, o sistema recomenda um upgrade de <strong>1 tier</strong> no plano 
              (ex: Essencial → Profissional, Profissional → Business). O upgrade máximo é de <strong>2 tiers</strong> acima do plano base por faturamento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
