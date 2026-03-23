-- Tabela para registro de consumo de tokens da API OpenAI por agente.
-- Permite agregar uso diário e exibir gráficos de consumo.

create table if not exists public.token_usage (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  total_tokens int not null default 0,
  prompt_tokens int default 0,
  completion_tokens int default 0,
  agent_key text,
  created_at timestamptz default now()
);

create index idx_token_usage_data on public.token_usage (data);
create index idx_token_usage_agent_key on public.token_usage (agent_key);
create index idx_token_usage_data_agent on public.token_usage (data, agent_key);

-- RLS: apenas admins/super admins podem ler; inserção via service role (Edge Functions).
alter table public.token_usage enable row level security;

create policy "Leitura para admins autenticados"
  on public.token_usage for select
  to authenticated
  using (
    exists (
      select 1 from public.perfis p
      where p.user_id = auth.uid()
      and (p.role = 'super_admin' or p.role = 'empresa_adm')
    )
  );

-- Inserção apenas via service role (Edge Functions)
create policy "Inserção via service role"
  on public.token_usage for insert
  to service_role
  with check (true);
