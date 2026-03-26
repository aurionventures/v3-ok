import { useState } from "react";
import { MemberLayout } from "@/components/member/MemberLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  Camera, 
  Award, 
  Plus, 
  Calendar,
  Building2,
  Edit2,
  Trash2,
  GraduationCap,
  Save
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  institution: string;
  date: string;
  type: "certificate" | "course" | "degree" | "award";
}

// Mock achievements data
const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Governança Corporativa Avançada",
    institution: "IBGC",
    date: "Dezembro 2025",
    type: "certificate"
  },
  {
    id: "2",
    title: "ESG para Conselheiros",
    institution: "FDC - Fundação Dom Cabral",
    date: "Novembro 2025",
    type: "course"
  },
  {
    id: "3",
    title: "MBA em Gestão Empresarial",
    institution: "FGV",
    date: "2020",
    type: "degree"
  }
];

const achievementTypeLabels = {
  certificate: "Certificado",
  course: "Curso",
  degree: "Formação",
  award: "Prêmio"
};

const achievementTypeIcons = {
  certificate: Award,
  course: GraduationCap,
  degree: Building2,
  award: Award
};

const MemberPerfil = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || "Roberto Alves",
    email: user?.email || "roberto.alves@empresa.com",
    phone: "(11) 99999-9999",
    linkedin: "linkedin.com/in/robertoalves"
  });

  const [newAchievement, setNewAchievement] = useState<Omit<Achievement, "id">>({
    title: "",
    institution: "",
    date: "",
    type: "certificate"
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso."
    });
  };

  const handleAddAchievement = () => {
    if (!newAchievement.title || !newAchievement.institution || !newAchievement.date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar a conquista.",
        variant: "destructive"
      });
      return;
    }

    const achievement: Achievement = {
      ...newAchievement,
      id: Date.now().toString()
    };

    setAchievements(prev => [achievement, ...prev]);
    setNewAchievement({ title: "", institution: "", date: "", type: "certificate" });
    setIsAddingAchievement(false);
    
    toast({
      title: "Conquista adicionada",
      description: "Sua nova conquista foi registrada com sucesso."
    });
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
    toast({
      title: "Conquista removida",
      description: "A conquista foi removida do seu perfil."
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <MemberLayout
      title="Meu Perfil"
      subtitle="Gerencie suas informações e conquistas"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">{formData.name}</h2>
                <Badge variant="secondary" className="mt-2">
                  Membro do Conselho
                </Badge>
                <p className="text-muted-foreground mt-2">
                  Conselho de Administração • Membro desde Jan 2024
                </p>
              </div>

              {/* Edit Button */}
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements & Certifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Conquistas & Certificações
            </CardTitle>
            <Dialog open={isAddingAchievement} onOpenChange={setIsAddingAchievement}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Conquista
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Conquista</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="achievement-title">Título</Label>
                    <Input
                      id="achievement-title"
                      placeholder="Ex: Certificação em Governança"
                      value={newAchievement.title}
                      onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="achievement-institution">Instituição</Label>
                    <Input
                      id="achievement-institution"
                      placeholder="Ex: IBGC"
                      value={newAchievement.institution}
                      onChange={(e) => setNewAchievement(prev => ({ ...prev, institution: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="achievement-date">Data de Conclusão</Label>
                    <Input
                      id="achievement-date"
                      placeholder="Ex: Dezembro 2025"
                      value={newAchievement.date}
                      onChange={(e) => setNewAchievement(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(achievementTypeLabels) as Array<keyof typeof achievementTypeLabels>).map((type) => (
                        <Badge
                          key={type}
                          variant={newAchievement.type === type ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setNewAchievement(prev => ({ ...prev, type }))}
                        >
                          {achievementTypeLabels[type]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingAchievement(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddAchievement}>
                    Adicionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conquista registrada ainda.</p>
                <p className="text-sm">Adicione suas certificações e cursos!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {achievements.map((achievement) => {
                  const Icon = achievementTypeIcons[achievement.type];
                  return (
                    <div 
                      key={achievement.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {achievement.institution}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs">
                            {achievementTypeLabels[achievement.type]}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {achievement.date}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteAchievement(achievement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MemberLayout>
  );
};

export default MemberPerfil;
