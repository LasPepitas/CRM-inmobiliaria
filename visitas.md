# Integración Frontend ↔ Backend — Módulo Visitas

## Stack actual

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite + TypeScript |
| Estado | Zustand (slices) |
| Backend | NestJS (`http://localhost:3000`) |
| Auth | JWT en header `Authorization: Bearer <token>` |

---

## 1. Configuración Base

### `src/lib/apiClient.ts` — Cliente HTTP base

```typescript
// src/lib/apiClient.ts

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function getToken(): string | null {
  return localStorage.getItem('crm_token')
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  const url = new URL(`${BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  const token = getToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  }

  const response = await fetch(url.toString(), { ...fetchOptions, headers })

  // El backend envuelve respuestas exitosas en { data, meta }
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.message ?? `Error ${response.status}`)
  }

  // El ResponseInterceptor del backend devuelve { data: T, meta: {...} }
  return json.data as T
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', params }),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}
```

### `.env.local` en el frontend

```env
VITE_API_URL=http://localhost:3000
```

---

## 2. Mapeo de Tipos

El frontend y backend tienen nombres de campos diferentes. Esta tabla es la referencia central:

| Frontend (`Visit`) | Backend (`Appointment`) | Transformación |
|---|---|---|
| `id` | `id` | igual |
| `date` | `startTime` | `date + time` → ISO string |
| `time` | *(incluido en startTime)* | combinado |
| *(no existe)* | `endTime` | → `startTime + 1 hora` por defecto |
| *(no existe)* | `title` | auto: `"Visita: {propertyTitle}"` |
| `status` | `status` | `"Programada"` ↔ `"PROGRAMADA"` |
| `agent` | `advisorId` | igual (UUID) |
| `property_id` | `propertyId` | igual (UUID) |
| `lead_id` | `leadId` | igual (UUID) |
| `notes` | `notes` | igual |
| *(no existe)* | `googleEventId` | para futuro uso |

### Status mapping

```typescript
// Frontend → Backend
const STATUS_TO_BACKEND: Record<string, string> = {
  'Programada': 'PROGRAMADA',
  'Completada': 'COMPLETADA',
  'Cancelada': 'CANCELADA',
}

// Backend → Frontend
const STATUS_TO_FRONTEND: Record<string, Visit['status']> = {
  'PROGRAMADA': 'Programada',
  'COMPLETADA': 'Completada',
  'CANCELADA': 'Cancelada',
}
```

---

## 3. Capa de API — `src/features/visitas/api/appointmentsApi.ts`

```typescript
// src/features/visitas/api/appointmentsApi.ts
import { apiClient } from '@/lib/apiClient'
import type { Visit } from '@/store/slices/visitsSlice'
import type { NewVisitForm } from '../types'

// ─── Tipos del backend ────────────────────────────────────────────────────────

export interface AppointmentResponse {
  id: string
  title: string
  startTime: string       // ISO 8601: "2026-06-15T10:00:00.000Z"
  endTime: string         // ISO 8601: "2026-06-15T11:00:00.000Z"
  status: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA'
  notes: string | null
  location: string | null
  googleEventId: string | null
  advisorId: string
  leadId: string | null
  propertyId: string | null
  advisor: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  lead: { id: string; firstName: string; lastName: string } | null
  property: { id: string; title: string } | null
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentPayload {
  title: string           // Requerido por el backend
  startTime: string       // ISO 8601
  endTime: string         // ISO 8601
  notes?: string
  location?: string
  leadId?: string
  propertyId?: string
  advisorId?: string      // Solo honrado por managers/admins
}

export interface UpdateAppointmentPayload extends Partial<CreateAppointmentPayload> {}

// ─── Transformadores ──────────────────────────────────────────────────────────

const STATUS_TO_FRONTEND: Record<string, Visit['status']> = {
  PROGRAMADA: 'Programada',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
}

const STATUS_TO_BACKEND: Record<string, string> = {
  Programada: 'PROGRAMADA',
  Completada: 'COMPLETADA',
  Cancelada: 'CANCELADA',
}

/**
 * Convierte la respuesta del backend al tipo Visit que usa el frontend.
 */
export function toVisit(appt: AppointmentResponse): Visit {
  const start = new Date(appt.startTime)
  return {
    id: appt.id,
    property_id: appt.propertyId ?? '',
    lead_id: appt.leadId ?? '',
    // "YYYY-MM-DD" en timezone local
    date: start.toISOString().split('T')[0],
    // "HH:MM" en timezone local
    time: start.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false }),
    status: STATUS_TO_FRONTEND[appt.status] ?? 'Programada',
    agent: appt.advisorId,
    notes: appt.notes ?? '',
  }
}

