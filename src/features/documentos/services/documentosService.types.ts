export interface DocumentResponse {
  id: string
  name: string
  fileUrl: string
  fileKey: string
  sizeBytes: number
  mimeType: string
  advisorId: string
  leadId: string | null
  createdAt: string
  updatedAt: string
  lead: unknown
}

export interface UploadDocumentRequest {
  file: File
  name?: string
  leadId?: string
}