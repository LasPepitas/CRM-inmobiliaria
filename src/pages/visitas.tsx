import { useState } from 'react'
import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  SlidersHorizontal,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

const currentMonth = new Date(2024, 3, 1)
const monthName = currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
const daysInMonth = new Date(2024, 4, 0).getDate()
const firstDay = new Date(2024, 3, 1).getDay()

const statusVariants: Record<string, 'outline' | 'success' | 'error'> = {
  Programada: 'outline',
  Completada: 'success',
  Cancelada: 'error',
}

export function VisitasPage() {
  const { visits, properties, leads, agents, addVisit, addToast } = useStore()

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [agentFilter, setAgentFilter] = useState('')

  // New visit modal
  const [showNewVisitModal, setShowNewVisitModal] = useState(false)
  const [newVisit, setNewVisit] = useState({
    property_id: '',
    lead_id: '',
    date: '',
    time: '',
    agent: '',
    notes: '',
  })

  const getAgentName = (agentId: string) => {
    return agents.find(a => a.id === agentId)?.name || 'Agente'
  }

  const getVisitsByDate = (date: string) => {
    return visits.filter(v => v.date === date)
  }

  // Apply filters
  const filteredVisits = visits.filter(v => {
    const matchesStatus = !statusFilter || v.status === statusFilter
    const matchesAgent = !agentFilter || v.agent === agentFilter
    return matchesStatus && matchesAgent
  })

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const upcomingVisits = filteredVisits
    .filter(v => v.status === 'Programada')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const handleAddVisit = () => {
    if (!newVisit.property_id || !newVisit.lead_id || !newVisit.date || !newVisit.time) {
      addToast({ title: 'Error', description: 'Completá los campos obligatorios', variant: 'error' })
      return
    }
    addVisit({
      ...newVisit,
      status: 'Programada',
    })
    addToast({ title: 'Visita programada', description: `Visita agendada para el ${formatDate(newVisit.date)} a las ${newVisit.time}`, variant: 'success' })
    setShowNewVisitModal(false)
    setNewVisit({ property_id: '', lead_id: '', date: '', time: '', agent: '', notes: '' })
  }

  const activeFilters = [statusFilter, agentFilter].filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Visitas</h1>
          <p className="text-neutral-600 mt-1">Calendario y agenda de visitas</p>
        </div>
        <Button onClick={() => setShowNewVisitModal(true)}>
          <Plus className="h-4 w-4" />
          Programar Visita
        </Button>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
            <select
              className="h-9 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="Programada">Programada</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>

            <select
              className="h-9 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1 text-sm"
              value={agentFilter}
              onChange={e => setAgentFilter(e.target.value)}
            >
              <option value="">Todos los asesores</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

            {activeFilters > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setStatusFilter(''); setAgentFilter('') }}
                className="text-error-500 border-error-500/30 hover:bg-error-500/5"
              >
                Limpiar ({activeFilters})
              </Button>
            )}

            <span className="ml-auto text-sm text-neutral-500">{filteredVisits.length} visitas</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="capitalize">{monthName}</CardTitle>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20" />
                  ))}
                  {days.map((day) => {
                    const dateStr = `2024-04-${day.toString().padStart(2, '0')}`
                    const dayVisits = getVisitsByDate(dateStr)
                    const isToday = day === 15

                    return (
                      <div
                        key={day}
                        className={cn(
                          "min-h-20 p-2 border border-outline-variant/50 rounded-t-md",
                          isToday && "bg-primary/5"
                        )}
                      >
                        <div className={cn(
                          "text-sm font-medium mb-1",
                          isToday ? "text-primary" : "text-neutral-700"
                        )}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayVisits.slice(0, 2).map((visit) => (
                            <div
                              key={visit.id}
                              className={cn(
                                "text-xs p-1 rounded truncate",
                                visit.status === 'Completada' ? 'bg-success-500/10 text-success-600' :
                                visit.status === 'Cancelada' ? 'bg-error-500/10 text-error-600' :
                                'bg-secondary/10 text-secondary-600'
                              )}
                            >
                              {visit.time}
                            </div>
                          ))}
                          {dayVisits.length > 2 && (
                            <div className="text-xs text-neutral-500">
                              +{dayVisits.length - 2} más
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximas Visitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingVisits.length === 0 ? (
                  <p className="text-sm text-neutral-400 text-center py-8">No hay visitas programadas</p>
                ) : upcomingVisits.map((visit) => {
                  const lead = leads.find(l => l.id === visit.lead_id)
                  return (
                    <div
                      key={visit.id}
                      className="p-4 rounded-lg border border-outline-variant/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-sm">{properties.find(p => p.id === visit.property_id)?.title}</p>
                          <p className="text-xs text-neutral-500">{lead?.name}</p>
                        </div>
                        <Badge variant="outline">{visit.status}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(visit.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {visit.time}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant/50">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {getAgentName(visit.agent).split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs text-neutral-600">{getAgentName(visit.agent)}</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredVisits
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((visit) => {
                    const lead = leads.find(l => l.id === visit.lead_id)

                    return (
                      <div
                        key={visit.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-outline-variant/50 hover:border-primary/30 transition-colors"
                      >
                        <div className="h-14 w-14 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{properties.find(p => p.id === visit.property_id)?.title}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {lead?.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {visit.time}
                            </span>
                            <span className="flex items-center gap-1 text-neutral-400">
                              Asesor: {getAgentName(visit.agent)}
                            </span>
                          </div>
                          {visit.notes && (
                            <p className="text-xs text-neutral-400 mt-1 italic">"{visit.notes}"</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-medium">{formatDate(visit.date)}</p>
                          <Badge
                            variant={statusVariants[visit.status]}
                            className="mt-1"
                          >
                            {visit.status}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                {filteredVisits.length === 0 && (
                  <p className="text-center text-neutral-400 py-12">No hay visitas que coincidan con los filtros</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Visit Modal */}
      <Dialog open={showNewVisitModal} onOpenChange={setShowNewVisitModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Programar Visita</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Propiedad *</label>
              <select
                className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                value={newVisit.property_id}
                onChange={e => setNewVisit({ ...newVisit, property_id: e.target.value })}
              >
                <option value="">Seleccionar propiedad...</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.title} — {p.neighborhood}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Lead (Cliente) *</label>
              <select
                className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                value={newVisit.lead_id}
                onChange={e => setNewVisit({ ...newVisit, lead_id: e.target.value })}
              >
                <option value="">Seleccionar cliente...</option>
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Fecha *</label>
                <Input
                  type="date"
                  value={newVisit.date}
                  onChange={e => setNewVisit({ ...newVisit, date: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Hora *</label>
                <Input
                  type="time"
                  value={newVisit.time}
                  onChange={e => setNewVisit({ ...newVisit, time: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Asesor Responsable</label>
              <select
                className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                value={newVisit.agent}
                onChange={e => setNewVisit({ ...newVisit, agent: e.target.value })}
              >
                <option value="">Sin asignar</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.name} — {a.role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Notas</label>
              <Input
                placeholder="Observaciones sobre la visita..."
                value={newVisit.notes}
                onChange={e => setNewVisit({ ...newVisit, notes: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewVisitModal(false)}>Cancelar</Button>
            <Button onClick={handleAddVisit}>
              <Calendar className="h-4 w-4 mr-2" />
              Programar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
