import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const GeneratePartnerToken = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [partnerName, setPartnerName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Chama Edge Function para gerar e enviar token de parceiro
      const { error } = await supabase.functions.invoke('request-partner-access', {
        method: 'POST',
        body: { email, partnerName },
      });
      
      if (error) {
        // Tenta extrair a mensagem específica do erro da Edge Function
        const errorMessage = error.message || "Falha ao gerar token de parceiro.";
        toast({ 
          title: "Erro", 
          description: errorMessage,
          variant: "destructive" 
        });
        return;
      }
      
      toast({ 
        title: "Token gerado", 
        description: "Verifique seu email para o token de parceiro.", 
        variant: "default" 
      });
      
      // Redireciona para login de parceiro com email preenchido
      navigate('/login', { state: { userType: 'parceiro', email: email } });
      setPartnerName("");
      setEmail("");
    } catch (err: any) {
      toast({ 
        title: "Erro", 
        description: "Falha ao gerar token de parceiro.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-lg p-6 text-white flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <div>
            <h2 className="text-xl font-semibold">Gerar Token de Parceiro</h2>
            <p className="text-sm">Formulário para gerar tokens de acesso para parceiros (salvos no banco e enviados por email)</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="partner-name">Nome do Parceiro</Label>
            <Input
              id="partner-name"
              placeholder="Nome completo do parceiro"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="partner-email">Email do Parceiro</Label>
            <Input
              id="partner-email"
              type="email"
              placeholder="Digite o email do parceiro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
            onClick={handleGenerate}
            disabled={isLoading || !partnerName || !email}
          >
            {isLoading ? "Gerando..." : "Gerar Token de Parceiro"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneratePartnerToken;
