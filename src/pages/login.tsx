import { useState } from 'react'
import { useAuth } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import showcaseImage from '@/assets/siena_login_showcase.png'

export function LoginPage() {
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row font-body">
      {/* Panel Izquierdo: Formulario de Login */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-between p-6 sm:p-8 lg:p-12 xl:p-16 bg-surface-container-lowest min-h-screen border-r border-outline-variant/30">
        {/* Cabecera / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-sm">
            <svg className="h-6 w-6 text-on-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          </div>
          <span className="text-xl font-bold font-heading text-primary tracking-tight">Grupo Siena</span>
        </div>

        {/* Formulario */}
        <div className="w-full max-w-sm mx-auto my-auto py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-primary tracking-tight">
              Portal de Acceso Interno
            </h1>
            <p className="text-sm text-on-surface-variant mt-2">
              Ingresá tus credenciales para acceder al CRM corporativo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-container text-on-error-container text-sm p-3 rounded-lg border border-error/20 flex items-center gap-2">
                <svg className="h-5 w-5 shrink-0 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Correo Electrónico
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="asesor@siena.com"
                  className="pl-10 h-11 border-outline-variant bg-surface-container-lowest focus-visible:ring-primary focus-visible:border-primary transition-all duration-150 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Contraseña
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresá tu contraseña"
                  className="pl-10 pr-10 h-11 border-outline-variant bg-surface-container-lowest focus-visible:ring-primary focus-visible:border-primary transition-all duration-150 rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-on-surface-variant font-normal cursor-pointer select-none"
                >
                  Recordarme
                </Label>
              </div>
              {/* Ocultado por requerimiento inicial 
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-sm font-semibold text-primary hover:text-primary-800 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
              */}
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-medium tracking-wide shadow-card hover:shadow-card-hover rounded-md" loading={isLoading}>
              Iniciar Sesión
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-outline-variant/30 text-center text-xs text-on-surface-variant/80">
          <span>Grupo Siena © 2026 • Portal Corporativo</span>
        </div>
      </div>

      {/* Panel Derecho: Showcase Visual */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] min-h-screen relative overflow-hidden bg-primary-container">
        {/* Background Image */}
        <img
          src={showcaseImage}
          alt="Siena Premium Architecture"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-[10000ms] ease-out"
        />
        {/* Gradient Overlay for Ultra-High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-900/85 to-primary-600/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/70 to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-end p-12 xl:p-20 h-full w-full text-white max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm w-fit">
            Portal Interno
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold font-heading leading-tight tracking-tight mb-4 drop-shadow-md text-white">
            Arquitectura de excelencia,<br />gestión eficiente.
          </h2>
          <p className="text-base xl:text-lg text-primary-50 leading-relaxed max-w-lg opacity-95 drop-shadow-sm font-body">
            Plataforma interna para la administración de desarrollos inmobiliarios, gestión de leads y equipo comercial. Diseñado con precisión arquitectónica.
          </p>
        </div>
      </div>
    </div>
  )
}