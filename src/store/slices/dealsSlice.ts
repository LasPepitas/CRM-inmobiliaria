import type { StateCreator } from 'zustand'
import type { Store } from '@/store'

export interface DealNote {
  id: string
  text: string
  timestamp: string
  author?: string
}

export interface Deal {
  id: string
  property_id: string
  lead_id: string
  stage: 'Nuevo' | 'Contactado' | 'Visita' | 'Negociacion' | 'Cierre' | 'Cancelado'
  value: number
  probability: number
  expected_close: string
  last_update: string
  title: string
  notes?: DealNote[]
}

const mockDeals: Deal[] = [
  { id: '1', property_id: '1', lead_id: '1', stage: 'Negociacion', value: 45000000, probability: 75, expected_close: '2024-05-15', last_update: '2024-04-15', title: 'Casa Palermo Soho - María González' },
  { id: '2', property_id: '2', lead_id: '2', stage: 'Visita', value: 32000000, probability: 45, expected_close: '2024-06-01', last_update: '2024-04-14', title: 'Dept Recoleta - Carlos Rodríguez' },
  { id: '3', property_id: '4', lead_id: '5', stage: 'Cierre', value: 89000000, probability: 95, expected_close: '2024-04-20', last_update: '2024-04-15', title: 'Casa Nordelta - Laura Hernández' },
  { id: '4', property_id: '3', lead_id: '6', stage: 'Negociacion', value: 58000000, probability: 70, expected_close: '2024-05-30', last_update: '2024-04-14', title: 'Oficina Catalinas - Miguel Torres' },
  { id: '5', property_id: '6', lead_id: '7', stage: 'Negociacion', value: 72000000, probability: 80, expected_close: '2024-05-20', last_update: '2024-04-15', title: 'Dept Puerto Madero - Sofía Ramírez' },
  { id: '6', property_id: '7', lead_id: '15', stage: 'Cierre', value: 55000000, probability: 98, expected_close: '2024-04-18', last_update: '2024-04-15', title: 'Casa Martínez - Isabel Vargas' },
  { id: '7', property_id: '15', lead_id: '19', stage: 'Negociacion', value: 62000000, probability: 72, expected_close: '2024-05-25', last_update: '2024-04-15', title: 'Casa Pilar - Patricia Luna' },
  { id: '8', property_id: '9', lead_id: '22', stage: 'Visita', value: 38000000, probability: 50, expected_close: '2024-06-15', last_update: '2024-04-14', title: 'Casa Hudson - Daniel Ortega' },
  { id: '9', property_id: '17', lead_id: '26', stage: 'Negociacion', value: 48000000, probability: 78, expected_close: '2024-05-10', last_update: '2024-04-15', title: 'Casa San Telmo - Luis Moreno' },
  { id: '10', property_id: '10', lead_id: '14', stage: 'Visita', value: 35000000, probability: 55, expected_close: '2024-06-01', last_update: '2024-04-14', title: 'Oficina Dot - Pablo Reyes' },
  { id: '11', property_id: '11', lead_id: '25', stage: 'Negociacion', value: 22000000, probability: 68, expected_close: '2024-05-28', last_update: '2024-04-15', title: 'Dept Almagro - Rosa Torres' },
  { id: '12', property_id: '20', lead_id: '30', stage: 'Negociacion', value: 32000000, probability: 74, expected_close: '2024-05-22', last_update: '2024-04-15', title: 'Casa Tigre - Fernando Ruiz' },
  { id: '13', property_id: '5', lead_id: '12', stage: 'Contactado', value: 18000000, probability: 35, expected_close: '2024-07-01', last_update: '2024-04-12', title: 'Terreno Pinamar - Andrés Castro' },
  { id: '14', property_id: '8', lead_id: '8', stage: 'Contactado', value: 28000000, probability: 40, expected_close: '2024-06-20', last_update: '2024-04-11', title: 'Dept Belgrano - Diego Morales' },
  { id: '15', property_id: '1', lead_id: '10', stage: 'Visita', value: 45000000, probability: 60, expected_close: '2024-06-10', last_update: '2024-04-14', title: 'Casa Palermo - Javier Flores' },
]

export interface DealsSlice {
  deals: Deal[]
  addDeal: (deal: Omit<Deal, 'id'>) => void
  updateDeal: (id: string, deal: Partial<Deal>) => void
  moveDeal: (id: string, stage: Deal['stage']) => void
  addDealNote: (dealId: string, text: string, author?: string) => void
}

export const createDealsSlice: StateCreator<Store, [], [], DealsSlice> = (set) => ({
  deals: mockDeals,
  addDeal: (deal) => set((state) => ({
    deals: [...state.deals, { ...deal, id: String(Date.now()) }]
  })),
  updateDeal: (id, updates) => set((state) => ({
    deals: state.deals.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  moveDeal: (id, stage) => set((state) => ({
    deals: state.deals.map(d => d.id === id ? { ...d, stage, last_update: new Date().toISOString().split('T')[0] } : d)
  })),
  addDealNote: (dealId, text, author) => set((state) => ({
    deals: state.deals.map(d => {
      if (d.id !== dealId) return d
      const newNote: DealNote = {
        id: String(Date.now()),
        text,
        timestamp: new Date().toISOString(),
        author
      }
      return { ...d, notes: [...(d.notes || []), newNote] }
    })
  }))
})
