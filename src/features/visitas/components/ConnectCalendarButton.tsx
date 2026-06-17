// src/features/visitas/components/ConnectCalendarButton.tsx
// Botón para iniciar el flujo OAuth2 de Google Calendar por asesor.
// IMPORTANTE: usa window.location.href (no fetch) porque el backend
// responde con un 302 redirect al consent screen de Google.

import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'

interface ConnectCalendarButtonProps {
  /** Variante de display para usar en distintos contextos (página Ajustes, card, etc.) */
  variant?: 'default' | 'outline' | 'ghost'
}

export function ConnectCalendarButton({ variant = 'outline' }: ConnectCalendarButtonProps) {
  const handleConnect = () => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
    // Navegación directa — el backend responde 302 al flujo OAuth de Google.
    // No usar fetch/apiClient aquí: los redirects 302 no funcionan con fetch.
    window.location.href = `${apiUrl}/auth/google`
  }

  return (
    <Button variant={variant} onClick={handleConnect} className="gap-2">
      <CalendarDays className="h-4 w-4" />
      Conectar Google Calendar
    </Button>
  )
}
