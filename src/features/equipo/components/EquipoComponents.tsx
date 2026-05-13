import type { Agent } from '@/store/slices/agentsSlice'
import type { AgentFormData } from '../types'
import { AGENT_ROLES } from '../types'
import { roleColors, roleGradients } from '../constants'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Building2, TrendingUp, DollarSign, Mail, Phone, Edit, Trash2, Plus, IdCard,
} from 'lucide-react'
import { cn, formatCurrency, getInitials } from '@/lib/utils'

// ─── AGENT CARD ──────────────────────────────────────────────────────────────

interface AgentMetrics { activeDeals: number; totalValue: number; agentLeads: number }

interface AgentCardProps {
  agent: Agent
  metrics: AgentMetrics
  onEdit: (agent: Agent) => void
  onDelete: (id: string) => void
}

export function AgentCard({ agent, metrics, onEdit, onDelete }: AgentCardProps) {
  return (
    <Card className="hover:shadow-card-hover transition-all duration-150 group">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className={cn(
            'h-14 w-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-primary shrink-0',
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/50">
          <span className="text-xs text-neutral-400">{metrics.agentLeads} leads asignados</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 text-neutral-400 hover:text-primary"
              onClick={() => onEdit(agent)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 text-neutral-400 hover:text-error-500"
              onClick={() => onDelete(agent.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── AGENT FORM MODAL (Add + Edit) ───────────────────────────────────────────

interface AgentFormModalProps {
  open: boolean
  isEdit?: boolean
  form: AgentFormData
  onFormChange: (form: AgentFormData) => void
  onSave: () => void
  onCancel: () => void
}

export function AgentFormModal({ open, isEdit = false, form, onFormChange, onSave, onCancel }: AgentFormModalProps) {
  const field = <K extends keyof AgentFormData>(key: K, value: AgentFormData[K]) =>
    onFormChange({ ...form, [key]: value })

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Miembro' : 'Agregar Miembro al Equipo'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Nombre Completo *</label>
            <Input
              id="agent-name"
              placeholder="Juan Pérez"
              value={form.name}
              onChange={e => field('name', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email *</label>
            <Input
              id="agent-email"
              type="email"
              placeholder="juan.perez@inmobiliaria.com"
              value={form.email}
              onChange={e => field('email', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Teléfono</label>
              <Input
                id="agent-phone"
                type="tel"
                placeholder="+54 11 4567-8900"
                value={form.phone}
                onChange={e => field('phone', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">DNI</label>
              <Input
                id="agent-dni"
                placeholder="12.345.678"
                value={form.dni}
                onChange={e => field('dni', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Rol</label>
            <Select value={form.role} onValueChange={v => field('role', v as AgentFormData['role'])}>
              <SelectTrigger id="agent-role" className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AGENT_ROLES.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onSave}>
            {isEdit ? <><Edit className="h-4 w-4 mr-2" /> Guardar Cambios</> : <><Plus className="h-4 w-4 mr-2" /> Agregar</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── DELETE CONFIRM DIALOG ───────────────────────────────────────────────────

interface DeleteAgentDialogProps {
  open: boolean
  agentName?: string
  activeDeals: number
  agentLeads: number
  onClose: () => void
  onConfirm: () => void
}

export function DeleteAgentDialog({ open, agentName, activeDeals, agentLeads, onClose, onConfirm }: DeleteAgentDialogProps) {
  const hasWarning = activeDeals > 0 || agentLeads > 0
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>¿Eliminar miembro?</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <p className="text-neutral-600">
            Estás por eliminar a <span className="font-semibold">{agentName}</span> del equipo.
          </p>
          {hasWarning && (
            <div className="p-3 rounded-lg bg-warning-500/10 border border-warning-500/30 text-sm text-warning-600">
              ⚠️ Este miembro tiene <strong>{activeDeals}</strong> negocios activos y <strong>{agentLeads}</strong> leads asignados. Al eliminarlo, quedarán sin asesor.
            </div>
          )}
          <p className="text-sm text-neutral-400">Esta acción no se puede deshacer.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Eliminar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

export function AgentEmptyState() {
  return (
    <div className="col-span-3 py-16 text-center text-neutral-400">
      <Avatar className="h-16 w-16 mx-auto mb-4">
        <AvatarFallback className="text-2xl bg-neutral-100">?</AvatarFallback>
      </Avatar>
      <p className="font-medium text-neutral-500">No hay miembros que coincidan</p>
    </div>
  )
}
