export type DealStage = 'Nuevo' | 'Contactado' | 'Visita' | 'Negociacion' | 'Cierre'
export type PipelineView = 'kanban' | 'table'

export type { Deal, DealNote } from '@/store/slices/dealsSlice'
