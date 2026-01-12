import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { MegaFooter } from "@/components/footer";

export default function TermosUso() {
  return (
    <div className="min-h-screen bg-[#0A1929]">
      <MegaMenuHeader />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8">Termos de Uso</h1>
          <p className="text-slate-400 mb-8">Última atualização: 11 de Janeiro de 2026</p>
          
          <div className="prose prose-invert prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
              <p className="text-slate-300 leading-relaxed">
                Ao acessar e utilizar a plataforma Legacy OS, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Descrição do Serviço</h2>
              <p className="text-slate-300 leading-relaxed">
                A Legacy OS é uma plataforma SaaS (Software as a Service) especializada em governança corporativa, oferecendo funcionalidades como:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-4">
                <li>Gestão de conselhos e comitês</li>
                <li>Geração automatizada de pautas e atas</li>
                <li>Repositório seguro de documentos</li>
                <li>Módulos de compliance e riscos</li>
                <li>Inteligência artificial aplicada à governança (AI Engine)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Cadastro e Conta</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Para utilizar a plataforma, você deve:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Fornecer informações verdadeiras, precisas e completas</li>
                <li>Manter suas credenciais de acesso em sigilo</li>
                <li>Notificar imediatamente qualquer uso não autorizado</li>
                <li>Ser responsável por todas as atividades realizadas em sua conta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Uso Permitido</h2>
              <p className="text-slate-300 leading-relaxed">
                Você concorda em utilizar a plataforma apenas para fins legítimos de governança corporativa. É expressamente proibido:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-4">
                <li>Violar leis ou regulamentos aplicáveis</li>
                <li>Transmitir conteúdo ilegal, difamatório ou ofensivo</li>
                <li>Tentar acessar sistemas ou dados não autorizados</li>
                <li>Interferir no funcionamento da plataforma</li>
                <li>Utilizar a plataforma para fins que não sejam de governança</li>
                <li>Realizar engenharia reversa ou descompilar o software</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Propriedade Intelectual</h2>
              <p className="text-slate-300 leading-relaxed">
                A plataforma Legacy OS, incluindo sua marca, código-fonte, design, funcionalidades e documentação, são propriedade exclusiva da Legacy OS Tecnologia Ltda. É concedida ao usuário uma licença limitada, não exclusiva e intransferível para uso da plataforma durante a vigência do contrato.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Conteúdo do Usuário</h2>
              <p className="text-slate-300 leading-relaxed">
                Você mantém a propriedade sobre todo o conteúdo que inserir na plataforma. Ao utilizar nossos serviços, você nos concede uma licença limitada para processar, armazenar e exibir esse conteúdo exclusivamente para prestação do serviço contratado. Não utilizaremos seu conteúdo para outros fins sem autorização expressa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Disponibilidade e SLA</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Nos comprometemos com os seguintes níveis de serviço:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li><strong className="text-white">Essencial:</strong> 99,5% de uptime mensal</li>
                <li><strong className="text-white">Profissional:</strong> 99,7% de uptime mensal</li>
                <li><strong className="text-white">Business:</strong> 99,9% de uptime mensal</li>
                <li><strong className="text-white">Enterprise:</strong> 99,95% de uptime mensal</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                Manutenções programadas serão comunicadas com antecedência mínima de 48 horas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Pagamento e Renovação</h2>
              <p className="text-slate-300 leading-relaxed">
                Os planos são cobrados conforme contrato (mensal ou anual). A renovação é automática, salvo cancelamento com 30 dias de antecedência. Em caso de inadimplência, o acesso poderá ser suspenso após 15 dias do vencimento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Limitação de Responsabilidade</h2>
              <p className="text-slate-300 leading-relaxed">
                A Legacy OS não se responsabiliza por danos indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou impossibilidade de uso da plataforma. Nossa responsabilidade total está limitada ao valor pago pelo cliente nos últimos 12 meses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Rescisão</h2>
              <p className="text-slate-300 leading-relaxed">
                O contrato pode ser rescindido por qualquer das partes mediante aviso prévio de 30 dias. A Legacy OS pode suspender ou encerrar o acesso imediatamente em caso de violação destes termos. Após rescisão, seus dados ficarão disponíveis para exportação por 30 dias.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Disposições Gerais</h2>
              <p className="text-slate-300 leading-relaxed">
                Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias. A tolerância quanto a eventual descumprimento não implica renúncia ou novação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contato</h2>
              <p className="text-slate-300 leading-relaxed">
                Para dúvidas sobre estes Termos de Uso:
              </p>
              <div className="bg-slate-800/50 p-4 rounded-lg mt-4">
                <p className="text-white font-medium">Legacy OS Tecnologia Ltda.</p>
                <p className="text-slate-400">E-mail: legal@governancalegacy.com.br</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <MegaFooter />
    </div>
  );
}
