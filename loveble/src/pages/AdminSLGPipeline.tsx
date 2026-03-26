/**
 * Página Admin: Pipeline SLG (Sales-Led Growth)
 * Gerenciamento de leads encaminhados para atendimento comercial
 */

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SLGLeadsDashboard from "@/components/crm/SLGLeadsDashboard";

export default function AdminSLGPipeline() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Pipeline SLG" />
        <main className="flex-1 overflow-auto p-6">
          <SLGLeadsDashboard />
        </main>
      </div>
    </div>
  );
}
