import { apiClient } from '@/lib/api-client'
import type { Property } from '@/store/slices/propertiesSlice'
import type { PropertyFormData, PropertyType, PropertyStatus } from '../types'

// ─── DTOs del backend ─────────────────────────────────────────────────────────

export interface PropertyResponse {
  id: string
  title: string
  type: 'CASA' | 'DEPARTAMENTO' | 'TERRENO' | 'OFICINA'
  price: string | number // Prisma Decimal viene como string
  city: string
  neighborhood: string
  areaM2: string | number // Prisma Decimal viene como string
  bedrooms: number
  bathrooms: number
  status: 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO'
  advisorId: string | null
  imageUrl?: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePropertyPayload {
  title: string
  type: 'CASA' | 'DEPARTAMENTO' | 'TERRENO' | 'OFICINA'
  price: number
  city: string
  neighborhood: string
  areaM2: number
  bedrooms: number
  bathrooms: number
  status?: 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO'
  advisorId?: string
  imageUrl?: string
  isPublished?: boolean
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>

// ─── Mapeos de tipo y estatus ──────────────────────────────────────────────────

const TYPE_TO_FRONTEND: Record<PropertyResponse['type'], PropertyType> = {
  CASA: 'Casa',
  DEPARTAMENTO: 'Departamento',
  TERRENO: 'Terreno',
  OFICINA: 'Oficina',
}

const TYPE_TO_BACKEND: Record<PropertyType, PropertyResponse['type']> = {
  Casa: 'CASA',
  Departamento: 'DEPARTAMENTO',
  Terreno: 'TERRENO',
  Oficina: 'OFICINA',
}

const STATUS_TO_FRONTEND: Record<PropertyResponse['status'], PropertyStatus> = {
  DISPONIBLE: 'Disponible',
  RESERVADO: 'Reservado',
  VENDIDO: 'Vendido',
}

const STATUS_TO_BACKEND: Record<PropertyStatus, PropertyResponse['status']> = {
  Disponible: 'DISPONIBLE',
  Reservado: 'RESERVADO',
  Vendido: 'VENDIDO',
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

/**
 * Convierte un objeto PropertyResponse del backend al tipo Property esperado por el frontend.
 */
export function toProperty(p: PropertyResponse): Property {
  return {
    id: p.id,
    title: p.title,
    type: TYPE_TO_FRONTEND[p.type] ?? 'Casa',
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    city: p.city,
    neighborhood: p.neighborhood,
    area_m2: typeof p.areaM2 === 'string' ? parseFloat(p.areaM2) : p.areaM2,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    status: STATUS_TO_FRONTEND[p.status] ?? 'Disponible',
    photos: p.imageUrl ? [p.imageUrl] : [],
    isPublished: p.isPublished ?? false,
    created_at: p.createdAt ? p.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    views: 0,
    interested: 0,
  }
}

/**
 * Convierte el formulario del frontend al payload esperado por el backend.
 */
export function toCreatePayload(form: PropertyFormData): CreatePropertyPayload {
  return {
    title: form.title,
    type: TYPE_TO_BACKEND[form.type] ?? 'CASA',
    price: form.price,
    city: form.city,
    neighborhood: form.neighborhood,
    areaM2: form.area_m2,
    bedrooms: form.bedrooms,
    bathrooms: form.bathrooms,
    status: STATUS_TO_BACKEND[form.status] ?? 'DISPONIBLE',
    imageUrl: form.imageUrl || undefined,
    isPublished: form.isPublished,
  }
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const propertiesApi = {
  getAll: () =>
    apiClient.get<PropertyResponse[]>('/properties'),

  getById: (id: string) =>
    apiClient.get<PropertyResponse>(`/properties/${id}`),

  create: (payload: CreatePropertyPayload) =>
    apiClient.post<PropertyResponse>('/properties', payload),

  update: (id: string, payload: UpdatePropertyPayload) =>
    apiClient.patch<PropertyResponse>(`/properties/${id}`, payload),

  remove: (id: string) =>
    apiClient.delete<{ message: string }>(`/properties/${id}`),

  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<{ url: string }>('/properties/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getPublic: () =>
    apiClient.get<PropertyResponse[]>('/properties/public'),
}
