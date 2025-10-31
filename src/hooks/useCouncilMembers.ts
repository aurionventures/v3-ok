import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'
import { useAuth } from '../contexts/AuthContext'
import { mockCouncilMembers } from '@/data/mockCouncilsData'

type CouncilMember = Database['public']['Tables']['council_members']['Row']
type Council = Database['public']['Tables']['councils']['Row']

export interface CouncilMemberFormData {
  council_id: string
  name: string
  role: string
  start_date: string
  end_date?: string
}

export interface CouncilMemberUpdateData {
  name?: string
  role?: string
  start_date?: string
  end_date?: string
  status?: string
}

export const useCouncilMembers = () => {
  const [members, setMembers] = useState<CouncilMember[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Buscar todos os conselheiros da empresa
  const fetchAllCompanyMembers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Verificar se há usuário autenticado
      if (!user?.company) {
        console.log('No user/company, using mock members')
        setMembers(mockCouncilMembers)
        setLoading(false)
        return
      }

      // Buscar todos os membros dos conselhos da empresa
      const { data: membersData, error: membersError } = await supabase
        .from('council_members')
        .select(`
          *,
          councils!inner(company_id)
        `)
        .eq('councils.company_id', user.company)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      // Usar mock data em caso de erro OU dados vazios
      if (membersError || !membersData || membersData.length === 0) {
        console.log('Database error or empty, using mock members:', membersError?.message)
        setMembers(mockCouncilMembers)
        setLoading(false)
        return
      }

      setMembers(membersData || [])
    } catch (err) {
      // Em caso de erro inesperado, usar mock data
      console.log('Unexpected error, using mock members:', err)
      setMembers(mockCouncilMembers)
    } finally {
      setLoading(false)
    }
  }

  // Buscar membros de um conselho específico
  const fetchCouncilMembers = async (councilId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Verificar se há usuário autenticado
      if (!user?.company) {
        setMembers([])
        setLoading(false)
        return
      }

      // Primeiro verificar se o conselho pertence à empresa do usuário
      const { data: council, error: councilError } = await supabase
        .from('councils')
        .select('id')
        .eq('id', councilId)
        .eq('company_id', user.company)
        .single()

      if (councilError || !council) {
        throw new Error('Conselho não encontrado ou sem permissão')
      }

      // Buscar membros do conselho
      const { data: membersData, error: membersError } = await supabase
        .from('council_members')
        .select('*')
        .eq('council_id', councilId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (membersError) throw membersError

      setMembers(membersData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar membros do conselho')
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  // Adicionar novo membro ao conselho
  const addCouncilMember = async (memberData: CouncilMemberFormData) => {
    try {
      setError(null)

      // Verificar se há usuário autenticado
      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      // Verificar se o conselho pertence à empresa do usuário
      const { data: council, error: councilError } = await supabase
        .from('councils')
        .select('id')
        .eq('id', memberData.council_id)
        .eq('company_id', user.company)
        .single()

      if (councilError || !council) {
        throw new Error('Conselho não encontrado ou sem permissão')
      }

      // Verificar se o membro já existe
      const { data: existingMembers, error: existingError } = await supabase
        .from('council_members')
        .select('id')
        .eq('council_id', memberData.council_id)
        .eq('name', memberData.name)
        .eq('status', 'active')

      if (existingError) throw existingError

      if (existingMembers && existingMembers.length > 0) {
        throw new Error('Membro já existe neste conselho')
      }

      // Criar novo membro
      const { data: newMember, error: memberError } = await supabase
        .from('council_members')
        .insert({
          council_id: memberData.council_id,
          name: memberData.name,
          role: memberData.role,
          start_date: memberData.start_date,
          end_date: memberData.end_date || null,
          status: 'active'
        })
        .select()
        .single()

      if (memberError) throw memberError

      // Atualizar lista de membros
      await fetchCouncilMembers(memberData.council_id)
      
      return newMember
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar membro')
      throw err
    }
  }

  // Atualizar membro do conselho
  const updateCouncilMember = async (memberId: string, updates: CouncilMemberUpdateData) => {
    try {
      setError(null)

      // Verificar se há usuário autenticado
      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      // Verificar se o membro pertence a um conselho da empresa do usuário
      const { data: member, error: memberError } = await supabase
        .from('council_members')
        .select(`
          id,
          council_id,
          councils!inner(company_id)
        `)
        .eq('id', memberId)
        .eq('councils.company_id', user.company)
        .single()

      if (memberError || !member) {
        throw new Error('Membro não encontrado ou sem permissão')
      }

      // Atualizar membro
      const { data: updatedMember, error: updateError } = await supabase
        .from('council_members')
        .update(updates)
        .eq('id', memberId)
        .select()
        .single()

      if (updateError) throw updateError

      // Atualizar lista de membros
      await fetchCouncilMembers(member.council_id)
      
      return updatedMember
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar membro')
      throw err
    }
  }

  // Remover membro do conselho (soft delete)
  const removeCouncilMember = async (memberId: string) => {
    try {
      setError(null)

      // Verificar se há usuário autenticado
      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      // Verificar se o membro pertence a um conselho da empresa do usuário
      const { data: member, error: memberError } = await supabase
        .from('council_members')
        .select(`
          id,
          council_id,
          councils!inner(company_id)
        `)
        .eq('id', memberId)
        .eq('councils.company_id', user.company)
        .single()

      if (memberError || !member) {
        throw new Error('Membro não encontrado ou sem permissão')
      }

      // Marcar como inativo (soft delete)
      const { error: updateError } = await supabase
        .from('council_members')
        .update({ 
          status: 'inactive',
          end_date: new Date().toISOString().split('T')[0] // Data atual
        })
        .eq('id', memberId)

      if (updateError) throw updateError

      // Atualizar lista de membros
      await fetchCouncilMembers(member.council_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover membro')
      throw err
    }
  }

  // Buscar membros por nome (para autocomplete)
  const searchMembers = async (query: string, councilId?: string) => {
    try {
      setError(null)

      if (!user?.company) {
        return []
      }

      let queryBuilder = supabase
        .from('council_members')
        .select(`
          id,
          name,
          role,
          council_id,
          councils!inner(company_id)
        `)
        .eq('councils.company_id', user.company)
        .eq('status', 'active')
        .ilike('name', `%${query}%`)
        .limit(10)

      if (councilId) {
        queryBuilder = queryBuilder.eq('council_id', councilId)
      }

      const { data, error } = await queryBuilder

      if (error) throw error

      return data || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar membros')
      return []
    }
  }

  // Buscar todos os conselhos da empresa (para dropdown)
  const fetchCompanyCouncils = async () => {
    try {
      setError(null)

      if (!user?.company) {
        return []
      }

      const { data: councils, error: councilsError } = await supabase
        .from('councils')
        .select('id, name, type')
        .eq('company_id', user.company)
        .eq('status', 'active')
        .order('name', { ascending: true })

      if (councilsError) throw councilsError

      return councils || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar conselhos')
      return []
    }
  }

  // Buscar contagem de membros por conselho
  const getMembersCountByCouncil = async (councilId: string) => {
    try {
      setError(null)

      if (!user?.company) {
        return 0
      }

      const { count, error } = await supabase
        .from('council_members')
        .select('*', { count: 'exact', head: true })
        .eq('council_id', councilId)
        .eq('status', 'active')

      if (error) throw error

      return count || 0
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao contar membros')
      return 0
    }
  }

  // Limpar estado
  const clearMembers = () => {
    setMembers([])
    setError(null)
  }

  // Carregar todos os conselheiros quando o usuário for carregado
  useEffect(() => {
    if (user?.company) {
      fetchAllCompanyMembers()
    } else {
      setMembers([])
      setLoading(false)
    }
  }, [user?.company])

  return {
    members,
    loading,
    error,
    fetchAllCompanyMembers,
    fetchCouncilMembers,
    addCouncilMember,
    updateCouncilMember,
    removeCouncilMember,
    searchMembers,
    fetchCompanyCouncils,
    getMembersCountByCouncil,
    clearMembers
  }
}
