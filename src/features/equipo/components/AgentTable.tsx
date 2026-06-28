import type { Agent } from '@/store/slices/agentsSlice'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Trash2, Mail, Phone } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { roleColors, roleGradients } from '../constants'
import { Can } from '@/features/auth'

interface AgentTableProps {
  agents: Agent[]
  isLoading: boolean
  onEdit: (agent: Agent) => void
  onDelete: (id: string) => void
}

function AgentTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-neutral-200 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 bg-neutral-200 rounded" />
                <div className="h-3 w-44 bg-neutral-100 rounded" />
              </div>
            </div>
          </TableCell>
          <TableCell><div className="h-3 w-28 bg-neutral-200 rounded" /></TableCell>
          <TableCell><div className="h-3 w-24 bg-neutral-200 rounded" /></TableCell>
          <TableCell><div className="h-5 w-20 bg-neutral-200 rounded-full" /></TableCell>
          <TableCell><div className="h-7 w-7 bg-neutral-100 rounded ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function AgentTable({ agents, isLoading, onEdit, onDelete }: AgentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>DNI</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead className="w-[60px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <AgentTableSkeleton />
        ) : agents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-32 text-center text-neutral-400">
              No hay usuarios que coincidan con los filtros
            </TableCell>
          </TableRow>
        ) : (
          agents.map(agent => (
            <TableRow key={agent.id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-9 w-9 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-primary shrink-0',
                    roleGradients[agent.role] ?? 'from-primary/20 to-primary/5'
                  )}>
                    {getInitials(agent.name)}
                  </div>
                  <div>
                    <p className="font-medium leading-none">{agent.name}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
                      <Mail className="h-3 w-3" />
                      <span>{agent.email}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-neutral-600">
                {agent.phone ? (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Phone className="h-3.5 w-3.5 text-neutral-400" />
                    {agent.phone}
                  </div>
                ) : (
                  <span className="text-neutral-300">—</span>
                )}
              </TableCell>
              <TableCell className="text-neutral-600 text-sm">
                {agent.dni ?? <span className="text-neutral-300">—</span>}
              </TableCell>
              <TableCell>
                <Badge variant={roleColors[agent.role] ?? 'default'}>
                  {agent.role}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Can perform="equipo:create">
                      <DropdownMenuItem onClick={() => onEdit(agent)}>
                        <Edit className="h-4 w-4 mr-2" /> Editar
                      </DropdownMenuItem>
                    </Can>
                    <Can perform="equipo:delete">
                      <DropdownMenuItem onClick={() => onDelete(agent.id)} className="text-error-500">
                        <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                      </DropdownMenuItem>
                    </Can>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
