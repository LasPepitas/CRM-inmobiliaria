import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

instance.interceptors.response.use(
  (response) => response.data.data,
  (error) => Promise.reject(
    new Error(error.response?.data?.message ?? `Error ${error.response?.status ?? 'desconocido'}`)
  )
)

export const apiClient = {
  get:    <T>(endpoint: string, params?: Record<string, string>) =>
    instance.get(endpoint, { params }) as Promise<T>,
  post:   <T>(endpoint: string, body: unknown) =>
    instance.post(endpoint, body) as Promise<T>,
  patch:  <T>(endpoint: string, body: unknown) =>
    instance.patch(endpoint, body) as Promise<T>,
  delete: <T>(endpoint: string) =>
    instance.delete(endpoint) as Promise<T>,
}
