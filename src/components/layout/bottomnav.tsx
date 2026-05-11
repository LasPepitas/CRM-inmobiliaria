import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import {
  LayoutDashboard,
  Building2,
  Users,
  Kanban,
  CalendarDays,
  CheckSquare,
  FileText,
} from 'lucide-react'

const mobileNavItems = [
  { id: 'overview', label: 'Home', icon: LayoutDashboard },
  { id: 'propiedades', label: 'Prop.', icon: Building2 },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: Kanban },
  { id: 'visitas', label: 'Visitas', icon: CalendarDays },
  { id: 'tareas', label: 'Tareas', icon: CheckSquare },
  { id: 'documentos', label: 'Docs', icon: FileText },
]

export function BottomNav() {
  const { ui, setActivePage } = useStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary border-t border-primary-800 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = ui.activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-md transition-colors min-w-[48px]",
                isActive
                  ? "text-secondary"
                  : "text-on-primary/60 hover:text-on-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}