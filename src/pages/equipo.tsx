import { useState } from 'react'
import { useStore } from '@/store'
import type { Agent } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Building2,
  TrendingUp,
  DollarSign,
  Mail,
  Phone,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  IdCard,
  Search,
} from 'lucide-react'
import { formatCurrency, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

const roleColors: Record<string, 'default' | 'warning' | 'secondary'> = {
  'Gerente': 'warning',
  'Asesor Senior': 'default',
  'Asesor': 'secondary',
}

const roleGradients: Record<string, string> = {
  'Gerente': 'from-warning-500/20 to-warning-500/5',
  'Asesor Senior': 'from-primary/20 to-primary/5',
  'Asesor': 'from-secondary/20 to-secondary/5',
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  dni: '',
  role: 'Asesor' as Agent['role'],
}

export function EquipoPage() {
  const { agents, leads, deals, addAgent, updateAgent, deleteAgent, addToast } = useStore()

  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const filteredAgents = agents.filter(a =>
    !search ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  )

  const getAgentMetrics = (agentId: string) => {
    const agentDeals = deals.filter(d => {
      const lead = leads.find(l => l.id === d.lead_id)
      return lead?.assigned_agent === agentId
    })
    const activeDeals = agentDeals.filter(d => d.stage !== 'Cierre').length
    const totalValue = agentDeals.reduce((sum, d) => sum + d.value, 0)
    const agentLeads = leads.filter(l => l.assigned_agent === agentId).length
    return { activeDeals, totalValue, agentLeads }
  }

  const openAddModal = () => {
    setForm(emptyForm)
    setShowAddModal(true)
  }

  const openEditModal = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    if (agent) {
      setForm({
        name: agent.name,
        email: agent.email,
        phone: agent.phone || '',
        dni: agent.dni || '',
        role: agent.role,
      })
      setEditingAgent(agentId)
    }
  }

  const handleAdd = () => {
    if (!form.name || !form.email) {
      addToast({ title: 'Error', description: 'Nombre y email son obligatorios', variant: 'error' })
      return
    }
    addAgent({
      ...form,
      active_deals: 0,
      closed_deals: 0,
      revenue: 0,
    })
    addToast({ title: 'Miembro agregado', description: `${form.name} se unió al equipo`, variant: 'success' })
    setShowAddModal(false)
    setForm(emptyForm)
  }

  const handleEdit = () => {
    if (!editingAgent) return
    if (!form.name || !form.email) {
      addToast({ title: 'Error', description: 'Nombre y email son obligatorios', variant: 'error' })
      return
    }
    updateAgent(editingAgent, form)
    addToast({ title: 'Miembro actualizado', description: `${form.name} fue modificado`, variant: 'success' })
    setEditingAgent(null)
    setForm(emptyForm)
  }

  const handleDelete = () => {
    if (!deleteConfirm) return
    const agent = agents.find(a => a.id === deleteConfirm)
    deleteAgent(deleteConfirm)
    addToast({ title: 'Miembro eliminado', description: `${agent?.name} fue removido del equipo`, variant: 'success' })
    setDeleteConfirm(null)
  }

  // Team summary stats
  const totalRevenue = agents.reduce((sum, a) => sum + a.revenue, 0)
  const totalActiveDeals = agents.reduce((sum, a) => sum + a.active_deals, 0)
  const totalClosed = agents.reduce((sum, a) => sum + a.closed_deals, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Equipo</h1>
          <p className="text-neutral-600 mt-1">{agents.length} miembros en tu equipo</p>
        </div>
        <Button onClick={openAddModal}>
          <UserPlus className="h-4 w-4" />
          Agregar Miembro
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-5">
            <p className="text-xs uppercase text-neutral-500 mb-1">Ingresos Totales</p>
            <p className="text-2xl font-bold font-heading text-primary">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning-500/10 to-warning-500/5">
          <CardContent className="p-5">
            <p className="text-xs uppercase text-neutral-500 mb-1">Negocios Activos</p>
            <p className="text-2xl font-bold font-heading text-warning-500">{totalActiveDeals}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success-500/10 to-success-500/5">
          <CardContent className="p-5">
            <p className="text-xs uppercase text-neutral-500 mb-1">Cierres Totales</p>
            <p className="text-2xl font-bold font-heading text-success-500">{totalClosed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Buscar por nombre, email o rol..."
          className="pl-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => {
          const metrics = getAgentMetrics(agent.id)

          return (
            <Card
              key={agent.id}
              className="hover:shadow-card-hover transition-all duration-150 group"
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={cn(
                    "h-14 w-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-primary shrink-0",
                    roleGradients[agent.role]
                  )}>
                    {getInitials(agent.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold font-heading truncate">{agent.name}</h3>
                      <Badge variant={roleColors[agent.role]} className="shrink-0">{agent.role}</Badge>
                    </div>
                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                      {agent.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span>{agent.phone}</span>
                        </div>
                      )}
                      {agent.dni && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <IdCard className="h-3 w-3 shrink-0" />
                          <span>DNI {agent.dni}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[10px] uppercase text-neutral-500 font-medium">Negocios Activos</span>
                    </div>
                    <p className="text-xl font-bold font-heading">{metrics.activeDeals}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="h-3.5 w-3.5 text-success-500" />
                      <span className="text-[10px] uppercase text-neutral-500 font-medium">Cerrados</span>
                    </div>
                    <p className="text-xl font-bold font-heading">{agent.closed_deals}</p>
                  </div>

                  <div className="col-span-2 p-3 rounded-lg bg-primary/5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <DollarSign className="h-3.5 w-3.5 text-secondary" />
                      <span className="text-[10px] uppercase text-neutral-500 font-medium">Ingresos Totales</span>
                    </div>
                    <p className="text-xl font-bold font-heading text-primary">{formatCurrency(agent.revenue)}</p>
                  </div>
                </div>

                {/* Leads badge */}
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/50">
                  <span className="text-xs text-neutral-400">
                    {metrics.agentLeads} leads asignados
                  </span>
                  {/* Action buttons — visible on hover */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-primary"
                      onClick={() => openEditModal(agent.id)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-error-500"
                      onClick={() => setDeleteConfirm(agent.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredAgents.length === 0 && (
          <div className="col-span-3 py-16 text-center text-neutral-400">
            <Avatar className="h-16 w-16 mx-auto mb-4">
              <AvatarFallback className="text-2xl bg-neutral-100">?</AvatarFallback>
            </Avatar>
            <p className="font-medium text-neutral-500">No hay miembros que coincidan</p>
          </div>
        )}
      </div>

      {/* ─── Add Modal ─── */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar Miembro al Equipo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nombre Completo *</label>
              <Input
                placeholder="Juan Pérez"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                placeholder="juan.perez@inmobiliaria.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  type="tel"
                  placeholder="+54 11 4567-8900"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">DNI</label>
                <Input
                  placeholder="12.345.678"
                  value={form.dni}
                  onChange={e => setForm({ ...form, dni: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Rol</label>
              <select
                className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value as Agent['role'] })}
              >
                <option value="Gerente">Gerente</option>
                <option value="Asesor Senior">Asesor Senior</option>
                <option value="Asesor">Asesor</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancelar</Button>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Modal ─── */}
      <Dialog open={!!editingAgent} onOpenChange={() => setEditingAgent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Miembro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nombre Completo *</label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">DNI</label>
                <Input
                  value={form.dni}
                  onChange={e => setForm({ ...form, dni: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Rol</label>
              <select
                className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value as Agent['role'] })}
              >
                <option value="Gerente">Gerente</option>
                <option value="Asesor Senior">Asesor Senior</option>
                <option value="Asesor">Asesor</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAgent(null)}>Cancelar</Button>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirm ─── */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar miembro?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {(() => {
              const agent = agents.find(a => a.id === deleteConfirm)
              const metrics = agent ? getAgentMetrics(agent.id) : null
              return (
                <div className="space-y-3">
                  <p className="text-neutral-600">
                    Estás por eliminar a <span className="font-semibold">{agent?.name}</span> del equipo.
                  </p>
                  {metrics && (metrics.activeDeals > 0 || metrics.agentLeads > 0) && (
                    <div className="p-3 rounded-lg bg-warning-500/10 border border-warning-500/30 text-sm text-warning-600">
                      ⚠️ Este miembro tiene <strong>{metrics.activeDeals}</strong> negocios activos y <strong>{metrics.agentLeads}</strong> leads asignados. Al eliminarlo, quedarán sin asesor.
                    </div>
                  )}
                  <p className="text-sm text-neutral-400">Esta acción no se puede deshacer.</p>
                </div>
              )
            })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
