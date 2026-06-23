export type DealStage = 'Nuevo' | 'Contactado' | 'Visita' | 'Negociacion' | 'Cierre' | 'Cancelado'
export type PipelineView = 'kanban' | 'table'

export type { Deal, DealNote } from '@/store/slices/dealsSlice'
