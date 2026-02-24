
import React, { useState } from "react";
import { BookText, History, Save, Calendar, FileText, Plus } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";

// Sample legacy document versions
const legacyVersions = [
  {
    id: 1,
    title: "Manifesto de Legado v3.0",
    date: "15/04/2025",
    author: "Carlos Silva",
    status: "Ativo",
  },
  {
    id: 2,
    title: "Manifesto de Legado v2.5",
    date: "10/01/2025",
    author: "Carlos Silva",
    status: "Arquivado",
  },
  {
    id: 3,
    title: "Manifesto de Legado v2.0",
    date: "05/07/2024",
    author: "Carlos Silva",
    status: "Arquivado",
  },
];

// Templates para documentos relacionados
const documentTemplates = [
  {
    id: 1,
    name: "Protocolo Familiar",
    description: "Documento que estabelece as regras e diretrizes para a participação da família no negócio",
    content: `PROTOCOLO FAMILIAR DA FAMÍLIA SILVA

1. PROPÓSITO
Este protocolo tem como objetivo estabelecer diretrizes claras para a participação dos membros da família nos negócios, preservando a harmonia familiar e a continuidade empresarial.

2. PRINCÍPIOS FUNDAMENTAIS
- Transparência em todas as comunicações
- Mérito como critério para posições de liderança
- Respeito às diferenças individuais
- Compromisso com a excelência

3. GOVERNANÇA FAMILIAR
3.1 Assembleia Familiar: Reunião anual obrigatória para todos os membros
3.2 Conselho de Família: Órgão deliberativo composto por representantes de cada geração
3.3 Family Office: Estrutura profissional para gestão patrimonial

4. CRITÉRIOS PARA PARTICIPAÇÃO NO NEGÓCIO
- Formação superior completa
- Experiência profissional externa mínima de 5 anos
- Aprovação do Conselho de Família
- Demonstração de alinhamento com os valores familiares

5. POLÍTICA DE DIVIDENDOS
Os dividendos serão distribuídos anualmente, respeitando as necessidades de reinvestimento no negócio e o planejamento sucessório.

6. RESOLUÇÃO DE CONFLITOS
Todo conflito será inicialmente tratado no âmbito familiar. Em caso de impasse, será acionada mediação externa especializada.`
  },
  {
    id: 2,
    name: "Carta de Valores",
    description: "Documento que expressa os valores fundamentais que norteiam a família",
    content: `CARTA DE VALORES DA FAMÍLIA SILVA

INTEGRIDADE
Agimos com honestidade e transparência em todas as nossas relações, mantendo nossa palavra e assumindo nossas responsabilidades.

EXCELÊNCIA
Buscamos sempre a melhoria contínua em tudo o que fazemos, superando expectativas e estabelecendo novos padrões de qualidade.

CUIDADO COM AS PESSOAS
Valorizamos o desenvolvimento humano, tratando todos com respeito, dignidade e oferecendo oportunidades de crescimento.

RESPEITO AO MEIO AMBIENTE
Desenvolvemos nossas atividades de forma sustentável, preservando recursos naturais para as futuras gerações.

COMPROMISSO SOCIAL
Contribuímos ativamente para o desenvolvimento das comunidades onde atuamos, promovendo impacto social positivo.

UNIDADE FAMILIAR
Mantemos os laços familiares fortalecidos através do diálogo, respeito às diferenças e apoio mútuo.

VISÃO DE LONGO PRAZO
Tomamos decisões pensando nas consequências para as próximas gerações, equilibrando resultados imediatos com sustentabilidade futura.

INOVAÇÃO
Abraçamos mudanças positivas e estimulamos a criatividade para encontrar soluções inovadoras aos desafios.`
  },
  {
    id: 3,
    name: "Código de Conduta",
    description: "Normas de comportamento e diretrizes éticas para todos os membros da família",
    content: `CÓDIGO DE CONDUTA DA FAMÍLIA SILVA

1. COMPORTAMENTO ÉTICO
Todos os membros da família devem agir com integridade, honestidade e transparência em suas relações pessoais e profissionais.

2. CONFLITO DE INTERESSES
- Declarar qualquer situação que possa configurar conflito de interesses
- Abster-se de decisões quando houver conflito pessoal
- Priorizar sempre os interesses da família e dos negócios

3. CONFIDENCIALIDADE
Informações estratégicas dos negócios familiares devem ser mantidas em sigilo e não podem ser compartilhadas sem autorização.

4. RELACIONAMENTO COM MÍDIA
Apenas os porta-vozes designados podem se manifestar publicamente em nome da família ou dos negócios.

5. USO DE RECURSOS
Recursos familiares devem ser utilizados exclusivamente para fins legítimos e aprovados pela governança familiar.

6. RELACIONAMENTOS FAMILIARES
- Manter respeito mútuo em todas as interações
- Separar questões pessoais de decisões empresariais
- Buscar diálogo construtivo para resolução de divergências

7. RESPONSABILIDADE SOCIAL
Cada membro deve ser exemplo de cidadania e responsabilidade social em suas ações públicas.

8. COMPLIANCE
Cumprimento rigoroso de todas as leis, regulamentações e normas aplicáveis às atividades familiares e empresariais.

9. DESENVOLVIMENTO CONTÍNUO
Compromisso com o aprendizado e desenvolvimento pessoal e profissional constante.

10. DENÚNCIAS
Canal aberto para reportar violações deste código, garantindo anonimato e proteção ao denunciante.`
  }
];

