-- Logs de acesso da plataforma (login, logout, falhas).
-- Usado por get-access-logs e log-access Edge Functions.

create table if not exists public.platform_access_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  tipo text not null, -- super_admin | empresa_adm | membro | convidado
  empresa_id uuid references empresas(id) on delete set null,
  empresa_nome text,
  acao text not null default 'login', -- login | logout | falha_login
  ip text,
  user_agent text,
  created_at timestamptz default now()
);

create index idx_platform_access_logs_created_at on public.platform_access_logs (created_at desc);
create index idx_platform_access_logs_user_id on public.platform_access_logs (user_id);
create index idx_platform_access_logs_tipo on public.platform_access_logs (tipo);

alter table public.platform_access_logs enable row level security;

-- Apenas super_admin e empresa_adm podem ler (via service role na Edge Function)
create policy "Leitura para admins"
  on public.platform_access_logs for select
  to authenticated
  using (
    (auth.jwt()->>'email') = 'admin@legacy.com'
    or exists (
      select 1 from public.perfis p
      where p.user_id = auth.uid() and p.empresa_id is not null
    )
  );

-- Inserção via service role (Edge Function log-access)
create policy "Insercao via service role"
  on public.platform_access_logs for insert
  to service_role
  with check (true);
