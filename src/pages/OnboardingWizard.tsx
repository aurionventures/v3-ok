import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Users,
  UserPlus,
  Calendar,
  Sparkles,
  X,
  Plus,
  Mail,
  Briefcase,
  Trash2,
  Bot,
  Clock,
  AlertCircle,
  Loader2,
  PartyPopper,
} from 'lucide-react';
import legacyLogo from '@/assets/legacy-logo-new.png';

import {
  TIPOS_CONSELHO,
  FREQUENCIA_REUNIOES,
  CARGOS_SUGERIDOS,
  ROLES,
  ESTADOS_BR,
  formatCNPJ,
  generateUUID,
  saveEmpresa,
  saveConselho,
  saveOnboardingData,
  getOnboardingData,
  clearOnboardingData,
  sendInvites,
  getEmpresas,
  getConselhos,
  generatePautaIA,
  saveUser,
  getUsers,
  Empresa,
  Conselho,
} from '@/data/signupData';

// Tipos
interface OnboardingData {
  [key: string]: unknown;
  // Step 1 - Empresa
  empresaId?: string;
  razaoSocial?: string;
  cnpj?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };

  // Step 2 - Conselho
  conselhoId?: string;
  conselhoNome?: string;
  conselhoTipo?: string;
  frequenciaReunioes?: string;
  conselhoDescricao?: string;

  // Step 3 - Membros
  membros?: Array<{
    nome: string;
    email: string;
    cargo: string;
    role: string;
  }>;
  mensagemConvite?: string;

  // Step 4 - Reunião
  dataReuniao?: string;
  horaReuniao?: string;
  usarPautaIA?: boolean;
  pautaTopicos?: string[];
}

