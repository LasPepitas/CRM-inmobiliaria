import type { Agent } from '@/store/slices/agentsSlice'

export type AgentRole = Agent['role']

export interface AgentFormData {
  firstName: string
  lastName: string
  email: string
  password?: string
  phone: string
  dni: string
  role: string
}

export const AGENT_FORM_DEFAULT: AgentFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  dni: '',
  role: 'INTERNAL_ADVISOR',
}

export const AGENT_ROLES = [
  { value: 'INTERNAL_ADVISOR', label: 'Asesor Interno' },
  { value: 'EXTERNAL_ADVISOR', label: 'Asesor Externo' },
  { value: 'COMMERCIAL_MANAGER', label: 'Gerente Comercial' },
  { value: 'GENERAL_MANAGER', label: 'Gerente General' },
]

export interface AgentApiResponse {
  id: string
  firstName: string
  lastName: string
  role: string
  email: string
  activeDeals?: number
  closedDeals?: number
  revenue?: number
  avatarUrl?: string
  phone?: string
  dni?: string
}

