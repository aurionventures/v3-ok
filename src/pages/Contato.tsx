import { useState } from "react";
import { Link } from "react-router-dom";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { MegaFooter } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { HeroSection } from "@/components/landing";

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
    <div className="min-h-screen bg-background">
      <MegaMenuHeader />
      
      {/* Hero Section */}
      <HeroSection
        title="Entre em Contato"
        subtitle="Estamos prontos para ajudar sua empresa a alcançar a excelência em governança corporativa. Fale conosco!"
      />

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-foreground">Envie sua Mensagem</h3>
                  
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-success" aria-hidden="true" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2 text-foreground">Mensagem Enviada!</h4>
                      <p className="text-muted-foreground">
                        Obrigado pelo contato. Nossa equipe responderá em breve.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome Completo *</Label>
                          <Input
                            id="nome"
                            placeholder="Seu nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            placeholder="(00) 00000-0000"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="empresa">Empresa</Label>
                          <Input
                            id="empresa"
                            placeholder="Nome da empresa"
                            value={formData.empresa}
                            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mensagem">Mensagem *</Label>
                        <Textarea
                          id="mensagem"
                          placeholder="Como podemos ajudar?"
                          rows={5}
                          value={formData.mensagem}
                          onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                          required
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

                      <p className="text-xs text-muted-foreground text-center">
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
                  <h3 className="text-xl font-bold mb-6 text-foreground">Informações de Contato</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-accent" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">Endereço</h4>
                        <address className="text-sm text-muted-foreground not-italic">
                          Av. Brig. Faria Lima, 1811. ESC 1119<br />
                          Jardim Paulistano, São Paulo - SP<br />
                          CEP: 01452-001
                        </address>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="h-6 w-6 text-accent" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">Telefone</h4>
                        <p className="text-sm text-muted-foreground">
                          +55 (11) 99999-9999
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                        <Mail className="h-6 w-6 text-accent" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">E-mail</h4>
                        <p className="text-sm text-muted-foreground">
                          contato@legacyos.com.br
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <Card className="border border-border">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4 text-foreground">Links Rápidos</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/pricing">Ver Planos e Preços</Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/standalone-quiz">Fazer Diagnóstico Gratuito</Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
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

      <MegaFooter />
    </div>
  );
}
