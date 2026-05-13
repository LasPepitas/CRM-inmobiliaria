import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import type { TaskFilter, NewTaskForm } from '../types'
import { NEW_TASK_DEFAULT } from '../types'
import { TODAY } from '../constants'

export function useTareas() {
  const { tasks, agents, addTask, updateTask, deleteTask, addToast } = useStore()

  const [filter, setFilter] = useState<TaskFilter>('all')
  const [agentFilter, setAgentFilter] = useState('')
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState<NewTaskForm>(NEW_TASK_DEFAULT)

  const filteredTasks = useMemo(
    () => tasks.filter(t => {
      const matchesStatus =
        filter === 'all' ||
        (filter === 'pending' ? t.status === 'Pendiente' : t.status === 'Completada')
      const matchesAgent = !agentFilter || t.assigned_to === agentFilter
      return matchesStatus && matchesAgent
    }),
    [tasks, filter, agentFilter]
  )

  const taskStats = useMemo(() => {
    const pending = tasks.filter(t => t.status === 'Pendiente')
    return {
      pending: pending.length,
      today: pending.filter(t => t.due_date === TODAY).length,
      overdue: pending.filter(t => t.due_date && t.due_date < TODAY).length,
      completed: tasks.filter(t => t.status === 'Completada').length,
    }
  }, [tasks])

  const getAgentName = (agentId?: string) =>
    agentId ? agents.find(a => a.id === agentId)?.name || 'Sin asignar' : 'Sin asignar'

  const isOverdue = (task: { status: string; due_date?: string }) =>
    task.status === 'Pendiente' && !!task.due_date && task.due_date < TODAY

  const handleAddTask = () => {
    if (!newTask.title) {
      addToast({ title: 'Error', description: 'Ingresá el título de la tarea', variant: 'error' })
      return
    }
    addTask({ ...newTask, status: 'Pendiente' })
    addToast({ title: 'Tarea creada', description: newTask.title, variant: 'success' })
    setShowNewTaskModal(false)
    setNewTask(NEW_TASK_DEFAULT)
  }

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    const newStatus = task?.status === 'Completada' ? 'Pendiente' : 'Completada'
    updateTask(taskId, { status: newStatus })
    addToast({
      title: newStatus === 'Completada' ? 'Tarea completada' : 'Tarea reabierta',
      description: task?.title,
      variant: newStatus === 'Completada' ? 'success' : 'default',
    })
  }

  const handleDeleteTask = () => {
    if (!deleteConfirmId) return
    const task = tasks.find(t => t.id === deleteConfirmId)
    deleteTask(deleteConfirmId)
    addToast({ title: 'Tarea eliminada', description: task?.title, variant: 'success' })
    setDeleteConfirmId(null)
  }

  return {
    agents,
    filteredTasks,
    taskStats,
    filter,
    agentFilter,
    showNewTaskModal,
    deleteConfirmId,
    newTask,
    setFilter,
    setAgentFilter,
    setShowNewTaskModal,
    setDeleteConfirmId,
    setNewTask,
    getAgentName,
    isOverdue,
    handleAddTask,
    handleToggleComplete,
    handleDeleteTask,
  }
}
