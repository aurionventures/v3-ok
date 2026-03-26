import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { FileDown } from 'lucide-react';

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 25,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 3,
  },
  date: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 4,
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
    marginTop: 12,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 15,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
    fontSize: 9,
    textAlign: 'center',
  },
  tableCellFirst: {
    flex: 1.5,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'left',
  },
  tableCellPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#059669',
    fontWeight: 'bold',
  },
  formulaBox: {
    backgroundColor: '#f8fafc',
    border: '1 solid #e2e8f0',
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  formulaText: {
    fontSize: 11,
    fontFamily: 'Courier',
    color: '#1e293b',
    marginBottom: 5,
  },
  formulaTextDark: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: '#f1f5f9',
    marginBottom: 6,
    lineHeight: 1.4,
  },
  formulaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  exampleBox: {
    backgroundColor: '#f0fdf4',
    border: '1 solid #86efac',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    marginTop: 10,
  },
  exampleTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 9,
    color: '#166534',
    marginBottom: 4,
    fontFamily: 'Courier',
    lineHeight: 1.3,
  },
  bulletPoint: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 6,
    paddingLeft: 10,
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
  },
  noteBox: {
    backgroundColor: '#fef3c7',
    border: '1 solid #fbbf24',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    marginTop: 10,
  },
  noteText: {
    fontSize: 9,
    color: '#92400e',
    lineHeight: 1.4,
  },
  codeBlock: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  codeBlockText: {
    fontFamily: 'Courier',
    fontSize: 10,
    color: '#f1f5f9',
    lineHeight: 1.5,
    marginBottom: 4,
  },
});

// Valores mínimos (extraídos do código)
const MINIMUM_PRICES_DATA = [
  { faturamento: '< R$ 50M/ano', valor: 3997 },
  { faturamento: 'R$ 50M - R$ 300M/ano', valor: 5997 },
  { faturamento: 'R$ 300M - R$ 1B/ano', valor: 7997 },
  { faturamento: '> R$ 1B/ano', valor: 8997 },
  { faturamento: 'Empresa Listada (B3)', valor: 14997 },
];

const MATURITY_MULTIPLIERS = [
  { nivel: 'Básico (Estrutura informal)', multiplicador: '1.0x', aumento: 'Sem aumento' },
  { nivel: 'Intermediário (Processos em desenvolvimento)', multiplicador: '1.2x', aumento: '+20%' },
  { nivel: 'Avançado (Governança estruturada)', multiplicador: '1.4x', aumento: '+40%' },
  { nivel: 'World-Class (Padrão IBGC/B3)', multiplicador: '1.6x', aumento: '+60%' },
];

const COMPLEXITY_MULTIPLIERS_DATA = [
  { fator: 'Conselho adicional', multiplicador: '+15%', descricao: 'Por cada conselho acima de 1' },
  { fator: 'Comitê', multiplicador: '+10%', descricao: 'Por cada comitê adicional' },
  { fator: 'Reunião adicional', multiplicador: '+0.1%', descricao: 'Por cada reunião acima de 12/ano' },
  { fator: 'Usuário adicional', multiplicador: '+0.5%', descricao: 'Por cada usuário acima de 10' },
];

