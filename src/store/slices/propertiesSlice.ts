import type { StateCreator } from 'zustand'
import type { Store } from '@/store'

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
  created_at: string
  views: number
  interested: number
}

const mockProperties: Property[] = [
  { id: '1', title: 'Casa en Palermo Soho', type: 'Casa', price: 45000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Palermo Soho', area_m2: 280, bedrooms: 4, bathrooms: 3, photos: [], created_at: '2024-01-15', views: 342, interested: 28 },
  { id: '2', title: 'Departamento en Recoleta', type: 'Departamento', price: 32000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Recoleta', area_m2: 145, bedrooms: 3, bathrooms: 2, photos: [], created_at: '2024-02-20', views: 256, interested: 19 },
  { id: '3', title: 'Oficina en Catalinas', type: 'Oficina', price: 58000000, status: 'Reservado', city: 'Buenos Aires', neighborhood: 'Catalinas', area_m2: 420, bedrooms: 0, bathrooms: 2, photos: [], created_at: '2024-03-05', views: 189, interested: 12 },
  { id: '4', title: 'Casa en Nordelta', type: 'Casa', price: 89000000, status: 'Disponible', city: 'Tigre', neighborhood: 'Nordelta', area_m2: 520, bedrooms: 5, bathrooms: 4, photos: [], created_at: '2024-01-28', views: 567, interested: 45 },
  { id: '5', title: 'Terreno en Pinamar', type: 'Terreno', price: 18000000, status: 'Disponible', city: 'Pinamar', neighborhood: 'Centro', area_m2: 1200, bedrooms: 0, bathrooms: 0, photos: [], created_at: '2024-04-10', views: 123, interested: 8 },
  { id: '6', title: 'Departamento en Puerto Madero', type: 'Departamento', price: 72000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Puerto Madero', area_m2: 180, bedrooms: 3, bathrooms: 3, photos: [], created_at: '2024-02-14', views: 412, interested: 34 },
  { id: '7', title: 'Casa en Martínez', type: 'Casa', price: 55000000, status: 'Vendido', city: 'San Isidro', neighborhood: 'Martínez', area_m2: 340, bedrooms: 4, bathrooms: 3, photos: [], created_at: '2024-01-05', views: 298, interested: 22 },
  { id: '8', title: 'Departamento en Belgrano', type: 'Departamento', price: 28000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Belgrano', area_m2: 95, bedrooms: 2, bathrooms: 1, photos: [], created_at: '2024-03-22', views: 167, interested: 14 },
  { id: '9', title: 'Casa en Hudson', type: 'Casa', price: 38000000, status: 'Disponible', city: 'Berazategui', neighborhood: 'Hudson', area_m2: 260, bedrooms: 3, bathrooms: 2, photos: [], created_at: '2024-02-08', views: 145, interested: 11 },
  { id: '10', title: 'Oficina en Dot', type: 'Oficina', price: 35000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Dot Baires', area_m2: 280, bedrooms: 0, bathrooms: 2, photos: [], created_at: '2024-04-01', views: 98, interested: 7 },
  { id: '11', title: 'Departamento en Almagro', type: 'Departamento', price: 22000000, status: 'Reservado', city: 'Buenos Aires', neighborhood: 'Almagro', area_m2: 72, bedrooms: 2, bathrooms: 1, photos: [], created_at: '2024-03-15', views: 189, interested: 16 },
  { id: '12', title: 'Casa en La Plata', type: 'Casa', price: 28000000, status: 'Disponible', city: 'La Plata', neighborhood: 'City Bell', area_m2: 200, bedrooms: 3, bathrooms: 2, photos: [], created_at: '2024-01-20', views: 112, interested: 9 },
  { id: '13', title: 'Terreno en Ezeiza', type: 'Terreno', price: 12000000, status: 'Disponible', city: 'Ezeiza', neighborhood: 'Canning', area_m2: 2500, bedrooms: 0, bathrooms: 0, photos: [], created_at: '2024-04-05', views: 76, interested: 5 },
  { id: '14', title: 'Departamento en Caballito', type: 'Departamento', price: 19500000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Caballito', area_m2: 65, bedrooms: 2, bathrooms: 1, photos: [], created_at: '2024-03-28', views: 134, interested: 10 },
  { id: '15', title: 'Casa en Pilar', type: 'Casa', price: 62000000, status: 'Disponible', city: 'Pilar', neighborhood: 'Villa García', area_m2: 380, bedrooms: 4, bathrooms: 3, photos: [], created_at: '2024-02-25', views: 234, interested: 18 },
  { id: '16', title: 'Oficina en Núñez', type: 'Oficina', price: 42000000, status: 'Vendido', city: 'Buenos Aires', neighborhood: 'Núñez', area_m2: 220, bedrooms: 0, bathrooms: 1, photos: [], created_at: '2024-01-12', views: 167, interested: 13 },
  { id: '17', title: 'Casa en San Telmo', type: 'Casa', price: 48000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'San Telmo', area_m2: 300, bedrooms: 4, bathrooms: 2, photos: [], created_at: '2024-03-01', views: 289, interested: 24 },
  { id: '18', title: 'Departamento en Flores', type: 'Departamento', price: 16500000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Flores', area_m2: 58, bedrooms: 1, bathrooms: 1, photos: [], created_at: '2024-04-08', views: 89, interested: 6 },
  { id: '19', title: 'Terreno en Escobar', type: 'Terreno', price: 9500000, status: 'Disponible', city: 'Escobar', neighborhood: 'Belén de Escobar', area_m2: 1800, bedrooms: 0, bathrooms: 0, photos: [], created_at: '2024-02-18', views: 67, interested: 4 },
  { id: '20', title: 'Casa en Tigre Centro', type: 'Casa', price: 32000000, status: 'Disponible', city: 'Tigre', neighborhood: 'Tigre Centro', area_m2: 220, bedrooms: 3, bathrooms: 2, photos: [], created_at: '2024-03-10', views: 156, interested: 13 },
]

export interface PropertiesSlice {
  properties: Property[]
  addProperty: (property: Omit<Property, 'id'>) => void
  updateProperty: (id: string, property: Partial<Property>) => void
  deleteProperty: (id: string) => void
  archiveProperty: (id: string) => void
}

export const createPropertiesSlice: StateCreator<Store, [], [], PropertiesSlice> = (set) => ({
  properties: mockProperties,
  addProperty: (property) => set((state) => ({
    properties: [...state.properties, { ...property, id: String(state.properties.length + 1) }]
  })),
  updateProperty: (id, updates) => set((state) => ({
    properties: state.properties.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deleteProperty: (id) => set((state) => ({
    properties: state.properties.filter(p => p.id !== id)
  })),
  archiveProperty: (id) => set((state) => ({
    properties: state.properties.map(p => p.id === id ? { ...p, status: 'Vendido' as const } : p)
  }))
})
