import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RotateCcw, Trash2 } from 'lucide-react'
import { cn, getInitials, formatDate } from '@/lib/utils'
import type { Lead } from '../types'
import { stageColors } from '../constants'

interface DiscardedLeadsTableProps {
  leads: Lead[]
  getAgentName: (agentId: string) => string
  onReactivate: (id: string) => void
  onDelete: (id: string) => void
}

export function DiscardedLeadsTable({ leads, getAgentName, onReactivate, onDelete }: DiscardedLeadsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Etapa Alcanzada</TableHead>
          <TableHead>Motivo Descarte</TableHead>
          <TableHead>Fecha Descarte</TableHead>
          <TableHead>Asesor</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map(lead => (
          <TableRow key={lead.id} className="opacity-75">
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-500">
                  {getInitials(lead.name)}
                </div>
                <div>
                  <p className="font-medium text-neutral-600">{lead.name}</p>
                  <p className="text-xs text-neutral-400">{lead.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", stageColors[lead.stage])} />
                <span className="text-sm text-neutral-500">{lead.stage}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-warning-600 border-warning-300 bg-warning-50">
                {{
                  'precio': 'Precio elevado',
                  'otra_agencia': 'Otra agencia',
                  'no_responde': 'Sin respuesta',
                  'cambio_planes': 'Cambio de planes',
                  'zona': 'No le convence la zona',
                  'otro': 'Otro motivo'
                }[lead.discard_reason || 'otro'] || lead.discard_reason}
              </Badge>
            </TableCell>
            <TableCell className="text-neutral-500 text-sm">{lead.discarded_at ? formatDate(lead.discarded_at) : '-'}</TableCell>
            <TableCell className="text-neutral-500 text-sm">{getAgentName(lead.assigned_agent)}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReactivate(lead.id)}
                  className="text-success-600 border-success-300 hover:bg-success-50 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reactivar
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(lead.id)}
                  className="text-neutral-400 hover:text-error-500 h-8 w-8"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {leads.length === 0 && (
          <TableRow><TableCell colSpan={6} className="h-24 text-center text-neutral-400">No hay leads descartados</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  )
}
