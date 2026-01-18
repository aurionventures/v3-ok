import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Share2, Image as ImageIcon, GraduationCap, Linkedin, Instagram, Download, Upload, X, LayoutGrid, List, Video, FileText, Play, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Banner {
  id: string;
  title: string;
  category: 'linkedin' | 'instagram';
  format: string;
  image_url: string;
  image_file?: File | null;
  preview_url?: string;
  updated_at: string;
}

interface PostTemplate {
  id: string;
  title: string;
  category: 'linkedin' | 'instagram';
  content: string;
  updated_at: string;
}

interface AcademyContent {
  id: string;
  title: string;
  category: string;
  type: 'video' | 'pdf' | 'article';
  content: string;
  updated_at: string;
}

export default function AdminPartnerContent() {
  const [activeTab, setActiveTab] = useState<'posts' | 'banners' | 'academy'>('banners');
  
  // Banners
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    title: '',
    category: 'linkedin',
    format: '',
    image_file: null,
    preview_url: ''
  });
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Posts
  const [posts, setPosts] = useState<PostTemplate[]>([]);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostTemplate | null>(null);
  const [postForm, setPostForm] = useState({
    title: '',
    category: 'linkedin' as 'linkedin' | 'instagram',
    content: ''
  });

  // Academy
  const [academyContent, setAcademyContent] = useState<AcademyContent[]>([]);
  const [academyDialogOpen, setAcademyDialogOpen] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState<AcademyContent | null>(null);
  const [academyForm, setAcademyForm] = useState({
    title: '',
    category: '',
    type: 'video' as 'video' | 'pdf' | 'article',
    content: ''
  });
  const [academyViewMode, setAcademyViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - Em produção, buscar do Supabase
  useEffect(() => {
    // Mock banners
    setBanners([
      {
        id: '1',
        title: 'Banner LinkedIn',
        category: 'linkedin',
        format: 'LinkedIn',
        image_url: '',
        updated_at: new Date(2026, 0, 16).toISOString()
      },
      {
        id: '2',
        title: 'Banner Instagram',
        category: 'instagram',
        format: 'Storie',
        image_url: '',
        updated_at: new Date(2026, 0, 16).toISOString()
      }
    ]);

    // Mock academy content
    setAcademyContent([
      {
        id: '1',
        title: 'Introdução à Legacy OS',
        category: 'Básico',
        type: 'video',
        content: 'Conheça os principais recursos e funcionalidades da plataforma Legacy OS',
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Como Apresentar a Legacy OS para Clientes',
        category: 'Vendas',
        type: 'pdf',
        content: 'Guia completo com scripts e argumentos de venda para apresentar a plataforma',
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Governança Corporativa: Conceitos Fundamentais',
        category: 'Conhecimento',
        type: 'video',
        content: 'Entenda os conceitos básicos de governança corporativa e compliance',
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        title: 'ESG e Sustentabilidade na Legacy OS',
        category: 'ESG',
        type: 'pdf',
        content: 'Saiba como a Legacy OS ajuda empresas a melhorar sua maturidade ESG',
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        title: 'Dashboard Executivo: Funcionalidades Avançadas',
        category: 'Avançado',
        type: 'video',
        content: 'Aprenda a utilizar todas as funcionalidades do dashboard executivo',
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        title: 'FAQ: Perguntas Frequentes dos Clientes',
        category: 'Suporte',
        type: 'pdf',
        content: 'Respostas para as principais dúvidas que os clientes têm sobre a plataforma',
        updated_at: new Date().toISOString()
      }
    ]);

    // Mock posts
    setPosts([
      {
        id: '1',
        title: 'Post LinkedIn',
        category: 'linkedin',
        content: `Transforme a governança da sua empresa com a Legacy OS

A Legacy OS é a plataforma completa de governança corporativa que oferece:

- Dashboard executivo em tempo real
- Compliance e gestão de riscos
- Maturidade ESG
- Desempenho do conselho
- IA para governança

Ideal para empresas que buscam excelência em governança corporativa.

Saiba mais: [LINK_DO_AFILIADO]

#GovernançaCorporativa #LegacyOS #Compliance #ESG #Governance`,
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Storie Instagram',
        category: 'instagram',
        content: `Nova oportunidade para sua empresa!

A Legacy OS está transformando a governança corporativa no Brasil.

O que você ganha:
• Compliance automatizado
• Gestão de riscos inteligente
• Maturidade ESG
• IA para governança

Link na bio ou acesse: [LINK_DO_AFILIADO]

#LegacyOS #Governança #Compliance #ESG`,
        updated_at: new Date().toISOString()
      }
    ]);
  }, []);

  // Banner handlers
  const handleOpenBannerDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerForm({
        title: banner.title,
        category: banner.category,
        format: banner.format,
        image_url: banner.image_url,
        image_file: null,
        preview_url: banner.image_url
      });
    } else {
      setEditingBanner(null);
      setBannerForm({
        title: '',
        category: 'linkedin',
        format: '',
        image_file: null,
        preview_url: ''
      });
    }
    setBannerDialogOpen(true);
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem');
        return;
      }

      // Validar tamanho (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 10MB');
        return;
      }

      setBannerForm(prev => ({
        ...prev,
        image_file: file,
        preview_url: URL.createObjectURL(file)
      }));
    }
  };

  const handleSaveBanner = async () => {
    if (!bannerForm.title || !bannerForm.category) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setUploadingBanner(true);
    try {
      let imageUrl = bannerForm.image_url;

      // Upload da imagem se houver arquivo novo
      if (bannerForm.image_file) {
        const fileExt = bannerForm.image_file.name.split('.').pop();
        const fileName = `banners/${bannerForm.category}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('partner-content')
          .upload(fileName, bannerForm.image_file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          // Se o bucket não existir, usar localStorage temporariamente
          console.warn('Bucket não encontrado, usando localStorage:', uploadError);
          imageUrl = bannerForm.preview_url || '';
        } else {
          const { data: urlData } = supabase.storage
            .from('partner-content')
            .getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      }

      if (editingBanner) {
        setBanners(prev => prev.map(b => 
          b.id === editingBanner.id 
            ? { ...b, ...bannerForm, image_url: imageUrl || b.image_url, updated_at: new Date().toISOString() }
            : b
        ));
        toast.success('Banner atualizado com sucesso!');
      } else {
        const newBanner: Banner = {
          id: Date.now().toString(),
          title: bannerForm.title!,
          category: bannerForm.category as 'linkedin' | 'instagram',
          format: bannerForm.format || '',
          image_url: imageUrl || '',
          updated_at: new Date().toISOString()
        };
        setBanners(prev => [...prev, newBanner]);
        toast.success('Banner criado com sucesso!');
      }

      setBannerDialogOpen(false);
      setEditingBanner(null);
      setBannerForm({
        title: '',
        category: 'linkedin',
        format: '',
        image_file: null,
        preview_url: ''
      });
    } catch (error: any) {
      console.error('Erro ao salvar banner:', error);
      toast.error('Erro ao salvar banner');
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      setBanners(prev => prev.filter(b => b.id !== id));
      toast.success('Banner excluído com sucesso!');
    }
  };

  // Post handlers
  const handleOpenPostDialog = (post?: PostTemplate) => {
    if (post) {
      setEditingPost(post);
      setPostForm({
        title: post.title,
        category: post.category,
        content: post.content
      });
    } else {
      setEditingPost(null);
      setPostForm({
        title: '',
        category: 'linkedin',
        content: ''
      });
    }
    setPostDialogOpen(true);
  };

  const handleSavePost = () => {
    if (!postForm.title || !postForm.content) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingPost) {
      setPosts(prev => prev.map(p => 
        p.id === editingPost.id 
          ? { ...p, ...postForm, updated_at: new Date().toISOString() }
          : p
      ));
      toast.success('Post atualizado com sucesso!');
    } else {
      const newPost: PostTemplate = {
        id: Date.now().toString(),
        ...postForm,
        updated_at: new Date().toISOString()
      };
      setPosts(prev => [...prev, newPost]);
      toast.success('Post criado com sucesso!');
    }

    setPostDialogOpen(false);
    setEditingPost(null);
    setPostForm({
      title: '',
      category: 'linkedin',
      content: ''
    });
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success('Post excluído com sucesso!');
    }
  };

  // Academy handlers
  const handleOpenAcademyDialog = (content?: AcademyContent) => {
    if (content) {
      setEditingAcademy(content);
      setAcademyForm({
        title: content.title,
        category: content.category,
        type: content.type,
        content: content.content
      });
    } else {
      setEditingAcademy(null);
      setAcademyForm({
        title: '',
        category: '',
        type: 'video',
        content: ''
      });
    }
    setAcademyDialogOpen(true);
  };

  const handleSaveAcademy = () => {
    if (!academyForm.title || !academyForm.content) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingAcademy) {
      setAcademyContent(prev => prev.map(a => 
        a.id === editingAcademy.id 
          ? { ...a, ...academyForm, updated_at: new Date().toISOString() }
          : a
      ));
      toast.success('Conteúdo da Academy atualizado com sucesso!');
    } else {
      const newContent: AcademyContent = {
        id: Date.now().toString(),
        ...academyForm,
        updated_at: new Date().toISOString()
      };
      setAcademyContent(prev => [...prev, newContent]);
      toast.success('Conteúdo da Academy criado com sucesso!');
    }

    setAcademyDialogOpen(false);
    setEditingAcademy(null);
    setAcademyForm({
      title: '',
      category: '',
      type: 'video',
      content: ''
    });
  };

  const handleDeleteAcademy = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
      setAcademyContent(prev => prev.filter(a => a.id !== id));
      toast.success('Conteúdo excluído com sucesso!');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Conteúdo para Parceiros" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="banners">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Banners
                  </TabsTrigger>
                  <TabsTrigger value="posts">
                    <Share2 className="h-4 w-4 mr-2" />
                    Posts de Divulgação
                  </TabsTrigger>
                  <TabsTrigger value="academy">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Academy
                  </TabsTrigger>
                </TabsList>
                <Button onClick={() => {
                  if (activeTab === 'banners') handleOpenBannerDialog();
                  else if (activeTab === 'posts') handleOpenPostDialog();
                  else handleOpenAcademyDialog();
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Conteúdo
                </Button>
              </div>

              {/* Banners */}
              <TabsContent value="banners" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Banners para Download</CardTitle>
                    <CardDescription>
                      Banners para parceiros usarem em suas divulgações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {banners.map((banner) => (
                        <div key={banner.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2">
                              {banner.category === 'linkedin' ? (
                                <Linkedin className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Instagram className="h-5 w-5 text-pink-600" />
                              )}
                              {banner.title}
                            </h3>
                            <Badge variant="outline">{banner.format}</Badge>
                          </div>
                          
                          {/* Preview do Banner */}
                          <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center border-2 border-dashed border-gray-300 relative">
                            {banner.image_url || banner.preview_url ? (
                              <img
                                src={banner.image_url || banner.preview_url}
                                alt={banner.title}
                                className="max-h-full max-w-full object-contain rounded"
                              />
                            ) : (
                              <div className="text-center">
                                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">Sem imagem</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {banner.category === 'linkedin' ? '1080x1080px' : '1080x1920px'}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleOpenBannerDialog(banner)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleDeleteBanner(banner.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Posts */}
              <TabsContent value="posts" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Templates de Posts</CardTitle>
                    <CardDescription>
                      Templates de posts para parceiros compartilharem nas redes sociais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Atualizado</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {posts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {post.category === 'linkedin' ? 'LinkedIn' : 'Instagram'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(post.updated_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenPostDialog(post)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Academy */}
              <TabsContent value="academy" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Conteúdo da Academy</CardTitle>
                        <CardDescription>
                          Materiais educacionais para parceiros estudarem sobre a Legacy OS
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={academyViewMode === 'grid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setAcademyViewMode('grid')}
                        >
                          <LayoutGrid className="h-4 w-4 mr-2" />
                          Mosaico
                        </Button>
                        <Button
                          variant={academyViewMode === 'list' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setAcademyViewMode('list')}
                        >
                          <List className="h-4 w-4 mr-2" />
                          Lista
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {academyContent.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>Nenhum conteúdo da Academy cadastrado</p>
                      </div>
                    ) : academyViewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {academyContent.map((item) => (
                          <Card key={item.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  {item.type === 'video' ? (
                                    <Video className="h-5 w-5 text-primary" />
                                  ) : item.type === 'pdf' ? (
                                    <FileText className="h-5 w-5 text-primary" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-primary" />
                                  )}
                                  <CardTitle className="text-lg">{item.title}</CardTitle>
                                </div>
                                <Badge variant="outline">{item.category}</Badge>
                              </div>
                              <CardDescription className="mt-2">
                                {item.content}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">
                                  {item.type === 'video' ? 'Vídeo' : item.type === 'pdf' ? 'PDF' : 'Artigo'}
                                </Badge>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenAcademyDialog(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteAcademy(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Atualizado em {new Date(item.updated_at).toLocaleDateString('pt-BR')}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Atualizado</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {academyContent.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.category}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{item.type}</Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(item.updated_at).toLocaleDateString('pt-BR')}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenAcademyDialog(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteAcademy(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Banner Dialog */}
            <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingBanner ? 'Editar Banner' : 'Novo Banner'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure o banner para parceiros baixarem e usarem
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="banner-title">Título *</Label>
                    <Input
                      id="banner-title"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Banner LinkedIn"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner-category">Categoria *</Label>
                    <Select
                      value={bannerForm.category}
                      onValueChange={(value) => setBannerForm(prev => ({ ...prev, category: value as any, format: value === 'linkedin' ? 'LinkedIn' : 'Storie' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner-format">Formato</Label>
                    <Input
                      id="banner-format"
                      value={bannerForm.format}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, format: e.target.value }))}
                      placeholder="Ex: LinkedIn, Storie"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner-image">Imagem do Banner *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {bannerForm.preview_url ? (
                        <div className="relative">
                          <img
                            src={bannerForm.preview_url}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded-lg border"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setBannerForm(prev => ({ ...prev, image_file: null, preview_url: '' }))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Clique para selecionar ou arraste uma imagem
                          </p>
                          <Button variant="outline" asChild>
                            <label className="cursor-pointer">
                              Selecionar Imagem
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleBannerImageChange}
                              />
                            </label>
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 10MB
                          </p>
                          {bannerForm.category === 'linkedin' && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Dimensões recomendadas: 1080x1080px
                            </p>
                          )}
                          {bannerForm.category === 'instagram' && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Dimensões recomendadas: 1080x1920px
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBannerDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveBanner} disabled={uploadingBanner}>
                    {uploadingBanner ? 'Salvando...' : (editingBanner ? 'Atualizar' : 'Criar')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Post Dialog */}
            <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPost ? 'Editar Post' : 'Novo Post'}
                  </DialogTitle>
                  <DialogDescription>
                    Crie templates de posts para parceiros compartilharem
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-title">Título *</Label>
                    <Input
                      id="post-title"
                      value={postForm.title}
                      onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Post LinkedIn"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="post-category">Categoria *</Label>
                    <Select
                      value={postForm.category}
                      onValueChange={(value) => setPostForm(prev => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="post-content">Conteúdo do Post *</Label>
                    <Textarea
                      id="post-content"
                      value={postForm.content}
                      onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Digite o conteúdo do post... Use [LINK_DO_AFILIADO] para incluir o link automaticamente"
                      rows={12}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use [LINK_DO_AFILIADO] no texto e ele será substituído pelo link real do parceiro
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPostDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSavePost}>
                    {editingPost ? 'Atualizar' : 'Criar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Academy Dialog */}
            <Dialog open={academyDialogOpen} onOpenChange={setAcademyDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAcademy ? 'Editar Conteúdo da Academy' : 'Novo Conteúdo da Academy'}
                  </DialogTitle>
                  <DialogDescription>
                    Crie materiais educacionais para parceiros
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="academy-title">Título *</Label>
                    <Input
                      id="academy-title"
                      value={academyForm.title}
                      onChange={(e) => setAcademyForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Introdução à Legacy OS"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academy-category">Categoria</Label>
                    <Input
                      id="academy-category"
                      value={academyForm.category}
                      onChange={(e) => setAcademyForm(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Ex: Básico, Avançado, Vendas"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academy-type">Tipo de Material *</Label>
                    <Select
                      value={academyForm.type}
                      onValueChange={(value) => setAcademyForm(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Vídeo</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="article">Artigo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academy-content">Conteúdo *</Label>
                    <Textarea
                      id="academy-content"
                      value={academyForm.content}
                      onChange={(e) => setAcademyForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Descrição do conteúdo ou link do material"
                      rows={8}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAcademyDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveAcademy}>
                    {editingAcademy ? 'Atualizar' : 'Criar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
