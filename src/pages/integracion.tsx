import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { ConnectCalendarButton } from '@/features/visitas'

export function IntegracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Integración</h1>
        <p className="text-neutral-600 mt-1">Servicios externos conectados al CRM</p>
      </div>

      <div className="max-w-lg">
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Google Calendar</CardTitle>
                  <Badge variant="success">Conectado</Badge>
                </div>
                <CardDescription className="mt-0.5">
                  Sincroniza visitas y eventos con Google Calendar
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ConnectCalendarButton variant="outline" />
          </CardContent>
        </Card>
      </div>

      <div className="max-w-lg p-5 bg-neutral-50 border border-outline-variant/50 rounded-lg">
        <p className="text-sm font-medium text-neutral-700 mb-1">¿Necesitás otras integraciones?</p>
        <p className="text-sm text-neutral-500">
          Las integraciones adicionales (WhatsApp, Email, Webhooks) se configuran directamente en el código.
          Contactá al equipo técnico para habilitarlas.
        </p>
      </div>
    </div>
  )
}
