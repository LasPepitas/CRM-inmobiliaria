import { useState, useMemo, useCallback, useEffect } from 'react'
import { useStore } from '@/store'
import { uploadDocumentApi, getDocumentsApi, deleteDocumentApi } from '../services/documentosService'
import { adaptDocument } from '../adapters/documentosAdapter'
import type { NewDocForm, WizardData } from '../types'
import { NEW_DOC_DEFAULT, WIZARD_DEFAULT } from '../types'
import type { ApiDocument } from '../adapters/documentosAdapter'

export function useDocumentos() {
  const { properties, leads, deals, addToast } = useStore()

  const [localDocs, setLocalDocs] = useState<ApiDocument[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [showNewDocModal, setShowNewDocModal] = useState(false)
  const [showWizardModal, setShowWizardModal] = useState(false)
  const [newDoc, setNewDoc] = useState<NewDocForm>(NEW_DOC_DEFAULT)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [docSearch, setDocSearch] = useState('')
  const [debouncedDocSearch, setDebouncedDocSearch] = useState('')
  const [wizardStep, setWizardStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>(WIZARD_DEFAULT)
  const [isLoading, setIsLoading] = useState(false)

  const [docRef] = useState(() => `DOC-${Date.now().toString().slice(-6)}`)
  const [currentDate] = useState(() => new Date().toLocaleDateString('es-AR'))

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDocSearch(docSearch)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [docSearch])

  const allDocs = useMemo<ApiDocument[]>(() => hasFetched ? localDocs : [], [hasFetched, localDocs])

  const filteredDocuments = useMemo(
    () => allDocs.filter(doc => {
      const matchesType = !typeFilter || doc.type === typeFilter
      const matchesStatus = !statusFilter || doc.status === statusFilter
      const matchesSearch = !debouncedDocSearch ||
        doc.name.toLowerCase().includes(debouncedDocSearch.toLowerCase()) ||
        (properties.find(p => p.id === doc.property_id)?.title || '').toLowerCase().includes(debouncedDocSearch.toLowerCase())
      return matchesType && matchesStatus && matchesSearch
    }),
    [allDocs, typeFilter, statusFilter, debouncedDocSearch, properties]
  )

  const activeFilters = [typeFilter, statusFilter, docSearch].filter(Boolean).length

  const getPropertyTitle = (propertyId: string) => properties.find(p => p.id === propertyId)?.title || 'Propiedad'
  const getLeadName = (leadId: string | null | undefined) => {
    const l = leadId ? leads.find(l => l.id === leadId) : null
    return l ? `${l.firstName} ${l.lastName}`.trim() : '-'
  }

  const selectedLead = useMemo(() => leads.find(l => l.id === wizardData.lead_id), [leads, wizardData.lead_id])
  const selectedDeal = useMemo(() => deals.find(d => d.id === wizardData.deal_id), [deals, wizardData.deal_id])
  const selectedProp = useMemo(
    () => properties.find(p => p.id === wizardData.property_id) || properties.find(p => p.id === selectedDeal?.property_id),
    [properties, wizardData.property_id, selectedDeal]
  )
  const leadDeals = useMemo(() => deals.filter(d => d.lead_id === wizardData.lead_id), [deals, wizardData.lead_id])

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

  const handleUploadDocument = async (file: File, name: string, leadId?: string) => {
    try {
      setIsLoading(true)
      await uploadDocumentApi({ file, name, leadId })
      addToast({ title: 'Documento subido', description: `${name} fue cargado exitosamente`, variant: 'success' })
      await fetchDocuments()
      return true
    } catch {
      addToast({ title: 'Error', description: 'No se pudo subir el documento', variant: 'error' })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDocument = async (id: string) => {
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
  }

  const handleDownloadDocument = (id: string) => {
    const doc = localDocs.find(d => d.id === id)
    if (doc?.fileUrl) {
      window.open(doc.fileUrl, '_blank')
    } else {
      addToast({ title: 'Error', description: 'No se encontró la URL del archivo', variant: 'error' })
    }
  }

  const handleSendDocument = async (id: string) => {
    const doc = localDocs.find(d => d.id === id)
    setLocalDocs(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'Enviado' as const, updated_at: new Date().toISOString().split('T')[0] } : d
    ))
    addToast({ title: 'Documento enviado', description: `${doc?.name} fue marcado como enviado`, variant: 'success' })
  }

  const handleSignDocument = async (id: string) => {
    const doc = localDocs.find(d => d.id === id)
    setLocalDocs(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'Firmado' as const, updated_at: new Date().toISOString().split('T')[0] } : d
    ))
    addToast({ title: 'Documento firmado', description: `${doc?.name} fue firmado`, variant: 'success' })
  }

  const handleFinishWizard = () => {
    const newDocument: ApiDocument = {
      id: `local-${Date.now()}`,
      name: `Contrato de ${wizardData.type === 'compra' ? 'Compraventa' : 'Alquiler'} - ${selectedLead ? `${selectedLead.firstName} ${selectedLead.lastName}`.trim() : 'Desconocido'}`,
      type: 'Contrato',
      property_id: selectedProp?.id || '',
      leadId: selectedLead?.id || null,
      status: 'Borrador',
      updated_at: new Date().toISOString().split('T')[0],
      fileUrl: '',
      fileKey: '',
      sizeBytes: 0,
      mimeType: '',
      advisorId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setLocalDocs(prev => [...prev, newDocument])
    addToast({ title: 'Contrato generado', description: 'El contrato se guardó en borradores', variant: 'success' })
    setShowWizardModal(false)
    setWizardStep(1)
    setWizardData(WIZARD_DEFAULT)
  }

  const handleAddDocument = async () => {
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
  }

  const handlePrint = () => window.print()
  const clearFilters = () => { setTypeFilter(''); setStatusFilter(''); setDocSearch('') }

  return {
    documents: allDocs,
    properties,
    leads,
    deals,
    filteredDocuments,
    activeFilters,
    isLoading,
    showNewDocModal,
    newDoc,
    setShowNewDocModal,
    setNewDoc,
    typeFilter,
    statusFilter,
    docSearch,
    setTypeFilter,
    setStatusFilter,
    setDocSearch,
    clearFilters,
    showWizardModal,
    wizardStep,
    wizardData,
    selectedLead,
    selectedDeal,
    selectedProp,
    leadDeals,
    docRef,
    currentDate,
    setShowWizardModal,
    setWizardStep,
    setWizardData,
    getPropertyTitle,
    getLeadName,
    handleAddDocument,
    handleDeleteDocument,
    handleDownloadDocument,
    handleSendDocument,
    handleSignDocument,
    handleFinishWizard,
    handlePrint,
    fetchDocuments,
    addToast,
  }
}