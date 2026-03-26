import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import GovMetrixLeadsCRMView from "@/components/crm/GovMetrixLeadsCRMView";

export default function AdminGovMetrixCRM() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="CRM GovMetrix®" />
        <main className="flex-1 overflow-auto p-6">
          <GovMetrixLeadsCRMView />
        </main>
      </div>
    </div>
  );
}
