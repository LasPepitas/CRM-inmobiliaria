import { useState } from 'react'
import { useStore } from '@/store'
import type { Property } from '@/store'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Building2,
  Search,
  Filter,
  Plus,
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
import { cn, formatCurrency, getPropertyGradient } from '@/lib/utils'

export function PropertiesPage() {
  const { properties, addProperty, updateProperty, deleteProperty, archiveProperty, addToast, setActivePage, ui, openModal, closeModal } = useStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [editingProperty, setEditingProperty] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'Casa' as Property['type'],
    price: 0,
    city: '',
    neighborhood: '',
    area_m2: 0,
    bedrooms: 0,
    bathrooms: 0,
    status: 'Disponible' as Property['status'],
  })

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter.length === 0 || typeFilter.includes(p.type)
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(p.status)
    return matchesSearch && matchesType && matchesStatus
  })

  const selectedPropertyData = properties.find(p => p.id === selectedProperty)
  const editingPropertyData = properties.find(p => p.id === editingProperty)

  const toggleTypeFilter = (type: string) => {
    setTypeFilter(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const handleSaveNew = () => {
    if (!formData.title || !formData.city) {
      addToast({ title: 'Error', description: 'Completá los campos obligatorios', variant: 'error' })
      return
    }
    addProperty({
      ...formData,
      photos: [],
      created_at: new Date().toISOString().split('T')[0],
      views: 0,
      interested: 0,
    })
    addToast({ title: 'Propiedad creada', description: `${formData.title} fue agregada correctamente`, variant: 'success' })
    closeModal('addProperty')
    setFormData({ title: '', type: 'Casa', price: 0, city: '', neighborhood: '', area_m2: 0, bedrooms: 0, bathrooms: 0, status: 'Disponible' })
  }

  const handleSaveEdit = () => {
    if (!editingPropertyData || !editingProperty) return
    updateProperty(editingProperty, formData)
    addToast({ title: 'Propiedad actualizada', description: `${formData.title} fue modificada`, variant: 'success' })
    setEditingProperty(null)
    setFormData({ title: '', type: 'Casa', price: 0, city: '', neighborhood: '', area_m2: 0, bedrooms: 0, bathrooms: 0, status: 'Disponible' })
  }

  const handleArchive = (id: string) => {
    const prop = properties.find(p => p.id === id)
    archiveProperty(id)
    addToast({ title: 'Propiedad archivada', description: `${prop?.title} fue archivada`, variant: 'success' })
  }

  const handleDelete = (id: string) => {
    const prop = properties.find(p => p.id === id)
    deleteProperty(id)
    addToast({ title: 'Propiedad eliminada', description: `${prop?.title} fue eliminada`, variant: 'success' })
    setDeleteConfirm(null)
  }

  const openEditModal = (id: string) => {
    const prop = properties.find(p => p.id === id)
    if (prop) {
      setFormData({
        title: prop.title,
        type: prop.type,
        price: prop.price,
        city: prop.city,
        neighborhood: prop.neighborhood,
        area_m2: prop.area_m2,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        status: prop.status,
      })
      setEditingProperty(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Propiedades</h1>
          <p className="text-neutral-600 mt-1">{properties.length} propiedades en portfolio</p>
        </div>
        <Button onClick={() => openModal('addProperty')}>
          <Plus className="h-4 w-4" />
          Agregar Propiedad
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Buscar por nombre, ciudad o barrio..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['Casa', 'Departamento', 'Terreno', 'Oficina'].map((type) => (
                <Button
                  key={type}
                  variant={typeFilter.includes(type) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTypeFilter(type)}
                  className={cn(typeFilter.includes(type) && "bg-primary")}
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
                  {['Disponible', 'Reservado', 'Vendido'].map((status) => (
                    <DropdownMenuItem key={status} onClick={() => toggleStatusFilter(status)}>
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", status === 'Disponible' && "bg-success-500", status === 'Reservado' && "bg-warning-500", status === 'Vendido' && "bg-primary")} />
                        {status}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length === 0 ? (
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
              ) : filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn("h-10 w-14 rounded-md bg-gradient-to-br flex items-center justify-center text-lg", getPropertyGradient(property.type).from, getPropertyGradient(property.type).to)}>
                        {getPropertyGradient(property.type).icon}
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
                    <Badge variant={property.status === 'Disponible' ? 'success' : property.status === 'Reservado' ? 'warning' : 'neutral'}>
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
                        <DropdownMenuItem onClick={() => setSelectedProperty(property.id)}>
                          <Eye className="h-4 w-4 mr-2" /> Ver Detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(property.id)}>
                          <Edit className="h-4 w-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleArchive(property.id)} className="text-warning-500">
                          <Archive className="h-4 w-4 mr-2" /> Archivar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteConfirm(property.id)} className="text-error-500">
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="max-w-2xl">
          {selectedPropertyData && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPropertyData.title}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className={cn("h-48 bg-gradient-to-br rounded-lg flex items-center justify-center text-6xl", getPropertyGradient(selectedPropertyData.type).from, getPropertyGradient(selectedPropertyData.type).to)}>
                  {getPropertyGradient(selectedPropertyData.type).icon}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-neutral-500 mb-1">Precio</p>
                    <p className="text-2xl font-bold font-heading">{formatCurrency(selectedPropertyData.price)}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs uppercase text-neutral-500">Tipo</p>
                      <p className="font-medium">{selectedPropertyData.type}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-neutral-500">m²</p>
                      <p className="font-medium">{selectedPropertyData.area_m2}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-neutral-500">Estado</p>
                      <Badge variant={selectedPropertyData.status === 'Disponible' ? 'success' : selectedPropertyData.status === 'Reservado' ? 'warning' : 'neutral'}>
                        {selectedPropertyData.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-neutral-500 mb-1">Ubicación</p>
                    <p className="font-medium">{selectedPropertyData.neighborhood}, {selectedPropertyData.city}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-neutral-500" />
                      <span>{selectedPropertyData.bedrooms || '-'} Dormitorios</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4 text-neutral-500" />
                      <span>{selectedPropertyData.bathrooms || '-'} Baños</span>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <Button variant="default" className="flex-1" onClick={() => { setActivePage('leads'); setSelectedProperty(null); }}>Contactar Lead</Button>
                    <Button variant="outline" className="flex-1" onClick={() => { setActivePage('visitas'); setSelectedProperty(null); }}>Agendar Visita</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Property Dialog */}
      <Dialog open={ui.modals.addProperty} onOpenChange={() => closeModal('addProperty')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Propiedad</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input placeholder="Ej: Casa en Palermo" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as Property['type'] })}>
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Oficina">Oficina</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Precio (ARS)</label>
                <Input type="number" placeholder="0" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ciudad *</label>
                <Input placeholder="Buenos Aires" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Barrio</label>
                <Input placeholder="Palermo" value={formData.neighborhood} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">m²</label>
                <Input type="number" placeholder="0" value={formData.area_m2 || ''} onChange={(e) => setFormData({ ...formData, area_m2: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Dormitorios</label>
                <Input type="number" placeholder="0" value={formData.bedrooms || ''} onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Baños</label>
                <Input type="number" placeholder="0" value={formData.bathrooms || ''} onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeModal('addProperty')}>Cancelar</Button>
            <Button onClick={handleSaveNew}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog open={!!editingProperty} onOpenChange={() => setEditingProperty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Propiedad</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as Property['type'] })}>
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Oficina">Oficina</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Precio</label>
                <Input type="number" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ciudad</label>
                <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Barrio</label>
                <Input value={formData.neighborhood} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">m²</label>
                <Input type="number" value={formData.area_m2 || ''} onChange={(e) => setFormData({ ...formData, area_m2: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Estado</label>
                <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Property['status'] })}>
                  <option value="Disponible">Disponible</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Vendido">Vendido</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProperty(null)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar propiedad?</DialogTitle>
          </DialogHeader>
          <p className="text-neutral-600 py-4">Esta acción no se puede deshacer. La propiedad y todos sus datos asociados serán eliminados permanentemente.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
