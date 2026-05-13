import { useStore } from '@/store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'

interface LeadDetailModalProps {
  leadId: string | null
  onClose: () => void
  paymentForm: {
    type: 'contado' | 'cuotas' | 'hipoteca'
    installments: number
    down_payment: number
    monthly: number
    bank: string
    notes: string
  }
  setPaymentForm: (form: {
    type: 'contado' | 'cuotas' | 'hipoteca'
    installments: number
    down_payment: number
    monthly: number
    bank: string
    notes: string
  }) => void
  onSavePayment: (id: string) => void
}

export function LeadDetailModal({ 
  leadId, 
  onClose,
  paymentForm,
  setPaymentForm,
  onSavePayment
}: LeadDetailModalProps) {
  const leads = useStore((state) => state.leads)
  const deals = useStore((state) => state.deals)
  const selectedLeadData = leads.find(l => l.id === leadId)

  const getLeadDeals = (id: string) => deals.filter(d => d.lead_id === id)

  if (!selectedLeadData) return null

  return (
    <Dialog open={!!leadId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{selectedLeadData.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Información General</TabsTrigger>
            <TabsTrigger value="payment">Config. de Pago</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase text-neutral-500 mb-1">Email</p>
                <p className="font-medium">{selectedLeadData.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-neutral-500 mb-1">Teléfono</p>
                <p className="font-medium">{selectedLeadData.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase text-neutral-500 mb-1">Fuente</p>
                <Badge variant="outline">{selectedLeadData.source}</Badge>
              </div>
              <div>
                <p className="text-xs uppercase text-neutral-500 mb-1">Etapa</p>
                <Badge variant="default">{selectedLeadData.stage}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase text-neutral-500 mb-1">Presupuesto</p>
                <p className="font-medium">{formatCurrency(selectedLeadData.budget)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-neutral-500 mb-1">Score</p>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${selectedLeadData.score}%` }} />
                  </div>
                  <span className="font-medium">{selectedLeadData.score}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase text-neutral-500 mb-1">Notas</p>
              <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md">{selectedLeadData.notes || 'Sin notas'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-neutral-500 mb-1">Negocios Relacionados</p>
              {getLeadDeals(selectedLeadData.id).length > 0 ? (
                <div className="space-y-2 mt-2">
                  {getLeadDeals(selectedLeadData.id).map(deal => (
                    <div key={deal.id} className="p-3 bg-neutral-50 rounded-md flex justify-between items-center">
                      <p className="text-sm font-medium">{deal.title}</p>
                      <p className="text-xs text-neutral-500">{formatCurrency(deal.value)} • {deal.stage}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400">Sin negocios vinculados</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Tipo de Pago</label>
              <Select value={paymentForm.type} onValueChange={val => setPaymentForm({ ...paymentForm, type: val as 'contado' | 'cuotas' | 'hipoteca' })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tipo de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contado">Contado</SelectItem>
                  <SelectItem value="cuotas">En Cuotas</SelectItem>
                  <SelectItem value="hipoteca">Crédito Hipotecario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {paymentForm.type === 'cuotas' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Enganche / Adelanto</label>
                  <Input
                    type="number"
                    value={paymentForm.down_payment || ''}
                    onChange={e => setPaymentForm({ ...paymentForm, down_payment: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cantidad de Cuotas</label>
                  <Input
                    type="number"
                    value={paymentForm.installments || ''}
                    onChange={e => setPaymentForm({ ...paymentForm, installments: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Monto Mensual</label>
                  <Input
                    type="number"
                    value={paymentForm.monthly || ''}
                    onChange={e => setPaymentForm({ ...paymentForm, monthly: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {paymentForm.type === 'hipoteca' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Banco / Entidad</label>
                  <Input
                    value={paymentForm.bank || ''}
                    onChange={e => setPaymentForm({ ...paymentForm, bank: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Enganche Propio</label>
                  <Input
                    type="number"
                    value={paymentForm.down_payment || ''}
                    onChange={e => setPaymentForm({ ...paymentForm, down_payment: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Notas Adicionales</label>
              <Input
                value={paymentForm.notes || ''}
                onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                className="mt-1"
                placeholder="Ej: Aprobación pre-acordada..."
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => leadId && onSavePayment(leadId)}>Guardar Configuración</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
