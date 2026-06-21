import { useStore } from '@/store'
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
import { ArrowRightLeft } from 'lucide-react'

interface LeadConvertForm {
  property_id: string
  value: number
  probability: number
  expected_close: string
}

interface LeadConvertModalProps {
  leadId: string | null
  onClose: () => void
  form: LeadConvertForm
  setForm: (form: LeadConvertForm) => void
  onConfirm: () => void
}

export function LeadConvertModal({ leadId, onClose, form, setForm, onConfirm }: LeadConvertModalProps) {
  const leads = useStore((state) => state.leads)
  const properties = useStore((state) => state.properties)

  const lead = leads.find(l => l.id === leadId)

  return (
    <Dialog open={!!leadId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Convertir a Negocio
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary/80">
            <strong>{lead?.firstName} {lead?.lastName}</strong> pasará al pipeline de ventas.
          </div>

          <div>
            <label className="text-sm font-medium">Propiedad de interés *</label>
            <Select value={form.property_id} onValueChange={val => setForm({ ...form, property_id: val })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccioná una propiedad" />
              </SelectTrigger>
              <SelectContent>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Valor estimado del negocio ($)</label>
            <Input
              type="number"
              value={form.value || ''}
              onChange={e => setForm({ ...form, value: Number(e.target.value) })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Probabilidad de cierre (%)</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={form.probability || ''}
              onChange={e => setForm({ ...form, probability: Number(e.target.value) })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Fecha estimada de cierre *</label>
            <Input
              type="date"
              value={form.expected_close}
              onChange={e => setForm({ ...form, expected_close: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm}>Crear Negocio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
