import React, { useState } from 'react'
import { useStore } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Save, Shield, CheckCircle, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

const roles = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo a todas las funciones',
    color: 'error',
    permissions: ['all'],
  },
  {
    id: 'gerente',
    name: 'Gerente',
    description: 'Gestión de equipo y reportes',
    color: 'warning',
    permissions: ['leads', 'deals', 'reports', 'team'],
  },
  {
    id: 'asesor',
    name: 'Asesor',
    description: 'Gestión de sus propios leads y propiedades',
    color: 'default',
    permissions: ['leads', 'deals', 'properties'],
  },
  {
    id: 'readonly',
    name: 'Solo Lectura',
    description: 'Puede ver información pero no modificar',
    color: 'neutral',
    permissions: ['leads_view', 'deals_view', 'reports_view'],
  },
]

const defaultPermissions = {
  Leads: { Ver: [true, true, true, false], Crear: [true, true, true, false], Editar: [true, true, true, false], Eliminar: [true, false, false, false] },
  Propiedades: { Ver: [true, true, true, false], Crear: [true, true, true, false], Editar: [true, true, true, false], Eliminar: [true, false, false, false] },
  Pipeline: { Ver: [true, true, true, false], Crear: [true, true, true, false], 'Mover Etapas': [true, true, true, false], Eliminar: [true, false, false, false] },
  Visitas: { Ver: [true, true, true, false], Programar: [true, true, true, false], Cancelar: [true, true, false, false] },
  Tareas: { Ver: [true, true, true, false], Crear: [true, true, true, false], Completar: [true, true, true, false] },
  Documentos: { Ver: [true, true, true, false], Crear: [true, true, true, false], Enviar: [true, true, true, false], Eliminar: [true, false, false, false] },
  Reportes: { Ver: [true, true, true, false], Exportar: [true, true, false, false] },
  Equipo: { Ver: [true, true, false, false], Agregar: [true, false, false, false], Editar: [true, false, false, false], Eliminar: [true, false, false, false] },
  Configuración: { Ver: [true, true, false, false], Editar: [true, false, false, false] },
}

type PermissionsType = typeof defaultPermissions

function RoleItem({ role }: { role: typeof roles[0] }) {
  const [enabled, setEnabled] = useState(role.id !== 'readonly')
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-medium">{role.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500">{enabled ? 'Activo' : 'Inactivo'}</span>
          <button
            onClick={() => setEnabled(!enabled)}
            className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", enabled ? "bg-primary" : "bg-neutral-200")}
          >
            <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", enabled ? "translate-x-6" : "translate-x-1")} />
          </button>
        </div>
      </div>
      <p className="text-sm text-neutral-600">{role.description}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {role.permissions.map(p => (
          <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
        ))}
      </div>
    </div>
  )
}

export function AjustesPage() {
  const { addToast, ui, toggleDarkMode } = useStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [permissions, setPermissions] = useState<PermissionsType>(defaultPermissions)
  const [isSaving, setIsSaving] = useState(false)

  const togglePermission = (module: keyof PermissionsType, action: string, roleIndex: number) => {
    if (roleIndex === 0) return
    const perms = permissions[module][action as keyof PermissionsType[typeof module]]
    const updated = perms.map((v: boolean, i: number) => i === roleIndex ? !v : v)
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: updated,
      },
    }))
  }

  const handleSavePermissions = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      addToast({ title: 'Permisos guardados', description: 'La matriz de permisos fue actualizada', variant: 'success' })
    }, 500)
  }

  const handleSaveProfile = () => {
    addToast({ title: 'Perfil actualizado', description: 'Tu información fue guardada correctamente', variant: 'success' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Ajustes</h1>
          <p className="text-neutral-600 mt-1">Configura tu cuenta y seguridad</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">Modo Oscuro</span>
          <button
            onClick={toggleDarkMode}
            className={cn(
              "relative h-10 w-20 rounded-full transition-colors duration-300",
              ui.darkMode ? "bg-primary" : "bg-neutral-200"
            )}
          >
            <span
              className={cn(
                "absolute top-1 h-8 w-8 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center",
                ui.darkMode ? "translate-x-10" : "translate-x-1"
              )}
            >
              {ui.darkMode ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-warning" />}
            </span>
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tu información de perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input defaultValue="Roberto García" />
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    <Input defaultValue="García" />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" defaultValue="roberto.garcia@siena.com" />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input type="tel" defaultValue="+54 11 4567-8900" />
                </div>
                <div>
                  <Label>Cargo</Label>
                  <Input defaultValue="Gerente de Ventas" />
                </div>
                <div className="pt-4">
                  <Button onClick={handleSaveProfile}><Save className="h-4 w-4 mr-2" />Guardar Cambios</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Contraseña Actual</Label>
                  <Input type="password" />
                </div>
                <div>
                  <Label>Nueva Contraseña</Label>
                  <Input type="password" />
                </div>
                <div>
                  <Label>Confirmar Contraseña</Label>
                  <Input type="password" />
                </div>
                <Button variant="outline" className="w-full">Actualizar Contraseña</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Roles y Permisos</CardTitle>
                <CardDescription>Configura los niveles de acceso para cada rol</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {roles.map((role) => (
                  <RoleItem key={role.id} role={role} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Matriz de Permisos</CardTitle>
                <CardDescription>Qué puede hacer cada rol en cada sección</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-medium text-neutral-600">Permiso</th>
                      {roles.map(role => (
                        <th key={role.id} className="text-center py-3 px-4 min-w-[90px]">
                          <div className="flex flex-col items-center gap-2">
                            <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white",
                              role.id === 'admin' ? "bg-error-500" : role.id === 'gerente' ? "bg-warning-500" : role.id === 'asesor' ? "bg-primary" : "bg-neutral-400"
                            )}>
                              {role.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <span className="text-xs font-medium text-neutral-700">{role.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.keys(permissions) as (keyof PermissionsType)[]).map((module) => (
                      <React.Fragment key={module}>
                        <tr className="bg-primary/5">
                          <td colSpan={5} className="py-2 px-4 font-semibold text-primary text-xs uppercase tracking-wider">{module}</td>
                        </tr>
                        {(Object.keys(permissions[module]) as (keyof PermissionsType[typeof module] & string)[]).map((action) => (
                          <tr key={`${module}-${action}`} className="hover:bg-neutral-50/50">
                            <td className="py-2.5 px-4 pl-8 text-neutral-700">{action}</td>
                            {permissions[module][action].map((has: boolean, ri: number) => (
                              <td key={ri} className="text-center py-2.5 px-4">
                                <button
                                  onClick={() => togglePermission(module, action as string, ri)}
                                  className={cn(
                                    "h-7 w-7 rounded-md border-2 flex items-center justify-center mx-auto transition-all duration-150",
                                    has
                                      ? "bg-success-500/10 border-success-500 hover:bg-success-500/20"
                                      : "bg-white border-neutral-300 hover:border-success-500/50",
                                    ri === 0 && "cursor-not-allowed opacity-60"
                                  )}
                                >
                                  <CheckCircle className={cn("h-4 w-4", has ? "text-success-500" : "text-transparent")} />
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button onClick={handleSavePermissions} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Guardando...' : 'Guardar Permisos'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
