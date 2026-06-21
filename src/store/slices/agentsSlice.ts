import type { StateCreator } from 'zustand'
import type { Store } from '@/store'
import { agentsApi } from '@/features/leads/api/agentsApi'

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
  fetchAgents: () => Promise<void>
  addAgent: (agent: Omit<Agent, 'id'>) => void
  updateAgent: (id: string, agent: Partial<Agent>) => void
  deleteAgent: (id: string) => void
}

export const createAgentsSlice: StateCreator<Store, [], [], AgentsSlice> = (set) => ({
  agents: [],
  loadingAgents: false,
  fetchAgents: async () => {
    set({ loadingAgents: true })
    try {
      const agents = await agentsApi.getAll()
      set({ agents })
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    } finally {
      set({ loadingAgents: false })
    }
  },
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
