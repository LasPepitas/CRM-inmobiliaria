export interface LeadPaymentConfig {
  type: 'contado' | 'cuotas' | 'hipoteca'
  installments?: number
  down_payment?: number
  monthly?: number
  bank?: string
  notes?: string
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  source: 'Web' | 'Referido' | 'Contacto' | 'Redes' | 'Expo'
  phone: string
  email: string
  stage: 'NUEVO' | 'CONTACTADO' | 'VISITA' | 'NEGOCIACION' | 'CIERRE'
  assigned_agent: string
  score: number
  last_contact: string
  budget: number
  notes: string
  payment_config?: LeadPaymentConfig
  status: 'Activo' | 'No Interesado' | 'Pausado' | 'Convertido'
  discard_reason?: string
  discarded_at?: string
}

export type LeadStage = Lead['stage']
export type LeadSource = Lead['source']
export type LeadStatus = Lead['status']

export interface LeadApiResponse {
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

export interface ConvertLeadPayload {
  property_id: string
  value: number
  probability: number
  expected_close: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}
