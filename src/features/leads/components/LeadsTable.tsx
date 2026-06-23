import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Mail, MoreVertical, Eye, Edit, ArrowRightLeft, XCircle, Trash2 } from 'lucide-react'
import { cn, getAvatarColor, getInitials } from '@/lib/utils'
import type { Lead } from '../types'
import { stageColors } from '../constants'

interface LeadsTableProps {
  leads: Lead[]
  getAgentName: (agentId: string) => string
  onViewDetail: (id: string) => void
  onEdit: (id: string) => void
  onConvert: (id: string) => void
  onDiscard: (id: string) => void
  onDelete: (id: string) => void
}

export function LeadsTable({ leads, getAgentName, onViewDetail, onEdit, onConvert, onDiscard, onDelete }: LeadsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contacto</TableHead>
          <TableHead>Fuente</TableHead>
          <TableHead>Etapa</TableHead>
          <TableHead>Asignado</TableHead>
          <TableHead>Telefono</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold", getAvatarColor(lead.firstName + ' ' + lead.lastName).bg, getAvatarColor(lead.firstName + ' ' + lead.lastName).text)}>
                  {getInitials(lead.firstName + ' ' + lead.lastName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                    {lead.status === 'Convertido' && (
                      <Badge variant="success" className="text-[10px] py-0.5 px-1.5 uppercase tracking-wider font-heading">
                        Convertido
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell><Badge variant="outline">{lead.source}</Badge></TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", stageColors[lead.stage])} />
                <span className="text-sm">{lead.stage}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {getAgentName(lead.assigned_agent).split(' ').map((n: string) => n[0]).join('')}
                </div>
                <span className="text-sm">{getAgentName(lead.assigned_agent)}</span>
              </div>
            </TableCell>
            <TableCell className="text-neutral-600">{lead.phone}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetail(lead.id)}><Eye className="h-4 w-4 mr-2" />Ver Detalle</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(lead.id)}><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onConvert(lead.id)}
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Convertir a Negocio
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDiscard(lead.id)}
                    className={cn(lead.status === 'Convertido' ? 'text-neutral-400' : 'text-warning-600')}
                    disabled={lead.status === 'Convertido'}
                  >
                    <XCircle className="h-4 w-4 mr-2" />Marcar No Interesado
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(lead.id)} className="text-error-500"><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {leads.length === 0 && (
          <TableRow><TableCell colSpan={6} className="h-24 text-center text-neutral-400">No hay leads activos</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  )
}
