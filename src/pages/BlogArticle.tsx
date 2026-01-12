import { useParams, Link } from "react-router-dom";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { MegaFooter } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  ArrowLeft,
  ArrowRight,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
  Sparkles,
  BookOpen,
  Copy,
  Check
} from "lucide-react";
import { 
  getArticleBySlug, 
  getCategoryById,
  BLOG_ARTICLES
} from "@/data/blogData";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

// Função para processar o conteúdo e renderizar como HTML limpo
function processContent(content: string): string {
  return content
    // Remove ## e ### (títulos markdown)
    .replace(/^### /gm, '')
    .replace(/^## /gm, '')
    // Remove ** (negrito markdown) mantendo o texto
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Converte listas com -
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Converte listas numeradas
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Quebras de linha para parágrafos
    .split('\n\n')
    .map(paragraph => {
      const trimmed = paragraph.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<li>')) {
        return `<ul class="list-disc pl-6 my-4 space-y-2">${trimmed}</ul>`;
      }
      if (trimmed.includes('<strong>') && !trimmed.includes('<li>') && trimmed.length < 100) {
        return `<h3 class="text-xl font-bold mt-8 mb-4 text-foreground">${trimmed}</h3>`;
      }
      return `<p class="text-muted-foreground leading-relaxed mb-4">${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');
}

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug || "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <MegaMenuHeader />
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/blog">Voltar ao Blog</Link>
          </Button>
        </div>
        <MegaFooter />
      </div>
    );
  }

  const category = getCategoryById(article.category);
  const coverImage = CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES['governanca'];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Related articles (same category, excluding current)
  const relatedArticles = BLOG_ARTICLES
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  // Share functions
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook' | 'copy') => {
    const shareUrl = encodeURIComponent(currentUrl);
    const shareTitle = encodeURIComponent(article.title);
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        toast.success('Link copiado para a área de transferência!');
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  const processedContent = processContent(article.content);

  return (
    <div className="min-h-screen bg-background">
      <MegaMenuHeader />
      
      {/* Hero Section com Imagem */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 pt-32 pb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao Blog</span>
            </Link>

            {/* Category - posicionada abaixo do back link */}
            {category && (
              <div className="mb-4">
                <Badge className={`${category.color}`}>
                  {category.name}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-white/70">
              <span className="font-medium text-white">{article.author}</span>
              <span className="text-white/40">-</span>
              <span>{formatDate(article.publishDate)}</span>
              <span className="text-white/40">-</span>
              <span>{article.readTime} min de leitura</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <div className="container mx-auto px-6 -mt-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <img 
            src={coverImage} 
            alt={article.title}
            className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-2xl"
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_280px] gap-12">
              {/* Main Content */}
              <div>
                {/* Excerpt */}
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed border-l-4 border-[#C0A062] pl-6">
                  {article.excerpt}
                </p>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                {/* Tags */}
                <div className="mt-12 pt-8 border-t">
                  <h4 className="text-sm font-semibold mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="mt-8 pt-8 border-t">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Compartilhar:
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-colors"
                        title="Compartilhar no LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors"
                        title="Compartilhar no Twitter"
                      >
                        <Twitter className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors"
                        title="Compartilhar no Facebook"
                      >
                        <Facebook className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-[#C0A062] hover:text-white transition-colors"
                        title="Copiar link"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-32 space-y-6">
                  {/* CTA Card */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-primary/90 text-white">
                    <CardContent className="p-6">
                      <Sparkles className="h-8 w-8 mb-4 text-[#C0A062]" />
                      <h3 className="font-bold text-lg mb-2">
                        Experimente a Legacy OS
                      </h3>
                      <p className="text-sm text-white/80 mb-4">
                        Transforme a governança da sua empresa com nossa plataforma de IA.
                      </p>
                      <Button 
                        className="w-full bg-[#C0A062] hover:bg-[#C0A062]/90 text-white"
                        asChild
                      >
                        <Link to="/pricing">
                          Começar Grátis
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Table of Contents */}
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#C0A062]" />
                        Neste Artigo
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="hover:text-[#C0A062] cursor-pointer transition-colors">
                          Introdução
                        </li>
                        <li className="hover:text-[#C0A062] cursor-pointer transition-colors">
                          Conceitos Principais
                        </li>
                        <li className="hover:text-[#C0A062] cursor-pointer transition-colors">
                          Como Implementar
                        </li>
                        <li className="hover:text-[#C0A062] cursor-pointer transition-colors">
                          Legacy OS e Você
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Artigos Relacionados</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => {
                  const relatedCategory = getCategoryById(related.category);
                  const relatedImage = CATEGORY_IMAGES[related.category] || CATEGORY_IMAGES['governanca'];
                  return (
                    <Link key={related.id} to={`/blog/${related.slug}`}>
                      <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                        <img 
                          src={relatedImage} 
                          alt={related.title}
                          className="w-full h-32 object-cover"
                        />
                        <CardContent className="p-5">
                          {relatedCategory && (
                            <Badge variant="secondary" className={`${relatedCategory.color} text-xs mb-3`}>
                              {relatedCategory.name}
                            </Badge>
                          )}
                          <h3 className="font-semibold mb-2 group-hover:text-[#C0A062] transition-colors line-clamp-2 text-sm">
                            {related.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{related.readTime} min</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Pronto para Transformar sua Governança?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Junte-se a centenas de empresas que já utilizam a Legacy OS para 
              gerenciar seus conselhos de forma inteligente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#C0A062] hover:bg-[#C0A062]/90 text-white"
                asChild
              >
                <Link to="/pricing">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Ver Planos e Preços
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/blog">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Continuar Lendo
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
