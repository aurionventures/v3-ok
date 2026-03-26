import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Download, CheckCircle2, XCircle, Clock, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export const MaterialsCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMeeting, setFilterMeeting] = useState("all");

  // Mock data - substituir por dados reais
  const materials = [
    {
      id: "1",
      name: "Relatório Financeiro Q4 2024.pdf",
      type: "Relatório",
      size: "2.4 MB",
      uploadedBy: "João Silva",
      uploadedAt: new Date(2025, 0, 18, 10, 30),
      meeting: "Reunião do Conselho - Janeiro",
      meetingId: "1",
      status: "pending",
      agendaItem: "Análise Financeira",
    },
    {
      id: "2",
      name: "Proposta de Orçamento 2025.xlsx",
      type: "Proposta",
      size: "1.8 MB",
      uploadedBy: "Maria Santos",
      uploadedAt: new Date(2025, 0, 18, 14, 15),
      meeting: "Reunião do Conselho - Janeiro",
      meetingId: "1",
      status: "approved",
      agendaItem: "Orçamento Anual",
    },
    {
      id: "3",
      name: "Apresentação Estratégia 2025.pptx",
      type: "Apresentação",
      size: "5.2 MB",
      uploadedBy: "Pedro Costa",
      uploadedAt: new Date(2025, 0, 19, 9, 0),
      meeting: "Comitê de Auditoria - Janeiro",
      meetingId: "2",
      status: "rejected",
      agendaItem: "Planejamento Estratégico",
      rejectionReason: "Faltam dados de mercado atualizados",
    },
    {
      id: "4",
      name: "Ata da Reunião Anterior.pdf",
      type: "Ata",
      size: "856 KB",
      uploadedBy: "Ana Lima",
      uploadedAt: new Date(2025, 0, 17, 16, 45),
      meeting: "Reunião do Conselho - Janeiro",
      meetingId: "1",
      status: "approved",
      agendaItem: "Aprovação da Ata",
    },
  ];

  const meetings = [
    { id: "1", name: "Reunião do Conselho - Janeiro" },
    { id: "2", name: "Comitê de Auditoria - Janeiro" },
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || material.status === filterStatus;
    const matchesMeeting = filterMeeting === "all" || material.meetingId === filterMeeting;
    
    return matchesSearch && matchesStatus && matchesMeeting;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-200 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleApprove = (materialId: string) => {
    toast.success("Material aprovado com sucesso");
  };

  const handleReject = (materialId: string) => {
    toast.error("Material rejeitado");
  };

  const handleDownload = (materialId: string, materialName: string) => {
    toast.success(`Download iniciado: ${materialName}`);
  };

  const pendingCount = materials.filter(m => m.status === "pending").length;
  const approvedCount = materials.filter(m => m.status === "approved").length;
  const rejectedCount = materials.filter(m => m.status === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Materiais</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos ({materials.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({pendingCount})</TabsTrigger>
          <TabsTrigger value="approved">Aprovados ({approvedCount})</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitados ({rejectedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou autor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="approved">Aprovados</SelectItem>
                      <SelectItem value="rejected">Rejeitados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Reunião</Label>
                  <Select value={filterMeeting} onValueChange={setFilterMeeting}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {meetings.map(meeting => (
                        <SelectItem key={meeting.id} value={meeting.id}>
                          {meeting.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Materials List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Materiais</CardTitle>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredMaterials.map(material => (
                  <div key={material.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">{material.name}</h4>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{material.type}</Badge>
                          <span>•</span>
                          <span>{material.size}</span>
                          <span>•</span>
                          <span>Por {material.uploadedBy}</span>
                          <span>•</span>
                          <span>{format(material.uploadedAt, "dd/MM/yyyy HH:mm")}</span>
                        </div>
                      </div>
                      {getStatusBadge(material.status)}
                    </div>

                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        <strong>Reunião:</strong> {material.meeting}
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Pauta:</strong> {material.agendaItem}
                      </p>
                      {material.status === "rejected" && material.rejectionReason && (
                        <p className="text-red-600 mt-1">
                          <strong>Motivo da rejeição:</strong> {material.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(material.id, material.name)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {material.status === "pending" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReject(material.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeitar
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApprove(material.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Aprovar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {filteredMaterials.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum material encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would filter by status */}
        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Mostrando apenas materiais pendentes de aprovação
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Mostrando apenas materiais aprovados
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Mostrando apenas materiais rejeitados
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
