import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CalendarCheck, Eye, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const LandingCTA = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", org: "", phone: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ title: "Preencha nome e email", variant: "destructive" });
      return;
    }
    toast({ title: "Solicitação enviada!", description: "Entraremos em contato em breve." });
    setForm({ name: "", email: "", org: "", phone: "" });
  };

  return (
    <section className="legacy-gradient text-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-4">
              Pronto para Elevar Sua Governança?
            </h2>
            <p className="font-lato text-lg text-white/70">
              Dê o próximo passo em direção a decisões mais claras e governança mais inteligente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Button className="legacy-button-primary text-base px-6 py-5 h-auto" onClick={() => navigate("/login")}>
              <CalendarCheck className="h-5 w-5 mr-2" /> Agendar Demonstração
            </Button>
            <Button className="legacy-button-secondary text-base px-6 py-5 h-auto" onClick={() => navigate("/login")}>
              <Eye className="h-5 w-5 mr-2" /> Conhecer a Legacy OS
            </Button>
            <Button className="legacy-button-secondary text-base px-6 py-5 h-auto" onClick={() => navigate("/login")}>
              <BarChart3 className="h-5 w-5 mr-2" /> Fazer Diagnóstico
            </Button>
          </div>

          <div className="max-w-lg mx-auto">
            <h3 className="font-montserrat text-lg font-semibold text-center mb-6 text-white/90">
              Ou entre em contato
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-sm">Nome</Label>
                  <Input
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    placeholder="Seu nome"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-white/70 text-sm">Email</Label>
                  <Input
                    type="email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-white/70 text-sm">Organização</Label>
                  <Input
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    placeholder="Sua empresa"
                    value={form.org}
                    onChange={(e) => setForm((p) => ({ ...p, org: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-white/70 text-sm">Telefone</Label>
                  <Input
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    placeholder="(11) 99999-9999"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full legacy-button-primary h-12">
                Enviar Solicitação <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCTA;