/**
 * Convierte el formulario del frontend al payload que espera el backend.
 */
export function toCreatePayload(form: NewVisitForm, propertyTitle?: string): CreateAppointmentPayload {
  // Combinamos date + time en un ISO string
  const startISO = new Date(`${form.date}T${form.time || '09:00'}:00`).toISOString()
  // Por defecto, la visita dura 1 hora
  const endISO = new Date(
    new Date(`${form.date}T${form.time || '09:00'}:00`).getTime() + 60 * 60 * 1000
  ).toISOString()

  // Auto-generamos el título si no lo tiene el form
  const title = form.title || (propertyTitle ? `Visita: ${propertyTitle}` : 'Visita programada')

  return {
    title,
    startTime: startISO,
    endTime: endISO,
    notes: form.notes || undefined,
    location: form.location || undefined,
    leadId: form.lead_id || undefined,
    propertyId: form.property_id || undefined,
    advisorId: form.agent || undefined,
  }
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const appointmentsApi = {
  /** GET /appointments — lista filtrada por RBAC automáticamente */
  getAll: () =>
    apiClient.get<AppointmentResponse[]>('/appointments'),

  /** GET /appointments/:id */
  getById: (id: string) =>
    apiClient.get<AppointmentResponse>(`/appointments/${id}`),

  /** POST /appointments */
  create: (payload: CreateAppointmentPayload) =>
    apiClient.post<AppointmentResponse>('/appointments', payload),

  /** PATCH /appointments/:id */
  update: (id: string, payload: UpdateAppointmentPayload) =>
    apiClient.patch<AppointmentResponse>(`/appointments/${id}`, payload),

  /** DELETE /appointments/:id */
  remove: (id: string) =>
    apiClient.delete<AppointmentResponse>(`/appointments/${id}`),
}
```

---

## 4. Actualización del Zustand Slice

El slice actual usa datos mock en memoria. Se actualiza para soportar operaciones async:

### `src/store/slices/visitsSlice.ts` — Actualizado

```typescript
// src/store/slices/visitsSlice.ts
import type { StateCreator } from 'zustand'
import type { Store } from '@/store'
import { appointmentsApi, toVisit, toCreatePayload } from '@/features/visitas/api/appointmentsApi'
import type { NewVisitForm } from '@/features/visitas/types'

export interface Visit {
  id: string
  property_id: string
  lead_id: string
  date: string            // "YYYY-MM-DD"
  time: string            // "HH:MM"
  status: 'Programada' | 'Completada' | 'Cancelada'
  agent: string           // advisorId (UUID)
  notes: string
}

export interface VisitsSlice {
  visits: Visit[]
  visitsLoading: boolean
  visitsError: string | null

  // Actions
  fetchVisits: () => Promise<void>
  addVisit: (form: NewVisitForm & { title?: string }, propertyTitle?: string) => Promise<void>
  updateVisit: (id: string, updates: Partial<Visit>) => Promise<void>
  removeVisit: (id: string) => Promise<void>
}

export const createVisitsSlice: StateCreator<Store, [], [], VisitsSlice> = (set, get) => ({
  visits: [],
  visitsLoading: false,
  visitsError: null,

  fetchVisits: async () => {
    set({ visitsLoading: true, visitsError: null })
    try {
      const data = await appointmentsApi.getAll()
      set({ visits: data.map(toVisit), visitsLoading: false })
    } catch (err) {
      set({
        visitsError: err instanceof Error ? err.message : 'Error al cargar visitas',
        visitsLoading: false,
      })
    }
  },

  addVisit: async (form, propertyTitle) => {
    const payload = toCreatePayload(form, propertyTitle)
    const created = await appointmentsApi.create(payload)
    set((state) => ({ visits: [...state.visits, toVisit(created)] }))
  },

  updateVisit: async (id, updates) => {
    // Construir el payload de update según los cambios
    const payload: Record<string, unknown> = {}
    if (updates.status) payload.status = updates.status === 'Programada' ? 'PROGRAMADA'
      : updates.status === 'Completada' ? 'COMPLETADA' : 'CANCELADA'
    if (updates.notes !== undefined) payload.notes = updates.notes

    const updated = await appointmentsApi.update(id, payload)
    set((state) => ({
      visits: state.visits.map((v) => (v.id === id ? toVisit(updated) : v)),
    }))
  },

  removeVisit: async (id) => {
    await appointmentsApi.remove(id)
    set((state) => ({ visits: state.visits.filter((v) => v.id !== id) }))
  },
})
```

---

## 5. Actualización del Hook `useVisitas`

### `src/features/visitas/hooks/useVisitas.ts` — Actualizado

```typescript
// src/features/visitas/hooks/useVisitas.ts
import { useState, useMemo, useEffect } from 'react'
import { useStore } from '@/store'
import type { NewVisitForm } from '../types'
import { NEW_VISIT_DEFAULT } from '../types'
import { formatDate } from '@/lib/utils'

export function useVisitas() {
  const {
    visits,
    visitsLoading,
    visitsError,
    properties,
    leads,
    agents,
    fetchVisits,
    addVisit,
    addToast,
  } = useStore()

  const [statusFilter, setStatusFilter] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [showNewVisitModal, setShowNewVisitModal] = useState(false)
  const [newVisit, setNewVisit] = useState<NewVisitForm>(NEW_VISIT_DEFAULT)

  // Carga inicial desde el backend
  useEffect(() => {
    fetchVisits()
  }, [fetchVisits])

  const filteredVisits = useMemo(
    () => visits.filter((v) => {
      const matchesStatus = !statusFilter || v.status === statusFilter
      const matchesAgent = !agentFilter || v.agent === agentFilter
      return matchesStatus && matchesAgent
    }),
    [visits, statusFilter, agentFilter]
  )

  const upcomingVisits = useMemo(
    () =>
      filteredVisits
        .filter((v) => v.status === 'Programada')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [filteredVisits]
  )

  const sortedVisits = useMemo(
    () => [...filteredVisits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [filteredVisits]
  )

  const getAgentName = (agentId: string) =>
    agents.find((a) => a.id === agentId)?.name || 'Agente'

  const getVisitsByDate = (dateStr: string) =>
    visits.filter((v) => v.date === dateStr)

  const activeFilters = [statusFilter, agentFilter].filter(Boolean).length

  const clearFilters = () => {
    setStatusFilter('')
    setAgentFilter('')
  }

  const handleAddVisit = async () => {
    if (!newVisit.property_id || !newVisit.lead_id || !newVisit.date || !newVisit.time) {
      addToast({ title: 'Error', description: 'Completá los campos obligatorios', variant: 'error' })
      return
    }
    try {
      const property = properties.find((p) => p.id === newVisit.property_id)
      await addVisit(newVisit, property?.title)
      addToast({
        title: 'Visita programada',
        description: `Visita agendada para el ${formatDate(newVisit.date)} a las ${newVisit.time}`,
        variant: 'success',
      })
      setShowNewVisitModal(false)
      setNewVisit(NEW_VISIT_DEFAULT)
    } catch (err) {
      addToast({
        title: 'Error al programar visita',
        description: err instanceof Error ? err.message : 'Intente nuevamente',
        variant: 'error',
      })
    }
  }

  return {
    // data
    visits,
    filteredVisits,
    upcomingVisits,
    sortedVisits,
    properties,
    leads,
    agents,
    // async state
    visitsLoading,
    visitsError,
    // ui state
    statusFilter,
    agentFilter,
    showNewVisitModal,
    newVisit,
    activeFilters,
    // setters
    setStatusFilter,
    setAgentFilter,
    setShowNewVisitModal,
    setNewVisit,
    // actions
    getAgentName,
    getVisitsByDate,
    clearFilters,
    handleAddVisit,
  }
}
```

---

## 6. Cambios en `NewVisitForm` y `NewVisitModal`

El backend requiere `title` y opcionalmente `location`. El formulario necesita estos campos:

### `src/features/visitas/types.ts` — Actualizar `NewVisitForm`

```typescript
// AGREGAR estos campos a NewVisitForm:
export interface NewVisitForm {
  property_id: string
  lead_id: string
  date: string
  time: string
  agent: string
  notes: string
  // Nuevos campos para el backend:
  title?: string          // Si está vacío, el API layer auto-genera "Visita: {propertyTitle}"
  location?: string       // Opcional — se pasa a Google Calendar
  endTime?: string        // Opcional — si no se provee, se asume startTime + 1 hora
}

export const NEW_VISIT_DEFAULT: NewVisitForm = {
  property_id: '',
  lead_id: '',
  date: '',
  time: '',
  agent: '',
  notes: '',
  title: '',
  location: '',
}
```

### `NewVisitModal.tsx` — Agregar campos opcionales

En el modal, agregar después del campo "Notas":

```tsx
{/* Ubicación (opcional) */}
<div>
  <label className="text-sm font-medium">Ubicación</label>
  <Input
    id="visit-location"
    placeholder="Dirección o punto de encuentro..."
    value={form.location ?? ''}
    onChange={e => field('location', e.target.value)}
    className="mt-1"
  />
</div>
```

---

## 7. Loading y Error State en `VisitasPage`

La página debe mostrar estados de carga. Agregar al `VisitasPage`:

```tsx
// En el hook destructuring agregar:
const { visitsLoading, visitsError, ... } = useVisitas()

// Justo antes del filter bar:
{visitsError && (
  <div className="rounded-md bg-error-50 border border-error-200 px-4 py-3 text-sm text-error-700">
    Error al cargar visitas: {visitsError}
    <button className="ml-2 underline" onClick={() => fetchVisits()}>Reintentar</button>
  </div>
)}

// En el contador de visitas del filter bar:
<span className="ml-auto text-sm text-neutral-500">
  {visitsLoading ? 'Cargando...' : `${filteredVisits.length} visitas`}
</span>
```

---

## 8. Endpoints del Backend — Referencia Rápida

**Base URL local:** `http://localhost:3000`

**Header requerido en todos (excepto callback OAuth):**
```
Authorization: Bearer <JWT_TOKEN>
```

**La respuesta siempre tiene este envelope:**
```json
{
  "data": { ... },
  "meta": {}
}
```

### Appointments

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| `GET` | `/appointments` | — | Lista (RBAC auto) |
| `GET` | `/appointments/:id` | — | Detalle |
| `POST` | `/appointments` | `CreateAppointmentPayload` | Crear |
| `PATCH` | `/appointments/:id` | `UpdateAppointmentPayload` | Actualizar |
| `DELETE` | `/appointments/:id` | — | Eliminar |

### POST /appointments — Payload completo

```json
{
  "title": "Visita: Departamento en Miraflores",
  "startTime": "2026-06-15T15:00:00.000Z",
  "endTime": "2026-06-15T16:00:00.000Z",
  "notes": "Cliente viene con su pareja",
  "location": "Av. Larco 123, Miraflores",
  "leadId": "uuid-del-lead",
  "propertyId": "uuid-de-la-propiedad",
  "advisorId": "uuid-del-asesor"
}
```

> [!NOTE]
> `advisorId` en el body solo es honrado si el token JWT pertenece a un rol manager/admin. Si el token es de un asesor, se usa su propio ID automáticamente.

### GET /appointments — Respuesta ejemplo

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Visita: Departamento en Miraflores",
      "startTime": "2026-06-15T15:00:00.000Z",
      "endTime": "2026-06-15T16:00:00.000Z",
      "status": "PROGRAMADA",
      "notes": "Cliente viene con su pareja",
      "location": "Av. Larco 123, Miraflores",
      "googleEventId": "abc123xyz",
      "advisorId": "uuid-del-asesor",
      "leadId": "uuid-del-lead",
      "propertyId": "uuid-de-propiedad",
      "advisor": { "id": "...", "firstName": "Carlos", "lastName": "Pérez", "email": "..." },
      "lead": { "id": "...", "firstName": "Ana", "lastName": "García" },
      "property": { "id": "...", "title": "Departamento en Miraflores" },
      "createdAt": "2026-06-01T00:00:00.000Z",
      "updatedAt": "2026-06-01T00:00:00.000Z"
    }
  ],
  "meta": {}
}
```

---

## 9. Google Calendar — Flujo por Asesor

Para que las visitas se sincronicen con Google Calendar, el asesor debe conectar su cuenta una vez:

### Endpoints OAuth

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/auth/google` | JWT requerido | Genera URL de autorización |
| `GET` | `/auth/google/callback` | Ninguna (callback de Google) | Procesa código, guarda token |