function PricingLogicPDFDocument() {
  const formatPrice = (price: number) => {
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Document>
      {/* Página 1: Capa e Visão Geral */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Lógica de Pricing</Text>
          <Text style={styles.subtitle}>Legacy OS</Text>
          <Text style={styles.date}>Documentação Completa - {currentDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Visão Geral</Text>
          <Text style={styles.bulletPoint}>
            O sistema de pricing da Legacy OS utiliza um modelo dinâmico baseado em múltiplos fatores que refletem a complexidade real da estrutura de governança corporativa de cada empresa.
          </Text>
          <Text style={styles.bulletPoint}>
            O cálculo considera: Faturamento anual, Nível de maturidade da governança, e Complexidade estrutural (conselhos, comitês, reuniões, usuários).
          </Text>
          <Text style={styles.bulletPoint}>
            O preço é calculado dinamicamente a partir de um valor mínimo base, com aumentos proporcionais conforme a complexidade aumenta.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Estrutura Base</Text>
          <Text style={styles.bulletPoint}>
            A estrutura base considera uma configuração mínima de governança:
          </Text>
          <Text style={styles.bulletPoint}>• Conselhos: 1 conselho de administração</Text>
          <Text style={styles.bulletPoint}>• Comitês: 0 comitês</Text>
          <Text style={styles.bulletPoint}>• Reuniões: 12 reuniões por ano</Text>
          <Text style={styles.bulletPoint}>• Usuários: Até 10 usuários</Text>
          <Text style={styles.bulletPoint}>
            Qualquer valor acima desses limites gera aumentos proporcionais no preço.
          </Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 2: Valores Mínimos */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Valores Mínimos por Faturamento</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valores Mínimos</Text>
          <Text style={styles.bulletPoint}>
            Os valores mínimos são aplicados para empresas com estrutura básica (1 conselho, 12 reuniões, até 10 usuários):
          </Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Faixa de Faturamento</Text>
              <Text style={[styles.tableCell, styles.tableCellPrice]}>Valor Mínimo Mensal</Text>
            </View>
            {MINIMUM_PRICES_DATA.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellFirst]}>{item.faturamento}</Text>
                <Text style={[styles.tableCell, styles.tableCellPrice]}>{formatPrice(item.valor)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            IMPORTANTE: Os valores mínimos são aplicados sobre a estrutura base. Qualquer complexidade adicional gera aumentos proporcionais.
          </Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 3: Multiplicadores de Maturidade */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Multiplicadores de Maturidade</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Níveis de Maturidade</Text>
          <Text style={styles.bulletPoint}>
            O nível de maturidade da governança corporativa impacta o preço através de multiplicadores aplicados sobre o valor base:
          </Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Nível de Maturidade</Text>
              <Text style={styles.tableCell}>Multiplicador</Text>
              <Text style={styles.tableCell}>Aumento</Text>
            </View>
            {MATURITY_MULTIPLIERS.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellFirst]}>{item.nivel}</Text>
                <Text style={styles.tableCell}>{item.multiplicador}</Text>
                <Text style={styles.tableCell}>{item.aumento}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>Exemplo de Aplicação</Text>
          <Text style={styles.exampleText}>Para uma empresa com faturamento de R$ 50M-300M:</Text>
          <Text style={styles.exampleText}>• Básico: R$ 5.997,00 (valor mínimo)</Text>
          <Text style={styles.exampleText}>• Intermediário: R$ 7.196,40 (R$ 5.997 × 1.2)</Text>
          <Text style={styles.exampleText}>• Avançado: R$ 8.395,80 (R$ 5.997 × 1.4)</Text>
          <Text style={styles.exampleText}>• World-Class: R$ 9.595,20 (R$ 5.997 × 1.6)</Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 4: Aumentos Proporcionais */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Aumentos Proporcionais por Complexidade</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Multiplicadores de Complexidade</Text>
          <Text style={styles.bulletPoint}>
            Além do multiplicador de maturidade, aumentos proporcionais são aplicados sobre o valor base (não sobre o valor já ajustado):
          </Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Fator</Text>
              <Text style={styles.tableCell}>Multiplicador</Text>
              <Text style={styles.tableCell}>Descrição</Text>
            </View>
            {COMPLEXITY_MULTIPLIERS_DATA.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellFirst]}>{item.fator}</Text>
                <Text style={styles.tableCell}>{item.multiplicador}</Text>
                <Text style={styles.tableCell}>{item.descricao}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            IMPORTANTE: Os aumentos são calculados sobre o valor base, não sobre o valor já ajustado pela maturidade. Os aumentos são aditivos (somados ao valor final).
          </Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 5: Fórmula de Cálculo */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Fórmula de Cálculo</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passo a Passo</Text>
          <Text style={styles.bulletPoint}>1. Obter valor base (MINIMUM_PRICES[faturamento])</Text>
          <Text style={styles.bulletPoint}>2. Aplicar multiplicador de maturidade: Preço Ajustado = Valor Base × Multiplicador Maturidade</Text>
          <Text style={styles.bulletPoint}>3. Calcular aumentos proporcionais (sobre valor base):</Text>
          <Text style={styles.bulletPoint}>   • Conselhos: +15% × (numConselhos - 1) × Valor Base</Text>
          <Text style={styles.bulletPoint}>   • Comitês: +10% × numComites × Valor Base</Text>
          <Text style={styles.bulletPoint}>   • Reuniões: +0.1% × (reunioesAno - 12) × Valor Base</Text>
          <Text style={styles.bulletPoint}>   • Usuários: +0.5% × (numUsuarios - 10) × Valor Base</Text>
          <Text style={styles.bulletPoint}>4. Somar todos os aumentos ao Preço Ajustado</Text>
          <Text style={styles.bulletPoint}>5. Arredondar para número inteiro (sem centavos)</Text>
        </View>

        <View style={styles.formulaBox}>
          <Text style={styles.formulaTitle}>Fórmula Completa</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeBlockText}>
              Preço Final = (Valor Base × Multiplicador Maturidade)
            </Text>
            <Text style={styles.codeBlockText}>
              {'            '}+ (Valor Base × 0.15 × max(0, numConselhos - 1))
            </Text>
            <Text style={styles.codeBlockText}>
              {'            '}+ (Valor Base × 0.10 × numComites)
            </Text>
            <Text style={styles.codeBlockText}>
              {'            '}+ (Valor Base × 0.001 × max(0, reunioesAno - 12))
            </Text>
            <Text style={styles.codeBlockText}>
              {'            '}+ (Valor Base × 0.005 × max(0, numUsuarios - 10))
            </Text>
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 6: Exemplos Práticos */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Exemplos Práticos</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Exemplo 1: Empresa Pequena - Estrutura Básica</Text>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>Dados: Faturamento {'<'} R$ 50M, Maturidade: Básico</Text>
            <Text style={styles.exampleText}>Conselhos: 1, Comitês: 0, Reuniões: 12/ano, Usuários: 8</Text>
            <Text style={styles.exampleText}>Valor Base: R$ 3.997,00</Text>
            <Text style={styles.exampleText}>Multiplicador Maturidade: 1.0x</Text>
            <Text style={styles.exampleText}>Preço Ajustado: R$ 3.997,00 × 1.0 = R$ 3.997,00</Text>
            <Text style={styles.exampleText}>Aumentos: 0 (não há complexidade adicional)</Text>
            <Text style={styles.exampleText}>Preço Final: R$ 3.997,00</Text>
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={styles.subsectionTitle}>Exemplo 2: Empresa Média - Estrutura Intermediária</Text>
            <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>Dados: Faturamento R$ 50M-300M, Maturidade: Intermediário</Text>
            <Text style={styles.exampleText}>Conselhos: 2, Comitês: 2, Reuniões: 24/ano, Usuários: 15</Text>
            <Text style={styles.exampleText}>Valor Base: R$ 5.997,00</Text>
            <Text style={styles.exampleText}>Preço Ajustado: R$ 5.997,00 × 1.2 = R$ 7.196,40</Text>
            <Text style={styles.exampleText}>Aumentos (sobre valor base):</Text>
            <Text style={styles.exampleText}>• Conselhos: R$ 5.997 × 0.15 × 1 = R$ 899,55</Text>
            <Text style={styles.exampleText}>• Comitês: R$ 5.997 × 0.10 × 2 = R$ 1.199,40</Text>
            <Text style={styles.exampleText}>• Reuniões: R$ 5.997 × 0.001 × 12 = R$ 71,96</Text>
            <Text style={styles.exampleText}>• Usuários: R$ 5.997 × 0.005 × 5 = R$ 149,93</Text>
            <Text style={styles.exampleText}>Total Aumentos: R$ 2.320,84</Text>
            <Text style={styles.exampleText}>Preço Final: R$ 7.196,40 + R$ 2.320,84 = R$ 9.517,24</Text>
            <Text style={styles.exampleText}>Arredondado: R$ 9.517,00</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 7: Mais Exemplos */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Mais Exemplos Práticos</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Exemplo 3: Empresa Grande - Estrutura Avançada</Text>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>Dados: Faturamento R$ 300M-1B, Maturidade: Avançado</Text>
            <Text style={styles.exampleText}>Conselhos: 3, Comitês: 5, Reuniões: 48/ano, Usuários: 25</Text>
            <Text style={styles.exampleText}>Valor Base: R$ 7.997,00</Text>
            <Text style={styles.exampleText}>Preço Ajustado: R$ 7.997,00 × 1.4 = R$ 11.195,80</Text>
            <Text style={styles.exampleText}>Aumentos (sobre valor base):</Text>
            <Text style={styles.exampleText}>• Conselhos: R$ 7.997 × 0.15 × 2 = R$ 2.399,10</Text>
            <Text style={styles.exampleText}>• Comitês: R$ 7.997 × 0.10 × 5 = R$ 3.998,50</Text>
            <Text style={styles.exampleText}>• Reuniões: R$ 7.997 × 0.001 × 36 = R$ 287,89</Text>
            <Text style={styles.exampleText}>• Usuários: R$ 7.997 × 0.005 × 15 = R$ 599,78</Text>
            <Text style={styles.exampleText}>Total Aumentos: R$ 7.285,27</Text>
            <Text style={styles.exampleText}>Preço Final: R$ 11.195,80 + R$ 7.285,27 = R$ 18.481,07</Text>
            <Text style={styles.exampleText}>Arredondado: R$ 18.481,00</Text>
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={styles.subsectionTitle}>Exemplo 4: Empresa Listada - Estrutura World-Class</Text>
            <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>Dados: Faturamento Listada (B3), Maturidade: World-Class</Text>
            <Text style={styles.exampleText}>Conselhos: 4, Comitês: 8, Reuniões: 60/ano, Usuários: 50</Text>
            <Text style={styles.exampleText}>Valor Base: R$ 14.997,00</Text>
            <Text style={styles.exampleText}>Preço Ajustado: R$ 14.997,00 × 1.6 = R$ 23.995,20</Text>
            <Text style={styles.exampleText}>Aumentos (sobre valor base):</Text>
            <Text style={styles.exampleText}>• Conselhos: R$ 14.997 × 0.15 × 3 = R$ 6.748,65</Text>
            <Text style={styles.exampleText}>• Comitês: R$ 14.997 × 0.10 × 8 = R$ 11.997,60</Text>
            <Text style={styles.exampleText}>• Reuniões: R$ 14.997 × 0.001 × 48 = R$ 719,86</Text>
            <Text style={styles.exampleText}>• Usuários: R$ 14.997 × 0.005 × 40 = R$ 2.999,40</Text>
            <Text style={styles.exampleText}>Total Aumentos: R$ 22.465,51</Text>
            <Text style={styles.exampleText}>Preço Final: R$ 23.995,20 + R$ 22.465,51 = R$ 46.460,71</Text>
            <Text style={styles.exampleText}>Arredondado: R$ 46.461,00</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 8: Regras de Negócio */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Regras de Negócio</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regras Importantes</Text>

          <Text style={styles.subsectionTitle}>1. Valores Padrão</Text>
          <Text style={styles.bulletPoint}>Se algum valor não for informado, o sistema assume:</Text>
          <Text style={styles.bulletPoint}>• Conselhos: 1</Text>
          <Text style={styles.bulletPoint}>• Comitês: 0</Text>
          <Text style={styles.bulletPoint}>• Reuniões: 12/ano</Text>
          <Text style={styles.bulletPoint}>• Usuários: 10</Text>
          <Text style={styles.bulletPoint}>• Maturidade: Básico (se não informado)</Text>

          <Text style={styles.subsectionTitle}>2. Arredondamento</Text>
          <Text style={styles.bulletPoint}>Todos os valores são arredondados para números inteiros (sem centavos).</Text>

          <Text style={styles.subsectionTitle}>3. Limites Mínimos</Text>
          <Text style={styles.bulletPoint}>O sistema garante que o preço nunca seja menor que o valor mínimo do porte, mesmo com configurações abaixo da estrutura base.</Text>

          <Text style={styles.subsectionTitle}>4. Aumentos Proporcionais</Text>
          <Text style={styles.bulletPoint}>• Os aumentos são sempre calculados sobre o valor base, não sobre o valor já ajustado</Text>
          <Text style={styles.bulletPoint}>• Apenas valores acima dos limites base geram aumentos</Text>
          <Text style={styles.bulletPoint}>• Os aumentos são aditivos (somados ao valor final)</Text>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            O sistema é totalmente transparente - todos os cálculos são baseados em fórmulas claras e documentadas.
          </Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 9: Fluxo de Cálculo */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Fluxo de Cálculo no Sistema</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Processo Completo</Text>

          <Text style={styles.subsectionTitle}>1. Coleta de Dados</Text>
          <Text style={styles.bulletPoint}>O sistema coleta os seguintes dados do usuário:</Text>
          <Text style={styles.bulletPoint}>• Faixa de faturamento anual</Text>
          <Text style={styles.bulletPoint}>• Nível de maturidade da governança</Text>
          <Text style={styles.bulletPoint}>• Número de conselhos</Text>
          <Text style={styles.bulletPoint}>• Número de comitês</Text>
          <Text style={styles.bulletPoint}>• Número de reuniões por ano</Text>
          <Text style={styles.bulletPoint}>• Número de usuários</Text>

          <Text style={styles.subsectionTitle}>2. Cálculo do Preço</Text>
          <Text style={styles.bulletPoint}>A função calculatePlanPrice() executa:</Text>
          <Text style={styles.bulletPoint}>1. Identifica o valor base conforme faturamento</Text>
          <Text style={styles.bulletPoint}>2. Aplica multiplicador de maturidade</Text>
          <Text style={styles.bulletPoint}>3. Calcula aumentos proporcionais</Text>
          <Text style={styles.bulletPoint}>4. Soma todos os componentes</Text>
          <Text style={styles.bulletPoint}>5. Arredonda o resultado</Text>

          <Text style={styles.subsectionTitle}>3. Determinação do Plano</Text>
          <Text style={styles.bulletPoint}>A função determinePlanFromPrice() compara o preço calculado com a matriz de pricing para determinar o plano mais adequado.</Text>

          <Text style={styles.subsectionTitle}>4. Cálculo de Valores Anuais e Setup</Text>
          <Text style={styles.bulletPoint}>A função revealPricing() calcula valores anuais e setup conforme regras específicas por porte.</Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 10: Observações Finais */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Observações Finais</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Características do Sistema</Text>

          <Text style={styles.subsectionTitle}>Transparência</Text>
          <Text style={styles.bulletPoint}>O sistema é totalmente transparente - todos os cálculos são baseados em fórmulas claras e documentadas.</Text>

          <Text style={styles.subsectionTitle}>Flexibilidade</Text>
          <Text style={styles.bulletPoint}>O modelo permite ajustes finos nos multiplicadores sem alterar a estrutura principal.</Text>

          <Text style={styles.subsectionTitle}>Escalabilidade</Text>
          <Text style={styles.bulletPoint}>O sistema suporta desde empresas pequenas até grandes corporações listadas.</Text>

          <Text style={styles.subsectionTitle}>Justiça</Text>
          <Text style={styles.bulletPoint}>O preço reflete a complexidade real da estrutura de governança, garantindo que empresas com estruturas similares paguem valores proporcionais.</Text>
        </View>

        <View style={styles.formulaBox}>
          <Text style={styles.sectionTitle}>Informações do Documento</Text>
          <Text style={styles.bulletPoint}>Versão: 1.0</Text>
          <Text style={styles.bulletPoint}>Última Atualização: Dezembro 2024</Text>
          <Text style={styles.bulletPoint}>Autor: Legacy OS Team</Text>
          <Text style={styles.bulletPoint}>Documento gerado em: {currentDate}</Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
}

export function PricingLogicPDF() {
  return (
    <PDFDownloadLink
      document={<PricingLogicPDFDocument />}
      fileName={`logica-pricing-legacy-${new Date().toISOString().split('T')[0]}.pdf`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      {({ loading }) => (
        <>
          <FileDown className="h-4 w-4" />
          {loading ? 'Gerando PDF...' : 'Baixar Lógica de Pricing (PDF)'}
        </>
      )}
    </PDFDownloadLink>
  );
}
