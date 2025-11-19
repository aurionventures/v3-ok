import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { SecretariatDashboard } from "@/components/councils/SecretariatDashboard";

const SecretariatPanel = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Painel de Secretariado" />
        <div className="flex-1 overflow-y-auto p-6">
          <SecretariatDashboard />
        </div>
      </div>
    </div>
  );
};

export default SecretariatPanel;