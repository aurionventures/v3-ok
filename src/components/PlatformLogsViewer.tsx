import React, { useState } from "react";
import { Search, Filter, RefreshCw, FileText, AlertCircle, Info, Bug, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type LogLevel = "info" | "warn" | "error" | "debug" | "all";

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  meta?: Record<string, unknown>;
}

interface PlatformLogsViewerProps {
  logs?: LogEntry[];
  loading?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
}

const LEVEL_CONFIG: Record<Exclude<LogLevel, "all">, { label: string; color: string; Icon: React.ElementType }> = {
  debug: { label: "Debug", color: "text-gray-500", Icon: Bug },
  info: { label: "Info", color: "text-blue-600", Icon: Info },
  warn: { label: "Aviso", color: "text-amber-600", Icon: AlertCircle },
  error: { label: "Erro", color: "text-red-600", Icon: AlertCircle },
};

const PlatformLogsViewer: React.FC<PlatformLogsViewerProps> = ({
  logs = [],
  loading = false,
  onRefresh,
  emptyMessage = "Nenhum log encontrado. Os logs da plataforma serão exibidos aqui quando o módulo estiver ativo.",
}) => {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevel>("all");

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      !search ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.source.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || log.level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por mensagem ou origem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as LogLevel)}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(LEVEL_CONFIG).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {onRefresh && (
          <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-[#0d1117] text-[#c9d1d9] font-mono text-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto p-4 space-y-1">
            {filteredLogs.map((log) => {
              const cfg = LEVEL_CONFIG[log.level] ?? LEVEL_CONFIG.info;
              const Icon = cfg.Icon;
              return (
                <div
                  key={log.id}
                  className="flex gap-3 py-1.5 px-2 rounded hover:bg-white/5 group"
                >
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    {log.timestamp}
                  </span>
                  <span className={cn("shrink-0 flex items-center gap-1", cfg.color)}>
                    <Icon className="h-3.5 w-3.5" />
                    {cfg.label}
                  </span>
                  <span className="text-muted-foreground shrink-0 text-xs">[{log.source}]</span>
                  <span className="flex-1 break-all">{log.message}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {filteredLogs.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Exibindo {filteredLogs.length} de {logs.length} registros
        </p>
      )}
    </div>
  );
};

export default PlatformLogsViewer;
