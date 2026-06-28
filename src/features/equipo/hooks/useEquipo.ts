import { useState, useMemo, useCallback } from 'react'
import { useStore } from '@/store'
import type { Agent } from '@/store/slices/agentsSlice'
import type { AgentFormData } from '../types'
import { AGENT_FORM_DEFAULT } from '../types'
import { useAgents } from './useAgents'

export function useEquipo() {
  const { addAgent, updateAgent, deleteAgent, addToast } = useStore()
  const { agents, loadingAgents, fetchAgents } = useAgents()

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [form, setForm] = useState<AgentFormData>(AGENT_FORM_DEFAULT)

  const filteredAgents = useMemo(
    () => agents.filter(a => {
      const q = search.toLowerCase()
      const matchesSearch = !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
      const matchesRole = !roleFilter || a.role === roleFilter
      return matchesSearch && matchesRole
    }),
    [agents, search, roleFilter]
  )

  const deleteTargetAgent = useMemo(
    () => agents.find(a => a.id === deleteConfirmId),
    [agents, deleteConfirmId]
  )

  const openAddModal = useCallback(() => {
    setForm(AGENT_FORM_DEFAULT)
    setShowAddModal(true)
  }, [])

  const openEditModal = useCallback((agent: Agent) => {
    const parts = agent.name.trim().split(' ')
    const firstName = parts[0] ?? ''
    const lastName = parts.slice(1).join(' ')
    setForm({
      firstName,
      lastName,
      email: agent.email,
      phone: agent.phone ?? '',
      dni: agent.dni ?? '',
      role: agent.role,
      password: '',
    })
    setEditingAgentId(agent.id)
  }, [])

  const handleAdd = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      addToast({ title: 'Error', description: 'Nombre, apellido, email y contrasena son obligatorios', variant: 'error' })
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
      addToast({ title: 'Miembro agregado', description: `${form.firstName} ${form.lastName} se unio al equipo`, variant: 'success' })
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
    roleFilter,
    showAddModal,
    editingAgentId,
    deleteConfirmId,
    form,
    loadingAgents,
    refreshAgents: fetchAgents,
    setSearch,
    setRoleFilter,
    setShowAddModal,
    setEditingAgentId,
    setDeleteConfirmId,
    setForm,
    openAddModal,
    openEditModal,
    handleAdd,
    handleEdit,
    handleDelete,
  }
}
