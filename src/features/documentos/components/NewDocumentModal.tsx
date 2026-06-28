import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { DOC_TYPES } from '../constants'
import type { NewDocForm } from '../types'
import type { Lead, Property } from '@/store'

interface NewDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newDoc: NewDocForm
  setNewDoc: (doc: NewDocForm) => void
  properties: Property[]
  leads: Lead[]
  isLoading: boolean
  handleAddDocument: () => void
}

export function NewDocumentModal({
  open,
  onOpenChange,
  newDoc,
  setNewDoc,
  properties,
  leads,
  isLoading,
  handleAddDocument,
}: NewDocumentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir Documento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Archivo *</label>
            <input
              id="doc-file-input"
              type="file"
              className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-sm file:font-medium hover:file:bg-primary/20 mt-1"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nombre del Documento *</label>
            <Input
              id="doc-name"
              placeholder="Ej: Plano arquitectónico"
              value={newDoc.name}
              onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select value={newDoc.type} onValueChange={v => setNewDoc({ ...newDoc, type: v as NewDocForm['type'] })}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map(t => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Propiedad *</label>
              <Select
                value={newDoc.property_id || '__none__'}
                onValueChange={v => setNewDoc({ ...newDoc, property_id: v === '__none__' ? '' : v })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Seleccionar...</SelectItem>
                  {properties.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Lead (opcional)</label>
            <Select
              value={newDoc.lead_id || '__none__'}
              onValueChange={v => setNewDoc({ ...newDoc, lead_id: v === '__none__' ? '' : v })}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddDocument} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Subiendo...' : 'Subir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
