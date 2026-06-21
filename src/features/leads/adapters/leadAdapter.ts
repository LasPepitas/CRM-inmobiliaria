import type { Lead, LeadPaymentConfig } from '../types'

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

export function adaptExternalLead(apiData: LeadApiResponse): Lead {
  return {
    id: apiData.id,
    firstName: apiData.firstName || '',
    lastName: apiData.lastName || '',
    source: (apiData.source as Lead['source']) || 'Web',
    phone: apiData.phone || '',
    email: apiData.email || '',
    stage: (apiData.stage as Lead['stage']) || 'Nuevo',
    assigned_agent: apiData.advisorId || '1',
    score: apiData.score || 0,
    last_contact: apiData.lastContact ? new Date(apiData.lastContact).toISOString() : '',
    budget: apiData.budget ? Number(apiData.budget) : 0,
    notes: apiData.notes || '',
    payment_config: apiData.paymentConfig || undefined,
    status: apiData.status === 'ACTIVO' ? 'Activo' : (apiData.status === 'NO_INTERESADO' ? 'No Interesado' : 'Pausado'),
    discard_reason: apiData.discardReason || undefined,
    discarded_at: apiData.discardedAt ? new Date(apiData.discardedAt).toISOString() : undefined,
  }
}
