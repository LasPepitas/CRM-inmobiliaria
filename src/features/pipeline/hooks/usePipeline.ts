import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import type { DealStage, PipelineView } from '../types'

export function usePipeline() {
  const { deals, leads, agents, moveDeal, addDealNote, addToast } = useStore()

  const [selectedDealId, setSelectedDealId] = useState<string | null>(null)
  const [view, setView] = useState<PipelineView>('kanban')
  const [search, setSearch] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [noteText, setNoteText] = useState('')

  const getLeadName = (leadId: string) => {
    const l = leads.find(l => l.id === leadId)
    return l ? `${l.firstName} ${l.lastName}`.trim() : 'Lead'
  }

  const getLeadAgent = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    return agents.find(a => a.id === lead?.assigned_agent)
  }

  const filteredDeals = useMemo(() =>
    deals.filter(deal => {
      const lead = leads.find(l => l.id === deal.lead_id)
      if (lead?.status !== 'Activo') return false
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

  const handleMoveDeal = (dealId: string, newStage: DealStage) => {
    moveDeal(dealId, newStage)
    addToast({ title: 'Negocio movido', description: `Movido a ${newStage}`, variant: 'success' })
  }

  const handleAddNote = () => {
    if (!selectedDealId || !noteText.trim()) return
    addDealNote(selectedDealId, noteText.trim())
    setNoteText('')
    addToast({ title: 'Nota agregada', variant: 'success' })
  }

  const clearFilters = () => {
    setSearch('')
    setAgentFilter('')
    setStageFilter('')
  }

  return {
    // data
    deals,
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
    // setters
    setView,
    setSearch,
    setAgentFilter,
    setStageFilter,
    setNoteText,
    setSelectedDealId,
    // actions
    getLeadName,
    getLeadAgent,
    handleMoveDeal,
    handleAddNote,
    clearFilters,
  }
}
