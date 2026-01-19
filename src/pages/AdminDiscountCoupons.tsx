/**
 * Página Admin: Gestão de Cupons de Desconto
 * Permite criar, editar, ativar/desativar e monitorar cupons de desconto
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Ticket,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react";
import {
  DiscountCoupon,
  CouponUsage,
  DiscountType,
  CouponStatus,
  generateCouponToken,
  validateCoupon,
} from "@/types/discountCoupon";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PLANS } from "@/data/pricingData";

const STORAGE_KEY = "discount_coupons";
const USAGE_STORAGE_KEY = "coupon_usage";

export default function AdminDiscountCoupons() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [usage, setUsage] = useState<CouponUsage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<CouponStatus | "all">("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isQuickGeneratorOpen, setIsQuickGeneratorOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<DiscountCoupon | null>(null);
  const [selectedCouponForDelete, setSelectedCouponForDelete] = useState<string | null>(null);

  // Quick generator state
  const [quickDiscount, setQuickDiscount] = useState<number>(10);
  const [quickValidDays, setQuickValidDays] = useState<number>(30);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<DiscountCoupon>>({
    name: "",
    discountType: "percentage",
    discountValue: 0,
    minPurchaseValue: undefined,
    maxDiscountValue: undefined,
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 dias
    maxUses: undefined,
    applicablePlans: [],
    applicablePortes: [],
    status: "active",
  });

  useEffect(() => {
    loadCoupons();
    loadUsage();
  }, []);

  const loadCoupons = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCoupons(parsed);
      }
    } catch (error) {
      console.error("Erro ao carregar cupons:", error);
      toast.error("Erro ao carregar cupons");
    }
  };

  const loadUsage = () => {
    try {
      const stored = localStorage.getItem(USAGE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUsage(parsed);
      }
    } catch (error) {
      console.error("Erro ao carregar uso de cupons:", error);
    }
  };

  const saveCoupons = (updatedCoupons: DiscountCoupon[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCoupons));
      setCoupons(updatedCoupons);
    } catch (error) {
      console.error("Erro ao salvar cupons:", error);
      toast.error("Erro ao salvar cupons");
    }
  };

  const handleEdit = () => {
    if (!selectedCoupon || !formData.name || !formData.discountValue) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const updated = coupons.map((c) =>
      c.id === selectedCoupon.id
        ? {
            ...c,
            name: formData.name!,
            discountType: formData.discountType || "percentage",
            discountValue: formData.discountValue!,
            minPurchaseValue: formData.minPurchaseValue,
            maxDiscountValue: formData.maxDiscountValue,
            validFrom: new Date(formData.validFrom!).toISOString(),
            validUntil: new Date(formData.validUntil!).toISOString(),
            maxUses: formData.maxUses,
            applicablePlans: formData.applicablePlans || [],
            applicablePortes: formData.applicablePortes || [],
            status: formData.status || "active",
            updatedAt: new Date().toISOString(),
          }
        : c
    );

    saveCoupons(updated);
    toast.success("Cupom atualizado com sucesso!");
    setIsEditDialogOpen(false);
    setSelectedCoupon(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedCouponForDelete) return;

    const updated = coupons.filter((c) => c.id !== selectedCouponForDelete);
    saveCoupons(updated);
    toast.success("Cupom excluído com sucesso!");
    setIsDeleteDialogOpen(false);
    setSelectedCouponForDelete(null);
  };

  const handleToggleStatus = (couponId: string) => {
    const updated = coupons.map((c) =>
      c.id === couponId
        ? {
            ...c,
            status: c.status === "active" ? "inactive" : "active",
            updatedAt: new Date().toISOString(),
          }
        : c
    );
    saveCoupons(updated);
    toast.success("Status do cupom atualizado");
  };

  const openEditDialog = (coupon: DiscountCoupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      name: coupon.name,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchaseValue: coupon.minPurchaseValue,
      maxDiscountValue: coupon.maxDiscountValue,
      validFrom: format(new Date(coupon.validFrom), "yyyy-MM-dd"),
      validUntil: format(new Date(coupon.validUntil), "yyyy-MM-dd"),
      maxUses: coupon.maxUses,
      applicablePlans: coupon.applicablePlans || [],
      applicablePortes: coupon.applicablePortes || [],
      status: coupon.status,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      discountType: "percentage",
      discountValue: 0,
      minPurchaseValue: undefined,
      maxDiscountValue: undefined,
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      maxUses: undefined,
      applicablePlans: [],
      applicablePortes: [],
      status: "active",
    });
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copiado para a área de transferência!");
  };

  const handleQuickGenerate = () => {
    if (!quickDiscount || quickDiscount <= 0) {
      toast.error("Digite um percentual de desconto válido");
      return;
    }

    if (!quickValidDays || quickValidDays <= 0) {
      toast.error("Digite uma validade válida");
      return;
    }

    const token = generateCouponToken();
    const validFrom = new Date();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + quickValidDays);

    const newCoupon: DiscountCoupon = {
      id: crypto.randomUUID(),
      token: token,
      name: `Desconto ${quickDiscount}% - ${quickValidDays} dias`,
      discountType: "percentage",
      discountValue: quickDiscount,
      minPurchaseValue: undefined,
      maxDiscountValue: undefined,
      validFrom: validFrom.toISOString(),
      validUntil: validUntil.toISOString(),
      maxUses: undefined,
      currentUses: 0,
      applicablePlans: [],
      applicablePortes: [],
      status: "active",
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...coupons, newCoupon];
    saveCoupons(updated);
    setGeneratedToken(token);
    toast.success(`Cupom criado com sucesso! Token: ${token}`);
    
    // Reset form
    setTimeout(() => {
      setQuickDiscount(10);
      setQuickValidDays(30);
      setGeneratedToken(null);
      setIsQuickGeneratorOpen(false);
    }, 3000);
  };

  const getStatusBadge = (coupon: DiscountCoupon) => {
    const now = new Date();
    const validUntil = new Date(coupon.validUntil);
    const isExpired = now > validUntil;
    const isUsedUp = coupon.maxUses && coupon.currentUses >= coupon.maxUses;

    if (isExpired || isUsedUp) {
      return (
        <Badge variant="destructive" className="text-xs">
          <XCircle className="h-3 w-3 mr-1" />
          {isExpired ? "Expirado" : "Esgotado"}
        </Badge>
      );
    }

    if (coupon.status === "active") {
      return (
        <Badge variant="default" className="bg-green-600 text-xs">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Ativo
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="text-xs">
        <Clock className="h-3 w-3 mr-1" />
        Inativo
      </Badge>
    );
  };

  const getCouponUsage = (couponId: string) => {
    return usage.filter((u) => u.couponId === couponId);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.token.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || coupon.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.status === "active").length,
    totalUses: usage.length,
    totalDiscount: usage.reduce((sum, u) => sum + u.discountApplied, 0),
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Ticket className="h-8 w-8 text-primary" />
                  Cupons de Desconto
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gerencie cupons de desconto e monitore seu uso
                </p>
              </div>
              <Button onClick={() => setIsQuickGeneratorOpen(true)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Cupom
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Cupons</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <Ticket className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Cupons Ativos</p>
                      <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Usos</p>
                      <p className="text-2xl font-bold">{stats.totalUses}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Desconto Total</p>
                      <p className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(stats.totalDiscount)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou token..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="expired">Expirado</SelectItem>
                      <SelectItem value="used_up">Esgotado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Cupons</CardTitle>
                <CardDescription>
                  {filteredCoupons.length} cupom{filteredCoupons.length !== 1 ? "s" : ""} encontrado
                  {filteredCoupons.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Desconto</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead>Usos</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCoupons.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Nenhum cupom encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCoupons.map((coupon) => {
                          const couponUsage = getCouponUsage(coupon.id);
                          return (
                            <TableRow key={coupon.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                    {coupon.token}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToken(coupon.token)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{coupon.name}</TableCell>
                              <TableCell>
                                {coupon.discountType === "percentage" ? (
                                  <span className="font-semibold text-green-600">
                                    {coupon.discountValue}%
                                  </span>
                                ) : (
                                  <span className="font-semibold text-green-600">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(coupon.discountValue)}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>
                                    {format(new Date(coupon.validFrom), "dd/MM/yyyy", {
                                      locale: ptBR,
                                    })}
                                  </div>
                                  <div className="text-muted-foreground">
                                    até{" "}
                                    {format(new Date(coupon.validUntil), "dd/MM/yyyy", {
                                      locale: ptBR,
                                    })}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {coupon.currentUses}
                                  {coupon.maxUses && ` / ${coupon.maxUses}`}
                                </div>
                                {couponUsage.length > 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    {couponUsage.length} uso{couponUsage.length !== 1 ? "s" : ""}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{getStatusBadge(coupon)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditDialog(coupon)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleStatus(coupon.id)}
                                  >
                                    {coupon.status === "active" ? (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    ) : (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCouponForDelete(coupon.id);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cupom</DialogTitle>
            <DialogDescription>
              Atualize as informações do cupom. O token não pode ser alterado.
            </DialogDescription>
          </DialogHeader>
          <CouponForm formData={formData} setFormData={setFormData} isEdit={true} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cupom</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cupom? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Generator Dialog */}
      <Dialog open={isQuickGeneratorOpen} onOpenChange={setIsQuickGeneratorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Gerador Rápido de Cupom
            </DialogTitle>
            <DialogDescription>
              Gere um cupom de desconto rapidamente com apenas os dados essenciais
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {generatedToken ? (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700 dark:text-green-300">
                    Cupom gerado com sucesso!
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Token do Cupom</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border rounded-md font-mono text-sm font-bold">
                        {generatedToken}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToken(generatedToken)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    O cupom foi criado e está ativo. Você pode editá-lo na lista de cupons.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="quickDiscount">
                    Percentual de Desconto (%) *
                  </Label>
                  <Input
                    id="quickDiscount"
                    type="number"
                    min="1"
                    max="100"
                    value={quickDiscount}
                    onChange={(e) => setQuickDiscount(parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quickValidDays">
                    Validade (dias) *
                  </Label>
                  <Input
                    id="quickValidDays"
                    type="number"
                    min="1"
                    value={quickValidDays}
                    onChange={(e) => setQuickValidDays(parseInt(e.target.value) || 0)}
                    placeholder="Ex: 30"
                  />
                  <p className="text-xs text-muted-foreground">
                    O cupom será válido por {quickValidDays} dia{quickValidDays !== 1 ? "s" : ""} a partir de hoje
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Desconto:</span>
                      <span className="font-semibold">{quickDiscount}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Válido até:</span>
                      <span className="font-semibold">
                        {format(
                          new Date(Date.now() + quickValidDays * 24 * 60 * 60 * 1000),
                          "dd/MM/yyyy",
                          { locale: ptBR }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            {generatedToken ? (
              <Button onClick={() => {
                setGeneratedToken(null);
                setIsQuickGeneratorOpen(false);
              }}>
                Fechar
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsQuickGeneratorOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleQuickGenerate}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Cupom
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente de formulário reutilizável
function CouponForm({
  formData,
  setFormData,
  isEdit = false,
}: {
  formData: Partial<DiscountCoupon>;
  setFormData: (data: Partial<DiscountCoupon>) => void;
  isEdit?: boolean;
}) {
  const [selectedPlans, setSelectedPlans] = useState<string[]>(formData.applicablePlans || []);
  const [selectedPortes, setSelectedPortes] = useState<string[]>(
    formData.applicablePortes || []
  );

  const portes = [
    { value: "smb", label: "SMB" },
    { value: "smb_plus", label: "SMB+" },
    { value: "mid_market", label: "Mid-Market" },
    { value: "large", label: "Large" },
    { value: "enterprise", label: "Enterprise" },
  ];

  useEffect(() => {
    setFormData({ ...formData, applicablePlans: selectedPlans, applicablePortes: selectedPortes });
  }, [selectedPlans, selectedPortes]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Cupom *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Black Friday 2024"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountType">Tipo de Desconto *</Label>
          <Select
            value={formData.discountType}
            onValueChange={(v) => setFormData({ ...formData, discountType: v as DiscountType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentual (%)</SelectItem>
              <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discountValue">
            Valor do Desconto *{" "}
            {formData.discountType === "percentage" ? "(%)" : "(R$)"}
          </Label>
          <Input
            id="discountValue"
            type="number"
            min="0"
            step={formData.discountType === "percentage" ? "1" : "0.01"}
            value={formData.discountValue || 0}
            onChange={(e) =>
              setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        {formData.discountType === "percentage" && (
          <div className="space-y-2">
            <Label htmlFor="maxDiscountValue">Valor Máximo de Desconto (R$)</Label>
            <Input
              id="maxDiscountValue"
              type="number"
              min="0"
              step="0.01"
              value={formData.maxDiscountValue || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxDiscountValue: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="Opcional"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minPurchaseValue">Valor Mínimo de Compra (R$)</Label>
          <Input
            id="minPurchaseValue"
            type="number"
            min="0"
            step="0.01"
            value={formData.minPurchaseValue || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                minPurchaseValue: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            placeholder="Opcional"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxUses">Máximo de Usos</Label>
          <Input
            id="maxUses"
            type="number"
            min="1"
            value={formData.maxUses || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxUses: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="Ilimitado se vazio"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="validFrom">Válido de *</Label>
          <Input
            id="validFrom"
            type="date"
            value={formData.validFrom || ""}
            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="validUntil">Válido até *</Label>
          <Input
            id="validUntil"
            type="date"
            value={formData.validUntil || ""}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Planos Aplicáveis</Label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
          {PLANS.map((plan) => (
            <div key={plan.id} className="flex items-center space-x-2">
              <Checkbox
                id={`plan-${plan.id}`}
                checked={selectedPlans.includes(plan.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedPlans([...selectedPlans, plan.id]);
                  } else {
                    setSelectedPlans(selectedPlans.filter((p) => p !== plan.id));
                  }
                }}
              />
              <Label htmlFor={`plan-${plan.id}`} className="text-sm cursor-pointer">
                {plan.nome}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Deixe vazio para aplicar a todos os planos
        </p>
      </div>

      <div className="space-y-2">
        <Label>Portes Aplicáveis</Label>
        <div className="grid grid-cols-2 gap-2 border rounded-md p-2">
          {portes.map((porte) => (
            <div key={porte.value} className="flex items-center space-x-2">
              <Checkbox
                id={`porte-${porte.value}`}
                checked={selectedPortes.includes(porte.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedPortes([...selectedPortes, porte.value]);
                  } else {
                    setSelectedPortes(selectedPortes.filter((p) => p !== porte.value));
                  }
                }}
              />
              <Label htmlFor={`porte-${porte.value}`} className="text-sm cursor-pointer">
                {porte.label}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Deixe vazio para aplicar a todos os portes
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(v) => setFormData({ ...formData, status: v as CouponStatus })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