// Steps
const STEPS = [
  { id: 1, title: 'Configurar Empresa', icon: Building2, description: 'Dados da sua empresa' },
  { id: 2, title: 'Criar Conselho', icon: Users, description: 'Estrutura de governança' },
  { id: 3, title: 'Adicionar Membros', icon: UserPlus, description: 'Convide sua equipe' },
  { id: 4, title: 'Primeira Reunião', icon: Calendar, description: 'Agende e comece' },
];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Dados do onboarding
  const [data, setData] = useState<OnboardingData>({
    membros: [{ nome: '', email: '', cargo: '', role: 'membro' }],
    usarPautaIA: true,
    pautaTopicos: [],
  });

  // Carregar dados salvos e do signup
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      setCurrentStep(parseInt(stepParam) || 1);
    }

    const savedData = getOnboardingData();
    const signupData = JSON.parse(localStorage.getItem('signup_data') || '{}');

    setData((prev) => ({
      ...prev,
      ...savedData,
      empresaId: signupData.empresaId || prev.empresaId,
    }));
  }, []);

  // Atualizar URL com step atual
  useEffect(() => {
    setSearchParams({ step: currentStep.toString() });
    saveOnboardingData(data);
  }, [currentStep]);

  // Progress bar
  const progress = (currentStep / STEPS.length) * 100;

  // Navegação
  const handleNext = async () => {
    if (currentStep === STEPS.length) {
      await handleComplete();
    } else {
      // Validar step atual antes de avançar
      if (!validateCurrentStep()) return;

      // Salvar dados do step atual
      await saveCurrentStep();

      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSkip = () => {
    setShowSkipModal(true);
  };

  const confirmSkip = () => {
    // Salvar onboarding como incompleto
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      // Não marca como completo
      toast.info('Você pode completar o onboarding a qualquer momento');
    }
    navigate('/dashboard');
  };

  // Validação por step
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!data.razaoSocial?.trim()) {
          toast.error('Preencha a Razão Social');
          return false;
        }
        return true;
      case 2:
        if (!data.conselhoNome?.trim()) {
          toast.error('Preencha o nome do conselho');
          return false;
        }
        if (!data.conselhoTipo) {
          toast.error('Selecione o tipo de conselho');
          return false;
        }
        return true;
      case 3:
        // Membros são opcionais
        return true;
      case 4:
        // Reunião é opcional
        return true;
      default:
        return true;
    }
  };

  // Salvar dados do step atual
  const saveCurrentStep = async () => {
    const signupData = JSON.parse(localStorage.getItem('signup_data') || '{}');

    switch (currentStep) {
      case 1:
        // Atualizar empresa
        const empresas = getEmpresas();
        const empresa = empresas.find((e) => e.id === signupData.empresaId);
        if (empresa) {
          empresa.razaoSocial = data.razaoSocial;
          empresa.cnpj = data.cnpj;
          empresa.endereco = data.endereco;
          saveEmpresa(empresa);
        }
        break;

      case 2:
        // Criar conselho
        const conselhoId = generateUUID();
        const novoConselho: Conselho = {
          id: conselhoId,
          empresaId: signupData.empresaId,
          nome: data.conselhoNome || '',
          tipo: data.conselhoTipo || '',
          descricao: data.conselhoDescricao,
          frequenciaReunioes: data.frequenciaReunioes || 'mensal',
          duracaoPadraoReuniao: 120,
          isActive: true,
          createdBy: signupData.userId,
        };
        saveConselho(novoConselho);
        setData((prev) => ({ ...prev, conselhoId }));
        break;

      case 3:
        // Enviar convites (se houver membros)
        const membrosValidos = data.membros?.filter(
          (m) => m.nome.trim() && m.email.trim()
        );
        if (membrosValidos && membrosValidos.length > 0) {
          sendInvites({
            conselhoId: data.conselhoId || '',
            empresaId: signupData.empresaId,
            invitedBy: signupData.userId,
            membros: membrosValidos.map((m) => ({
              nome: m.nome,
              email: m.email,
              cargo: m.cargo,
              role: m.role as 'admin_cliente' | 'viewer' | 'membro',
            })),
            mensagemPersonalizada: data.mensagemConvite,
          });
          toast.success(`${membrosValidos.length} convite(s) enviado(s)!`);
        }
        break;
    }

    saveOnboardingData(data);
  };

  // Completar onboarding
  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      await saveCurrentStep();

      // Gerar pauta IA se solicitado
      if (data.usarPautaIA && data.conselhoTipo) {
        const topicos = generatePautaIA(data.conselhoTipo);
        setData((prev) => ({ ...prev, pautaTopicos: topicos }));
      }

      // Marcar onboarding como completo
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        user.onboardingCompletedAt = new Date().toISOString();
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('onboarding_completed', 'true');

        // Atualizar no storage de users
        const users = getUsers();
        const userIndex = users.findIndex((u) => u.id === user.id);
        if (userIndex >= 0) {
          users[userIndex] = user;
          localStorage.setItem('legacy_users', JSON.stringify(users));
        }
      }

      clearOnboardingData();

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      toast.error('Erro ao completar onboarding');
      setIsSubmitting(false);
    }
  };

  // Adicionar membro
  const addMembro = () => {
    setData((prev) => ({
      ...prev,
      membros: [...(prev.membros || []), { nome: '', email: '', cargo: '', role: 'membro' }],
    }));
  };

  // Remover membro
  const removeMembro = (index: number) => {
    setData((prev) => ({
      ...prev,
      membros: prev.membros?.filter((_, i) => i !== index),
    }));
  };

  // Atualizar membro
  const updateMembro = (index: number, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      membros: prev.membros?.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    }));
  };

  // Renderizar step atual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  // Step 1: Configurar Empresa
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="razaoSocial">Razão Social *</Label>
          <Input
            id="razaoSocial"
            placeholder="Nome completo da empresa"
            value={data.razaoSocial || ''}
            onChange={(e) => setData((prev) => ({ ...prev, razaoSocial: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            placeholder="00.000.000/0000-00"
            value={data.cnpj || ''}
            onChange={(e) => setData((prev) => ({ ...prev, cnpj: formatCNPJ(e.target.value) }))}
            maxLength={18}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Endereço (opcional)</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="rua">Rua / Logradouro</Label>
            <Input
              id="rua"
              placeholder="Nome da rua"
              value={data.endereco?.rua || ''}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  endereco: { ...prev.endereco, rua: e.target.value },
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              placeholder="123"
              value={data.endereco?.numero || ''}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  endereco: { ...prev.endereco, numero: e.target.value },
                }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              placeholder="Sala, Andar..."
              value={data.endereco?.complemento || ''}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  endereco: { ...prev.endereco, complemento: e.target.value },
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              placeholder="Bairro"
              value={data.endereco?.bairro || ''}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  endereco: { ...prev.endereco, bairro: e.target.value },
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              placeholder="Cidade"
              value={data.endereco?.cidade || ''}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  endereco: { ...prev.endereco, cidade: e.target.value },
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={data.endereco?.estado || ''}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  endereco: { ...prev.endereco, estado: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_BR.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Criar Conselho
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="conselhoNome">Nome do Conselho/Comitê *</Label>
        <Input
          id="conselhoNome"
          placeholder="Ex: Conselho de Administração - Holding"
          value={data.conselhoNome || ''}
          onChange={(e) => setData((prev) => ({ ...prev, conselhoNome: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="conselhoTipo">Tipo *</Label>
          <Select
            value={data.conselhoTipo || ''}
            onValueChange={(value) => setData((prev) => ({ ...prev, conselhoTipo: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_CONSELHO.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequenciaReunioes">Frequência de Reuniões</Label>
          <Select
            value={data.frequenciaReunioes || ''}
            onValueChange={(value) => setData((prev) => ({ ...prev, frequenciaReunioes: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCIA_REUNIOES.map((freq) => (
                <SelectItem key={freq.value} value={freq.value}>
                  {freq.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="conselhoDescricao">Descrição (opcional)</Label>
        <Textarea
          id="conselhoDescricao"
          placeholder="Descreva brevemente o propósito e responsabilidades deste conselho..."
          value={data.conselhoDescricao || ''}
          onChange={(e) => setData((prev) => ({ ...prev, conselhoDescricao: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Dica</p>
            <p className="text-sm text-muted-foreground">
              Você poderá criar mais conselhos e comitês depois. Comece com o principal para testar a plataforma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: Adicionar Membros
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-accent/10 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <UserPlus className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Convide sua equipe</p>
            <p className="text-sm text-muted-foreground">
              Os membros receberão um email com link para criar conta e acessar o conselho.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.membros?.map((membro, index) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-3 space-y-2">
                <Label>Nome *</Label>
                <Input
                  placeholder="Nome completo"
                  value={membro.nome}
                  onChange={(e) => updateMembro(index, 'nome', e.target.value)}
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="email@empresa.com"
                  value={membro.email}
                  onChange={(e) => updateMembro(index, 'email', e.target.value)}
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <Label>Cargo</Label>
                <Select
                  value={membro.cargo}
                  onValueChange={(value) => updateMembro(index, 'cargo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARGOS_SUGERIDOS.map((cargo) => (
                      <SelectItem key={cargo} value={cargo}>
                        {cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label>Permissão</Label>
                <Select
                  value={membro.role}
                  onValueChange={(value) => updateMembro(index, 'role', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1">
                {data.membros && data.membros.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMembro(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addMembro} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar outro membro
      </Button>

      <div className="space-y-2">
        <Label htmlFor="mensagemConvite">Mensagem personalizada (opcional)</Label>
        <Textarea
          id="mensagemConvite"
          placeholder="Olá! Você foi convidado para fazer parte do nosso conselho..."
          value={data.mensagemConvite || ''}
          onChange={(e) => setData((prev) => ({ ...prev, mensagemConvite: e.target.value }))}
          rows={3}
        />
      </div>
    </div>
  );

  // Step 4: Primeira Reunião
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-primary/5 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Agende sua primeira reunião</p>
            <p className="text-sm text-muted-foreground">
              Crie a primeira reunião e deixe a IA gerar uma pauta inicial para você.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataReuniao">Data da Reunião</Label>
          <Input
            id="dataReuniao"
            type="date"
            value={data.dataReuniao || ''}
            onChange={(e) => setData((prev) => ({ ...prev, dataReuniao: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="horaReuniao">Horário</Label>
          <Input
            id="horaReuniao"
            type="time"
            value={data.horaReuniao || '14:00'}
            onChange={(e) => setData((prev) => ({ ...prev, horaReuniao: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t">
        <Checkbox
          id="usarPautaIA"
          checked={data.usarPautaIA}
          onCheckedChange={(checked) => setData((prev) => ({ ...prev, usarPautaIA: !!checked }))}
        />
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <Label htmlFor="usarPautaIA" className="cursor-pointer">
            Usar AI Engine para gerar pauta inicial
          </Label>
          <Badge variant="secondary" className="text-xs">
            Recomendado
          </Badge>
        </div>
      </div>

      {data.usarPautaIA && (
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Prévia da Pauta (gerada por IA)</p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                Aprovação da ata da reunião anterior
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                Revisão do planejamento estratégico
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                Análise de indicadores financeiros
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                Discussão sobre cenário macroeconômico
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                Assuntos gerais e encerramento
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              A pauta completa será gerada após criar a reunião
            </p>
          </CardContent>
        </Card>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <PartyPopper className="h-5 w-5 text-green-600" />
          <p className="font-medium text-green-800">Quase lá!</p>
        </div>
        <p className="text-sm text-green-700">
          Ao finalizar, você terá sua empresa configurada, conselho criado e convites enviados.
          Sua governança digital está pronta para começar!
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <img
            src={legacyLogo}
            alt="Legacy"
            className="h-10 mx-auto mb-6 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">Configure sua Governança</h1>
          <p className="text-muted-foreground">
            Complete o setup inicial em poucos minutos
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-3">
            <span>Etapa {currentStep} de {STEPS.length}</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id < currentStep
                    ? 'text-primary'
                    : step.id === currentStep
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step.id < currentStep
                      ? 'bg-primary text-white'
                      : step.id === currentStep
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {(() => {
                const StepIcon = STEPS[currentStep - 1].icon;
                return (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <StepIcon className="h-5 w-5 text-primary" />
                  </div>
                );
              })()}
              <div>
                <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>{renderStep()}</CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>

              <Button variant="outline" onClick={handleSkip}>
                Pular Agora
              </Button>
            </div>

            <Button onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Finalizando...
                </>
              ) : currentStep === STEPS.length ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Finalizar Onboarding
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Modal Skip */}
      <Dialog open={showSkipModal} onOpenChange={setShowSkipModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pular Onboarding?</DialogTitle>
            <DialogDescription>
              Tem certeza? Completar o onboarding agora garante que você aproveite 100% da Legacy OS.
              Você poderá completar depois, mas recomendamos fazer agora.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSkipModal(false)}>
              Continuar Onboarding
            </Button>
            <Button variant="ghost" onClick={confirmSkip}>
              Pular e Explorar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Sucesso */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="text-center">
          <div className="py-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="h-10 w-10 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl mb-2">Onboarding Completo!</DialogTitle>
              <DialogDescription className="text-base">
                Sua governança digital está configurada e pronta para uso.
                {data.membros?.some((m) => m.email) && (
                  <span className="block mt-2">
                    Os convites foram enviados para os membros do conselho.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-accent hover:bg-accent/90 text-primary-foreground"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Acessar Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
