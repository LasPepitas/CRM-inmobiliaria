export type PropertyType = 'Casa' | 'Departamento' | 'Terreno' | 'Oficina'
export type PropertyStatus = 'Disponible' | 'Reservado' | 'Vendido'

export type { Property } from '@/store/slices/propertiesSlice'

export interface PropertyFormData {
  title: string
  type: PropertyType
  price: number
  city: string
  neighborhood: string
  area_m2: number
  bedrooms: number
  bathrooms: number
  status: PropertyStatus
}

export const PROPERTY_FORM_DEFAULT: PropertyFormData = {
  title: '',
  type: 'Casa',
  price: 0,
  city: '',
  neighborhood: '',
  area_m2: 0,
  bedrooms: 0,
  bathrooms: 0,
  status: 'Disponible',
}