// Sample family rituals
const familyRituals = [
  {
    id: 1,
    name: "Assembleia Familiar Anual",
    description: "Reunião anual para revisão de valores, propósito e visão de futuro.",
    frequency: "Anual",
    lastDate: "12/12/2024",
    nextDate: "12/12/2025",
  },
  {
    id: 2,
    name: "Encontros de Mentoria Intergeracional",
    description: "Encontros trimestrais para troca de conhecimentos entre gerações.",
    frequency: "Trimestral",
    lastDate: "15/03/2025",
    nextDate: "15/06/2025",
  },
  {
    id: 3,
    name: "Celebração do Legado Familiar",
    description: "Celebração da história e contribuições da família para a sociedade.",
    frequency: "Anual",
    lastDate: "20/08/2024",
    nextDate: "20/08/2025",
  },
  {
    id: 4,
    name: "Reunião de Propósito",
    description: "Revisão do alinhamento entre propósitos individuais e o propósito familiar.",
    frequency: "Semestral",
    lastDate: "05/02/2025",
    nextDate: "05/08/2025",
  },
];

// Sample legacy timeline events
const legacyTimeline = [
  {
    id: 1,
    year: "1975",
    title: "Fundação",
    description: "Início da empresa familiar por José Silva."
  },
  {
    id: 2,
    year: "1990",
    title: "Expansão",
    description: "Expansão dos negócios para três estados."
  },
  {
    id: 3,
    year: "2005",
    title: "Sucessão - 2ª Geração",
    description: "Carlos Silva assume a liderança dos negócios."
  },
  {
    id: 4,
    year: "2015",
    title: "Protocolo Familiar",
    description: "Criação do primeiro documento de governança familiar."
  },
  {
    id: 5,
    year: "2020",
    title: "Fundação Familiar",
    description: "Criação da fundação para ações sociais e ambientais."
  },
  {
    id: 6,
    year: "2024",
    title: "Manifesto de Legado",
    description: "Formalização do propósito e valores fundamentais."
  },
];

