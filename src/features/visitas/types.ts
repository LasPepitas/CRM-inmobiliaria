export type VisitStatus = 'Programada' | 'Completada' | 'Cancelada'
export type { Visit } from '@/store/slices/visitsSlice'

export interface NewVisitForm {
  property_id: string
  lead_id: string
  date: string
  time: string
  agent: string
  notes: string
  // Campos adicionales para el backend/Google Calendar
  title?: string      // Si vacío, se auto-genera: "Visita: {propertyTitle}"
  location?: string   // Dirección — se pasa a Google Calendar como location del evento
  endTime?: string    // Si no se provee, el adapter asume startTime + 1 hora
}

export const NEW_VISIT_DEFAULT: NewVisitForm = {
  property_id: '',
  lead_id: '',
  date: '',
  time: '',
  agent: '',
  notes: '',
  title: '',
  location: '',
}
