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
  const { leads, agents, addLead, updateLead, deleteLead, addToast, deals } = useStore()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string[]>([])
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const [editingLead, setEditingLead] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
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

  const filteredLeads = leads.filter(lead => {
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

  const handleConvertToDeal = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    addToast({ title: 'Convirtiendo a negocio', description: `${lead?.name} será vinculado a un negocio`, variant: 'success' })
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Leads</h1>
          <p className="text-neutral-600 mt-1">{leads.length} leads en tu pipeline</p>
        </div>
        <Button onClick={() => setShowNewLeadModal(true)}>
          <Plus className="h-4 w-4" />
          Nuevo Lead
        </Button>
      </div>

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
                <TableHead>Puntuación</TableHead>
                <TableHead>Asignado</TableHead>
                <TableHead>Último Contacto</TableHead>
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
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${lead.score}%` }} />
                      </div>
                      <span className="text-sm font-medium">{lead.score}</span>
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
                  <TableCell className="text-neutral-600">{formatDate(lead.last_contact)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedLead(lead.id)}><Eye className="h-4 w-4 mr-2" />Ver Detalle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(lead.id)}><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleConvertToDeal(lead.id)}><ArrowRightLeft className="h-4 w-4 mr-2" />Convertir a Negocio</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteConfirm(lead.id)} className="text-error-500"><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          {selectedLeadData && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLeadData.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
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
                  <p className="text-sm text-neutral-600">{selectedLeadData.notes || 'Sin notas'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-neutral-500 mb-1">Negocios Relacionados</p>
                  {getLeadDeals(selectedLeadData.id).length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {getLeadDeals(selectedLeadData.id).map(deal => (
                        <div key={deal.id} className="p-3 bg-neutral-50 rounded-md">
                          <p className="text-sm font-medium">{deal.title}</p>
                          <p className="text-xs text-neutral-500">{formatCurrency(deal.value)} • {deal.stage}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-400">Sin negocios vinculados</p>
                  )}
                </div>
              </div>
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
