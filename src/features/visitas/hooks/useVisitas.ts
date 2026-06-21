import { useState, useMemo, useEffect } from 'react'
import { useStore } from '@/store'
import type { NewVisitForm } from '../types'
import { NEW_VISIT_DEFAULT } from '../types'
import { formatDate } from '@/lib/utils'

export function useVisitas() {
  const {
    visits,
    visitsLoading,
    visitsError,
    properties,
    leads,
    agents,
    fetchVisits,
    addVisit,
    addToast,
  } = useStore()

  const [statusFilter, setStatusFilter] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [showNewVisitModal, setShowNewVisitModal] = useState(false)
  const [newVisit, setNewVisit] = useState<NewVisitForm>(NEW_VISIT_DEFAULT)

  // Carga inicial desde el backend al montar el módulo
  useEffect(() => {
    fetchVisits()
  }, [fetchVisits])

  const filteredVisits = useMemo(
    () => visits.filter((v) => {
      const matchesStatus = !statusFilter || v.status === statusFilter
      const matchesAgent = !agentFilter || v.agent === agentFilter
      return matchesStatus && matchesAgent
    }),
    [visits, statusFilter, agentFilter]
  )

  const upcomingVisits = useMemo(
    () =>
      filteredVisits
        .filter((v) => v.status === 'Programada')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [filteredVisits]
  )

  const sortedVisits = useMemo(
    () => [...filteredVisits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [filteredVisits]
  )

  const getAgentName = (agentId: string) =>
    agents.find((a) => a.id === agentId)?.name || 'Agente'

  const getVisitsByDate = (dateStr: string) =>
    visits.filter((v) => v.date === dateStr)

  const activeFilters = [statusFilter, agentFilter].filter(Boolean).length

  const clearFilters = () => {
    setStatusFilter('')
    setAgentFilter('')
  }

  const handleAddVisit = async () => {
    if (!newVisit.property_id || !newVisit.lead_id || !newVisit.date || !newVisit.time) {
      addToast({ title: 'Error', description: 'Completá los campos obligatorios', variant: 'error' })
      return
    }
    try {
      const property = properties.find((p) => p.id === newVisit.property_id)
      await addVisit(newVisit, property?.title)
      addToast({
        title: 'Visita programada',
        description: `Visita agendada para el ${formatDate(newVisit.date)} a las ${newVisit.time}`,
        variant: 'success',
      })
      setShowNewVisitModal(false)
      setNewVisit(NEW_VISIT_DEFAULT)
    } catch (err) {
      addToast({
        title: 'Error al programar visita',
        description: err instanceof Error ? err.message : 'Intente nuevamente',
        variant: 'error',
      })
    }
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
    // async state
    visitsLoading,
    visitsError,
    // ui state
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
    fetchVisits,
    getAgentName,
    getVisitsByDate,
    clearFilters,
    handleAddVisit,
  }
}

