import type { StateCreator } from 'zustand'
import type { Store } from '@/store'
import { AgentsService } from '@/features/equipo/services/AgentsService'

export interface Agent {
  id: string
  name: string
  role: 'Gerente' | 'Asesor Senior' | 'Asesor' | string
  avatar?: string
  active_deals: number
  closed_deals: number
  revenue: number
  email: string
  phone?: string
  dni?: string
}

export interface AgentsSlice {
  agents: Agent[]
  loadingAgents: boolean
  hasFetchedAgents: boolean
  fetchAgents: () => Promise<void>
  addAgent: (agent: { email: string; password?: string; firstName: string; lastName: string; role: string }) => Promise<void>
  updateAgent: (id: string, agent: Partial<Agent>) => void
  deleteAgent: (id: string) => void
}

export const createAgentsSlice: StateCreator<Store, [], [], AgentsSlice> = (set) => ({
  agents: [],
  loadingAgents: false,
  hasFetchedAgents: false,
  fetchAgents: async () => {
    set({ loadingAgents: true })
    try {
      const agents = await AgentsService.getAll()
      set({ agents, hasFetchedAgents: true })
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    } finally {
      set({ loadingAgents: false })
    }
  },
  addAgent: async (agent) => {
    const newAgent = await AgentsService.create(agent)
    set((state) => ({
      agents: [...state.agents, newAgent]
    }))
  },
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteAgent: (id) => set((state) => ({
    agents: state.agents.filter(a => a.id !== id)
  }))
})
