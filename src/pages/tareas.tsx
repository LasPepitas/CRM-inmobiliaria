import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Bell, Clock, AlertCircle, Zap } from 'lucide-react'
import { TasksList, NewTaskModal, DeleteTaskDialog, useTareas } from '@/features/tareas'

const FILTER_LABELS = { all: 'Todas', pending: 'Pendientes', completed: 'Completadas' } as const

export function TareasPage() {
  const {
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
  } = useTareas()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Tareas</h1>
          <p className="text-neutral-600 mt-1">Automatización y gestión de tareas</p>
        </div>
        <Button id="new-task-btn" onClick={() => setShowNewTaskModal(true)}>
          <Plus className="h-4 w-4" /> Nueva Tarea
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([
          { label: 'Pendientes', value: taskStats.pending, color: 'from-primary/10 to-primary/5', textColor: 'text-primary' },
          { label: 'Para Hoy', value: taskStats.today, color: 'from-warning-500/10 to-warning-500/5', textColor: 'text-warning-500' },
          { label: 'Vencidas', value: taskStats.overdue, color: 'from-error-500/10 to-error-500/5', textColor: 'text-error-500' },
          { label: 'Completadas', value: taskStats.completed, color: 'from-success-500/10 to-success-500/5', textColor: 'text-success-500' },
        ] as const).map(({ label, value, color, textColor }) => (
          <Card key={label} className={`bg-gradient-to-br ${color}`}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold font-heading ${textColor}`}>{value}</p>
              <p className="text-xs text-neutral-500 uppercase mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {(['all', 'pending', 'completed'] as const).map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>
            {FILTER_LABELS[f]}
          </Button>
        ))}
        <div className="h-6 w-px bg-outline-variant mx-1" />
        <Select value={agentFilter || '__all__'} onValueChange={v => setAgentFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger id="task-agent-filter" className="h-9 w-44">
            <SelectValue placeholder="Todos los asesores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos los asesores</SelectItem>
            {agents.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {agentFilter && (
          <Button variant="outline" size="sm" onClick={() => setAgentFilter('')} className="text-error-500 border-error-500/30">
            Limpiar asesor
          </Button>
        )}
        <span className="ml-auto text-sm text-neutral-500">{filteredTasks.length} tareas</span>
      </div>

      {/* Tasks list */}
      <TasksList
        tasks={filteredTasks}
        filter={filter}
        getAgentName={getAgentName}
        isOverdue={isOverdue}
        onToggle={handleToggleComplete}
        onDelete={setDeleteConfirmId}
      />

      {/* Automatización info */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold font-heading">Automatizaciones Disponibles</h3>
              <p className="text-sm text-neutral-600 mt-1 mb-4">
                Las automatizaciones te permiten programar acciones repetitivas. Configurá alertas automáticas para:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Bell, title: 'Recordatorios', desc: 'Alertas antes de visitas y cierres' },
                  { icon: Clock, title: 'Seguimiento', desc: 'Contactar leads sin actividad' },
                  { icon: AlertCircle, title: 'Notificaciones', desc: 'Tareas vencidas y nuevos leads' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="p-3 bg-white rounded-md">
                    <Icon className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-neutral-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <NewTaskModal
        open={showNewTaskModal}
        form={newTask}
        agents={agents}
        onFormChange={setNewTask}
        onSave={handleAddTask}
        onCancel={() => setShowNewTaskModal(false)}
      />
      <DeleteTaskDialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteTask}
      />
    </div>
  )
}
