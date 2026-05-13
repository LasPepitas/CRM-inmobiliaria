import { create } from 'zustand'

import type { LeadsSlice } from './slices/leadsSlice'
import { createLeadsSlice } from './slices/leadsSlice'
import type { PropertiesSlice } from './slices/propertiesSlice'
import { createPropertiesSlice } from './slices/propertiesSlice'
import type { DealsSlice } from './slices/dealsSlice'
import { createDealsSlice } from './slices/dealsSlice'
import type { VisitsSlice } from './slices/visitsSlice'
import { createVisitsSlice } from './slices/visitsSlice'
import type { AgentsSlice } from './slices/agentsSlice'
import { createAgentsSlice } from './slices/agentsSlice'
import type { DocumentsSlice } from './slices/documentsSlice'
import { createDocumentsSlice } from './slices/documentsSlice'
import type { TasksSlice } from './slices/tasksSlice'
import { createTasksSlice } from './slices/tasksSlice'
import type { WhatsAppSlice } from './slices/whatsappSlice'
import { createWhatsAppSlice } from './slices/whatsappSlice'
import type { UISlice } from './slices/uiSlice'
import { createUISlice } from './slices/uiSlice'

// Re-export all types so existing imports in components don't break
export * from './slices/leadsSlice'
export * from './slices/propertiesSlice'
export * from './slices/dealsSlice'
export * from './slices/visitsSlice'
export * from './slices/agentsSlice'
export * from './slices/documentsSlice'
export * from './slices/tasksSlice'
export * from './slices/whatsappSlice'
export * from './slices/uiSlice'

export type Store = LeadsSlice & 
  PropertiesSlice & 
  DealsSlice & 
  VisitsSlice & 
  AgentsSlice & 
  DocumentsSlice & 
  TasksSlice & 
  WhatsAppSlice & 
  UISlice

export const useStore = create<Store>((...a) => ({
  ...createLeadsSlice(...a),
  ...createPropertiesSlice(...a),
  ...createDealsSlice(...a),
  ...createVisitsSlice(...a),
  ...createAgentsSlice(...a),
  ...createDocumentsSlice(...a),
  ...createTasksSlice(...a),
  ...createWhatsAppSlice(...a),
  ...createUISlice(...a),
}))
