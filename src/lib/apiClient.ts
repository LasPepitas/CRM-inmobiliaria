// src/lib/apiClient.ts
// Cliente HTTP base para comunicación con el backend NestJS.
// Gestiona el JWT, la URL base y el envelope { data, meta } del ResponseInterceptor.

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

  // El backend siempre responde JSON — incluso en errores
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.message ?? `Error ${response.status}`)
  }

  // El ResponseInterceptor del backend envuelve en { data: T, meta: {...} }
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
