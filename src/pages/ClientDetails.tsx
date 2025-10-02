import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Building2, Users, BarChart3, Calendar, Phone, Mail, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock client data
const MOCK_CLIENT_DETAILS = {
  '1': {
    id: '1',
    name: 'Tech Solutions Ltda',
    sector: 'Tecnologia',
    email: 'contato@techsolutions.com',
    phone: '+55 11 9999-0001',
    maturityScore: 85,
    assessmentDate: '2024-01-15',
    status: 'active',
    description: 'Empresa de soluções tecnológicas focada em transformação digital.',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    cnpj: '12.345.678/0001-90',
    website: 'www.techsolutions.com',
    employees: 250,
    revenue: 'R$ 50-100M',
    lastContact: '2024-03-10',
    nextMeeting: '2024-03-25',
    governance: {
      structure: 75,
      policies: 80,
      transparency: 90,
      compliance: 85
    },
    esg: {
      environmental: 70,
      social: 85,
      governance: 80
    },
    risks: [
      { type: 'Operacional', level: 'Medium', description: 'Dependência de poucos fornecedores' },
      { type: 'Financeiro', level: 'Low', description: 'Fluxo de caixa estável' },
      { type: 'Regulatório', level: 'High', description: 'Novas regulamentações LGPD' }
    ],
    activities: [
      { date: '2024-03-10', type: 'Reunião', description: 'Revisão trimestral de governança' },
      { date: '2024-03-05', type: 'Assessment', description: 'Avaliação de maturidade ESG' },
      { date: '2024-02-28', type: 'Relatório', description: 'Relatório de compliance enviado' }
    ]
  }
}

export default function ClientDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const client = MOCK_CLIENT_DETAILS[id as keyof typeof MOCK_CLIENT_DETAILS]

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cliente não encontrado</h2>
          <Button onClick={() => navigate('/parceiro/clientes')}>
            Voltar para Clientes
          </Button>
        </div>
      </div>
    )
  }

  const handleContact = (method: string) => {
    if (method === 'email') {
      window.open(`mailto:${client.email}`)
    } else if (method === 'phone') {
      window.open(`tel:${client.phone}`)
    }
    toast({
      title: "Contato iniciado",
      description: `Abrindo ${method === 'email' ? 'email' : 'telefone'}...`,
    })
  }

  const getMaturityColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'destructive'
      case 'Medium': return 'secondary'
      case 'Low': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/parceiro/clientes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">{client.sector}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleContact('email')}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" onClick={() => handleContact('phone')}>
              <Phone className="h-4 w-4 mr-2" />
              Ligar
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Score de Maturidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getMaturityColor(client.maturityScore)}`}>
                {client.maturityScore}%
              </div>
              <Progress value={client.maturityScore} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Funcionários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{client.employees}</div>
              <p className="text-sm text-muted-foreground">colaboradores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{client.revenue}</div>
              <p className="text-sm text-muted-foreground">faturamento anual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Último Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">{new Date(client.lastContact).toLocaleDateString('pt-BR')}</div>
              <p className="text-sm text-muted-foreground">há 15 dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="governance">Governança</TabsTrigger>
            <TabsTrigger value="esg">ESG</TabsTrigger>
            <TabsTrigger value="risks">Riscos</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informações da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                    <p className="text-sm mt-1">{client.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                    <p className="text-sm mt-1">{client.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                    <p className="text-sm mt-1">{client.cnpj}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Website</label>
                    <p className="text-sm mt-1">
                      <a href={`https://${client.website}`} target="_blank" rel="noopener noreferrer" 
                         className="text-primary hover:underline flex items-center gap-1">
                        {client.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Próximas Ações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Próxima Reunião</label>
                    <p className="text-sm mt-1 font-medium">
                      {new Date(client.nextMeeting).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ativo
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Avaliação</label>
                    <p className="text-sm mt-1">
                      {new Date(client.assessmentDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Governança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(client.governance).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{key}</span>
                      <span className="text-sm font-bold">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="esg" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas ESG</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(client.esg).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{key}</span>
                      <span className="text-sm font-bold">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Matriz de Riscos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {client.risks.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{risk.type}</h4>
                      <Badge variant={getRiskColor(risk.level)}>
                        {risk.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{risk.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Atividades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {client.activities.map((activity, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4 pb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{activity.type}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}