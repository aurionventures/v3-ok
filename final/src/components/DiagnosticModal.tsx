import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, AlertTriangle, Gauge, Clock, Award, Shield, ArrowRight, Sparkles, Zap, Target, Mail, Building2, TrendingUp, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
}

interface DiagnosticModalProps {
  children: React.ReactNode;
}

const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    sector: ''
  });
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Partial<LeadFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    } else if (!formData.email.includes('.com')) {
      newErrors.email = 'Use seu e-mail corporativo';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato: (11) 99999-9999';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Nome da empresa é obrigatório';
    }

    if (!formData.sector.trim()) {
      newErrors.sector = 'Setor da empresa é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatação automática do telefone
    if (name === 'phone') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length <= 11) {
        formattedValue = formattedValue.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
        formattedValue = formattedValue.replace(/^(\d{2})(\d{1,5})$/, '($1) $2');
        formattedValue = formattedValue.replace(/^(\d{1,2})$/, '($1');
      }
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpar erro quando usuário começar a digitar
    if (errors[name as keyof LeadFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando usuário selecionar
    if (errors[name as keyof LeadFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular salvamento (delay para UX)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Salvar no localStorage para passar para o quiz
      localStorage.setItem('diagnostic_lead_data', JSON.stringify(formData));

      toast({
        title: "Dados salvos!",
        description: "Redirecionando para o diagnóstico...",
      });
      
      // Fechar modal e navegar
      setIsOpen(false);
      navigate('/diagnostic-quiz');
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar seus dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Gauge className="h-5 w-5 text-primary" />,
      title: "Diagnóstico Completo",
      description: "Análise de 5 dimensões de governança baseada em melhores práticas"
    },
    {
      icon: <Clock className="h-5 w-5 text-accent" />,
      title: "Resultado em 10 minutos",
      description: "Relatório detalhado com insights personalizados"
    },
    {
      icon: <Award className="h-5 w-5 text-secondary" />,
      title: "Benchmark de Mercado", 
      description: "Compare sua empresa com o setor"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Diagnóstico Gratuito
            </Badge>
          </div>
          <DialogTitle className="text-2xl text-center">
            Descubra o Nível de Maturidade da sua Governança
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Empresas com governança estruturada <strong>têm valor 47% maior</strong> no mercado e <strong>reduzem conflitos em 73%</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-primary/10">
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <div className="flex items-center gap-1 text-destructive text-sm">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa *</Label>
              <Input
                id="company"
                name="company"
                type="text"
                placeholder="Nome da sua empresa"
                value={formData.company}
                onChange={handleInputChange}
                className={errors.company ? "border-destructive" : ""}
              />
              {errors.company && (
                <div className="flex items-center gap-1 text-destructive text-sm">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.company}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Corporativo *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seuemail@empresa.com.br"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <div className="flex items-center gap-1 text-destructive text-sm">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone/WhatsApp *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "border-destructive" : ""}
                maxLength={15}
              />
              {errors.phone && (
                <div className="flex items-center gap-1 text-destructive text-sm">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.phone}
                </div>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Seus dados estão seguros</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Utilizamos seus dados apenas para personalizar seu diagnóstico e enviar o relatório. 
                    Não compartilhamos suas informações com terceiros. Você pode solicitar a remoção a qualquer momento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Informações da Empresa</h3>
            </div>
            
            <Card className="border-primary/10">
              <CardContent className="p-4 space-y-4">
                {/* Setor - Full width */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="sector">Setor da Empresa *</Label>
                  </div>
                  <Select value={formData.sector} onValueChange={(value) => handleSelectChange('sector', value)}>
                    <SelectTrigger className={errors.sector ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agronegocio">Agronegócio</SelectItem>
                      <SelectItem value="alimenticio">Alimentício</SelectItem>
                      <SelectItem value="construcao">Construção Civil</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="industria">Indústria</SelectItem>
                      <SelectItem value="logistica">Logística</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="varejo">Varejo</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sector && (
                    <div className="flex items-center gap-1 text-destructive text-sm">
                      <AlertTriangle className="h-3 w-3" />
                      {errors.sector}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 text-base" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processando...
              </>
            ) : (
              <>
                Iniciar Diagnóstico Gratuito
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>Levará apenas 10 minutos</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>Resultado imediato</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>Relatório por email</span>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticModal;