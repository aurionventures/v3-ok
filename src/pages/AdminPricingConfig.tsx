import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Building2, CreditCard, Grid3X3, Package, Puzzle, Calculator, FileText } from "lucide-react";
import { usePricingConfig } from "@/hooks/usePricingConfig";
import { PortesPlanosTab } from "@/components/admin/pricing/PortesPlanosTab";
import { MatrizPricingTab } from "@/components/admin/pricing/MatrizPricingTab";
import { ModulosConfigTab } from "@/components/admin/pricing/ModulosConfigTab";
import { AddonsConfigTab } from "@/components/admin/pricing/AddonsConfigTab";
import { ComplexidadePesosTab } from "@/components/admin/pricing/ComplexidadePesosTab";
import { PricingLogicTab } from "@/components/admin/pricing/PricingLogicTab";
import { PLGSLGStrategyPDF } from "@/components/admin/pricing/PLGSLGStrategyPDF";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPricingConfig() {
  const [activeTab, setActiveTab] = useState("portes-planos");
  const { isLoading, isMutating } = usePricingConfig();

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Configurador de Planos" />
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configurador de Planos" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Configurador de Planos
                </h1>
                <p className="text-muted-foreground">
                  Gerencie portes, planos, pricing, módulos e add-ons da plataforma
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PLGSLGStrategyPDF />
                {isMutating && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                    Salvando...
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-flex">
                <TabsTrigger value="portes-planos" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Portes & Planos</span>
                </TabsTrigger>
                <TabsTrigger value="matriz-pricing" className="gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Matriz Pricing</span>
                </TabsTrigger>
                <TabsTrigger value="modulos" className="gap-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Módulos</span>
                </TabsTrigger>
                <TabsTrigger value="addons" className="gap-2">
                  <Puzzle className="h-4 w-4" />
                  <span className="hidden sm:inline">Add-ons</span>
                </TabsTrigger>
                <TabsTrigger value="logica-pricing" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Lógica Pricing</span>
                </TabsTrigger>
                <TabsTrigger value="complexidade" className="gap-2">
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Complexidade</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="portes-planos" className="space-y-6">
                <PortesPlanosTab />
              </TabsContent>

              <TabsContent value="matriz-pricing" className="space-y-6">
                <MatrizPricingTab />
              </TabsContent>

              <TabsContent value="modulos" className="space-y-6">
                <ModulosConfigTab />
              </TabsContent>

              <TabsContent value="addons" className="space-y-6">
                <AddonsConfigTab />
              </TabsContent>

              <TabsContent value="logica-pricing" className="space-y-6">
                <PricingLogicTab />
              </TabsContent>

              <TabsContent value="complexidade" className="space-y-6">
                <ComplexidadePesosTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
