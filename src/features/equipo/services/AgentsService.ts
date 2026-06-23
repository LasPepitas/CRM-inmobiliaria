import { apiClient } from '@/lib/api-client'
import type { Agent } from '@/store/slices/agentsSlice'
import type { AgentApiResponse } from '../types'

export class AgentsService {
  static async getAll(): Promise<Agent[]> {
    const response = await apiClient.get<AgentApiResponse[]>('/users')
    return response.map((apiAgent) => ({
      id: apiAgent.id,
      name: `${apiAgent.firstName} ${apiAgent.lastName}`.trim(),
      role: apiAgent.role,
      email: apiAgent.email,
      active_deals: apiAgent.activeDeals || 0,
      closed_deals: apiAgent.closedDeals || 0,
      revenue: apiAgent.revenue || 0,
      avatar: apiAgent.avatarUrl || undefined,
      phone: apiAgent.phone || undefined,
      dni: apiAgent.dni || undefined,
    }))
  }

  static async create(agent: {
    email: string
    password?: string
    firstName: string
    lastName: string
    role: string
  }): Promise<Agent> {
    const response = await apiClient.post<AgentApiResponse>('/auth/register', agent)
    return {
      id: response.id,
      name: `${response.firstName} ${response.lastName}`.trim(),
      role: response.role,
      email: response.email,
      active_deals: 0,
      closed_deals: 0,
      revenue: 0,
      avatar: response.avatarUrl || undefined,
      phone: response.phone || undefined,
      dni: response.dni || undefined,
    }
  }
}
