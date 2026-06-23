import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  Users,
  Kanban,
  CalendarDays,
  CheckSquare,
  FileText,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const mobileNavItems = [
  { id: 'overview', label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'propiedades', label: 'Prop.', icon: Building2, path: '/dashboard/propiedades' },
  { id: 'leads', label: 'Leads', icon: Users, path: '/dashboard/leads' },
  { id: 'pipeline', label: 'Pipeline', icon: Kanban, path: '/dashboard/pipeline' },
  { id: 'visitas', label: 'Visitas', icon: CalendarDays, path: '/dashboard/visitas' },
  { id: 'tareas', label: 'Tareas', icon: CheckSquare, path: '/dashboard/tareas' },
  { id: 'documentos', label: 'Docs', icon: FileText, path: '/dashboard/documents' },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary border-t border-primary-800 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-md transition-colors min-w-[48px]",
                isActive
                  ? "text-secondary"
                  : "text-on-primary/60 hover:text-on-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}