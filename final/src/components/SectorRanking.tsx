import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Loader2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Company {
  name: string;
  sector: string;
  maturityScore: number;
  rank: number;
}

interface SectorRankingProps {
  currentCompanyScore: number;
  sector?: string;
}

const SectorRanking = ({ currentCompanyScore, sector = "Tecnologia" }: SectorRankingProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data - in a real scenario, this would come from web scraping
  const generateSectorData = () => {
    const sectorCompanies = {
      "Tecnologia": [
        "Microsoft", "Apple", "Amazon", "Google", "Meta", "Tesla", "Netflix", "Adobe", "Salesforce", "Oracle",
        "IBM", "Intel", "NVIDIA", "PayPal", "Cisco", "SAP", "ServiceNow", "Zoom", "Slack", "Spotify"
      ],
      "Financeiro": [
        "JPMorgan Chase", "Bank of America", "Wells Fargo", "Goldman Sachs", "Morgan Stanley", "Citigroup",
        "American Express", "Visa", "Mastercard", "BlackRock", "Charles Schwab", "PNC Financial", "U.S. Bancorp",
        "Truist Financial", "Capital One", "Berkshire Hathaway", "Aon", "Marsh & McLennan", "Progressive", "Allstate"
      ],
      "Saúde": [
        "Johnson & Johnson", "Pfizer", "UnitedHealth", "Merck", "AbbVie", "Bristol Myers Squibb", "Eli Lilly",
        "Moderna", "Gilead Sciences", "Amgen", "Genentech", "Novo Nordisk", "Roche", "Novartis", "GlaxoSmithKline",
        "Sanofi", "Biogen", "Regeneron", "Vertex Pharmaceuticals", "Illumina"
      ],
      "Varejo": [
        "Walmart", "Amazon", "Home Depot", "Costco", "Target", "Lowe's", "Best Buy", "Macy's", "Nordstrom",
        "TJX Companies", "Dollar General", "Dollar Tree", "CVS Health", "Walgreens", "Kroger", "Albertsons",
        "Starbucks", "McDonald's", "Chipotle", "Domino's Pizza"
      ]
    };

    const companyList = sectorCompanies[sector as keyof typeof sectorCompanies] || sectorCompanies["Tecnologia"];
    
    return companyList.map((name, index) => ({
      name,
      sector,
      maturityScore: Math.random() * (4.8 - 2.5) + 2.5, // Random score between 2.5 and 4.8
      rank: index + 1
    })).sort((a, b) => b.maturityScore - a.maturityScore)
      .map((company, index) => ({ ...company, rank: index + 1 }));
  };

  const fetchSectorData = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sectorData = generateSectorData();
      
      // Add current company to the list
      const currentCompany = {
        name: "Sua Empresa",
        sector,
        maturityScore: currentCompanyScore,
        rank: 0
      };
      
      const allCompanies = [...sectorData, currentCompany]
        .sort((a, b) => b.maturityScore - a.maturityScore)
        .map((company, index) => ({ ...company, rank: index + 1 }));
      
      setCompanies(allCompanies);
      
      const userRank = allCompanies.find(c => c.name === "Sua Empresa")?.rank || 0;
      toast({
        title: "Ranking Atualizado",
        description: `Sua empresa está na posição ${userRank} de ${allCompanies.length} no setor ${sector}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do setor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectorData();
  }, [sector]);

  const getMaturityLevel = (score: number) => {
    if (score >= 4) return { level: "Alto", color: "bg-green-500" };
    if (score >= 3) return { level: "Médio", color: "bg-orange-500" };
    return { level: "Baixo", color: "bg-red-500" };
  };

  const currentCompanyRank = companies.find(c => c.name === "Sua Empresa")?.rank || 0;
  const totalCompanies = companies.length;
  const percentile = totalCompanies > 0 ? Math.round(((totalCompanies - currentCompanyRank + 1) / totalCompanies) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Ranking Setorial - {sector}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchSectorData}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Atualizar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalCompanies > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Posição da Sua Empresa</h3>
                <p className="text-sm text-blue-700">
                  {currentCompanyRank}º lugar de {totalCompanies} empresas ({percentile}º percentil)
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">{currentCompanyScore.toFixed(1)}</div>
                <Badge className={`${getMaturityLevel(currentCompanyScore).color} text-white`}>
                  {getMaturityLevel(currentCompanyScore).level}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Carregando dados do setor...</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {companies && companies.length > 0 ? companies.slice(0, 20).map((company) => (
              <div 
                key={company.name}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  company.name === "Sua Empresa" 
                    ? "bg-blue-50 border-blue-300 font-semibold" 
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    company.rank <= 3 ? "bg-yellow-500 text-white" : 
                    company.name === "Sua Empresa" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
                  }`}>
                    {company.rank}
                  </div>
                  <div>
                    <div className="font-medium">{company.name}</div>
                    {company.name === "Sua Empresa" && (
                      <div className="text-xs text-blue-600">Sua posição no ranking</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{company.maturityScore.toFixed(1)}</span>
                  <Badge className={`${getMaturityLevel(company.maturityScore).color} text-white text-xs`}>
                    {getMaturityLevel(company.maturityScore).level}
                  </Badge>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>
              Dados baseados em análise de maturidade de governança de empresas do setor {sector}.
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorRanking;