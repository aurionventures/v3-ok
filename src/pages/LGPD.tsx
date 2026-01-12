import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { MegaFooter } from "@/components/footer";

export default function LGPD() {
  return (
    <div className="min-h-screen bg-[#0A1929]">
      <MegaMenuHeader />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8">LGPD - Lei Geral de Proteção de Dados</h1>
          <p className="text-slate-400 mb-8">Última atualização: 11 de Janeiro de 2026</p>
          
          <div className="prose prose-invert prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Nosso Compromisso com a LGPD</h2>
              <p className="text-slate-300 leading-relaxed">
                A Legacy OS está em total conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018). Esta página detalha como tratamos seus dados pessoais e como você pode exercer seus direitos enquanto titular.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Bases Legais para Tratamento</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Tratamos dados pessoais com base nas seguintes hipóteses legais previstas no Art. 7º da LGPD:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Execução de Contrato (Art. 7º, V)</h3>
                  <p className="text-slate-400 text-sm">Tratamos dados necessários para prestar os serviços contratados de governança corporativa.</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Legítimo Interesse (Art. 7º, IX)</h3>
                  <p className="text-slate-400 text-sm">Utilizamos dados para melhorar nossos serviços e personalizar a experiência, sempre respeitando direitos do titular.</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Cumprimento de Obrigação Legal (Art. 7º, II)</h3>
                  <p className="text-slate-400 text-sm">Mantemos registros conforme exigências legais e regulatórias aplicáveis.</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Consentimento (Art. 7º, I)</h3>
                  <p className="text-slate-400 text-sm">Para finalidades específicas não cobertas pelas bases acima, solicitamos seu consentimento expresso.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Seus Direitos como Titular</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                A LGPD garante os seguintes direitos aos titulares de dados pessoais:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/30 border border-slate-700 p-4 rounded-lg">
                  <h3 className="text-[#C0A062] font-medium mb-2">Confirmação e Acesso</h3>
                  <p className="text-slate-400 text-sm">Confirmar se tratamos seus dados e obter acesso a eles.</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 p-4 rounded-lg">
                  <h3 className="text-[#C0A062] font-medium mb-2">Correção</h3>
                  <p className="text-slate-400 text-sm">Solicitar correção de dados incompletos, inexatos ou desatualizados.</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 p-4 rounded-lg">
                  <h3 className="text-[#C0A062] font-medium mb-2">Anonimização e Bloqueio</h3>
                  <p className="text-slate-400 text-sm">Solicitar anonimização, bloqueio ou eliminação de dados desnecessários.</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 p-4 rounded-lg">
                  <h3 className="text-[#C0A062] font-medium mb-2">Portabilidade</h3>
                  <p className="text-slate-400 text-sm">Solicitar portabilidade dos dados a outro fornecedor de serviço.</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 p-4 rounded-lg">
                  <h3 className="text-[#C0A062] font-medium mb-2">Eliminação</h3>
                  <p className="text-slate-400 text-sm">Solicitar eliminação dos dados tratados com base no consentimento.</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 p-4 rounded-lg">
                  <h3 className="text-[#C0A062] font-medium mb-2">Revogação</h3>
                  <p className="text-slate-400 text-sm">Revogar consentimento a qualquer momento, de forma gratuita e facilitada.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Como Exercer seus Direitos</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Para exercer qualquer dos direitos acima, você pode:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Enviar e-mail para nosso Encarregado de Dados (DPO)</li>
                <li>Utilizar o formulário de solicitação dentro da plataforma</li>
                <li>Entrar em contato pelo canal de suporte</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                Responderemos sua solicitação em até 15 dias úteis, conforme previsto na legislação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Cookies e Tecnologias Similares</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Utilizamos cookies para:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li><strong className="text-white">Cookies Essenciais:</strong> Necessários para funcionamento da plataforma</li>
                <li><strong className="text-white">Cookies de Preferências:</strong> Lembram suas configurações e preferências</li>
                <li><strong className="text-white">Cookies Analíticos:</strong> Ajudam a entender como você usa a plataforma</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                Você pode gerenciar suas preferências de cookies a qualquer momento através das configurações do navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Transferência Internacional</h2>
              <p className="text-slate-300 leading-relaxed">
                Nossos servidores estão localizados no Brasil. Quando necessário transferir dados para outros países (por exemplo, para uso de serviços de infraestrutura), garantimos que o país de destino proporciona grau de proteção adequado ou utilizamos cláusulas contratuais padrão aprovadas pela ANPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Incidentes de Segurança</h2>
              <p className="text-slate-300 leading-relaxed">
                Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, comunicaremos à Autoridade Nacional de Proteção de Dados (ANPD) e aos titulares afetados em prazo razoável, conforme Art. 48 da LGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Encarregado de Proteção de Dados (DPO)</h2>
              <p className="text-slate-300 leading-relaxed">
                Nosso Encarregado de Proteção de Dados é responsável por receber reclamações e comunicações dos titulares e da ANPD:
              </p>
              <div className="bg-slate-800/50 p-6 rounded-lg mt-4">
                <p className="text-white font-medium text-lg mb-2">Encarregado de Dados - Legacy OS</p>
                <p className="text-slate-400">E-mail: dpo@governancalegacy.com.br</p>
                <p className="text-slate-400">Endereço: Av. Paulista, 1000 - São Paulo/SP</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Reclamações à ANPD</h2>
              <p className="text-slate-300 leading-relaxed">
                Caso entenda que o tratamento de seus dados pessoais viola a legislação, você tem direito de apresentar petição à Autoridade Nacional de Proteção de Dados (ANPD):
              </p>
              <div className="bg-slate-800/50 p-4 rounded-lg mt-4">
                <p className="text-slate-400">Site: <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-[#C0A062] hover:underline">www.gov.br/anpd</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <MegaFooter />
    </div>
  );
}
