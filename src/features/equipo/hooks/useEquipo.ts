import { useState, useMemo, useEffect } from 'react'
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

  const getAgentMetrics = (agentId: string) => {
    const agentDeals = deals.filter(d => {
      const lead = leads.find(l => l.id === d.lead_id)
      return lead?.assigned_agent === agentId
    })
    return {
      activeDeals: agentDeals.filter(d => d.stage !== 'Cierre').length,
      totalValue: agentDeals.reduce((sum, d) => sum + d.value, 0),
      agentLeads: leads.filter(l => l.assigned_agent === agentId).length,
    }
  }

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