const LegacyPage = () => {
  const [manifestoText, setManifestoText] = useState(
    "Nossa família tem como missão construir um legado sustentável baseado nos valores de integridade, excelência, cuidado com as pessoas e respeito ao meio ambiente. Acreditamos que nossa maior contribuição para o mundo está no desenvolvimento humano, começando por nós mesmos e se expandindo para todas as pessoas e comunidades que tocamos. Valorizamos a continuidade desses princípios através das gerações, com cada uma delas trazendo renovação e adaptação, mas mantendo a essência.\n\nComprometemo-nos com:\n\n1. Preservar e fortalecer os laços familiares através de rituais significativos e comunicação efetiva\n\n2. Desenvolver cada membro da família com foco em seu propósito individual e contribuição para o coletivo\n\n3. Gerir os negócios e patrimônio com responsabilidade e visão de longo prazo\n\n4. Promover impacto positivo na sociedade e no meio ambiente\n\n5. Equilibrar tradição e inovação, honrando o passado enquanto construímos o futuro"
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("manifesto");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const filteredRituals = familyRituals.filter(
    (ritual) =>
      ritual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ritual.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveManifesto = () => {
    toast({
      title: "Manifesto Salvo",
      description: "Seu Manifesto de Legado foi salvo com sucesso.",
    });
  };

  const handleVersionClick = (version: any) => {
    toast({
      title: `${version.title}`,
      description: `Versão de ${version.date} por ${version.author}`,
    });
  };

  const handleAddRitual = () => {
    toast({
      title: "Ritual Adicionado",
      description: "O novo ritual familiar foi adicionado com sucesso.",
    });
  };

  const handleViewDocument = (documentName: string) => {
    const document = documentTemplates.find(doc => doc.name === documentName);
    if (document) {
      setSelectedDocument(document);
      setIsDocumentModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Existencial e Legado" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500 mb-4 sm:mb-0">
                  Gestão Existencial e de Legado
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Buscar..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Tabs defaultValue="manifesto" onValueChange={setSelectedTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="manifesto">Manifesto de Legado</TabsTrigger>
                  <TabsTrigger value="rituais">Rituais Familiares</TabsTrigger>
                  <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
                </TabsList>

                <TabsContent value="manifesto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="bg-white p-6 rounded-lg border">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Manifesto de Legado</h3>
                          <Button onClick={handleSaveManifesto}>
                            <Save className="h-4 w-4 mr-2" /> Salvar
                          </Button>
                        </div>
                        <Textarea 
                          value={manifestoText}
                          onChange={(e) => setManifestoText(e.target.value)}
                          className="h-[500px] font-serif"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <div className="bg-white p-6 rounded-lg border mb-6">
                        <h3 className="text-lg font-medium mb-4">Versões Anteriores</h3>
                        <div className="space-y-3">
                          {legacyVersions.map((version) => (
                            <div 
                              key={version.id}
                              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                              onClick={() => handleVersionClick(version)}
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{version.title}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  version.status === "Ativo" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {version.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {version.date} • {version.author}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-medium mb-4">Documentos Relacionados</h3>
                        <div className="space-y-2">
                          {documentTemplates.map((doc) => (
                            <Button 
                              key={doc.id}
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => handleViewDocument(doc.name)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              {doc.name}
                            </Button>
                          ))}
                          
                          <div className="pt-4 mt-4 border-t">
                            <FileUpload 
                              label="Adicionar documento" 
                              multiple={false} 
                              accept=".pdf,.doc,.docx"
                            />
                          </div>
                        </div>

                        {/* Modal para visualização de documentos */}
                        <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
                          <DialogContent className="sm:max-w-[800px] h-[600px]">
                            <DialogHeader>
                              <DialogTitle>{selectedDocument?.name}</DialogTitle>
                              <DialogDescription>
                                {selectedDocument?.description}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto">
                              <div className="bg-gray-50 p-6 rounded-lg border">
                                <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                                  {selectedDocument?.content}
                                </pre>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDocumentModalOpen(false)}>
                                Fechar
                              </Button>
                              <Button onClick={() => {
                                toast({
                                  title: "Documento baixado",
                                  description: `${selectedDocument?.name} foi baixado com sucesso.`,
                                });
                              }}>
                                <FileText className="h-4 w-4 mr-2" />
                                Baixar PDF
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rituais">
                  <div className="flex justify-end mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Ritual
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Ritual Familiar</DialogTitle>
                          <DialogDescription>
                            Cadastre um novo ritual para a família
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="ritualName" className="text-right">
                              Nome
                            </label>
                            <Input id="ritualName" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="ritualDescription" className="text-right">
                              Descrição
                            </label>
                            <Textarea id="ritualDescription" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="ritualFrequency" className="text-right">
                              Frequência
                            </label>
                            <Input id="ritualFrequency" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="ritualNextDate" className="text-right">
                              Próxima Data
                            </label>
                            <Input id="ritualNextDate" type="date" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddRitual}>Adicionar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Frequência</TableHead>
                        <TableHead>Última Realização</TableHead>
                        <TableHead>Próxima Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRituals.map((ritual) => (
                        <TableRow key={ritual.id}>
                          <TableCell className="font-medium">{ritual.name}</TableCell>
                          <TableCell>{ritual.description}</TableCell>
                          <TableCell>{ritual.frequency}</TableCell>
                          <TableCell>{ritual.lastDate}</TableCell>
                          <TableCell>{ritual.nextDate}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Ver Detalhes
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="timeline">
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-6">Linha do Tempo do Legado Familiar</h3>
                    
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-legacy-200"></div>
                      
                      {/* Timeline events */}
                      <div className="space-y-8">
                        {legacyTimeline.map((event, index) => (
                          <div key={event.id} className="flex gap-4 relative">
                            <div className="w-12 text-right font-bold text-legacy-500">
                              {event.year}
                            </div>
                            <div className="w-8 flex items-center justify-center">
                              <div className="w-4 h-4 rounded-full bg-legacy-500 z-10"></div>
                            </div>
                            <div className="flex-1 bg-white p-4 rounded-lg border shadow-sm">
                              <h4 className="font-medium text-legacy-500">{event.title}</h4>
                              <p className="text-gray-600 mt-1">{event.description}</p>
                            </div>
                          </div>
                        ))}
                        
                        {/* Future event */}
                        <div className="flex gap-4 relative">
                          <div className="w-12 text-right font-bold text-gray-400">
                            Futuro
                          </div>
                          <div className="w-8 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full border-2 border-dashed border-legacy-300 bg-white z-10"></div>
                          </div>
                          <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-dashed border-legacy-200">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm">
                                  <Plus className="h-3 w-3 mr-1" /> Adicionar Marco
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                  <DialogTitle>Adicionar Marco Futuro</DialogTitle>
                                  <DialogDescription>
                                    Adicione um marco importante na linha do tempo do legado familiar
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="milestoneYear" className="text-right">
                                      Ano
                                    </label>
                                    <Input id="milestoneYear" type="number" className="col-span-3" placeholder="2026" />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="milestoneTitle" className="text-right">
                                      Título
                                    </label>
                                    <Input id="milestoneTitle" className="col-span-3" placeholder="Nome do marco" />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="milestoneDescription" className="text-right">
                                      Descrição
                                    </label>
                                    <Textarea id="milestoneDescription" className="col-span-3" placeholder="Descrição do marco" />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={() => {
                                    toast({
                                      title: "Marco Adicionado",
                                      description: "O marco foi adicionado à linha do tempo com sucesso.",
                                    });
                                  }}>
                                    Adicionar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LegacyPage;
