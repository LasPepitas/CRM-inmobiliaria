import { useState, useEffect, useRef } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Shield, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

// Declaración global para Turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

export function LandingPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [interestedProperty, setInterestedProperty] = useState('Torre Siena Premium')
  
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  // Cargar el script de Turnstile de forma dinámica
  useEffect(() => {
    // Si ya existe el script, no duplicarlo
    let script = document.querySelector('script[src*="turnstile"]') as HTMLScriptElement
    
    const initializeWidget = () => {
      if (window.turnstile && turnstileContainerRef.current && !widgetIdRef.current) {
        try {
          const id = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: '0x4AAAAAADoXF2DfldOivLM9', // Sitekey de Turnstile provista por el usuario
            callback: (token: string) => {
              setTurnstileToken(token)
              setErrorMessage(null)
            },
            'error-callback': () => {
              setErrorMessage('Error al inicializar la verificación de seguridad.')
            },
          })
          widgetIdRef.current = id
        } catch (e) {
          console.error('Error rendering Turnstile:', e)
        }
      }
    }

    if (!script) {
      script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
      script.onload = initializeWidget
    } else {
      // Si el script ya estaba cargado pero el widget no, intentar renderizarlo
      if (window.turnstile) {
        initializeWidget()
      } else {
        script.addEventListener('load', initializeWidget)
      }
    }

    return () => {
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        } catch (e) {
          // Ignorar errores al desmontar
        }
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!firstName || !lastName) {
      setErrorMessage('Por favor, ingresá tu nombre y apellido.')
      return
    }

    if (!turnstileToken) {
      setErrorMessage('Por favor, completá la verificación de seguridad de Turnstile.')
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        firstName,
        lastName,
        email: email || undefined,
        phone: phone || undefined,
        source: 'Web',
        interestedProperty,
        notes: notes || undefined,
      }

      await apiClient.post('/leads/public', payload, {
        headers: {
          'X-Turnstile-Token': turnstileToken, // token en los headers
        },
      })

      setSuccessMessage('¡Registro exitoso! Un asesor comercial se contactará con vos a la brevedad.')
      
      // Limpiar formulario
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setNotes('')
      setTurnstileToken(null)

      // Reiniciar widget de Turnstile para una futura sumisión
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current)
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Ocurrió un error al enviar el formulario. Intentá nuevamente.')
      
      // Resetear Turnstile en caso de error
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current)
        setTurnstileToken(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col items-center">
      {/* Navbar Minimalista Premium */}
      <header className="w-full max-w-7xl px-6 py-6 flex items-center justify-between border-b border-outline-variant/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-md shadow-sm">
            <Building2 className="h-5 w-5 text-on-primary" />
          </div>
          <span className="text-lg font-bold font-heading text-primary tracking-tight">Grupo Siena</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <a href="#detalles" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Proyecto</a>
          <a href="#contacto" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Inscribirse</a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-7xl px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Lanzamiento Exclusivo
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-primary tracking-tight leading-tight">
            Descubrí la Torre Siena Premium
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
            Un desarrollo arquitectónico de vanguardia diseñado para quienes valoran la sofisticación, el confort y la rentabilidad. Ubicación privilegiada con amenities de primer nivel.
          </p>

          {/* Características */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-primary">Ubicación Estratégica</h3>
                <p className="text-xs text-on-surface-variant">En el corazón corporativo y residencial de la ciudad.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-primary">Amenities AAA</h3>
                <p className="text-xs text-on-surface-variant">Piscina infinity, gimnasio de última generación y coworking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Captura de Leads con Turnstile */}
        <div id="contacto" className="lg:col-span-5 bg-surface-container-lowest p-6 sm:p-8 rounded-lg border border-outline-variant/30 shadow-card">
          <h2 className="text-xl font-bold font-heading text-primary tracking-tight mb-2">
            Solicitá Información Exclusiva
          </h2>
          <p className="text-xs text-on-surface-variant mb-6">
            Completá tus datos y un asesor especializado te enviará el dossier y los planes de financiación.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <div className="bg-green-50 text-green-800 text-sm p-4 rounded-md border border-green-200 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="bg-error-container text-on-error-container text-sm p-4 rounded-md border border-error/20 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-error mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Nombre *
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ej: Juan"
                  className="h-10 border-outline-variant bg-surface-container-lowest rounded-md text-sm"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Apellido *
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ej: Pérez"
                  className="h-10 border-outline-variant bg-surface-container-lowest rounded-md text-sm"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan.perez@mail.com"
                className="h-10 border-outline-variant bg-surface-container-lowest rounded-md text-sm"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Teléfono de Contacto
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: +54 9 11 5555-5555"
                className="h-10 border-outline-variant bg-surface-container-lowest rounded-md text-sm"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="property" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Proyecto de Interés
              </Label>
              <Input
                id="property"
                value={interestedProperty}
                onChange={(e) => setInterestedProperty(e.target.value)}
                className="h-10 border-outline-variant bg-surface-container-lowest rounded-md text-sm"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Notas o Comentarios
              </Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="¿Tenés alguna consulta específica?"
                className="w-full p-3 text-sm border border-outline-variant bg-surface-container-lowest rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent min-h-[60px]"
                disabled={isLoading}
              />
            </div>

            {/* Contenedor oficial de Cloudflare Turnstile */}
            <div className="py-2 flex justify-center">
              <div id="turnstile-container" ref={turnstileContainerRef} />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold tracking-wide shadow-sm hover:shadow-md rounded-md bg-secondary hover:bg-secondary/90 text-on-secondary"
              loading={isLoading}
            >
              Inscribirme Ahora
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-on-surface-variant/80">
            <Shield className="h-3 w-3 text-secondary" />
            <span>Protección anti-bots activa mediante Cloudflare Turnstile.</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl px-6 py-8 border-t border-outline-variant/20 text-center text-xs text-on-surface-variant/60">
        <span>Grupo Siena © 2026 • Portal Público de Desarrollos Inmobiliarios Premium</span>
      </footer>
    </div>
  )
}
