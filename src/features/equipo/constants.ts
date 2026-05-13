import type { AgentRole } from './types'

export const roleColors: Record<AgentRole, 'default' | 'warning' | 'secondary'> = {
  'Gerente': 'warning',
  'Asesor Senior': 'default',
  'Asesor': 'secondary',
}

export const roleGradients: Record<AgentRole, string> = {
  'Gerente': 'from-warning-500/20 to-warning-500/5',
  'Asesor Senior': 'from-primary/20 to-primary/5',
  'Asesor': 'from-secondary/20 to-secondary/5',
}
