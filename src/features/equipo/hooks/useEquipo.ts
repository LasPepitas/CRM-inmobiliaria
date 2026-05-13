import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import type { Agent } from '@/store/slices/agentsSlice'
import type { AgentFormData } from '../types'
import { AGENT_FORM_DEFAULT } from '../types'

export function useEquipo() {
  const { agents, leads, deals, addAgent, updateAgent, deleteAgent, addToast } = useStore()

  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [form, setForm] = useState<AgentFormData>(AGENT_FORM_DEFAULT)

  const filteredAgents = useMemo(
    () => agents.filter(a =>
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
    ),
    [agents, search]
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
    setForm({
      name: agent.name,
      email: agent.email,
      phone: agent.phone || '',
      dni: agent.dni || '',
      role: agent.role,
    })
    setEditingAgentId(agent.id)
  }

  const handleAdd = () => {
    if (!form.name || !form.email) {
      addToast({ title: 'Error', description: 'Nombre y email son obligatorios', variant: 'error' })
      return
    }
    addAgent({ ...form, active_deals: 0, closed_deals: 0, revenue: 0 })
    addToast({ title: 'Miembro agregado', description: `${form.name} se unió al equipo`, variant: 'success' })
    setShowAddModal(false)
    setForm(AGENT_FORM_DEFAULT)
  }

  const handleEdit = () => {
    if (!editingAgentId) return
    if (!form.name || !form.email) {
      addToast({ title: 'Error', description: 'Nombre y email son obligatorios', variant: 'error' })
      return
    }
    updateAgent(editingAgentId, form)
    addToast({ title: 'Miembro actualizado', description: `${form.name} fue modificado`, variant: 'success' })
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
