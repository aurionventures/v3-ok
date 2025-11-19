import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Download, AlertCircle, Building2, Users, UserCog } from "lucide-react";
import { format, addMonths, startOfMonth, endOfMonth, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useGovernanceOrgans } from "@/hooks/useGovernanceOrgans";
import { downloadICS } from "@/utils/calendarExporter";

interface WizardProps {
  onClose: () => void;
  onComplete: (meetings: any[]) => void;
}

export default function AnnualCalendarWizard({ onClose, onComplete }: WizardProps) {
  const [config, setConfig] = useState({
    year: new Date().getFullYear(),
    organType: "" as "conselho" | "comite" | "comissao" | "",
    organId: "",
    council: "",
    type: "Ordinária" as "Ordinária" | "Extraordinária",
    frequency: "",
    dayRule: "",
    specificDay: "",
    time: "14:00",
    modality: "Presencial" as "Presencial" | "Online" | "Híbrida",
    location: "",
  });

  const { organs } = useGovernanceOrgans(config.organType || undefined);
  
  const isFormValid = config.organType && config.organId && config.frequency && config.dayRule && config.time;

  const [generatedDates, setGeneratedDates] = useState<Date[]>([]);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const [selectedDateDetails, setSelectedDateDetails] = useState<Date | null>(null);

  const frequencyOptions = [
    { value: "monthly", label: "Mensal (12 reuniões/ano)", meetings: 12 },
    { value: "bimonthly", label: "Bimestral (6 reuniões/ano)", meetings: 6 },
    { value: "quarterly", label: "Trimestral (4 reuniões/ano)", meetings: 4 },
    { value: "biannual", label: "Semestral (2 reuniões/ano)", meetings: 2 },
  ];

  const dayRuleOptions = [
    // Primeira semana
    { value: "first-monday", label: "Primeira segunda-feira do mês" },
    { value: "first-tuesday", label: "Primeira terça-feira do mês" },
    { value: "first-wednesday", label: "Primeira quarta-feira do mês" },
    { value: "first-thursday", label: "Primeira quinta-feira do mês" },
    { value: "first-friday", label: "Primeira sexta-feira do mês" },
    
    // Segunda semana
    { value: "second-monday", label: "Segunda segunda-feira do mês" },
    { value: "second-tuesday", label: "Segunda terça-feira do mês" },
    { value: "second-wednesday", label: "Segunda quarta-feira do mês" },
    { value: "second-thursday", label: "Segunda quinta-feira do mês" },
    { value: "second-friday", label: "Segunda sexta-feira do mês" },
    
    // Terceira semana
    { value: "third-monday", label: "Terceira segunda-feira do mês" },
    { value: "third-tuesday", label: "Terceira terça-feira do mês" },
    { value: "third-wednesday", label: "Terceira quarta-feira do mês" },
    { value: "third-thursday", label: "Terceira quinta-feira do mês" },
    { value: "third-friday", label: "Terceira sexta-feira do mês" },
    
    // Última semana
    { value: "last-monday", label: "Última segunda-feira do mês" },
    { value: "last-tuesday", label: "Última terça-feira do mês" },
    { value: "last-wednesday", label: "Última quarta-feira do mês" },
    { value: "last-thursday", label: "Última quinta-feira do mês" },
    { value: "last-friday", label: "Última sexta-feira do mês" },
    
    // Especial
    { value: "last-business-day", label: "Último dia útil do mês" },
    { value: "specific", label: "Dia específico do mês" },
  ];

  const calculateDateForRule = (rule: string, month: number, year: number): Date | null => {
    if (rule === "last-business-day") {
      const lastDay = new Date(year, month + 1, 0);
      let businessDay = lastDay;
      while (businessDay.getDay() === 0 || businessDay.getDay() === 6) {
        businessDay = new Date(businessDay.getTime() - 24 * 60 * 60 * 1000);
      }
      return businessDay;
    }

    if (rule === "specific") {
      const day = parseInt(config.specificDay) || 15;
      const date = new Date(year, month, day);
      if (date.getMonth() !== month) return null;
      return date;
    }

    const [position, dayName] = rule.split("-");
    const dayMap: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
    };

    const targetDay = dayMap[dayName];
    if (targetDay === undefined) return null;

    if (position === "last") {
      const lastDay = new Date(year, month + 1, 0).getDate();
      for (let day = lastDay; day >= 1; day--) {
        const testDate = new Date(year, month, day);
        if (testDate.getDay() === targetDay) return testDate;
      }
    } else {
      const weekNumber = position === "first" ? 1 : position === "second" ? 2 : 3;
      let count = 0;
      for (let day = 1; day <= 31; day++) {
        const testDate = new Date(year, month, day);
        if (testDate.getMonth() !== month) break;
        if (testDate.getDay() === targetDay) {
          count++;
          if (count === weekNumber) return testDate;
        }
      }
    }
    return null;
  };

  const validateStep1 = () => {
    if (!config.council) {
      toast.error("Conselho não selecionado", { description: "Por favor, selecione um conselho" });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!config.frequency) {
      toast.error("Frequência não selecionada", { description: "Por favor, selecione a frequência das reuniões" });
      return false;
    }
    if (!config.dayRule) {
      toast.error("Regra do dia não selecionada", { description: "Por favor, selecione quando as reuniões devem ocorrer" });
      return false;
    }
    if (config.dayRule === 'specific' && !config.specificDay) {
      toast.error("Dia não especificado", { description: "Informe o dia do mês (1-31)" });
      return false;
    }
    return true;
  };

  // Auto-generate preview when configuration is complete
  useEffect(() => {
    if (config.council && config.frequency && config.dayRule) {
      if (config.dayRule === 'specific' && !config.specificDay) return;
      
      const dates: Date[] = [];
      const startMonth = new Date().getMonth();
      
      let monthOffsets: number[] = [];
      switch (config.frequency) {
        case "monthly": monthOffsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; break;
        case "bimonthly": monthOffsets = [0, 2, 4, 6, 8, 10]; break;
        case "quarterly": monthOffsets = [0, 3, 6, 9]; break;
        case "biannual": monthOffsets = [0, 6]; break;
      }

      monthOffsets.forEach((offset) => {
        const targetMonth = startMonth + offset;
        const targetYear = targetMonth >= 12 ? config.year + 1 : config.year;
        const normalizedMonth = targetMonth % 12;
        const date = calculateDateForRule(config.dayRule, normalizedMonth, targetYear);
        if (date) dates.push(date);
      });

      const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
      setGeneratedDates(sortedDates);
      setCurrentMonthOffset(0);
    }
  }, [config.frequency, config.dayRule, config.specificDay, config.year, config.council]);

  const generateDates = () => {
    if (!validateStep1() || !validateStep2()) return;

    const dates: Date[] = [];
    const startMonth = new Date().getMonth();
    
    let monthOffsets: number[] = [];
    switch (config.frequency) {
      case "monthly": monthOffsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; break;
      case "bimonthly": monthOffsets = [0, 2, 4, 6, 8, 10]; break;
      case "quarterly": monthOffsets = [0, 3, 6, 9]; break;
      case "biannual": monthOffsets = [0, 6]; break;
    }

    monthOffsets.forEach((offset) => {
      const targetMonth = startMonth + offset;
      const targetYear = targetMonth >= 12 ? config.year + 1 : config.year;
      const normalizedMonth = targetMonth % 12;
      const date = calculateDateForRule(config.dayRule, normalizedMonth, targetYear);
      if (date) dates.push(date);
    });

    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    setGeneratedDates(sortedDates);
    setCurrentMonthOffset(0);

    if (sortedDates.length > 0) {
      toast.success("Preview gerado!", { description: `${sortedDates.length} reuniões foram geradas.` });
    } else {
      toast.error("Erro ao gerar datas", { description: "Não foi possível gerar datas com as configurações fornecidas" });
    }
  };

  const handleDownloadAllICS = () => {
    if (generatedDates.length === 0) {
      toast.error("Nenhuma data gerada", { description: "Gere o preview primeiro antes de baixar o calendário" });
      return;
    }

    const formatICSDate = (dt: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
    };

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Orbis AI//Agenda Anual de Conselhos//PT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${config.council} - ${config.year}`,
      'X-WR-TIMEZONE:America/Sao_Paulo'
    ].join('\r\n');
    
    generatedDates.forEach((date, index) => {
      const [hours, minutes] = config.time.split(':');
      const startDateTime = new Date(date);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 2);
      
      const eventLines = [
        '', 'BEGIN:VEVENT',
        `UID:meeting-${config.council.replace(/\s+/g, '-')}-${index}-${Date.now()}@orbis-ai.com`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(startDateTime)}`,
        `DTEND:${formatICSDate(endDateTime)}`,
        `SUMMARY:${config.type} - ${config.council}`,
        `DESCRIPTION:Reunião ${config.type} do ${config.council} - ${index + 1}/${generatedDates.length}`,
        config.location ? `LOCATION:${config.location}` : '',
        'STATUS:CONFIRMED', 'SEQUENCE:0', 'TRANSP:OPAQUE', 'END:VEVENT'
      ].filter(line => line);
      
      icsContent += '\r\n' + eventLines.join('\r\n');
    });
    
    icsContent += '\r\nEND:VCALENDAR';
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.council.replace(/\s+/g, '_')}_${config.year}_calendario_completo.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Calendário baixado!", { description: `Arquivo .ics com ${generatedDates.length} eventos. Importe no Google Calendar ou Outlook.` });
  };

  const handleCreateCalendar = () => {
    if (generatedDates.length === 0) {
      toast.error("Nenhuma data gerada", { description: "Gere o preview primeiro" });
      return;
    }

    const meetings = generatedDates.map((date) => ({
      council: config.council,
      date: format(date, 'yyyy-MM-dd'),
      time: config.time,
      type: config.type,
      modalidade: config.modality,
      location: config.location
    }));
    
    onComplete(meetings);
    toast.success("Calendário criado!", { description: `${generatedDates.length} reuniões foram adicionadas à Agenda Anual ${config.year}` });
    onClose();
  };

  const getMeetingsInMonth = (monthOffset: number) => {
    const targetMonth = addMonths(new Date(config.year, 0, 1), monthOffset);
    return generatedDates.filter(date => 
      date.getMonth() === targetMonth.getMonth() && 
      date.getFullYear() === targetMonth.getFullYear()
    ).length;
  };

  const hasMeeting = (day: number, targetMonth: Date) => {
    return generatedDates.some(date =>
      date.getDate() === day &&
      date.getMonth() === targetMonth.getMonth() &&
      date.getFullYear() === targetMonth.getFullYear()
    );
  };

  const handleMeetingClick = (day: number, targetMonth: Date) => {
    const meetingDate = generatedDates.find(date =>
      date.getDate() === day &&
      date.getMonth() === targetMonth.getMonth() &&
      date.getFullYear() === targetMonth.getFullYear()
    );
    if (meetingDate) setSelectedDateDetails(meetingDate);
  };

  const renderCalendarGrid = () => {
    try {
      const targetMonth = addMonths(new Date(config.year, 0, 1), currentMonthOffset);
      const firstDay = startOfMonth(targetMonth);
      const lastDay = endOfMonth(targetMonth);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = getDay(firstDay);
      
      const days: (number | null)[] = [];
      for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
      for (let day = 1; day <= daysInMonth; day++) days.push(day);
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground p-2">
            {day}
          </div>
        ))}
        
        <TooltipProvider>
          {days.map((day, index) => {
            const isMeeting = day !== null && hasMeeting(day, targetMonth);
            
            if (isMeeting) {
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative cursor-pointer",
                        "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-700 shadow-lg ring-2 ring-blue-400/50",
                        "hover:from-blue-600 hover:to-blue-700 font-bold animate-in fade-in zoom-in duration-300"
                      )}
                      onClick={() => handleMeetingClick(day, targetMonth)}
                    >
                      <span className="relative z-10">{day}</span>
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-green-500 border-0 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-semibold">{config.type}</p>
                      <p className="text-xs">{config.time} • {config.modality}</p>
                      <p className="text-xs text-muted-foreground">{config.council}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            }
            
            return (
              <div
                key={index}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-lg border text-sm font-medium transition-colors relative",
                  day === null && "border-transparent",
                  day !== null && "border-border hover:bg-accent"
                )}
              >
                {day}
              </div>
            );
          })}
        </TooltipProvider>
      </div>
    );
    } catch (error) {
      console.error("Erro ao renderizar calendário:", error);
      return (
        <div className="p-4 text-center text-destructive">
          Erro ao carregar calendário. Verifique a configuração.
        </div>
      );
    }
  };

  // Proteção contra erro de renderização
  if (!config) {
    return <div className="p-4">Carregando configuração...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUNA ESQUERDA - Configuração */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>1. Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Ano do Calendário</Label>
                <Input type="number" value={config.year} onChange={(e) => setConfig({ ...config, year: parseInt(e.target.value) })} />
              </div>
              {/* Seleção de Tipo de Órgão */}
              <div>
                <Label>Tipo de Órgão *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    type="button"
                    variant={config.organType === 'conselho' ? 'default' : 'outline'}
                    onClick={() => setConfig({...config, organType: 'conselho', organId: '', council: ''})}
                    className="h-20 flex flex-col gap-2"
                  >
                    <Building2 className="h-6 w-6" />
                    <span className="text-xs">Conselho</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={config.organType === 'comite' ? 'default' : 'outline'}
                    onClick={() => setConfig({...config, organType: 'comite', organId: '', council: ''})}
                    className="h-20 flex flex-col gap-2"
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-xs">Comitê</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={config.organType === 'comissao' ? 'default' : 'outline'}
                    onClick={() => setConfig({...config, organType: 'comissao', organId: '', council: ''})}
                    className="h-20 flex flex-col gap-2"
                  >
                    <UserCog className="h-6 w-6" />
                    <span className="text-xs">Comissão</span>
                  </Button>
                </div>
              </div>

              {/* Dropdown Dinâmico de Órgão Específico */}
              {config.organType && (
                <div>
                  <Label>
                    {config.organType === 'conselho' ? 'Conselho' : 
                     config.organType === 'comite' ? 'Comitê' : 'Comissão'} *
                  </Label>
                  <Select 
                    value={config.organId} 
                    onValueChange={(value) => {
                      const selectedOrgan = organs.find(o => o.id === value);
                      setConfig({
                        ...config, 
                        organId: value,
                        council: selectedOrgan?.name || ''
                      });
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder={`Selecione o ${config.organType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {organs.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Nenhum {config.organType} cadastrado
                        </SelectItem>
                      ) : (
                        organs.map(organ => (
                          <SelectItem key={organ.id} value={organ.id}>
                            {organ.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label>Tipo de Reunião Padrão</Label>
                <Select value={config.type} onValueChange={(value: any) => setConfig({ ...config, type: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ordinária">Ordinária</SelectItem>
                    <SelectItem value="Extraordinária">Extraordinária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Configuração de Frequência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Frequência das Reuniões</Label>
                <Select value={config.frequency} onValueChange={(value) => setConfig({ ...config, frequency: value })}>
                  <SelectTrigger><SelectValue placeholder="Selecione a frequência" /></SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Dia da Reunião</Label>
                <Select value={config.dayRule} onValueChange={(value) => setConfig({ ...config, dayRule: value })}>
                  <SelectTrigger><SelectValue placeholder="Selecione a regra do dia" /></SelectTrigger>
                  <SelectContent>
                    {dayRuleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {config.dayRule === 'specific' && (
                <div>
                  <Label>Dia do Mês (1-31)</Label>
                  <Input type="number" min="1" max="31" value={config.specificDay} 
                    onChange={(e) => setConfig({ ...config, specificDay: e.target.value })} placeholder="Ex: 15" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Horário e Local</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Horário Padrão</Label>
                <Input type="time" value={config.time} onChange={(e) => setConfig({ ...config, time: e.target.value })} />
              </div>
              <div>
                <Label>Modalidade</Label>
                <Select value={config.modality} onValueChange={(value: any) => setConfig({ ...config, modality: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Híbrida">Híbrida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Local (opcional)</Label>
                <Input value={config.location} onChange={(e) => setConfig({ ...config, location: e.target.value })} 
                  placeholder="Ex: Sala de reuniões - Sede" />
              </div>
            </CardContent>
          </Card>

{generatedDates.length > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="flex items-center gap-4 p-4">
                <CheckCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    {generatedDates.length} reuniões geradas
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {config.type} • {config.modality} • {config.time}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={generateDates} size="lg" className="w-full" variant="outline">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Regenerar Preview
          </Button>
        </div>

        {/* COLUNA DIREITA - Preview */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Preview do Calendário</CardTitle>
            </CardHeader>
            <CardContent>
{generatedDates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Configure os parâmetros ao lado para visualizar o calendário automaticamente
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentMonthOffset(currentMonthOffset - 1)}
                      disabled={currentMonthOffset <= 0}
                      className="relative"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {currentMonthOffset > 0 && getMeetingsInMonth(currentMonthOffset - 1) > 0 && (
                        <Badge className="absolute -top-2 -left-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {getMeetingsInMonth(currentMonthOffset - 1)}
                        </Badge>
                      )}
                    </Button>
                    <h3 className="font-semibold">
                      {format(addMonths(new Date(config.year, 0, 1), currentMonthOffset), 'MMMM yyyy', { locale: ptBR })}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentMonthOffset(currentMonthOffset + 1)}
                      disabled={currentMonthOffset >= 11}
                      className="relative"
                    >
                      <ChevronRight className="h-4 w-4" />
                      {currentMonthOffset < 11 && getMeetingsInMonth(currentMonthOffset + 1) > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {getMeetingsInMonth(currentMonthOffset + 1)}
                        </Badge>
                      )}
                    </Button>
                  </div>
                  
                  {renderCalendarGrid()}
                  
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-center text-blue-900 dark:text-blue-100">
                        <strong>{getMeetingsInMonth(currentMonthOffset)}</strong> reuniões agendadas neste mês
                      </p>
                    </div>
                    
                    {/* Legenda de cores */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground justify-center">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm" />
                        <span>Reunião agendada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg border border-border" />
                        <span>Dia sem reunião</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {generatedDates.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadAllICS} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Baixar .ics
              </Button>
              <Button onClick={handleCreateCalendar} className="flex-1">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Criar Calendário
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Dialog de Detalhes */}
      {selectedDateDetails && (
        <Dialog open={!!selectedDateDetails} onOpenChange={() => setSelectedDateDetails(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes da Reunião</DialogTitle>
              <DialogDescription>
                {format(selectedDateDetails, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Conselho</Label>
                <p className="font-medium">{config.council || 'Não definido'}</p>
              </div>
              <div>
                <Label>Tipo</Label>
                <Badge>{config.type}</Badge>
              </div>
              <div>
                <Label>Horário</Label>
                <p className="font-medium">{config.time}</p>
              </div>
              <div>
                <Label>Modalidade</Label>
                <Badge variant="outline">{config.modality}</Badge>
              </div>
              {config.location && (
                <div>
                  <Label>Local</Label>
                  <p className="text-sm text-muted-foreground">{config.location}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
