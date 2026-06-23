import { useState } from 'react'
import { useStore } from '@/store'
import type { Lead } from '@/features/leads/types'
import { useLeadsData } from './useLeadsData'
import { LeadsService } from '../services/LeadsService'

export function useLeads() {
  const {
    agents,
    addLead,
    updateLead,
    deleteLead,
    updateLeadPayment,
    discardLead,
    reactivateLead,
    addToast
  } = useStore()

  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string[]>([])

  const { activeLeads, discardedLeads, filteredLeads, loadingLeads, refresh } = useLeadsData(search, stageFilter)

  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const [editingLead, setEditingLead] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [convertingLead, setConvertingLead] = useState<string | null>(null)
  const [discardingLead, setDiscardingLead] = useState<string | null>(null)
  const [deletingLead, setDeletingLead] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'activos' | 'descartados'>('activos')

  const [discardForm, setDiscardForm] = useState({ reason: 'precio', notes: '' })
  const [convertForm, setConvertForm] = useState({
    property_id: '',
    value: 0,
    probability: 30,
    expected_close: '',
    stage: 'NUEVO'
  })
  const [paymentForm, setPaymentForm] = useState({
    type: 'contado' as 'contado' | 'cuotas' | 'hipoteca',
    installments: 12,
    down_payment: 0,
    monthly: 0,
    bank: '',
    notes: ''
  })
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: 'Web',
    budget: 0,
    notes: '',
    assigned_agent: '1',
    stage: 'NUEVO',
    score: 50,
  })

  const getAgentName = (agentId: string) =>
    agents.find(a => a.id === agentId)?.name || 'Sin asignar'

  const handleSaveLead = async () => {
    if (!newLead.firstName || !newLead.lastName || !newLead.email) {
      addToast({ title: 'Error', description: 'Completá nombre, apellido y email', variant: 'error' })
      return
    }
    try {
      if (editingLead) {
        await updateLead(editingLead, newLead)
        addToast({ title: 'Lead actualizado', description: `${newLead.firstName} ${newLead.lastName} fue modificado`, variant: 'success' })
        setEditingLead(null)
      } else {
        await addLead({
          ...(newLead as Omit<Lead, 'id'>),
          score: newLead.score || 50,
          last_contact: new Date().toISOString().split('T')[0],
          status: 'Activo',
        })
        addToast({ title: 'Lead creado', description: `${newLead.firstName} ${newLead.lastName} fue agregado`, variant: 'success' })
      }
      setShowNewLeadModal(false)
      setNewLead({ firstName: '', lastName: '', email: '', phone: '', source: 'Web', budget: 0, notes: '', assigned_agent: '1', stage: 'NUEVO', score: 50 })
    } catch {
      addToast({ title: 'Error', description: 'Hubo un problema al guardar el lead', variant: 'error' })
    }
  }

  const confirmDelete = (id: string) => {
    setDeletingLead(id)
  }

  const handleDeleteLead = async () => {
    if (!deletingLead) return
    const id = deletingLead
    const lead = filteredLeads.find(l => l.id === id) || discardedLeads.find(l => l.id === id)
    try {
      await deleteLead(id)
      addToast({ title: 'Lead eliminado', description: `${lead?.firstName} ${lead?.lastName} fue eliminado`, variant: 'success' })
      setDeletingLead(null)
    } catch {
      addToast({ title: 'Error', description: 'Hubo un problema al eliminar el lead', variant: 'error' })
    }
  }

  const handleConvertToDeal = async () => {
    if (!convertingLead) return
    const lead = activeLeads.find(l => l.id === convertingLead)
    if (!lead) return
    if (!convertForm.property_id) {
      addToast({ title: 'Error', description: 'Seleccioná una propiedad', variant: 'error' })
      return
    }
    if (!convertForm.expected_close) {
      addToast({ title: 'Error', description: 'Ingresá una fecha de cierre estimada', variant: 'error' })
      return
    }
    try {
      await LeadsService.convertToDeal(convertingLead, {
        property_id: convertForm.property_id,
        value: convertForm.value,
        probability: convertForm.probability,
        expected_close: convertForm.expected_close,
        stage: convertForm.stage,
      })
      addToast({ title: '¡Negocio creado!', description: `${lead.firstName} ${lead.lastName} ahora está en el pipeline`, variant: 'success' })
      setConvertingLead(null)
      if (refresh) refresh()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      addToast({ title: 'Error al convertir', description: error.response?.data?.message || 'Hubo un problema al convertir el lead', variant: 'error' })
    }
  }

  const handleDiscard = async () => {
    if (!discardingLead) return
    const lead = activeLeads.find(l => l.id === discardingLead)
    try {
      await discardLead(discardingLead, discardForm.reason, discardForm.notes)
      addToast({ title: 'Lead descartado', description: `${lead?.firstName} ${lead?.lastName} fue marcado como no interesado`, variant: 'default' })
      setDiscardingLead(null)
      setDiscardForm({ reason: 'precio', notes: '' })
    } catch {
      addToast({ title: 'Error', description: 'Hubo un problema al descartar el lead', variant: 'error' })
    }
  }

  const handleReactivate = async (id: string) => {
    const lead = discardedLeads.find(l => l.id === id)
    try {
      await reactivateLead(id)
      addToast({ title: 'Lead reactivado', description: `${lead?.firstName} ${lead?.lastName} volvió a Activos`, variant: 'success' })
    } catch {
      addToast({ title: 'Error', description: 'Hubo un problema al reactivar el lead', variant: 'error' })
    }
  }

  const handleSavePayment = async (id: string) => {
    try {
      await updateLeadPayment(id, paymentForm)
      addToast({ title: 'Éxito', description: 'Configuración de pago guardada', variant: 'success' })
    } catch {
      addToast({ title: 'Error', description: 'Hubo un problema al guardar el pago', variant: 'error' })
    }
  }

  const openEditModal = (leadId: string) => {
    const lead = activeLeads.find(l => l.id === leadId)
    if (lead) {
      setNewLead({ firstName: lead.firstName, lastName: lead.lastName, email: lead.email, phone: lead.phone, source: lead.source, budget: lead.budget, notes: lead.notes, assigned_agent: lead.assigned_agent, stage: lead.stage, score: lead.score })
      setEditingLead(leadId)
    }
  }

  const openConvertModal = (leadId: string) => {
    const lead = activeLeads.find(l => l.id === leadId)
    setConvertForm({ property_id: '', value: lead?.budget || 0, probability: 30, expected_close: '', stage: 'NUEVO' })
    setConvertingLead(leadId)
  }

  const resetNewLeadForm = () => {
    setNewLead({ firstName: '', lastName: '', email: '', phone: '', source: 'Web', budget: 0, notes: '', assigned_agent: '1', stage: 'NUEVO', score: 50 })
  }

  return {
    activeLeads, discardedLeads, filteredLeads, loadingLeads,
    search, setSearch,
    stageFilter, setStageFilter,
    showNewLeadModal, setShowNewLeadModal,
    editingLead, setEditingLead,
    selectedLead, setSelectedLead,
    convertingLead, setConvertingLead,
    discardingLead, setDiscardingLead,
    deletingLead, setDeletingLead,
    activeTab, setActiveTab,
    discardForm, setDiscardForm,
    convertForm, setConvertForm,
    paymentForm, setPaymentForm,
    newLead, setNewLead,
    getAgentName,
    handleSaveLead, handleDeleteLead, confirmDelete, handleConvertToDeal,
    handleDiscard, handleReactivate, handleSavePayment,
    openEditModal, openConvertModal,
    resetNewLeadForm,
  }
}
