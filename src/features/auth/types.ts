export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: 'GENERAL_MANAGER' | 'COMMERCIAL_MANAGER' | 'INTERNAL_ADVISOR' | 'EXTERNAL_ADVISOR'
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName?: string
  role: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginResponse {
  access_token: string
  user: AuthUser
}

export interface RegisterResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
  updatedAt: string
}

export const ROUTE_ROLES: Record<string, string[]> = {
  reportes: ['GENERAL_MANAGER', 'COMMERCIAL_MANAGER', 'SALES_LEADER', 'MARKETING_LEADER'],
  whatsapp: ['GENERAL_MANAGER', 'COMMERCIAL_MANAGER', 'SALES_LEADER', 'TEAM_LEADER', 'INTERNAL_ADVISOR'],
  integracion: ['GENERAL_MANAGER', 'COMMERCIAL_MANAGER', 'SALES_LEADER', 'TEAM_LEADER'],
  equipo: ['GENERAL_MANAGER', 'COMMERCIAL_MANAGER', 'SALES_LEADER'],
  ajustes: ['GENERAL_MANAGER', 'COMMERCIAL_MANAGER'],
}
