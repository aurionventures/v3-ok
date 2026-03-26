# Classificação do Nível de Complexidade da Governança

## 📊 Sistema de Scoring de Complexidade

O sistema calcula um **Complexity Score** baseado em fatores estruturais da organização para determinar o nível de complexidade da governança corporativa.

### Fórmula de Cálculo

```
Complexity Score = 
  (Número de Empresas × 1) +
  (Número de Conselhos × 3) +
  (Número de Comitês × 2) +
  (Reuniões por Ano ÷ 10)
```

### Fatores Considerados

| Fator | Peso | Descrição |
|-------|------|-----------|
| **Empresas** | ×1 | Cada empresa no grupo adiciona 1 ponto |
| **Conselhos** | ×3 | Cada conselho de administração adiciona 3 pontos |
| **Comitês** | ×2 | Cada comitê (auditoria, riscos, etc.) adiciona 2 pontos |
| **Reuniões/Ano** | ÷10 | Volume de reuniões anuais dividido por 10 |

---

## 🎯 Níveis de Complexidade

### 1. **Baixa** (Score ≤ 10)
- **Cor:** 🟢 Verde
- **Descrição:** Estrutura enxuta, ideal para começar
- **Características:**
  - Empresa única ou grupo pequeno
  - 1 conselho de administração ou menos
  - Poucos ou nenhum comitê formal
  - Volume baixo de reuniões (< 50/ano)
- **Exemplo:**
  ```
  Empresas: 1
  Conselhos: 1
  Comitês: 0
  Reuniões/Ano: 12
  
  Score = (1×1) + (1×3) + (0×2) + (12÷10) = 5.2
  Nível: Baixa ✅
  ```

### 2. **Moderada** (Score 11-30)
- **Cor:** 🟡 Amarelo
- **Descrição:** Complexidade típica de empresas em crescimento
- **Características:**
  - Grupo empresarial pequeno/médio (2-3 empresas)
  - 1-2 conselhos de administração
  - Alguns comitês formais (1-2)
  - Volume moderado de reuniões (50-150/ano)
- **Exemplo:**
  ```
  Empresas: 2
  Conselhos: 1
  Comitês: 2
  Reuniões/Ano: 48
  
  Score = (2×1) + (1×3) + (2×2) + (48÷10) = 12.8
  Nível: Moderada ✅
  ```

### 3. **Alta** (Score 31-60)
- **Cor:** 🟠 Laranja
- **Descrição:** Estrutura robusta requer governança avançada
- **Características:**
  - Grupo empresarial médio/grande (3-5 empresas)
  - Múltiplos conselhos (2-3)
  - Vários comitês formais (3-5)
  - Alto volume de reuniões (150-300/ano)
- **Exemplo:**
  ```
  Empresas: 4
  Conselhos: 2
  Comitês: 4
  Reuniões/Ano: 180
  
  Score = (4×1) + (2×3) + (4×2) + (180÷10) = 30.0
  Nível: Alta ✅
  ```

### 4. **Muito Alta** (Score > 60)
- **Cor:** 🔴 Vermelho
- **Descrição:** Complexidade de grande corporação
- **Características:**
  - Grande grupo empresarial (5+ empresas)
  - Múltiplos conselhos (3+)
  - Muitos comitês formais (5+)
  - Volume muito alto de reuniões (300+/ano)
- **Exemplo:**
  ```
  Empresas: 6
  Conselhos: 3
  Comitês: 6
  Reuniões/Ano: 400
  
  Score = (6×1) + (3×3) + (6×2) + (400÷10) = 67.0
  Nível: Muito Alta ✅
  ```

---

## 📈 Tabela de Referência Rápida

| Score | Nível | Cor | Recomendação de Plano |
|-------|-------|-----|----------------------|
| 0-10 | Baixa | 🟢 Verde | Essencial ou Profissional |
| 11-30 | Moderada | 🟡 Amarelo | Profissional ou Business |
| 31-60 | Alta | 🟠 Laranja | Business ou Enterprise |
| 60+ | Muito Alta | 🔴 Vermelho | Enterprise |

