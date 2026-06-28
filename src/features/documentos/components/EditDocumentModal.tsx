import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save } from 'lucide-react'
import { DOC_TYPES, DOC_STATUSES } from '../constants'
import type { ApiDocument } from '../adapters/documentosAdapter'
import type { NewDocForm } from '../types'
import type { Lead } from '@/features/leads/types'
import type { Property } from '@/store'

interface EditDocumentModalProps {
  doc: ApiDocument | null
  properties: Property[]
  leads: Lead[]
  onSave: (updated: NewDocForm & { id: string }) => void
  onClose: () => void
}

export function EditDocumentModal({ doc, properties, leads, onSave, onClose }: EditDocumentModalProps) {
  const [form, setForm] = useState<NewDocForm & { id: string }>(() => ({
    id: doc?.id ?? '',
    name: doc?.name ?? '',
    type: doc?.type ?? 'Contrato',
    status: doc?.status ?? 'Borrador',
    property_id: doc?.property_id ?? '',
    lead_id: doc?.leadId ?? '',
  }))

  if (!doc) return null

  const field = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  return (
    <Dialog open={!!doc} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Documento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Nombre *</label>
            <Input
              id="edit-doc-name"
              placeholder="Nombre del documento"
              value={form.name}
              onChange={e => field('name', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select value={form.type} onValueChange={v => field('type', v as NewDocForm['type'])}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Estado</label>
              <Select value={form.status} onValueChange={v => field('status', v as NewDocForm['status'])}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Propiedad</label>
            <Select
              value={form.property_id || '__none__'}
              onValueChange={v => field('property_id', v === '__none__' ? '' : v)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Sin propiedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sin propiedad</SelectItem>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Lead (opcional)</label>
            <Select
              value={form.lead_id || '__none__'}
              onValueChange={v => field('lead_id', v === '__none__' ? '' : v)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Sin lead vinculado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sin lead vinculado</SelectItem>
                {leads.map(l => (
                  <SelectItem key={l.id} value={l.id}>
                    {`${l.firstName} ${l.lastName}`.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave(form)} disabled={!form.name.trim()}>
            <Save className="h-4 w-4 mr-2" /> Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
