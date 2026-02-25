import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Shield, 
  Users, 
  BarChart3, 
  Target, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Lightbulb,
  PieChart,
  Activity
} from 'lucide-react';

const OnboardingPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const implementationSteps = [
    {
      phase: "Fase 1: Diagnóstico",
      duration: "4-6 semanas",
      activities: [
        "Avaliação de maturidade inicial",
        "Mapeamento de riscos sistêmicos",
        "Análise da estrutura familiar",
        "Identificação de gaps de governança"
      ]
    },
    {
      phase: "Fase 2: Planejamento",
      duration: "6-8 semanas",
      activities: [
        "Definição da estrutura de governança",
        "Criação de políticas e procedimentos",
        "Estabelecimento de KPIs",
        "Plano de implementação detalhado"
      ]
    },
    {
      phase: "Fase 3: Implementação",
      duration: "8-12 semanas",
      activities: [
        "Deploy da plataforma",
        "Treinamento das equipes",
        "Configuração de dashboards",
        "Testes e validações"
      ]
    },
    {
      phase: "Fase 4: Monitoramento",
      duration: "Contínuo",
      activities: [
        "Acompanhamento de métricas",
        "Relatórios de performance",
        "Ajustes e otimizações",
        "Suporte técnico especializado"
      ]
    }
  ];

  const roiModules = [
    {
      title: "Redução de Conflitos",
      description: "Diminuição de 73% em conflitos familiares através de processos estruturados",
      value: "R$ 2-5M economizados/ano",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Valorização da Empresa",
      description: "Aumento de 47% no valor de mercado com governança estruturada",
      value: "15-25% ROI anual",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: "Eficiência Operacional",
      description: "Automação de processos e redução de tempo em decisões",
      value: "30-40% redução custos",
      icon: <Activity className="h-6 w-6" />
    },
    {
      title: "Conformidade Regulatória",
      description: "Redução de riscos e multas através de compliance automatizado",
      value: "R$ 500K-2M poupados",
      icon: <Shield className="h-6 w-6" />
    }
  ];

  const platformFeatures = [
    {
      module: "Diagnóstico de Maturidade",
      problem: "Falta de visibilidade sobre o estado atual da governança",
      solution: "Avaliação automatizada com 127 indicadores e benchmarking setorial",
      value: "Baseline claro para melhoria contínua"
    },
    {
      module: "Gestão de Riscos Sistêmicos",
      problem: "Riscos não identificados podem causar crises familiares",
      solution: "Matriz de riscos com monitoramento em tempo real e alertas automáticos",
      value: "Prevenção proativa de conflitos e crises"
    },
    {
      module: "Estrutura Societária",
      problem: "Complexidade das relações familiares dificulta decisões",
      solution: "Mapeamento visual das relações e influências familiares",
      value: "Decisões mais assertivas e transparentes"
    },
    {
      module: "Agentes de IA Especializados",
      problem: "Falta de expertise especializada disponível 24/7",
      solution: "IA treinada em governança familiar com conhecimento regulatório",
      value: "Consultoria especializada sempre disponível"
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Plataforma Legacy - Onboarding Completo
              </h1>
              <p className="text-xl text-muted-foreground">
                Transformando Governança Corporativa em Empresas Familiares através de IA
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
                <TabsTrigger value="adoption">Adoção</TabsTrigger>
                <TabsTrigger value="roi">ROI & Valor</TabsTrigger>
                <TabsTrigger value="compliance">Conformidade</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-primary" />
                      Como a Legacy Resolve Problemas de Governança de IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6">
                      {platformFeatures.map((feature, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <h3 className="font-semibold text-lg text-primary">{feature.module}</h3>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Badge variant="destructive" className="mb-2">Problema</Badge>
                              <p className="text-sm text-muted-foreground">{feature.problem}</p>
                            </div>
                            <div>
                              <Badge variant="default" className="mb-2">Solução Legacy</Badge>
                              <p className="text-sm text-muted-foreground">{feature.solution}</p>
                            </div>
                            <div>
                              <Badge variant="secondary" className="mb-2">Valor Gerado</Badge>
                              <p className="text-sm text-muted-foreground">{feature.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-3 text-primary">
                        🏆 Resultado Comprovado
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        "Empresas com governança estruturada têm valor de mercado 47% maior que seus competidores 
                        e reduzem conflitos familiares em 73%. Fonte: IBGC"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flowchart" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Fluxo da Plataforma Legacy</CardTitle>
                    <CardDescription>
                      Visualização completa do processo de governança corporativa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full overflow-x-auto">
                      <div className="min-w-full">
                        <div className="mermaid-container bg-white p-6 rounded-lg border">
                          <div style={{ minHeight: '600px' }}>
                            {/* Mermaid Flowchart */}
                            <div className="text-center">
                              <h3 className="text-lg font-semibold mb-4">Arquitetura da Plataforma Legacy</h3>
                              <div className="space-y-4 text-left">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="border rounded-lg p-4 bg-blue-50">
                                    <h4 className="font-semibold text-blue-800 mb-2">1. Entrada de Dados</h4>
                                    <ul className="text-sm space-y-1">
                                      <li>• Upload de documentos</li>
                                      <li>• Questionários de avaliação</li>
                                      <li>• Integração com sistemas</li>
                                      <li>• Dados históricos</li>
                                    </ul>
                                  </div>
                                  <div className="border rounded-lg p-4 bg-green-50">
                                    <h4 className="font-semibold text-green-800 mb-2">2. Processamento IA</h4>
                                    <ul className="text-sm space-y-1">
                                      <li>• Análise de maturidade</li>
                                      <li>• Identificação de riscos</li>
                                      <li>• Benchmarking setorial</li>
                                      <li>• Recomendações personalizadas</li>
                                    </ul>
                                  </div>
                                  <div className="border rounded-lg p-4 bg-purple-50">
                                    <h4 className="font-semibold text-purple-800 mb-2">3. Outputs Inteligentes</h4>
                                    <ul className="text-sm space-y-1">
                                      <li>• Dashboards em tempo real</li>
                                      <li>• Relatórios automatizados</li>
                                      <li>• Alertas proativos</li>
                                      <li>• Planos de ação</li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <div className="text-center my-6">
                                  <ArrowRight className="h-8 w-8 mx-auto text-gray-400" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="border rounded-lg p-4 bg-orange-50">
                                    <h4 className="font-semibold text-orange-800 mb-2">4. Monitoramento Contínuo</h4>
                                    <ul className="text-sm space-y-1">
                                      <li>• KPIs de governança</li>
                                      <li>• Trending de melhorias</li>
                                      <li>• Compliance automático</li>
                                    </ul>
                                  </div>
                                  <div className="border rounded-lg p-4 bg-red-50">
                                    <h4 className="font-semibold text-red-800 mb-2">5. Ações Corretivas</h4>
                                    <ul className="text-sm space-y-1">
                                      <li>• Planos de mitigação</li>
                                      <li>• Workflows automatizados</li>
                                      <li>• Notificações targeted</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="adoption" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Como é Adotada pelos Clientes</CardTitle>
                    <CardDescription>Processo de Implementação (4-8 meses)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {implementationSteps.map((step, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{step.phase}</h3>
                              <Badge variant="outline">{step.duration}</Badge>
                            </div>
                          </div>
                          <div className="ml-11">
                            <ul className="space-y-2">
                              {step.activities.map((activity, actIndex) => (
                                <li key={actIndex} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 bg-muted/50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">🎯 Garantias de Valor e Conformidade</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 text-primary">Garantias de Valor:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• ROI mínimo de 15% no primeiro ano</li>
                            <li>• Redução de 30% em custos operacionais</li>
                            <li>• Melhoria de 50% na tomada de decisões</li>
                            <li>• SLA de 99.9% de disponibilidade</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-primary">Garantias de Conformidade:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Compliance com LGPD/GDPR</li>
                            <li>• Auditoria contínua automatizada</li>
                            <li>• Relatórios regulatórios automáticos</li>
                            <li>• Certificação ISO 27001</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roi" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-6 w-6 text-primary" />
                      Módulo de ROI - Geração de Valor
                    </CardTitle>
                    <CardDescription>
                      Como nosso módulo de ROI funciona e gera valor mensurável
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      {roiModules.map((module, index) => (
                        <Card key={index} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                {module.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                                <Badge variant="secondary" className="font-semibold">
                                  {module.value}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">📊 Como o Módulo de ROI Funciona:</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <h4 className="font-medium">Coleta de Dados Baseline</h4>
                            <p className="text-sm text-muted-foreground">Captura métricas financeiras, operacionais e de governança antes da implementação</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <h4 className="font-medium">Monitoramento Contínuo</h4>
                            <p className="text-sm text-muted-foreground">Tracking automático de KPIs de valor: redução de conflitos, eficiência operacional, valorização</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <h4 className="font-medium">Cálculo de ROI Automatizado</h4>
                            <p className="text-sm text-muted-foreground">Algoritmos proprietários calculam ROI em tempo real considerando múltiplas variáveis</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                          <div>
                            <h4 className="font-medium">Relatórios de Impacto</h4>
                            <p className="text-sm text-muted-foreground">Dashboards executivos com impacto financeiro e operacional detalhado</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      Conformidade e Segurança
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="border rounded-lg p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-semibold mb-2">Regulamentações</h3>
                        <ul className="text-sm space-y-1">
                          <li>LGPD Compliance</li>
                          <li>GDPR Ready</li>
                          <li>SOX Compliance</li>
                          <li>CVM Guidelines</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-semibold mb-2">Segurança</h3>
                        <ul className="text-sm space-y-1">
                          <li>ISO 27001</li>
                          <li>Criptografia End-to-End</li>
                          <li>Audit Logs</li>
                          <li>Multi-factor Auth</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-semibold mb-2">Auditoria</h3>
                        <ul className="text-sm space-y-1">
                          <li>Rastreabilidade 100%</li>
                          <li>Relatórios Automáticos</li>
                          <li>Compliance Score</li>
                          <li>Risk Assessment</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="font-semibold text-green-800 mb-3">✅ Certificações e Validações</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-700 mb-2">Certificações Obtidas:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• ISO 27001 - Segurança da Informação</li>
                            <li>• SOC 2 Type II - Controles Operacionais</li>
                            <li>• LGPD Compliance Certificate</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-700 mb-2">Validações Externas:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Auditoria PwC (anual)</li>
                            <li>• Penetration Tests trimestrais</li>
                            <li>• Validação IBGC</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OnboardingPage;