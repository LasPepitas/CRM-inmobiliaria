import type { Property } from '@/store/slices/propertiesSlice'
import type { PropertyFormData } from '../types'
import { PROPERTY_TYPES, PROPERTY_STATUSES, statusBadgeVariant, propertyGradients } from '../constants'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Building2,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Archive,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Trash2,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface PropertiesTableProps {
  properties: Property[]
  search: string
  typeFilter: string[]
  statusFilter: string[]
  formData: PropertyFormData
  onSearchChange: (value: string) => void
  onToggleType: (type: string) => void
  onToggleStatus: (status: string) => void
  onView: (id: string) => void
  onEdit: (property: Property) => void
  onArchive: (id: string) => void
  onDeleteConfirm: (id: string) => void
}

export function PropertiesTable({
  properties,
  search,
  typeFilter,
  statusFilter,
  onSearchChange,
  onToggleType,
  onToggleStatus,
  onView,
  onEdit,
  onArchive,
  onDeleteConfirm,
}: PropertiesTableProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            id="property-search"
            placeholder="Buscar por nombre, ciudad o barrio..."
            className="pl-10"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <Button
              key={type}
              variant={typeFilter.includes(type) ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToggleType(type)}
              className={cn(typeFilter.includes(type) && 'bg-primary')}
            >
              {type}
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Estado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PROPERTY_STATUSES.map((status) => (
                <DropdownMenuItem key={status} onClick={() => onToggleStatus(status)}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        statusFilter.includes(status) && 'ring-2 ring-offset-1 ring-primary',
                        status === 'Disponible' && 'bg-success-500',
                        status === 'Reservado' && 'bg-warning-500',
                        status === 'Vendido' && 'bg-primary',
                      )}
                    />
                    {status}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Propiedad</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>m²</TableHead>
            <TableHead>Dorm.</TableHead>
            <TableHead>Baños</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <tr>
              <TableCell colSpan={9} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-neutral-400" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-700">No hay propiedades</p>
                    <p className="text-sm text-neutral-500">Agregá una propiedad para comenzar</p>
                  </div>
                </div>
              </TableCell>
            </tr>
          ) : (
            properties.map((property) => {
              const gradient = propertyGradients[property.type]
              return (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-10 w-14 rounded-md bg-gradient-to-br flex items-center justify-center text-lg',
                          gradient.from,
                          gradient.to,
                        )}
                      >
                        {gradient.icon}
                      </div>
                      <span className="font-medium">{property.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(property.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-neutral-600">
                      <MapPin className="h-3 w-3" />
                      {property.neighborhood}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Maximize className="h-3 w-3 text-neutral-500" />
                      {property.area_m2}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BedDouble className="h-3 w-3 text-neutral-500" />
                      {property.bedrooms || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3 text-neutral-500" />
                      {property.bathrooms || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[property.status]}>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(property.id)}>
                          <Eye className="h-4 w-4 mr-2" /> Ver Detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(property)}>
                          <Edit className="h-4 w-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onArchive(property.id)} className="text-warning-500">
                          <Archive className="h-4 w-4 mr-2" /> Archivar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteConfirm(property.id)} className="text-error-500">
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
