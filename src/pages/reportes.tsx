import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

export function ReportesPage() {
  const { leads, deals, agents, documents } = useStore()

  const totalRevenue = agents.reduce((sum, a) => sum + a.revenue, 0)
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const avgDealValue = totalValue / deals.length
  const conversionRate = (deals.filter(d => d.stage === 'Cierre').length / deals.length) * 100

  const leadsBySource = ['Web', 'Referido', 'Contacto', 'Redes', 'Expo'].map(source => ({
    source,
    count: leads.filter(l => l.source === source).length,
  }))

  const maxSourceCount = Math.max(...leadsBySource.map(s => s.count))

  const revenueByMonth = [
    { month: 'Ene', value: 45000000 },
    { month: 'Feb', value: 62000000 },
    { month: 'Mar', value: 58000000 },
    { month: 'Abr', value: 71000000 },
  ]
  const maxRevenue = Math.max(...revenueByMonth.map(m => m.value))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Reportes</h1>
        <p className="text-neutral-600 mt-1">Análisis y métricas del negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-neutral-500 mb-1">Ingresos Totales</p>
            <p className="text-2xl font-bold font-heading">{formatCurrency(totalRevenue)}</p>
            <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-success-500 rounded-full" style={{ width: '78%' }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-neutral-500 mb-1">Valor Promedio Negocio</p>
            <p className="text-2xl font-bold font-heading">{formatCurrency(avgDealValue)}</p>
            <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: '65%' }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-neutral-500 mb-1">Tasa de Conversión</p>
            <p className="text-2xl font-bold font-heading">{conversionRate.toFixed(1)}%</p>
            <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-warning-500 rounded-full" style={{ width: '45%' }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-neutral-500 mb-1">Documentos Firmados</p>
            <p className="text-2xl font-bold font-heading">
              {documents.filter(d => d.status === 'Firmado').length}
            </p>
            <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '58%' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-4">
              {revenueByMonth.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary-700 rounded-t-md transition-all duration-500"
                    style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                  />
                  <span className="text-xs text-neutral-500">{item.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-outline-variant/50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary" />
                <span className="text-xs text-neutral-600">Ingresos mensuales</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads por Fuente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadsBySource.map((item) => (
                <div key={item.source} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.source}</span>
                    <span className="text-neutral-500">{item.count} leads</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-secondary-400 rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / maxSourceCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights y Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-success-500/5 border border-success-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-success-500/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-success-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <span className="font-semibold text-success-500">Alto Rendimiento</span>
              </div>
              <p className="text-sm text-neutral-600">
                Las referencias son tu mejor fuente de leads con un 95% de conversión. Considera implementar un programa de referidos.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-warning-500/5 border border-warning-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-warning-500/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-warning-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <span className="font-semibold text-warning-500">Oportunidad</span>
              </div>
              <p className="text-sm text-neutral-600">
                Los leads de Redes tienen baja conversión. Revisar estrategias de contenido y timing de seguimiento.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="font-semibold text-primary">Recomendación</span>
              </div>
              <p className="text-sm text-neutral-600">
                3 documentos están por expirar. Priorizá el seguimiento de estos casos para cerrar los negocios a tiempo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
