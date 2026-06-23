import { useState, useCallback, useEffect } from 'react'
import { useAuthStore } from '../store/authSlice'
import { loginApi, registerApi, getProfileApi } from '../services/authService'
import type { LoginRequest, RegisterRequest } from '../types'
import { ROUTE_ROLES } from '../types'
import { resetStore } from '@/store'

export function useAuth() {
  const { authUser, isAuthenticated, isLoading, setAuthUser, setLoading, logout } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  // 1. Función para restaurar la sesión desde el root de la app (App.tsx)
  const checkSession = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const user = await getProfileApi()
      setAuthUser({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
      })
    } catch (err) {
      console.error('Error al validar sesión previa:', err)
      localStorage.removeItem('auth_token')
      setAuthUser(null)
    } finally {
      setLoading(false)
    }
  }, [setAuthUser, setLoading])

  // 2. Suscribirse al evento de logout ante errores 401
  useEffect(() => {
    const handleLogoutEvent = () => {
      logout()
      resetStore()
    }
    window.addEventListener('auth:logout', handleLogoutEvent)
    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent)
    }
  }, [logout])

  const handleLogin = useCallback(async (credentials: LoginRequest) => {
    try {
      setError(null)
      setLoading(true)
      const response = await loginApi(credentials)
      const token = response.access_token
      if (!token) throw new Error('No se recibió token de acceso')
      
      localStorage.setItem('auth_token', token)
      
      setAuthUser({
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        fullName: `${response.user.firstName} ${response.user.lastName}`.trim(),
        role: response.user.role,
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
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
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        fullName: `${response.firstName} ${response.lastName}`.trim(),
        role: response.role,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
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
    resetStore()
  }, [logout])

  const hasRoutePermission = useCallback((route: string) => {
    const userRole = authUser?.role
    const allowedRoles = ROUTE_ROLES[route]
    if (!allowedRoles) return true
    return !!(userRole && allowedRoles.includes(userRole))
  }, [authUser])

  return {
    authUser,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkSession,
    hasRoutePermission,
  }
}