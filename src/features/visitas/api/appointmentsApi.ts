import { apiClient } from '@/lib/api-client'
import type { Visit } from '@/store/slices/visitsSlice'
import type { NewVisitForm } from '../types'

// ─── DTOs del backend ─────────────────────────────────────────────────────────

export interface AppointmentResponse {
  id: string
  title: string
  startTime: string       
  endTime: string         
  status: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA'
  notes: string | null
  location: string | null
  googleEventId: string | null
  advisorId: string
  leadId: string | null
  propertyId: string | null
  advisor: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  lead: { id: string; firstName: string; lastName: string } | null
  property: { id: string; title: string } | null
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentPayload {
  title: string           // Requerido por el backend
  startTime: string       // ISO 8601
  endTime: string         // ISO 8601
  notes?: string
  location?: string
  leadId?: string
  propertyId?: string
  advisorId?: string
}

export type UpdateAppointmentPayload = Partial<CreateAppointmentPayload>

// ─── Mapas de status ──────────────────────────────────────────────────────────

const STATUS_TO_FRONTEND: Record<string, Visit['status']> = {
  PROGRAMADA: 'Programada',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
}

const STATUS_TO_BACKEND: Record<string, string> = {
  Programada: 'PROGRAMADA',
  Completada: 'COMPLETADA',
  Cancelada: 'CANCELADA',
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

/**
 * Convierte la respuesta del backend al tipo Visit que usa el frontend.
 * Backend: ISO 8601 startTime → Frontend: date "YYYY-MM-DD" + time "HH:MM"
 */
export function toVisit(appt: AppointmentResponse): Visit {
  const start = new Date(appt.startTime)
  return {
    id: appt.id,
    property_id: appt.propertyId ?? '',
    lead_id: appt.leadId ?? '',
    date: start.toISOString().split('T')[0],
    time: start.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    status: STATUS_TO_FRONTEND[appt.status] ?? 'Programada',
    agent: appt.advisorId,
    notes: appt.notes ?? '',
  }
}

/**
 * Convierte el formulario del frontend al payload que espera el backend.
 * Combina date + time en un ISO string. Auto-genera el título si no se provee.
 */
export function toCreatePayload(
  form: NewVisitForm,
  propertyTitle?: string
): CreateAppointmentPayload {
  const startISO = new Date(`${form.date}T${form.time || '09:00'}:00`).toISOString()
  const endISO = new Date(
    new Date(`${form.date}T${form.time || '09:00'}:00`).getTime() + 60 * 60 * 1000
  ).toISOString()

  const title =
    form.title?.trim() ||
    (propertyTitle ? `Visita: ${propertyTitle}` : 'Visita programada')

  return {
    title,
    startTime: startISO,
    endTime: endISO,
    notes: form.notes || undefined,
    location: form.location || undefined,
    leadId: form.lead_id || undefined,
    propertyId: form.property_id || undefined,
    advisorId: form.agent || undefined,
  }
}

/**
 * Mapea status del frontend al formato UPPERCASE que acepta el backend.
 */
export function toBackendStatus(status: Visit['status']): string {
  return STATUS_TO_BACKEND[status] ?? 'PROGRAMADA'
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const appointmentsApi = {
  /** GET /appointments — lista filtrada por RBAC automáticamente */
  getAll: () =>
    apiClient.get<AppointmentResponse[]>('/appointments'),

  /** GET /appointments/:id */
  getById: (id: string) =>
    apiClient.get<AppointmentResponse>(`/appointments/${id}`),

  /** POST /appointments */
  create: (payload: CreateAppointmentPayload) =>
    apiClient.post<AppointmentResponse>('/appointments', payload),

  /** PATCH /appointments/:id */
  update: (id: string, payload: UpdateAppointmentPayload) =>
    apiClient.patch<AppointmentResponse>(`/appointments/${id}`, payload),

  /** DELETE /appointments/:id */
  remove: (id: string) =>
    apiClient.delete<AppointmentResponse>(`/appointments/${id}`),
}
