import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import type { NewVisitForm } from '../types'
import { NEW_VISIT_DEFAULT } from '../types'
import { formatDate } from '@/lib/utils'

export function useVisitas() {
  const { visits, properties, leads, agents, addVisit, addToast } = useStore()

  const [statusFilter, setStatusFilter] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [showNewVisitModal, setShowNewVisitModal] = useState(false)
  const [newVisit, setNewVisit] = useState<NewVisitForm>(NEW_VISIT_DEFAULT)

  const filteredVisits = useMemo(
    () => visits.filter(v => {
      const matchesStatus = !statusFilter || v.status === statusFilter
      const matchesAgent = !agentFilter || v.agent === agentFilter
      return matchesStatus && matchesAgent
    }),
    [visits, statusFilter, agentFilter]
  )

  const upcomingVisits = useMemo(
    () => filteredVisits
      .filter(v => v.status === 'Programada')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [filteredVisits]
  )

  const sortedVisits = useMemo(
    () => [...filteredVisits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [filteredVisits]
  )

  const getAgentName = (agentId: string) =>
    agents.find(a => a.id === agentId)?.name || 'Agente'

  const getVisitsByDate = (dateStr: string) =>
    visits.filter(v => v.date === dateStr)

  const activeFilters = [statusFilter, agentFilter].filter(Boolean).length

  const clearFilters = () => {
    setStatusFilter('')
    setAgentFilter('')
  }

  const handleAddVisit = () => {
    if (!newVisit.property_id || !newVisit.lead_id || !newVisit.date || !newVisit.time) {
      addToast({ title: 'Error', description: 'Completá los campos obligatorios', variant: 'error' })
      return
    }
    addVisit({ ...newVisit, status: 'Programada' })
    addToast({
      title: 'Visita programada',
      description: `Visita agendada para el ${formatDate(newVisit.date)} a las ${newVisit.time}`,
      variant: 'success',
    })
    setShowNewVisitModal(false)
    setNewVisit(NEW_VISIT_DEFAULT)
  }

  return {
    // data
    visits,
    filteredVisits,
    upcomingVisits,
    sortedVisits,
    properties,
    leads,
    agents,
    // state
    statusFilter,
    agentFilter,
    showNewVisitModal,
    newVisit,
    activeFilters,
    // setters
    setStatusFilter,
    setAgentFilter,
    setShowNewVisitModal,
    setNewVisit,
    // actions
    getAgentName,
    getVisitsByDate,
    clearFilters,
    handleAddVisit,
  }
}
