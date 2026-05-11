import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, getInitials } from '@/lib/utils'

export function ReportesPage() {
  const { leads, deals, agents, documents } = useStore()

  // KPIs dinámicos
  const totalRevenue = deals.filter(d => d.stage === 'Cierre').reduce((sum, d) => sum + d.value, 0)
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const avgDealValue = deals.length > 0 ? totalValue / deals.length : 0
  const conversionRate = deals.length > 0 ? (deals.filter(d => d.stage === 'Cierre').length / deals.length) * 100 : 0
  const signedDocs = documents.filter(d => d.status === 'Firmado').length

  // Leads by source
  const leadsBySource = ['Web', 'Referido', 'Contacto', 'Redes', 'Expo'].map(source => ({
    source,
    count: leads.filter(l => l.source === source).length,
  }))
  const maxSourceCount = Math.max(...leadsBySource.map(s => s.count), 1)

  // Gráfico de Ingresos (basado en fecha de expected_close de Deals cerrados o todos)
  // Agrupamos el valor de los deals por mes (ej. "2024-03" -> "Mar")
  const getMonthAbbr = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
  }

  const revenueByMonthMap: Record<string, number> = {}
  deals.forEach(deal => {
    const month = getMonthAbbr(deal.expected_close)
    if (!revenueByMonthMap[month]) revenueByMonthMap[month] = 0
    revenueByMonthMap[month] += deal.value
  })

  // Generar últimos 4 meses como placeholders si no hay datos
  const today = new Date()
  const recentMonths = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (3 - i), 1)
    const abbr = d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
    return {
      month: abbr.charAt(0).toUpperCase() + abbr.slice(1),
      value: revenueByMonthMap[abbr] || 0
    }
  })

  const maxRevenue = Math.max(...recentMonths.map(m => m.value), 1)

  // Métricas por Asesor
  const agentMetrics = agents.map(agent => {
    const agentDeals = deals.filter(d => {
      const lead = leads.find(l => l.id === d.lead_id)
      return lead?.assigned_agent === agent.id
    })
    const activeDeals = agentDeals.filter(d => d.stage !== 'Cierre').length
    const closedDeals = agentDeals.filter(d => d.stage === 'Cierre').length
    const agentTotalValue = agentDeals.reduce((sum, d) => sum + d.value, 0)
    
    return {
      id: agent.id,
      name: agent.name,
      activeDeals,
      closedDeals,
      agentTotalValue
    }
  }).sort((a, b) => b.agentTotalValue - a.agentTotalValue)

  // Métricas de Pipeline
  const stages = ['Nuevo', 'Contactado', 'Visita', 'Negociacion', 'Cierre'] as const
  const stageCounts = stages.map(stage => ({
    stage,
    count: deals.filter(d => d.stage === stage).length
  }))
  const totalPipelineDeals = deals.length || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Reportes</h1>
        <p className="text-neutral-600 mt-1">Análisis y métricas en tiempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-neutral-500 mb-1">Ingresos Cerrados</p>
            <p className="text-2xl font-bold font-heading">{formatCurrency(totalRevenue)}</p>
            <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-success-500 rounded-full" style={{ width: `${Math.min(totalRevenue / (totalValue || 1) * 100, 100)}%` }} />
            </div>
            <p className="text-xs text-neutral-400 mt-2">Del total de {formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-neutral-500 mb-1">Valor Promedio Negocio</p>
            <p className="text-2xl font-bold font-heading">{formatCurrency(avgDealValue)}</p>
            <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: '100%' }} />
            </div>
            <p className="text-xs text-neutral-400 mt-2">En {deals.length} negocios totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-neutral-500 mb-1">Tasa de Conversión (Cierre)</p>
            <p className="text-2xl font-bold font-heading">{conversionRate.toFixed(1)}%</p>
            <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-warning-500 rounded-full" style={{ width: `${conversionRate}%` }} />
            </div>
            <p className="text-xs text-neutral-400 mt-2">De negocios ganados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-neutral-500 mb-1">Documentos Firmados</p>
            <p className="text-2xl font-bold font-heading">{signedDocs}</p>
            <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${documents.length > 0 ? (signedDocs / documents.length) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-neutral-400 mt-2">De {documents.length} documentos totales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Valor Esperado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-4">
              {recentMonths.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-medium text-neutral-500">
                    {item.value > 0 ? formatCurrency(item.value).split(',')[0] : ''}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary-700 rounded-t-md transition-all duration-500 flex items-end justify-center pb-2"
                    style={{ height: `${Math.max((item.value / maxRevenue) * 100, 5)}%` }}
                  >
                  </div>
                  <span className="text-xs font-medium text-neutral-600">{item.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-outline-variant/50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary" />
                <span className="text-xs text-neutral-600">Proyección por mes de cierre</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origen de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {leadsBySource.map((item) => (
                <div key={item.source}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-neutral-700">{item.source}</span>
                    <span className="text-neutral-500">{item.count} leads</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / maxSourceCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Asesor</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asesor</TableHead>
                  <TableHead className="text-center">Activos</TableHead>
                  <TableHead className="text-center">Cerrados</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentMetrics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-neutral-400 py-6">Sin asesores con negocios</TableCell>
                  </TableRow>
                ) : agentMetrics.map(agent => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                          {getInitials(agent.name)}
                        </div>
                        <span className="font-medium text-sm truncate">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{agent.activeDeals}</TableCell>
                    <TableCell className="text-center text-success-600 font-medium">{agent.closedDeals}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(agent.agentTotalValue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embudos de Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5 mt-2">
              {stageCounts.map((item, i) => {
                const percentage = (item.count / totalPipelineDeals) * 100
                const colors = ['bg-blue-500', 'bg-cyan-500', 'bg-warning-500', 'bg-orange-500', 'bg-success-500']
                return (
                  <div key={item.stage}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-neutral-700">{item.stage}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-500">{item.count} neg.</span>
                        <span className="font-bold w-12 text-right">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[i]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
