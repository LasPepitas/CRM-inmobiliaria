import { useState } from 'react'
import { useStore } from '@/store'
import type { Lead } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Plus,
  MoreVertical,
  
  Mail,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  ArrowRightLeft,
  XCircle,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react'
import { cn, formatCurrency, formatDate, getAvatarColor, getInitials } from '@/lib/utils'

const stageColors: Record<string, string> = {
  'Nuevo': 'bg-blue-500',
  'Contactado': 'bg-cyan-500',
  'Visita': 'bg-warning-500',
  'Negociacion': 'bg-orange-500',
  'Cierre': 'bg-success-500',
}

const sourceOptions = ['Web', 'Referido', 'Contacto', 'Redes', 'Expo'] as const
type SourceType = typeof sourceOptions[number]

export function LeadsPage() {
  const { leads, agents, addLead, updateLead, deleteLead, updateLeadPayment, discardLead, reactivateLead, addToast, deals, addDeal, properties } = useStore()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string[]>([])
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const [editingLead, setEditingLead] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [convertingLead, setConvertingLead] = useState<string | null>(null)
  const [discardingLead, setDiscardingLead] = useState<string | null>(null)
  const [discardForm, setDiscardForm] = useState({ reason: 'precio', notes: '' })
  const [activeTab, setActiveTab] = useState<'activos' | 'descartados'>('activos')
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
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Web' as SourceType,
    budget: 0,
    notes: '',
    assigned_agent: '1',
    stage: 'Nuevo' as Lead['stage'],
  })

  const activeLeads = leads.filter(l => l.status === 'Activo')
  const discardedLeads = leads.filter(l => l.status === 'No Interesado' || l.status === 'Pausado')

  const filteredLeads = activeLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
    const matchesStage = stageFilter.length === 0 || stageFilter.includes(lead.stage)
    return matchesSearch && matchesStage
  })

  const editingLeadData = leads.find(l => l.id === editingLead)
  const selectedLeadData = leads.find(l => l.id === selectedLead)

  const getAgentName = (agentId: string) => {
    return agents.find(a => a.id === agentId)?.name || 'Sin asignar'
  }

  const getLeadDeals = (leadId: string) => {
    return deals.filter(d => d.lead_id === leadId)
  }

  const handleAddLead = () => {
    if (!newLead.name || !newLead.email) {
      addToast({ title: 'Error', description: 'Completá nombre y email', variant: 'error' })
      return
    }
    addLead({
      ...newLead,
      score: 50,
      last_contact: new Date().toISOString().split('T')[0],
      status: 'Activo',
    })
    addToast({ title: 'Lead creado', description: `${newLead.name} fue agregado`, variant: 'success' })
    setShowNewLeadModal(false)
    setNewLead({ name: '', email: '', phone: '', source: 'Web', budget: 0, notes: '', assigned_agent: '1', stage: 'Nuevo' })
  }

  const handleUpdateLead = () => {
    if (!editingLeadData || !editingLead) return
    updateLead(editingLead, newLead)
    addToast({ title: 'Lead actualizado', description: `${newLead.name} fue modificado`, variant: 'success' })
    setEditingLead(null)
    setNewLead({ name: '', email: '', phone: '', source: 'Web', budget: 0, notes: '', assigned_agent: '1', stage: 'Nuevo' })
  }

  const handleDeleteLead = () => {
    if (!deleteConfirm) return
    const lead = leads.find(l => l.id === deleteConfirm)
    deleteLead(deleteConfirm)
    addToast({ title: 'Lead eliminado', description: `${lead?.name} fue eliminado`, variant: 'success' })
    setDeleteConfirm(null)
  }

  const openConvertModal = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    setConvertForm({
      property_id: '',
      value: lead?.budget || 0,
      probability: 30,
      expected_close: '',
    })
    setConvertingLead(leadId)
  }

  const handleConvertToDeal = () => {
    if (!convertingLead) return
    const lead = leads.find(l => l.id === convertingLead)
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

  const openEditModal = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
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

  const handleDiscard = () => {
    if (!discardingLead) return
    const lead = leads.find(l => l.id === discardingLead)
    discardLead(discardingLead, discardForm.reason, discardForm.notes)
    addToast({ title: 'Lead descartado', description: `${lead?.name} fue marcado como no interesado`, variant: 'default' })
    setDiscardingLead(null)
    setDiscardForm({ reason: 'precio', notes: '' })
  }

  const handleReactivate = (id: string) => {
    const lead = leads.find(l => l.id === id)
    reactivateLead(id)
    addToast({ title: 'Lead reactivado', description: `${lead?.name} volvió a Activos`, variant: 'success' })
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

      {/* Vista Activos */}
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
                  className={cn(stageFilter.includes(stage) && "bg-primary")}
                >
                  {stage}
                </Button>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contacto</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Asignado</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold", getAvatarColor(lead.name).bg, getAvatarColor(lead.name).text)}>
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{lead.source}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", stageColors[lead.stage])} />
                      <span className="text-sm">{lead.stage}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {getAgentName(lead.assigned_agent).split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm">{getAgentName(lead.assigned_agent)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-600">{lead.phone}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedLead(lead.id)}><Eye className="h-4 w-4 mr-2" />Ver Detalle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(lead.id)}><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openConvertModal(lead.id)}><ArrowRightLeft className="h-4 w-4 mr-2" />Convertir a Negocio</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => { setDiscardingLead(lead.id); setDiscardForm({ reason: 'precio', notes: '' }) }}
                          className="text-warning-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />Marcar No Interesado
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteConfirm(lead.id)} className="text-error-500"><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLeads.length === 0 && (
                <TableRow><TableCell colSpan={6} className="h-24 text-center text-neutral-400">No hay leads activos</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}

      {/* Vista Descartados */}
      {activeTab === 'descartados' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning-600 shrink-0" />
              <p className="text-sm text-warning-700">
                <strong>{discardedLeads.length} leads descartados.</strong> Sus negocios vinculados fueron marcados como Cancelados. Podés reactivarlos en cualquier momento.
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Etapa Alcanzada</TableHead>
                  <TableHead>Motivo Descarte</TableHead>
                  <TableHead>Fecha Descarte</TableHead>
                  <TableHead>Asesor</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discardedLeads.map(lead => (
                  <TableRow key={lead.id} className="opacity-75">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-500">
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-600">{lead.name}</p>
                          <p className="text-xs text-neutral-400">{lead.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", stageColors[lead.stage])} />
                        <span className="text-sm text-neutral-500">{lead.stage}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-warning-600 border-warning-300 bg-warning-50">
                        {{
                          'precio': 'Precio elevado',
                          'otra_agencia': 'Otra agencia',
                          'no_responde': 'Sin respuesta',
                          'cambio_planes': 'Cambio de planes',
                          'zona': 'No le convence la zona',
                          'otro': 'Otro motivo'
                        }[lead.discard_reason || 'otro'] || lead.discard_reason}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-500 text-sm">{lead.discarded_at ? formatDate(lead.discarded_at) : '-'}</TableCell>
                    <TableCell className="text-neutral-500 text-sm">{getAgentName(lead.assigned_agent)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReactivate(lead.id)}
                          className="text-success-600 border-success-300 hover:bg-success-50 text-xs"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reactivar
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(lead.id)}
                          className="text-neutral-400 hover:text-error-500 h-8 w-8"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {discardedLeads.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center text-neutral-400">No hay leads descartados</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {/* Discard Lead Modal */}
      <Dialog open={!!discardingLead} onOpenChange={(open) => !open && setDiscardingLead(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-warning-600" />
              Marcar como No Interesado
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg text-sm text-warning-700">
              <strong>{leads.find(l => l.id === discardingLead)?.name}</strong> será removido del pipeline activo y sus negocios vinculados pasarán a <strong>Cancelado</strong>.
            </div>
            <div>
              <label className="text-sm font-medium">Motivo del descarte *</label>
              <select
                className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                value={discardForm.reason}
                onChange={e => setDiscardForm({ ...discardForm, reason: e.target.value })}
              >
                <option value="precio">Precio elevado para el cliente</option>
                <option value="otra_agencia">Compró/alquiló con otra agencia</option>
                <option value="no_responde">Sin respuesta después de varios contactos</option>
                <option value="cambio_planes">El cliente cambió de planes</option>
                <option value="zona">No le conviene la zona/barrio</option>
                <option value="otro">Otro motivo</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Notas adicionales (opcional)</label>
              <Input
                value={discardForm.notes}
                onChange={e => setDiscardForm({ ...discardForm, notes: e.target.value })}
                placeholder="Ej: Volvió a contactarnos en 6 meses..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiscardingLead(null)}>Cancelar</Button>
            <Button
              onClick={handleDiscard}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Confirmar Descarte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => {
        if (!open) setSelectedLead(null)
        else {
          const l = leads.find(x => x.id === selectedLead)
          if (l?.payment_config) setPaymentForm({ ...paymentForm, ...l.payment_config })
        }
      }}>
        <DialogContent className="max-w-xl">
          {selectedLeadData && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLeadData.name}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Información General</TabsTrigger>
                  <TabsTrigger value="payment">Config. de Pago</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-neutral-500 mb-1">Email</p>
                      <p className="font-medium">{selectedLeadData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-neutral-500 mb-1">Teléfono</p>
                      <p className="font-medium">{selectedLeadData.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-neutral-500 mb-1">Fuente</p>
                      <Badge variant="outline">{selectedLeadData.source}</Badge>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-neutral-500 mb-1">Etapa</p>
                      <Badge variant="default">{selectedLeadData.stage}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-neutral-500 mb-1">Presupuesto</p>
                      <p className="font-medium">{formatCurrency(selectedLeadData.budget)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-neutral-500 mb-1">Score</p>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${selectedLeadData.score}%` }} />
                        </div>
                        <span className="font-medium">{selectedLeadData.score}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-neutral-500 mb-1">Notas</p>
                    <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md">{selectedLeadData.notes || 'Sin notas'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-neutral-500 mb-1">Negocios Relacionados</p>
                    {getLeadDeals(selectedLeadData.id).length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {getLeadDeals(selectedLeadData.id).map(deal => (
                          <div key={deal.id} className="p-3 bg-neutral-50 rounded-md flex justify-between items-center">
                            <p className="text-sm font-medium">{deal.title}</p>
                            <p className="text-xs text-neutral-500">{formatCurrency(deal.value)} • {deal.stage}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-400">Sin negocios vinculados</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium">Tipo de Pago</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                      value={paymentForm.type}
                      onChange={e => setPaymentForm({ ...paymentForm, type: e.target.value as any })}
                    >
                      <option value="contado">Contado</option>
                      <option value="cuotas">En Cuotas</option>
                      <option value="hipoteca">Crédito Hipotecario</option>
                    </select>
                  </div>
                  
                  {paymentForm.type === 'cuotas' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Enganche / Adelanto</label>
                        <Input
                          type="number"
                          value={paymentForm.down_payment || ''}
                          onChange={e => setPaymentForm({ ...paymentForm, down_payment: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Cantidad de Cuotas</label>
                        <Input
                          type="number"
                          value={paymentForm.installments || ''}
                          onChange={e => setPaymentForm({ ...paymentForm, installments: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Monto Mensual</label>
                        <Input
                          type="number"
                          value={paymentForm.monthly || ''}
                          onChange={e => setPaymentForm({ ...paymentForm, monthly: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {paymentForm.type === 'hipoteca' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Banco / Entidad</label>
                        <Input
                          value={paymentForm.bank || ''}
                          onChange={e => setPaymentForm({ ...paymentForm, bank: e.target.value })}
                          className="mt-1"
                          placeholder="Ej: Banco Nación"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Enganche Aportado</label>
                        <Input
                          type="number"
                          value={paymentForm.down_payment || ''}
                          onChange={e => setPaymentForm({ ...paymentForm, down_payment: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium">Notas Adicionales (Pago)</label>
                    <Input
                      value={paymentForm.notes || ''}
                      onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      className="mt-1"
                      placeholder="Ej: Aprobación pre-acordada..."
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button onClick={() => {
                      updateLeadPayment(selectedLeadData.id, paymentForm)
                      addToast({ title: 'Configuración guardada', description: 'Plan de pago actualizado', variant: 'success' })
                    }}>
                      Guardar Configuración
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Lead Dialog */}
      <Dialog open={showNewLeadModal} onOpenChange={setShowNewLeadModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo Lead</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nombre Completo *</label>
              <Input placeholder="Juan Pérez" value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input type="email" placeholder="juan@email.com" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input placeholder="+54 11 4567-8900" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Fuente</label>
                <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value as SourceType })}>
                  {sourceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Presupuesto</label>
                <Input type="number" placeholder="0" value={newLead.budget || ''} onChange={(e) => setNewLead({ ...newLead, budget: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Notas</label>
              <Input placeholder="Información adicional..." value={newLead.notes} onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewLeadModal(false)}>Cancelar</Button>
            <Button onClick={handleAddLead}><UserPlus className="h-4 w-4 mr-2" />Crear Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Lead</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Etapa</label>
                <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" value={newLead.stage} onChange={(e) => setNewLead({ ...newLead, stage: e.target.value as Lead['stage'] })}>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Contactado">Contactado</option>
                  <option value="Visita">Visita</option>
                  <option value="Negociacion">Negociación</option>
                  <option value="Cierre">Cierre</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Presupuesto</label>
                <Input type="number" value={newLead.budget || ''} onChange={(e) => setNewLead({ ...newLead, budget: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Notas</label>
              <Input value={newLead.notes} onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLead(null)}>Cancelar</Button>
            <Button onClick={handleUpdateLead}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Deal Dialog */}
      <Dialog open={!!convertingLead} onOpenChange={() => setConvertingLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Convertir a Negocio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-neutral-50 rounded-lg border border-outline-variant">
              <p className="text-xs text-neutral-500 uppercase mb-1">Lead</p>
              <p className="font-medium">{leads.find(l => l.id === convertingLead)?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Propiedad de Interés *</label>
              <select
                className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                value={convertForm.property_id}
                onChange={(e) => setConvertForm({ ...convertForm, property_id: e.target.value })}
              >
                <option value="">Seleccionar propiedad...</option>
                {properties.filter(p => p.status !== 'Vendido').map(p => (
                  <option key={p.id} value={p.id}>{p.title} — {p.neighborhood}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Valor Estimado ($)</label>
                <Input
                  type="number"
                  value={convertForm.value || ''}
                  onChange={(e) => setConvertForm({ ...convertForm, value: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Probabilidad (%)</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={convertForm.probability}
                  onChange={(e) => setConvertForm({ ...convertForm, probability: Math.min(100, Math.max(0, Number(e.target.value))) })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Fecha Estimada de Cierre *</label>
              <Input
                type="date"
                value={convertForm.expected_close}
                onChange={(e) => setConvertForm({ ...convertForm, expected_close: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertingLead(null)}>Cancelar</Button>
            <Button onClick={handleConvertToDeal}>
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Crear Negocio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>¿Eliminar lead?</DialogTitle></DialogHeader>
          <p className="text-neutral-600 py-4">Esta acción eliminará el lead y todos sus datos asociados. Los negocios vinculados serán desacoplados.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteLead}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
