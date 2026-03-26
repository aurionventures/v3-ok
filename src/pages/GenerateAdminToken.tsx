import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const GenerateAdminToken = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("" );
  const [email, setEmail] = useState("" );
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Chama Edge Function para gerar token administrativo
      const { data, error } = await supabase.functions.invoke('request-admin-access', {
        method: 'POST',
        body: { name, email },
      });
      
      if (error) {
        // Tenta extrair a mensagem específica do erro da Edge Function
        const errorMessage = error.message || "Falha ao gerar token administrativo.";
        toast({ 
          title: "Erro", 
          description: errorMessage,
          variant: "destructive" 
        });
        return;
      }
      
      toast({ title: "Token gerado", description: "Verifique seu email para o token administrativo.", variant: "default" });
      // Redireciona ao login de administrador com email preenchido
      navigate('/login', { state: { userType: 'admin', email: email } });
      setName("");
      setEmail("");
    } catch (err: any) {
      toast({ 
        title: "Erro", 
        description: "email não autorizado para acesso administrativo", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-t-lg p-6 text-white flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <div>
            <h2 className="text-xl font-semibold">Gerar Token Administrativo</h2>
            <p className="text-sm">Formulário para gerar tokens administrativos (salvos no banco e enviados por email)</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="request-name">Nome do Administrador</Label>
            <Input
              id="request-name"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="request-email">Email do Administrador</Label>
            <Input
              id="request-email"
              type="email"
              placeholder="Digite o email do administrador"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90"
            onClick={handleGenerate}
            disabled={isLoading || !name || !email}
          >
            {isLoading ? "Gerando..." : "Gerar Token Administrativo"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateAdminToken;
