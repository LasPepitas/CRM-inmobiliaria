import { useState, useMemo, useCallback } from 'react'
import { useStore } from '@/store'
import type { WizardData } from '../types'
import { WIZARD_DEFAULT } from '../types'
import type { ApiDocument } from '../adapters/documentosAdapter'

interface UseContractWizardProps {
  onContractGenerated: (contract: ApiDocument) => void
}

export function useContractWizard({ onContractGenerated }: UseContractWizardProps) {
  const { properties, leads, deals, addToast } = useStore()

  const [showWizardModal, setShowWizardModal] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>(WIZARD_DEFAULT)

  const [docRef] = useState(() => `DOC-${Date.now().toString().slice(-6)}`)
  const [currentDate] = useState(() => new Date().toLocaleDateString('es-AR'))

  const selectedLead = useMemo(() => leads.find(l => l.id === wizardData.lead_id), [leads, wizardData.lead_id])
  const selectedDeal = useMemo(() => deals.find(d => d.id === wizardData.deal_id), [deals, wizardData.deal_id])
  const selectedProp = useMemo(
    () => properties.find(p => p.id === wizardData.property_id) || properties.find(p => p.id === selectedDeal?.property_id),
    [properties, wizardData.property_id, selectedDeal]
  )
  const leadDeals = useMemo(() => deals.filter(d => d.lead_id === wizardData.lead_id), [deals, wizardData.lead_id])

  const handleFinishWizard = useCallback(() => {
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

    onContractGenerated(newDocument)
    addToast({ title: 'Contrato generado', description: 'El contrato se guardó en borradores', variant: 'success' })
    setShowWizardModal(false)
    setWizardStep(1)
    setWizardData(WIZARD_DEFAULT)
  }, [wizardData, selectedLead, selectedProp, onContractGenerated, addToast])

  const handlePrint = useCallback(() => window.print(), [])

  return {
    properties,
    leads,
    deals,
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
  }
}
