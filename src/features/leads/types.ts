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
  name: string
  source: 'Web' | 'Referido' | 'Contacto' | 'Redes' | 'Expo'
  phone: string
  email: string
  stage: 'Nuevo' | 'Contactado' | 'Visita' | 'Negociacion' | 'Cierre'
  assigned_agent: string
  score: number
  last_contact: string
  budget: number
  notes: string
  payment_config?: LeadPaymentConfig
  status: 'Activo' | 'No Interesado' | 'Pausado'
  discard_reason?: string
  discarded_at?: string
}

export type LeadStage = Lead['stage']
export type LeadSource = Lead['source']
export type LeadStatus = Lead['status']
