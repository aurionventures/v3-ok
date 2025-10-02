import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'
import { useAuth } from '../contexts/AuthContext'

type Meeting = Database['public']['Tables']['meetings']['Row']
type Council = Database['public']['Tables']['councils']['Row']

export interface MeetingFormData {
  council_id: string
  title: string
  date: string
  time: string
  type: 'Ordinária' | 'Extraordinária'
  location?: string
  agenda?: string
}

export interface MeetingUpdateData {
  title?: string
  date?: string
  time?: string
  type?: 'Ordinária' | 'Extraordinária'
  status?: 'Agendada' | 'Realizada' | 'Cancelada'
  location?: string
  agenda?: string
  minutes?: string
}

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Buscar todas as reuniões da empresa
  const fetchMeetings = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.company) {
        setMeetings([])
        setLoading(false)
        return
      }

      // Buscar reuniões através dos conselhos da empresa
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select(`
          *,
          councils!inner(company_id)
        `)
        .eq('councils.company_id', user.company)
        .order('date', { ascending: false })

      if (meetingsError) throw meetingsError

      setMeetings(meetingsData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar reuniões')
      setMeetings([])
    } finally {
      setLoading(false)
    }
  }

  // Criar nova reunião
  const createMeeting = async (meetingData: MeetingFormData) => {
    try {
      setError(null)

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      // Verificar se o conselho pertence à empresa do usuário
      const { data: council, error: councilError } = await supabase
        .from('councils')
        .select('id')
        .eq('id', meetingData.council_id)
        .eq('company_id', user.company)
        .single()

      if (councilError || !council) {
        throw new Error('Conselho não encontrado ou sem permissão')
      }

      const { data: newMeeting, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          council_id: meetingData.council_id,
          title: meetingData.title,
          date: meetingData.date,
          time: meetingData.time,
          type: meetingData.type,
          status: 'Agendada',
          location: meetingData.location || null,
          agenda: meetingData.agenda || null
        })
        .select()
        .single()

      if (meetingError) throw meetingError

      await fetchMeetings()
      return newMeeting
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar reunião')
      throw err
    }
  }

  // Atualizar reunião
  const updateMeeting = async (meetingId: string, updates: MeetingUpdateData) => {
    try {
      setError(null)

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      // Verificar se a reunião pertence a um conselho da empresa do usuário
      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .select(`
          id,
          council_id,
          councils!inner(company_id)
        `)
        .eq('id', meetingId)
        .eq('councils.company_id', user.company)
        .single()

      if (meetingError || !meeting) {
        throw new Error('Reunião não encontrada ou sem permissão')
      }

      const { data: updatedMeeting, error: updateError } = await supabase
        .from('meetings')
        .update(updates)
        .eq('id', meetingId)
        .select()
        .single()

      if (updateError) throw updateError

      await fetchMeetings()
      return updatedMeeting
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar reunião')
      throw err
    }
  }

  // Deletar reunião
  const deleteMeeting = async (meetingId: string) => {
    try {
      setError(null)

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      // Verificar se a reunião pertence a um conselho da empresa do usuário
      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .select(`
          id,
          council_id,
          councils!inner(company_id)
        `)
        .eq('id', meetingId)
        .eq('councils.company_id', user.company)
        .single()

      if (meetingError || !meeting) {
        throw new Error('Reunião não encontrada ou sem permissão')
      }

      const { error: deleteError } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId)

      if (deleteError) throw deleteError

      await fetchMeetings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar reunião')
      throw err
    }
  }

  // Buscar reunião específica
  const getMeeting = async (meetingId: string) => {
    try {
      setError(null)

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada')
      }

      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .select(`
          *,
          councils!inner(company_id)
        `)
        .eq('id', meetingId)
        .eq('councils.company_id', user.company)
        .single()

      if (meetingError) throw meetingError

      return meeting
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar reunião')
      throw err
    }
  }

  // Buscar reuniões por conselho
  const getMeetingsByCouncil = async (councilId: string) => {
    try {
      setError(null)

      if (!user?.company) {
        return []
      }

      // Verificar se o conselho pertence à empresa do usuário
      const { data: council, error: councilError } = await supabase
        .from('councils')
        .select('id')
        .eq('id', councilId)
        .eq('company_id', user.company)
        .single()

      if (councilError || !council) {
        throw new Error('Conselho não encontrado ou sem permissão')
      }

      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select('*')
        .eq('council_id', councilId)
        .order('date', { ascending: false })

      if (meetingsError) throw meetingsError

      return meetingsData || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar reuniões do conselho')
      return []
    }
  }

  // Buscar reuniões por status
  const getMeetingsByStatus = async (status: string) => {
    try {
      setError(null)

      if (!user?.company) {
        return []
      }

      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select(`
          *,
          councils!inner(company_id)
        `)
        .eq('councils.company_id', user.company)
        .eq('status', status)
        .order('date', { ascending: false })

      if (meetingsError) throw meetingsError

      return meetingsData || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar reuniões por status')
      return []
    }
  }

  // Buscar reuniões próximas (próximos 30 dias)
  const getUpcomingMeetings = async () => {
    try {
      setError(null)

      if (!user?.company) {
        return []
      }

      const today = new Date().toISOString().split('T')[0]
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select(`
          *,
          councils!inner(company_id)
        `)
        .eq('councils.company_id', user.company)
        .gte('date', today)
        .lte('date', thirtyDaysFromNow)
        .eq('status', 'Agendada')
        .order('date', { ascending: true })

      if (meetingsError) throw meetingsError

      return meetingsData || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar reuniões próximas')
      return []
    }
  }

  // Buscar próxima reunião de um conselho específico
  const getNextMeetingByCouncil = async (councilId: string) => {
    try {
      setError(null)

      if (!user?.company) {
        return null
      }

      const today = new Date().toISOString().split('T')[0]

      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .select(`
          *,
          councils!inner(company_id)
        `)
        .eq('councils.company_id', user.company)
        .eq('council_id', councilId)
        .eq('status', 'Agendada')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(1)
        .single()

      if (meetingError && meetingError.code !== 'PGRST116') {
        throw meetingError
      }

      return meeting || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar próxima reunião')
      return null
    }
  }

  // Contar reuniões por conselho
  const getMeetingsCountByCouncil = async (councilId: string) => {
    try {
      setError(null)

      if (!user?.company) {
        return 0
      }

      // Verificar se o conselho pertence à empresa do usuário
      const { data: council, error: councilError } = await supabase
        .from('councils')
        .select('id')
        .eq('id', councilId)
        .eq('company_id', user.company)
        .single()

      if (councilError || !council) {
        throw new Error('Conselho não encontrado ou sem permissão')
      }

      const { count, error: countError } = await supabase
        .from('meetings')
        .select('*', { count: 'exact', head: true })
        .eq('council_id', councilId)

      if (countError) throw countError

      return count || 0
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao contar reuniões do conselho')
      return 0
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

  // Limpar estado
  const clearMeetings = () => {
    setMeetings([])
    setError(null)
  }

  useEffect(() => {
    if (user?.company) {
      fetchMeetings()
    } else {
      setMeetings([])
      setLoading(false)
    }
  }, [user?.company])

  return {
    meetings,
    loading,
    error,
    fetchMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    getMeeting,
    getMeetingsByCouncil,
    getMeetingsByStatus,
    getUpcomingMeetings,
    getNextMeetingByCouncil,
    getMeetingsCountByCouncil,
    fetchCompanyCouncils,
    clearMeetings
  }
}