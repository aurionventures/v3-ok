import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Building2, 
  Users, 
  Shield,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  SkipForward
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import legacyLogo from "@/assets/legacy-logo-new.png";

type SetupStep = 'empresa' | 'colaborador' | 'orgao';

const STEPS: SetupStep[] = ['empresa', 'colaborador', 'orgao'];

const SETORES = [
  'Tecnologia',
  'Indústria',
  'Comércio',
  'Serviços',
  'Agronegócio',
  'Saúde',
  'Educação',
  'Financeiro',
  'Construção',
  'Outro'
];

const CARGOS = [
  'Secretário(a) Executivo(a)',
  'Diretor(a) Administrativo(a)',
  'Controller',
  'Assessor(a) de Governança',
  'Outro'
];

const ORGAOS = [
  { id: 'conselho-admin', name: 'Conselho de Administração', description: 'Órgão deliberativo de maior hierarquia' },
  { id: 'conselho-consultivo', name: 'Conselho Consultivo', description: 'Órgão de apoio estratégico aos gestores' },
  { id: 'comite-auditoria', name: 'Comitê de Auditoria', description: 'Responsável por controles e compliance' },
  { id: 'outro', name: 'Outro', description: 'Criar órgão personalizado' }
];

export default function InitialSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SetupStep>('empresa');
  
  // Form data
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [setor, setSetor] = useState('');
  const [colaboradorEmail, setColaboradorEmail] = useState('');
  const [colaboradorCargo, setColaboradorCargo] = useState('');
  const [orgaoSelecionado, setOrgaoSelecionado] = useState('');

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  // Load quiz data for defaults
  useState(() => {
    const quizData = JSON.parse(localStorage.getItem('quiz_result') || '{}');
    if (quizData.empresaNome) {
      setNomeFantasia(quizData.empresaNome);
    }
  });

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    } else {
      // Finish setup
      navigate('/plan-activation');
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'empresa':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Dados da Empresa</h2>
              <p className="text-muted-foreground">Configure as informações básicas da sua organização</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Logo da Empresa (opcional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Clique para fazer upload ou arraste aqui
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG até 2MB
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                <Input 
                  id="nomeFantasia"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  placeholder="Ex: TechCorp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setor">Setor de Atuação</Label>
                <Select value={setor} onValueChange={setSetor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {SETORES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'colaborador':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Convidar Colaborador</h2>
              <p className="text-muted-foreground">Convide seu primeiro colaborador para a plataforma</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="colaboradorEmail">E-mail do Colaborador</Label>
                <Input 
                  id="colaboradorEmail"
                  type="email"
                  value={colaboradorEmail}
                  onChange={(e) => setColaboradorEmail(e.target.value)}
                  placeholder="colaborador@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="colaboradorCargo">Cargo</Label>
                <Select value={colaboradorCargo} onValueChange={setColaboradorCargo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARGOS.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Você pode adicionar mais usuários depois em Configurações &gt; Usuários
                </p>
              </div>
            </div>
          </div>
        );

      case 'orgao':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Primeiro Órgão de Governança</h2>
              <p className="text-muted-foreground">Qual órgão você deseja criar primeiro?</p>
            </div>

            <RadioGroup
              value={orgaoSelecionado}
              onValueChange={setOrgaoSelecionado}
              className="space-y-3"
            >
              {ORGAOS.map((orgao) => (
                <div key={orgao.id} className="relative">
                  <RadioGroupItem value={orgao.id} id={orgao.id} className="peer sr-only" />
                  <Label
                    htmlFor={orgao.id}
                    className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{orgao.name}</p>
                      <p className="text-sm text-muted-foreground">{orgao.description}</p>
                    </div>
                    {orgaoSelecionado === orgao.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Você pode adicionar mais órgãos depois em Configurações &gt; Órgãos de Governança
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <img src={legacyLogo} alt="Legacy" className="h-10 mx-auto mb-4" />
          <p className="text-muted-foreground">Configuração Inicial</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Passo {currentStepIndex + 1} de {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <Card>
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>
              <SkipForward className="h-4 w-4 mr-2" />
              Pular
            </Button>
            <Button onClick={handleNext}>
              {currentStepIndex === STEPS.length - 1 ? (
                <>
                  Concluir e Ativar
                  <Check className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
