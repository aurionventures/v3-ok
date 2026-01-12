import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { MegaFooter } from "@/components/footer";

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-[#0A1929]">
      <MegaMenuHeader />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidade</h1>
          <p className="text-slate-400 mb-8">Última atualização: 11 de Janeiro de 2026</p>
          
          <div className="prose prose-invert prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introdução</h2>
              <p className="text-slate-300 leading-relaxed">
                A Legacy OS ("nós", "nosso" ou "Empresa") está comprometida em proteger a privacidade e os dados pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossa plataforma de governança corporativa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Dados que Coletamos</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li><strong className="text-white">Dados de Identificação:</strong> Nome completo, e-mail corporativo, cargo, telefone</li>
                <li><strong className="text-white">Dados da Empresa:</strong> Razão social, CNPJ, endereço, setor de atuação</li>
                <li><strong className="text-white">Dados de Uso:</strong> Logs de acesso, interações com a plataforma, preferências</li>
                <li><strong className="text-white">Dados de Governança:</strong> Atas, documentos, deliberações (sob sigilo)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Finalidade do Tratamento</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Utilizamos seus dados para as seguintes finalidades:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Prestação dos serviços contratados de governança corporativa</li>
                <li>Personalização da experiência do usuário</li>
                <li>Comunicações sobre atualizações e novos recursos</li>
                <li>Cumprimento de obrigações legais e regulatórias</li>
                <li>Análises estatísticas e melhorias da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Compartilhamento de Dados</h2>
              <p className="text-slate-300 leading-relaxed">
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing. Podemos compartilhar dados apenas com:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-4">
                <li>Prestadores de serviços essenciais (hospedagem, segurança, pagamentos)</li>
                <li>Autoridades competentes quando exigido por lei</li>
                <li>Auditores e consultores sob acordos de confidencialidade</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Segurança dos Dados</h2>
              <p className="text-slate-300 leading-relaxed">
                Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-4">
                <li>Criptografia AES-256 para dados em repouso</li>
                <li>TLS 1.3 para dados em trânsito</li>
                <li>Autenticação multifator (MFA)</li>
                <li>Monitoramento 24/7 e detecção de intrusões</li>
                <li>Backups regulares com redundância geográfica</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Seus Direitos (LGPD)</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Confirmação da existência de tratamento</li>
                <li>Acesso aos dados pessoais</li>
                <li>Correção de dados incompletos ou inexatos</li>
                <li>Anonimização, bloqueio ou eliminação de dados</li>
                <li>Portabilidade dos dados</li>
                <li>Revogação do consentimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Retenção de Dados</h2>
              <p className="text-slate-300 leading-relaxed">
                Mantemos seus dados pelo período necessário para cumprir as finalidades descritas nesta política, respeitando os prazos legais aplicáveis. Após o encerramento do contrato, os dados serão mantidos por até 5 anos para fins de compliance e auditoria, sendo então anonimizados ou excluídos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Contato do Encarregado (DPO)</h2>
              <p className="text-slate-300 leading-relaxed">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato com nosso Encarregado de Proteção de Dados:
              </p>
              <div className="bg-slate-800/50 p-4 rounded-lg mt-4">
                <p className="text-white font-medium">Encarregado de Dados - Legacy OS</p>
                <p className="text-slate-400">E-mail: privacidade@governancalegacy.com.br</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Alterações nesta Política</h2>
              <p className="text-slate-300 leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas por e-mail ou através de aviso na plataforma. Recomendamos revisar esta página regularmente.
              </p>
            </section>
          </div>
        </div>
      </main>

      <MegaFooter />
    </div>
  );
}
