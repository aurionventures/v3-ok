import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface NewsletterFormProps {
  className?: string;
}

export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Por favor, insira um email válido.");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail("");
    toast.success("Inscrito com sucesso! Você receberá nossos insights.");
  };

  if (isSubscribed) {
    return (
      <div className={`flex items-center gap-2 text-sm text-emerald-400 ${className || ""}`}>
        <CheckCircle className="h-4 w-4" />
        <span>Inscrito com sucesso!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className || ""}`}>
      <Input
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/5 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500/50 h-9 text-sm"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="sm"
        disabled={isLoading}
        className="bg-amber-500 hover:bg-amber-600 text-slate-900 h-9 px-3"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
