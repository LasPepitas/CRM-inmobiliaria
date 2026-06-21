import { apiClient } from '@/lib/api-client'
import type { DocumentResponse, UploadDocumentRequest } from './documentosService.types'

export async function uploadDocumentApi(data: UploadDocumentRequest): Promise<DocumentResponse> {
  const formData = new FormData()
  formData.append('file', data.file)
  if (data.name) formData.append('name', data.name)
  if (data.leadId) formData.append('leadId', data.leadId)

  return apiClient.post<DocumentResponse>('/documents/upload', formData)
}

export async function getDocumentsApi(): Promise<DocumentResponse[]> {
  return apiClient.get<DocumentResponse[]>('/documents')
}

export async function getDocumentByIdApi(id: string): Promise<DocumentResponse> {
  return apiClient.get<DocumentResponse>(`/documents/${id}`)
}

export async function deleteDocumentApi(id: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/documents/${id}`)
}