import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

const currentMonth = new Date(2024, 3, 1)
const monthName = currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

const daysInMonth = new Date(2024, 4, 0).getDate()
const firstDay = new Date(2024, 3, 1).getDay()

export function VisitasPage() {
  const { visits, properties, leads, agents } = useStore()

  const getAgentName = (agentId: string) => {
    return agents.find(a => a.id === agentId)?.name || 'Agente'
  }

  const getVisitsByDate = (date: string) => {
    return visits.filter(v => v.date === date)
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const upcomingVisits = visits
    .filter(v => v.status === 'Programada')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Visitas</h1>
        <p className="text-neutral-600 mt-1">Calendario y agenda de visitas</p>
      </div>

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
                              className="text-xs p-1 bg-secondary/10 text-secondary-600 rounded truncate"
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
                {upcomingVisits.map((visit) => {
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
                {visits
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((visit) => {
                    const lead = leads.find(l => l.id === visit.lead_id)

                    return (
                      <div
                        key={visit.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-outline-variant/50"
                      >
                        <div className="h-14 w-14 rounded-lg bg-primary/5 flex items-center justify-center">
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
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatDate(visit.date)}</p>
                          <Badge
                            variant={
                              visit.status === 'Completada' ? 'success' :
                              visit.status === 'Cancelada' ? 'error' : 'outline'
                            }
                            className="mt-1"
                          >
                            {visit.status}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
