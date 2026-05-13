import type { StateCreator } from 'zustand'
import type { Store } from '@/store'

export interface Agent {
  id: string
  name: string
  role: 'Gerente' | 'Asesor Senior' | 'Asesor'
  avatar?: string
  active_deals: number
  closed_deals: number
  revenue: number
  email: string
  phone?: string
  dni?: string
}

const mockAgents: Agent[] = [
  { id: '1', name: 'Roberto García', role: 'Gerente', active_deals: 5, closed_deals: 24, revenue: 245000000, email: 'roberto.garcia@siena.com' },
  { id: '2', name: 'María López', role: 'Asesor Senior', active_deals: 4, closed_deals: 18, revenue: 156000000, email: 'maria.lopez@siena.com' },
  { id: '3', name: 'Carlos Pérez', role: 'Asesor', active_deals: 3, closed_deals: 12, revenue: 89000000, email: 'carlos.perez@siena.com' },
  { id: '4', name: 'Ana Martínez', role: 'Asesor Senior', active_deals: 4, closed_deals: 20, revenue: 198000000, email: 'ana.martinez@siena.com' },
  { id: '5', name: 'Diego Fernández', role: 'Asesor', active_deals: 2, closed_deals: 8, revenue: 67000000, email: 'diego.fernandez@siena.com' },
  { id: '6', name: 'Lucía Rodríguez', role: 'Asesor', active_deals: 3, closed_deals: 10, revenue: 78000000, email: 'lucia.rodriguez@siena.com' },
  { id: '7', name: 'Miguel Torres', role: 'Asesor', active_deals: 2, closed_deals: 6, revenue: 45000000, email: 'miguel.torres@siena.com' },
  { id: '8', name: 'Sofia Herrera', role: 'Asesor Senior', active_deals: 3, closed_deals: 15, revenue: 134000000, email: 'sofia.herrera@siena.com' },
]

export interface AgentsSlice {
  agents: Agent[]
  addAgent: (agent: Omit<Agent, 'id'>) => void
  updateAgent: (id: string, agent: Partial<Agent>) => void
  deleteAgent: (id: string) => void
}

export const createAgentsSlice: StateCreator<Store, [], [], AgentsSlice> = (set) => ({
  agents: mockAgents,
  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, { ...agent, id: String(Date.now()) }]
  })),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteAgent: (id) => set((state) => ({
    agents: state.agents.filter(a => a.id !== id)
  }))
})
