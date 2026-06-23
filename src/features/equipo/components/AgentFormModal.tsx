import type { AgentFormData } from '../types'
import { AGENT_ROLES } from '../types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Plus } from 'lucide-react'

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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                id="agent-firstname"
                placeholder="Juan"
                value={form.firstName}
                onChange={e => field('firstName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Apellido *</label>
              <Input
                id="agent-lastname"
                placeholder="Pérez"
                value={form.lastName}
                onChange={e => field('lastName', e.target.value)}
                className="mt-1"
              />
            </div>
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
          {!isEdit && (
            <div>
              <label className="text-sm font-medium">Contraseña *</label>
              <Input
                id="agent-password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.password || ''}
                onChange={e => field('password', e.target.value)}
                className="mt-1"
              />
            </div>
          )}
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
            <Select value={form.role} onValueChange={v => field('role', v)}>
              <SelectTrigger id="agent-role" className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AGENT_ROLES.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onSave}>
            {isEdit ? (
              <>
                <Edit className="h-4 w-4 mr-2" /> Guardar Cambios
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> Agregar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
