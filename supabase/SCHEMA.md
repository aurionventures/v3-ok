# Schema do banco de dados – Legacy OS

Documentação do schema PostgreSQL (Supabase) do Legacy OS. As definições físicas ficam em `migrations/`; este arquivo serve como referência para desenvolvedores.

---

## Visão geral

O schema está organizado por domínio: organização, governança, reuniões/atas, documentos, maturidade, agenda/rituais/riscos e agentes/insights. A entidade central de multi-tenancy é `empresas`.

### Diagrama de dependências (resumido)

```
auth.users (Supabase)
    └── perfis ──┬── empresas
                 ├── conselhos ── comites
                 │       └── membros_conselho
                 ├── reunioes ── pautas
                 │       └── atas ── deliberacoes, encaminhamentos
                 ├── documentos, checklist_documentos, estrutura_familiar, cap_table
                 ├── entrevistas ── respostas_entrevistas
                 ├── maturidade_governanca, diagnosticos
                 ├── rituais, agenda_anual ── temas_agenda
                 ├── riscos, acoes
                 └── prompts_config, historico_agente, sinais_mercado, insights
```

---

## 1. Organização (empresas e usuários)

### empresas

| Coluna      | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      | Identificador                |
| nome       | text NOT NULL| Nome da empresa              |
| razao_social| text        | Razão social                 |
| cnpj       | text         | CNPJ                         |
| ativo      | boolean      | Default true                  |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### perfis

Vincula usuários do Supabase Auth à empresa e ao papel.

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      | Identificador                |
| user_id    | uuid FK      | auth.users(id)               |
| empresa_id | uuid FK      | empresas(id)                  |
| nome       | text         | Nome do perfil               |
| role       | text         | Papel (ex.: admin, membro)    |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

Índices: `perfis(empresa_id)`, `perfis(user_id)`.

---

## 2. Governança (conselhos e comitês)

### conselhos

| Coluna      | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| nome       | text NOT NULL| Nome do conselho             |
| tipo       | text         |                              |
| ativo      | boolean      | Default true                  |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### comites

| Coluna      | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| conselho_id| uuid FK      | conselhos(id)                 |
| nome       | text NOT NULL|                              |
| ativo      | boolean      | Default true                  |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### membros_conselho

| Coluna      | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| conselho_id| uuid FK      | conselhos(id)                 |
| perfil_id  | uuid FK      | perfis(id)                    |
| cargo      | text         |                              |
| ativo      | boolean      | Default true                  |
| created_at | timestamptz  |                              |

UNIQUE(conselho_id, perfil_id). Índice em `conselho_id`.

---

## 3. Reuniões, pautas e atas

### reunioes

| Coluna      | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| conselho_id| uuid FK      | conselhos(id)                 |
| comite_id  | uuid FK      | comites(id)                   |
| titulo     | text NOT NULL|                              |
| data_reuniao| date        |                              |
| tipo       | text         |                              |
| status     | text         | Default 'agendada'           |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### pautas

| Coluna           | Tipo         | Descrição                    |
|-----------------|--------------|------------------------------|
| id              | uuid PK      |                              |
| reuniao_id      | uuid FK      | reunioes(id)                  |
| titulo          | text NOT NULL|                              |
| ordem           | int          | Default 0                     |
| tempo_estimado_min| int        |                              |
| created_at      | timestamptz  |                              |
| updated_at      | timestamptz  |                              |

### atas

| Coluna      | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| reuniao_id | uuid FK      | reunioes(id)                  |
| conteudo   | text         | Texto da ata                 |
| resumo     | text         |                              |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### deliberacoes

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| ata_id     | uuid FK      | atas(id)                      |
| assunto    | text NOT NULL|                              |
| decisao    | text         |                              |
| created_at | timestamptz  |                              |

### encaminhamentos

| Coluna        | Tipo         | Descrição                    |
|---------------|--------------|------------------------------|
| id            | uuid PK      |                              |
| ata_id        | uuid FK      | atas(id)                      |
| responsavel_id| uuid FK      | perfis(id)                    |
| acao          | text NOT NULL|                              |
| prazo         | date         |                              |
| created_at    | timestamptz  |                              |

---

## 4. Documentos e estrutura familiar

