/**
 * Editor de Minuta de Contrato
 * Permite criar e editar templates de contrato com variáveis dinâmicas
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText, Save, Eye, Plus, Trash2, Code,
  Variable, Copy
} from "lucide-react";
import { toast } from "sonner";

interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency';
}

interface ContractTemplate {
  id?: string;
  name: string;
  description: string;
  version: string;
  content: string;
  available_variables: TemplateVariable[];
  plan_types: string[];
  requires_witness: boolean;
  witness_count: number;
  is_active: boolean;
  is_default: boolean;
}

interface ContractTemplateEditorProps {
  template?: ContractTemplate | null;
  onSave: (template: ContractTemplate) => Promise<void>;
  onCancel: () => void;
}

// Variáveis padrão disponíveis
const DEFAULT_VARIABLES: TemplateVariable[] = [
  { key: 'contrato_numero', label: 'Número do Contrato', type: 'text' },
  { key: 'cliente_nome', label: 'Nome/Razão Social do Cliente', type: 'text' },
  { key: 'cliente_cnpj', label: 'CNPJ do Cliente', type: 'text' },
  { key: 'cliente_endereco', label: 'Endereço do Cliente', type: 'text' },
  { key: 'cliente_email', label: 'Email do Cliente', type: 'text' },
  { key: 'cliente_telefone', label: 'Telefone do Cliente', type: 'text' },
  { key: 'signatario_nome', label: 'Nome do Signatário', type: 'text' },
  { key: 'signatario_cargo', label: 'Cargo do Signatário', type: 'text' },
  { key: 'signatario_cpf', label: 'CPF do Signatário', type: 'text' },
  { key: 'plano_nome', label: 'Nome do Plano', type: 'text' },
  { key: 'plano_tipo', label: 'Tipo do Plano', type: 'text' },
  { key: 'modulos_inclusos', label: 'Módulos Inclusos', type: 'text' },
  { key: 'addons_inclusos', label: 'Add-ons Contratados', type: 'text' },
  { key: 'duracao_meses', label: 'Duração em Meses', type: 'number' },
  { key: 'duracao_extenso', label: 'Duração por Extenso', type: 'text' },
  { key: 'data_inicio', label: 'Data de Início', type: 'date' },
  { key: 'data_fim', label: 'Data de Término', type: 'date' },
  { key: 'plano_valor', label: 'Valor do Plano (formatado)', type: 'currency' },
  { key: 'plano_valor_extenso', label: 'Valor por Extenso', type: 'text' },
  { key: 'forma_pagamento', label: 'Forma de Pagamento', type: 'text' },
  { key: 'dia_vencimento', label: 'Dia de Vencimento', type: 'number' },
  { key: 'data_contrato', label: 'Data do Contrato', type: 'date' },
  { key: 'cidade_assinatura', label: 'Cidade da Assinatura', type: 'text' },
];

// Valores de exemplo para preview
const PREVIEW_VALUES: Record<string, string> = {
  contrato_numero: 'CONT-2026-0001',
  cliente_nome: 'Empresa ABC Ltda',
  cliente_cnpj: '12.345.678/0001-90',
  cliente_endereco: 'Av. Paulista, 1000, São Paulo/SP, CEP 01310-100',
  cliente_email: 'contato@empresaabc.com.br',
  cliente_telefone: '(11) 99999-9999',
  signatario_nome: 'João Silva',
  signatario_cargo: 'Diretor de Governança',
  signatario_cpf: '123.456.789-00',
  plano_nome: 'Governance Plus',
  plano_tipo: 'governance_plus',
  modulos_inclusos: 'Governança, Reuniões, Riscos, Pessoas',
  addons_inclusos: 'ESG, Inteligência de Mercado',
  duracao_meses: '12',
  duracao_extenso: 'doze',
  data_inicio: '01/02/2026',
  data_fim: '01/02/2027',
  plano_valor: 'R$ 2.500,00/mês',
  plano_valor_extenso: 'dois mil e quinhentos reais mensais',
  forma_pagamento: 'Mensal',
  dia_vencimento: '10',
  data_contrato: '13 de janeiro de 2026',
  cidade_assinatura: 'São Paulo - SP',
};

// Modelo padrão de contrato - Completo e Profissional
export const DEFAULT_CONTRACT_CONTENT = `<div style="font-family: 'Times New Roman', Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.7; color: #222;">

  <!-- CABEÇALHO -->
  <div style="text-align: center; margin-bottom: 40px;">
    <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 5px; color: #1a365d;">
      CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE SOFTWARE COMO SERVIÇO (SaaS)
    </h1>
    <h2 style="font-size: 14px; font-weight: normal; margin-bottom: 20px; color: #4a5568;">
      PLATAFORMA LEGACY OS - GOVERNANÇA CORPORATIVA
    </h2>
    <p style="font-size: 13px;">
      <strong>Contrato nº {{contrato_numero}}</strong>
    </p>
  </div>

  <!-- PARTES -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">PARTES</h3>
  
  <p><strong>CONTRATADA:</strong> LEGACY GOVERNANÇA LTDA., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 00.000.000/0001-00, com sede na cidade de São Paulo, Estado de São Paulo, neste ato representada na forma de seu Contrato Social, doravante denominada simplesmente <strong>"LEGACY"</strong>.</p>
  
  <p><strong>CONTRATANTE:</strong> <strong>{{cliente_nome}}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº <strong>{{cliente_cnpj}}</strong>, com sede em <strong>{{cliente_endereco}}</strong>, neste ato representada por <strong>{{signatario_nome}}</strong>, <strong>{{signatario_cargo}}</strong>, portador(a) do CPF nº <strong>{{signatario_cpf}}</strong>, doravante denominada simplesmente <strong>"CONTRATANTE"</strong>.</p>
  
  <p>As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços de Software como Serviço (SaaS), que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.</p>

  <!-- CLÁUSULA 1 - DO OBJETO -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 1ª - DO OBJETO</h3>
  
  <p>1.1. O presente contrato tem por objeto a prestação de serviços de acesso e uso da plataforma de governança corporativa <strong>"LEGACY OS"</strong>, na modalidade Software como Serviço (SaaS), conforme plano contratado.</p>
  
  <p>1.2. <strong>Plano Contratado:</strong> {{plano_nome}}</p>
  
  <p>1.3. <strong>Módulos Inclusos:</strong> {{modulos_inclusos}}</p>
  
  <p>1.4. <strong>Add-ons Contratados:</strong> {{addons_inclusos}}</p>
  
  <p>1.5. A plataforma LEGACY OS oferece funcionalidades para gestão de governança corporativa, incluindo, mas não se limitando a: gestão de reuniões, atas, documentos, compliance, riscos, ESG, e inteligência de mercado, conforme especificações do plano contratado.</p>

  <!-- CLÁUSULA 2 - DO PRAZO -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 2ª - DO PRAZO</h3>
  
  <p>2.1. O presente contrato terá vigência de <strong>{{duracao_meses}} ({{duracao_extenso}}) meses</strong>, com início em <strong>{{data_inicio}}</strong> e término em <strong>{{data_fim}}</strong>.</p>
  
  <p>2.2. O contrato será renovado automaticamente por períodos iguais e sucessivos, salvo manifestação contrária de qualquer das partes, por escrito, com antecedência mínima de 30 (trinta) dias do término da vigência ou de qualquer período de renovação.</p>
  
  <p>2.3. Na renovação, os valores poderão ser reajustados conforme índice IGPM/FGV ou outro índice que venha a substituí-lo, acumulado nos últimos 12 meses.</p>

  <!-- CLÁUSULA 3 - DO VALOR E PAGAMENTO -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 3ª - DO VALOR E FORMA DE PAGAMENTO</h3>
  
  <p>3.1. Pelo acesso e uso da plataforma, o CONTRATANTE pagará à LEGACY o valor de <strong>{{plano_valor}}</strong> ({{plano_valor_extenso}}), conforme periodicidade abaixo:</p>
  
  <p>3.2. <strong>Forma de Pagamento:</strong> {{forma_pagamento}}</p>
  
  <p>3.3. Os pagamentos deverão ser efetuados até o dia <strong>{{dia_vencimento}}</strong> de cada período, mediante boleto bancário, transferência bancária (PIX/TED) ou cartão de crédito.</p>
  
  <p>3.4. O atraso no pagamento implicará em:</p>
  <ul style="margin-left: 20px;">
    <li>a) Multa de 2% (dois por cento) sobre o valor em atraso;</li>
    <li>b) Juros de mora de 1% (um por cento) ao mês;</li>
    <li>c) Correção monetária pelo IGPM/FGV;</li>
    <li>d) Suspensão do acesso após 15 (quinze) dias de inadimplência.</li>
  </ul>
  
  <p>3.5. Todos os valores são expressos em Reais (R$) e não incluem tributos que porventura venham a incidir sobre os serviços, os quais serão de responsabilidade do CONTRATANTE.</p>

  <!-- CLÁUSULA 4 - OBRIGAÇÕES DA LEGACY -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 4ª - DAS OBRIGAÇÕES DA LEGACY</h3>
  
  <p>4.1. A LEGACY se obriga a:</p>
  <ul style="margin-left: 20px;">
    <li>a) Disponibilizar acesso à plataforma LEGACY OS conforme especificações do plano contratado;</li>
    <li>b) Manter a plataforma em funcionamento 24 horas por dia, 7 dias por semana, respeitando os níveis de serviço estabelecidos;</li>
    <li>c) Realizar manutenções preventivas e corretivas necessárias ao bom funcionamento;</li>
    <li>d) Comunicar previamente, quando possível, sobre manutenções programadas;</li>
    <li>e) Garantir a segurança e integridade dos dados armazenados na plataforma;</li>
    <li>f) Realizar backups diários dos dados;</li>
    <li>g) Fornecer suporte técnico conforme nível de serviço contratado;</li>
    <li>h) Disponibilizar atualizações e melhorias da plataforma sem custo adicional;</li>
    <li>i) Manter canal de atendimento para dúvidas e suporte.</li>
  </ul>

  <!-- CLÁUSULA 5 - OBRIGAÇÕES DO CONTRATANTE -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 5ª - DAS OBRIGAÇÕES DO CONTRATANTE</h3>
  
  <p>5.1. O CONTRATANTE se obriga a:</p>
  <ul style="margin-left: 20px;">
    <li>a) Efetuar os pagamentos nas datas acordadas;</li>
    <li>b) Utilizar a plataforma de acordo com a legislação vigente e boas práticas;</li>
    <li>c) Não compartilhar credenciais de acesso com terceiros não autorizados;</li>
    <li>d) Manter atualizados seus dados cadastrais;</li>
    <li>e) Não realizar engenharia reversa, descompilar ou tentar acessar o código-fonte;</li>
    <li>f) Não utilizar a plataforma para armazenar conteúdo ilícito;</li>
    <li>g) Responsabilizar-se pela veracidade das informações inseridas;</li>
    <li>h) Comunicar imediatamente qualquer suspeita de violação de segurança;</li>
    <li>i) Respeitar os limites de usuários e recursos do plano contratado.</li>
  </ul>

  <!-- CLÁUSULA 6 - SLA -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 6ª - NÍVEL DE SERVIÇO (SLA)</h3>
  
  <p>6.1. A LEGACY garante disponibilidade mínima de <strong>99,5%</strong> (noventa e nove vírgula cinco por cento) da plataforma, calculada mensalmente, excluindo-se:</p>
  <ul style="margin-left: 20px;">
    <li>a) Manutenções programadas comunicadas com 48h de antecedência;</li>
    <li>b) Eventos de força maior ou caso fortuito;</li>
    <li>c) Falhas decorrentes de terceiros (provedores de internet, DNS, etc.);</li>
    <li>d) Uso indevido por parte do CONTRATANTE.</li>
  </ul>
  
  <p>6.2. <strong>Tempo de Resposta do Suporte:</strong></p>
  <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 12px;">
    <tr style="background: #f7fafc;">
      <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: left;">Severidade</th>
      <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: left;">Descrição</th>
      <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: left;">Tempo de Resposta</th>
    </tr>
    <tr>
      <td style="border: 1px solid #e2e8f0; padding: 8px;"><strong>Crítica</strong></td>
      <td style="border: 1px solid #e2e8f0; padding: 8px;">Sistema indisponível</td>
      <td style="border: 1px solid #e2e8f0; padding: 8px;">Até 2 horas</td>
    </tr>
    <tr>
      <td style="border: 1px solid #e2e8f0; padding: 8px;"><strong>Alta</strong></td>
      <td style="border: 1px solid #e2e8f0; padding: 8px;">Funcionalidade crítica comprometida</td>
      <td style="border: 1px solid #e2e8f0; padding: 8px;">Até 4 horas</td>
    </tr>
    <tr>
      <td style="border: 1px solid #e2e8f0; padding: 8px;"><strong>Média</strong></td>
      <td style="border: 1px solid #e2e8f0; padding: 8px;">Funcionalidade comprometida com alternativa</td>
      <td style="border: 1px solid #e2e8f0; padding: 8px;">Até 24 horas</td>
    </tr>
    <tr>
      <td style="border: 1px solid #e2e8f0; padding: 8px;"><strong>Baixa</strong></td>
      <td style="border: 1px solid #e2e8f0; padding: 8px;">Dúvidas e melhorias</td>
      <td style="border: 1px solid #e2e8f0; padding: 8px;">Até 48 horas</td>
    </tr>
  </table>
  
  <p>6.3. Em caso de descumprimento do SLA de disponibilidade, o CONTRATANTE terá direito a crédito proporcional ao tempo de indisponibilidade, limitado a 30% do valor mensal.</p>

  <!-- CLÁUSULA 7 - CONFIDENCIALIDADE E LGPD -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 7ª - CONFIDENCIALIDADE E PROTEÇÃO DE DADOS (LGPD)</h3>
  
  <p>7.1. As partes se comprometem a manter sigilo sobre todas as informações confidenciais a que tiverem acesso em razão deste contrato.</p>
  
  <p>7.2. A LEGACY atuará como <strong>Operadora de Dados</strong> nos termos da Lei nº 13.709/2018 (LGPD), comprometendo-se a:</p>
  <ul style="margin-left: 20px;">
    <li>a) Tratar os dados pessoais apenas conforme instruções do CONTRATANTE;</li>
    <li>b) Implementar medidas técnicas e organizacionais adequadas de segurança;</li>
    <li>c) Não compartilhar dados com terceiros sem autorização expressa;</li>
    <li>d) Auxiliar o CONTRATANTE no atendimento de solicitações de titulares;</li>
    <li>e) Notificar imediatamente sobre qualquer incidente de segurança;</li>
    <li>f) Ao término do contrato, excluir ou devolver os dados, conforme solicitação.</li>
  </ul>
  
  <p>7.3. O CONTRATANTE, como <strong>Controlador de Dados</strong>, é responsável por:</p>
  <ul style="margin-left: 20px;">
    <li>a) Obter consentimento ou base legal para tratamento de dados inseridos na plataforma;</li>
    <li>b) Informar aos titulares sobre o uso da plataforma LEGACY OS;</li>
    <li>c) Garantir a licitude dos dados inseridos na plataforma.</li>
  </ul>
  
  <p>7.4. Os dados são armazenados em servidores seguros localizados no Brasil, em conformidade com as normas de segurança da informação (ISO 27001).</p>

  <!-- CLÁUSULA 8 - PROPRIEDADE INTELECTUAL -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 8ª - PROPRIEDADE INTELECTUAL</h3>
  
  <p>8.1. A plataforma LEGACY OS, incluindo seu código-fonte, design, funcionalidades, documentação e marca, são de propriedade exclusiva da LEGACY, protegidos pela legislação de propriedade intelectual.</p>
  
  <p>8.2. Este contrato não transfere ao CONTRATANTE qualquer direito de propriedade sobre a plataforma, concedendo apenas licença de uso não exclusiva, intransferível e revogável.</p>
  
  <p>8.3. Os dados inseridos pelo CONTRATANTE na plataforma permanecem de sua propriedade exclusiva.</p>

  <!-- CLÁUSULA 9 - RESCISÃO -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 9ª - RESCISÃO</h3>
  
  <p>9.1. O presente contrato poderá ser rescindido:</p>
  <ul style="margin-left: 20px;">
    <li>a) Por acordo mútuo entre as partes;</li>
    <li>b) Por inadimplemento de qualquer obrigação contratual, após notificação e prazo de 15 dias para regularização;</li>
    <li>c) Por solicitação do CONTRATANTE, mediante aviso prévio de 30 dias;</li>
    <li>d) Pela falência, recuperação judicial ou dissolução de qualquer das partes.</li>
  </ul>
  
  <p>9.2. Em caso de rescisão antecipada pelo CONTRATANTE sem justa causa, será devida multa equivalente a 20% do valor restante do contrato.</p>
  
  <p>9.3. Após a rescisão, o CONTRATANTE terá prazo de 30 (trinta) dias para exportar seus dados. Após este prazo, os dados serão excluídos permanentemente.</p>

  <!-- CLÁUSULA 10 - LIMITAÇÃO DE RESPONSABILIDADE -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 10ª - LIMITAÇÃO DE RESPONSABILIDADE</h3>
  
  <p>10.1. A responsabilidade total da LEGACY por quaisquer danos decorrentes deste contrato está limitada ao valor total pago pelo CONTRATANTE nos últimos 12 (doze) meses.</p>
  
  <p>10.2. A LEGACY não será responsável por:</p>
  <ul style="margin-left: 20px;">
    <li>a) Danos indiretos, lucros cessantes ou perda de oportunidades;</li>
    <li>b) Decisões tomadas com base nas informações da plataforma;</li>
    <li>c) Conteúdo inserido pelo CONTRATANTE;</li>
    <li>d) Falhas decorrentes de terceiros ou força maior.</li>
  </ul>

  <!-- CLÁUSULA 11 - DISPOSIÇÕES GERAIS -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 11ª - DISPOSIÇÕES GERAIS</h3>
  
  <p>11.1. Este contrato representa o acordo integral entre as partes, substituindo quaisquer negociações ou acordos anteriores.</p>
  
  <p>11.2. A tolerância de uma parte quanto ao descumprimento de qualquer cláusula não constituirá renúncia ou novação.</p>
  
  <p>11.3. Qualquer alteração deste contrato somente será válida se formalizada por escrito e assinada por ambas as partes.</p>
  
  <p>11.4. Este contrato obriga as partes e seus sucessores a qualquer título.</p>
  
  <p>11.5. Este contrato é celebrado eletronicamente, com validade jurídica nos termos da Medida Provisória nº 2.200-2/2001 e Lei nº 14.063/2020, possuindo a mesma força probante de documento assinado de forma manuscrita.</p>
  
  <p>11.6. As comunicações entre as partes serão realizadas preferencialmente por e-mail, considerando-se válidas quando enviadas para:</p>
  <ul style="margin-left: 20px;">
    <li>LEGACY: contratos@legacyos.com.br</li>
    <li>CONTRATANTE: {{cliente_email}}</li>
  </ul>

  <!-- CLÁUSULA 12 - FORO -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 12ª - FORO</h3>
  
  <p>12.1. Fica eleito o foro da Comarca de São Paulo, Estado de São Paulo, para dirimir quaisquer questões oriundas do presente contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>

  <!-- ASSINATURAS -->
  <div style="margin-top: 50px;">
    <p>E, por estarem assim justos e acordados, as partes assinam o presente instrumento eletronicamente, declarando que leram e concordam com todas as cláusulas e condições.</p>
    
    <p style="text-align: center; margin-top: 30px;">
      <strong>{{cidade_assinatura}}, {{data_contrato}}</strong>
    </p>
    
    <div style="display: flex; justify-content: space-between; margin-top: 60px;">
      <div style="width: 45%; text-align: center;">
        <div style="border-top: 1px solid #333; padding-top: 10px;">
          <strong>LEGACY GOVERNANÇA LTDA.</strong><br/>
          <span style="font-size: 12px;">CNPJ: 00.000.000/0001-00</span><br/>
          <span style="font-size: 11px; color: #666;">CONTRATADA</span>
        </div>
      </div>
      <div style="width: 45%; text-align: center;">
        <div style="border-top: 1px solid #333; padding-top: 10px;">
          <strong>{{cliente_nome}}</strong><br/>
          <span style="font-size: 12px;">CNPJ: {{cliente_cnpj}}</span><br/>
          <span style="font-size: 12px;">{{signatario_nome}} - {{signatario_cargo}}</span><br/>
          <span style="font-size: 11px; color: #666;">CONTRATANTE</span>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 60px;">
      <p><strong>TESTEMUNHAS:</strong></p>
      <div style="display: flex; justify-content: space-between; margin-top: 30px;">
        <div style="width: 45%;">
          <div style="border-top: 1px solid #333; padding-top: 10px;">
            <p style="margin: 5px 0;">Nome: _______________________________</p>
            <p style="margin: 5px 0;">CPF: _______________________________</p>
          </div>
        </div>
        <div style="width: 45%;">
          <div style="border-top: 1px solid #333; padding-top: 10px;">
            <p style="margin: 5px 0;">Nome: _______________________________</p>
            <p style="margin: 5px 0;">CPF: _______________________________</p>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>`;

export default function ContractTemplateEditor({
  template,
  onSave,
  onCancel,
}: ContractTemplateEditorProps) {
  const [formData, setFormData] = useState<ContractTemplate>({
    name: '',
    description: '',
    version: '1.0',
    content: DEFAULT_CONTRACT_CONTENT,
    available_variables: DEFAULT_VARIABLES,
    plan_types: ['core', 'governance_plus', 'people_esg', 'legacy_360'],
    requires_witness: false,
    witness_count: 0,
    is_active: true,
    is_default: false,
  });

  const [activeTab, setActiveTab] = useState('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [newVariable, setNewVariable] = useState<TemplateVariable>({
    key: '',
    label: '',
    type: 'text',
  });

  // Carregar template existente
  useEffect(() => {
    if (template) {
      setFormData({
        ...template,
        content: template.content || DEFAULT_CONTRACT_CONTENT,
        available_variables: template.available_variables?.length > 0 
          ? template.available_variables 
          : DEFAULT_VARIABLES,
      });
    }
  }, [template]);

  // Gerar preview quando conteúdo mudar
  useEffect(() => {
    const html = replaceVariables(formData.content, PREVIEW_VALUES);
    setPreviewHtml(html);
  }, [formData.content]);

  // Substituir variáveis por valores
  const replaceVariables = (content: string, values: Record<string, string>): string => {
    let result = content;
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  // Inserir variável no cursor
  const insertVariable = (key: string) => {
    const textarea = document.getElementById('contract-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.content;
      const newText = text.substring(0, start) + `{{${key}}}` + text.substring(end);
      setFormData(prev => ({ ...prev, content: newText }));
      
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + key.length + 4;
      }, 0);
    }
    toast.success(`Variável {{${key}}} inserida`);
  };

  // Copiar variável para clipboard
  const copyVariable = (key: string) => {
    navigator.clipboard.writeText(`{{${key}}}`);
    toast.success(`{{${key}}} copiado!`);
  };

  // Adicionar nova variável personalizada
  const addCustomVariable = () => {
    if (!newVariable.key || !newVariable.label) {
      toast.error('Preencha a chave e o label da variável');
      return;
    }

    if (formData.available_variables.some(v => v.key === newVariable.key)) {
      toast.error('Já existe uma variável com essa chave');
      return;
    }

    setFormData(prev => ({
      ...prev,
      available_variables: [...prev.available_variables, { ...newVariable }],
    }));

    setNewVariable({ key: '', label: '', type: 'text' });
    setShowVariableModal(false);
    toast.success('Variável adicionada');
  };

  // Remover variável personalizada
  const removeVariable = (key: string) => {
    if (DEFAULT_VARIABLES.some(v => v.key === key)) {
      toast.error('Não é possível remover variáveis padrão');
      return;
    }

    setFormData(prev => ({
      ...prev,
      available_variables: prev.available_variables.filter(v => v.key !== key),
    }));
    toast.success('Variável removida');
  };

  // Carregar modelo padrão
  const loadDefaultTemplate = () => {
    setFormData(prev => ({
      ...prev,
      content: DEFAULT_CONTRACT_CONTENT,
    }));
    toast.success('Modelo padrão carregado');
  };

  // Salvar template
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Informe o nome do template');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('O conteúdo do contrato não pode estar vazio');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success('Template salvo com sucesso!');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erro ao salvar template');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {template?.id ? 'Editar Minuta' : 'Nova Minuta de Contrato'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure o template do contrato com variáveis dinâmicas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Template'}
          </Button>
        </div>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações do Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Template *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Contrato SaaS Padrão"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Versão</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="1.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o propósito deste template..."
              rows={2}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Template Ativo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
              />
              <Label htmlFor="is_default">Template Padrão</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="requires_witness"
                checked={formData.requires_witness}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_witness: checked, witness_count: checked ? 2 : 0 }))}
              />
              <Label htmlFor="requires_witness">Requer Testemunhas</Label>
            </div>
            {formData.requires_witness && (
              <div className="flex items-center gap-2">
                <Label>Quantidade:</Label>
                <Select
                  value={formData.witness_count.toString()}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, witness_count: parseInt(v) }))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Editor e Preview - TABS CORRIGIDOS */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-base">Conteúdo do Contrato</CardTitle>
              <TabsList>
                <TabsTrigger value="editor" className="gap-2">
                  <Code className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="variables" className="gap-2">
                  <Variable className="h-4 w-4" />
                  Variáveis
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="editor" className="m-0 mt-0">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Inserir variável:</span>
                  {formData.available_variables.slice(0, 6).map((v) => (
                    <Badge
                      key={v.key}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => insertVariable(v.key)}
                    >
                      {`{{${v.key}}}`}
                    </Badge>
                  ))}
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setActiveTab('variables')}
                  >
                    Ver todas...
                  </Badge>
                  <div className="flex-1" />
                  <Button size="sm" variant="outline" onClick={loadDefaultTemplate}>
                    Carregar Modelo Padrão
                  </Button>
                </div>

                <Textarea
                  id="contract-content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Digite o conteúdo do contrato em HTML..."
                  className="font-mono text-sm min-h-[500px]"
                />

                <p className="text-xs text-muted-foreground">
                  Use HTML para formatação. Variáveis devem seguir o padrão {`{{nome_variavel}}`}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="m-0 mt-0">
              <div className="border rounded-lg p-8 bg-white min-h-[500px] overflow-auto">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Preview com valores de exemplo. As variáveis serão substituídas pelos dados reais ao gerar o contrato.
              </p>
            </TabsContent>

            <TabsContent value="variables" className="m-0 mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Clique em uma variável para copiá-la
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setShowVariableModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Variável
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {formData.available_variables.map((variable) => {
                    const isDefault = DEFAULT_VARIABLES.some(v => v.key === variable.key);
                    return (
                      <div
                        key={variable.key}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 cursor-pointer" onClick={() => copyVariable(variable.key)}>
                          <p className="font-mono text-sm text-primary">{`{{${variable.key}}}`}</p>
                          <p className="text-xs text-muted-foreground">{variable.label}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {variable.type}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => copyVariable(variable.key)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {!isDefault && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-destructive"
                              onClick={() => removeVariable(variable.key)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Modal para adicionar variável */}
      <Dialog open={showVariableModal} onOpenChange={setShowVariableModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Variável Personalizada</DialogTitle>
            <DialogDescription>
              Adicione uma variável personalizada para usar no template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="var_key">Chave da Variável</Label>
              <Input
                id="var_key"
                value={newVariable.key}
                onChange={(e) => setNewVariable(prev => ({ ...prev, key: e.target.value.toLowerCase().replace(/\s/g, '_') }))}
                placeholder="minha_variavel"
              />
              <p className="text-xs text-muted-foreground">
                Será usada como {`{{${newVariable.key || 'minha_variavel'}}}`}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="var_label">Label (Descrição)</Label>
              <Input
                id="var_label"
                value={newVariable.label}
                onChange={(e) => setNewVariable(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Minha Variável Personalizada"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="var_type">Tipo</Label>
              <Select
                value={newVariable.type}
                onValueChange={(v) => setNewVariable(prev => ({ ...prev, type: v as 'text' | 'number' | 'date' | 'currency' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="currency">Moeda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVariableModal(false)}>
              Cancelar
            </Button>
            <Button onClick={addCustomVariable}>
              Adicionar Variável
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
