import { useStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Search, LayoutGrid, List, SlidersHorizontal, Send, MessageSquare, Phone, Mail, User } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

const stages: { id: 'Nuevo' | 'Contactado' | 'Visita' | 'Negociacion' | 'Cierre'; label: string; color: string }[] = [
  { id: 'Nuevo', label: 'Nuevo', color: 'bg-blue-500' },
  { id: 'Contactado', label: 'Contactado', color: 'bg-cyan-500' },
  { id: 'Visita', label: 'Visita', color: 'bg-warning-500' },
  { id: 'Negociacion', label: 'Negociación', color: 'bg-orange-500' },
  { id: 'Cierre', label: 'Cierre', color: 'bg-success-500' },
]

const stageBadgeVariant: Record<string, 'default' | 'success' | 'warning' | 'error' | 'outline' | 'neutral' | 'secondary'> = {
  Nuevo: 'default',
  Contactado: 'secondary',
  Visita: 'warning',
  Negociacion: 'neutral',
  Cierre: 'success',
}

export function PipelinePage() {
  const { deals, leads, agents, moveDeal, addDealNote, addToast } = useStore()
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [search, setSearch] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [noteText, setNoteText] = useState('')

  const getLeadName = (leadId: string) => {
    return leads.find(l => l.id === leadId)?.name || 'Lead'
  }

  const getLeadAgent = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    return agents.find(a => a.id === lead?.assigned_agent)
  }

  // Filtered deals: exclude discarded leads and cancelled deals
  const filteredDeals = deals.filter(deal => {
    const lead = leads.find(l => l.id === deal.lead_id)
    if (lead?.status !== 'Activo') return false  // excluir leads descartados/pausados
    if (deal.stage === 'Cancelado') return false  // excluir deals cancelados
    const agent = agents.find(a => a.id === lead?.assigned_agent)
    const matchesSearch = !search ||
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      (lead?.name || '').toLowerCase().includes(search.toLowerCase())
    const matchesAgent = !agentFilter || agent?.id === agentFilter
    const matchesStage = !stageFilter || deal.stage === stageFilter
    return matchesSearch && matchesAgent && matchesStage
  })

  const selectedDealData = deals.find(d => d.id === selectedDeal)

  const handleMoveDeal = (dealId: string, newStage: 'Nuevo' | 'Contactado' | 'Visita' | 'Negociacion' | 'Cierre') => {
    moveDeal(dealId, newStage)
    addToast({ title: 'Negocio movido', description: `Movido a ${newStage}`, variant: 'success' })
  }

  const handleAddNote = () => {
    if (!selectedDeal || !noteText.trim()) return
    addDealNote(selectedDeal, noteText.trim())
    setNoteText('')
    addToast({ title: 'Nota agregada', variant: 'success' })
  }

  const activeFiltersCount = [search, agentFilter, stageFilter].filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Pipeline</h1>
          <p className="text-neutral-600 mt-1">Seguimiento de negocios en proceso</p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
          <button
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

      {/* Filters bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Buscar por cliente o negocio..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
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
              </div>

              {view === 'table' && (
                <select
                  className="h-9 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1 text-sm"
                  value={stageFilter}
                  onChange={e => setStageFilter(e.target.value)}
                >
                  <option value="">Todas las etapas</option>
                  {stages.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              )}

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setSearch(''); setAgentFilter(''); setStageFilter('') }}
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

      {/* ─── KANBAN VIEW ─── */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage.id)
            const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0)

            return (
              <div key={stage.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-full", stage.color)} />
                    <span className="font-medium">{stage.label}</span>
                  </div>
                  <Badge variant="neutral">{stageDeals.length}</Badge>
                </div>

                <div className="p-3 bg-neutral-50 rounded-md">
                  <p className="text-xs text-neutral-500">Valor Total</p>
                  <p className="text-lg font-bold font-heading">{formatCurrency(totalValue)}</p>
                </div>

                <div className="space-y-3">
                  {stageDeals.map((deal) => {
                    const agent = getLeadAgent(deal.lead_id)
                    return (
                      <Card
                        key={deal.id}
                        className="hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer transition-all duration-150"
                        onClick={() => setSelectedDeal(deal.id)}
                      >
                        <CardContent className="p-4">
                          <p className="font-medium text-sm mb-2 line-clamp-2">{deal.title}</p>

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold font-heading">{formatCurrency(deal.value)}</span>
                            <Badge variant={deal.probability >= 75 ? 'success' : deal.probability >= 50 ? 'warning' : 'error'} className="text-xs">
                              {deal.probability}%
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-xs text-neutral-500">
                            <span className="truncate max-w-[100px]">{getLeadName(deal.lead_id)}</span>
                            <span>Cierre: {formatDate(deal.expected_close)}</span>
                          </div>

                          {agent && (
                            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-outline-variant/50">
                              <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                                {agent.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-xs text-neutral-400 truncate">{agent.name}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}

                  {stageDeals.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-neutral-200 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-neutral-400">Sin negocios</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── TABLE VIEW ─── */}
      {view === 'table' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Negocio</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Asesor</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Prob.</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Cierre Est.</TableHead>
                  <TableHead>Última Act.</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.length === 0 ? (
                  <tr>
                    <TableCell colSpan={9} className="h-40 text-center text-neutral-400">
                      No hay negocios que coincidan con los filtros
                    </TableCell>
                  </tr>
                ) : filteredDeals.map(deal => {
                  const agent = getLeadAgent(deal.lead_id)
                  const stage = stages.find(s => s.id === deal.stage)
                  return (
                    <TableRow key={deal.id} className="cursor-pointer" onClick={() => setSelectedDeal(deal.id)}>
                      <TableCell className="font-medium max-w-[200px] truncate">{deal.title}</TableCell>
                      <TableCell className="text-neutral-600">{getLeadName(deal.lead_id)}</TableCell>
                      <TableCell>
                        {agent ? (
                          <div className="flex items-center gap-1.5">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm text-neutral-600">{agent.name}</span>
                          </div>
                        ) : <span className="text-neutral-400 text-sm">—</span>}
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(deal.value)}</TableCell>
                      <TableCell>
                        <Badge variant={deal.probability >= 75 ? 'success' : deal.probability >= 50 ? 'warning' : 'error'}>
                          {deal.probability}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn('h-2 w-2 rounded-full', stage?.color)} />
                          <Badge variant={stageBadgeVariant[deal.stage]}>{deal.stage}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-600">{formatDate(deal.expected_close)}</TableCell>
                      <TableCell className="text-neutral-500 text-sm">{formatDate(deal.last_update)}</TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDeal(deal.id)}>
                          Mover
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Move Deal Dialog */}
      {/* Deal Details Dialog */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          {selectedDealData && (() => {
            const lead = leads.find(l => l.id === selectedDealData.lead_id)
            const agent = getLeadAgent(selectedDealData.lead_id)
            return (
              <>
                <DialogHeader className="px-6 py-4 border-b border-outline-variant/30 shrink-0">
                  <DialogTitle className="text-xl">{selectedDealData.title}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* Lead Info & Deal Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                        <h4 className="font-semibold text-sm text-neutral-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                          <User className="h-4 w-4" /> Cliente
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-base">{lead?.name || 'Cliente desconocido'}</p>
                          {lead?.phone && <p className="flex items-center gap-2 text-neutral-600"><Phone className="h-3.5 w-3.5" /> {lead.phone}</p>}
                          {lead?.email && <p className="flex items-center gap-2 text-neutral-600"><Mail className="h-3.5 w-3.5" /> {lead.email}</p>}
                          {agent && (
                            <p className="flex items-center gap-2 text-neutral-600 mt-2 pt-2 border-t border-neutral-200">
                              <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                {agent.name.split(' ').map(n => n[0]).join('')}
                              </span>
                              Asesor: {agent.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                        <h4 className="font-semibold text-sm text-neutral-500 mb-3 uppercase tracking-wider">Detalles del Negocio</h4>
                        <div className="space-y-2 text-sm">
                          <p className="flex justify-between"><span className="text-neutral-500">Valor:</span> <span className="font-bold text-base">{formatCurrency(selectedDealData.value)}</span></p>
                          <p className="flex justify-between"><span className="text-neutral-500">Probabilidad:</span> <span className="font-medium">{selectedDealData.probability}%</span></p>
                          <p className="flex justify-between"><span className="text-neutral-500">Cierre est.:</span> <span className="font-medium">{formatDate(selectedDealData.expected_close)}</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Move Stage */}
                    <div>
                      <h4 className="font-semibold text-sm text-neutral-500 mb-3 uppercase tracking-wider">Etapa del Negocio</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {stages.map((stage) => (
                          <Button
                            key={stage.id}
                            variant={selectedDealData.stage === stage.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleMoveDeal(selectedDealData.id, stage.id)}
                            className="text-xs"
                          >
                            <div className={cn('h-1.5 w-1.5 rounded-full mr-1.5', stage.color)} />
                            {stage.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <hr className="border-outline-variant/30" />

                    {/* Notes Section */}
                    <div>
                      <h4 className="font-semibold text-sm text-neutral-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> Notas y Seguimiento
                      </h4>
                      
                      <div className="bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden flex flex-col">
                        <ScrollArea className="h-64 p-4">
                          {!selectedDealData.notes || selectedDealData.notes.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                              No hay notas registradas para este negocio.
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {selectedDealData.notes.map(note => (
                                <div key={note.id} className="bg-white p-3 rounded-md border border-neutral-100 shadow-sm">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-semibold text-primary">{note.author || 'Asesor'}</span>
                                    <span className="text-[11px] text-neutral-400">
                                      {new Date(note.timestamp).toLocaleDateString('es-AR')} {new Date(note.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-neutral-700 whitespace-pre-wrap">{note.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                        <div className="p-3 bg-white border-t border-neutral-200 flex gap-2">
                          <Input
                            placeholder="Escribe una nota..."
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleAddNote()
                              }
                            }}
                          />
                          <Button onClick={handleAddNote} disabled={!noteText.trim()} size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
