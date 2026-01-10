import { MemberLayout } from "@/components/member/MemberLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, GraduationCap, Lightbulb } from "lucide-react";
import { MemberAvaliacao360Tab } from "@/components/member/MemberAvaliacao360Tab";
import { MemberPDITab } from "@/components/member/MemberPDITab";
import { MemberRecomendacoesTab } from "@/components/member/MemberRecomendacoesTab";

const MemberDesempenho = () => {
  return (
    <MemberLayout 
      title="Meu Desempenho"
      subtitle="Avaliação, Plano de Desenvolvimento e Recomendações"
    >
      <Tabs defaultValue="avaliacao360" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="avaliacao360" className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Avaliações 360°</span>
            <span className="sm:hidden">360°</span>
          </TabsTrigger>
          <TabsTrigger value="pdi" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            PDI
          </TabsTrigger>
          <TabsTrigger value="recomendacoes" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Recomendações</span>
            <span className="sm:hidden">Rec.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="avaliacao360">
          <MemberAvaliacao360Tab />
        </TabsContent>

        <TabsContent value="pdi">
          <MemberPDITab />
        </TabsContent>

        <TabsContent value="recomendacoes">
          <MemberRecomendacoesTab />
        </TabsContent>
      </Tabs>
    </MemberLayout>
  );
};

export default MemberDesempenho;
