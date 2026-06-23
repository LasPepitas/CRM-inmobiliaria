import type { DealStage } from './types'

export interface StageConfig {
  id: DealStage
  label: string
  color: string
}

export const STAGES: StageConfig[] = [
  { id: 'Nuevo', label: 'Nuevo', color: 'bg-blue-500' },
  { id: 'Contactado', label: 'Contactado', color: 'bg-cyan-500' },
  { id: 'Visita', label: 'Visita', color: 'bg-warning-500' },
  { id: 'Negociacion', label: 'Negociación', color: 'bg-orange-500' },
  { id: 'Cierre', label: 'Cierre', color: 'bg-success-500' },
]

export const stageBadgeVariant: Record<DealStage, 'default' | 'success' | 'warning' | 'error' | 'outline' | 'neutral' | 'secondary'> = {
  Nuevo: 'default',
  Contactado: 'secondary',
  Visita: 'warning',
  Negociacion: 'neutral',
  Cierre: 'success',
  Cancelado: 'error',
}

export function probabilityVariant(prob: number): 'success' | 'warning' | 'error' {
  if (prob >= 75) return 'success'
  if (prob >= 50) return 'warning'
  return 'error'
}
