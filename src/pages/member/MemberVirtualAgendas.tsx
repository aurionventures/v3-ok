import { MemberLayout } from "@/components/member/MemberLayout";
import { VirtualAgendasTab } from "@/components/member/VirtualAgendasTab";

const MemberVirtualAgendas = () => {
  return (
    <MemberLayout 
      title="Pautas Virtuais"
      subtitle="Aprove ou solicite revisão de pautas e ATAs de reuniões virtuais"
    >
      <VirtualAgendasTab />
    </MemberLayout>
  );
};

export default MemberVirtualAgendas;
