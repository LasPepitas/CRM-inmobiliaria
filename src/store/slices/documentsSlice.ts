import type { StateCreator } from 'zustand'
import type { Store } from '@/store'

export interface Document {
  id: string
  type: 'Contrato' | 'Escritura' | 'Plano' | 'Título' | 'Avalúo'
  property_id: string
  lead_id?: string
  status: 'Borrador' | 'Enviado' | 'Firmado' | 'Expirado'
  updated_at: string
  name: string
}

const mockDocuments: Document[] = [
  { id: '1', type: 'Contrato', property_id: '1', lead_id: '1', status: 'Enviado', updated_at: '2024-04-14', name: 'Contrato de compraventa - María González' },
  { id: '2', type: 'Escritura', property_id: '7', lead_id: '15', status: 'Firmado', updated_at: '2024-04-15', name: 'Escritura Casa Martínez' },
  { id: '3', type: 'Plano', property_id: '3', status: 'Enviado', updated_at: '2024-04-12', name: 'Planos Oficina Catalinas' },
  { id: '4', type: 'Título', property_id: '4', status: 'Borrador', updated_at: '2024-04-10', name: 'Título Casa Nordelta' },
  { id: '5', type: 'Avalúo', property_id: '6', status: 'Firmado', updated_at: '2024-04-15', name: 'Avalúo Puerto Madero' },
  { id: '6', type: 'Contrato', property_id: '9', lead_id: '22', status: 'Borrador', updated_at: '2024-04-13', name: 'Contrato Casa Hudson' },
  { id: '7', type: 'Escritura', property_id: '2', status: 'Expirado', updated_at: '2024-03-15', name: 'Escritura Dept Recoleta' },
  { id: '8', type: 'Contrato', property_id: '15', lead_id: '19', status: 'Enviado', updated_at: '2024-04-14', name: 'Contrato Casa Pilar' },
  { id: '9', type: 'Plano', property_id: '10', status: 'Firmado', updated_at: '2024-04-12', name: 'Planos Oficina Dot' },
  { id: '10', type: 'Título', property_id: '17', status: 'Borrador', updated_at: '2024-04-11', name: 'Título Casa San Telmo' },
  { id: '11', type: 'Avalúo', property_id: '11', status: 'Enviado', updated_at: '2024-04-14', name: 'Avalúo Dept Almagro' },
  { id: '12', type: 'Contrato', property_id: '20', lead_id: '30', status: 'Enviado', updated_at: '2024-04-15', name: 'Contrato Casa Tigre' },
]

export interface DocumentsSlice {
  documents: Document[]
  addDocument: (doc: Omit<Document, 'id'>) => void
  updateDocument: (id: string, doc: Partial<Document>) => void
  deleteDocument: (id: string) => void
  sendDocument: (id: string) => void
}

export const createDocumentsSlice: StateCreator<Store, [], [], DocumentsSlice> = (set) => ({
  documents: mockDocuments,
  addDocument: (doc) => set((state) => ({
    documents: [...state.documents, { ...doc, id: String(state.documents.length + 1) }]
  })),
  updateDocument: (id, updates) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  })),
  sendDocument: (id) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, status: 'Enviado', updated_at: new Date().toISOString().split('T')[0] } : d)
  }))
})
