/**
 * Página de Parceiros e links de afiliados.
 * Cadastro de parceiros, links de afiliado e comissões.
 */

import { useState } from "react";
import { Link2, Users, DollarSign, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const ParceirosAfiliados = () => {
  const [activeTab, setActiveTab] = useState("parceiros");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Parceiros e Afiliados" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Parceiros e Links de Afiliados</h1>
            <p className="text-gray-500">Gestão de parceiros, links de afiliado e comissões</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="parceiros">Parceiros</TabsTrigger>
              <TabsTrigger value="afiliados">Afiliados</TabsTrigger>
              <TabsTrigger value="comissoes">Comissões</TabsTrigger>
            </TabsList>

            <TabsContent value="parceiros" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Parceiros ativos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">—</div>
                    <p className="text-xs text-muted-foreground">Cadastro e status</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Convites pendentes</CardTitle>
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">—</div>
                    <p className="text-xs text-muted-foreground">Aguardando aceite</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Cadastro de parceiros</CardTitle>
                  <CardDescription>
                    Inclua parceiros estratégicos, contato e tipo de parceria (conteúdo fictício).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Listagem e formulário de parceiros: nome, e-mail, tipo (consultoria, institucional, etc.)
                    e status. Sem conexão com backend nesta versão.
                  </p>
                  <Button className="mt-4">Novo parceiro</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="afiliados" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Links de afiliados</CardTitle>
                  <CardDescription>Geração e gestão de links de afiliado por parceiro ou campanha</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ExternalLink className="h-5 w-5" />
                    <span>
                      Crie links únicos por afiliado, campanha ou plano. Rastreamento de cliques e conversões
                      (conteúdo fictício).
                    </span>
                  </div>
                  <Button className="mt-4">Gerar link</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comissoes" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Comissões no período</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">—</div>
                  <p className="text-xs text-muted-foreground">Total a pagar / pago (fictício)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Regras de comissão</CardTitle>
                  <CardDescription>Percentual por plano, recorrência e bônus (fictício)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configuração de percentuais por tipo de venda (nova, renovação, upgrade) e por parceiro/afiliado.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ParceirosAfiliados;
