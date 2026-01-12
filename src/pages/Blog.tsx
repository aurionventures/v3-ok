import { useState } from "react";
import { Link } from "react-router-dom";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { MegaFooter } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  ArrowRight,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { 
  BLOG_ARTICLES, 
  BLOG_CATEGORIES, 
  getFeaturedArticles,
  getCategoryById 
} from "@/data/blogData";

// Imagens de capa por categoria
const CATEGORY_IMAGES: Record<string, string> = {
  'governanca': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
  'conselhos': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'sucessao': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop',
  'compliance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
  'esg': 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=400&fit=crop',
  'tecnologia': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  'empresas-familiares': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=400&fit=crop',
};

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredArticles = getFeaturedArticles();
  
  const filteredArticles = BLOG_ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <MegaMenuHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-white/10 text-white border-white/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Blog Legacy OS
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Insights sobre Governança Corporativa
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Artigos, guias e tendências para transformar a governança da sua empresa
              com as melhores práticas do mercado.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white text-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-[#C0A062] hover:bg-[#C0A062]/90" : ""}
            >
              Todos
            </Button>
            {BLOG_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-[#C0A062] hover:bg-[#C0A062]/90" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {!searchTerm && !selectedCategory && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="h-5 w-5 text-[#C0A062]" />
              <h2 className="text-2xl font-bold">Artigos em Destaque</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.slice(0, 3).map((article) => {
                const category = getCategoryById(article.category);
                const coverImage = CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES['governanca'];
                return (
                  <Link key={article.id} to={`/blog/${article.slug}`}>
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={coverImage} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        {category && (
                          <Badge className={`${category.color} mb-3`}>
                            {category.name}
                          </Badge>
                        )}
                        <h3 className="font-bold text-lg mb-3 group-hover:text-[#C0A062] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">{article.author}</span>
                          <span>-</span>
                          <span>{article.readTime} min</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">
            {searchTerm || selectedCategory ? `${filteredArticles.length} artigos encontrados` : "Todos os Artigos"}
          </h2>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum artigo encontrado para sua busca.</p>
              <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}>
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const category = getCategoryById(article.category);
                const coverImage = CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES['governanca'];
                return (
                  <Link key={article.id} to={`/blog/${article.slug}`}>
                    <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={coverImage} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {category && (
                            <Badge variant="secondary" className={`${category.color} text-xs`}>
                              {category.name}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(article.publishDate)}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg mb-3 group-hover:text-[#C0A062] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium">{article.author}</span>
                            <span>-</span>
                            <span>{article.readTime} min</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#C0A062] text-sm font-medium group-hover:gap-2 transition-all">
                            <span>Ler mais</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Transforme a Governança da Sua Empresa
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Experimente a Legacy OS gratuitamente por 30 dias e descubra como nossa plataforma
              pode revolucionar a gestão do seu conselho.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#C0A062] hover:bg-[#C0A062]/90 text-white"
                asChild
              >
                <Link to="/pricing">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Começar Gratuitamente
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/contato">
                  Falar com Especialista
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
}
