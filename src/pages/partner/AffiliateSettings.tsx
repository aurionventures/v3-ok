import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function AffiliateSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: user?.company || '',
    notifications: {
      newLead: true,
      commissionPaid: true,
      newMaterial: false
    }
  });

  useEffect(() => {
    // Carregar dados do usuário
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        company: user.company || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configurações" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
              <p className="text-gray-600 mt-1">Gerencie suas informações e preferências</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Informações Pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize suas informações de contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                      disabled
                    />
                    <p className="text-xs text-gray-500">
                      O email não pode ser alterado. Entre em contato com o suporte se necessário.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notificações */}
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Escolha quais notificações você deseja receber
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newLead">Nova Indicação</Label>
                      <p className="text-sm text-gray-500">
                        Receba notificações quando um novo lead for atribuído ao seu link
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="newLead"
                      checked={formData.notifications.newLead}
                      onChange={(e) => handleNotificationChange('newLead', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="commissionPaid">Comissão Paga</Label>
                      <p className="text-sm text-gray-500">
                        Receba notificações quando uma comissão for paga
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="commissionPaid"
                      checked={formData.notifications.commissionPaid}
                      onChange={(e) => handleNotificationChange('commissionPaid', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newMaterial">Novo Material na Academy</Label>
                      <p className="text-sm text-gray-500">
                        Receba notificações quando novos materiais forem adicionados à Academy
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="newMaterial"
                      checked={formData.notifications.newMaterial}
                      onChange={(e) => handleNotificationChange('newMaterial', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Botão Salvar */}
              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="bg-legacy-500 hover:bg-legacy-600">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
