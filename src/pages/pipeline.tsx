import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, LayoutGrid, List, SlidersHorizontal, AlertCircle, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { STAGES } from '@/features/pipeline/constants'
import { KanbanBoard, DealsTable, DealDetailModal, usePipeline } from '@/features/pipeline'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export function PipelinePage() {
  const {
    deals,
    isLoading,
    error,
    filteredDeals,
    leads,
    agents,
    selectedDeal,
    view,
    search,
    agentFilter,
    stageFilter,
    noteText,
    activeFiltersCount,
    deletingDealId,
    setView,
    setSearch,
    setAgentFilter,
    setStageFilter,
    setNoteText,
    setSelectedDealId,
    setDeletingDealId,
    getLeadName,
    getLeadAgent,
    handleMoveDeal,
    handleAddNote,
    handleDeleteDeal,
    confirmDeleteDeal,
    clearFilters,
    fetchDeals,
  } = usePipeline()

  const selectedLead = leads.find(l => l.id === selectedDeal?.lead_id)
  const selectedAgent = selectedDeal ? getLeadAgent(selectedDeal.lead_id) : undefined

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Pipeline</h1>
          <p className="text-neutral-600 mt-1">
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Cargando negocios...
              </span>
            ) : (
              `Seguimiento de negocios en proceso`
            )}
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
          <button
            id="view-kanban-btn"
            onClick={() => setView('kanban')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
              view === 'kanban' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500 hover:text-neutral-700'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </button>
          <button
            id="view-table-btn"
            onClick={() => setView('table')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
              view === 'table' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500 hover:text-neutral-700'
            )}
          >
            <List className="h-4 w-4" />
            Tabla
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">Error al cargar pipeline: {error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDeals()}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Filters bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                id="pipeline-search"
                placeholder="Buscar por cliente o negocio..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
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
              </div>

              {view === 'table' && (
                <Select value={stageFilter || '__all__'} onValueChange={v => setStageFilter(v === '__all__' ? '' : v)}>
                  <SelectTrigger id="stage-filter" className="h-9 w-44">
                    <SelectValue placeholder="Todas las etapas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Todas las etapas</SelectItem>
                    {STAGES.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-error-500 border-error-500/30 hover:bg-error-500/5"
                >
                  Limpiar filtros ({activeFiltersCount})
                </Button>
              )}
            </div>

            <span className="text-sm text-neutral-500 ml-auto shrink-0">
              {filteredDeals.length} de {deals.length} negocios
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Views */}
      {view === 'kanban' && (
        <KanbanBoard
          deals={filteredDeals}
          getLeadName={getLeadName}
          getLeadAgent={getLeadAgent}
          onSelectDeal={setSelectedDealId}
        />
      )}
      {view === 'table' && (
        <DealsTable
          deals={filteredDeals}
          getLeadName={getLeadName}
          getLeadAgent={getLeadAgent}
          onSelectDeal={setSelectedDealId}
        />
      )}

      {/* Deal detail modal */}
      <DealDetailModal
        deal={selectedDeal}
        lead={selectedLead}
        agent={selectedAgent}
        open={!!selectedDeal}
        noteText={noteText}
        onClose={() => setSelectedDealId(null)}
        onNoteChange={setNoteText}
        onAddNote={handleAddNote}
        onMoveDeal={handleMoveDeal}
        onCancelDeal={(id) => handleMoveDeal(id, 'Cancelado' as any)}
        onDeleteDeal={confirmDeleteDeal}
      />

      <Dialog open={!!deletingDealId} onOpenChange={(open) => !open && setDeletingDealId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar Negocio</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-neutral-600">
            ¿Estás seguro de que deseas eliminar este negocio? Esta acción no se puede deshacer.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingDealId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => handleDeleteDeal(deletingDealId!)}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
