import React, { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  Settings,
  Filter,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

type MeetingStatus = "Agendada" | "Pauta Definida" | "Docs Enviados" | "Realizada" | "ATA Gerada";

type Meeting = {
  id: number;
  council: string;
  date: string;
  time: string;
  type: string;
  status: MeetingStatus;
  bodyType?: string;
};

const meetingsData: Meeting[] = [
  { id: 1, council: "Conselho de Administração", date: "10/02/2026", time: "14:00", type: "Ordinária", status: "Agendada" },
  { id: 2, council: "Comitê de Auditoria", date: "19/02/2026", time: "10:00", type: "Ordinária", status: "Agendada" },
  { id: 3, council: "Comissão de Ética", date: "27/02/2026", time: "15:00", type: "Extraordinária", status: "Agendada" },
  { id: 4, council: "Conselho de Administração", date: "24/05/2025", time: "14:00", type: "Ordinária", status: "Realizada" },
  { id: 5, council: "Conselho Consultivo", date: "10/06/2025", time: "10:00", type: "Ordinária", status: "Agendada" },
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const LEGEND_ITEMS: { status: MeetingStatus; color: string; bgClass: string }[] = [
  { status: "Agendada", color: "Azul", bgClass: "bg-blue-500" },
  { status: "Pauta Definida", color: "Laranja", bgClass: "bg-orange-500" },
  { status: "Docs Enviados", color: "Vermelho", bgClass: "bg-red-500" },
  { status: "Realizada", color: "Roxo", bgClass: "bg-purple-500" },
  { status: "ATA Gerada", color: "Verde", bgClass: "bg-green-500" },
];

function parseMeetingDate(dateStr: string): Date {
  return parse(dateStr, "dd/MM/yyyy", new Date());
}

function getMonthGrid(month: Date): (Date | null)[][] {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  const firstWeekday = getDay(start);
  const grid: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  for (let i = 0; i < firstWeekday; i++) week.push(null);
  for (const d of days) {
    week.push(d);
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    grid.push(week);
  }
  return grid;
}

const Agenda = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterBodyType, setFilterBodyType] = useState("all");
  const [filterBody, setFilterBody] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMeetingType, setFilterMeetingType] = useState("all");
  const [filterAgendas, setFilterAgendas] = useState("all");

  const meetingsByDate = useMemo(() => {
    const map = new Map<string, Meeting[]>();
    for (const m of meetingsData) {
      const key = m.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return map;
  }, []);

  const filteredMeetings = useMemo(() => {
    return meetingsData;
  }, []);

  const monthGrid = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);

  const handleAddMeeting = () => {
    toast({
      title: "Reunião agendada",
      description: "A nova reunião foi agendada com sucesso.",
    });
  };

  const handleViewDetails = (meeting: Meeting) => {
    toast({
      title: "Detalhes da reunião",
      description: `Visualizando informações de ${meeting.council}`,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b bg-background px-4 py-3">
          <h1 className="text-xl font-semibold">Agenda Anual</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configurar Calendário Anual
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Nova Reunião
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Agendar Nova Reunião</DialogTitle>
                  <DialogDescription>Preencha as informações da reunião</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="meetingCouncil" className="text-right">Conselho</label>
                    <Input id="meetingCouncil" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="meetingDate" className="text-right">Data</label>
                    <Input id="meetingDate" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="meetingTime" className="text-right">Horário</label>
                    <Input id="meetingTime" type="time" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="meetingType" className="text-right">Tipo</label>
                    <Input id="meetingType" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddMeeting}>Agendar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm">
              <BookOpen className="mr-2 h-4 w-4" />
              Guia Legacy
            </Button>
            <NotificationBell />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Filtrar Reuniões</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" /> Tipo de Órgão
                  </label>
                  <Select value={filterBodyType} onValueChange={setFilterBodyType}>
                    <SelectTrigger><SelectValue placeholder="Todos os Tipos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="estatutario">Estatutário</SelectItem>
                      <SelectItem value="consultivo">Consultivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Órgão Específico</label>
                  <Select value={filterBody} onValueChange={setFilterBody}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="ca">Conselho de Administração</SelectItem>
                      <SelectItem value="cc">Conselho Consultivo</SelectItem>
                      <SelectItem value="auditoria">Comitê de Auditoria</SelectItem>
                      <SelectItem value="etica">Comissão de Ética</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger><SelectValue placeholder="Todos os Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="agendada">Agendada</SelectItem>
                      <SelectItem value="pauta">Pauta Definida</SelectItem>
                      <SelectItem value="docs">Docs Enviados</SelectItem>
                      <SelectItem value="realizada">Realizada</SelectItem>
                      <SelectItem value="ata">ATA Gerada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Reunião</label>
                  <Select value={filterMeetingType} onValueChange={setFilterMeetingType}>
                    <SelectTrigger><SelectValue placeholder="Todos os Tipos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="ordinaria">Ordinária</SelectItem>
                      <SelectItem value="extraordinaria">Extraordinária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pautas IA</label>
                  <Select value={filterAgendas} onValueChange={setFilterAgendas}>
                    <SelectTrigger><SelectValue placeholder="Todas as Pautas" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Pautas</SelectItem>
                      <SelectItem value="com">Com pauta IA</SelectItem>
                      <SelectItem value="sem">Sem pauta IA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {filteredMeetings.length} de {meetingsData.length} reuniões
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Calendário Anual de Reuniões</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium capitalize">
                    {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                  </span>
                  <Button variant="outline" size="sm">Visão Anual</Button>
                  <div className="flex rounded-md border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {WEEKDAYS.map((day) => (
                        <th
                          key={day}
                          className="border border-border p-2 text-center text-xs font-medium text-muted-foreground bg-muted/50"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthGrid.map((week, wi) => (
                      <tr key={wi}>
                        {week.map((day, di) => {
                          if (!day) {
                            return <td key={di} className="border border-border p-1 min-h-[100px] bg-muted/20" />;
                          }
                          const dateKey = format(day, "dd/MM/yyyy");
                          const dayMeetings = meetingsByDate.get(dateKey) ?? [];
                          const isSelected = selectedDate && isSameDay(day, selectedDate);
                          const hasMeetings = dayMeetings.length > 0;
                          return (
                            <td
                              key={di}
                              className="border border-border p-1 align-top min-h-[100px] w-[14.28%]"
                            >
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedDate(day)}
                                onKeyDown={(e) => e.key === "Enter" && setSelectedDate(day)}
                                className={`h-full min-h-[100px] rounded p-1 cursor-pointer ${
                                  isSelected || hasMeetings ? "bg-blue-100" : "bg-background"
                                }`}
                              >
                                <div
                                  className={`text-sm font-medium mb-1 ${
                                    isSelected || hasMeetings ? "text-blue-700" : "text-foreground"
                                  }`}
                                >
                                  {format(day, "d")}
                                </div>
                                <div className="space-y-1">
                                  {dayMeetings.map((meeting) => (
                                    <button
                                      key={meeting.id}
                                      type="button"
                                      className="w-full text-left rounded px-2 py-1.5 bg-green-100 hover:bg-green-200 text-xs transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDate(day);
                                        handleViewDetails(meeting);
                                      }}
                                    >
                                      <div className="font-medium text-foreground truncate">{meeting.council}</div>
                                      <div className="text-muted-foreground">{meeting.time}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t">
                {LEGEND_ITEMS.map((item) => (
                  <div key={item.status} className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.bgClass}`} />
                    <span className="text-sm text-muted-foreground">{item.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
