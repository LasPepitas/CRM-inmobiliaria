import { useState, useMemo, useEffect, useCallback } from 'react'
import { useStore } from '@/store'
import type { Agent } from '@/store/slices/agentsSlice'
import type { AgentFormData } from '../types'
import { AGENT_FORM_DEFAULT } from '../types'
import { useAgents } from './useAgents'

export function useEquipo() {
  const { leads, deals, addAgent, updateAgent, deleteAgent, addToast } = useStore()
  const { agents, loadingAgents, fetchAgents } = useAgents()

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [form, setForm] = useState<AgentFormData>(AGENT_FORM_DEFAULT)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [search])

  const filteredAgents = useMemo(
    () => agents.filter(a =>
      !debouncedSearch ||
      a.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.role.toLowerCase().includes(debouncedSearch.toLowerCase())
    ),
    [agents, debouncedSearch]
  )

  const agentsMetricsMap = useMemo(() => {
    const map: Record<string, { activeDeals: number; totalValue: number; agentLeads: number }> = {}

    // Inicializar mapa para cada agente
    agents.forEach(a => {
      map[a.id] = { activeDeals: 0, totalValue: 0, agentLeads: 0 }
    })

    // Contabilizar Leads en O(L)
    leads.forEach(l => {
      if (l.assigned_agent && map[l.assigned_agent]) {
        map[l.assigned_agent].agentLeads++
      }
    })

    // Mapear lead_id a assigned_agent para búsqueda O(1) de negocios
    const leadAgentMap = new Map<string, string>()
    leads.forEach(l => {
      if (l.assigned_agent) {
        leadAgentMap.set(l.id, l.assigned_agent)
      }
    })

    // Contabilizar Deals en O(D)
    deals.forEach(d => {
      const assignedAgentId = leadAgentMap.get(d.lead_id)
      if (assignedAgentId && map[assignedAgentId]) {
        const metrics = map[assignedAgentId]
        if (d.stage !== 'Cierre') {
          metrics.activeDeals++
        }
        metrics.totalValue += d.value
      }
    })

    return map
  }, [agents, leads, deals])

  const getAgentMetrics = useCallback((agentId: string) => {
    return agentsMetricsMap[agentId] || { activeDeals: 0, totalValue: 0, agentLeads: 0 }
  }, [agentsMetricsMap])

  const teamStats = useMemo(() => ({
    totalRevenue: agents.reduce((sum, a) => sum + a.revenue, 0),
    totalActiveDeals: agents.reduce((sum, a) => sum + a.active_deals, 0),
    totalClosed: agents.reduce((sum, a) => sum + a.closed_deals, 0),
  }), [agents])

  const deleteTargetAgent = useMemo(
    () => agents.find(a => a.id === deleteConfirmId),
    [agents, deleteConfirmId]
  )

  const openAddModal = () => {
    setForm(AGENT_FORM_DEFAULT)
    setShowAddModal(true)
  }

  const openEditModal = (agent: Agent) => {
    const [firstName = '', ...lastNameParts] = agent.name.split(' ')
    const lastName = lastNameParts.join(' ')
    setForm({
      firstName,
      lastName,
      email: agent.email,
      phone: agent.phone || '',
      dni: agent.dni || '',
      role: agent.role,
      password: '',
    })
    setEditingAgentId(agent.id)
  }

  const handleAdd = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      addToast({ title: 'Error', description: 'Nombre, apellido, email y contraseña son obligatorios', variant: 'error' })
      return
    }
    try {
      await addAgent({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role,
      })
      addToast({ title: 'Miembro agregado', description: `${form.firstName} ${form.lastName} se unió al equipo`, variant: 'success' })
      setShowAddModal(false)
      setForm(AGENT_FORM_DEFAULT)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo agregar al miembro del equipo'
      addToast({ title: 'Error', description: message, variant: 'error' })
    }
  }

  const handleEdit = () => {
    if (!editingAgentId) return
    if (!form.firstName || !form.lastName || !form.email) {
      addToast({ title: 'Error', description: 'Nombre, apellido y email son obligatorios', variant: 'error' })
      return
    }
    updateAgent(editingAgentId, {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      dni: form.dni,
      role: form.role,
    })
    addToast({ title: 'Miembro actualizado', description: `${form.firstName} ${form.lastName} fue modificado`, variant: 'success' })
    setEditingAgentId(null)
    setForm(AGENT_FORM_DEFAULT)
  }

  const handleDelete = () => {
    if (!deleteConfirmId) return
    deleteAgent(deleteConfirmId)
    addToast({ title: 'Miembro eliminado', description: `${deleteTargetAgent?.name} fue removido del equipo`, variant: 'success' })
    setDeleteConfirmId(null)
  }

  return {
    agents,
    filteredAgents,
    deleteTargetAgent,
    search,
    showAddModal,
    editingAgentId,
    deleteConfirmId,
    form,
    teamStats,
    loadingAgents,
    refreshAgents: fetchAgents,
    // setters
    setSearch,
    setShowAddModal,
    setEditingAgentId,
    setDeleteConfirmId,
    setForm,
    // actions
    openAddModal,
    openEditModal,
    handleAdd,
    handleEdit,
    handleDelete,
    getAgentMetrics,
  }
}
