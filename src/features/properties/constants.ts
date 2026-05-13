import type { PropertyType, PropertyStatus } from './types'

export const PROPERTY_TYPES: PropertyType[] = ['Casa', 'Departamento', 'Terreno', 'Oficina']
export const PROPERTY_STATUSES: PropertyStatus[] = ['Disponible', 'Reservado', 'Vendido']

export const statusBadgeVariant: Record<PropertyStatus, 'success' | 'warning' | 'neutral'> = {
  Disponible: 'success',
  Reservado: 'warning',
  Vendido: 'neutral',
}

export const propertyGradients: Record<PropertyType, { from: string; to: string; icon: string }> = {
  Casa: { from: 'from-blue-100', to: 'to-blue-200', icon: '🏠' },
  Departamento: { from: 'from-purple-100', to: 'to-purple-200', icon: '🏢' },
  Terreno: { from: 'from-amber-100', to: 'to-amber-200', icon: '🏗️' },
  Oficina: { from: 'from-slate-100', to: 'to-slate-200', icon: '💼' },
}
