import type { Task } from '@/store/slices/tasksSlice'
import type { NewTaskForm, TaskFilter } from '../types'
import { TASK_PRIORITIES, priorityVariant } from '../constants'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Agent } from '@/store/slices/agentsSlice'
import {
  CheckSquare, Plus, MoreVertical, Clock, Calendar, Trash2,
  CheckCircle, Circle,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

// ─── TASKS LIST ──────────────────────────────────────────────────────────────

interface TasksListProps {
  tasks: Task[]
  filter: TaskFilter
  getAgentName: (id?: string) => string
  isOverdue: (task: Task) => boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TasksList({ tasks, filter, getAgentName, isOverdue, onToggle, onDelete }: TasksListProps) {
  const emptyLabel = filter === 'pending' ? 'pendientes' : filter === 'completed' ? 'completadas' : ''
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-outline-variant/50">
          {tasks.length === 0 ? (
            <div className="p-12 text-center">
              <CheckSquare className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No hay tareas {emptyLabel}</p>
            </div>
          ) : tasks.map((task) => {
            const overdue = isOverdue(task)
            return (
              <div
                key={task.id}
                className={cn('flex items-center gap-4 p-4 hover:bg-neutral-50/50 transition-colors', task.status === 'Completada' && 'opacity-60')}
              >
                <button onClick={() => onToggle(task.id)} className="shrink-0">
                  {task.status === 'Completada'
                    ? <CheckCircle className="h-5 w-5 text-success-500" />
                    : <Circle className={cn('h-5 w-5', overdue ? 'text-error-500' : 'text-neutral-400')} />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn('font-medium', task.status === 'Completada' && 'line-through text-neutral-500')}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                    {task.due_date && (
                      <span className={cn('flex items-center gap-1', overdue && 'text-error-500 font-medium')}>
                        <Calendar className="h-3 w-3" />
                        {formatDate(task.due_date)}
                        {overdue && ' (Vencida)'}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getAgentName(task.assigned_to)}
                    </span>
                  </div>
                </div>
                <Badge variant={priorityVariant[task.priority]} className="shrink-0">{task.priority}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onToggle(task.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {task.status === 'Completada' ? 'Reabrir' : 'Completar'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-error-500">
                      <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── NEW TASK MODAL ───────────────────────────────────────────────────────────

interface NewTaskModalProps {
  open: boolean
  form: NewTaskForm
  agents: Agent[]
  onFormChange: (f: NewTaskForm) => void
  onSave: () => void
  onCancel: () => void
}

export function NewTaskModal({ open, form, agents, onFormChange, onSave, onCancel }: NewTaskModalProps) {
  const field = <K extends keyof NewTaskForm>(key: K, value: NewTaskForm[K]) =>
    onFormChange({ ...form, [key]: value })

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader><DialogTitle>Nueva Tarea</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Título *</label>
            <Input
              id="task-title"
              placeholder="Ej: Llamar a María González"
              value={form.title}
              onChange={e => field('title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Fecha de Vencimiento</label>
              <Input
                id="task-due-date"
                type="date"
                value={form.due_date}
                onChange={e => field('due_date', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Prioridad</label>
              <Select value={form.priority} onValueChange={v => field('priority', v as NewTaskForm['priority'])}>
                <SelectTrigger id="task-priority" className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Asignar a</label>
            <Select value={form.assigned_to || '__none__'} onValueChange={v => field('assigned_to', v === '__none__' ? '' : v)}>
              <SelectTrigger id="task-agent" className="w-full mt-1">
                <SelectValue placeholder="Sin asignar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sin asignar</SelectItem>
                {agents.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onSave}><Plus className="h-4 w-4 mr-2" />Crear Tarea</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────

interface DeleteTaskDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteTaskDialog({ open, onClose, onConfirm }: DeleteTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>¿Eliminar tarea?</DialogTitle></DialogHeader>
        <p className="text-neutral-600 py-4">Esta acción no se puede deshacer.</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Eliminar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
