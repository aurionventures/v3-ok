export const DEFAULT_CONTRACT_CONTENT = `<style>
  .legacy-contract{
    --bg:#0b0f14;
    --card:#0f1620;
    --text:#e8eef6;
    --muted:#a8b3c2;
    --line:#223042;
    --accent:#5aa2ff;
    --accent2:#7ee787;
    --danger:#ff6b6b;
    --shadow: 0 8px 28px rgba(0,0,0,.35);
    --radius: 14px;
    --max: 980px;
    --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    margin:0;
    font-family: var(--sans);
    background: radial-gradient(1200px 800px at 15% 0%, rgba(90,162,255,.12), transparent 50%),
                radial-gradient(900px 600px at 85% 10%, rgba(126,231,135,.10), transparent 55%),
                var(--bg);
    color:var(--text);
    line-height:1.55;
  }
  .legacy-contract *{box-sizing:border-box}
  .legacy-contract a{color:var(--accent); text-decoration:none}
  .legacy-contract a:hover{text-decoration:underline}
  .legacy-contract header{
    position:sticky;
    top:0;
    z-index:10;
    backdrop-filter: blur(10px);
    background: rgba(11,15,20,.78);
    border-bottom:1px solid rgba(34,48,66,.55);
  }
  .legacy-contract .wrap{max-width: var(--max); margin: 0 auto; padding: 18px 18px;}
  .legacy-contract .topbar{
    display:flex; gap:12px; align-items:center; justify-content:space-between;
    flex-wrap:wrap;
  }
  .legacy-contract .brand{
    display:flex; align-items:center; gap:10px;
    font-weight:700; letter-spacing:.2px;
  }
  .legacy-contract .badge{
    font-size:12px;
    padding:4px 10px;
    border:1px solid rgba(90,162,255,.35);
    color:var(--accent);
    border-radius:999px;
    background: rgba(90,162,255,.08);
  }
  .legacy-contract .actions{display:flex; gap:10px; align-items:center; flex-wrap:wrap}
  .legacy-contract .btn{
    border:1px solid rgba(34,48,66,.85);
    background: rgba(15,22,32,.7);
    color:var(--text);
    padding:10px 12px;
    border-radius: 10px;
    cursor:pointer;
    font-weight:600;
    transition:.15s transform ease, .15s background ease;
  }
  .legacy-contract .btn:hover{transform: translateY(-1px); background: rgba(15,22,32,.95)}
  .legacy-contract .btn.primary{
    border-color: rgba(90,162,255,.55);
    background: rgba(90,162,255,.14);
    color: var(--text);
  }
  .legacy-contract .btn.danger{
    border-color: rgba(255,107,107,.55);
    background: rgba(255,107,107,.10);
  }
  .legacy-contract .grid{
    display:grid;
    grid-template-columns: 280px 1fr;
    gap:18px;
    align-items:start;
    margin-top:18px;
  }
  @media (max-width: 960px){
    .legacy-contract .grid{grid-template-columns:1fr}
    .legacy-contract nav{position:relative !important; top:auto !important}
  }
  .legacy-contract nav{
    position:sticky;
    top:86px;
    background: rgba(15,22,32,.65);
    border:1px solid rgba(34,48,66,.75);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow:hidden;
  }
  .legacy-contract .nav-head{
    padding:14px 14px 10px;
    border-bottom:1px solid rgba(34,48,66,.65);
  }
  .legacy-contract .nav-title{
    font-weight:800;
    font-size:13px;
    letter-spacing:.6px;
    text-transform:uppercase;
    color:var(--muted);
  }
  .legacy-contract .nav-body{padding:10px}
  .legacy-contract .nav-body a{
    display:block;
    padding:9px 10px;
    border-radius:10px;
    color:var(--text);
    border:1px solid transparent;
  }
  .legacy-contract .nav-body a:hover{
    background: rgba(90,162,255,.08);
    border-color: rgba(90,162,255,.22);
    text-decoration:none;
  }
  .legacy-contract main{
    background: rgba(15,22,32,.55);
    border:1px solid rgba(34,48,66,.75);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow:hidden;
  }
  .legacy-contract .hero{
    padding:22px 22px 8px;
    border-bottom:1px solid rgba(34,48,66,.65);
    background:
      linear-gradient(135deg, rgba(90,162,255,.16), rgba(126,231,135,.10)),
      rgba(15,22,32,.55);
  }
  .legacy-contract h1{
    margin:0 0 6px;
    font-size: 22px;
    letter-spacing:.2px;
  }
  .legacy-contract .sub{
    margin:0;
    color:var(--muted);
    font-size:14px;
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    align-items:center;
  }
  .legacy-contract .pill{
    font-family: var(--mono);
    font-size:12px;
    padding:4px 10px;
    border-radius:999px;
    border:1px solid rgba(34,48,66,.85);
    background: rgba(11,15,20,.35);
    color:var(--muted);
  }
  .legacy-contract .content{padding: 18px 22px 22px;}
  .legacy-contract section{
    padding: 14px 0;
    border-bottom: 1px dashed rgba(34,48,66,.55);
  }
  .legacy-contract section:last-child{border-bottom:none}
  .legacy-contract h2{
    margin:0 0 10px;
    font-size:16px;
    letter-spacing:.2px;
  }
  .legacy-contract h3{
    margin:14px 0 6px;
    font-size:14px;
    color: var(--text);
  }
  .legacy-contract p{margin: 8px 0; color: var(--text)}
  .legacy-contract .muted{color:var(--muted)}
  .legacy-contract ul{margin:8px 0 8px 18px; color: var(--text)}
  .legacy-contract li{margin:6px 0}
  .legacy-contract .callout{
    border:1px solid rgba(90,162,255,.32);
    background: rgba(90,162,255,.08);
    padding:12px 14px;
    border-radius: 12px;
    margin: 10px 0;
  }
  .legacy-contract .callout.danger{
    border-color: rgba(255,107,107,.35);
    background: rgba(255,107,107,.10);
  }
  .legacy-contract .callout.success{
    border-color: rgba(126,231,135,.28);
    background: rgba(126,231,135,.08);
  }
  .legacy-contract details{
    border:1px solid rgba(34,48,66,.75);
    border-radius: 12px;
    padding: 10px 12px;
    background: rgba(11,15,20,.35);
    margin: 10px 0;
  }
  .legacy-contract summary{
    cursor:pointer;
    font-weight:700;
    color: var(--text);
  }
  .legacy-contract .footer{
    padding: 16px 22px;
    border-top:1px solid rgba(34,48,66,.65);
    background: rgba(11,15,20,.35);
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    align-items:center;
    justify-content:space-between;
  }
  .legacy-contract .footer small{color:var(--muted)}
  .legacy-contract .accept{
    display:flex; gap:10px; align-items:center; flex-wrap:wrap;
  }
  .legacy-contract .checkbox{
    display:flex; gap:10px; align-items:flex-start;
    padding:10px 12px;
    border:1px solid rgba(34,48,66,.75);
    border-radius: 12px;
    background: rgba(15,22,32,.35);
  }
  .legacy-contract .checkbox input{margin-top:4px; transform: scale(1.1)}
  .legacy-contract .checkbox label{color:var(--muted); font-size:13px}
  .legacy-contract .note{
    font-size:12px;
    color:var(--muted);
  }
  .legacy-contract .kbd{
    font-family: var(--mono);
    font-size:12px;
    padding:2px 8px;
    border:1px solid rgba(34,48,66,.85);
    border-radius:8px;
    background: rgba(11,15,20,.35);
    color:var(--muted);
  }
  .legacy-contract .divider{
    height:1px;
    background: rgba(34,48,66,.65);
    margin: 12px 0;
  }
  .legacy-contract .two-col{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
  }
  @media (max-width: 720px){
    .legacy-contract .two-col{grid-template-columns:1fr}
  }
</style>
<div class="legacy-contract">
  <header>
    <div class="wrap">
      <div class="topbar">
        <div class="brand" aria-label="Identificação do documento">
          <span>LEGACY OS</span>
          <span class="badge">Termos de Serviço</span>
        </div>
        <div class="actions" aria-label="Ações do documento">
          <button class="btn" type="button">Imprimir / PDF</button>
          <a class="btn primary" href="#aceitacao-eletronica" title="Ir para Aceitação Eletrônica">Aceitação</a>
          <a class="btn danger" href="#contato" title="Ir para Contato e Suporte">Contato</a>
        </div>
      </div>
    </div>
  </header>

  <div class="wrap">
    <div class="grid">
      <nav aria-label="Sumário">
        <div class="nav-head">
          <div class="nav-title">Sumário</div>
        </div>
        <div class="nav-body">
          <a href="#aceitacao-dos-termos">Aceitação dos Termos</a>
          <a href="#definicoes">1. Definições</a>
          <a href="#servico-e-planos">2. Serviço e Planos</a>
          <a href="#cadastro-e-conta">3. Cadastro e Conta</a>
          <a href="#precos-e-pagamento">4. Preços e Pagamento</a>
          <a href="#uso-aceitavel">5. Uso Aceitável</a>
          <a href="#dados-e-privacidade">6. Dados e Privacidade (LGPD)</a>
          <a href="#sla">7. Nível de Serviço (SLA)</a>
          <a href="#seguranca">8. Segurança da Informação</a>
          <a href="#propriedade-intelectual">9. Propriedade Intelectual</a>
          <a href="#confidencialidade">10. Confidencialidade</a>
          <a href="#prazo-e-rescisao">11. Prazo e Rescisão</a>
          <a href="#limitacao">12. Limitação de Responsabilidade</a>
          <a href="#indenizacao">13. Indenização</a>
          <a href="#forca-maior">14. Força Maior</a>
          <a href="#modificacoes">15. Modificações dos Termos</a>
          <a href="#disposicoes-gerais">16. Disposições Gerais</a>
          <a href="#legislacao-e-foro">17. Legislação e Foro</a>
          <a href="#contato">18. Contato e Suporte</a>
          <a href="#aceitacao-eletronica">Aceitação Eletrônica</a>
        </div>
      </nav>

      <main aria-label="Conteúdo do contrato">
        <div class="hero">
          <h1>TERMOS DE SERVIÇO E CONTRATO DE ASSINATURA — PLATAFORMA LEGACY OS (SaaS)</h1>
          <p class="sub">
            <span class="pill">Última atualização: 21 de janeiro de 2026</span>
            <span class="pill">Versão: 2.0</span>
          </p>
        </div>

        <div class="content">
          <section id="aceitacao-dos-termos">
            <h2>ACEITAÇÃO DOS TERMOS</h2>
            <p>
              Ao clicar em <strong>"Aceito os Termos de Serviço"</strong>, criar uma conta ou utilizar a plataforma
              <strong>LEGACY OS</strong>, você (<strong>"Cliente"</strong>, <strong>"Assinante"</strong> ou <strong>"você"</strong>)
              concorda em ficar vinculado a estes Termos de Serviço, celebrando um contrato juridicamente vinculante com a
              <strong>AURION VENTURES LTDA.</strong> (<strong>"LEGACY"</strong>, <strong>"nós"</strong> ou <strong>"nosso"</strong>),
              pessoa jurídica inscrita no CNPJ <strong>63.657.780/0001-67</strong>, com sede em São Paulo, no endereço:
              <strong>Av. Brig. Faria Lima, 1811, ESC 1119 - Jardim Paulistano, São Paulo - SP, 01452-001</strong>.
            </p>
            <div class="callout danger" role="note" aria-label="Aviso importante">
              <strong>SE VOCÊ NÃO CONCORDA COM ESTES TERMOS, NÃO UTILIZE A PLATAFORMA.</strong>
            </div>
          </section>

          <section id="definicoes">
            <h2>1. DEFINIÇÕES</h2>
            <p><strong>1.1.</strong> Para fins destes Termos:</p>
            <ul>
              <li><strong>Plataforma:</strong> Sistema LEGACY OS, incluindo todos os módulos, funcionalidades e serviços relacionados</li>
              <li><strong>Conta:</strong> Registro individual de acesso à Plataforma</li>
              <li><strong>Usuário:</strong> Pessoa autorizada pelo Cliente a acessar a Plataforma</li>
              <li><strong>Dados do Cliente:</strong> Todas as informações inseridas, carregadas ou processadas na Plataforma pelo Cliente</li>
              <li><strong>Plano:</strong> Conjunto de funcionalidades e limites contratados (Free, Starter, Professional, Enterprise, etc.)</li>
              <li><strong>Período de Faturamento:</strong> Ciclo de cobrança (mensal ou anual) conforme plano escolhido</li>
            </ul>
          </section>

          <section id="servico-e-planos">
            <h2>2. SERVIÇO E PLANOS</h2>
            <h3>2.1. Descrição do Serviço</h3>
            <p>A Aurion Ventures fornece acesso à plataforma de governança corporativa em nuvem, incluindo:</p>
            <ul>
              <li>Gestão de reuniões e atas</li>
              <li>Controle de documentos corporativos</li>
              <li>Gestão de riscos e compliance</li>
              <li>Módulos de ESG e inteligência de mercado</li>
              <li>Gestão de pessoas e comitês</li>
              <li>Outras funcionalidades conforme plano contratado</li>
            </ul>
            <h3>2.2. Planos Disponíveis</h3>
            <p>
              Os planos, funcionalidades, limites de usuários e preços estão descritos em nossa página de preços
              (<span class="muted">legacyos.com.br/precos</span>), que faz parte integrante deste contrato.
            </p>
            <h3>2.3. Alteração de Planos</h3>
            <ul>
              <li><strong>Upgrade:</strong> Imediato, com cobrança proporcional</li>
              <li><strong>Downgrade:</strong> Efetivado no próximo ciclo de faturamento</li>
              <li>Funcionalidades podem ser ajustadas conforme novo plano</li>
            </ul>
          </section>

          <section id="cadastro-e-conta">
            <h2>3. CADASTRO E CONTA</h2>
            <h3>3.1. Criação de Conta</h3>
            <p>Para usar a Plataforma, você deve:</p>
            <ul>
              <li>Ter capacidade legal para contratar (18+ anos)</li>
              <li>Fornecer informações verdadeiras, completas e atualizadas</li>
              <li>Ser pessoa jurídica ou profissional autônomo para planos pagos</li>
              <li>Criar senha segura e mantê-la confidencial</li>
            </ul>
            <h3>3.2. Responsabilidade pela Conta</h3>
            <p>Você é responsável por:</p>
            <ul>
              <li>Todas as atividades realizadas em sua conta</li>
              <li>Manter suas credenciais seguras</li>
              <li>Notificar imediatamente sobre uso não autorizado</li>
              <li>Garantir que seus Usuários cumpram estes Termos</li>
            </ul>
            <h3>3.3. Uma Conta por Cliente</h3>
            <p>É proibido criar múltiplas contas para contornar limitações de planos ou obter benefícios indevidos.</p>
            <h3>3.4. Suspensão e Encerramento</h3>
            <p>Podemos suspender ou encerrar sua conta imediatamente se:</p>
            <ul>
              <li>Houver violação destes Termos</li>
              <li>Houver atividade fraudulenta ou ilegal</li>
              <li>Houver inadimplência superior a 15 dias</li>
              <li>For solicitado por ordem judicial</li>
            </ul>
          </section>

          <section id="precos-e-pagamento">
            <h2>4. PREÇOS E PAGAMENTO</h2>
            <h3>4.1. Valores</h3>
            <p>
              Os preços são informados em Reais (R$) e estão disponíveis em
              <span class="muted">governancalegacy.com.br/pricing</span>, não incluindo tributos aplicáveis.
            </p>
            <h3>4.2. Ciclo de Faturamento</h3>
            <ul>
              <li><strong>Mensal:</strong> Cobrança recorrente no mesmo dia de cada mês</li>
              <li><strong>Anual:</strong> Cobrança única com desconto, renovação após 12 meses</li>
            </ul>
            <h3>4.3. Formas de Pagamento</h3>
            <p>Aceitamos:</p>
            <ul>
              <li>Cartão de crédito (cobrança automática recorrente)</li>
              <li>Boleto bancário (pagamento manual mensal)</li>
              <li>PIX (para pagamentos anuais ou sob demanda)</li>
              <li>Transferência bancária (para clientes Enterprise)</li>
            </ul>
            <h3>4.4. Renovação Automática</h3>
            <p>
              Sua assinatura renova automaticamente ao final de cada período, exceto se cancelada antes da data de renovação.
              Você autoriza cobranças recorrentes.
            </p>
            <h3>4.5. Reajuste de Preços</h3>
            <ul>
              <li>Podemos reajustar preços com 30 dias de antecedência</li>
              <li>Reajuste anual limitado à variação do IGPM/FGV + 5%</li>
              <li>Você pode cancelar se não concordar com novo valor</li>
            </ul>
            <h3>4.6. Inadimplência</h3>
            <p>Em caso de não pagamento:</p>
            <ul>
              <li>Dia 1: Envio de lembrete por e-mail</li>
              <li>Dia 5: Segundo aviso com multa de 2% + juros de 1% a.m.</li>
              <li>Dia 10: Suspensão do acesso (somente leitura)</li>
              <li>Dia 15: Bloqueio total da conta</li>
              <li>Dia 30: Possível exclusão de dados e encerramento</li>
            </ul>
            <h3>4.7. Impostos</h3>
            <p>Você é responsável por todos os impostos, exceto aqueles sobre a renda da plataforma LEGACY OS.</p>
            <h3>4.8. Sem Reembolso</h3>
            <p>Pagamentos não são reembolsáveis, exceto:</p>
            <ul>
              <li>Cobrança duplicada ou incorreta</li>
              <li>Impossibilidade de uso por falha da LEGACY OS superior a 5 dias consecutivos</li>
              <li>Cancelamento dentro de 7 dias da primeira assinatura paga (direito de arrependimento)</li>
            </ul>
          </section>

          <section id="uso-aceitavel">
            <h2>5. USO ACEITÁVEL</h2>
            <h3>5.1. Uso Permitido</h3>
            <p>Você pode usar a Plataforma apenas para:</p>
            <ul>
              <li>Finalidades legais e legítimas</li>
              <li>Gestão de governança corporativa de sua empresa</li>
              <li>Armazenamento de dados lícitos e verdadeiros</li>
            </ul>
            <h3>5.2. Uso Proibido</h3>
            <p>É estritamente proibido:</p>
            <ul>
              <li>Violar leis, regulamentos ou direitos de terceiros</li>
              <li>Fazer engenharia reversa, descompilar ou copiar a Plataforma</li>
              <li>Realizar ataques, invasões ou testes de segurança não autorizados</li>
              <li>Usar para spam, phishing ou distribuição de malware</li>
              <li>Compartilhar credenciais com terceiros não autorizados</li>
              <li>Exceder limites de uso de forma abusiva</li>
              <li>Revender ou sublicenciar acesso à Plataforma</li>
              <li>Armazenar conteúdo ilegal, difamatório ou que viole propriedade intelectual</li>
              <li>Usar para criar produto ou serviço concorrente</li>
            </ul>
            <h3>5.3. Limites de Uso</h3>
            <p>Cada plano possui limites de:</p>
            <ul>
              <li>Número de usuários</li>
              <li>Armazenamento de dados</li>
              <li>Reuniões e documentos mensais</li>
              <li>Chamadas de API (quando aplicável)</li>
            </ul>
            <p>O uso excessivo pode resultar em cobrança adicional ou upgrade obrigatório.</p>
          </section>

          <section id="dados-e-privacidade">
            <h2>6. DADOS E PRIVACIDADE (LGPD)</h2>
            <h3>6.1. Propriedade dos Dados</h3>
            <p>Seus dados pertencem a você. Mantemos apenas licença para processá-los conforme necessário para fornecer o serviço.</p>
            <h3>6.2. Papéis LGPD</h3>
            <ul>
              <li><strong>Você:</strong> Controlador de dados (decide como e por que tratar dados)</li>
              <li><strong>LEGACY:</strong> Operador de dados (processa dados seguindo suas instruções)</li>
            </ul>
            <h3>6.3. Compromissos da LEGACY</h3>
            <p>Nós nos comprometemos a:</p>
            <ul>
              <li>Tratar dados apenas conforme suas instruções e este contrato</li>
              <li>Implementar segurança técnica e organizacional adequada</li>
              <li>Não compartilhar seus dados com terceiros sem autorização</li>
              <li>Manter dados em servidores no Brasil</li>
              <li>Realizar backups diários automáticos</li>
              <li>Criptografar dados em trânsito (TLS 1.3) e em repouso (AES-256)</li>
              <li>Notificá-lo em até 24h sobre incidentes de segurança</li>
              <li>Auxiliar no atendimento de solicitações de titulares (ANPD)</li>
              <li>Excluir ou devolver dados após término do contrato</li>
            </ul>
            <h3>6.4. Suas Responsabilidades</h3>
            <p>Você é responsável por:</p>
            <ul>
              <li>Obter consentimento ou base legal para dados inseridos</li>
              <li>Garantir licitude e veracidade dos dados</li>
              <li>Informar titulares sobre uso da Plataforma</li>
              <li>Responder solicitações de titulares de dados</li>
              <li>Cumprir todas as obrigações de Controlador (LGPD)</li>
            </ul>
            <h3>6.5. Localização dos Dados</h3>
            <p>Dados são armazenados em data centers certificados no Brasil (AWS São Paulo), em conformidade com LGPD e ISO 27001.</p>
            <h3>6.6. Subcontratação</h3>
            <p>Podemos usar subcontratados (ex: AWS, serviços de e-mail) desde que com proteções contratuais adequadas.</p>
            <h3>6.7. Política de Privacidade</h3>
            <p>
              Nossa Política de Privacidade (<span class="muted">governancalegacy.com.br/privacidade</span>) detalha como tratamos dados pessoais
              e faz parte deste contrato.
            </p>
          </section>

          <section id="sla">
            <h2>7. NÍVEL DE SERVIÇO (SLA)</h2>
            <h3>7.1. Disponibilidade</h3>
            <p>Garantimos 99,5% de uptime mensal, excluindo:</p>
            <ul>
              <li>Manutenções programadas (notificadas com 48h de antecedência, máx. 4h/mês)</li>
              <li>Falhas de terceiros (internet, DNS, AWS)</li>
              <li>Força maior ou caso fortuito</li>
              <li>Ataques DDoS ou violações de segurança</li>
              <li>Uso indevido da Plataforma</li>
            </ul>
            <h3>7.2. Cálculo</h3>
            <p><strong>Uptime</strong> = (Total de minutos no mês - Minutos de indisponibilidade) / Total de minutos no mês</p>
            <h3>7.3. Suporte Técnico</h3>
            <details>
              <summary>Severidade e exemplos</summary>
              <ul>
                <li><strong>Crítica:</strong> Sistema completamente indisponível</li>
                <li><strong>Alta:</strong> Funcionalidade principal indisponível</li>
                <li><strong>Média:</strong> Funcionalidade secundária com workaround</li>
                <li><strong>Baixa:</strong> Dúvidas gerais e melhorias</li>
              </ul>
              <p class="note">Observação: você pode substituir este bloco por uma tabela de tempos de resposta (TTR) e tempos de resolução (TTR/MTTR), se desejar.</p>
            </details>
            <h3>7.4. Créditos por Descumprimento</h3>
            <p>Se uptime &lt; 99,5%:</p>
            <details>
              <summary>Condições</summary>
              <ul>
                <li>Crédito limitado a 50% da mensalidade</li>
                <li>Solicitação em até 30 dias do incidente</li>
                <li>Aplicado na próxima fatura</li>
                <li>Único recurso disponível por indisponibilidade</li>
              </ul>
              <p class="note">Se você tiver uma tabela de faixas (ex.: 99,0%–99,49% = X%, etc.), inclua aqui.</p>
            </details>
          </section>

          <section id="seguranca">
            <h2>8. SEGURANÇA DA INFORMAÇÃO</h2>
            <h3>8.1. Medidas de Segurança</h3>
            <p>Implementamos:</p>
            <ul>
              <li>Criptografia TLS 1.3 para dados em trânsito</li>
              <li>Criptografia AES-256 para dados em repouso</li>
              <li>Autenticação multifator (2FA) opcional</li>
              <li>Controle de acesso baseado em funções (RBAC)</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Testes de penetração periódicos</li>
              <li>Logs de auditoria de todas as ações</li>
            </ul>
            <h3>8.2. Backups</h3>
            <ul>
              <li>Backups automáticos diários</li>
              <li>Retenção de 30 dias</li>
              <li>Recuperação de desastres (RPO: 24h, RTO: 4h para Enterprise)</li>
              <li>Backups armazenados em região geograficamente separada</li>
            </ul>
            <h3>8.3. Certificações</h3>
            <ul>
              <li>ISO 27001 (Gestão de Segurança da Informação)</li>
              <li>Conformidade com LGPD</li>
              <li>Auditorias anuais de segurança</li>
            </ul>
            <h3>8.4. Incidentes de Segurança</h3>
            <p>Em caso de violação de dados:</p>
            <ul>
              <li>Notificação ao Cliente em até 24 horas</li>
              <li>Investigação completa e relatório</li>
              <li>Cooperação com autoridades (ANPD)</li>
              <li>Medidas corretivas imediatas</li>
            </ul>
          </section>

          <section id="propriedade-intelectual">
            <h2>9. PROPRIEDADE INTELECTUAL</h2>
            <h3>9.1. Propriedade da LEGACY</h3>
            <p>A Plataforma LEGACY OS, incluindo:</p>
            <ul>
              <li>Código-fonte e algoritmos</li>
              <li>Design e interface</li>
              <li>Marca, logotipos e materiais de marketing</li>
              <li>Documentação técnica</li>
              <li>Funcionalidades e inovações</li>
            </ul>
            <p>São propriedade exclusiva da LEGACY, protegidos por direitos autorais, marcas registradas e segredos comerciais.</p>
            <h3>9.2. Licença de Uso</h3>
            <p>Concedemos a você uma licença:</p>
            <ul>
              <li><strong>Não exclusiva:</strong> Outros clientes podem usar</li>
              <li><strong>Não transferível:</strong> Não pode ser revendida</li>
              <li><strong>Revogável:</strong> Termina com o contrato</li>
              <li><strong>Limitada:</strong> Apenas para uso conforme estes Termos</li>
            </ul>
            <h3>9.3. Propriedade dos Seus Dados</h3>
            <p>Você mantém todos os direitos sobre dados inseridos na Plataforma. Concede-nos apenas licença para processá-los conforme necessário para o serviço.</p>
            <h3>9.4. Feedback</h3>
            <p>Se você fornecer sugestões ou feedback, podemos usá-los livremente sem obrigação de compensação.</p>
          </section>

          <section id="confidencialidade">
            <h2>10. CONFIDENCIALIDADE</h2>
            <h3>10.1. Informações Confidenciais</h3>
            <p>Incluem dados técnicos, comerciais, estratégicos e quaisquer informações não públicas trocadas entre as partes.</p>
            <h3>10.2. Obrigações</h3>
            <p>Ambas as partes devem:</p>
            <ul>
              <li>Manter sigilo sobre informações confidenciais</li>
              <li>Não divulgar a terceiros sem autorização</li>
              <li>Usar apenas para fins deste contrato</li>
              <li>Proteger com mesmo cuidado de suas próprias informações</li>
            </ul>
            <h3>10.3. Exceções</h3>
            <p>Não são confidenciais informações:</p>
            <ul>
              <li>Já públicas sem violação deste contrato</li>
              <li>Já conhecidas pela parte receptora</li>
              <li>Desenvolvidas independentemente</li>
              <li>Divulgadas por ordem judicial (com notificação prévia)</li>
            </ul>
            <h3>10.4. Prazo</h3>
            <p>Obrigações de confidencialidade permanecem por 5 anos após término do contrato.</p>
          </section>

          <section id="prazo-e-rescisao">
            <h2>11. PRAZO E RESCISÃO</h2>
            <h3>11.1. Vigência</h3>
            <p>O contrato vigora por período indeterminado, com renovação automática conforme ciclo de faturamento escolhido.</p>
            <h3>11.2. Cancelamento pelo Cliente</h3>
            <p>Você pode cancelar a qualquer momento:</p>
            <ul>
              <li><strong>Planos mensais:</strong> Acesso até fim do período pago</li>
              <li><strong>Planos anuais:</strong> Sem reembolso proporcional (exceto direito de arrependimento)</li>
              <li>Cancelamento através da própria Plataforma ou suporte</li>
            </ul>
            <h3>11.3. Cancelamento pela LEGACY</h3>
            <p>Podemos encerrar sua conta com 30 dias de aviso se:</p>
            <ul>
              <li>Descontinuarmos o serviço</li>
              <li>Houver violação grave destes Termos</li>
              <li>Houver inadimplência persistente</li>
            </ul>
            <h3>11.4. Efeitos do Cancelamento</h3>
            <p>Após cancelamento:</p>
            <ul>
              <li>0-30 dias: Acesso em modo leitura para exportação de dados</li>
              <li>30-60 dias: Dados mantidos em backup (recuperação paga possível)</li>
              <li>Após 60 dias: Exclusão permanente e irrecuperável de todos os dados</li>
            </ul>
            <h3>11.5. Exportação de Dados</h3>
            <p>Você pode exportar seus dados a qualquer momento:</p>
            <ul>
              <li>Formatos: CSV, Excel, PDF, JSON</li>
              <li>Download via Plataforma ou solicitação ao suporte</li>
              <li>Sem custos durante vigência ou período de 30 dias pós-cancelamento</li>
            </ul>
          </section>

          <section id="limitacao">
            <h2>12. LIMITAÇÃO DE RESPONSABILIDADE</h2>
            <h3>12.1. Limitação de Valor</h3>
            <p>A responsabilidade total da LEGACY é limitada ao valor pago por você nos últimos 12 meses (mínimo R$ 500).</p>
            <h3>12.2. Exclusão de Danos</h3>
            <p>A LEGACY não é responsável por:</p>
            <ul>
              <li>Lucros cessantes ou perda de receita</li>
              <li>Perda de dados por erro seu</li>
              <li>Danos indiretos, incidentais ou consequências</li>
              <li>Perda de oportunidades de negócio</li>
              <li>Decisões tomadas com base em dados da Plataforma</li>
              <li>Conteúdo inserido por você ou seus usuários</li>
              <li>Falhas de terceiros (internet, energia, AWS)</li>
              <li>Força maior (desastres, guerras, pandemias)</li>
            </ul>
            <h3>12.3. Isenções</h3>
            <p>A Plataforma é fornecida "como está" e "conforme disponível". Não garantimos:</p>
            <ul>
              <li>Funcionamento ininterrupto ou livre de erros</li>
              <li>Adequação a todos os propósitos</li>
              <li>Resultados específicos de uso</li>
              <li>Conformidade com todas as regulamentações específicas do seu setor</li>
            </ul>
            <h3>12.4. Prazo para Reclamações</h3>
            <p>Qualquer reclamação deve ser feita em até 90 dias do evento gerador.</p>
          </section>

          <section id="indenizacao">
            <h2>13. INDENIZAÇÃO</h2>
            <p>Você concorda em indenizar e isentar a LEGACY de:</p>
            <ul>
              <li>Violações destes Termos por você</li>
              <li>Conteúdo ilegal ou infrator inserido por você</li>
              <li>Uso inadequado da Plataforma</li>
              <li>Violação de direitos de terceiros</li>
              <li>Reclamações de seus usuários ou clientes</li>
            </ul>
          </section>

          <section id="forca-maior">
            <h2>14. FORÇA MAIOR</h2>
            <p>Nenhuma parte será responsável por atrasos ou falhas causadas por eventos fora de controle razoável, incluindo:</p>
            <ul>
              <li>Desastres naturais</li>
              <li>Guerras, terrorismo, distúrbios civis</li>
              <li>Pandemias</li>
              <li>Falhas de infraestrutura crítica (internet, energia)</li>
              <li>Mudanças regulatórias governamentais</li>
              <li>Ataques cibernéticos em larga escala</li>
            </ul>
          </section>

          <section id="modificacoes">
            <h2>15. MODIFICAÇÕES DOS TERMOS</h2>
            <h3>15.1. Direito de Modificação</h3>
            <p>Podemos modificar estes Termos a qualquer momento. Alterações significativas serão notificadas com 30 dias de antecedência.</p>
            <h3>15.2. Notificação</h3>
            <p>Alterações serão comunicadas por:</p>
            <ul>
              <li>E-mail para conta principal</li>
              <li>Aviso na Plataforma</li>
              <li>Publicação em <span class="muted">legacyos.com.br/termos</span></li>
            </ul>
            <h3>15.3. Aceitação</h3>
            <p>O uso continuado após alterações constitui aceitação. Se não concordar, você deve cancelar sua conta.</p>
          </section>

          <section id="disposicoes-gerais">
            <h2>16. DISPOSIÇÕES GERAIS</h2>
            <h3>16.1. Acordo Integral</h3>
            <p>Estes Termos, junto com Política de Privacidade e documentos referenciados, constituem o acordo completo entre as partes.</p>
            <h3>16.2. Independência das Cláusulas</h3>
            <p>Se qualquer cláusula for considerada inválida, as demais permanecem em vigor.</p>
            <h3>16.3. Não Renúncia</h3>
            <p>Falha em exigir cumprimento de qualquer cláusula não constitui renúncia.</p>
            <h3>16.4. Cessão</h3>
            <p>Você não pode transferir este contrato sem nossa aprovação. Podemos transferir mediante notificação.</p>
            <h3>16.5. Notificações</h3>
            <p>Comunicações oficiais serão enviadas para:</p>
            <ul>
              <li><strong>Cliente:</strong> E-mail cadastrado na conta</li>
              <li><strong>LEGACY:</strong> <a href="mailto:roger@governancalegacy.com.br">roger@governancalegacy.com.br</a></li>
            </ul>
            <h3>16.6. Idioma</h3>
            <p>Em caso de conflito entre versões, prevalece a versão em português do Brasil.</p>
            <h3>16.7. Relacionamento</h3>
            <p>Este contrato não cria sociedade, parceria ou relação de trabalho entre as partes.</p>
            <h3>16.8. Auditoria</h3>
            <p>Clientes Enterprise podem, mediante aviso prévio de 30 dias, auditar nossa conformidade com obrigações de segurança e privacidade (máximo 1 vez por ano).</p>
          </section>

          <section id="legislacao-e-foro">
            <h2>17. LEGISLAÇÃO E FORO</h2>
            <h3>17.1. Lei Aplicável</h3>
            <p>Este contrato é regido pelas leis da República Federativa do Brasil, especialmente:</p>
            <ul>
              <li>Código Civil Brasileiro</li>
              <li>Código de Defesa do Consumidor (quando aplicável)</li>
              <li>Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)</li>
              <li>Marco Civil da Internet (Lei 12.965/2014)</li>
            </ul>
            <h3>17.2. Foro</h3>
            <p>Fica eleito o foro da Comarca de São Paulo - SP para dirimir controvérsias, com renúncia a qualquer outro.</p>
            <h3>17.3. Resolução de Disputas</h3>
            <p>Antes de iniciar ação judicial, as partes concordam em tentar resolver disputas por:</p>
            <ol>
              <li>Negociação direta (30 dias)</li>
              <li>Mediação (60 dias)</li>
              <li>Arbitragem ou ação judicial</li>
            </ol>
          </section>

          <section id="contato">
            <h2>18. CONTATO E SUPORTE</h2>
            <div class="two-col" role="group" aria-label="Dados de contato">
              <div class="callout">
                <p><strong>AURION VENTURES LTDA.</strong><br/>
                  CNPJ: <strong>63.657.780/0001-67</strong><br/>
                  Endereço: <strong>Av. Brig. Faria Lima, 1811, ESC 1119 - Jardim Paulistano, São Paulo - SP, 01452-001</strong>
                </p>
              </div>
              <div class="callout success">
                <p><strong>Canais de Atendimento:</strong></p>
                <ul>
                  <li>Suporte técnico: <a href="mailto:suporte@governancalegacy.com.br">suporte@governancalegacy.com.br</a></li>
                  <li>Comercial: <a href="mailto:contato@governancalegacy.com.br">contato@governancalegacy.com.br</a></li>
                </ul>
                <p><strong>Horário de Atendimento:</strong><br/>
                  Segunda a Sexta: 9h às 18h (horário de Brasília)<br/>
                  Planos Enterprise: Suporte 24x7
                </p>
              </div>
            </div>
          </section>

          <section id="aceitacao-eletronica">
            <h2>ACEITAÇÃO ELETRÔNICA</h2>
            <p>Ao clicar em <strong>"Aceito os Termos de Serviço"</strong> ou criar sua conta, você:</p>
            <ol>
              <li>Confirma ter lido e compreendido estes Termos</li>
              <li>Concorda em ficar legalmente vinculado</li>
              <li>Tem capacidade legal para contratar</li>
              <li>Representa sua empresa com autorização, se aplicável</li>
              <li>Aceita assinatura e contratação eletrônica conforme MP 2.200-2/2001 e Lei 14.063/2020</li>
            </ol>
            <div class="callout">
              <strong>Sua aceitação eletrônica tem validade jurídica equivalente a assinatura manuscrita.</strong>
            </div>
            <div class="divider"></div>
            <div class="accept" aria-label="Controles de aceitação (exemplo)">
              <div class="checkbox">
                <input id="chk" type="checkbox" />
                <label for="chk">
                  Declaro que li e aceito os Termos de Serviço e a Política de Privacidade aplicável.
                  <div class="note">Este checkbox é um exemplo visual. Integre com seu backend/registro de aceite.</div>
                </label>
              </div>
              <button class="btn primary" type="button">Aceito os Termos</button>
              <button class="btn" type="button">Voltar ao topo</button>
            </div>
            <p class="note" id="accept-status" aria-live="polite"></p>
          </section>
        </div>

        <div class="footer">
          <small>© 2026 LEGACY OS — Termos de Serviço (Versão 2.0)</small>
          <small class="muted">Documento para leitura e aceite eletrônico.</small>
        </div>
      </main>
    </div>
  </div>
</div>`;
