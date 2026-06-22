import { apiClient } from '@/lib/api-client'
import type { Agent } from '@/store/slices/agentsSlice'

interface AgentApiResponse {
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



export const agentsApi = {
  getAll: async (): Promise<Agent[]> => {
    const response = await apiClient.get<AgentApiResponse[]>('/users/advisors')
    const agentsArray = response || []

    return agentsArray.map((apiAgent) => ({
      id: apiAgent.id,
      name: `${apiAgent.firstName} ${apiAgent.lastName}`.trim(),
      role: apiAgent.role === 'INTERNAL_ADVISOR' || apiAgent.role === 'EXTERNAL_ADVISOR' ? 'Asesor' : 'Asesor Senior',
      email: apiAgent.email,
      active_deals: apiAgent.activeDeals || 0,
      closed_deals: apiAgent.closedDeals || 0,
      revenue: apiAgent.revenue || 0,
      avatar: apiAgent.avatarUrl || undefined,
      phone: apiAgent.phone || undefined,
      dni: apiAgent.dni || undefined,
    }))
  }
}
