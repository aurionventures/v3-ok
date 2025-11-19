import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import { GovernanceMember } from '@/hooks/useGovernanceMembers';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MembersTableProps {
  members: GovernanceMember[];
  loading: boolean;
  onCreateMember: () => void;
  onEditMember: (member: GovernanceMember) => void;
  onAllocateMember: (member: GovernanceMember) => void;
  onDeleteMember: (member: GovernanceMember) => void;
}

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  loading,
  onCreateMember,
  onEditMember,
  onAllocateMember,
  onDeleteMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOrganTypeBadge = (type: 'conselho' | 'comite' | 'comissao') => {
    const colors = {
      conselho: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      comite: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      comissao: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    };
    const labels = {
      conselho: 'Conselho',
      comite: 'Comitê',
      comissao: 'Comissão'
    };
    return <Badge variant="outline" className={colors[type]}>{labels[type]}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Carregando membros...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com busca e botão criar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onCreateMember} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Membro
        </Button>
      </div>

      {/* Tabela de membros */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredMembers.length} {filteredMembers.length === 1 ? 'Membro' : 'Membros'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum membro encontrado' : 'Nenhum membro cadastrado'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo Principal</TableHead>
                  <TableHead>Órgãos Alocados</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {member.allocations && member.allocations.length > 0 ? (
                          member.allocations.map((allocation, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              {getOrganTypeBadge(allocation.organ_type)}
                              <span className="text-xs text-muted-foreground">
                                {allocation.council_name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Não alocado</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(member.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditMember(member)}
                          title="Editar membro"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onAllocateMember(member)}
                          title="Alocar em órgão"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteMember(member)}
                          title="Remover membro"
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
};
