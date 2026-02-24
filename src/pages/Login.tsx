
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Building } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if admin login is requested (via URL param or state)
  const isAdminLogin = searchParams.get("type") === "admin" || location.state?.userType === "admin";

  // Show only company login by default, or admin login if specified
  const [loginView, setLoginView] = useState(isAdminLogin ? "admin" : "company");
  
  useEffect(() => {
    // Update view if URL params change
    setLoginView(isAdminLogin ? "admin" : "company");
  }, [isAdminLogin]);

  const handleLogin = async (userType: string) => {
    setIsLoading(true);
    
    // Simulate login - in a real app, this would call an authentication API
    setTimeout(() => {
      setIsLoading(false);
      
      // Basic validation
      if (!email || !password) {
        toast({
          title: "Erro de Login",
          description: "Por favor, preencha todos os campos.",
          variant: "destructive",
        });
        return;
      }
      
      // Check credentials
      const validCredentials = 
        (userType === "company" && email === "empresa@legacy.com" && password === "123") ||
        (userType === "admin" && email === "master@legacy.com" && password === "123");
      
      if (!validCredentials) {
        toast({
          title: "Erro de Login",
          description: "Email ou senha inválidos.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo ao Legacy como ${userType === "admin" ? "Administrador" : "Empresa"}.`,
      });
      
      // Redirect to different pages based on user type
      if (userType === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
              alt="Legacy" 
              className="h-12 w-auto mx-auto mb-2"
            />
            <p className="text-gray-600 mt-2">Governança Corporativa para Empresas Familiares</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex w-full mb-6">
              <button
                className={`flex-1 flex flex-col items-center justify-center p-4 ${
                  loginView === "company" 
                    ? "bg-legacy-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } rounded-l-lg transition-colors`}
                onClick={() => setLoginView("company")}
              >
                <Building className={`h-6 w-6 ${loginView === "company" ? "text-white" : "text-gray-600"} mb-2`} />
                <span className="font-medium">Empresa</span>
              </button>
              
              <button
                className={`flex-1 flex flex-col items-center justify-center p-4 ${
                  loginView === "admin" 
                    ? "bg-legacy-purple-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } rounded-r-lg transition-colors`}
                onClick={() => setLoginView("admin")}
              >
                <Shield className={`h-6 w-6 ${loginView === "admin" ? "text-white" : "text-gray-600"} mb-2`} />
                <span className="font-medium">Admin Master</span>
              </button>
            </div>

            {loginView === "admin" ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-legacy-purple-500">Administrador Master</h2>
                  <p className="text-sm text-gray-500">Acesso exclusivo para administradores da plataforma</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email de Administrador</Label>
                  <Input 
                    id="admin-email" 
                    type="email" 
                    placeholder="admin@legacy.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Senha de Administrador</Label>
                  <Input 
                    id="admin-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="text-right">
                  <a href="#" className="text-sm text-legacy-purple-500 hover:underline">
                    Esqueceu sua senha?
                  </a>
                </div>
                <Button 
                  className="w-full bg-legacy-purple-500 hover:bg-opacity-90"
                  disabled={isLoading}
                  onClick={() => handleLogin("admin")}
                >
                  {isLoading ? "Entrando..." : "Entrar como Administrador"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-legacy-500">Empresa</h2>
                  <p className="text-sm text-gray-500">Acesso para empresas cadastradas na plataforma</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input 
                    id="company-email" 
                    type="email" 
                    placeholder="seu@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-password">Senha</Label>
                  <Input 
                    id="company-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="text-right">
                  <a href="#" className="text-sm text-legacy-500 hover:underline">
                    Esqueceu sua senha?
                  </a>
                </div>
                <Button 
                  className="w-full bg-legacy-500 hover:bg-legacy-600"
                  disabled={isLoading}
                  onClick={() => handleLogin("company")}
                >
                  {isLoading ? "Entrando..." : "Entrar como Empresa"}
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <a href="#" className="text-legacy-500 hover:underline">
                    Registre-se
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative legacy-gradient">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Evolua a governança da sua empresa familiar</h2>
          <p className="text-lg max-w-md text-center mb-8">
            Plataforma completa para organizar, documentar, operacionalizar e evoluir sua governança corporativa.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">Estrutura Organizada</h3>
              <p className="text-sm">Conselhos, rituais e documentos em um só lugar</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">Sucessão Planejada</h3>
              <p className="text-sm">Prepare sua empresa para as próximas gerações</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">Diagnóstico Contínuo</h3>
              <p className="text-sm">Visualize a maturidade da sua governança</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">ESG Integrado</h3>
              <p className="text-sm">Sustentabilidade na agenda da governança</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
