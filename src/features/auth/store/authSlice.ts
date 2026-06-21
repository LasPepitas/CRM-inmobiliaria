import { create } from 'zustand'
import type { AuthUser } from '../types'

interface AuthState {
  authUser: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuthUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}


export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isAuthenticated: false,
  isLoading: true,
  setAuthUser: (user) => set({ authUser: user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    localStorage.removeItem('auth_token')
    set({ authUser: null, isAuthenticated: false })
  },
}))