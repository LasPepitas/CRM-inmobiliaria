import type { StateCreator } from 'zustand'
import type { Store } from '../index'
import type { Lead } from '../../features/leads/types'
import { leadsApi } from '../../features/leads/api/leadsApi'

export interface LeadsSlice {
  leads: Lead[]
  loadingLeads: boolean
  fetchLeads: () => Promise<void>
  addLead: (lead: Omit<Lead, 'id'>) => Promise<void>
  updateLead: (id: string, lead: Partial<Lead>) => Promise<void>
  deleteLead: (id: string) => Promise<void>
  updateLeadPayment: (id: string, config: NonNullable<Lead['payment_config']>) => Promise<void>
  discardLead: (id: string, reason: string, notes?: string) => Promise<void>
  reactivateLead: (id: string) => Promise<void>
}

export const createLeadsSlice: StateCreator<Store, [], [], LeadsSlice> = (set) => ({
  leads: [],
  loadingLeads: false,
  
  fetchLeads: async () => {
    set({ loadingLeads: true })
    try {
      const leads = await leadsApi.getAll()
      set({ leads })
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    } finally {
      set({ loadingLeads: false })
    }
  },

  addLead: async (lead) => {
    try {
      const newLead = await leadsApi.create(lead)
      set((state) => ({ leads: [newLead, ...state.leads] }))
    } catch (error) {
      console.error('Failed to create lead:', error)
      throw error
    }
  },

  updateLead: async (id, updates) => {
    try {
      const updatedLead = await leadsApi.update(id, updates)
      set((state) => ({
        leads: state.leads.map(l => l.id === id ? updatedLead : l)
      }))
    } catch (error) {
      console.error('Failed to update lead:', error)
      throw error
    }
  },

  deleteLead: async (id) => {
    try {
      await leadsApi.remove(id)
      set((state) => ({
        leads: state.leads.filter(l => l.id !== id)
      }))
    } catch (error) {
      console.error('Failed to delete lead:', error)
      throw error
    }
  },

  updateLeadPayment: async (id, config) => {
    try {
      const updatedLead = await leadsApi.configurePayment(id, config)
      set((state) => ({
        leads: state.leads.map(l => l.id === id ? updatedLead : l)
      }))
    } catch (error) {
      console.error('Failed to update payment config:', error)
      throw error
    }
  },

  discardLead: async (id, reason, notes) => {
    try {
      const updatedLead = await leadsApi.discard(id, reason, notes)
      set((state) => ({
        leads: state.leads.map(l => l.id === id ? updatedLead : l),
        deals: state.deals.map(d => d.lead_id === id
          ? { ...d, stage: 'Cancelado' as const, last_update: new Date().toISOString().split('T')[0] }
          : d
        )
      }))
    } catch (error) {
      console.error('Failed to discard lead:', error)
      throw error
    }
  },

  reactivateLead: async (id) => {
    try {
      const updatedLead = await leadsApi.reactivate(id)
      set((state) => ({
        leads: state.leads.map(l => l.id === id ? updatedLead : l),
        deals: state.deals.map(d => d.lead_id === id && d.stage === 'Cancelado'
          ? { ...d, stage: 'Nuevo' as const, last_update: new Date().toISOString().split('T')[0] }
          : d
        )
      }))
    } catch (error) {
      console.error('Failed to reactivate lead:', error)
      throw error
    }
  }
})
