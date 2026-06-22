import { apiClient } from '@/lib/api-client'
import type { Deal } from '@/store/slices/dealsSlice'
import type { DealStage } from '../types'

// ─── DTOs del backend ─────────────────────────────────────────────────────────

export interface BackendDealNote {
  id: string
  text: string
  authorId: string | null
  dealId: string
  createdAt: string
  author?: {
    id: string
    firstName: string
    lastName: string
  } | null
}

export interface BackendDeal {
  id: string
  title: string
  value: string | number | null
  probability: number
  stage: string
  expectedClose: string | null
  leadId: string
  propertyId: string | null
  advisorId: string
  createdAt: string
  updatedAt: string
  notes?: BackendDealNote[]
  lead?: {
    id: string
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
    status: string
  }
  advisor?: {
    id: string
    firstName: string
    lastName: string
  }
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

const STAGE_TO_FRONTEND: Record<string, DealStage> = {
  NUEVO: 'Nuevo',
  CONTACTADO: 'Contactado',
  VISITA: 'Visita',
  NEGOCIACION: 'Negociacion',
  CIERRE: 'Cierre',
  CANCELADO: 'Cancelado' as DealStage
}

const STAGE_TO_BACKEND: Record<string, string> = {
  Nuevo: 'NUEVO',
  Contactado: 'CONTACTADO',
  Visita: 'VISITA',
  Negociacion: 'NEGOCIACION',
  Cierre: 'CIERRE',
  Cancelado: 'CANCELADO'
}

export function toFrontendDeal(deal: BackendDeal): Deal {
  return {
    id: deal.id,
    title: deal.title,
    value: typeof deal.value === 'string' ? parseFloat(deal.value) : (deal.value || 0),
    probability: deal.probability,
    stage: STAGE_TO_FRONTEND[deal.stage] || 'Nuevo',
    expected_close: deal.expectedClose ? deal.expectedClose.split('T')[0] : '',
    last_update: deal.updatedAt ? deal.updatedAt.split('T')[0] : '',
    lead_id: deal.leadId,
    property_id: deal.propertyId || '',
    notes: deal.notes?.map(note => ({
      id: note.id,
      text: note.text,
      timestamp: note.createdAt,
      author: note.author ? `${note.author.firstName} ${note.author.lastName}` : 'Sistema'
    })) || []
  }
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const pipelineApi = {
  getAll: () =>
    apiClient.get<BackendDeal[]>('/pipeline'),

  getById: (id: string) =>
    apiClient.get<BackendDeal>(`/pipeline/${id}`),

  updateStage: (id: string, stage: DealStage) =>
    apiClient.patch<BackendDeal>(`/pipeline/${id}/stage`, { stage: STAGE_TO_BACKEND[stage] || stage }),

  addNote: (id: string, text: string) =>
    apiClient.post<BackendDealNote>(`/pipeline/${id}/notes`, { text }),

  remove: (id: string) =>
    apiClient.delete<void>(`/pipeline/${id}`)
}
