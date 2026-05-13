export type VisitStatus = 'Programada' | 'Completada' | 'Cancelada'
export type { Visit } from '@/store/slices/visitsSlice'

export interface NewVisitForm {
  property_id: string
  lead_id: string
  date: string
  time: string
  agent: string
  notes: string
}

export const NEW_VISIT_DEFAULT: NewVisitForm = {
  property_id: '',
  lead_id: '',
  date: '',
  time: '',
  agent: '',
  notes: '',
}
