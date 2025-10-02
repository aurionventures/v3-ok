import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  Building2,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOCK_REPORTS = [
  {
    id: 'report_1',
    title: 'Relatório Consolidado - Janeiro 2024',
    type: 'Consolidado',
    generatedAt: new Date('2024-01-31'),
    clients: 3,
    status: 'Concluído',
    downloadUrl: '#'
  },
  {
    id: 'report_2',
    title: 'Análise de Maturidade - TechCorp',
    type: 'Individual',
    generatedAt: new Date('2024-01-28'),
    clients: 1,
    status: 'Concluído',
    downloadUrl: '#'
  },
  {
    id: 'report_3',
    title: 'Assessment Comparativo - Q4 2023',
    type: 'Comparativo',
    generatedAt: new Date('2024-01-25'),
    clients: 3,
    status: 'Concluído',
    downloadUrl: '#'
  }
];

const REPORT_TYPES = [
  {
    id: 'consolidated',
    title: 'Relatório Consolidado',
    description: 'Visão geral de toda a carteira de clientes',
    icon: BarChart3,
    color: 'bg-blue-500'
  },
  {
    id: 'individual',
    title: 'Relatório Individual',
    description: 'Análise detalhada de um cliente específico',
    icon: FileText,
    color: 'bg-green-500'
  },
  {
    id: 'comparative',
    title: 'Análise Comparativa',
    description: 'Compare múltiplos clientes ou períodos',
    icon: PieChart,
    color: 'bg-purple-500'
  },
  {
    id: 'progress',
    title: 'Relatório de Progresso',
    description: 'Acompanhe a evolução ao longo do tempo',
    icon: TrendingUp,
    color: 'bg-orange-500'
  }
];

export const ParceiroRelatorios = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const { toast } = useToast();

  const handleGenerateReport = (type: string) => {
    toast({
      title: 'Relatório Sendo Gerado',
      description: `Seu relatório ${type} está sendo processado e será enviado por email.`,
    });
  };

  const handleDownload = (report: any) => {
    toast({
      title: 'Download Iniciado',
      description: `Baixando ${report.title}`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h1>
          <p className="text-muted-foreground">
            Gere relatórios detalhados e acompanhe o desempenho de seus clientes
          </p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Relatórios Gerados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 neste mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maturidade Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">+8% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Avaliados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">100% da carteira</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments Ativos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Em andamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Generate Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Gerar Novo Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {REPORT_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <div
                    key={type.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleGenerateReport(type.title)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded ${type.color} text-white`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-sm">{type.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      {type.description}
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Gerar Relatório
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Relatórios Recentes</CardTitle>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Relatório
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_REPORTS.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{report.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {report.clients} cliente(s)
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {report.generatedAt.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{report.status}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(report)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};