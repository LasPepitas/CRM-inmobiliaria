import type { Deal } from '@/store/slices/dealsSlice'
import type { Agent } from '@/store/slices/agentsSlice'
import type { DealStage } from '../types'
import { STAGES, probabilityVariant, stageBadgeVariant } from '../constants'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

interface KanbanBoardProps {
  deals: Deal[]
  getLeadName: (leadId: string) => string
  getLeadAgent: (leadId: string) => Agent | undefined
  onSelectDeal: (id: string) => void
}

export function KanbanBoard({ deals, getLeadName, getLeadAgent, onSelectDeal }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
      {STAGES.map((stage) => {
        const stageDeals = deals.filter(d => d.stage === stage.id)
        const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0)

        return (
          <div key={stage.id} className="space-y-4">
            {/* Column header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn('h-3 w-3 rounded-full', stage.color)} />
                <span className="font-medium">{stage.label}</span>
              </div>
              <Badge variant="neutral">{stageDeals.length}</Badge>
            </div>

            {/* Column total */}
            <div className="p-3 bg-neutral-50 rounded-md">
              <p className="text-xs text-neutral-500">Valor Total</p>
              <p className="text-lg font-bold font-heading">{formatCurrency(totalValue)}</p>
            </div>

            {/* Deal cards */}
            <div className="space-y-3">
              {stageDeals.map((deal) => {
                const agent = getLeadAgent(deal.lead_id)
                return (
                  <Card
                    key={deal.id}
                    className="hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer transition-all duration-150"
                    onClick={() => onSelectDeal(deal.id)}
                  >
                    <CardContent className="p-4">
                      <p className="font-medium text-sm mb-2 line-clamp-2">{deal.title}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold font-heading">{formatCurrency(deal.value)}</span>
                        <Badge variant={probabilityVariant(deal.probability)} className="text-xs">
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
  )
}

// ─── TABLE VIEW ───────────────────────────────────────────────────────────────

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface DealsTableProps {
  deals: Deal[]
  getLeadName: (leadId: string) => string
  getLeadAgent: (leadId: string) => Agent | undefined
  onSelectDeal: (id: string) => void
}

export function DealsTable({ deals, getLeadName, getLeadAgent, onSelectDeal }: DealsTableProps) {
  return (
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
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.length === 0 ? (
              <tr>
                <TableCell colSpan={9} className="h-40 text-center text-neutral-400">
                  No hay negocios que coincidan con los filtros
                </TableCell>
              </tr>
            ) : (
              deals.map(deal => {
                const agent = getLeadAgent(deal.lead_id)
                const stage = STAGES.find(s => s.id === deal.stage)
                return (
                  <TableRow key={deal.id} className="cursor-pointer" onClick={() => onSelectDeal(deal.id)}>
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
                      <Badge variant={probabilityVariant(deal.probability)}>{deal.probability}%</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn('h-2 w-2 rounded-full', stage?.color)} />
                        <Badge variant={stageBadgeVariant[deal.stage as DealStage]}>{deal.stage}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-600">{formatDate(deal.expected_close)}</TableCell>
                    <TableCell className="text-neutral-500 text-sm">{formatDate(deal.last_update)}</TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => onSelectDeal(deal.id)}>
                        Mover
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
