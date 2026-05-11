import { useState } from 'react'
import { useStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Mail,
  Calendar,
  Link,
  Plug,
  XCircle,
  RefreshCw,
  ExternalLink,
  Zap,
  Send,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const integrations = [
  {
    id: 'email',
    name: 'Email',
    description: 'Conecta con Gmail, Outlook u otro proveedor de email',
    icon: Mail,
    connected: true,
    status: 'active',
    lastSync: '2024-04-15 10:30',
  },
  {
    id: 'calendar',
    name: 'Calendario',
    description: 'Sincroniza visitas y eventos con Google Calendar o Outlook',
    icon: Calendar,
    connected: true,
    status: 'active',
    lastSync: '2024-04-15 10:30',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Envía mensajes automáticos a leads y clientes',
    icon: Send,
    connected: false,
    status: 'disconnected',
    lastSync: null,
  },
  {
    id: 'webhook',
    name: 'Webhooks',
    description: 'Envía notificaciones a sistemas externos',
    icon: Link,
    connected: false,
    status: 'disconnected',
    lastSync: null,
  },
]

const webhooks = [
  { id: '1', name: 'Notificación cierre', url: 'https://api.example.com/webhook/cierre', events: ['deal_closed'], active: true },
  { id: '2', name: 'Nuevo lead CRM', url: 'https://api.example.com/webhook/lead', events: ['new_lead'], active: true },
]

export function IntegracionPage() {
  const { addToast } = useStore()
  const [showNewWebhookModal, setShowNewWebhookModal] = useState(false)
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', events: [] as string[] })

  const handleToggleIntegration = (_id: string, connected: boolean) => {
    if (connected) {
      addToast({ title: 'Integración desconectada', description: `La conexión fue removida`, variant: 'success' })
    } else {
      addToast({ title: 'Conexión iniciada', description: `Completá la configuración para conectar`, variant: 'success' })
    }
  }

  const handleSyncAll = () => {
    addToast({ title: 'Sincronizando...', description: 'Actualizando datos de todas las integraciones', variant: 'default' })
    setTimeout(() => {
      addToast({ title: 'Sincronización completa', description: 'Todos los datos están actualizados', variant: 'success' })
    }, 2000)
  }

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      addToast({ title: 'Error', description: 'Completá todos los campos', variant: 'error' })
      return
    }
    addToast({ title: 'Webhook creado', description: `${newWebhook.name} fue configurado`, variant: 'success' })
    setShowNewWebhookModal(false)
    setNewWebhook({ name: '', url: '', events: [] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Integración</h1>
          <p className="text-neutral-600 mt-1">Conecta herramientas externas y automatiza flujos</p>
        </div>
        <Button variant="outline" onClick={handleSyncAll}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Sincronizar Todo
        </Button>
      </div>

      <Tabs defaultValue="integrations">
        <TabsList>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="automations">Automatizaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration) => {
              const Icon = integration.icon
              return (
                <Card key={integration.id} className={cn("transition-all", integration.connected && "border-primary/30")}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center shrink-0", integration.connected ? "bg-primary/10" : "bg-neutral-100")}>
                        <Icon className={cn("h-6 w-6", integration.connected ? "text-primary" : "text-neutral-400")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold font-heading">{integration.name}</h3>
                          <Badge variant={integration.connected ? 'success' : 'neutral'}>
                            {integration.connected ? 'Conectado' : 'No conectado'}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{integration.description}</p>
                        {integration.lastSync && (
                          <p className="text-xs text-neutral-500 mt-2">
                            Última sincronización: {integration.lastSync}
                          </p>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant={integration.connected ? 'outline' : 'default'}
                            size="sm"
                            onClick={() => handleToggleIntegration(integration.id, integration.connected)}
                          >
                            {integration.connected ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" /> Desconectar
                              </>
                            ) : (
                              <>
                                <Plug className="h-4 w-4 mr-2" /> Conectar
                              </>
                            )}
                          </Button>
                          {integration.connected && (
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-4 w-4 mr-2" /> Sincronizar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Webhooks Configurados</h3>
            <Button size="sm" onClick={() => setShowNewWebhookModal(true)}>
              <Plus className="h-4 w-4 mr-2" /> Nuevo Webhook
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-outline-variant/50">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{webhook.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{webhook.url}</p>
                      <div className="flex gap-1 mt-2">
                        {webhook.events.map(event => (
                          <Badge key={event} variant="outline" className="text-xs">{event}</Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant={webhook.active ? 'success' : 'neutral'}>{webhook.active ? 'Activo' : 'Inactivo'}</Badge>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 p-6 bg-neutral-50 rounded-lg">
            <h4 className="font-medium mb-2">API REST</h4>
            <p className="text-sm text-neutral-600 mb-4">
              Accede a tu CRM via API REST para integraciones personalizadas
            </p>
            <div className="bg-neutral-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
              <p>GET https://api.gruposiena.com/v1/properties</p>
              <p>GET https://api.gruposiena.com/v1/leads</p>
              <p>POST https://api.gruposiena.com/v1/deals</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="automations" className="mt-6">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold font-heading">Automatizaciones Activas</h3>
                  <p className="text-sm text-neutral-600 mt-1 mb-4">
                    Estas automatizaciones están funcionando actualmente en tu CRM:
                  </p>
                  <div className="space-y-3">
                    {[
                      { name: 'Recordatorio de visita', description: 'Se envía recordatorio 24h antes de cada visita', active: true },
                      { name: 'Seguimiento lead nuevo', description: 'Se asigna automaticamente y se crea tarea de contacto', active: true },
                      { name: 'Alerta lead sin contacto', description: 'Notifica si un lead no es contactado en 48h', active: true },
                      { name: 'Cierre de documento', description: 'Alerta cuando un documento está por expirar', active: false },
                    ].map((automation, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-md">
                        <button className={cn("w-10 h-6 rounded-full transition-colors relative", automation.active ? "bg-success-500" : "bg-neutral-300")}>
                          <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white transition-transform", automation.active ? "translate-x-5" : "translate-x-1")} />
                        </button>
                        <div>
                          <p className="text-sm font-medium">{automation.name}</p>
                          <p className="text-xs text-neutral-500">{automation.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Webhook Modal */}
      <Dialog open={showNewWebhookModal} onOpenChange={setShowNewWebhookModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo Webhook</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input placeholder="Ej: Notificación de cierre" value={newWebhook.name} onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">URL del Endpoint</label>
              <Input placeholder="https://api.example.com/webhook" value={newWebhook.url} onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Eventos a escuchar</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['new_lead', 'deal_created', 'deal_closed', 'visit_scheduled', 'document_sent'].map(event => (
                  <label key={event} className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-neutral-50">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{event}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewWebhookModal(false)}>Cancelar</Button>
            <Button onClick={handleAddWebhook}>Crear Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
