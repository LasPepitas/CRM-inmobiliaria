import type { Document } from '@/store/slices/documentsSlice'

export type DocType = Document['type']
export type DocStatus = Document['status']
export type ContractType = 'compra' | 'alquiler'

export type { Document } from '@/store/slices/documentsSlice'

export interface NewDocForm {
  name: string
  type: DocType
  property_id: string
  lead_id: string
  status: DocStatus
}

export const NEW_DOC_DEFAULT: NewDocForm = {
  name: '',
  type: 'Contrato',
  property_id: '',
  lead_id: '',
  status: 'Borrador',
}

export interface WizardData {
  lead_id: string
  deal_id: string
  property_id: string
  type: ContractType
}

export const WIZARD_DEFAULT: WizardData = {
  lead_id: '',
  deal_id: '',
  property_id: '',
  type: 'compra',
}
