import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

instance.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.dispatchEvent(new Event('auth:logout'))
    }
    return Promise.reject(
      new Error(error.response?.data?.message ?? `Error ${error.response?.status ?? 'desconocido'}`)
    )
  }
)

export const apiClient = {
  get:    <T>(endpoint: string, params?: Record<string, string>) =>
    instance.get(endpoint, { params }) as Promise<T>,
  post:   <T>(endpoint: string, body: unknown, config?: import('axios').AxiosRequestConfig) =>
    instance.post(endpoint, body, config) as Promise<T>,
  patch:  <T>(endpoint: string, body: unknown, config?: import('axios').AxiosRequestConfig) =>
    instance.patch(endpoint, body, config) as Promise<T>,
  delete: <T>(endpoint: string) =>
    instance.delete(endpoint) as Promise<T>,
}
