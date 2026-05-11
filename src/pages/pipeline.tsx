import { useStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useState } from 'react'

const stages: { id: 'Nuevo' | 'Contactado' | 'Visita' | 'Negociacion' | 'Cierre'; label: string; color: string }[] = [
  { id: 'Nuevo', label: 'Nuevo', color: 'bg-blue-500' },
  { id: 'Contactado', label: 'Contactado', color: 'bg-cyan-500' },
  { id: 'Visita', label: 'Visita', color: 'bg-warning-500' },
  { id: 'Negociacion', label: 'Negociación', color: 'bg-orange-500' },
  { id: 'Cierre', label: 'Cierre', color: 'bg-success-500' },
]

export function PipelinePage() {
  const { deals, leads, moveDeal, addToast } = useStore()
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)
  const [movingDeal, setMovingDeal] = useState<string | null>(null)

  const getLeadName = (leadId: string) => {
    return leads.find(l => l.id === leadId)?.name || 'Lead'
  }

  const selectedDealData = deals.find(d => d.id === selectedDeal)

  const handleMoveDeal = (dealId: string, newStage: 'Nuevo' | 'Contactado' | 'Visita' | 'Negociacion' | 'Cierre') => {
    moveDeal(dealId, newStage)
    setMovingDeal(null)
    addToast({ title: 'Negocio movido', description: `Moved to ${newStage}`, variant: 'success' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Pipeline</h1>
        <p className="text-neutral-600 mt-1">Seguimiento de negocios en proceso • Click en cards para mover</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter(d => d.stage === stage.id)
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
                {stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    className={cn(
                      "hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer transition-all duration-150",
                      movingDeal === deal.id && "ring-2 ring-primary"
                    )}
                    onClick={() => {
                      if (movingDeal === deal.id) {
                        setMovingDeal(null)
                      } else {
                        setSelectedDeal(deal.id)
                      }
                    }}
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
                        <span>{getLeadName(deal.lead_id)}</span>
                        <span>Cierre: {formatDate(deal.expected_close)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

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

      {/* Move Deal Dialog */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="max-w-md">
          {selectedDealData && (
            <>
              <DialogHeader>
                <DialogTitle>Acciones del Negocio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="font-medium">{selectedDealData.title}</p>
                  <p className="text-sm text-neutral-600">{formatCurrency(selectedDealData.value)} • {selectedDealData.stage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Mover a etapa:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {stages.map((stage) => (
                      <Button
                        key={stage.id}
                        variant={selectedDealData.stage === stage.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleMoveDeal(selectedDealData.id, stage.id)}
                        disabled={selectedDealData.stage === stage.id}
                        className={cn(stage.color === 'bg-blue-500' && 'bg-blue-500 hover:bg-blue-600', stage.color === 'bg-cyan-500' && 'bg-cyan-500 hover:bg-cyan-600', stage.color === 'bg-warning-500' && 'bg-warning-500 hover:bg-warning-600')}
                      >
                        {stage.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedDeal(null)}>Cerrar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
