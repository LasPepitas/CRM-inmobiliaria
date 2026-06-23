import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
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
  LoginPage,
  LandingPage,
} from '@/pages'

function DashboardLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas Libres */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />

      {/* Rutas Públicas Restringidas (Login) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Rutas Privadas / Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Sub-rutas del dashboard */}
          <Route index element={<OverviewPage />} />
          <Route path="propiedades" element={<PropertiesPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="visitas" element={<VisitasPage />} />
          <Route path="tareas" element={<TareasPage />} />
          <Route path="documents" element={<DocumentosPage />} />
          
          {/* Sub-rutas con permisos específicos */}
          <Route element={<ProtectedRoute requiredPermission="whatsapp" />}>
            <Route path="whatsapp" element={<WhatsAppPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermission="integracion" />}>
            <Route path="integracion" element={<IntegracionPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermission="equipo" />}>
            <Route path="equipo" element={<EquipoPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermission="ajustes" />}>
            <Route path="ajustes" element={<AjustesPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermission="reportes" />}>
            <Route path="reportes" element={<ReportesPage />} />
          </Route>
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
