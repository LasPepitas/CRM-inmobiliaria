import { useStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency, getRelativeTime } from '@/lib/utils'
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
  CheckSquare,
  Eye,
  Clock,
} from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface KPICardProps {
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  icon: React.ElementType
  color?: string
  onClick?: () => void
}

function KPICard({ label, value, delta, deltaLabel, icon: Icon, color = 'bg-primary/5', onClick }: KPICardProps) {
  const isPositive = delta && delta > 0

  return (
    <Card className="hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-150 cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-neutral-900 font-heading">
              {typeof value === 'number' && label.includes('$') ? formatCurrency(value) : value}
            </p>
            {delta !== undefined && (
              <div className={cn("flex items-center gap-1 text-xs font-medium", isPositive ? "text-success-500" : "text-error-500")}>
                {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{deltaLabel || `${Math.abs(delta)}%`}</span>
                <span className="text-neutral-500">vs mes anterior</span>
              </div>
            )}
          </div>
          <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", color)}>
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const stages = [
  { name: 'Nuevo', color: 'bg-blue-500' },
  { name: 'Contactado', color: 'bg-cyan-500' },
  { name: 'Visita', color: 'bg-warning-500' },
  { name: 'Negociacion', color: 'bg-orange-500' },
  { name: 'Cierre', color: 'bg-success-500' },
]

export function OverviewPage() {
  const { properties, leads, deals, agents, visits, tasks, documents, setActivePage } = useStore()

  const totalRevenue = agents.reduce((sum, a) => sum + a.revenue, 0)
  const activeDeals = deals.filter(d => d.stage !== 'Cierre').length
  const pendingTasks = tasks.filter(t => t.status === 'Pendiente').length
  const todayVisits = visits.filter(v => v.date === new Date().toISOString().split('T')[0] && v.status === 'Programada').length

  const dealsByStage = stages.map(stage => ({
    ...stage,
    count: deals.filter(d => d.stage === stage.name).length,
  }))

  const topProperties = [...properties]
    .sort((a, b) => b.interested - a.interested)
    .slice(0, 5)

  const recentActivities = [
    ...visits.map(v => ({ type: 'visit', date: v.date, data: v, icon: Calendar })),
    ...tasks.slice(0, 2).map(t => ({ type: 'task', date: t.due_date, data: t, icon: CheckSquare })),
    ...documents.slice(0, 2).map(d => ({ type: 'document', date: d.updated_at, data: d, icon: FileText })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Resumen</h1>
          <p className="text-neutral-600 mt-1">Resumen de tu actividad inmobiliaria</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActivePage('leads')}>
            <Users className="h-4 w-4 mr-2" />
            Ver Leads
          </Button>
          <Button onClick={() => setActivePage('pipeline')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Ver Pipeline
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard label="Propiedades" value={properties.length} icon={Building2} onClick={() => setActivePage('propiedades')} />
        <KPICard label="Leads" value={leads.length} delta={8} icon={Users} onClick={() => setActivePage('leads')} />
        <KPICard label="Negocios" value={activeDeals} icon={TrendingUp} onClick={() => setActivePage('pipeline')} />
        <KPICard label="Ingresos" value={totalRevenue} delta={15} icon={DollarSign} color="bg-secondary/10" />
        <KPICard label="Tareas" value={pendingTasks} icon={CheckSquare} color="bg-warning-500/10" onClick={() => setActivePage('tareas')} />
        <KPICard label="Visitas Hoy" value={todayVisits} icon={Calendar} color="bg-success-500/10" onClick={() => setActivePage('visitas')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pipeline */}
        <Card className="xl:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Pipeline de Negocios</h2>
              <Button variant="ghost" size="sm" onClick={() => setActivePage('pipeline')}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Todo
              </Button>
            </div>
            <div className="space-y-4">
              {dealsByStage.map((stage) => {
                const maxCount = Math.max(...dealsByStage.map(s => s.count), 1)
                return (
                  <div key={stage.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{stage.name}</span>
                      <Badge variant="neutral">{stage.count}</Badge>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", stage.color)}
                        style={{ width: `${(stage.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, i) => {
                const Icon = activity.icon
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-outline-variant/50 last:border-0">
                    <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {activity.type === 'visit' && `${(activity.data as typeof visits[0]).property_id} - ${(activity.data as typeof visits[0]).status}`}
                        {activity.type === 'task' && `${(activity.data as typeof tasks[0]).title}`}
                        {activity.type === 'document' && `${(activity.data as typeof documents[0]).name}`}
                      </p>
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getRelativeTime(activity.date)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Propiedades */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Propiedades con Más Interés</h2>
            <Button variant="ghost" size="sm" onClick={() => setActivePage('propiedades')}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Todo
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Propiedad</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Barrio</TableHead>
                <TableHead>Interés</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProperties.map((property) => (
                <TableRow key={property.id} className="cursor-pointer" onClick={() => setActivePage('propiedades')}>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{formatCurrency(property.price)}</TableCell>
                  <TableCell>{property.neighborhood}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: `${(property.interested / 50) * 100}%` }} />
                      </div>
                      <span className="text-sm font-medium">{property.interested}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={property.status === 'Disponible' ? 'success' : property.status === 'Reservado' ? 'warning' : 'default'}>
                      {property.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
