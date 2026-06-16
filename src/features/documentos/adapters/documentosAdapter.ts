import type { DocumentResponse } from '../services/documentosService.types'
import type { Document } from '@/store/slices/documentsSlice'

export interface ApiDocument {
  id: string
  name: string
  fileUrl: string
  fileKey: string
  sizeBytes: number
  mimeType: string
  advisorId: string
  leadId: string | null
  type: Document['type']
  property_id: string
  status: Document['status']
  updated_at: string
  createdAt: Date
  updatedAt: Date
}

export function adaptDocument(apiData: DocumentResponse): ApiDocument {
  const extension = apiData.fileKey.split('.').pop()?.toLowerCase() || ''
  const inferredType: Document['type'] = extension.includes('pdf') ? 'Contrato'
    : extension.match(/png|jpg|jpeg|gif/) ? 'Título'
    : 'Contrato'

  return {
    id: apiData.id,
    name: apiData.name,
    fileUrl: apiData.fileUrl,
    fileKey: apiData.fileKey,
    sizeBytes: apiData.sizeBytes,
    mimeType: apiData.mimeType,
    advisorId: apiData.advisorId,
    leadId: apiData.leadId,
    type: inferredType,
    property_id: '',
    status: 'Borrador',
    updated_at: apiData.updatedAt.split('T')[0],
    createdAt: new Date(apiData.createdAt),
    updatedAt: new Date(apiData.updatedAt),
  }
}