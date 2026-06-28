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

export type Permission =
  | 'leads:read'
  | 'leads:create'
  | 'leads:delete'
  | 'docs:read'
  | 'docs:create'
  | 'docs:delete'
  | 'docs:sign'
  | 'equipo:read'
  | 'equipo:create'
  | 'equipo:delete'
  | 'reportes:read'
  | 'whatsapp:read'
  | 'integracion:read'
  | 'ajustes:read'

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  GENERAL_MANAGER: [
    'leads:read', 'leads:create', 'leads:delete',
    'docs:read', 'docs:create', 'docs:delete', 'docs:sign',
    'equipo:read', 'equipo:create', 'equipo:delete',
    'reportes:read', 'whatsapp:read', 'integracion:read', 'ajustes:read'
  ],
  COMMERCIAL_MANAGER: [
    'leads:read', 'leads:create', 'leads:delete',
    'docs:read', 'docs:create', 'docs:delete', 'docs:sign',
    'equipo:read', 'equipo:create', 'equipo:delete',
    'reportes:read', 'whatsapp:read', 'integracion:read', 'ajustes:read'
  ],
  SALES_LEADER: [
    'leads:read', 'leads:create', 'leads:delete',
    'docs:read', 'docs:create', 'docs:sign',
    'equipo:read',
    'reportes:read', 'whatsapp:read', 'integracion:read'
  ],
  MARKETING_LEADER: [
    'leads:read',
    'reportes:read'
  ],
  TEAM_LEADER: [
    'leads:read', 'leads:create',
    'docs:read', 'docs:create',
    'whatsapp:read', 'integracion:read'
  ],
  INTERNAL_ADVISOR: [
    'leads:read', 'leads:create',
    'docs:read', 'docs:create',
    'whatsapp:read'
  ],
  EXTERNAL_ADVISOR: [
    'leads:read',
    'docs:read'
  ]
}

export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  reportes: 'reportes:read',
  whatsapp: 'whatsapp:read',
  integracion: 'integracion:read',
  equipo: 'equipo:read',
  ajustes: 'ajustes:read',
}

