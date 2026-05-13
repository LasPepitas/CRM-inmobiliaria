import type { Property } from '@/store/slices/propertiesSlice'
import type { Lead } from '@/features/leads/types'
import type { Agent } from '@/store/slices/agentsSlice'
import type { NewVisitForm } from '../types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from 'lucide-react'

interface NewVisitModalProps {
  open: boolean
  form: NewVisitForm
  properties: Property[]
  leads: Lead[]
  agents: Agent[]
  onFormChange: (form: NewVisitForm) => void
  onSave: () => void
  onCancel: () => void
}

export function NewVisitModal({
  open,
  form,
  properties,
  leads,
  agents,
  onFormChange,
  onSave,
  onCancel,
}: NewVisitModalProps) {
  const field = <K extends keyof NewVisitForm>(key: K, value: NewVisitForm[K]) =>
    onFormChange({ ...form, [key]: value })

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Programar Visita</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Propiedad *</label>
            <Select value={form.property_id || '__none__'} onValueChange={v => field('property_id', v === '__none__' ? '' : v)}>
              <SelectTrigger id="visit-property" className="w-full mt-1">
                <SelectValue placeholder="Seleccionar propiedad..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Seleccionar propiedad...</SelectItem>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title} — {p.neighborhood}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Lead (Cliente) *</label>
            <Select value={form.lead_id || '__none__'} onValueChange={v => field('lead_id', v === '__none__' ? '' : v)}>
              <SelectTrigger id="visit-lead" className="w-full mt-1">
                <SelectValue placeholder="Seleccionar cliente..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Seleccionar cliente...</SelectItem>
                {leads.map(l => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Fecha *</label>
              <Input
                id="visit-date"
                type="date"
                value={form.date}
                onChange={e => field('date', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hora *</label>
              <Input
                id="visit-time"
                type="time"
                value={form.time}
                onChange={e => field('time', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Asesor Responsable</label>
            <Select value={form.agent || '__none__'} onValueChange={v => field('agent', v === '__none__' ? '' : v)}>
              <SelectTrigger id="visit-agent" className="w-full mt-1">
                <SelectValue placeholder="Sin asignar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sin asignar</SelectItem>
                {agents.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name} — {a.role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Notas</label>
            <Input
              id="visit-notes"
              placeholder="Observaciones sobre la visita..."
              value={form.notes}
              onChange={e => field('notes', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onSave}>
            <Calendar className="h-4 w-4 mr-2" />
            Programar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
