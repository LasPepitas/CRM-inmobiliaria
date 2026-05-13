import { useState } from 'react'
import { useStore } from '@/store'
import type { Lead } from '@/features/leads/types'
import { useLeadsData } from '@/features/leads/hooks/useLeadsData'
import { LeadsTable } from '@/features/leads/components/LeadsTable'
import { DiscardedLeadsTable } from '@/features/leads/components/DiscardedLeadsTable'
import { NewLeadModal } from '@/features/leads/components/NewLeadModal'
import { ConvertLeadModal } from '@/features/leads/components/ConvertLeadModal'
import { DiscardLeadModal } from '@/features/leads/components/DiscardLeadModal'
import { LeadDetailModal } from '@/features/leads/components/LeadDetailModal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, XCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LeadsPage() {
  const { 
    agents, 
    addLead, 
    updateLead, 
    deleteLead, 
    updateLeadPayment, 
    discardLead, 
    reactivateLead, 
    addToast, 
    addDeal, 
    properties 
  } = useStore()
  
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string[]>([])
  
  const { activeLeads, discardedLeads, filteredLeads } = useLeadsData(search, stageFilter)
  
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const [editingLead, setEditingLead] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [convertingLead, setConvertingLead] = useState<string | null>(null)
  const [discardingLead, setDiscardingLead] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'activos' | 'descartados'>('activos')
  
  const [discardForm, setDiscardForm] = useState({ reason: 'precio', notes: '' })
  const [convertForm, setConvertForm] = useState({
    property_id: '',
    value: 0,
    probability: 30,
    expected_close: '',
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
    name: '',
    email: '',
    phone: '',
    source: 'Web',
    budget: 0,
    notes: '',
    assigned_agent: '1',
    stage: 'Nuevo',
  })

  const getAgentName = (agentId: string) => {
    return agents.find(a => a.id === agentId)?.name || 'Sin asignar'
  }

  const handleSaveLead = () => {
    if (!newLead.name || !newLead.email) {
      addToast({ title: 'Error', description: 'Completá nombre y email', variant: 'error' })
      return
    }
    
    if (editingLead) {
      updateLead(editingLead, newLead)
      addToast({ title: 'Lead actualizado', description: `${newLead.name} fue modificado`, variant: 'success' })
      setEditingLead(null)
    } else {
      addLead({
        ...(newLead as Omit<Lead, 'id'>),
        score: 50,
        last_contact: new Date().toISOString().split('T')[0],
        status: 'Activo',
      })
      addToast({ title: 'Lead creado', description: `${newLead.name} fue agregado`, variant: 'success' })
    }
    
    setShowNewLeadModal(false)
    setNewLead({ name: '', email: '', phone: '', source: 'Web', budget: 0, notes: '', assigned_agent: '1', stage: 'Nuevo' })
  }

  const handleDeleteLead = (id: string) => {
    // Basic confirm logic (in reality, you might want a custom confirm modal)
    if (confirm('¿Estás seguro de eliminar este lead?')) {
      const lead = filteredLeads.find(l => l.id === id) || discardedLeads.find(l => l.id === id)
      deleteLead(id)
      addToast({ title: 'Lead eliminado', description: `${lead?.name} fue eliminado`, variant: 'success' })
    }
  }

  const handleConvertToDeal = () => {
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
    const property = properties.find(p => p.id === convertForm.property_id)
    addDeal({
      property_id: convertForm.property_id,
      lead_id: convertingLead,
      stage: 'Nuevo',
      value: convertForm.value,
      probability: convertForm.probability,
      expected_close: convertForm.expected_close,
      last_update: new Date().toISOString().split('T')[0],
      title: `${property?.title || 'Propiedad'} - ${lead.name}`,
    })
    addToast({ title: '¡Negocio creado!', description: `${lead.name} ahora está en el pipeline`, variant: 'success' })
    setConvertingLead(null)
  }

  const handleDiscard = () => {
    if (!discardingLead) return
    const lead = activeLeads.find(l => l.id === discardingLead)
    discardLead(discardingLead, discardForm.reason, discardForm.notes)
    addToast({ title: 'Lead descartado', description: `${lead?.name} fue marcado como no interesado`, variant: 'default' })
    setDiscardingLead(null)
    setDiscardForm({ reason: 'precio', notes: '' })
  }

  const handleReactivate = (id: string) => {
    const lead = discardedLeads.find(l => l.id === id)
    reactivateLead(id)
    addToast({ title: 'Lead reactivado', description: `${lead?.name} volvió a Activos`, variant: 'success' })
  }

  const handleSavePayment = (id: string) => {
    updateLeadPayment(id, paymentForm)
    addToast({ title: 'Éxito', description: 'Configuración de pago guardada', variant: 'success' })
  }

  const openEditModal = (leadId: string) => {
    const lead = activeLeads.find(l => l.id === leadId)
    if (lead) {
      setNewLead({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        budget: lead.budget,
        notes: lead.notes,
        assigned_agent: lead.assigned_agent,
        stage: lead.stage,
      })
      setEditingLead(leadId)
    }
  }

  const openConvertModal = (leadId: string) => {
    const lead = activeLeads.find(l => l.id === leadId)
    setConvertForm({
      property_id: '',
      value: lead?.budget || 0,
      probability: 30,
      expected_close: '',
    })
    setConvertingLead(leadId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Leads</h1>
          <p className="text-neutral-600 mt-1">{activeLeads.length} leads activos · {discardedLeads.length} descartados</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('activos')}
              className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors', activeTab === 'activos' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700')}
            >
              Activos ({activeLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('descartados')}
              className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5', activeTab === 'descartados' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700')}
            >
              <XCircle className="h-3.5 w-3.5" />
              Descartados ({discardedLeads.length})
            </button>
          </div>
          <Button onClick={() => setShowNewLeadModal(true)}>
            <Plus className="h-4 w-4" />
            Nuevo Lead
          </Button>
        </div>
      </div>

      {activeTab === 'activos' && (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Buscar por nombre o email..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['Nuevo', 'Contactado', 'Visita', 'Negociacion', 'Cierre'].map((stage) => (
                <Button
                  key={stage}
                  variant={stageFilter.includes(stage) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStageFilter(prev => prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage])}
                  className={cn(stageFilter.includes(stage) && "bg-primary text-primary-foreground")}
                >
                  {stage}
                </Button>
              ))}
            </div>
          </div>

          <LeadsTable 
            leads={filteredLeads}
            getAgentName={getAgentName}
            onViewDetail={(id) => setSelectedLead(id)}
            onEdit={openEditModal}
            onConvert={openConvertModal}
            onDiscard={(id) => { setDiscardingLead(id); setDiscardForm({ reason: 'precio', notes: '' }) }}
            onDelete={handleDeleteLead}
          />
        </CardContent>
      </Card>
      )}

      {activeTab === 'descartados' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning-600 shrink-0" />
              <p className="text-sm text-warning-700">
                <strong>{discardedLeads.length} leads descartados.</strong> Sus negocios vinculados fueron marcados como Cancelados. Podés reactivarlos en cualquier momento.
              </p>
            </div>
            
            <DiscardedLeadsTable
              leads={discardedLeads}
              getAgentName={getAgentName}
              onReactivate={handleReactivate}
              onDelete={handleDeleteLead}
            />
          </CardContent>
        </Card>
      )}

      <DiscardLeadModal
        leadId={discardingLead}
        onClose={() => setDiscardingLead(null)}
        form={discardForm}
        setForm={setDiscardForm}
        onConfirm={handleDiscard}
      />

      <ConvertLeadModal
        leadId={convertingLead}
        onClose={() => setConvertingLead(null)}
        form={convertForm}
        setForm={setConvertForm}
        onConfirm={handleConvertToDeal}
      />

      <NewLeadModal
        open={showNewLeadModal || !!editingLead}
        onClose={() => {
          setShowNewLeadModal(false)
          setEditingLead(null)
          setNewLead({ name: '', email: '', phone: '', source: 'Web', budget: 0, notes: '', assigned_agent: '1', stage: 'Nuevo' })
        }}
        form={newLead}
        setForm={setNewLead}
        isEditing={!!editingLead}
        onSave={handleSaveLead}
      />

      <LeadDetailModal
        leadId={selectedLead}
        onClose={() => setSelectedLead(null)}
        paymentForm={paymentForm}
        setPaymentForm={setPaymentForm}
        onSavePayment={handleSavePayment}
      />
    </div>
  )
}
