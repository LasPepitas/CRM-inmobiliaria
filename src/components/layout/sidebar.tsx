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

const navItems = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'propiedades', label: 'Propiedades', icon: Building2 },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: Kanban },
  { id: 'visitas', label: 'Visitas', icon: CalendarDays },
  { id: 'tareas', label: 'Tareas', icon: CheckSquare },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'documentos', label: 'Documentos', icon: FileText },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'integracion', label: 'Integración', icon: Plug },
  { id: 'equipo', label: 'Equipo', icon: UsersRound },
  { id: 'ajustes', label: 'Ajustes', icon: Settings },
]

export function Sidebar() {
  const { ui, toggleSidebar, setActivePage } = useStore()
  const { hasRoutePermission } = useAuth()
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
              const isActive = ui.activePage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
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
                </button>
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
