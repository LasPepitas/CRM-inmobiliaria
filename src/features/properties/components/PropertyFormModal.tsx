import type { PropertyFormData } from '../types'
import { PROPERTY_TYPES, PROPERTY_STATUSES } from '../constants'
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

interface PropertyFormModalProps {
  open: boolean
  title: string
  formData: PropertyFormData
  onFormChange: (data: PropertyFormData) => void
  onSave: () => void
  onCancel: () => void
  isEdit?: boolean
}

export function PropertyFormModal({
  open,
  title,
  formData,
  onFormChange,
  onSave,
  onCancel,
  isEdit = false,
}: PropertyFormModalProps) {
  const field = <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) =>
    onFormChange({ ...formData, [key]: value })

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Título {!isEdit && '*'}</label>
            <Input
              id="property-title"
              placeholder="Ej: Casa en Palermo"
              value={formData.title}
              onChange={(e) => field('title', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={formData.type}
                onValueChange={(v) => field('type', v as PropertyFormData['type'])}
              >
                <SelectTrigger id="property-type" className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Precio (ARS)</label>
              <Input
                id="property-price"
                type="number"
                placeholder="0"
                value={formData.price || ''}
                onChange={(e) => field('price', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Ciudad {!isEdit && '*'}</label>
              <Input
                id="property-city"
                placeholder="Buenos Aires"
                value={formData.city}
                onChange={(e) => field('city', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Barrio</label>
              <Input
                id="property-neighborhood"
                placeholder="Palermo"
                value={formData.neighborhood}
                onChange={(e) => field('neighborhood', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">m²</label>
              <Input
                id="property-area"
                type="number"
                placeholder="0"
                value={formData.area_m2 || ''}
                onChange={(e) => field('area_m2', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Dormitorios</label>
              <Input
                id="property-bedrooms"
                type="number"
                placeholder="0"
                value={formData.bedrooms || ''}
                onChange={(e) => field('bedrooms', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Baños</label>
              <Input
                id="property-bathrooms"
                type="number"
                placeholder="0"
                value={formData.bathrooms || ''}
                onChange={(e) => field('bathrooms', Number(e.target.value))}
              />
            </div>
          </div>
          {isEdit && (
            <div>
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={formData.status}
                onValueChange={(v) => field('status', v as PropertyFormData['status'])}
              >
                <SelectTrigger id="property-status" className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onSave}>{isEdit ? 'Guardar Cambios' : 'Guardar'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
