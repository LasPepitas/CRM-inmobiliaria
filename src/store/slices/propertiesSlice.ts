import type { StateCreator } from 'zustand'
import type { Store } from '@/store'
import { propertiesApi, toProperty, toCreatePayload } from '@/features/properties/api/propertiesApi'
import type { PropertyFormData } from '@/features/properties/types'

export interface Property {
  id: string
  title: string
  type: 'Casa' | 'Departamento' | 'Terreno' | 'Oficina'
  price: number
  status: 'Disponible' | 'Reservado' | 'Vendido'
  city: string
  neighborhood: string
  area_m2: number
  bedrooms: number
  bathrooms: number
  photos: string[]
  isPublished: boolean
  created_at: string
  views: number
  interested: number
}

export interface PropertiesSlice {
  properties: Property[]
  propertiesLoading: boolean
  propertiesError: string | null
  propertiesFetched: boolean

  fetchProperties: () => Promise<void>
  addProperty: (formData: PropertyFormData) => Promise<void>
  updateProperty: (id: string, formData: PropertyFormData) => Promise<void>
  deleteProperty: (id: string) => Promise<void>
  archiveProperty: (id: string) => Promise<void>
}

export const createPropertiesSlice: StateCreator<Store, [], [], PropertiesSlice> = (set) => ({
  properties: [],
  propertiesLoading: false,
  propertiesError: null,
  propertiesFetched: false,

  fetchProperties: async () => {
    set({ propertiesLoading: true, propertiesError: null })
    try {
      const data = await propertiesApi.getAll()
      set({ properties: data.map(toProperty), propertiesLoading: false, propertiesFetched: true })
    } catch (err) {
      set({
        propertiesError: err instanceof Error ? err.message : 'Error al cargar propiedades',
        propertiesLoading: false,
      })
    }
  },

  addProperty: async (formData) => {
    const payload = toCreatePayload(formData)
    const created = await propertiesApi.create(payload)
    set((state) => ({
      properties: [...state.properties, toProperty(created)],
    }))
  },

  updateProperty: async (id, formData) => {
    const payload = toCreatePayload(formData)
    const updated = await propertiesApi.update(id, payload)
    set((state) => ({
      properties: state.properties.map((p) => (p.id === id ? toProperty(updated) : p)),
    }))
  },

  deleteProperty: async (id) => {
    await propertiesApi.remove(id)
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== id),
    }))
  },

  archiveProperty: async (id) => {
    const updated = await propertiesApi.update(id, { status: 'VENDIDO' })
    set((state) => ({
      properties: state.properties.map((p) => (p.id === id ? toProperty(updated) : p)),
    }))
  },
})
