import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PricingLogicPDF } from "./PricingLogicPDF";
import { FileText, Calculator, TrendingUp, DollarSign, BarChart3 } from "lucide-react";

export function PricingLogicTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Lógica de Pricing - Documentação Completa
              </CardTitle>
              <CardDescription className="mt-2">
                Documentação completa da lógica de cálculo de preços da plataforma Legacy Governance
              </CardDescription>
            </div>
            <PricingLogicPDF />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Visão Geral */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Visão Geral
              </h3>
              <p className="text-sm text-muted-foreground">
                O sistema de pricing da Legacy Governance Platform utiliza um modelo dinâmico baseado em múltiplos fatores que refletem a complexidade real da estrutura de governança corporativa de cada empresa.
              </p>
            </div>

            {/* Componentes Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valores Mínimos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{'<'} R$ 50M/ano</span>
                      <span className="font-semibold">R$ 3.997,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">R$ 50M - R$ 300M</span>
                      <span className="font-semibold">R$ 5.997,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">R$ 300M - R$ 1B</span>
                      <span className="font-semibold">R$ 7.997,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{'>'} R$ 1B</span>
                      <span className="font-semibold">R$ 8.997,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Listada (B3)</span>
                      <span className="font-semibold">R$ 14.997,00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Multiplicadores de Maturidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Básico</span>
                      <span className="font-semibold">1.0x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Intermediário</span>
                      <span className="font-semibold">1.2x (+20%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avançado</span>
                      <span className="font-semibold">1.4x (+40%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">World-Class</span>
                      <span className="font-semibold">1.6x (+60%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Aumentos Proporcionais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Aumentos Proporcionais por Complexidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="text-sm">Conselho adicional</span>
                      <span className="font-semibold text-green-600">+15%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="text-sm">Comitê</span>
                      <span className="font-semibold text-green-600">+10%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="text-sm">Reunião adicional</span>
                      <span className="font-semibold text-green-600">+0.1%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="text-sm">Usuário adicional</span>
                      <span className="font-semibold text-green-600">+0.5%</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  ⚠️ Os aumentos são calculados sobre o valor base, não sobre o valor já ajustado pela maturidade.
                </p>
              </CardContent>
            </Card>

            {/* Fórmula */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fórmula de Cálculo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div className="mb-2">Preço Final = (Valor Base × Multiplicador Maturidade)</div>
                  <div className="ml-4 mb-2">+ (Valor Base × 0.15 × max(0, numConselhos - 1))</div>
                  <div className="ml-4 mb-2">+ (Valor Base × 0.10 × numComites)</div>
                  <div className="ml-4 mb-2">+ (Valor Base × 0.001 × max(0, reunioesAno - 12))</div>
                  <div className="ml-4">+ (Valor Base × 0.005 × max(0, numUsuarios - 10))</div>
                </div>
              </CardContent>
            </Card>

            {/* Estrutura Base */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estrutura Base (Configuração Mínima)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded">
                    <div className="text-2xl font-bold text-primary">1</div>
                    <div className="text-xs text-muted-foreground mt-1">Conselho</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-xs text-muted-foreground mt-1">Comitês</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-xs text-muted-foreground mt-1">Reuniões/ano</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded">
                    <div className="text-2xl font-bold text-primary">10</div>
                    <div className="text-xs text-muted-foreground mt-1">Usuários</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Valores acima desses limites geram aumentos proporcionais no preço.
                </p>
              </CardContent>
            </Card>

            {/* Informações */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                📄 Documentação Completa
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Clique no botão acima para baixar o PDF completo com toda a documentação da lógica de pricing, incluindo:
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>Valores mínimos detalhados por faturamento</li>
                <li>Multiplicadores de maturidade e complexidade</li>
                <li>Fórmulas de cálculo completas</li>
                <li>Exemplos práticos passo a passo</li>
                <li>Regras de negócio e fluxo de cálculo</li>
                <li>Observações finais e características do sistema</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
