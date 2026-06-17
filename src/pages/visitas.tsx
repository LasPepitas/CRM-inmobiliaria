import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, SlidersHorizontal, AlertCircle, Loader2 } from 'lucide-react'
import { VISIT_STATUSES } from '@/features/visitas/constants'
import { CalendarView, ListView, NewVisitModal, useVisitas } from '@/features/visitas'

export function VisitasPage() {
  const {
    filteredVisits,
    upcomingVisits,
    sortedVisits,
    properties,
    leads,
    agents,
    visitsLoading,
    visitsError,
    statusFilter,
    agentFilter,
    showNewVisitModal,
    newVisit,
    activeFilters,
    setStatusFilter,
    setAgentFilter,
    setShowNewVisitModal,
    setNewVisit,
    getAgentName,
    getVisitsByDate,
    clearFilters,
    handleAddVisit,
    fetchVisits,
  } = useVisitas()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Visitas</h1>
          <p className="text-neutral-600 mt-1">Calendario y agenda de visitas</p>
        </div>
        <Button id="schedule-visit-btn" onClick={() => setShowNewVisitModal(true)}>
          <Plus className="h-4 w-4" />
          Programar Visita
        </Button>
      </div>

      {/* Banner de error del backend */}
      {visitsError && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">Error al cargar visitas: {visitsError}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchVisits()}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Filter bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <SlidersHorizontal className="h-4 w-4 text-neutral-400" />

            <Select value={statusFilter || '__all__'} onValueChange={v => setStatusFilter(v === '__all__' ? '' : v)}>
              <SelectTrigger id="status-filter" className="h-9 w-44">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos los estados</SelectItem>
                {VISIT_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={agentFilter || '__all__'} onValueChange={v => setAgentFilter(v === '__all__' ? '' : v)}>
              <SelectTrigger id="agent-filter" className="h-9 w-44">
                <SelectValue placeholder="Todos los asesores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos los asesores</SelectItem>
                {agents.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilters > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-error-500 border-error-500/30 hover:bg-error-500/5"
              >
                Limpiar ({activeFilters})
              </Button>
            )}

            <span className="ml-auto flex items-center gap-1.5 text-sm text-neutral-500">
              {visitsLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Cargando...
                </>
              ) : (
                `${filteredVisits.length} visitas`
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Views */}
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <CalendarView
            getVisitsByDate={getVisitsByDate}
            upcomingVisits={upcomingVisits}
            properties={properties}
            leads={leads}
            getAgentName={getAgentName}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <ListView
            visits={sortedVisits}
            properties={properties}
            leads={leads}
            getAgentName={getAgentName}
          />
        </TabsContent>
      </Tabs>

      {/* New Visit Modal */}
      <NewVisitModal
        open={showNewVisitModal}
        form={newVisit}
        properties={properties}
        leads={leads}
        agents={agents}
        onFormChange={setNewVisit}
        onSave={handleAddVisit}
        onCancel={() => setShowNewVisitModal(false)}
      />
    </div>
  )
}

