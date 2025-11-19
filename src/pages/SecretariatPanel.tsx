import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecretariatDashboard } from "@/components/councils/SecretariatDashboard";
import { ConvocationSystem } from "@/components/councils/ConvocationSystem";
import { MaterialsCenter } from "@/components/councils/MaterialsCenter";
import { LayoutDashboard, Send, FileText } from "lucide-react";

const SecretariatPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Painel de Secretariado" />
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="convocations" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Convocações
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Materiais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <SecretariatDashboard
                onOpenConvocations={() => setActiveTab("convocations")}
                onOpenMaterials={() => setActiveTab("materials")}
              />
            </TabsContent>

            <TabsContent value="convocations">
              <ConvocationSystem />
            </TabsContent>

            <TabsContent value="materials">
              <MaterialsCenter />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SecretariatPanel;