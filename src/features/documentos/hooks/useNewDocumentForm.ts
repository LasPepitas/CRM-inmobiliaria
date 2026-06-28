import { useState, useCallback } from 'react'
import { useStore } from '@/store'
import { uploadDocumentApi } from '../services/documentosService'
import type { NewDocForm } from '../types'
import { NEW_DOC_DEFAULT } from '../types'

interface UseNewDocumentFormProps {
  onUploadSuccess: () => Promise<void>
}

export function useNewDocumentForm({ onUploadSuccess }: UseNewDocumentFormProps) {
  const { properties, leads, addToast } = useStore()

  const [showNewDocModal, setShowNewDocModal] = useState(false)
  const [newDoc, setNewDoc] = useState<NewDocForm>(NEW_DOC_DEFAULT)
  const [isLoading, setIsLoading] = useState(false)

  const handleUploadDocument = useCallback(
    async (file: File, name: string, leadId?: string) => {
      try {
        setIsLoading(true)
        await uploadDocumentApi({ file, name, leadId })
        addToast({ title: 'Documento subido', description: `${name} fue cargado exitosamente`, variant: 'success' })
        await onUploadSuccess()
        return true
      } catch {
        addToast({ title: 'Error', description: 'No se pudo subir el documento', variant: 'error' })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, onUploadSuccess]
  )

  const handleAddDocument = useCallback(async () => {
    if (!newDoc.name) {
      addToast({ title: 'Error', description: 'Completá el nombre del documento', variant: 'error' })
      return
    }
    const fileInput = document.getElementById('doc-file-input') as HTMLInputElement
    if (fileInput?.files?.[0]) {
      const success = await handleUploadDocument(fileInput.files[0], newDoc.name, newDoc.lead_id)
      if (success) {
        setShowNewDocModal(false)
        setNewDoc(NEW_DOC_DEFAULT)
        fileInput.value = ''
      }
    } else {
      addToast({ title: 'Error', description: 'Seleccioná un archivo para subir', variant: 'error' })
    }
  }, [newDoc, handleUploadDocument, addToast])

  return {
    properties,
    leads,
    showNewDocModal,
    newDoc,
    isLoading,
    setShowNewDocModal,
    setNewDoc,
    handleAddDocument,
  }
}
