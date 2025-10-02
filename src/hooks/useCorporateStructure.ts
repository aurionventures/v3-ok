import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Database } from '../types/supabase'

// Função para obter o token JWT do cookie
const getJWTFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
  
  if (authCookie) {
    return authCookie.split('=')[1];
  }
  
  return null;
}

// Função para configurar o token no Supabase client
const setSupabaseAuth = async (token: string) => {
  try {
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: '', // Não temos refresh token no sistema atual
    });
  } catch (error) {
    console.error('Erro ao configurar autenticação:', error);
  }
}

// Tipos baseados na estrutura da tabela corporate_structure_members
export type CorporateStructureMember = Database['public']['Tables']['corporate_structure_members']['Row']

export interface CorporateStructureFormData {
  name: string
  birth_date?: string
  age?: number
  category: string
  role: string
  involvement?: string
  status?: string
  email?: string
  phone?: string
  document?: string
  address?: any
  is_family_member?: boolean
  is_external?: boolean
  priority_order?: number
  shareholding?: string
}

export type CorporateStructureInsertData = Database['public']['Tables']['corporate_structure_members']['Insert']
export type CorporateStructureUpdateData = Database['public']['Tables']['corporate_structure_members']['Update']

export const useCorporateStructure = () => {
  const [members, setMembers] = useState<CorporateStructureMember[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Função para garantir que o Supabase está autenticado
  const ensureAuth = async () => {
    const token = getJWTFromCookie()
    if (token) {
      await setSupabaseAuth(token)
    }
  }

  // Buscar todos os membros da estrutura societária da empresa
  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.company) {
        setMembers([])
        setLoading(false)
        return
      }

      // Garantir que o Supabase está autenticado
      await ensureAuth()

      const { data: membersData, error: membersError } = await supabase
        .from('corporate_structure_members')
        .select('*')
        .eq('company_id', user.company)
        .order('priority_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (membersError) throw membersError

      setMembers(membersData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar membros da estrutura societária')
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  // Adicionar novo membro à estrutura societária
  const addMember = async (memberData: CorporateStructureFormData) => {
    try {
      setError(null)

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      // Garantir que o Supabase está autenticado
      await ensureAuth()

      // Verificar se o membro já existe (por nome e empresa)
      const { data: existingMembers, error: existingError } = await supabase
        .from('corporate_structure_members')
        .select('id')
        .eq('company_id', user.company)
        .eq('name', memberData.name)
        .eq('status', 'Ativo')

      if (existingError) throw existingError

      if (existingMembers && existingMembers.length > 0) {
        throw new Error('Membro já existe na estrutura societária')
      }

      // Calcular idade se não fornecida
      let calculatedAge = memberData.age
      if (memberData.birth_date && !memberData.age) {
        const birthDate = new Date(memberData.birth_date)
        const today = new Date()
        calculatedAge = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--
        }
      }

      // Preparar dados para inserção
      const insertData = {
        company_id: user.company,
        name: memberData.name,
        birth_date: memberData.birth_date || null,
        age: calculatedAge || null,
        category: memberData.category,
        role: memberData.role,
        involvement: memberData.involvement || null,
        status: memberData.status || 'Ativo',
        email: memberData.email || null,
        phone: memberData.phone || null,
        document: memberData.document || null,
        address: memberData.address || null,
        is_family_member: memberData.is_family_member || false,
        is_external: memberData.is_external || false,
        priority_order: memberData.priority_order || 0,
        shareholding: memberData.shareholding || null,
        created_by: user.id || null,
        updated_by: user.id || null,
        user_id: user.id || null
      }

      // Criar novo membro
      const { data: newMember, error: memberError } = await supabase
        .from('corporate_structure_members')
        .insert(insertData)
        .select()
        .single()

      if (memberError) throw memberError

      // Atualizar lista de membros
      await fetchMembers()
      
      return newMember
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar membro')
      throw err
    }
  }

  // Atualizar membro da estrutura societária
  const updateMember = async (memberId: string, updates: CorporateStructureUpdateData) => {
    try {
      setError(null)

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      // Garantir que o Supabase está autenticado
      await ensureAuth()

      // Verificar se o membro pertence à empresa do usuário
      const { data: member, error: memberError } = await supabase
        .from('corporate_structure_members')
        .select('id')
        .eq('id', memberId)
        .eq('company_id', user.company)
        .single()

      if (memberError || !member) {
        throw new Error('Membro não encontrado ou sem permissão')
      }

      // Calcular idade se birth_date foi atualizada
      let calculatedAge = updates.age
      if (updates.birth_date && !updates.age) {
        const birthDate = new Date(updates.birth_date)
        const today = new Date()
        calculatedAge = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--
        }
      }

      // Preparar dados para atualização
      const updateData = {
        ...updates,
        age: calculatedAge || updates.age,
        updated_by: user.id || null,
        updated_at: new Date().toISOString()
      }

      // Atualizar membro
      const { data: updatedMember, error: updateError } = await supabase
        .from('corporate_structure_members')
        .update(updateData)
        .eq('id', memberId)
        .select()
        .single()

      if (updateError) throw updateError

      // Atualizar lista de membros
      await fetchMembers()
      
      return updatedMember
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar membro')
      throw err
    }
  }

  // Remover membro da estrutura societária (delete real)
  const removeMember = async (memberId: string) => {
    try {
      setError(null)

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      // Garantir que o Supabase está autenticado
      await ensureAuth()

      // Verificar se o membro pertence à empresa do usuário
      const { data: member, error: memberError } = await supabase
        .from('corporate_structure_members')
        .select('id, name')
        .eq('id', memberId)
        .eq('company_id', user.company)
        .single()

      if (memberError || !member) {
        throw new Error('Membro não encontrado ou sem permissão')
      }

      // Deletar o membro do banco de dados
      const { error: deleteError } = await supabase
        .from('corporate_structure_members')
        .delete()
        .eq('id', memberId)

      if (deleteError) throw deleteError

      // Atualizar lista de membros
      await fetchMembers()
      
      console.log(`Membro ${member.name} removido com sucesso`)
    } catch (err) {
      console.error('Erro ao remover membro:', err)
      setError(err instanceof Error ? err.message : 'Erro ao remover membro')
      throw err
    }
  }

  // Buscar membro específico
  const getMember = async (memberId: string) => {
    try {
      setError(null)

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      // Garantir que o Supabase está autenticado
      await ensureAuth()

      const { data: member, error: memberError } = await supabase
        .from('corporate_structure_members')
        .select('*')
        .eq('id', memberId)
        .eq('company_id', user.company)
        .single()

      if (memberError) throw memberError

      return member
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar membro')
      throw err
    }
  }

  // Buscar membros por categoria
  const getMembersByCategory = async (category: string) => {
    try {
      setError(null)

      if (!user?.company) {
        return []
      }

      // Garantir que o Supabase está autenticado
      await ensureAuth()

      const { data: membersData, error: membersError } = await supabase
        .from('corporate_structure_members')
        .select('*')
        .eq('company_id', user.company)
        .eq('category', category)
        .eq('status', 'Ativo')
        .order('priority_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (membersError) throw membersError

      return membersData || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar membros por categoria')
      return []
    }
  }

  // Buscar membros por nome (para busca)
  const searchMembers = async (query: string) => {
    try {
      setError(null)

      if (!user?.company) {
        return []
      }

      // Garantir que o Supabase está autenticado
      await ensureAuth()

      const { data: membersData, error: membersError } = await supabase
        .from('corporate_structure_members')
        .select('*')
        .eq('company_id', user.company)
        .eq('status', 'Ativo')
        .ilike('name', `%${query}%`)
        .order('priority_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(20)

      if (membersError) throw membersError

      return membersData || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar membros')
      return []
    }
  }

  // Buscar contagem de membros por categoria
  const getMembersCountByCategory = async () => {
    try {
      setError(null)

      if (!user?.company) {
        return {}
      }

      // Garantir que o Supabase está autenticado
      await ensureAuth()

      const { data: membersData, error: membersError } = await supabase
        .from('corporate_structure_members')
        .select('category')
        .eq('company_id', user.company)
        .eq('status', 'Ativo')

      if (membersError) throw membersError

      const counts = membersData?.reduce((acc, member) => {
        acc[member.category] = (acc[member.category] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      return counts
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao contar membros por categoria')
      return {}
    }
  }

  // Limpar estado
  const clearMembers = () => {
    setMembers([])
    setError(null)
  }

  // Carregar membros quando o usuário for carregado
  useEffect(() => {
    if (user?.company) {
      fetchMembers()
    } else {
      setMembers([])
      setLoading(false)
    }
  }, [user?.company])

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMember,
    removeMember,
    getMember,
    getMembersByCategory,
    searchMembers,
    getMembersCountByCategory,
    clearMembers
  }
}
