import type { StateCreator } from 'zustand'
import type { Store } from '@/store'

export interface Task {
  id: string
  title: string
  due_date: string
  priority: 'Alta' | 'Media' | 'Baja'
  status: 'Pendiente' | 'Completada'
  assigned_to?: string
}

const mockTasks: Task[] = [
  { id: '1', title: 'Llamar a Juan', due_date: '2024-04-16', priority: 'Alta', status: 'Pendiente', assigned_to: '1' },
  { id: '2', title: 'Enviar contrato a María', due_date: '2024-04-17', priority: 'Media', status: 'Pendiente', assigned_to: '2' },
  { id: '3', title: 'Enviar avaluo a cliente Nordelta', due_date: '2024-04-18', priority: 'Media', status: 'Pendiente', assigned_to: '2' },
  { id: '4', title: 'Programar visita Casa Palermo', due_date: '2024-04-19', priority: 'Media', status: 'Pendiente', assigned_to: '1' },
  { id: '5', title: 'Actualizar estado leads en CRM', due_date: '2024-04-20', priority: 'Baja', status: 'Pendiente', assigned_to: '3' },
  { id: '6', title: 'Revisar contratos pendientes', due_date: '2024-04-21', priority: 'Media', status: 'Pendiente', assigned_to: '4' },
  { id: '7', title: 'Contactar referidos expo', due_date: '2024-04-22', priority: 'Baja', status: 'Pendiente', assigned_to: '2' },
  { id: '8', title: 'Preparar presentación nuevos proyectos', due_date: '2024-04-23', priority: 'Alta', status: 'Pendiente', assigned_to: '1' },
]

export interface TasksSlice {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
}

export const createTasksSlice: StateCreator<Store, [], [], TasksSlice> = (set) => ({
  tasks: mockTasks,
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: String(state.tasks.length + 1) }]
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  }))
})
