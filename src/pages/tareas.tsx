import { useState } from 'react'
import { useStore } from '@/store'
import type { Task } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CheckSquare,
  Plus,
  MoreVertical,
  Clock,
  Bell,
  Calendar,
  Trash2,
  CheckCircle,
  Circle,
  AlertCircle,
  Zap,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

const priorityVariants: Record<string, 'error' | 'warning' | 'success'> = {
  'Alta': 'error',
  'Media': 'warning',
  'Baja': 'success',
}

export function TareasPage() {
  const { tasks, agents, addTask, updateTask, deleteTask, addToast } = useStore()
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [agentTaskFilter, setAgentTaskFilter] = useState('')
  const [newTask, setNewTask] = useState({
    title: '',
    due_date: '',
    priority: 'Media' as Task['priority'],
    assigned_to: '',
  })

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = filter === 'all' || (filter === 'pending' ? t.status === 'Pendiente' : t.status === 'Completada')
    const matchesAgent = !agentTaskFilter || t.assigned_to === agentTaskFilter
    return matchesStatus && matchesAgent
  })

  const getAgentName = (agentId?: string) => {
    if (!agentId) return 'Sin asignar'
    return agents.find(a => a.id === agentId)?.name || 'Sin asignar'
  }

  const handleAddTask = () => {
    if (!newTask.title) {
      addToast({ title: 'Error', description: 'Ingresá el título de la tarea', variant: 'error' })
      return
    }
    addTask({
      ...newTask,
      status: 'Pendiente',
    })
    addToast({ title: 'Tarea creada', description: `${newTask.title}`, variant: 'success' })
    setShowNewTaskModal(false)
    setNewTask({ title: '', due_date: '', priority: 'Media', assigned_to: '' })
  }

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    const newStatus = task?.status === 'Completada' ? 'Pendiente' : 'Completada'
    updateTask(taskId, { status: newStatus })
    addToast({
      title: newStatus === 'Completada' ? 'Tarea completada' : 'Tarea reabierta',
      description: task?.title,
      variant: newStatus === 'Completada' ? 'success' : 'default'
    })
  }

  const handleDeleteTask = () => {
    if (!deleteConfirm) return
    const task = tasks.find(t => t.id === deleteConfirm)
    deleteTask(deleteConfirm)
    addToast({ title: 'Tarea eliminada', description: task?.title, variant: 'success' })
    setDeleteConfirm(null)
  }

  const pendingTasks = tasks.filter(t => t.status === 'Pendiente')
  const todayTasks = pendingTasks.filter(t => t.due_date === new Date().toISOString().split('T')[0])
  const overdueTasks = pendingTasks.filter(t => t.due_date && t.due_date < new Date().toISOString().split('T')[0])
  const completedTasks = tasks.filter(t => t.status === 'Completada')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Tareas</h1>
          <p className="text-neutral-600 mt-1">Automatización y gestión de tareas</p>
        </div>
        <Button onClick={() => setShowNewTaskModal(true)}>
          <Plus className="h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      {/* Resumen Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold font-heading text-primary">{pendingTasks.length}</p>
            <p className="text-xs text-neutral-500 uppercase mt-1">Pendientes</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning-500/10 to-warning-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold font-heading text-warning-500">{todayTasks.length}</p>
            <p className="text-xs text-neutral-500 uppercase mt-1">Para Hoy</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-error-500/10 to-error-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold font-heading text-error-500">{overdueTasks.length}</p>
            <p className="text-xs text-neutral-500 uppercase mt-1">Vencidas</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success-500/10 to-success-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold font-heading text-success-500">{completedTasks.length}</p>
            <p className="text-xs text-neutral-500 uppercase mt-1">Completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
          </Button>
        ))}
        <div className="h-6 w-px bg-outline-variant mx-1" />
        <select
          className="h-9 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1 text-sm"
          value={agentTaskFilter}
          onChange={e => setAgentTaskFilter(e.target.value)}
        >
          <option value="">Todos los asesores</option>
          {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        {agentTaskFilter && (
          <Button variant="outline" size="sm" onClick={() => setAgentTaskFilter('')} className="text-error-500 border-error-500/30">
            Limpiar asesor
          </Button>
        )}
        <span className="ml-auto text-sm text-neutral-500">{filteredTasks.length} tareas</span>
      </div>

      {/* Tasks List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-outline-variant/50">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <CheckSquare className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">No hay tareas {filter !== 'all' ? filter === 'pending' ? 'pendientes' : 'completadas' : ''}</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isOverdue = task.status === 'Pendiente' && task.due_date && task.due_date < new Date().toISOString().split('T')[0]
                return (
                  <div key={task.id} className={cn("flex items-center gap-4 p-4 hover:bg-neutral-50/50 transition-colors", task.status === 'Completada' && 'opacity-60')}>
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className="shrink-0"
                    >
                      {task.status === 'Completada' ? (
                        <CheckCircle className="h-5 w-5 text-success-500" />
                      ) : (
                        <Circle className={cn("h-5 w-5", isOverdue ? 'text-error-500' : 'text-neutral-400')} />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-medium", task.status === 'Completada' && 'line-through text-neutral-500')}>{task.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                        {task.due_date && (
                          <span className={cn("flex items-center gap-1", isOverdue && 'text-error-500 font-medium')}>
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.due_date)}
                            {isOverdue && '(Vencida)'}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getAgentName(task.assigned_to)}
                        </span>
                      </div>
                    </div>
                    <Badge variant={priorityVariants[task.priority]} className="shrink-0">
                      {task.priority}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleComplete(task.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {task.status === 'Completada' ? 'Reabrir' : 'Completar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteConfirm(task.id)} className="text-error-500">
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Automatización Info Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold font-heading">Automatizaciones Disponibles</h3>
              <p className="text-sm text-neutral-600 mt-1 mb-4">
                Las automatizaciones te permiten programan acciones repetitivas. Configurá alertas automáticas para:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded-md">
                  <Bell className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Recordatorios</p>
                  <p className="text-xs text-neutral-500">Alertas antes de visitas y cierres</p>
                </div>
                <div className="p-3 bg-white rounded-md">
                  <Clock className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Seguimiento</p>
                  <p className="text-xs text-neutral-500">Contactar leads sin actividad</p>
                </div>
                <div className="p-3 bg-white rounded-md">
                  <AlertCircle className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Notificaciones</p>
                  <p className="text-xs text-neutral-500">Tareas vencidas y nuevos leads</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Task Modal */}
      <Dialog open={showNewTaskModal} onOpenChange={setShowNewTaskModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nueva Tarea</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input placeholder="Ej: Llamar a María González" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Fecha de Vencimiento</label>
                <Input type="date" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Prioridad</label>
                <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Asignar a</label>
              <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" value={newTask.assigned_to} onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}>
                <option value="">Sin asignar</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTaskModal(false)}>Cancelar</Button>
            <Button onClick={handleAddTask}><Plus className="h-4 w-4 mr-2" />Crear Tarea</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>¿Eliminar tarea?</DialogTitle></DialogHeader>
          <p className="text-neutral-600 py-4">Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteTask}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
