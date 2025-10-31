import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'
import { useAuth } from '../contexts/AuthContext'
import { mockCouncils, mockCouncilMembers } from '@/data/mockCouncilsData'

type Council = Database['public']['Tables']['councils']['Row']
type CouncilMember = Database['public']['Tables']['council_members']['Row']
type Meeting = Database['public']['Tables']['meetings']['Row']
type VotingProject = Database['public']['Tables']['voting_projects']['Row']
type Vote = Database['public']['Tables']['votes']['Row']

type CouncilWithMembers = Council & {
  members: CouncilMember[]
}

export const useCouncils = () => {
  const [councils, setCouncils] = useState<CouncilWithMembers[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  
  console.log('Debug - useCouncils - User:', user)

  // Buscar todos os conselhos com seus membros (filtrado por empresa)
  const fetchCouncils = async () => {
    try {
      setLoading(true)
      setError(null)

      // Se não há usuário autenticado, não buscar conselhos
      if (!user?.company) {
        setCouncils([])
        setLoading(false)
        return
      }

      const { data: councilsData, error: councilsError } = await supabase
        .from('councils')
        .select('*')
        .eq('company_id', user.company)
        .order('created_at', { ascending: false })

      if (councilsError) throw councilsError

      if (!councilsData || councilsData.length === 0) {
        // Use mock data for demonstration
        console.log('No councils found in database, using mock data')
        const councilsWithMembers = mockCouncils.map(council => ({
          ...council,
          members: mockCouncilMembers.filter(member => member.council_id === council.id)
        }))
        setCouncils(councilsWithMembers)
        return
      }

      // Buscar membros para cada conselho (sem referência à tabela users)
      const councilsWithMembers = await Promise.all(
        councilsData.map(async (council) => {
          const { data: members, error: membersError } = await supabase
            .from('council_members')
            .select('*')
            .eq('council_id', council.id)
            .eq('status', 'active')

          if (membersError) throw membersError

          return {
            ...council,
            members: members || []
          }
        })
      )

      setCouncils(councilsWithMembers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar conselhos')
    } finally {
      setLoading(false)
    }
  }

  // Criar novo conselho
  const createCouncil = async (councilData: {
    name: string
    type?: string
    description?: string
    quorum?: number
  }) => {
    try {
      setError(null)

      // Verificar se há usuário autenticado com empresa
      console.log('Debug - createCouncil - User:', user)
      console.log('Debug - createCouncil - User company:', user?.company)
      
      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      const { data: newCouncil, error: councilError } = await supabase
        .from('councils')
        .insert({
          name: councilData.name,
          type: councilData.type || 'administrativo',
          description: councilData.description,
          quorum: councilData.quorum || 1,
          company_id: user.company
        })
        .select()
        .single()

      if (councilError) throw councilError

      await fetchCouncils()
      return newCouncil
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conselho')
      throw err
    }
  }

  // Adicionar membro ao conselho
  const addCouncilMember = async (memberData: {
    council_id: string
    name: string
    role: string
    start_date: string
    user_id?: string
  }) => {
    try {
      setError(null)

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

      const { data: newMember, error: memberError } = await supabase
        .from('council_members')
        .insert({
          council_id: memberData.council_id,
          name: memberData.name,
          role: memberData.role,
          start_date: memberData.start_date,
          user_id: memberData.user_id || null
        })
        .select()
        .single()

      if (memberError) throw memberError

      await fetchCouncils()
      return newMember
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar membro')
      throw err
    }
  }

  // Remover membro do conselho
  const removeCouncilMember = async (memberId: string) => {
    try {
      setError(null)

      const { error: memberError } = await supabase
        .from('council_members')
        .update({ status: 'inactive' })
        .eq('id', memberId)

      if (memberError) throw memberError

      await fetchCouncils()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover membro')
      throw err
    }
  }

  // Atualizar conselho
  const updateCouncil = async (councilId: string, updates: Partial<Council>) => {
    try {
      setError(null)

      const { error: councilError } = await supabase
        .from('councils')
        .update(updates)
        .eq('id', councilId)

      if (councilError) throw councilError

      await fetchCouncils()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar conselho')
      throw err
    }
  }

  // Deletar conselho
  const deleteCouncil = async (councilId: string) => {
    try {
      setError(null)

      const { error: councilError } = await supabase
        .from('councils')
        .delete()
        .eq('id', councilId)

      if (councilError) throw councilError

      await fetchCouncils()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar conselho')
      throw err
    }
  }

  // Buscar conselho específico
  const getCouncil = async (councilId: string) => {
    try {
      setError(null)

      // Verificar se há usuário autenticado com empresa
      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      const { data: council, error: councilError } = await supabase
        .from('councils')
        .select('*')
        .eq('id', councilId)
        .eq('company_id', user.company)
        .single()

      if (councilError) throw councilError

      if (!council) return null

      // Buscar membros do conselho (sem referência à tabela users)
      const { data: members, error: membersError } = await supabase
        .from('council_members')
        .select('*')
        .eq('council_id', council.id)
        .eq('status', 'active')

      if (membersError) throw membersError

      return {
        ...council,
        members: members || []
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar conselho')
      throw err
    }
  }

  useEffect(() => {
    if (user?.company) {
      fetchCouncils()
    } else {
      setCouncils([])
      setLoading(false)
    }
  }, [user?.company])

  return {
    councils,
    loading,
    error,
    fetchCouncils,
    createCouncil,
    addCouncilMember,
    removeCouncilMember,
    updateCouncil,
    deleteCouncil,
    getCouncil
  }
}
