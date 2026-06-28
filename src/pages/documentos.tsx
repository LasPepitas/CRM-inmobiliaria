import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileSignature } from 'lucide-react'
import {
  useDocumentosList,
  useNewDocumentForm,
  useContractWizard,
  ContractWizard,
  DocumentosFilters,
  DocumentosTable,
  NewDocumentModal,
  EditDocumentModal,
} from '@/features/documentos'
import { useStore } from '@/store'

export function DocumentosPage() {
  const { properties } = useStore()

  const {
    documents,
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
  } = useDocumentosList()

  const {
    showNewDocModal,
    newDoc,
    setShowNewDocModal,
    setNewDoc,
    handleAddDocument,
  } = useNewDocumentForm({
    onUploadSuccess: fetchDocuments,
  })

  const {
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
    handleFinishWizard,
    handlePrint,
    leads,
    deals,
  } = useContractWizard({
    onContractGenerated: (contract) => {
      setLocalDocs(prev => [...prev, contract])
    },
  })

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Documentos</h1>
          <p className="text-neutral-600 mt-1">
            {isLoading ? 'Cargando...' : `${documents.length} documentos en gestión`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          <Button variant="outline" onClick={() => setShowWizardModal(true)}>
            <FileSignature className="h-4 w-4 mr-2" /> Generar Contrato
          </Button>
          <Button id="upload-doc-btn" onClick={() => setShowNewDocModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> Subir Documento
          </Button>
        </div>
      </div>

      <Card className="print:hidden">
        <CardContent className="p-4 border-b border-outline-variant/50">
          <DocumentosFilters
            docSearch={docSearch}
            setDocSearch={setDocSearch}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            propertyFilter={propertyFilter}
            setPropertyFilter={setPropertyFilter}
            properties={properties}
            activeFilters={activeFilters}
            clearFilters={clearFilters}
            filteredCount={filteredDocuments.length}
          />
        </CardContent>
        <CardContent className="p-6 pt-0">
          <DocumentosTable
            documents={filteredDocuments}
            isLoading={isLoading}
            getPropertyTitle={getPropertyTitle}
            getLeadName={getLeadName}
            handleDownloadDocument={handleDownloadDocument}
            handleSendDocument={handleSendDocument}
            handleSignDocument={handleSignDocument}
            handleDeleteDocument={handleDeleteDocument}
            onEdit={setEditingDoc}
          />
        </CardContent>
      </Card>

      <NewDocumentModal
        open={showNewDocModal}
        onOpenChange={setShowNewDocModal}
        newDoc={newDoc}
        setNewDoc={setNewDoc}
        properties={properties}
        leads={leads}
        isLoading={isLoading}
        handleAddDocument={handleAddDocument}
      />

      <EditDocumentModal
        doc={editingDoc}
        properties={properties}
        leads={leads}
        onSave={handleEditDocument}
        onClose={() => setEditingDoc(null)}
      />

      <ContractWizard
        open={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        wizardStep={wizardStep}
        wizardData={wizardData}
        setWizardStep={setWizardStep}
        setWizardData={setWizardData}
        leads={leads}
        properties={properties}
        deals={deals}
        selectedLead={selectedLead}
        selectedDeal={selectedDeal}
        selectedProp={selectedProp}
        leadDeals={leadDeals}
        docRef={docRef}
        currentDate={currentDate}
        handlePrint={handlePrint}
        handleFinishWizard={handleFinishWizard}
      />
    </div>
  )
}
