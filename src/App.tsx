import { useEffect } from 'react'
import { useAuth } from '@/features/auth'
import { useStore } from '@/store'
import { Layout } from '@/components/layout/layout'
import {
  OverviewPage,
  PropertiesPage,
  LeadsPage,
  PipelinePage,
  VisitasPage,
  TareasPage,
  ReportesPage,
  DocumentosPage,
  IntegracionPage,
  EquipoPage,
  AjustesPage,
  WhatsAppPage,
  LandingPage,
  LoginPage,
} from '@/pages'

const pages: Record<string, React.ComponentType> = {
  overview: OverviewPage,
  propiedades: PropertiesPage,
  leads: LeadsPage,
  pipeline: PipelinePage,
  visitas: VisitasPage,
  tareas: TareasPage,
  reportes: ReportesPage,
  documentos: DocumentosPage,
  integracion: IntegracionPage,
  equipo: EquipoPage,
  ajustes: AjustesPage,
  whatsapp: WhatsAppPage,
}

function App() {
  const { isAuthenticated, isLoading, checkSession } = useAuth()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const isLanding = window.location.hash === '#landing' || window.location.pathname === '/landing'

  if (isLanding) {
    return <LandingPage />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-on-surface-variant">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <AuthenticatedApp />
}

function AuthenticatedApp() {
  const { ui } = useStore()
  const { hasRoutePermission } = useAuth()
  
  const isAllowed = hasRoutePermission(ui.activePage)
  const PageComponent = isAllowed ? (pages[ui.activePage] || OverviewPage) : OverviewPage

  return (
    <Layout>
      <PageComponent />
    </Layout>
  )
}

export default App