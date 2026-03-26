import { useState } from "react";
import { Link } from "react-router-dom";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { MegaFooter } from "@/components/footer";
import { FAQSection, contatoFAQs } from "@/components/footer/FAQSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { formatCellphone } from "@/utils/masks";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    mensagem: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ nome: "", email: "", telefone: "", empresa: "", mensagem: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-corporate-dark">
      <MegaMenuHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight font-heading">
              Entre em Contato
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/80 leading-relaxed max-w-3xl mx-auto">
              Estamos prontos para ajudar sua empresa a alcançar a excelência em governança corporativa. Fale conosco!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="bg-white/5 border-border/20">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-white">Envie sua Mensagem</h3>
                  
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-500" aria-hidden="true" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2 text-white">Mensagem Enviada!</h4>
                      <p className="text-white/70">
                        Obrigado pelo contato. Nossa equipe responderá em breve.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome" className="text-white">Nome Completo *</Label>
                          <Input
                            id="nome"
                            placeholder="Seu nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            required
                            className="bg-white/10 border-border/30 text-white placeholder:text-white/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">E-mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-white/10 border-border/30 text-white placeholder:text-white/50"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="telefone" className="text-white">Telefone</Label>
                          <Input
                            id="telefone"
                            placeholder="(00) 00000-0000"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: formatCellphone(e.target.value) })}
                            maxLength={15}
                            className="bg-white/10 border-border/30 text-white placeholder:text-white/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="empresa" className="text-white">Empresa</Label>
                          <Input
                            id="empresa"
                            placeholder="Nome da empresa"
                            value={formData.empresa}
                            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                            className="bg-white/10 border-border/30 text-white placeholder:text-white/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mensagem" className="text-white">Mensagem *</Label>
                        <Textarea
                          id="mensagem"
                          placeholder="Como podemos ajudar?"
                          rows={5}
                          value={formData.mensagem}
                          onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                          required
                          className="bg-white/10 border-border/30 text-white placeholder:text-white/50"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Enviando..."
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" aria-hidden="true" />
                            Enviar Mensagem
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-white/50 text-center">
                        Ao enviar, você concorda com nossa{" "}
                        <Link to="/politica-privacidade" className="text-accent hover:underline">
                          Política de Privacidade
                        </Link>
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-6 text-white">Informações de Contato</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-accent" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-white">Endereço</h4>
                        <address className="text-sm text-white/70 not-italic">
                          Av. Brig. Faria Lima, 1811. ESC 1119<br />
                          Jardim Paulistano, São Paulo - SP<br />
                          CEP: 01452-001
                        </address>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="h-6 w-6 text-accent" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-white">Telefone</h4>
                        <p className="text-sm text-white/70">
                          +55 (11) 99999-9999
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                        <Mail className="h-6 w-6 text-accent" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-white">E-mail</h4>
                        <p className="text-sm text-white/70">
                          contato@legacyos.com.br
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <Card className="bg-white/5 border-border/20">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4 text-white">Links Rápidos</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start border-border/30 text-white hover:bg-white/10" asChild>
                        <Link to="/pricing">Ver Planos e Preços</Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-border/30 text-white hover:bg-white/10" asChild>
                        <Link to="/standalone-quiz">Fazer Diagnóstico Gratuito</Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-border/30 text-white hover:bg-white/10" asChild>
                        <Link to="/blog">Acessar o Blog</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection 
        title="Perguntas Frequentes"
        subtitle="Dúvidas sobre contato e suporte"
        faqs={contatoFAQs}
      />

      <MegaFooter />
    </div>
  );
}
