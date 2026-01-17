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
import { Plus, Edit, Trash2, FileText, Video, Image, GraduationCap, Share2 } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'post' | 'banner' | 'academy';
  category: string;
  content: string;
  format?: string;
  created_at: string;
  updated_at: string;
}

// Dados mockados
const MOCK_CONTENT: ContentItem[] = [
  {
    id: '1',
    title: 'Post Hotmart',
    type: 'post',
    category: 'hotmart',
    content: '🚀 Descubra como transformar a governança da sua empresa com a Legacy OS!',
    format: '1x1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Banner LinkedIn',
    type: 'banner',
    category: 'linkedin',
    content: 'Transforme a governança da sua empresa',
    format: 'LinkedIn',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Introdução à Legacy OS',
    type: 'academy',
    category: 'Básico',
    content: 'Conheça os principais recursos e funcionalidades da plataforma',
    format: 'video',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function AdminPartnerContent() {
  const [activeTab, setActiveTab] = useState<'posts' | 'banners' | 'academy'>('posts');
  const [content, setContent] = useState<ContentItem[]>(MOCK_CONTENT);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'post' as 'post' | 'banner' | 'academy',
    category: '',
    content: '',
    format: ''
  });

  const handleOpenDialog = (item?: ContentItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        type: item.type,
        category: item.category,
        content: item.content,
        format: item.format || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        type: activeTab === 'posts' ? 'post' : activeTab === 'banners' ? 'banner' : 'academy',
        category: '',
        content: '',
        format: ''
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingItem) {
      // Atualizar item existente
      setContent(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, updated_at: new Date().toISOString() }
          : item
      ));
      toast.success('Conteúdo atualizado com sucesso!');
    } else {
      // Criar novo item
      const newItem: ContentItem = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setContent(prev => [...prev, newItem]);
      toast.success('Conteúdo criado com sucesso!');
    }

    setDialogOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      type: 'post',
      category: '',
      content: '',
      format: ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
      setContent(prev => prev.filter(item => item.id !== id));
      toast.success('Conteúdo excluído com sucesso!');
    }
  };

  const filteredContent = content.filter(item => {
    if (activeTab === 'posts') return item.type === 'post';
    if (activeTab === 'banners') return item.type === 'banner';
    if (activeTab === 'academy') return item.type === 'academy';
    return false;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Conteúdo para Parceiros" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Conteúdo para Parceiros</h1>
              <p className="text-gray-600 mt-1">
                Gerencie materiais de divulgação, banners e conteúdo da Academy
              </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="posts">
                    <Share2 className="h-4 w-4 mr-2" />
                    Posts de Divulgação
                  </TabsTrigger>
                  <TabsTrigger value="banners">
                    <Image className="h-4 w-4 mr-2" />
                    Banners
                  </TabsTrigger>
                  <TabsTrigger value="academy">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Academy
                  </TabsTrigger>
                </TabsList>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Conteúdo
                </Button>
              </div>

              {/* Posts */}
              <TabsContent value="posts" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Posts de Divulgação</CardTitle>
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
                          <TableHead>Formato</TableHead>
                          <TableHead>Atualizado</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContent.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>{item.format || '-'}</TableCell>
                            <TableCell>
                              {new Date(item.updated_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDialog(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(item.id)}
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

              {/* Banners */}
              <TabsContent value="banners" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Banners</CardTitle>
                    <CardDescription>
                      Banners para parceiros usarem em suas divulgações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Formato</TableHead>
                          <TableHead>Atualizado</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContent.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>{item.format || '-'}</TableCell>
                            <TableCell>
                              {new Date(item.updated_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDialog(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(item.id)}
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
                    <CardTitle>Conteúdo da Academy</CardTitle>
                    <CardDescription>
                      Materiais educacionais para parceiros estudarem sobre a Legacy OS
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        {filteredContent.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>{item.format || '-'}</TableCell>
                            <TableCell>
                              {new Date(item.updated_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDialog(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(item.id)}
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
            </Tabs>

            {/* Dialog de Edição/Criação */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Editar Conteúdo' : 'Novo Conteúdo'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem 
                      ? 'Atualize as informações do conteúdo'
                      : 'Crie um novo conteúdo para parceiros'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título do conteúdo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="post">Post de Divulgação</SelectItem>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="academy">Academy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Ex: Hotmart, LinkedIn, Básico, etc."
                    />
                  </div>

                  {formData.type === 'banner' && (
                    <div className="space-y-2">
                      <Label htmlFor="format">Formato do Banner</Label>
                      <Select
                        value={formData.format}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1x1">1x1 (Quadrado)</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="storie">Storie Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.type === 'academy' && (
                    <div className="space-y-2">
                      <Label htmlFor="format">Tipo de Material</Label>
                      <Select
                        value={formData.format}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}
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
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Digite o conteúdo aqui..."
                      rows={8}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    {editingItem ? 'Atualizar' : 'Criar'}
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
