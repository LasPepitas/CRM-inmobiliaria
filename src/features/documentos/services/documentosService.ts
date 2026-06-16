import { apiClient } from '@/lib/api-client'
import type { DocumentResponse, UploadDocumentRequest } from './documentosService.types'

export async function uploadDocumentApi(data: UploadDocumentRequest): Promise<DocumentResponse> {
  const formData = new FormData()
  formData.append('file', data.file)
  if (data.name) formData.append('name', data.name)
  if (data.leadId) formData.append('leadId', data.leadId)

  const response = await apiClient.post<{ success: boolean; data: DocumentResponse }>('/documents/upload', formData)
  return response.data.data
}

export async function getDocumentsApi(): Promise<DocumentResponse[]> {
  const response = await apiClient.get<{ success: boolean; data: DocumentResponse[] }>('/documents')
  return response.data.data || []
}

export async function getDocumentByIdApi(id: string): Promise<DocumentResponse> {
  const response = await apiClient.get<{ success: boolean; data: DocumentResponse }>(`/documents/${id}`)
  return response.data.data
}

export async function deleteDocumentApi(id: string): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{ success: boolean; message: string }>(`/documents/${id}`)
  return response.data
}