### Implementación del botón "Conectar Calendar"

```tsx
// src/features/visitas/components/ConnectCalendarButton.tsx
import { apiClient } from '@/lib/apiClient'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export function ConnectCalendarButton() {
  const handleConnect = async () => {
    try {
      // El backend retorna la URL de Google en json.data cuando se usa GET con Redirect
      // Alternativamente, podemos llamar a un endpoint que devuelva la URL sin redirigir
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    } catch (err) {
      console.error('Error al conectar Calendar:', err)
    }
  }

  return (
    <Button variant="outline" onClick={handleConnect}>
      <Calendar className="h-4 w-4 mr-2" />
      Conectar Google Calendar
    </Button>
  )
}
```

> [!IMPORTANT]
> El endpoint `GET /auth/google` hace una redirección 302 al flujo de Google. Para que funcione desde el frontend, la opción más simple es `window.location.href = ...` (navegación directa). No usar fetch/apiClient para este endpoint.

> [!NOTE]
> El backend `GOOGLE_REDIRECT_URI` apunta a `http://localhost:3000/auth/google/callback` (puerto del backend, no del frontend). Después del callback, el backend puede redirigir al frontend con un parámetro de éxito si se configura así.

---

## 10. Orden de Implementación Recomendado

```
1. Crear src/lib/apiClient.ts
2. Crear src/features/visitas/api/appointmentsApi.ts
3. Actualizar src/store/slices/visitsSlice.ts (async actions)
4. Actualizar src/features/visitas/types.ts (NewVisitForm + campos nuevos)
5. Actualizar src/features/visitas/hooks/useVisitas.ts (useEffect fetchVisits)
6. Actualizar NewVisitModal.tsx (campo location opcional)
7. Actualizar VisitasPage (loading/error states)
8. Probar con el backend corriendo: pnpm run start:dev (en CRM-inmobiliaria-backend)
```

> [!CAUTION]
> Antes de hacer `fetchVisits()` en el frontend, la DB debe estar corrida y migrada (`npx prisma migrate dev --name init`). Sin eso, el backend responderá 500. Puedes usar los mocks actuales hasta que la DB esté lista y hacer el swap limpiamente.
