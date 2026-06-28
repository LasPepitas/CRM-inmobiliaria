import type { Agent } from '@/store/slices/agentsSlice'
import { roleColors, roleGradients } from '../constants'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, TrendingUp, DollarSign, Mail, Phone, Edit, Trash2, IdCard } from 'lucide-react'
import { cn, formatCurrency, getInitials } from '@/lib/utils'

import { Can } from '@/features/auth'

interface AgentMetrics {
  activeDeals: number
  totalValue: number
  agentLeads: number
}

interface AgentCardProps {
  agent: Agent
  metrics: AgentMetrics
  onEdit: (agent: Agent) => void
  onDelete: (id: string) => void
}

export function AgentCard({ agent, metrics, onEdit, onDelete }: AgentCardProps) {
  return (
    <Card className="hover:shadow-card-hover transition-all duration-150 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className={cn(
            'h-14 w-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-primary shrink-0',
            roleGradients[agent.role]
          )}>
            {getInitials(agent.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold font-heading truncate">{agent.name}</h3>
              <Badge variant={roleColors[agent.role]} className="shrink-0">{agent.role}</Badge>
            </div>
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{agent.email}</span>
              </div>
              {agent.phone && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Phone className="h-3 w-3 shrink-0" />
                  <span>{agent.phone}</span>
                </div>
              )}
              {agent.dni && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <IdCard className="h-3 w-3 shrink-0" />
                  <span>DNI {agent.dni}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-neutral-50">
            <div className="flex items-center gap-1.5 mb-1">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] uppercase text-neutral-500 font-medium">Negocios Activos</span>
            </div>
            <p className="text-xl font-bold font-heading">{metrics.activeDeals}</p>
          </div>
          <div className="p-3 rounded-lg bg-neutral-50">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-success-500" />
              <span className="text-[10px] uppercase text-neutral-500 font-medium">Cerrados</span>
            </div>
            <p className="text-xl font-bold font-heading">{agent.closed_deals}</p>
          </div>
          <div className="col-span-2 p-3 rounded-lg bg-primary/5">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-secondary" />
              <span className="text-[10px] uppercase text-neutral-500 font-medium">Ingresos Totales</span>
            </div>
            <p className="text-xl font-bold font-heading text-primary">{formatCurrency(agent.revenue)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/50">
          <span className="text-xs text-neutral-400">{metrics.agentLeads} leads asignados</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <Can perform="equipo:create">
              <Button
                variant="ghost" size="icon"
                className="h-8 w-8 text-neutral-400 hover:text-primary"
                onClick={() => onEdit(agent)}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </Can>
            <Can perform="equipo:delete">
              <Button
                variant="ghost" size="icon"
                className="h-8 w-8 text-neutral-400 hover:text-error-500"
                onClick={() => onDelete(agent.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </Can>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
