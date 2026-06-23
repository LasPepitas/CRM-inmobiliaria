import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import {
  LayoutDashboard,
  Building2,
  Users,
  Kanban,
  CalendarDays,
  BarChart3,
  FileText,
  UsersRound,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Plug,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/features/auth'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'propiedades', label: 'Propiedades', icon: Building2, path: '/dashboard/propiedades' },
  { id: 'leads', label: 'Leads', icon: Users, path: '/dashboard/leads' },
  { id: 'pipeline', label: 'Pipeline', icon: Kanban, path: '/dashboard/pipeline' },
  { id: 'visitas', label: 'Visitas', icon: CalendarDays, path: '/dashboard/visitas' },
  { id: 'tareas', label: 'Tareas', icon: CheckSquare, path: '/dashboard/tareas' },
  { id: 'reportes', label: 'Reportes', icon: BarChart3, path: '/dashboard/reportes' },
  { id: 'documentos', label: 'Documentos', icon: FileText, path: '/dashboard/documents' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, path: '/dashboard/whatsapp' },
  { id: 'integracion', label: 'Integración', icon: Plug, path: '/dashboard/integracion' },
  { id: 'equipo', label: 'Equipo', icon: UsersRound, path: '/dashboard/equipo' },
  { id: 'ajustes', label: 'Ajustes', icon: Settings, path: '/dashboard/ajustes' },
]

export function Sidebar() {
  const { ui, toggleSidebar } = useStore()
  const { hasRoutePermission } = useAuth()
  const location = useLocation()
  const collapsed = ui.sidebarCollapsed

  const visibleItems = navItems.filter((item) => hasRoutePermission(item.id))

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-primary text-on-primary transition-all duration-300 ease-smooth hidden md:block",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center justify-center border-b border-primary-800 px-4">
          <img src="/logo.png" alt="Grupo Siena" className={cn("object-contain", collapsed ? "h-16 w-16" : "h-24 w-auto")} />
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {visibleItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary-50/20 text-secondary"
                      : "text-on-primary/80 hover:bg-primary-600 hover:text-on-primary",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        <div className="border-t border-primary-800 p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              "w-full justify-center text-on-primary/80 hover:bg-primary-600 hover:text-on-primary",
              !collapsed && "justify-start px-3"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Colapsar</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
