// src/store/slices/visitsSlice.ts
// Slice async de visitas — conectado al backend via appointmentsApi.
// Ya no usa mocks en memoria.

import type { StateCreator } from 'zustand'
import type { Store } from '@/store'
import { appointmentsApi, toVisit, toCreatePayload, toBackendStatus } from '@/features/visitas/api/appointmentsApi'
import type { NewVisitForm } from '@/features/visitas/types'

export interface Visit {
  id: string
  property_id: string
  lead_id: string
  date: string            // "YYYY-MM-DD"
  time: string            // "HH:MM"
  status: 'Programada' | 'Completada' | 'Cancelada'
  agent: string           // advisorId (UUID del backend)
  notes: string
}

export interface VisitsSlice {
  visits: Visit[]
  visitsLoading: boolean
  visitsError: string | null

  fetchVisits: () => Promise<void>
  addVisit: (form: NewVisitForm & { title?: string }, propertyTitle?: string) => Promise<void>
  updateVisit: (id: string, updates: Partial<Visit>) => Promise<void>
  removeVisit: (id: string) => Promise<void>
}

export const createVisitsSlice: StateCreator<Store, [], [], VisitsSlice> = (set) => ({
  visits: [],
  visitsLoading: false,
  visitsError: null,

  fetchVisits: async () => {
    set({ visitsLoading: true, visitsError: null })
    try {
      const data = await appointmentsApi.getAll()
      set({ visits: data.map(toVisit), visitsLoading: false })
    } catch (err) {
      set({
        visitsError: err instanceof Error ? err.message : 'Error al cargar visitas',
        visitsLoading: false,
      })
    }
  },

  addVisit: async (form, propertyTitle) => {
    const payload = toCreatePayload(form, propertyTitle)
    const created = await appointmentsApi.create(payload)
    set((state) => ({ visits: [...state.visits, toVisit(created)] }))
  },

  updateVisit: async (id, updates) => {
    const payload: Record<string, unknown> = {}
    if (updates.status) payload['status'] = toBackendStatus(updates.status)
    if (updates.notes !== undefined) payload['notes'] = updates.notes
    if (updates.date || updates.time) {
      // Si se cambia fecha u hora hay que reconstruir el startTime
      // El caller debe proveer ambos valores en ese caso
    }

    const updated = await appointmentsApi.update(id, payload)
    set((state) => ({
      visits: state.visits.map((v) => (v.id === id ? toVisit(updated) : v)),
    }))
  },

  removeVisit: async (id) => {
    await appointmentsApi.remove(id)
    set((state) => ({ visits: state.visits.filter((v) => v.id !== id) }))
  },
})
