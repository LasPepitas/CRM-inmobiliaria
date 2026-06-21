import type { Deal } from '@/store/slices/dealsSlice'
import type { Lead } from '@/features/leads/types'
import type { Agent } from '@/store/slices/agentsSlice'
import type { DealStage } from '../types'
import { STAGES } from '../constants'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, MessageSquare, User, Phone, Mail } from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { probabilityVariant } from '../constants'

interface DealDetailModalProps {
  deal: Deal | undefined
  lead: Lead | undefined
  agent: Agent | undefined
  open: boolean
  noteText: string
  onClose: () => void
  onNoteChange: (text: string) => void
  onAddNote: () => void
  onMoveDeal: (dealId: string, stage: DealStage) => void
}

export function DealDetailModal({
  deal,
  lead,
  agent,
  open,
  noteText,
  onClose,
  onNoteChange,
  onAddNote,
  onMoveDeal,
}: DealDetailModalProps) {
  if (!deal) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-outline-variant/30 shrink-0">
          <DialogTitle className="text-xl">{deal.title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Client + Deal info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <h4 className="font-semibold text-sm text-neutral-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4" /> Cliente
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-base">{lead ? `${lead.firstName} ${lead.lastName}`.trim() : 'Cliente desconocido'}</p>
                  {lead?.phone && (
                    <p className="flex items-center gap-2 text-neutral-600">
                      <Phone className="h-3.5 w-3.5" /> {lead.phone}
                    </p>
                  )}
                  {lead?.email && (
                    <p className="flex items-center gap-2 text-neutral-600">
                      <Mail className="h-3.5 w-3.5" /> {lead.email}
                    </p>
                  )}
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
                <h4 className="font-semibold text-sm text-neutral-500 mb-3 uppercase tracking-wider">
                  Detalles del Negocio
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-neutral-500">Valor:</span>
                    <span className="font-bold text-base">{formatCurrency(deal.value)}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="text-neutral-500">Probabilidad:</span>
                    <Badge variant={probabilityVariant(deal.probability)}>{deal.probability}%</Badge>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neutral-500">Cierre est.:</span>
                    <span className="font-medium">{formatDate(deal.expected_close)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Move stage */}
            <div>
              <h4 className="font-semibold text-sm text-neutral-500 mb-3 uppercase tracking-wider">
                Etapa del Negocio
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {STAGES.map((stage) => (
                  <Button
                    key={stage.id}
                    variant={deal.stage === stage.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onMoveDeal(deal.id, stage.id)}
                    className="text-xs"
                  >
                    <div className={cn('h-1.5 w-1.5 rounded-full mr-1.5', stage.color)} />
                    {stage.label}
                  </Button>
                ))}
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            {/* Notes section */}
            <div>
              <h4 className="font-semibold text-sm text-neutral-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Notas y Seguimiento
              </h4>
              <div className="bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden flex flex-col">
                <ScrollArea className="h-64 p-4">
                  {!deal.notes || deal.notes.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                      No hay notas registradas para este negocio.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {deal.notes.map(note => (
                        <div key={note.id} className="bg-white p-3 rounded-md border border-neutral-100 shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-semibold text-primary">{note.author || 'Asesor'}</span>
                            <span className="text-[11px] text-neutral-400">
                              {new Date(note.timestamp).toLocaleDateString('es-AR')}{' '}
                              {new Date(note.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
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
                    id="deal-note-input"
                    placeholder="Escribe una nota..."
                    value={noteText}
                    onChange={(e) => onNoteChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        onAddNote()
                      }
                    }}
                  />
                  <Button onClick={onAddNote} disabled={!noteText.trim()} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
