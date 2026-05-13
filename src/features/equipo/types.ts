import type { Agent } from '@/store/slices/agentsSlice'

export type AgentRole = Agent['role']

export interface AgentFormData {
  name: string
  email: string
  phone: string
  dni: string
  role: AgentRole
}

export const AGENT_FORM_DEFAULT: AgentFormData = {
  name: '',
  email: '',
  phone: '',
  dni: '',
  role: 'Asesor',
}

export const AGENT_ROLES: AgentRole[] = ['Gerente', 'Asesor Senior', 'Asesor']
