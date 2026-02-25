import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  FileText,
  Shield,
  AlertTriangle,
  Clock,
  FileCheck,
  ListTodo,
  Brain,
  Sparkles,
  Lightbulb,
  Leaf,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();

  const now = new Date();
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Desempenho do Conselho</h1>
          </div>

          {/* Row 1: Overview metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Score Maturidade</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">
                      4.00 <span className="text-gray-400 font-normal">/ 5.0</span>
                      <span className="ml-1 text-sm font-normal text-green-600">+0.5</span>
                    </p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-blue-600 shrink-0" />
                </div>
                <Progress value={80} className="h-2 mt-3 bg-blue-100 [&>div]:bg-blue-600" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Riscos Críticos</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">3</p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                </div>
                <Progress value={40} className="h-2 mt-3 bg-red-100 [&>div]:bg-red-500" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tarefas Atrasadas</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">4</p>
                  </div>
                  <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                </div>
                <Progress value={35} className="h-2 mt-3 bg-amber-100 [&>div]:bg-amber-500" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pautas Definidas</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">33%</p>
                  </div>
                  <FileText className="h-5 w-5 text-blue-600 shrink-0" />
                </div>
                <Progress value={33} className="h-2 mt-3 bg-blue-100 [&>div]:bg-blue-600" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ATAs Geradas</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">90%</p>
                  </div>
                  <FileCheck className="h-5 w-5 text-green-600 shrink-0" />
                </div>
                <Progress value={90} className="h-2 mt-3 bg-green-100 [&>div]:bg-green-600" />
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Gestão de Riscos, Tarefas, Indicadores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Gestão de Riscos</h2>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-blue-600 px-3 py-2 text-center text-white">
                    <span className="text-lg font-bold">6</span>
                    <p className="text-xs opacity-90">Total</p>
                  </div>
                  <div className="rounded-lg bg-red-100 px-3 py-2 text-center text-red-700">
                    <span className="text-lg font-bold">3</span>
                    <p className="text-xs">Críticos</p>
                  </div>
                  <div className="rounded-lg bg-green-100 px-3 py-2 text-center text-green-700">
                    <span className="text-lg font-bold">6</span>
                    <p className="text-xs">Mitigados</p>
                  </div>
                  <div className="rounded-lg bg-amber-100 px-3 py-2 text-center text-amber-700">
                    <span className="text-lg font-bold">0</span>
                    <p className="text-xs">S/ Mitig.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Gestão de Tarefas</h2>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-100 px-3 py-2 text-center text-slate-700">
                    <span className="text-lg font-bold">20</span>
                    <p className="text-xs">Total</p>
                  </div>
                  <div className="rounded-lg bg-green-100 px-3 py-2 text-center text-green-700">
                    <span className="text-lg font-bold">8</span>
                    <p className="text-xs">Concluídas</p>
                  </div>
                  <div className="rounded-lg bg-amber-100 px-3 py-2 text-center text-amber-700">
                    <span className="text-lg font-bold">9</span>
                    <p className="text-xs">Pendentes</p>
                  </div>
                  <div className="rounded-lg bg-slate-100 px-3 py-2 text-center text-slate-700">
                    <span className="text-lg font-bold">40%</span>
                    <p className="text-xs">Resolução</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Indicadores</h2>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600">Reuniões este mês</span>
                    <span className="font-semibold text-gray-900">36</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600">Órgãos ativos</span>
                    <span className="font-semibold text-gray-900">5</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600">ATAs pendentes</span>
                    <span className="font-semibold text-gray-900">2</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Copiloto de Governança | IA Preditiva */}
          <Card className="border-0 shadow-sm mb-6">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-violet-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Copiloto de Governança | IA Preditiva <Sparkles className="inline h-4 w-4 text-amber-500 ml-0.5" />
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Dados demo • {timeStr}</span>
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Atualizar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-red-100 bg-red-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <Shield className="h-5 w-5" />
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-600 px-0.5 text-[10px] font-bold text-white">02</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Riscos Estratégicos</h3>
                        <p className="text-xs text-gray-600 mt-0.5">1 crítico • 1 alto</p>
                        <p className="text-sm text-gray-700 mt-2">Vulnerabilidade na Sucessão Executiva</p>
                        <ul className="mt-2 space-y-0.5 text-sm text-gray-600">
                          <li>→ Revisar plano de sucessão</li>
                          <li>→ Mapear candidatos internos</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-amber-100 bg-amber-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Ameaças Operacionais</h3>
                        <p className="text-xs text-gray-600 mt-0.5">1 imediato • 1 em 30d</p>
                        <p className="text-sm text-gray-700 mt-2">Pressão Regulatória ESG</p>
                        <ul className="mt-2 space-y-0.5 text-sm text-gray-600">
                          <li>→ Atualizar políticas ESG</li>
                          <li>→ Treinar equipe de compliance</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-blue-100 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <Lightbulb className="h-5 w-5" />
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Oportunidades</h3>
                        <p className="text-xs text-gray-600 mt-0.5">Identificadas pela IA</p>
                        <p className="text-sm text-gray-700 mt-2">Fortalecimento da Cultura de Compliance</p>
                        <ul className="mt-2 space-y-0.5 text-sm text-gray-600">
                          <li>→ Implementar programa</li>
                          <li>→ Medir resultados trimestrais</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Row 4: Maturity charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Maturidade Governança</h2>
                  <Button
                    variant="link"
                    className="text-sm text-blue-600 h-auto p-0"
                    onClick={() => navigate("/maturity")}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {[
                    { label: "Sócios", value: 4.1, max: 5 },
                    { label: "Conselho", value: 3.9, max: 5 },
                    { label: "Diretoria", value: 4.0, max: 5 },
                    { label: "Comitês", value: 3.6, max: 5 },
                    { label: "Gestão", value: 3.8, max: 5 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-20 shrink-0">{item.label}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(item.value / item.max) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <h2 className="text-base font-semibold text-gray-900">Maturidade ESG</h2>
                  </div>
                  <Button
                    variant="link"
                    className="text-sm text-blue-600 h-auto p-0"
                    onClick={() => navigate("/esg")}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {[
                    { label: "Ambiental", value: 63.3, color: "bg-green-500" },
                    { label: "Social", value: 71.7, color: "bg-green-600" },
                    { label: "Governança", value: 66.7, color: "bg-violet-500" },
                    { label: "Estratégia", value: 70, color: "bg-amber-500" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-24 shrink-0">{item.label}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
