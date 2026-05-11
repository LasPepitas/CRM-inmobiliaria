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
}

function App() {
  const { ui } = useStore()
  const PageComponent = pages[ui.activePage] || OverviewPage

  return (
    <Layout>
      <PageComponent />
    </Layout>
  )
}

export default App