---

## 💡 Exemplos Práticos

### Exemplo 1: Startup/PE
```
Empresa: Tech Startup
- Empresas: 1
- Conselhos: 1 (Conselho de Administração)
- Comitês: 0
- Reuniões/Ano: 12 (mensais)

Score = 1 + 3 + 0 + 1.2 = 5.2
Nível: Baixa 🟢
Plano Recomendado: Essencial
```

### Exemplo 2: Empresa Familiar Média
```
Empresa: Grupo Familiar
- Empresas: 2 (holding + operacional)
- Conselhos: 1
- Comitês: 2 (Auditoria + Sucessão)
- Reuniões/Ano: 36

Score = 2 + 3 + 4 + 3.6 = 12.6
Nível: Moderada 🟡
Plano Recomendado: Profissional
```

### Exemplo 3: Corporação Média
```
Empresa: Grupo Empresarial
- Empresas: 4
- Conselhos: 2 (CA + Conselho Fiscal)
- Comitês: 4 (Auditoria, Riscos, ESG, Remuneração)
- Reuniões/Ano: 200

Score = 4 + 6 + 8 + 20 = 38.0
Nível: Alta 🟠
Plano Recomendado: Business
```

### Exemplo 4: Grande Corporação
```
Empresa: Conglomerado Listado
- Empresas: 8
- Conselhos: 3 (CA Principal + 2 Subsidiárias)
- Comitês: 7 (Auditoria, Riscos, ESG, Remuneração, Sucessão, Compliance, Investimentos)
- Reuniões/Ano: 500

Score = 8 + 9 + 14 + 50 = 81.0
Nível: Muito Alta 🔴
Plano Recomendado: Enterprise
```

---

## 🔄 Integração com Recomendação de Planos

O Complexity Score é usado em conjunto com outros fatores para recomendar o plano ideal:

### Fatores Adicionais Considerados:
1. **Faturamento Anual** - Define o plano base
2. **Tem Conselho Funcionando** - +1 ponto de complexidade
3. **Tem Sucessão Formal** - +1 ponto de complexidade
4. **Avaliação de Riscos/ESG Recorrente** - +1 ponto de complexidade
5. **Número de Colaboradores** - +1 ponto se >500 funcionários
6. **Score de Maturidade ISCA/GovMetrix** - +1 ponto se ≥60, +2 se ≥80

### Lógica de Upgrade:
- **3+ pontos de complexidade** → Upgrade de 1 tier no plano
- **Máximo de 2 tiers** de upgrade acima do plano base por faturamento

---

## 📋 Como Usar

1. **Coletar Dados:**
   - Número de empresas no grupo
   - Quantidade de conselhos de administração
   - Quantidade de comitês formais
   - Volume anual de reuniões

2. **Calcular Score:**
   ```
   Score = Empresas×1 + Conselhos×3 + Comitês×2 + Reuniões÷10
   ```

3. **Identificar Nível:**
   - ≤10: Baixa
   - 11-30: Moderada
   - 31-60: Alta
   - >60: Muito Alta

4. **Recomendar Plano:**
   - Combinar com faturamento e outros fatores
   - Aplicar upgrades conforme complexidade adicional

---

## 📝 Notas Importantes

- O score é **arredondado para 1 casa decimal**
- Cada fator tem peso diferente refletindo seu impacto na complexidade
- Conselhos têm peso maior (×3) por serem estruturas mais complexas
- Reuniões são divididas por 10 para normalizar o impacto
- O sistema considera apenas estruturas **formais e ativas**

---

**Versão:** 1.0  
**Última Atualização:** Dezembro 2024  
**Sistema:** Legacy OS - Plataforma de Governança Corporativa
