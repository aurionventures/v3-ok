import { MemberLayout } from "@/components/member/MemberLayout";
import { ClipboardCheck } from "lucide-react";
import { MemberAvaliacao360Tab } from "@/components/member/MemberAvaliacao360Tab";

const MemberDesempenho = () => {
  return (
    <MemberLayout 
      title="Meu Desempenho"
      subtitle="Avaliação 360° e Autoavaliação"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Avaliações 360°</h3>
        </div>
        <MemberAvaliacao360Tab />
      </div>
    </MemberLayout>
  );
};

export default MemberDesempenho;
