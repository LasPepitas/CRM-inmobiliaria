import { useStore } from '@/store'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { BottomNav } from './bottomnav'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { ui } = useStore()
  const collapsed = ui.sidebarCollapsed

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <Topbar />
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300 pb-20 md:pb-6",
          collapsed ? "pl-[72px]" : "pl-[240px]"
        )}
      >
        <div className="max-w-[1440px] mx-auto p-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
