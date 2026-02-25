import { Link } from "react-router-dom";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A1628]">
      <LandingNav />
      <main className="flex-1 legacy-gradient text-white py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-montserrat text-3xl font-bold mb-2">
            Política de Privacidade e LGPD
          </h1>
          <p className="font-lato text-white/70 text-sm mb-10">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>

          <section className="mb-10">
            <h2 className="font-montserrat text-xl font-semibold mb-4 text-legacy-gold">
              Política de Privacidade
            </h2>
            <p className="font-lato text-white/80 text-sm leading-relaxed mb-4">
              A Legacy OS está comprometida com a proteção dos seus dados pessoais.
              Esta política descreve como coletamos, usamos, armazenamos e
              protegemos as informações dos usuários da nossa plataforma.
            </p>
            <p className="font-lato text-white/80 text-sm leading-relaxed mb-4">
              Utilizamos cookies e tecnologias semelhantes para melhorar sua
              experiência, analisar o uso do site e personalizar conteúdo.
              Ao continuar navegando, você concorda com o uso de cookies conforme
              descrito nesta política.
            </p>
          </section>

          <section id="lgpd" className="mb-10 scroll-mt-24">
            <h2 className="font-montserrat text-xl font-semibold mb-4 text-legacy-gold">
              Lei Geral de Proteção de Dados (LGPD)
            </h2>
            <p className="font-lato text-white/80 text-sm leading-relaxed mb-4">
              Em conformidade com a Lei nº 13.709/2018 (LGPD), tratamos seus
              dados pessoais com base em fundamentos legais previstos na lei,
              garantindo transparência, segurança e os direitos dos titulares.
            </p>
            <p className="font-lato text-white/80 text-sm leading-relaxed mb-4">
              Você pode exercer seus direitos de acesso, correção, exclusão,
              portabilidade e revogação do consentimento entrando em contato
              conosco pelos canais indicados no site.
            </p>
          </section>

          <div className="pt-6">
            <Link
              to="/"
              className="font-lato text-legacy-gold hover:underline text-sm"
            >
              Voltar à página inicial
            </Link>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default PoliticaPrivacidade;
