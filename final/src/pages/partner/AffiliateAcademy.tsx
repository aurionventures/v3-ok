import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen, Video, FileText, Download, Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

// Dados mockados de materiais da Academy
const MOCK_MATERIALS = [
  {
    id: '1',
    title: 'Introdução à Legacy OS',
    type: 'video',
    description: 'Conheça os principais recursos e funcionalidades da plataforma Legacy OS',
    duration: '15 min',
    category: 'Básico',
    url: '#'
  },
  {
    id: '2',
    title: 'Como Apresentar a Legacy OS para Clientes',
    type: 'pdf',
    description: 'Guia completo com scripts e argumentos de venda para apresentar a plataforma',
    duration: '20 min',
    category: 'Vendas',
    url: '#'
  },
  {
    id: '3',
    title: 'Governança Corporativa: Conceitos Fundamentais',
    type: 'video',
    description: 'Entenda os conceitos básicos de governança corporativa e compliance',
    duration: '30 min',
    category: 'Conhecimento',
    url: '#'
  },
  {
    id: '4',
    title: 'ESG e Sustentabilidade na Legacy OS',
    type: 'pdf',
    description: 'Saiba como a Legacy OS ajuda empresas a melhorar sua maturidade ESG',
    duration: '25 min',
    category: 'ESG',
    url: '#'
  },
  {
    id: '5',
    title: 'Dashboard Executivo: Funcionalidades Avançadas',
    type: 'video',
    description: 'Aprenda a utilizar todas as funcionalidades do dashboard executivo',
    duration: '18 min',
    category: 'Avançado',
    url: '#'
  },
  {
    id: '6',
    title: 'FAQ: Perguntas Frequentes dos Clientes',
    type: 'pdf',
    description: 'Respostas para as principais dúvidas que os clientes têm sobre a plataforma',
    duration: '10 min',
    category: 'Suporte',
    url: '#'
  }
];

interface Material {
  id: string;
  title: string;
  type: 'video' | 'pdf';
  description: string;
  duration: string;
  category: string;
  url: string;
}

export default function AffiliateAcademy() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      
      // Verificar se é o parceiro demo
      if (user?.email === 'parceiro@legacy.com') {
        setMaterials(MOCK_MATERIALS);
      } else {
        // Buscar dados reais do Supabase
        // Implementar quando necessário
      }
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(materials.map(m => m.category))];
  const filteredMaterials = selectedCategory === 'all' 
    ? materials 
    : materials.filter(m => m.category === selectedCategory);

  const getTypeIcon = (type: string) => {
    return type === 'video' ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Academy" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-96" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Academy" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-legacy-500" />
                Academy Legacy OS
              </h1>
              <p className="text-gray-600 mt-1">
                Materiais de conhecimento para aprimorar seu repertório sobre a Legacy OS
              </p>
            </div>

            {/* Introdução */}
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo à Academy</CardTitle>
                <CardDescription>
                  Aqui você encontra materiais exclusivos para se tornar um especialista em Legacy OS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  A Academy foi criada para que você possa estudar e se aprofundar sobre a Legacy OS, 
                  seus recursos, funcionalidades e como apresentá-la aos seus clientes. 
                  Quanto mais conhecimento você tiver, melhor será sua capacidade de vender e apoiar seus clientes.
                </p>
              </CardContent>
            </Card>

            {/* Filtros por Categoria */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'Todos' : category}
                </Button>
              ))}
            </div>

            {/* Grid de Materiais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(material.type)}
                        <CardTitle className="text-lg">{material.title}</CardTitle>
                      </div>
                      <Badge variant="outline">{material.category}</Badge>
                    </div>
                    <CardDescription className="mt-2">
                      {material.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{material.duration}</span>
                      <div className="flex gap-2">
                        {material.type === 'video' ? (
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Assistir
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMaterials.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum material encontrado nesta categoria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
