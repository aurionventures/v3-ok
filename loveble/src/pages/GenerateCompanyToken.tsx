import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Building } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const GenerateCompanyToken = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Chama Edge Function para gerar e enviar token
      const { error } = await supabase.functions.invoke('request-access', {
        method: 'POST',
        body: { email, companyName },
      });
      if (error) throw error;
      toast({ title: "Token gerado", description: "Verifique seu email de contato.", variant: "default" });
      // Redireciona para login de cliente passando email via state
      navigate('/login', { state: { userType: 'cliente', email: email } });
      setCompanyName("");
      setEmail("");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Falha ao gerar token.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border">
        <div className="bg-gradient-to-r from-legacy-500 to-legacy-600 rounded-t-lg p-6 text-white flex items-center space-x-2">
          <Building className="h-6 w-6" />
          <div>
            <h2 className="text-xl font-semibold">Gerar Token de Acesso</h2>
            <p className="text-sm">Formulário para gerar tokens de acesso para empresas (salvos no banco e enviados por email)</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="company-name">Nome da Empresa</Label>
            <Input
              id="company-name"
              placeholder="Nome completo da empresa"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="company-email">Email de Contato</Label>
            <Input
              id="company-email"
              type="email"
              placeholder="Digite o email de contato"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-legacy-500 hover:bg-legacy-600"
            onClick={handleGenerate}
            disabled={isLoading || !companyName || !email}
          >
            {isLoading ? "Gerando..." : "Gerar Token de Acesso"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateCompanyToken;
