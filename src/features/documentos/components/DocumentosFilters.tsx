import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, SlidersHorizontal } from 'lucide-react'
import { DOC_TYPES, DOC_STATUSES } from '../constants'
import type { Property } from '@/store'

interface DocumentosFiltersProps {
  docSearch: string
  setDocSearch: (search: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  propertyFilter: string
  setPropertyFilter: (propertyId: string) => void
  properties: Property[]
  activeFilters: number
  clearFilters: () => void
  filteredCount: number
}

export function DocumentosFilters({
  docSearch,
  setDocSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  propertyFilter,
  setPropertyFilter,
  properties,
  activeFilters,
  clearFilters,
  filteredCount,
}: DocumentosFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          id="doc-search"
          placeholder="Buscar documentos..."
          className="pl-9"
          value={docSearch}
          onChange={e => setDocSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
        <Select value={typeFilter || '__all__'} onValueChange={v => setTypeFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger id="doc-type-filter" className="h-9 w-36">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos los tipos</SelectItem>
            {DOC_TYPES.map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter || '__all__'} onValueChange={v => setStatusFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger id="doc-status-filter" className="h-9 w-36">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos los estados</SelectItem>
            {DOC_STATUSES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={propertyFilter || '__all__'} onValueChange={v => setPropertyFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger id="doc-property-filter" className="h-9 w-44">
            <SelectValue placeholder="Propiedad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas las propiedades</SelectItem>
            {properties.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeFilters > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-error-500 border-error-500/30 hover:bg-error-500/5"
          >
            Limpiar ({activeFilters})
          </Button>
        )}
        <span className="text-sm text-neutral-500 ml-auto">{filteredCount} docs</span>
      </div>
    </div>
  )
}
