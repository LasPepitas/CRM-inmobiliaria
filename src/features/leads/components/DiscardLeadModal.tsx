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
import { XCircle } from 'lucide-react'

interface DiscardLeadModalProps {
  leadId: string | null
  onClose: () => void
  form: { reason: string; notes: string }
  setForm: (form: { reason: string; notes: string }) => void
  onConfirm: () => void
}

export function DiscardLeadModal({ leadId, onClose, form, setForm, onConfirm }: DiscardLeadModalProps) {
  const leads = useStore((state) => state.leads)
  const leadName = leads.find(l => l.id === leadId)?.name

  return (
    <Dialog open={!!leadId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-warning-600" />
            Marcar como No Interesado
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg text-sm text-warning-700">
            <strong>{leadName}</strong> será removido del pipeline activo y sus negocios vinculados pasarán a <strong>Cancelado</strong>.
          </div>
          <div>
            <label className="text-sm font-medium">Motivo del descarte *</label>
            <Select value={form.reason} onValueChange={val => setForm({ ...form, reason: val })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccioná un motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="precio">Precio elevado para el cliente</SelectItem>
                <SelectItem value="otra_agencia">Compró/alquiló con otra agencia</SelectItem>
                <SelectItem value="no_responde">Sin respuesta después de varios contactos</SelectItem>
                <SelectItem value="cambio_planes">El cliente cambió de planes</SelectItem>
                <SelectItem value="zona">No le conviene la zona/barrio</SelectItem>
                <SelectItem value="otro">Otro motivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Notas adicionales (opcional)</label>
            <Input
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Ej: Volvió a contactarnos en 6 meses..."
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white border-none"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Confirmar Descarte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
