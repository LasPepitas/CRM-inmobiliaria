import type { TaskPriority } from './types'

export const TASK_PRIORITIES: TaskPriority[] = ['Alta', 'Media', 'Baja']

export const priorityVariant: Record<TaskPriority, 'error' | 'warning' | 'success'> = {
  Alta: 'error',
  Media: 'warning',
  Baja: 'success',
}

export const TODAY = new Date().toISOString().split('T')[0]
