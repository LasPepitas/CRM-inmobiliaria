import { useState, useMemo, useEffect, useCallback } from 'react'
import { useStore } from '@/store'
import type { DealStage, PipelineView } from '../types'
import { pipelineApi, toFrontendDeal } from '../api/pipelineApi'
import type { Deal } from '@/store/slices/dealsSlice'

export function usePipeline() {
  const { leads, agents, addToast } = useStore()

  // API State
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDealId, setSelectedDealId] = useState<string | null>(null)
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null)
  const [view, setView] = useState<PipelineView>('kanban')
  const [search, setSearch] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [noteText, setNoteText] = useState('')

  const fetchDeals = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await pipelineApi.getAll()
      setDeals(data.map(toFrontendDeal))
    } catch (err: unknown) {
      console.error('Error fetching pipeline deals:', err)
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Error al cargar los negocios del pipeline')
      addToast({ title: 'Error', description: 'No se pudieron cargar los negocios', variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchDeals()
    })
  }, [fetchDeals])

  const getLeadName = useCallback((leadId: string) => {
    const l = leads.find(l => l.id === leadId)
    return l ? `${l.firstName} ${l.lastName}`.trim() : 'Lead'
  }, [leads])

  const getLeadAgent = useCallback((leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    return agents.find(a => a.id === lead?.assigned_agent)
  }, [leads, agents])

  const filteredDeals = useMemo(() =>
    deals.filter(deal => {
      const lead = leads.find(l => l.id === deal.lead_id)
      // Remove status filter to show deals even if lead is converted
      // if (lead?.status !== 'Activo') return false 
      if (deal.stage === 'Cancelado') return false
      
      const agent = agents.find(a => a.id === lead?.assigned_agent)
      const matchesSearch = !search ||
        deal.title.toLowerCase().includes(search.toLowerCase()) ||
        (lead ? `${lead.firstName} ${lead.lastName}` : '').toLowerCase().includes(search.toLowerCase())
      const matchesAgent = !agentFilter || agent?.id === agentFilter
      const matchesStage = !stageFilter || deal.stage === stageFilter
      return matchesSearch && matchesAgent && matchesStage
    }),
    [deals, leads, agents, search, agentFilter, stageFilter]
  )

  const selectedDeal = useMemo(
    () => deals.find(d => d.id === selectedDealId),
    [deals, selectedDealId]
  )

  const activeFiltersCount = [search, agentFilter, stageFilter].filter(Boolean).length

  const handleMoveDeal = async (dealId: string, newStage: DealStage) => {
    try {
      // Optimistic update
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d))
      await pipelineApi.updateStage(dealId, newStage)
      addToast({ title: 'Negocio movido', description: `Movido a ${newStage}`, variant: 'success' })
    } catch (err: unknown) {
      // Revert on error by refetching
      fetchDeals()
      const error = err as { response?: { data?: { message?: string } } }
      addToast({ title: 'Error al mover negocio', description: error.response?.data?.message || 'Revisa tu conexión', variant: 'error' })
    }
  }

  const handleAddNote = async () => {
    if (!selectedDealId || !noteText.trim()) return
    
    try {
      const data = await pipelineApi.addNote(selectedDealId, noteText.trim())
      
      const newNote = {
        id: data.id,
        text: data.text,
        timestamp: data.createdAt,
        author: data.author ? `${data.author.firstName} ${data.author.lastName}` : 'Sistema'
      }

      setDeals(prev => prev.map(d => {
        if (d.id !== selectedDealId) return d
        return { ...d, notes: [newNote, ...(d.notes || [])] }
      }))
      
      setNoteText('')
      addToast({ title: 'Nota agregada', variant: 'success' })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      addToast({ title: 'Error al agregar nota', description: error.response?.data?.message || 'Inténtalo de nuevo', variant: 'error' })
    }
  }

  const confirmDeleteDeal = (id: string) => {
    setDeletingDealId(id)
  }

  const handleDeleteDeal = async (id: string) => {
    try {
      await pipelineApi.remove(id)
      setDeals(prev => prev.filter(d => d.id !== id))
      addToast({ title: 'Negocio eliminado', variant: 'success' })
      setSelectedDealId(null)
      setDeletingDealId(null)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      addToast({ title: 'Error al eliminar', description: error.response?.data?.message || 'Inténtalo de nuevo', variant: 'error' })
    }
  }

  const clearFilters = () => {
    setSearch('')
    setAgentFilter('')
    setStageFilter('')
  }

  return {
    // data
    deals,
    isLoading,
    error,
    filteredDeals,
    leads,
    agents,
    selectedDeal,
    // state
    view,
    search,
    agentFilter,
    stageFilter,
    noteText,
    activeFiltersCount,
    deletingDealId,
    // setters
    setView,
    setSearch,
    setAgentFilter,
    setStageFilter,
    setNoteText,
    setSelectedDealId,
    setDeletingDealId,
    // actions
    getLeadName,
    getLeadAgent,
    handleMoveDeal,
    handleAddNote,
    handleDeleteDeal,
    confirmDeleteDeal,
    clearFilters,
    fetchDeals,
  }
}
