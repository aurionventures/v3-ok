import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Download, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { addMonths, addDays, format, startOfMonth, endOfMonth, getDay, isWeekend } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WizardProps {
  onClose: () => void;
  onComplete: (meetings: any[]) => void;
}

const AnnualCalendarWizard: React.FC<WizardProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    year: new Date().getFullYear(),
    council: '',
    type: 'Ordinária' as 'Ordinária' | 'Extraordinária',
    frequency: '',
    dayRule: '',
    specificDay: '',
    time: '14:00',
    modality: 'Presencial' as 'Presencial' | 'Online' | 'Híbrida',
    location: ''
  });
  const [generatedDates, setGeneratedDates] = useState<Date[]>([]);

  const frequencyOptions = [
    { value: 'monthly', label: 'Mensal' },
    { value: 'bimonthly', label: 'Bimestral' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'semiannual', label: 'Semestral' },
    { value: 'annual', label: 'Anual' }
  ];

  const dayRuleOptions = [
    { value: 'first-monday', label: 'Primeira segunda-feira do mês' },
    { value: 'second-tuesday', label: 'Segunda terça-feira do mês' },
    { value: 'last-business-day', label: 'Último dia útil do mês' },
    { value: 'specific', label: 'Dia específico do mês' }
  ];

  const generateDates = () => {
    const dates: Date[] = [];
    const year = config.year;
    let monthIncrement = 1;

    switch (config.frequency) {
      case 'monthly':
        monthIncrement = 1;
        break;
      case 'bimonthly':
        monthIncrement = 2;
        break;
      case 'quarterly':
        monthIncrement = 3;
        break;
      case 'semiannual':
        monthIncrement = 6;
        break;
      case 'annual':
        monthIncrement = 12;
        break;
    }

    for (let month = 0; month < 12; month += monthIncrement) {
      const baseDate = new Date(year, month, 1);
      let meetingDate: Date;

      switch (config.dayRule) {
        case 'first-monday':
          meetingDate = getNthDayOfMonth(baseDate, 1, 1); // 1 = Monday
          break;
        case 'second-tuesday':
          meetingDate = getNthDayOfMonth(baseDate, 2, 2); // 2 = Tuesday
          break;
        case 'last-business-day':
          meetingDate = getLastBusinessDay(baseDate);
          break;
        case 'specific':
          const day = parseInt(config.specificDay) || 15;
          meetingDate = new Date(year, month, Math.min(day, new Date(year, month + 1, 0).getDate()));
          break;
        default:
          meetingDate = new Date(year, month, 15);
      }

      dates.push(meetingDate);
    }

    setGeneratedDates(dates);
  };

  const getNthDayOfMonth = (date: Date, nth: number, targetDay: number): Date => {
    const month = date.getMonth();
    const year = date.getFullYear();
    let count = 0;
    let currentDate = new Date(year, month, 1);

    while (count < nth) {
      if (getDay(currentDate) === targetDay) {
        count++;
        if (count === nth) return currentDate;
      }
      currentDate = addDays(currentDate, 1);
    }

    return currentDate;
  };

  const getLastBusinessDay = (date: Date): Date => {
    const lastDay = endOfMonth(date);
    let businessDay = lastDay;

    while (isWeekend(businessDay)) {
      businessDay = addDays(businessDay, -1);
    }

    return businessDay;
  };

  const downloadICS = () => {
    const icsContent = generateICS();
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendario-${config.council}-${config.year}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateICS = (): string => {
    let ics = 'BEGIN:VCALENDAR\n';
    ics += 'VERSION:2.0\n';
    ics += 'PRODID:-//Governança Corporativa//Agenda Anual//PT\n';
    ics += 'CALSCALE:GREGORIAN\n';

    generatedDates.forEach((date, index) => {
      const formattedDate = format(date, 'yyyyMMdd');
      const formattedTime = config.time.replace(':', '') + '00';
      
      ics += 'BEGIN:VEVENT\n';
      ics += `UID:meeting-${index}-${Date.now()}@governanca.com\n`;
      ics += `DTSTAMP:${formattedDate}T${formattedTime}Z\n`;
      ics += `DTSTART:${formattedDate}T${formattedTime}Z\n`;
      ics += `SUMMARY:${config.type} - ${config.council}\n`;
      ics += `DESCRIPTION:Reunião ${config.type} do ${config.council}\n`;
      if (config.location) {
        ics += `LOCATION:${config.location}\n`;
      }
      ics += 'END:VEVENT\n';
    });

    ics += 'END:VCALENDAR';
    return ics;
  };

  const handleNext = () => {
    if (step === 2) {
      if (!config.frequency || !config.dayRule) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos antes de continuar",
          variant: "destructive"
        });
        return;
      }
      if (config.dayRule === 'specific' && !config.specificDay) {
        toast({
          title: "Dia não especificado",
          description: "Informe o dia do mês para as reuniões",
          variant: "destructive"
        });
        return;
      }
    }

    if (step === 3) {
      generateDates();
    }

    setStep(step + 1);
  };

  const handleComplete = () => {
    const meetings = generatedDates.map((date, index) => ({
      council: config.council,
      date: format(date, 'yyyy-MM-dd'),
      time: config.time,
      type: config.type,
      location: config.location,
      modality: config.modality,
      title: `${config.type} ${index + 1}/${generatedDates.length}`
    }));

    onComplete(meetings);
    
    toast({
      title: "Calendário criado",
      description: `${generatedDates.length} reuniões foram adicionadas ao calendário anual`
    });

    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s === step
                  ? 'bg-primary text-primary-foreground'
                  : s < step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            {s < 5 && <div className={`h-1 w-16 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Informações Básicas */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="year">Ano do Calendário</Label>
              <Input
                id="year"
                type="number"
                value={config.year}
                onChange={(e) => setConfig({ ...config, year: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="council">Nome do Conselho</Label>
              <Select value={config.council} onValueChange={(value) => setConfig({ ...config, council: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o conselho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conselho de Administração">Conselho de Administração</SelectItem>
                  <SelectItem value="Conselho Fiscal">Conselho Fiscal</SelectItem>
                  <SelectItem value="Conselho Consultivo">Conselho Consultivo</SelectItem>
                  <SelectItem value="Comitê de Auditoria">Comitê de Auditoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Tipo de Reunião Padrão</Label>
              <Select value={config.type} onValueChange={(value: any) => setConfig({ ...config, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ordinária">Ordinária</SelectItem>
                  <SelectItem value="Extraordinária">Extraordinária</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Configuração de Frequência */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Frequência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="frequency">Frequência das Reuniões</Label>
              <Select value={config.frequency} onValueChange={(value) => setConfig({ ...config, frequency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dayRule">Dia da Reunião</Label>
              <Select value={config.dayRule} onValueChange={(value) => setConfig({ ...config, dayRule: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a regra do dia" />
                </SelectTrigger>
                <SelectContent>
                  {dayRuleOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {config.dayRule === 'specific' && (
              <div>
                <Label htmlFor="specificDay">Dia do Mês (1-31)</Label>
                <Input
                  id="specificDay"
                  type="number"
                  min="1"
                  max="31"
                  value={config.specificDay}
                  onChange={(e) => setConfig({ ...config, specificDay: e.target.value })}
                  placeholder="Ex: 15"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Horário e Local */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Horário e Local</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="time">Horário Padrão</Label>
              <Input
                id="time"
                type="time"
                value={config.time}
                onChange={(e) => setConfig({ ...config, time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="modality">Modalidade</Label>
              <Select value={config.modality} onValueChange={(value: any) => setConfig({ ...config, modality: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Híbrida">Híbrida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Local (opcional)</Label>
              <Input
                id="location"
                value={config.location}
                onChange={(e) => setConfig({ ...config, location: e.target.value })}
                placeholder="Ex: Sala de reuniões - Sede"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Preview */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Preview do Calendário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {generatedDates.map((date, index) => (
                  <Badge key={index} variant="outline" className="p-3 justify-start">
                    <div>
                      <div className="font-semibold">{format(date, 'dd/MM/yyyy', { locale: ptBR })}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(date, 'EEEE', { locale: ptBR })} às {config.time}
                      </div>
                    </div>
                  </Badge>
                ))}
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>{generatedDates.length} reuniões</strong> serão criadas para {config.council} em {config.year}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Finalização */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Pronto para Criar!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm">
                  Seu calendário anual está configurado e pronto para ser criado. Você pode criar o calendário agora ou fazer o download do arquivo .ics para importar no Google Calendar ou Outlook.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Conselho</p>
                  <p className="font-medium">{config.council}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ano</p>
                  <p className="font-medium">{config.year}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Frequência</p>
                  <p className="font-medium">{frequencyOptions.find(f => f.value === config.frequency)?.label}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total de Reuniões</p>
                  <p className="font-medium">{generatedDates.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <div className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Voltar
            </Button>
          )}
          {step < 5 ? (
            <Button onClick={handleNext}>
              Próximo
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={downloadICS}>
                <Download className="h-4 w-4 mr-2" />
                Baixar .ics
              </Button>
              <Button onClick={handleComplete}>
                Criar Calendário
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnualCalendarWizard;
