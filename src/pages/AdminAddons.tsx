import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pencil,
  Trash2,
  Package,
  BarChart3,
  Target,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Users,
  Star,
  Leaf,
  Globe,
  Bot,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { ADDONS, AddOn as PricingAddOn } from "@/data/pricingData";

// Interface estendida para o Admin
interface AdminAddOn extends PricingAddOn {
  type: "functional" | "analytical" | "strategic";
  minCompanySize: string | null;
  isPublic: boolean;
  isActive: boolean;
}

// Mapear ícones
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  ClipboardList: ClipboardList,
  Users: Users,
  Star: Star,
  ShieldAlert: ShieldAlert,
  Leaf: Leaf,
  Globe: Globe,
  Bot: Bot,
};

// Mapear tipos por ID do addon
const TYPE_MAP: Record<string, AdminAddOn['type']> = {
  'projetos': 'strategic',
  'pessoas': 'functional',
  'desempenho': 'analytical',
  'riscos': 'strategic',
  'esg': 'strategic',
  'inteligencia': 'analytical',
  'agentes-ai': 'strategic',
};

// Mapear porte mínimo por ID
const SIZE_MAP: Record<string, string | null> = {
  'projetos': 'large',
  'pessoas': 'medium',
  'desempenho': 'medium',
  'riscos': 'medium',
  'esg': 'large',
  'inteligencia': 'large',
  'agentes-ai': 'enterprise',
};

// Converter ADDONS do pricingData para formato Admin
const convertToAdminAddons = (): AdminAddOn[] => {
  // Carregar overrides do localStorage
  const overrides = JSON.parse(localStorage.getItem('admin_addons_overrides') || '{}');
  
  return ADDONS.map(addon => ({
    ...addon,
    type: overrides[addon.id]?.type || TYPE_MAP[addon.id] || 'functional',
    minCompanySize: overrides[addon.id]?.minCompanySize ?? SIZE_MAP[addon.id] ?? null,
    isPublic: overrides[addon.id]?.isPublic ?? true,
    isActive: overrides[addon.id]?.isActive ?? true,
  }));
};

const AdminAddons = () => {
  const [addons, setAddons] = useState<AdminAddOn[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AdminAddOn | null>(null);
  const [formData, setFormData] = useState({
    type: "functional" as "functional" | "analytical" | "strategic",
    minCompanySize: "",
    isPublic: true,
    isActive: true,
  });

  // Carregar addons na inicialização
  useEffect(() => {
    setAddons(convertToAdminAddons());
  }, []);

  // Salvar overrides no localStorage
  const saveOverrides = (updatedAddons: AdminAddOn[]) => {
    const overrides: Record<string, Partial<AdminAddOn>> = {};
    updatedAddons.forEach(addon => {
      overrides[addon.id] = {
        type: addon.type,
        minCompanySize: addon.minCompanySize,
        isPublic: addon.isPublic,
        isActive: addon.isActive,
      };
    });
    localStorage.setItem('admin_addons_overrides', JSON.stringify(overrides));
  };

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
    if (!size) return <span className="text-muted-foreground">Todos</span>;
    const labels: Record<string, string> = {
      small: "Pequena+",
      medium: "Média+",
      large: "Grande+",
      enterprise: "Enterprise",
    };
    return <Badge variant="secondary">{labels[size] || size}</Badge>;
  };

  const getAddonIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5 text-primary" /> : <Package className="h-5 w-5 text-primary" />;
  };

  const handleOpenModal = (addon: AdminAddOn) => {
    setEditingAddon(addon);
    setFormData({
      type: addon.type,
      minCompanySize: addon.minCompanySize || "",
      isPublic: addon.isPublic,
      isActive: addon.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingAddon) return;

    const updatedAddons = addons.map(a => 
      a.id === editingAddon.id 
        ? { 
            ...a, 
            type: formData.type,
            minCompanySize: formData.minCompanySize || null,
            isPublic: formData.isPublic,
            isActive: formData.isActive,
          }
        : a
    );
    
    setAddons(updatedAddons);
    saveOverrides(updatedAddons);
    toast.success("Add-on atualizado com sucesso");
    setIsModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    const updatedAddons = addons.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    );
    setAddons(updatedAddons);
    saveOverrides(updatedAddons);
    toast.success("Status atualizado");
  };

  const handleTogglePublic = (id: string) => {
    const updatedAddons = addons.map(a => 
      a.id === id ? { ...a, isPublic: !a.isPublic } : a
    );
    setAddons(updatedAddons);
    saveOverrides(updatedAddons);
    toast.success("Visibilidade atualizada");
  };

  const handleResetToDefaults = () => {
    localStorage.removeItem('admin_addons_overrides');
    setAddons(convertToAdminAddons());
    toast.success("Configurações resetadas para o padrão");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Add-ons" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Info Banner */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardContent className="flex items-start gap-4 p-4">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Sincronizado com Landing Page
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Os add-ons e preços são gerenciados centralmente em <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">pricingData.ts</code>. 
                    Aqui você pode configurar visibilidade, tipo e porte mínimo para cada add-on.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetToDefaults} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Resetar
                </Button>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Add-ons Disponíveis
                </CardTitle>
                <CardDescription>
                  {addons.length} módulos premium sincronizados com a landing page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Add-on</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Preço Mensal</TableHead>
                      <TableHead>Preço Anual</TableHead>
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
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              {getAddonIcon(addon.icone)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{addon.nome}</p>
                                {addon.popular && (
                                  <Badge variant="secondary" className="text-xs">Popular</Badge>
                                )}
                                {addon.novo && (
                                  <Badge className="text-xs bg-green-500">Novo</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {addon.descricao}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(addon.type)}</TableCell>
                        <TableCell className="font-semibold">
                          R$ {addon.precoMensal.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          R$ {addon.precoAnual.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>{getSizeBadge(addon.minCompanySize)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={addon.isPublic}
                              onCheckedChange={() => handleTogglePublic(addon.id)}
                              disabled={!addon.isActive}
                            />
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
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={addon.isActive}
                              onCheckedChange={() => handleToggleActive(addon.id)}
                            />
                            {addon.isActive ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenModal(addon)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
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

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingAddon && getAddonIcon(editingAddon.icone)}
              Configurar Add-on
            </DialogTitle>
            <DialogDescription>
              {editingAddon?.nome} - R$ {editingAddon?.precoMensal.toLocaleString("pt-BR")}/mês
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Preços são gerenciados em <code>pricingData.ts</code>. 
                Aqui você configura apenas visibilidade e categorização.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Add-on</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="functional">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      Funcional
                    </div>
                  </SelectItem>
                  <SelectItem value="analytical">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                      Analítico
                    </div>
                  </SelectItem>
                  <SelectItem value="strategic">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-500" />
                      Estratégico
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Porte Mínimo da Empresa</Label>
              <Select
                value={formData.minCompanySize || "none"}
                onValueChange={(value) => setFormData({ ...formData, minCompanySize: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sem restrição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem restrição (todos)</SelectItem>
                  <SelectItem value="small">Pequena+ (R$ 10M+)</SelectItem>
                  <SelectItem value="medium">Média+ (R$ 50M+)</SelectItem>
                  <SelectItem value="large">Grande+ (R$ 300M+)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (R$ 1B+)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Define o porte mínimo de empresa que pode contratar este add-on
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
                <div>
                  <Label>Visível na Landing</Label>
                  <p className="text-xs text-muted-foreground">
                    Exibir na página de preços
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <div>
                  <Label>Add-on Ativo</Label>
                  <p className="text-xs text-muted-foreground">
                    Disponível para contratação
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Configuração
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAddons;
