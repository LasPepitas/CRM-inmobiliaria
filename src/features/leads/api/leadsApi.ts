import { apiClient } from '@/lib/api-client'
import { adaptExternalLead } from '../adapters/leadAdapter'
import type { Lead, LeadPaymentConfig } from '../types'

// ─── DTO del backend ───────────────────────────────────────────────────────────
interface LeadApiResponse {
  id: string
  firstName?: string
  lastName?: string
  source?: string
  phone?: string
  email?: string
  stage?: string
  advisorId?: string
  score?: number
  lastContact?: string
  budget?: number | string
  notes?: string
  paymentConfig?: LeadPaymentConfig
  status?: string
  discardReason?: string
  discardedAt?: string
}

interface ConvertLeadPayload {
  property_id: string
  value: number
  probability: number
  expected_close: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const leadsApi = {
  getAll: async (status?: string, stage?: string[], search?: string): Promise<Lead[]> => {
    const params: Record<string, string> = {}
    if (status) params.status = status
    if (stage && stage.length > 0) params.stage = stage.join(',')
    if (search) params.search = search

    const response = await apiClient.get<ApiResponse<LeadApiResponse[]>>('/leads', { params })
    return (response.data.data || []).map(adaptExternalLead)
  },

  create: async (leadData: Partial<Lead>): Promise<Lead> => {
    const payload = {
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone,
      source: leadData.source,
      score: leadData.score,
      budget: leadData.budget,
      notes: leadData.notes,
      assigned_agent: leadData.assigned_agent,
    }
    const response = await apiClient.post<ApiResponse<LeadApiResponse>>('/leads', payload)
    return adaptExternalLead(response.data.data)
  },

  update: async (id: string, leadData: Partial<Lead>): Promise<Lead> => {
    const statusMap: Record<string, string> = { Activo: 'ACTIVO', 'No Interesado': 'NO_INTERESADO', Pausado: 'PAUSADO' }
    const payload = {
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone,
      source: leadData.source,
      score: leadData.score,
      budget: leadData.budget,
      notes: leadData.notes,
      assigned_agent: leadData.assigned_agent,
      stage: leadData.stage,
      status: leadData.status ? statusMap[leadData.status] : undefined,
    }
    const response = await apiClient.put<ApiResponse<LeadApiResponse>>(`/leads/${id}`, payload)
    return adaptExternalLead(response.data.data)
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/leads/${id}`)
  },

  discard: async (id: string, reason: string, notes?: string): Promise<Lead> => {
    const response = await apiClient.post<ApiResponse<LeadApiResponse>>(`/leads/${id}/discard`, { reason, notes })
    return adaptExternalLead(response.data.data)
  },

  reactivate: async (id: string): Promise<Lead> => {
    const response = await apiClient.post<ApiResponse<LeadApiResponse>>(`/leads/${id}/reactivate`, {})
    return adaptExternalLead(response.data.data)
  },

  configurePayment: async (id: string, config: LeadPaymentConfig): Promise<Lead> => {
    const response = await apiClient.put<ApiResponse<LeadApiResponse>>(`/leads/${id}/payment-config`, config)
    return adaptExternalLead(response.data.data)
  },

  convertToDeal: async (id: string, payload: ConvertLeadPayload): Promise<unknown> => {
    const response = await apiClient.post<ApiResponse<unknown>>(`/leads/${id}/convert`, payload)
    return response.data.data
  }
}
