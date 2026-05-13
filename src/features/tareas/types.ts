import type { Task } from '@/store/slices/tasksSlice'

export type TaskPriority = Task['priority']
export type TaskStatus = Task['status']
export type TaskFilter = 'all' | 'pending' | 'completed'

export type { Task } from '@/store/slices/tasksSlice'

export interface NewTaskForm {
  title: string
  due_date: string
  priority: TaskPriority
  assigned_to: string
}

export const NEW_TASK_DEFAULT: NewTaskForm = {
  title: '',
  due_date: '',
  priority: 'Media',
  assigned_to: '',
}
