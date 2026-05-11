import { useStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getInitials } from '@/lib/utils'
import { Building2, TrendingUp, DollarSign, Mail } from 'lucide-react'

export function EquipoPage() {
  const { agents, leads, deals } = useStore()

  const getAgentMetrics = (agentId: string) => {
    const agentDeals = deals.filter(d => {
      const lead = leads.find(l => l.id === d.lead_id)
      return lead?.assigned_agent === agentId
    })
    const activeDeals = agentDeals.filter(d => d.stage !== 'Cierre').length
    const totalValue = agentDeals.reduce((sum, d) => sum + d.value, 0)
    return { activeDeals, totalValue }
  }

  const roleColors: Record<string, 'default' | 'warning' | 'secondary'> = {
    'Gerente': 'warning',
    'Asesor Senior': 'default',
    'Asesor': 'secondary',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Equipo</h1>
        <p className="text-neutral-600 mt-1">{agents.length} miembros en tu equipo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const metrics = getAgentMetrics(agent.id)

          return (
            <Card
              key={agent.id}
              className="hover:shadow-card-hover transition-all duration-150"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {getInitials(agent.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold font-heading">{agent.name}</h3>
                      <Badge variant={roleColors[agent.role]}>{agent.role}</Badge>
                    </div>
                    <div className="mt-1 space-y-1 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {agent.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-neutral-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="text-xs uppercase text-neutral-500">Negocios Activos</span>
                    </div>
                    <p className="text-2xl font-bold font-heading">{metrics.activeDeals}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-success-500" />
                      <span className="text-xs uppercase text-neutral-500">Cerrados</span>
                    </div>
                    <p className="text-2xl font-bold font-heading">{agent.closed_deals}</p>
                  </div>

                  <div className="col-span-2 p-4 rounded-lg bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-secondary" />
                      <span className="text-xs uppercase text-neutral-500">Ingresos Totales</span>
                    </div>
                    <p className="text-2xl font-bold font-heading text-primary">
                      {formatCurrency(agent.revenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
