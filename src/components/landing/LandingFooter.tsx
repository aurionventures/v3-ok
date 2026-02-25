import { Link } from "react-router-dom";

const LandingFooter = () => {
  return (
    <footer className="bg-[#0B1628] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/">
              <img
                src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png"
                alt="Legacy OS"
                className="h-8 w-auto brightness-0 invert mb-4"
              />
            </Link>
            <p className="font-lato text-white/60 text-sm leading-relaxed">
              O primeiro Sistema Operacional de Governança Corporativa com IA nativa.
            </p>
          </div>

          <div>
            <h3 className="font-montserrat text-sm font-semibold mb-4 text-legacy-gold uppercase tracking-wider">Plataforma</h3>
            <ul className="space-y-2 font-lato text-sm text-white/60">
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a></li>
              <li><Link to="/planos" className="hover:text-white transition-colors">Planos</Link></li>
              <li><Link to="/modulos/ai-engine/governanca/diagnostico" className="hover:text-white transition-colors">AI Engine / Diagnóstico</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-montserrat text-sm font-semibold mb-4 text-legacy-gold uppercase tracking-wider">Recursos</h3>
            <ul className="space-y-2 font-lato text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-montserrat text-sm font-semibold mb-4 text-legacy-gold uppercase tracking-wider">Empresa</h3>
            <ul className="space-y-2 font-lato text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Parceiros</a></li>
              <li><a href="/investors" className="hover:text-white transition-colors">Investidores</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-6">
            <a href="#" className="font-lato text-white/40 hover:text-white transition-colors text-xs">Política de Privacidade</a>
            <a href="#" className="font-lato text-white/40 hover:text-white transition-colors text-xs">Termos de Uso</a>
            <a href="#" className="font-lato text-white/40 hover:text-white transition-colors text-xs">LGPD</a>
          </div>
          <div className="font-lato text-xs text-white/40">
            &copy; {new Date().getFullYear()} Legacy OS. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
