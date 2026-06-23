import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { sourceOptions, stageOptions } from '../constants'
import type { Lead, LeadSource } from '../types'
import { useAgents } from '@/features/equipo'

interface LeadFormModalProps {
  open: boolean
  onClose: () => void
  form: Partial<Lead>
  setForm: (form: Partial<Lead>) => void
  isEditing: boolean
  onSave: () => void
}

export function LeadFormModal({ open, onClose, form, setForm, isEditing, onSave }: LeadFormModalProps) {
  const { agents } = useAgents()

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Lead' : 'Nuevo Lead'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                value={form.firstName || ''}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                placeholder="Ej: Juan"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Apellido *</label>
              <Input
                value={form.lastName || ''}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                placeholder="Ej: Pérez"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                value={form.email || ''}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="juan@mail.com"
                type="email"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Teléfono</label>
              <Input
                value={form.phone || ''}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+51 965..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Origen</label>
              <Select value={form.source} onValueChange={(val: LeadSource) => setForm({ ...form, source: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Origen" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map(src => (
                    <SelectItem key={src} value={src}>{src}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Presupuesto ($)</label>
              <Input
                type="number"
                value={form.budget || ''}
                onChange={e => setForm({ ...form, budget: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Asesor Asignado</label>
              <Select value={form.assigned_agent} onValueChange={(val) => setForm({ ...form, assigned_agent: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar asesor" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Etapa</label>
              <Select value={form.stage} onValueChange={(val: Lead['stage']) => setForm({ ...form, stage: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Etapa" />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map(stg => (
                    <SelectItem key={stg} value={stg}>{stg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Score (0-100)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={form.score || ''}
                onChange={e => setForm({ ...form, score: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Notas iniciales</label>
            <Input
              value={form.notes || ''}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="¿Qué está buscando el cliente?"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onSave}>{isEditing ? 'Guardar Cambios' : 'Crear Lead'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
