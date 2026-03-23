import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target, TrendingUp, Users, CheckCircle, Globe, DollarSign, Award, Star } from "lucide-react";

const Investors = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
              alt="Legacy" 
              className="h-8 w-auto"
            />
            <p className="ml-3 text-sm text-gray-600">Family Office Governance Tech</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              className="bg-legacy-purple-500 text-white hover:bg-opacity-90"
              onClick={() => window.location.href = "mailto:contato@legacy.com.br"}
            >
              Contato <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="legacy-gradient text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Legacy: Criando a categoria<br />
                <span className="text-yellow-300">Family Office Governance Tech</span>
              </h1>
              <p className="text-xl mb-8 opacity-90">
                A primeira plataforma SaaS do Brasil especializada em governança para empresas familiares, 
                com IA contextualizada e foco no mercado de R$ 4,2 bilhões/ano.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-white text-legacy-purple-500 hover:bg-gray-100 px-8 py-3 text-lg"
                  onClick={() => window.location.href = "mailto:contato@legacy.com.br"}
                >
                  Conversar com o Time <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-legacy-purple-500 px-8 py-3 text-lg"
                  onClick={() => document.getElementById('deck')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Apresentação
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 text-red-800">O Problema</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">90%</div>
                    <p className="text-red-700">das empresas familiares não chegam à 3ª geração</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">70%</div>
                    <p className="text-red-700">perdem valor por conflitos familiares</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">85%</div>
                    <p className="text-red-700">não possuem governança estruturada</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-xl text-red-800 mt-8 max-w-3xl mx-auto">
                <strong>Falta de governança gera conflitos, perda de patrimônio e destruição de valor.</strong>
                <br />Consultorias tradicionais são caras, demoradas e não escalam.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center text-green-800">A Solução</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-green-700">Plataforma SaaS Completa</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>IA contextualizada para governança familiar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Estrutura + sucessão + rituais + conselhos em um só lugar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Documentação automatizada e compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Dashboard de maturidade e KPIs</span>
                    </li>
                  </ul>
                </div>
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">Resultado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Tempo de implementação:</span>
                        <span className="font-semibold text-green-600">90% menor</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Custo vs. consultoria:</span>
                        <span className="font-semibold text-green-600">80% menor</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Escalabilidade:</span>
                        <span className="font-semibold text-green-600">Ilimitada</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Market Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Mercado</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-700 flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      TAM
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 mb-2">7M+</div>
                    <p className="text-sm text-blue-700">empresas no Brasil</p>
                    <div className="text-lg font-semibold text-blue-600 mt-2">R$ 45 bi/ano</div>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-700 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      SAM
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 mb-2">1,09M</div>
                    <p className="text-sm text-blue-700">empresas {'>'} R$ 50M faturamento</p>
                    <div className="text-lg font-semibold text-blue-600 mt-2">R$ 12 bi/ano</div>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200 border-2">
                  <CardHeader>
                    <CardTitle className="text-blue-700 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      SOM
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 mb-2">100K</div>
                    <p className="text-sm text-blue-700">empresas familiares prioritárias</p>
                    <div className="text-lg font-semibold text-blue-600 mt-2">R$ 4,2 bi/ano</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-lg text-blue-800">
                  <strong>Mercado em crescimento:</strong> Governança corporativa cresce 15% a.a. no Brasil
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Differentials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center text-legacy-purple-500">Diferenciais Competitivos</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      Pioneirismo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Primeira plataforma digital do Brasil focada exclusivamente em governança familiar</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Alto Custo de Troca
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Uma vez implementada, mudança gera alto custo e risco operacional</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Efeito Rede
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Valor aumenta com mais empresas: benchmarks e best practices</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      Modelo Recorrente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>SaaS com alta retenção e potencial de upsell/cross-sell</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Business Model Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center text-legacy-purple-500">Modelo de Negócio</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SaaS Escalável</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Receita recorrente mensal</li>
                      <li>• Margem bruta {'>'} 85%</li>
                      <li>• Escalabilidade ilimitada</li>
                      <li>• Baixo custo marginal</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Competitivo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Ticket médio: R$ 4.500/mês</li>
                      <li>• LTV: R$ 270K</li>
                      <li>• CAC: R$ 15K</li>
                      <li>• LTV/CAC: 18x</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Parcerias com bancas jurídicas</li>
                      <li>• Marketing digital</li>
                      <li>• Indicações (Net Promoter)</li>
                      <li>• Eventos especializados</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 text-legacy-purple-500">Time Fundador</h2>
              <p className="text-lg mb-8 text-gray-600">
                Experiência combinada em startups, governança corporativa e inovação tecnológica
              </p>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-purple-800">Expertise Única</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Tecnologia:</strong>
                    <br />15+ anos em SaaS e IA
                  </div>
                  <div>
                    <strong>Governança:</strong>
                    <br />10+ anos em empresas familiares
                  </div>
                  <div>
                    <strong>Negócios:</strong>
                    <br />3 exits anteriores
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projections Section */}
        <section id="deck" className="py-16 bg-green-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center text-green-800">Projeções e Exit</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">Projeção 5 Anos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>ARR Ano 5:</span>
                        <span className="font-bold text-green-600">R$ 32,7M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clientes:</span>
                        <span className="font-bold text-green-600">725</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margem EBITDA:</span>
                        <span className="font-bold text-green-600">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Share:</span>
                        <span className="font-bold text-green-600">0,8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">Potencial de Exit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Múltiplo ARR:</span>
                        <span className="font-bold text-green-600">6x - 10x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valuation potencial:</span>
                        <span className="font-bold text-green-600">R$ 200M - 330M</span>
                      </div>
                      <div className="text-sm text-green-700 mt-4">
                        <strong>Compradores estratégicos:</strong>
                        <br />PwC, EY, KPMG, TOTVS, Omie, Stone
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 legacy-gradient text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Junte-se à Legacy e seja pioneiro na revolução da governança familiar
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Oportunidade única de investir na primeira Family Office Governance Tech do Brasil, 
              em um mercado de R$ 4,2 bilhões/ano ainda inexplorado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-legacy-purple-500 hover:bg-gray-100 px-8 py-3 text-lg"
                onClick={() => window.location.href = "mailto:contato@legacy.com.br"}
              >
                Agendar Reunião <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-legacy-purple-500 px-8 py-3 text-lg"
                onClick={() => window.location.href = "mailto:contato@legacy.com.br?subject=Solicitação de Pitch Deck"}
              >
                Solicitar Pitch Deck
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center mb-4">
            <img 
              src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
              alt="Legacy" 
              className="h-6 w-auto brightness-0 invert"
            />
          </div>
          <p className="text-gray-400 text-sm">
            Legacy - Family Office Governance Tech
          </p>
          <p className="text-gray-500 text-xs mt-2">
            &copy; {new Date().getFullYear()} Legacy. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Investors;