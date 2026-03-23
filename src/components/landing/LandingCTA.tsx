import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { insertLeadContato } from "@/services/leadsDiagnostico";

const LandingCTA = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", org: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ title: "Preencha nome e email", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await insertLeadContato({
      nome: form.name.trim(),
      email: form.email.trim(),
      telefone: form.phone.trim() || undefined,
      empresa: form.org.trim() || undefined,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao enviar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Solicitação enviada!", description: "Em breve entraremos em contato." });
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
              <Button type="submit" className="w-full legacy-button-primary h-12 bg-legacy-gold text-legacy-500 hover:bg-legacy-gold hover:text-legacy-500 active:bg-legacy-gold active:text-legacy-500 focus:bg-legacy-gold focus:text-legacy-500" disabled={saving}>
                {saving ? "Enviando..." : "Enviar Solicitação"} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCTA;