### documentos

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| titulo     | text NOT NULL|                              |
| tipo       | text         |                              |
| arquivo_url| text         | URL do arquivo (storage)      |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### checklist_documentos

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| item       | text NOT NULL|                              |
| concluido  | boolean      | Default false                 |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### estrutura_familiar

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| nome       | text         |                              |
| parentesco | text         |                              |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### cap_table

| Coluna          | Tipo         | Descrição                    |
|-----------------|--------------|------------------------------|
| id              | uuid PK      |                              |
| empresa_id      | uuid FK      | empresas(id)                  |
| participante    | text NOT NULL|                              |
| participacao_pct| numeric      |                              |
| created_at      | timestamptz  |                              |
| updated_at      | timestamptz  |                              |

---

## 5. Maturidade e entrevistas

### entrevistas

| Coluna         | Tipo         | Descrição                    |
|----------------|--------------|------------------------------|
| id             | uuid PK      |                              |
| empresa_id     | uuid FK      | empresas(id)                  |
| titulo         | text         |                              |
| data_entrevista| date         |                              |
| created_at     | timestamptz  |                              |
| updated_at     | timestamptz  |                              |

### respostas_entrevistas

| Coluna      | Tipo         | Descrição                    |
|-------------|--------------|------------------------------|
| id          | uuid PK      |                              |
| entrevista_id| uuid FK      | entrevistas(id)               |
| pergunta    | text         |                              |
| resposta    | text         |                              |
| created_at  | timestamptz  |                              |

### maturidade_governanca

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| nivel      | text         |                              |
| dimensao   | text         |                              |
| observacao | text         |                              |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### diagnosticos

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| conteudo   | jsonb        | Diagnóstico estruturado      |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

---

## 6. Agenda, rituais, riscos e ações

### rituais

| Coluna      | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| conselho_id| uuid FK      | conselhos(id)                 |
| nome       | text NOT NULL|                              |
| frequencia | text         |                              |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### agenda_anual

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| ano        | int NOT NULL |                              |
| conteudo   | jsonb        |                              |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### temas_agenda

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| agenda_id  | uuid FK      | agenda_anual(id)              |
| titulo     | text NOT NULL|                              |
| prioridade | int          | Default 0                     |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### riscos

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| descricao  | text NOT NULL|                              |
| severidade | text         |                              |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### acoes

| Coluna        | Tipo         | Descrição                    |
|---------------|--------------|------------------------------|
| id            | uuid PK      |                              |
| empresa_id    | uuid FK      | empresas(id)                  |
| ata_id        | uuid FK      | atas(id)                      |
| titulo        | text NOT NULL|                              |
| responsavel_id| uuid FK      | perfis(id)                    |
| prazo         | date         |                              |
| status        | text         | Default 'pendente'           |
| created_at    | timestamptz  |                              |
| updated_at    | timestamptz  |                              |

---

## 7. Agentes e insights

### prompts_config

| Coluna        | Tipo         | Descrição                    |
|---------------|--------------|------------------------------|
| id            | uuid PK      |                              |
| empresa_id    | uuid FK      | empresas(id)                  |
| agente_id     | text NOT NULL| ID do agente (ex.: agente-ata)|
| prompt_override| text        | Override do prompt            |
| created_at    | timestamptz  |                              |
| updated_at    | timestamptz  |                              |

### historico_agente

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| agente_id  | text NOT NULL|                              |
| entrada    | jsonb        |                              |
| saida      | jsonb        |                              |
| created_at | timestamptz  |                              |

### sinais_mercado

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| titulo     | text         |                              |
| impacto    | text         |                              |
| tags       | text[]       |                              |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

### insights

| Coluna     | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | uuid PK      |                              |
| empresa_id | uuid FK      | empresas(id)                  |
| tipo       | text         |                              |
| conteudo   | jsonb        |                              |
| created_at | timestamptz  |                              |
| updated_at | timestamptz  |                              |

---

## Migrações

As definições DDL estão em `supabase/migrations/` na ordem:

1. `20260302120000_create_empresas_usuarios.sql`
2. `20260302120100_create_conselhos_comites.sql`
3. `20260302120200_create_reunioes_pautas_atas.sql`
4. `20260302120300_create_documentos_estrutura_familiar.sql`
5. `20260302120400_create_maturidade_entrevistas.sql`
6. `20260302120500_create_agenda_rituais_riscos.sql`
7. `20260302120600_add_historico_agentes_insights.sql`

A fonte de verdade do schema é o conjunto dessas migrações; este documento é referência para leitura rápida.
