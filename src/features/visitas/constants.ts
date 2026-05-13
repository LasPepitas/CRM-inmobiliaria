import type { VisitStatus } from './types'

export const VISIT_STATUSES: VisitStatus[] = ['Programada', 'Completada', 'Cancelada']

export const statusBadgeVariant: Record<VisitStatus, 'outline' | 'success' | 'error'> = {
  Programada: 'outline',
  Completada: 'success',
  Cancelada: 'error',
}

export const statusCalendarClass: Record<VisitStatus, string> = {
  Completada: 'bg-success-500/10 text-success-600',
  Cancelada: 'bg-error-500/10 text-error-600',
  Programada: 'bg-secondary/10 text-secondary-600',
}

export const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Static calendar config (April 2024 demo)
export const CALENDAR_CONFIG = {
  year: 2024,
  month: 3, // April (0-indexed)
  label: new Date(2024, 3, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
  daysInMonth: new Date(2024, 4, 0).getDate(),
  firstWeekday: new Date(2024, 3, 1).getDay(),
  todayDay: 15,
}
