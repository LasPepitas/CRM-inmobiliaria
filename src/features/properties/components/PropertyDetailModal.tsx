import type { Property } from '@/store/slices/propertiesSlice'
import { propertyGradients, statusBadgeVariant } from '../constants'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BedDouble, Bath } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface PropertyDetailModalProps {
  property: Property | undefined
  open: boolean
  onClose: () => void
  onGoToLeads: () => void
  onGoToVisits: () => void
}

export function PropertyDetailModal({
  property,
  open,
  onClose,
  onGoToLeads,
  onGoToVisits,
}: PropertyDetailModalProps) {
  if (!property) return null
  const gradient = propertyGradients[property.type]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{property.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <div
            className={cn(
              'h-48 bg-gradient-to-br rounded-lg flex items-center justify-center text-6xl',
              gradient.from,
              gradient.to,
            )}
          >
            {gradient.icon}
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase text-neutral-500 mb-1">Precio</p>
              <p className="text-2xl font-bold font-heading">{formatCurrency(property.price)}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs uppercase text-neutral-500">Tipo</p>
                <p className="font-medium">{property.type}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-neutral-500">m²</p>
                <p className="font-medium">{property.area_m2}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-neutral-500">Estado</p>
                <Badge variant={statusBadgeVariant[property.status]}>{property.status}</Badge>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase text-neutral-500 mb-1">Ubicación</p>
              <p className="font-medium">{property.neighborhood}, {property.city}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-neutral-500" />
                <span>{property.bedrooms || '-'} Dormitorios</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-neutral-500" />
                <span>{property.bathrooms || '-'} Baños</span>
              </div>
            </div>
            <div className="pt-4 flex gap-2">
              <Button variant="default" className="flex-1" onClick={onGoToLeads}>
                Contactar Lead
              </Button>
              <Button variant="outline" className="flex-1" onClick={onGoToVisits}>
                Agendar Visita
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
