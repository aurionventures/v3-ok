import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CompanySize, COMPANY_SIZE_LABELS } from "@/types/organization";
import { BASE_MODULES, ADDON_MODULES, isModuleIncludedInSize } from "@/utils/moduleMatrix";
import { SIDEBAR_SECTIONS } from "@/data/sidebarCatalog";

const SIZE_ORDER: CompanySize[] = ['startup', 'small', 'medium', 'large', 'listed'];

const AdminPlansComparison = () => {
  // Coleta todos os módulos de todas as seções
  const allModules = SIDEBAR_SECTIONS.flatMap(section => 
    section.items.map(item => ({
      ...item,
      section: section.label,
      sectionColor: section.color
    }))
  );

  // Verifica se o módulo é add-on
  const isAddon = (moduleKey: string) => 
    ADDON_MODULES.some(addon => addon.key === moduleKey);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Comparativo de Planos" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Matriz de Planos Legacy</h1>
            <p className="text-muted-foreground">
              Visualização completa dos módulos incluídos em cada porte de empresa
            </p>
          </div>

          {/* Legenda */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-sm">Incluído no plano</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm">Não incluído</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Add-on
              </Badge>
              <span className="text-sm">Módulo contratável separadamente</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[250px] font-bold">Módulo</TableHead>
                      {SIZE_ORDER.map(size => (
                        <TableHead key={size} className="text-center font-bold min-w-[120px]">
                          <div className="flex flex-col items-center gap-1">
                            <span>{COMPANY_SIZE_LABELS[size]}</span>
                            <Badge variant="secondary" className="text-[10px]">
                              {BASE_MODULES[size].length} módulos
                            </Badge>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center font-bold min-w-[100px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>Add-on ESG</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center font-bold min-w-[120px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>Add-on Intel.</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SIDEBAR_SECTIONS.map((section, sectionIdx) => (
                      <>
                        {/* Linha de cabeçalho da seção */}
                        <TableRow 
                          key={`section-${section.key}`} 
                          className="bg-muted/30 hover:bg-muted/30"
                        >
                          <TableCell 
                            colSpan={SIZE_ORDER.length + 3}
                            className="font-bold"
                          >
                            <div className="flex items-center gap-2">
                              <section.icon className={`h-4 w-4 ${section.color}`} />
                              <span>{section.label}</span>
                              {section.premium && (
                                <Badge variant="outline" className="text-[10px]">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {/* Linhas de módulos */}
                        {section.items.map(item => (
                          <TableRow key={item.key}>
                            <TableCell className="pl-8">
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                                <span>{item.label}</span>
                                {isAddon(item.key) && (
                                  <Badge variant="outline" className="text-[10px] h-5">
                                    Add-on
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            
                            {/* Colunas de cada porte */}
                            {SIZE_ORDER.map(size => {
                              const included = isModuleIncludedInSize(item.key, size);
                              return (
                                <TableCell key={size} className="text-center">
                                  {included ? (
                                    <div className="flex justify-center">
                                      <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20">
                                        <Check className="h-4 w-4 text-green-500" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center">
                                      <div className="w-6 h-6 rounded flex items-center justify-center bg-muted">
                                        <X className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </div>
                                  )}
                                </TableCell>
                              );
                            })}
                            
                            {/* Coluna Add-on ESG */}
                            <TableCell className="text-center">
                              {item.key === 'esg_maturity' ? (
                                <div className="flex justify-center">
                                  <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20">
                                    <Check className="h-4 w-4 text-green-500" />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            
                            {/* Coluna Add-on Intel. Mercado */}
                            <TableCell className="text-center">
                              {(item.key === 'market_intel' || item.key === 'benchmarking') ? (
                                <div className="flex justify-center">
                                  <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20">
                                    <Check className="h-4 w-4 text-green-500" />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}
                    
                    {/* Linha de totais */}
                    <TableRow className="bg-primary/5 font-bold">
                      <TableCell>Total de Módulos</TableCell>
                      {SIZE_ORDER.map(size => (
                        <TableCell key={size} className="text-center">
                          <Badge variant="default">{BASE_MODULES[size].length}</Badge>
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <Badge variant="outline">1</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">2</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPlansComparison;
