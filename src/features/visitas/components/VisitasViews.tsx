import type { Visit } from '@/store/slices/visitsSlice'
import { CALENDAR_CONFIG, WEEK_DAYS, statusCalendarClass } from '../constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { Property } from '@/store/slices/propertiesSlice'
import type { Lead } from '@/features/leads/types'
import { statusBadgeVariant } from '../constants'

interface CalendarViewProps {
  getVisitsByDate: (date: string) => Visit[]
  upcomingVisits: Visit[]
  properties: Property[]
  leads: Lead[]
  getAgentName: (agentId: string) => string
}

export function CalendarView({ getVisitsByDate, upcomingVisits, properties, leads, getAgentName }: CalendarViewProps) {
  const { year, month, label, daysInMonth, firstWeekday, todayDay } = CALENDAR_CONFIG
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Calendar grid */}
      <Card className="xl:col-span-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            <CardTitle className="capitalize">{label}</CardTitle>
            <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">{day}</div>
            ))}
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20" />
            ))}
            {days.map((day) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayVisits = getVisitsByDate(dateStr)
              const isToday = day === todayDay
              return (
                <div
                  key={day}
                  className={cn('min-h-20 p-2 border border-outline-variant/50 rounded-t-md', isToday && 'bg-primary/5')}
                >
                  <div className={cn('text-sm font-medium mb-1', isToday ? 'text-primary' : 'text-neutral-700')}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayVisits.slice(0, 2).map((visit) => (
                      <div
                        key={visit.id}
                        className={cn('text-xs p-1 rounded truncate', statusCalendarClass[visit.status as keyof typeof statusCalendarClass])}
                      >
                        {visit.time}
                      </div>
                    ))}
                    {dayVisits.length > 2 && (
                      <div className="text-xs text-neutral-500">+{dayVisits.length - 2} más</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming visits sidebar */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Visitas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingVisits.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">No hay visitas programadas</p>
          ) : upcomingVisits.map((visit) => {
            const lead = leads.find(l => l.id === visit.lead_id)
            const property = properties.find(p => p.id === visit.property_id)
            return (
              <div key={visit.id} className="p-4 rounded-lg border border-outline-variant/50 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-sm">{property?.title}</p>
                    <p className="text-xs text-neutral-500">{lead?.name}</p>
                  </div>
                  <Badge variant="outline">{visit.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-600">
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(visit.date)}</div>
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{visit.time}</div>
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
  )
}

// ─── LIST VIEW ────────────────────────────────────────────────────────────────

import { User } from 'lucide-react'

interface ListViewProps {
  visits: Visit[]
  properties: Property[]
  leads: Lead[]
  getAgentName: (agentId: string) => string
}

export function ListView({ visits, properties, leads, getAgentName }: ListViewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {visits.length === 0 && (
            <p className="text-center text-neutral-400 py-12">No hay visitas que coincidan con los filtros</p>
          )}
          {visits.map((visit) => {
            const lead = leads.find(l => l.id === visit.lead_id)
            const property = properties.find(p => p.id === visit.property_id)
            return (
              <div key={visit.id} className="flex items-center gap-4 p-4 rounded-lg border border-outline-variant/50 hover:border-primary/30 transition-colors">
                <div className="h-14 w-14 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{property?.title}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{lead?.name}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{visit.time}</span>
                    <span className="flex items-center gap-1 text-neutral-400">Asesor: {getAgentName(visit.agent)}</span>
                  </div>
                  {visit.notes && <p className="text-xs text-neutral-400 mt-1 italic">"{visit.notes}"</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium">{formatDate(visit.date)}</p>
                  <Badge variant={statusBadgeVariant[visit.status as keyof typeof statusBadgeVariant]} className="mt-1">
                    {visit.status}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
