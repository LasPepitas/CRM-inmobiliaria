import { useState, useCallback, useEffect } from 'react'
import { useAuthStore } from '../store/authSlice'
import { loginApi, registerApi } from '../services/authService'
import type { LoginRequest, RegisterRequest } from '../types'

export function useAuth() {
  const { authUser, isAuthenticated, isLoading, setAuthUser, setLoading, logout } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(false)
  }, [setLoading])

  const handleLogin = useCallback(async (credentials: LoginRequest) => {
    try {
      setError(null)
      setLoading(true)
      const response = await loginApi(credentials)
      const token = response.data?.access_token
      if (!token) throw new Error('No se recibió token de acceso')
      localStorage.setItem('auth_token', token)
      setAuthUser({
        id: '',
        email: credentials.email,
        firstName: '',
        lastName: '',
        fullName: '',
        role: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
      return false
    } finally {
      setLoading(false)
    }
  }, [setAuthUser, setLoading])

  const handleRegister = useCallback(async (userData: RegisterRequest) => {
    try {
      setError(null)
      setLoading(true)
      const response = await registerApi(userData)
      setAuthUser({
        id: response.data?.id || '',
        email: response.data?.email || userData.email,
        firstName: response.data?.firstName || userData.firstName,
        lastName: response.data?.lastName || userData.lastName,
        fullName: `${response.data?.firstName || ''} ${response.data?.lastName || ''}`.trim(),
        role: response.data?.role || 'INTERNAL_ADVISOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar')
      return false
    } finally {
      setLoading(false)
    }
  }, [setAuthUser, setLoading])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  return {
    authUser,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
}