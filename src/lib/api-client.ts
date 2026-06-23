import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => {
    // Si la respuesta exitosa viene envuelta en { success, data }, devolvemos data directamente.
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      return response.data.data
    }
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.dispatchEvent(new Event('auth:logout'))
    }
    const errorMessage = error.response?.data?.message ?? error.message
    return Promise.reject(new Error(errorMessage))
  }
)

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    instance.get(endpoint, { params }) as Promise<T>,
  post: <T>(endpoint: string, body?: unknown, config?: import('axios').AxiosRequestConfig) =>
    instance.post(endpoint, body, config) as Promise<T>,
  patch: <T>(endpoint: string, body?: unknown, config?: import('axios').AxiosRequestConfig) =>
    instance.patch(endpoint, body, config) as Promise<T>,
  put: <T>(endpoint: string, body?: unknown, config?: import('axios').AxiosRequestConfig) =>
    instance.put(endpoint, body, config) as Promise<T>,
  delete: <T>(endpoint: string) =>
    instance.delete(endpoint) as Promise<T>,
}