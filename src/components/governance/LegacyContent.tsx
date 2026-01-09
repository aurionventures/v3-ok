import React, { useState } from "react";
import { Save, Calendar, FileText, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  { id: 1, title: "Manifesto de Legado v3.0", date: "15/04/2025", author: "Carlos Silva", status: "Ativo" },
  { id: 2, title: "Manifesto de Legado v2.5", date: "10/01/2025", author: "Carlos Silva", status: "Arquivado" },
  { id: 3, title: "Manifesto de Legado v2.0", date: "05/07/2024", author: "Carlos Silva", status: "Arquivado" },
];

// Templates para documentos relacionados
const documentTemplates = [
  { id: 1, name: "Protocolo de Governança", description: "Documento que estabelece as regras e diretrizes para a participação dos proprietários no negócio" },
  { id: 2, name: "Carta de Valores", description: "Documento que expressa os valores fundamentais que norteiam a família" },
  { id: 3, name: "Código de Conduta", description: "Normas de comportamento e diretrizes éticas para todos os membros da família" }
];

// Sample family rituals
const familyRituals = [
  { id: 1, name: "Assembleia de Proprietários Anual", description: "Reunião anual para revisão de valores, propósito e visão de futuro.", frequency: "Anual", lastDate: "12/12/2024", nextDate: "12/12/2025" },
  { id: 2, name: "Encontros de Mentoria Intergeracional", description: "Encontros trimestrais para troca de conhecimentos entre gerações.", frequency: "Trimestral", lastDate: "15/03/2025", nextDate: "15/06/2025" },
  { id: 3, name: "Celebração do Legado Empresarial", description: "Celebração da história e contribuições da empresa para a sociedade.", frequency: "Anual", lastDate: "20/08/2024", nextDate: "20/08/2025" },
  { id: 4, name: "Reunião de Propósito", description: "Revisão do alinhamento entre propósitos individuais e o propósito corporativo.", frequency: "Semestral", lastDate: "05/02/2025", nextDate: "05/08/2025" },
];

// Sample legacy timeline events
const legacyTimeline = [
  { id: 1, year: "1975", title: "Fundação", description: "Início da empresa familiar por José Silva." },
  { id: 2, year: "1990", title: "Expansão", description: "Expansão dos negócios para três estados." },
  { id: 3, year: "2005", title: "Sucessão - 2ª Geração", description: "Carlos Silva assume a liderança dos negócios." },
  { id: 4, year: "2015", title: "Protocolo Familiar", description: "Criação do primeiro documento de governança familiar." },
  { id: 5, year: "2020", title: "Fundação Familiar", description: "Criação da fundação para ações sociais e ambientais." },
  { id: 6, year: "2024", title: "Manifesto de Legado", description: "Formalização do propósito e valores fundamentais." },
];

const LegacyContent = () => {
  const [manifestoText, setManifestoText] = useState(
    "Nossa família tem como missão construir um legado sustentável baseado nos valores de integridade, excelência, cuidado com as pessoas e respeito ao meio ambiente."
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const filteredRituals = familyRituals.filter(
    (ritual) =>
      ritual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ritual.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveManifesto = () => {
    toast({ title: "Manifesto Salvo", description: "Seu Manifesto de Legado foi salvo com sucesso." });
  };

  const handleVersionClick = (version: any) => {
    toast({ title: version.title, description: `Versão de ${version.date} por ${version.author}` });
  };

  const handleAddRitual = () => {
    toast({ title: "Ritual Adicionado", description: "O novo ritual familiar foi adicionado com sucesso." });
  };

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setIsDocumentModalOpen(true);
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Input
            type="search"
            placeholder="Buscar..."
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="manifesto">
          <TabsList className="mb-4">
            <TabsTrigger value="manifesto">Manifesto</TabsTrigger>
            <TabsTrigger value="rituais">Rituais</TabsTrigger>
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          </TabsList>

          <TabsContent value="manifesto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Manifesto de Legado</h4>
                  <Button size="sm" onClick={handleSaveManifesto}>
                    <Save className="h-4 w-4 mr-2" /> Salvar
                  </Button>
                </div>
                <Textarea 
                  value={manifestoText}
                  onChange={(e) => setManifestoText(e.target.value)}
                  className="h-[300px] font-serif"
                />
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Versões Anteriores</h4>
                  <div className="space-y-2">
                    {legacyVersions.map((version) => (
                      <div 
                        key={version.id}
                        className="p-2 border rounded cursor-pointer hover:bg-muted/50"
                        onClick={() => handleVersionClick(version)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{version.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            version.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                          }`}>
                            {version.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{version.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Documentos Relacionados</h4>
                  <div className="space-y-2">
                    {documentTemplates.map((doc) => (
                      <Button 
                        key={doc.id}
                        variant="outline" 
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {doc.name}
                      </Button>
                    ))}
                    <div className="pt-3 border-t mt-3">
                      <FileUpload label="Adicionar documento" multiple={false} accept=".pdf,.doc,.docx" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rituais">
            <div className="flex justify-end mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Adicionar Ritual</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Ritual</DialogTitle>
                    <DialogDescription>Cadastre um novo ritual corporativo</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Nome do ritual" />
                    <Textarea placeholder="Descrição" />
                    <Input placeholder="Frequência" />
                    <Input type="date" />
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
                  <TableHead>Frequência</TableHead>
                  <TableHead>Última</TableHead>
                  <TableHead>Próxima</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRituals.map((ritual) => (
                  <TableRow key={ritual.id}>
                    <TableCell className="font-medium">{ritual.name}</TableCell>
                    <TableCell>{ritual.frequency}</TableCell>
                    <TableCell>{ritual.lastDate}</TableCell>
                    <TableCell>{ritual.nextDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="timeline">
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border"></div>
              <div className="space-y-6">
                {legacyTimeline.map((event) => (
                  <div key={event.id} className="flex gap-4 relative">
                    <div className="absolute left-[-22px] w-4 h-4 rounded-full bg-primary z-10"></div>
                    <div className="flex-1 p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-primary">{event.year}</span>
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 relative">
                  <div className="absolute left-[-22px] w-4 h-4 rounded-full border-2 border-dashed border-primary bg-background z-10"></div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-3 w-3 mr-1" /> Adicionar Marco
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedDocument?.name}</DialogTitle>
              <DialogDescription>{selectedDocument?.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDocumentModalOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LegacyContent;
