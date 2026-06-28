import { useState, useMemo, useCallback, useEffect } from 'react'
import { useStore } from '@/store'
import { getDocumentsApi, deleteDocumentApi } from '../services/documentosService'
import { adaptDocument } from '../adapters/documentosAdapter'
import type { ApiDocument } from '../adapters/documentosAdapter'
import type { NewDocForm } from '../types'

export function useDocumentosList() {
  const { properties, leads, addToast } = useStore()

  const [localDocs, setLocalDocs] = useState<ApiDocument[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('')
  const [docSearch, setDocSearch] = useState('')
  const [debouncedDocSearch, setDebouncedDocSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingDoc, setEditingDoc] = useState<ApiDocument | null>(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDocSearch(docSearch)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [docSearch])

  const allDocs = useMemo<ApiDocument[]>(() => (hasFetched ? localDocs : []), [hasFetched, localDocs])

  const filteredDocuments = useMemo(
    () =>
      allDocs.filter(doc => {
        const matchesType = !typeFilter || doc.type === typeFilter
        const matchesStatus = !statusFilter || doc.status === statusFilter
        const matchesProperty = !propertyFilter || doc.property_id === propertyFilter
        const matchesSearch =
          !debouncedDocSearch ||
          doc.name.toLowerCase().includes(debouncedDocSearch.toLowerCase()) ||
          (properties.find(p => p.id === doc.property_id)?.title || '').toLowerCase().includes(debouncedDocSearch.toLowerCase())
        return matchesType && matchesStatus && matchesProperty && matchesSearch
      }),
    [allDocs, typeFilter, statusFilter, propertyFilter, debouncedDocSearch, properties]
  )

  const activeFilters = [typeFilter, statusFilter, propertyFilter, docSearch].filter(Boolean).length

  const getPropertyTitle = useCallback((propertyId: string) => properties.find(p => p.id === propertyId)?.title || 'Propiedad', [properties])

  const getLeadName = useCallback(
    (leadId: string | null | undefined) => {
      const l = leadId ? leads.find(l => l.id === leadId) : null
      return l ? `${l.firstName} ${l.lastName}`.trim() : '-'
    },
    [leads]
  )

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      const apiDocs = await getDocumentsApi()
      const adapted = apiDocs.map(adaptDocument)
      setLocalDocs(adapted)
      setHasFetched(true)
    } catch {
      addToast({ title: 'Error', description: 'No se pudieron cargar los documentos', variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  const handleDeleteDocument = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true)
        await deleteDocumentApi(id)
        setLocalDocs(prev => prev.filter(d => d.id !== id))
        addToast({ title: 'Documento eliminado', description: 'Documento eliminado correctamente', variant: 'success' })
      } catch {
        addToast({ title: 'Error', description: 'No se pudo eliminar el documento', variant: 'error' })
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

  const handleDownloadDocument = useCallback(
    (id: string) => {
      const doc = localDocs.find(d => d.id === id)
      if (doc?.fileUrl) {
        window.open(doc.fileUrl, '_blank')
      } else {
        addToast({ title: 'Error', description: 'No se encontró la URL del archivo', variant: 'error' })
      }
    },
    [localDocs, addToast]
  )

  const handleSendDocument = useCallback(
    async (id: string) => {
      const doc = localDocs.find(d => d.id === id)
      setLocalDocs(prev =>
        prev.map(d =>
          d.id === id ? { ...d, status: 'Enviado' as const, updated_at: new Date().toISOString().split('T')[0] } : d
        )
      )
      addToast({ title: 'Documento enviado', description: `${doc?.name} fue marcado como enviado`, variant: 'success' })
    },
    [localDocs, addToast]
  )

  const handleSignDocument = useCallback(
    async (id: string) => {
      const doc = localDocs.find(d => d.id === id)
      setLocalDocs(prev =>
        prev.map(d =>
          d.id === id ? { ...d, status: 'Firmado' as const, updated_at: new Date().toISOString().split('T')[0] } : d
        )
      )
      addToast({ title: 'Documento firmado', description: `${doc?.name} fue firmado`, variant: 'success' })
    },
    [localDocs, addToast]
  )

  const clearFilters = useCallback(() => {
    setTypeFilter('')
    setStatusFilter('')
    setPropertyFilter('')
    setDocSearch('')
  }, [])

  const handleEditDocument = useCallback((updated: NewDocForm & { id: string }) => {
    setLocalDocs(prev =>
      prev.map(d =>
        d.id === updated.id
          ? { ...d, name: updated.name, type: updated.type, status: updated.status, property_id: updated.property_id, leadId: updated.lead_id || null, updated_at: new Date().toISOString().split('T')[0] }
          : d
      )
    )
    setEditingDoc(null)
    addToast({ title: 'Documento actualizado', description: `${updated.name} fue modificado correctamente`, variant: 'success' })
  }, [addToast])

  return {
    documents: allDocs,
    filteredDocuments,
    activeFilters,
    isLoading,
    typeFilter,
    statusFilter,
    propertyFilter,
    docSearch,
    editingDoc,
    setTypeFilter,
    setStatusFilter,
    setPropertyFilter,
    setDocSearch,
    clearFilters,
    getPropertyTitle,
    getLeadName,
    fetchDocuments,
    handleDeleteDocument,
    handleDownloadDocument,
    handleSendDocument,
    handleSignDocument,
    handleEditDocument,
    setEditingDoc,
    setLocalDocs,
  }
}
