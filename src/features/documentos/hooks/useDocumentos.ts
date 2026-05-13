import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import type { NewDocForm, WizardData } from '../types'
import { NEW_DOC_DEFAULT, WIZARD_DEFAULT } from '../types'

export function useDocumentos() {
  const { documents, properties, leads, deals, addDocument, updateDocument, deleteDocument, sendDocument, addToast } = useStore()

  const [showNewDocModal, setShowNewDocModal] = useState(false)
  const [showWizardModal, setShowWizardModal] = useState(false)
  const [newDoc, setNewDoc] = useState<NewDocForm>(NEW_DOC_DEFAULT)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [docSearch, setDocSearch] = useState('')
  const [wizardStep, setWizardStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>(WIZARD_DEFAULT)

  // Stable lazy-init values
  const [docRef] = useState(() => `DOC-${Date.now().toString().slice(-6)}`)
  const [currentDate] = useState(() => new Date().toLocaleDateString('es-AR'))

  const filteredDocuments = useMemo(
    () => documents.filter(doc => {
      const matchesType = !typeFilter || doc.type === typeFilter
      const matchesStatus = !statusFilter || doc.status === statusFilter
      const matchesSearch = !docSearch ||
        doc.name.toLowerCase().includes(docSearch.toLowerCase()) ||
        (properties.find(p => p.id === doc.property_id)?.title || '').toLowerCase().includes(docSearch.toLowerCase())
      return matchesType && matchesStatus && matchesSearch
    }),
    [documents, typeFilter, statusFilter, docSearch, properties]
  )

  const activeFilters = [typeFilter, statusFilter, docSearch].filter(Boolean).length

  const getPropertyTitle = (propertyId: string) => properties.find(p => p.id === propertyId)?.title || 'Propiedad'
  const getLeadName = (leadId?: string) => leads.find(l => l.id === leadId)?.name || '-'

  // Wizard derived data
  const selectedLead = useMemo(() => leads.find(l => l.id === wizardData.lead_id), [leads, wizardData.lead_id])
  const selectedDeal = useMemo(() => deals.find(d => d.id === wizardData.deal_id), [deals, wizardData.deal_id])
  const selectedProp = useMemo(
    () => properties.find(p => p.id === wizardData.property_id) || properties.find(p => p.id === selectedDeal?.property_id),
    [properties, wizardData.property_id, selectedDeal]
  )
  const leadDeals = useMemo(() => deals.filter(d => d.lead_id === wizardData.lead_id), [deals, wizardData.lead_id])

  const handleAddDocument = () => {
    if (!newDoc.name) {
      addToast({ title: 'Error', description: 'Completá el nombre del documento', variant: 'error' })
      return
    }
    addDocument({ ...newDoc, updated_at: new Date().toISOString().split('T')[0] })
    addToast({ title: 'Documento creado', description: `${newDoc.name} fue agregado`, variant: 'success' })
    setShowNewDocModal(false)
    setNewDoc(NEW_DOC_DEFAULT)
  }

  const handleDeleteDocument = (id: string) => {
    const doc = documents.find(d => d.id === id)
    deleteDocument(id)
    addToast({ title: 'Documento eliminado', description: `${doc?.name} fue eliminado`, variant: 'success' })
  }

  const handleSendDocument = (id: string) => {
    const doc = documents.find(d => d.id === id)
    sendDocument(id)
    addToast({ title: 'Documento enviado', description: `${doc?.name} fue marcado como enviado`, variant: 'success' })
  }

  const handleSignDocument = (id: string) => {
    const doc = documents.find(d => d.id === id)
    updateDocument(id, { status: 'Firmado', updated_at: new Date().toISOString().split('T')[0] })
    addToast({ title: 'Documento firmado', description: `${doc?.name} fue firmado`, variant: 'success' })
  }

  const handleFinishWizard = () => {
    addDocument({
      name: `Contrato de ${wizardData.type === 'compra' ? 'Compraventa' : 'Alquiler'} - ${selectedLead?.name}`,
      type: 'Contrato',
      property_id: selectedProp?.id || '1',
      lead_id: selectedLead?.id,
      status: 'Borrador',
      updated_at: new Date().toISOString().split('T')[0],
    })
    addToast({ title: 'Contrato generado', description: 'El contrato se guardó en borradores', variant: 'success' })
    setShowWizardModal(false)
    setWizardStep(1)
    setWizardData(WIZARD_DEFAULT)
  }

  const handlePrint = () => window.print()

  const clearFilters = () => { setTypeFilter(''); setStatusFilter(''); setDocSearch('') }

  return {
    documents,
    properties,
    leads,
    deals,
    filteredDocuments,
    activeFilters,
    // doc form
    showNewDocModal,
    newDoc,
    setShowNewDocModal,
    setNewDoc,
    // filters
    typeFilter,
    statusFilter,
    docSearch,
    setTypeFilter,
    setStatusFilter,
    setDocSearch,
    clearFilters,
    // wizard
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
    // actions
    getPropertyTitle,
    getLeadName,
    handleAddDocument,
    handleDeleteDocument,
    handleSendDocument,
    handleSignDocument,
    handleFinishWizard,
    handlePrint,
    addToast,
  }
}
