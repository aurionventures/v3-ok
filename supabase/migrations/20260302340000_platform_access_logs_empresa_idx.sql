-- Índice para filtro por empresa_id nos logs de acesso (ADM Cliente)
create index if not exists idx_platform_access_logs_empresa_id on public.platform_access_logs (empresa_id);
