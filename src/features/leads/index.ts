// Public API del módulo leads — única fuente de importación externa
export { LeadsTable } from './components/LeadsTable'
export { LeadsDiscardedTable } from './components/LeadsDiscardedTable'
export { LeadFormModal } from './components/LeadFormModal'
export { LeadConvertModal } from './components/LeadConvertModal'
export { LeadDiscardModal } from './components/LeadDiscardModal'
export { LeadDetailModal } from './components/LeadDetailModal'
export { useLeads } from './hooks/useLeads'
export type { Lead, LeadStage, LeadSource, LeadStatus, LeadPaymentConfig } from './types'
