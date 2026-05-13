import type { StateCreator } from 'zustand'
import type { Store } from '@/store'

export interface Visit {
  id: string
  property_id: string
  lead_id: string
  date: string
  time: string
  status: 'Programada' | 'Completada' | 'Cancelada'
  agent: string
  notes: string
}

const mockVisits: Visit[] = [
  { id: '1', property_id: '1', lead_id: '1', date: '2024-04-16', time: '10:00', status: 'Programada', agent: '1', notes: 'Primera visita con la cliente' },
  { id: '2', property_id: '2', lead_id: '2', date: '2024-04-16', time: '14:30', status: 'Programada', agent: '2', notes: 'Cliente prospecto' },
  { id: '3', property_id: '4', lead_id: '5', date: '2024-04-17', time: '11:00', status: 'Programada', agent: '4', notes: 'Visita final antes del cierre' },
  { id: '4', property_id: '6', lead_id: '7', date: '2024-04-17', time: '16:00', status: 'Programada', agent: '1', notes: 'Segunda visita' },
  { id: '5', property_id: '9', lead_id: '22', date: '2024-04-18', time: '09:30', status: 'Programada', agent: '3', notes: 'Visita con familia' },
  { id: '6', property_id: '15', lead_id: '19', date: '2024-04-18', time: '15:00', status: 'Programada', agent: '4', notes: 'Cliente VIP' },
  { id: '7', property_id: '17', lead_id: '26', date: '2024-04-19', time: '10:30', status: 'Programada', agent: '1', notes: 'Pre-cierre' },
  { id: '8', property_id: '3', lead_id: '6', date: '2024-04-15', time: '11:00', status: 'Completada', agent: '2', notes: 'Visitado con éxito' },
  { id: '9', property_id: '7', lead_id: '15', date: '2024-04-14', time: '14:00', status: 'Completada', agent: '4', notes: 'Última visita antes del cierre' },
  { id: '10', property_id: '11', lead_id: '25', date: '2024-04-20', time: '12:00', status: 'Programada', agent: '3', notes: 'Primera visita' },
]

export interface VisitsSlice {
  visits: Visit[]
  addVisit: (visit: Omit<Visit, 'id'>) => void
  updateVisit: (id: string, visit: Partial<Visit>) => void
}

export const createVisitsSlice: StateCreator<Store, [], [], VisitsSlice> = (set) => ({
  visits: mockVisits,
  addVisit: (visit) => set((state) => ({
    visits: [...state.visits, { ...visit, id: String(state.visits.length + 1) }]
  })),
  updateVisit: (id, updates) => set((state) => ({
    visits: state.visits.map(v => v.id === id ? { ...v, ...updates } : v)
  }))
})
