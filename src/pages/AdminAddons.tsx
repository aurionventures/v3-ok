import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  BarChart3,
  Target,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

interface AddOn {
  id: string;
  key: string;
  label: string;
  description: string;
  type: "functional" | "analytical" | "strategic";
  price: number;
  minCompanySize: string | null;
  isPublic: boolean;
  isActive: boolean;
}

const initialAddons: AddOn[] = [
  {
    id: "1",
    key: "advanced_reports",
    label: "Relatórios Avançados",
    description: "Dashboards personalizados e exportação em múltiplos formatos",
    type: "analytical",
    price: 299,
    minCompanySize: "medium",
    isPublic: true,
    isActive: true,
  },
  {
    id: "2",
    key: "ai_insights",
    label: "Insights com IA",
    description: "Análise preditiva e recomendações automatizadas",
    type: "strategic",
    price: 499,
    minCompanySize: "large",
    isPublic: true,
    isActive: true,
  },
  {
    id: "3",
    key: "multi_company",
    label: "Multi-Empresa",
    description: "Gestão consolidada de múltiplas empresas do grupo",
    type: "functional",
    price: 799,
    minCompanySize: "enterprise",
    isPublic: false,
    isActive: true,
  },
  {
    id: "4",
    key: "api_access",
    label: "Acesso à API",
    description: "Integração com sistemas externos via REST API",
    type: "functional",
    price: 399,
    minCompanySize: "medium",
    isPublic: true,
    isActive: true,
  },
  {
    id: "5",
    key: "compliance_pack",
    label: "Pacote Compliance",
    description: "Módulos de conformidade regulatória e auditoria",
    type: "strategic",
    price: 599,
    minCompanySize: "large",
    isPublic: true,
    isActive: false,
  },
];

const AdminAddons = () => {
  const [addons, setAddons] = useState<AddOn[]>(initialAddons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddOn | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    label: "",
    description: "",
    type: "functional" as "functional" | "analytical" | "strategic",
    price: 0,
    minCompanySize: "",
    isPublic: true,
    isActive: true,
  });

  const getTypeBadge = (type: string) => {
    const config = {
      functional: { label: "Funcional", icon: Package, className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
      analytical: { label: "Analítico", icon: BarChart3, className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
      strategic: { label: "Estratégico", icon: Target, className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" },
    };
    const { label, icon: Icon, className } = config[type as keyof typeof config] || config.functional;
    return (
      <Badge variant="outline" className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getSizeBadge = (size: string | null) => {
    if (!size) return <span className="text-muted-foreground">—</span>;
    const labels: Record<string, string> = {
      small: "Pequena+",
      medium: "Média+",
      large: "Grande+",
      enterprise: "Enterprise",
    };
    return <Badge variant="secondary">{labels[size] || size}</Badge>;
  };

  const handleOpenModal = (addon?: AddOn) => {
    if (addon) {
      setEditingAddon(addon);
      setFormData({
        key: addon.key,
        label: addon.label,
        description: addon.description,
        type: addon.type,
        price: addon.price,
        minCompanySize: addon.minCompanySize || "",
        isPublic: addon.isPublic,
        isActive: addon.isActive,
      });
    } else {
      setEditingAddon(null);
      setFormData({
        key: "",
        label: "",
        description: "",
        type: "functional",
        price: 0,
        minCompanySize: "",
        isPublic: true,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.key || !formData.label) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (editingAddon) {
      setAddons(addons.map(a => 
        a.id === editingAddon.id 
          ? { ...a, ...formData, minCompanySize: formData.minCompanySize || null }
          : a
      ));
      toast.success("Add-on atualizado com sucesso");
    } else {
      const newAddon: AddOn = {
        id: Date.now().toString(),
        ...formData,
        minCompanySize: formData.minCompanySize || null,
      };
      setAddons([...addons, newAddon]);
      toast.success("Add-on criado com sucesso");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAddons(addons.filter(a => a.id !== id));
    toast.success("Add-on removido");
  };

  const handleToggleActive = (id: string) => {
    setAddons(addons.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };

  const activeCount = addons.filter(a => a.isActive).length;
  const publicCount = addons.filter(a => a.isPublic).length;
  const totalMRR = addons.filter(a => a.isActive).reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Add-ons" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Actions */}
            <div className="flex items-center justify-end">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenModal()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Add-on
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingAddon ? "Editar Add-on" : "Novo Add-on"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Chave *</Label>
                      <Input
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                        placeholder="ex: advanced_reports"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preço Mensal (R$) *</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nome *</Label>
                    <Input
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="Nome do add-on"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrição do add-on"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="functional">Funcional</SelectItem>
                          <SelectItem value="analytical">Analítico</SelectItem>
                          <SelectItem value="strategic">Estratégico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Porte Mínimo</Label>
                      <Select
                        value={formData.minCompanySize}
                        onValueChange={(value) => setFormData({ ...formData, minCompanySize: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sem restrição" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem restrição</SelectItem>
                          <SelectItem value="small">Pequena+</SelectItem>
                          <SelectItem value="medium">Média+</SelectItem>
                          <SelectItem value="large">Grande+</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                      />
                      <Label>Visível na Landing</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label>Ativo</Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    {editingAddon ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Add-ons Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {activeCount}
                  <span className="text-lg text-muted-foreground font-normal ml-1">
                    / {addons.length}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Públicos na Landing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{publicCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Potencial MRR Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  R$ {totalMRR.toLocaleString("pt-BR")}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Add-ons</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Add-on</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Porte Mínimo</TableHead>
                    <TableHead>Visibilidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addons.map((addon) => (
                    <TableRow key={addon.id} className={!addon.isActive ? "opacity-50" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{addon.label}</p>
                          <p className="text-sm text-muted-foreground">{addon.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(addon.type)}</TableCell>
                      <TableCell className="font-semibold">
                        R$ {addon.price.toLocaleString("pt-BR")}/mês
                      </TableCell>
                      <TableCell>{getSizeBadge(addon.minCompanySize)}</TableCell>
                      <TableCell>
                        {addon.isPublic ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <Eye className="h-3 w-3 mr-1" />
                            Público
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Interno
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={addon.isActive}
                          onCheckedChange={() => handleToggleActive(addon.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenModal(addon)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(addon.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddons;
